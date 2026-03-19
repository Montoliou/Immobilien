#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
import shutil
from pathlib import Path

try:
    from pypdf import PdfReader  # type: ignore
except Exception:  # noqa: BLE001
    PdfReader = None

REPO_ROOT = Path(__file__).resolve().parents[2]
DASHBOARD_DIR = REPO_ROOT / 'dashboard'
PROPERTIES_DIR = DASHBOARD_DIR / 'properties'
TEMPLATE_SLUG = 'yorkliving'


def slugify(value: str) -> str:
    return re.sub(r'[^a-z0-9]+', '-', value.lower()).strip('-')


def extract_pdf_text(pdf_path: Path) -> str:
    if PdfReader is None:
        return 'PDF extraction unavailable: pypdf not installed.'
    reader = PdfReader(str(pdf_path))
    parts: list[str] = []
    for page in reader.pages:
        text = page.extract_text() or ''
        if text.strip():
            parts.append(text.strip())
    return '\n\n'.join(parts).strip()


def load_template_bundle(template_slug: str) -> dict:
    template_path = PROPERTIES_DIR / template_slug / 'bundle.json'
    return json.loads(template_path.read_text(encoding='utf-8'))


def copy_images(images_dir: Path, target_media_dir: Path) -> list[str]:
    target_media_dir.mkdir(parents=True, exist_ok=True)
    image_paths: list[str] = []
    for index, source in enumerate(sorted(images_dir.iterdir())):
        if not source.is_file() or source.suffix.lower() not in {'.png', '.jpg', '.jpeg', '.webp'}:
            continue
        target_name = f'image-{index + 1:02d}{source.suffix.lower()}'
        shutil.copy2(source, target_media_dir / target_name)
        image_paths.append(f'media/{target_name}')
    return image_paths


def main() -> int:
    parser = argparse.ArgumentParser(description='Create a draft property bundle from expose, images and optional overrides.')
    parser.add_argument('--slug', required=True)
    parser.add_argument('--title', required=True)
    parser.add_argument('--expose', required=True)
    parser.add_argument('--images-dir', required=True)
    parser.add_argument('--overrides')
    parser.add_argument('--template-slug', default=TEMPLATE_SLUG)
    args = parser.parse_args()

    slug = slugify(args.slug)
    property_dir = PROPERTIES_DIR / slug
    source_dir = property_dir / 'source'
    media_dir = property_dir / 'media'
    property_dir.mkdir(parents=True, exist_ok=True)
    source_dir.mkdir(parents=True, exist_ok=True)

    expose_path = Path(args.expose).resolve()
    images_dir = Path(args.images_dir).resolve()
    overrides_path = Path(args.overrides).resolve() if args.overrides else None

    if not expose_path.exists():
        raise FileNotFoundError(f'Expose not found: {expose_path}')
    if not images_dir.exists() or not images_dir.is_dir():
        raise FileNotFoundError(f'Images directory not found: {images_dir}')

    bundle = load_template_bundle(args.template_slug)
    bundle['identity']['slug'] = slug
    bundle['identity']['title'] = args.title.strip()
    bundle['identity']['subtitle'] = 'Draft aus Exposé-Import'
    bundle['contact'] = {
        'consultationEmail': '',
        'consultationPhoneLabel': '',
        'consultationPhoneLink': '',
        'bookingUrl': '',
    }
    bundle['compliance']['reviewStatus'] = 'draft'
    bundle['compliance']['warnings'] = [
        'Draft automatisch aus Exposé/Medien erzeugt. Förder- und AfA-Logik vor Freigabe fachlich prüfen.',
        'Texte, Bilderzuordnung und Finanzannahmen manuell validieren.',
    ]
    bundle['compliance']['extractionConfidence'] = {
        'identity': 'medium',
        'content': 'medium',
        'media': 'medium',
        'financeModel': 'low',
    }

    copied_images = copy_images(images_dir, media_dir)
    if copied_images:
        bundle['content']['hero']['backgroundImage'] = copied_images[0]
        bundle['media']['heroSlides'] = [
            {
                'image': image_path,
                'alt': f'{args.title.strip()} Bild {index + 1}',
                'caption': f'Projektbild {index + 1}',
            }
            for index, image_path in enumerate(copied_images[:4])
        ]
        bundle['media']['gallery'] = [
            {
                'image': image_path,
                'alt': f'{args.title.strip()} Galerie {index + 1}',
                'caption': f'Galeriebild {index + 1}',
            }
            for index, image_path in enumerate(copied_images)
        ]

    for preset in bundle.get('presets', []):
        preset['propertySlug'] = slug

    extracted = {
        'slug': slug,
        'title': args.title.strip(),
        'exposePath': str(expose_path),
        'extractedText': extract_pdf_text(expose_path),
        'detectedImages': copied_images,
        'notes': [
            'Finanzlogik, Förderprofil und AfA-Profil wurden aus dem Template übernommen und müssen manuell validiert werden.',
            'Dieses Draft-Bundle ist bewusst nicht freigegeben.',
        ],
    }
    overrides = {}
    if overrides_path:
        overrides = json.loads(overrides_path.read_text(encoding='utf-8'))

    (property_dir / 'bundle.json').write_text(json.dumps(bundle, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    (source_dir / 'extracted.json').write_text(json.dumps(extracted, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    (source_dir / 'overrides.json').write_text(json.dumps(overrides, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    (property_dir / 'review.md').write_text(
        f"# Review für {args.title.strip()}\n\n"
        "Status: draft\n\n"
        "## Pflichtprüfungen\n"
        "- Förderprofil fachlich validieren\n"
        "- AfA-/Sonder-AfA-Typ fachlich validieren\n"
        "- Wohneinheiten, Preise und Größen gegen Exposé prüfen\n"
        "- Hero-/Galeriebilder manuell kuratieren\n"
        "- Kontakt- und Standortdaten ergänzen\n",
        encoding='utf-8',
    )

    print(f'Created draft property at {property_dir}')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
