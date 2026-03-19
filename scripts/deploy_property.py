#!/usr/bin/env python3
from __future__ import annotations

import argparse
import os
import posixpath
import shutil
import stat
import subprocess
import sys
from pathlib import Path

import paramiko


REPO_ROOT = Path(__file__).resolve().parents[1]
DASHBOARD_DIR = REPO_ROOT / 'dashboard'
DIST_DIR = DASHBOARD_DIR / 'dist'
CREDENTIALS_FILE = REPO_ROOT / '.ftp-credentials'


def load_credentials(path: Path) -> dict[str, str]:
    if not path.exists():
        raise FileNotFoundError(f'Credentials file not found: {path}')

    result: dict[str, str] = {}
    for raw_line in path.read_text(encoding='utf-8').splitlines():
        line = raw_line.strip()
        if not line or line.startswith('#') or '=' not in line:
            continue
        key, value = line.split('=', 1)
        result[key.strip()] = value.strip()
    return result


def normalize_remote_dir(path: str) -> str:
    normalized = path.replace('\\', '/').strip()
    if not normalized:
        raise ValueError('Remote path is empty.')
    if not normalized.startswith('/'):
        normalized = f'/{normalized}'
    return normalized.rstrip('/')


def resolve_npm_command() -> list[str]:
    candidates = ['npm'] if os.name != 'nt' else ['npm.cmd', 'npm.exe', 'npm']
    for candidate in candidates:
        resolved = shutil.which(candidate)
        if resolved:
            return [resolved]
    raise FileNotFoundError('npm executable not found in PATH.')


def path_exists(sftp: paramiko.SFTPClient, remote_path: str) -> bool:
    try:
        sftp.stat(remote_path)
        return True
    except OSError:
        return False


def ensure_remote_dir(sftp: paramiko.SFTPClient, remote_dir: str) -> None:
    remote_dir = normalize_remote_dir(remote_dir)
    parts = remote_dir.split('/')
    current = ''
    for part in parts:
        if not part:
            continue
        current = f'{current}/{part}'
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
    for local_path in sorted(local_dist.rglob('*')):
        rel = local_path.relative_to(local_dist).as_posix()
        remote_path = posixpath.join(remote_root, rel)
        if local_path.is_dir():
            ensure_remote_dir(sftp, remote_path)
            continue
        ensure_remote_dir(sftp, posixpath.dirname(remote_path))
        sftp.put(str(local_path), remote_path)
        uploaded_files += 1
    return uploaded_files


def run_build(skip_build: bool, property_slug: str, base_path: str) -> None:
    if skip_build:
        return

    npm_command = resolve_npm_command()
    env = os.environ.copy()
    env['VITE_PROPERTY_SLUG'] = property_slug
    env['VITE_BASE_PATH'] = base_path
    subprocess.run([*npm_command, 'run', 'build'], cwd=DASHBOARD_DIR, check=True, env=env)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description='Build and deploy a property dashboard over SFTP.')
    parser.add_argument('--property-slug', required=True, help='Property slug to compile into the bundle runtime.')
    parser.add_argument('--base-path', help='Public base path, for example /YorkLiving/.')
    parser.add_argument('--target', action='append', default=[], help='Optional remote target dir. Can be passed multiple times.')
    parser.add_argument('--skip-build', action='store_true', help='Skip npm run build.')
    parser.add_argument('--dry-run', action='store_true', help='Print resolved actions without uploading.')
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    credentials = load_credentials(CREDENTIALS_FILE)
    host = credentials.get('FTP_HOST', '')
    username = credentials.get('FTP_USER', '')
    password = credentials.get('FTP_PASS', '')
    port = int(credentials.get('FTP_PORT', '22'))
    if not host or not username or not password:
        raise ValueError('FTP_HOST, FTP_USER and FTP_PASS must be set in .ftp-credentials.')

    property_slug = args.property_slug.strip().lower()
    base_path = args.base_path.strip() if args.base_path else f'/{property_slug}/'
    base_segment = base_path.strip().strip('/').split('/')[-1]
    targets = [normalize_remote_dir(target) for target in args.target] if args.target else [
        f'/Immobilien/{base_segment}',
        f'/MLP_MultiAccount_App/{base_segment}',
    ]

    if args.dry_run:
        print(f'[dry-run] property_slug={property_slug}')
        print(f'[dry-run] base_path={base_path}')
        print(f'[dry-run] host={host}:{port}')
        print(f'[dry-run] targets={targets}')
        return 0

    run_build(skip_build=args.skip_build, property_slug=property_slug, base_path=base_path)
    if not DIST_DIR.exists():
        raise FileNotFoundError(f'Build output not found: {DIST_DIR}')

    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(hostname=host, port=port, username=username, password=password, timeout=20)
    try:
        with ssh.open_sftp() as sftp:
            for target in targets:
                print(f'Deploying {property_slug} to {target} ...')
                ensure_remote_dir(sftp, target)
                remove_remote_tree(sftp, target)
                count = upload_dist(sftp, DIST_DIR, target)
                print(f'Uploaded {count} files to {target}')
    finally:
        ssh.close()

    print('Deploy finished.')
    return 0


if __name__ == '__main__':
    try:
        raise SystemExit(main())
    except Exception as exc:  # noqa: BLE001
        print(f'ERROR: {exc}', file=sys.stderr)
        raise SystemExit(1)
