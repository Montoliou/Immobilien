#!/usr/bin/env python3
from __future__ import annotations

import argparse
import posixpath
import stat
import subprocess
import sys
from pathlib import Path

import paramiko


REPO_ROOT = Path(__file__).resolve().parents[1]
DASHBOARD_DIR = REPO_ROOT / "dashboard"
DIST_DIR = DASHBOARD_DIR / "dist"
CREDENTIALS_FILE = REPO_ROOT / ".ftp-credentials"
DEFAULT_TARGETS = ["/Immobilien/YorkLiving", "/MLP_MultiAccount_App/YorkLiving"]


def load_credentials(path: Path) -> dict[str, str]:
    if not path.exists():
        raise FileNotFoundError(f"Credentials file not found: {path}")

    result: dict[str, str] = {}
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        result[key.strip()] = value.strip()
    return result


def normalize_remote_dir(path: str) -> str:
    normalized = path.replace("\\", "/").strip()
    if not normalized:
        raise ValueError("Remote path is empty.")
    if not normalized.startswith("/"):
        normalized = f"/{normalized}"
    return normalized.rstrip("/")


def resolve_targets(credentials: dict[str, str], cli_targets: list[str]) -> list[str]:
    if cli_targets:
        raw_targets = cli_targets
    else:
        env_targets = credentials.get("FTP_TARGET_DIRS", "").strip()
        if env_targets:
            raw_targets = [part.strip() for part in env_targets.replace(",", ";").split(";") if part.strip()]
        else:
            raw_targets = []
            raw_target_dir = credentials.get("FTP_TARGET_DIR", "").strip()
            if raw_target_dir:
                raw_targets.append(raw_target_dir)
            raw_targets.extend(DEFAULT_TARGETS)

    normalized_targets: list[str] = []
    seen: set[str] = set()
    for target in raw_targets:
        path = normalize_remote_dir(target)
        if not path.endswith("/YorkLiving"):
            path = f"{path}/YorkLiving"
        if path in seen:
            continue
        seen.add(path)
        normalized_targets.append(path)
    return normalized_targets


def run_build(skip_build: bool) -> None:
    if skip_build:
        return
    subprocess.run(["npm", "run", "build"], cwd=DASHBOARD_DIR, check=True)


def path_exists(sftp: paramiko.SFTPClient, remote_path: str) -> bool:
    try:
        sftp.stat(remote_path)
        return True
    except OSError:
        return False


def ensure_remote_dir(sftp: paramiko.SFTPClient, remote_dir: str) -> None:
    remote_dir = normalize_remote_dir(remote_dir)
    parts = remote_dir.split("/")
    current = ""
    for part in parts:
        if not part:
            continue
        current = f"{current}/{part}"
        if path_exists(sftp, current):
            continue
        sftp.mkdir(current)


def remove_remote_tree(sftp: paramiko.SFTPClient, remote_path: str) -> None:
    try:
        attrs = sftp.listdir_attr(remote_path)
    except OSError:
        return

    for attr in attrs:
        child = posixpath.join(remote_path, attr.filename)
        if stat.S_ISDIR(attr.st_mode):
            remove_remote_tree(sftp, child)
            sftp.rmdir(child)
        else:
            sftp.remove(child)


def upload_dist(sftp: paramiko.SFTPClient, local_dist: Path, remote_root: str) -> int:
    uploaded_files = 0
    ensure_remote_dir(sftp, remote_root)

    for local_path in sorted(local_dist.rglob("*")):
        rel = local_path.relative_to(local_dist).as_posix()
        remote_path = posixpath.join(remote_root, rel)
        if local_path.is_dir():
            ensure_remote_dir(sftp, remote_path)
            continue
        ensure_remote_dir(sftp, posixpath.dirname(remote_path))
        sftp.put(str(local_path), remote_path)
        uploaded_files += 1
    return uploaded_files


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Build and deploy dashboard/dist to YorkLiving target folders over SFTP."
    )
    parser.add_argument(
        "--target",
        action="append",
        default=[],
        help="Optional remote target dir (can be passed multiple times).",
    )
    parser.add_argument("--skip-build", action="store_true", help="Skip `npm run build`.")
    parser.add_argument("--dry-run", action="store_true", help="Print actions only.")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    credentials = load_credentials(CREDENTIALS_FILE)

    host = credentials.get("FTP_HOST", "")
    username = credentials.get("FTP_USER", "")
    password = credentials.get("FTP_PASS", "")
    port = int(credentials.get("FTP_PORT", "22"))
    if not host or not username or not password:
        raise ValueError("FTP_HOST, FTP_USER and FTP_PASS must be set in .ftp-credentials.")

    targets = resolve_targets(credentials, args.target)
    if not targets:
        raise ValueError("No deployment targets resolved.")

    run_build(skip_build=args.skip_build)
    if not DIST_DIR.exists():
        raise FileNotFoundError(f"Build output not found: {DIST_DIR}")

    if args.dry_run:
        print(f"[dry-run] host={host}:{port}")
        print(f"[dry-run] targets={targets}")
        print(f"[dry-run] dist={DIST_DIR}")
        return 0

    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(hostname=host, port=port, username=username, password=password, timeout=20)

    try:
        with ssh.open_sftp() as sftp:
            for target in targets:
                print(f"Deploying to {target} ...")
                ensure_remote_dir(sftp, target)
                remove_remote_tree(sftp, target)
                count = upload_dist(sftp, DIST_DIR, target)
                print(f"Uploaded {count} files to {target}")
    finally:
        ssh.close()

    print("Deploy finished.")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:  # noqa: BLE001
        print(f"ERROR: {exc}", file=sys.stderr)
        raise SystemExit(1)
