#!/usr/bin/env python3
"""Download Drive costume photos into public/assets/images/shop and compress for web."""

from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "public" / "assets" / "images" / "shop"
RAW_DIR = Path("/tmp/zvezda-shop-raw")

FOLDERS = [
    ("rosewood-heirloom", "1IYYtMxnkjspTYuBp_uadp78y0iiSOGTo"),
    ("allure-slit", "1a-EhBFd1I3Bl63ehDorPI12vkVSsPeb1"),
    ("blooming-rosalia-3d-gown", "1Kyqlly9YVfl7cAdFl3NQpAkOkr2LL2JA"),
    ("blush-elan", "1bqmRSZPidPJxSINepBghXOVapGaC0J2b"),
    ("blush-mirage", "1F15Gk_m6YLhhUZZFZ_MO2YOgGciUPSG0"),
    ("blush-noir-2-piece-set", "1zpygk9FQ2uvkeNDshl01PBsLNauF356L"),
    ("butterfly-inspired", "1tVAj4fUL36Uw-AMmfVmDVqtuz4PNsX7D"),
    ("carmine-ascend", "1Pg2W5iYiLzBYHYRk6t0NIFbasxc6XdfA"),
    ("crimson-petal-serenade", "1Qeyhorc9tSv1VQP-Vi_X9HMD-zIZ5hGn"),
    ("daughters-of-spring-pink", "1iiqtU16HpKZKwhKWDYa5gyUSuL2KwZYq"),
    ("daughters-of-spring-green", "13ILzotG9B_z3noB8WeiOmJeAYcf-qLX8"),
    ("denim-dress", "1WcuXQNY_pXh_A7RsSRkTOgYf4VCsb-mC"),
    ("eclipse-royale", "1sG3AqSEXzJg_i-t8mdXC8zihrN-JUudP"),
    ("fire-and-ice", "1DX7pfOWXqWLUcLSgdNlqyCDkXEs_aD96"),
    ("green-pearl-dress", "1sQ8O6E9tRNjqU0qsGZ3WzlbV46QELULu"),
    ("ivory-eclipse", "1zElQliWAIPCkKxP-wHf8b0411oBRUXmN"),
    ("jardin-elegance-dress", "13Fg-cKE2wShT8MMylosVDTocz3ByPFpN"),
    ("molten-muse", "1UNlfOrVy6Gv8-_EkZlQS3M9K2zYB31-3"),
    ("olive-tiered-zephyr-mini-dress", "1PNWuYCwSf79QZ5YJMtBSRDXDoqmz55qN"),
    ("pearl-tailored-set", "1rlxXFEr3fhmEndhfugpNaZGu6v2_FwJh"),
    ("petal-dress", "1HIqxq5rn5hUJs0_NFiCOmmATM4n5h_Kc"),
    ("rosa-imperiale", "15efQ4TMsDu25aMBUXHLL2LvEZVu75EGA"),
    ("rosalind-jacket-blush-column-jumpsuit", "1Cid66Ax37yHsYpuFD__sAZs4pJxJpTTi"),
    ("set-25", "17J-xmpwOVmDqS3DEigPrUQdopH5iEyLD"),
    ("set-26", "1fyEQPxcqc3Fwc3Kuh6BlxpMPvh8weK3a"),
    ("starlit-halter-gown", "14O1U90p05Xe6YhWxxWyU8xRzNk38S_ob"),
    ("the-scarlett-heiress-dress", "19ifplOiJWV7JkumTgZ1fE16A4Naof01q"),
    ("velvet-blooms-dress", "1Ae4nRnt5kRoa5Wt1pyicgayaS9B18TPH"),
    ("verdant-whisper-gown", "1OXWRWfqxN3jQQEy7dSQj8fCjLgqjNIiv"),
    ("zeenat", "1AWRmc7fHS3hEPwSpE7bGBoSEflewqICs"),
]

IMAGE_EXT = {".jpg", ".jpeg", ".png", ".webp", ".heic"}


def ensure_deps() -> None:
    try:
        import gdown  # noqa: F401
        from PIL import Image  # noqa: F401
    except ImportError:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "gdown", "pillow", "-q"])


def fetch_folder_html(folder_id: str) -> str:
    cached = Path(f"/tmp/zv-{folder_id}.html")
    if cached.exists() and cached.stat().st_size > 50_000:
        return cached.read_text(encoding="utf-8", errors="replace")
    subprocess.check_call(
        [
            "curl",
            "-sL",
            "-A",
            "Mozilla/5.0",
            f"https://drive.google.com/drive/folders/{folder_id}",
            "-o",
            str(cached),
        ]
    )
    return cached.read_text(encoding="utf-8", errors="replace")


def list_drive_images(folder_id: str) -> list[tuple[str, str]]:
    html = fetch_folder_html(folder_id)
    items: list[tuple[str, str]] = []
    seen: set[str] = set()
    for match in re.finditer(r'aria-label="([^"]+) Image Shared"', html):
        name = match.group(1).strip()
        chunk = html[max(0, match.start() - 80) : match.end() + 900]
        ids = re.findall(r'data-id="([A-Za-z0-9_-]{20,})"', chunk)
        if not ids or name in seen:
            continue
        seen.add(name)
        items.append((name, ids[0]))
    return items


def download_file(file_id: str, dest: Path) -> None:
    import gdown

    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.exists() and dest.stat().st_size > 20_000:
        return
    gdown.download(id=file_id, output=str(dest), quiet=False, use_cookies=False)


def compress_image(src: Path, dest: Path) -> None:
    from PIL import Image

    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.exists() and dest.stat().st_size > 20_000:
        return
    with Image.open(src) as img:
        img = img.convert("RGB")
        img.thumbnail((1800, 2400), Image.Resampling.LANCZOS)
        img.save(dest, "JPEG", quality=84, optimize=True, progressive=True)


def main() -> None:
    ensure_deps()
    RAW_DIR.mkdir(parents=True, exist_ok=True)
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    failed: list[str] = []
    summary: dict[str, list[str]] = {}

    for slug, folder_id in FOLDERS:
        try:
            files = list_drive_images(folder_id)
            if not files:
                raise RuntimeError("no files listed")
            names: list[str] = []
            raw_dir = RAW_DIR / slug
            out_dir = OUT_DIR / slug
            print(f"\n[{slug}] {len(files)} files")
            for name, file_id in files:
                raw_path = raw_dir / name
                download_file(file_id, raw_path)
                out_name = f"{Path(name).stem}.jpg"
                compress_image(raw_path, out_dir / out_name)
                names.append(out_name)
            summary[slug] = names
            print(f"[ok] {slug}: {', '.join(names)}")
        except Exception as exc:
            failed.append(slug)
            print(f"[fail] {slug}: {exc}")

    print("\n=== SUMMARY ===")
    for slug, names in summary.items():
        print(f"{slug}: {len(names)} -> {', '.join(names)}")
    if failed:
        print("\nFAILED:", ", ".join(failed))
        sys.exit(1)


if __name__ == "__main__":
    main()
