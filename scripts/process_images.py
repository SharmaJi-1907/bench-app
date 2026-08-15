#!/usr/bin/env python3
"""Normalize raw component photos into consistent app-ready images.

Reads every image in assets/raw_images/, and for each one:
  - trims away a uniform border (most product shots sit on a plain背景)
  - flattens transparency onto white
  - letterboxes onto a square white canvas so nothing is cropped away
  - resizes to a fixed edge length and saves optimized JPEG

Result goes to assets/processed_images/<id>.jpg — same base name as the raw
file, so the app can map item id -> image by name alone.

Usage:
    python3 scripts/process_images.py [--size 800] [--quality 82] [--force]
"""
import argparse
import sys
from pathlib import Path

from PIL import Image, ImageChops

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "assets" / "raw_images"
OUT = ROOT / "assets" / "processed_images"
EXTS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp"}

# A border is only trimmed if it is this uniform; guards against cropping
# into photos that genuinely fill the frame.
TRIM_TOLERANCE = 12
# Never trim away more than this fraction of either dimension.
MAX_TRIM_RATIO = 0.45


def flatten_to_white(im):
    """Composite any alpha channel onto a white background."""
    if im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info):
        im = im.convert("RGBA")
        bg = Image.new("RGBA", im.size, (255, 255, 255, 255))
        im = Image.alpha_composite(bg, im)
    return im.convert("RGB")


def trim_uniform_border(im):
    """Crop a uniform surrounding border, if there is one worth cropping."""
    # Reference color taken from the corners, which are background in a
    # typical product shot.
    w, h = im.size
    corners = [im.getpixel((0, 0)), im.getpixel((w - 1, 0)),
               im.getpixel((0, h - 1)), im.getpixel((w - 1, h - 1))]
    ref = tuple(sum(c[i] for c in corners) // 4 for i in range(3))

    bg = Image.new("RGB", im.size, ref)
    diff = ImageChops.difference(im, bg).convert("L")
    # Anything within tolerance of the reference counts as background.
    mask = diff.point(lambda p: 255 if p > TRIM_TOLERANCE else 0)
    box = mask.getbbox()
    if not box:
        return im

    left, upper, right, lower = box
    if (left > w * MAX_TRIM_RATIO or upper > h * MAX_TRIM_RATIO
            or right < w * (1 - MAX_TRIM_RATIO)
            or lower < h * (1 - MAX_TRIM_RATIO)):
        return im  # suspiciously aggressive crop, leave the image alone

    pad = max(2, int(min(w, h) * 0.02))
    return im.crop((max(0, left - pad), max(0, upper - pad),
                    min(w, right + pad), min(h, lower + pad)))


def square_on_white(im, size):
    """Fit the image inside a square white canvas without cropping it."""
    im.thumbnail((size, size), Image.LANCZOS)
    canvas = Image.new("RGB", (size, size), (255, 255, 255))
    canvas.paste(im, ((size - im.width) // 2, (size - im.height) // 2))
    return canvas


def process(src, size):
    with Image.open(src) as im:
        im.load()
        im = flatten_to_white(im)
        im = trim_uniform_border(im)
        return square_on_white(im, size)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--size", type=int, default=800,
                    help="output edge length in px (default 800)")
    ap.add_argument("--quality", type=int, default=82,
                    help="JPEG quality (default 82)")
    ap.add_argument("--force", action="store_true",
                    help="reprocess images that already have output")
    args = ap.parse_args()

    if not RAW.is_dir():
        sys.exit(f"no raw image directory at {RAW}")
    OUT.mkdir(parents=True, exist_ok=True)

    sources = sorted(p for p in RAW.iterdir() if p.suffix.lower() in EXTS)
    if not sources:
        sys.exit(f"no images found in {RAW}")

    done = skipped = failed = 0
    for src in sources:
        dest = OUT / f"{src.stem}.jpg"
        if dest.exists() and not args.force:
            skipped += 1
            continue
        try:
            out = process(src, args.size)
            out.save(dest, "JPEG", quality=args.quality, optimize=True)
            done += 1
        except Exception as e:
            failed += 1
            print(f"  FAILED {src.name}: {e}")

    total_kb = sum(p.stat().st_size for p in OUT.glob("*.jpg")) // 1024
    print(f"processed {done}, skipped {skipped}, failed {failed}")
    print(f"{len(list(OUT.glob('*.jpg')))} images in {OUT} ({total_kb} KB total)")


if __name__ == "__main__":
    main()
