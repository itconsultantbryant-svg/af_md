#!/usr/bin/env python3
"""Remove dark navy background from afrimind_logo.png and save transparent PNG."""
from __future__ import annotations

import math
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "assets" / "afrimind_logo.png"
DESTS = [SRC, ROOT / "public" / "afrimind_logo.png"]
BG = (5, 17, 41)  # ~#051129


def main() -> None:
    img = Image.open(SRC).convert("RGBA")
    pixels = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if a == 0:
                continue
            dr, dg, db = r - BG[0], g - BG[1], b - BG[2]
            dist = math.sqrt(dr * dr + dg * dg + db * db)
            brightness = (r + g + b) / 3
            if dist < 35 or (brightness < 40 and b > r and b > g):
                alpha = 0 if dist < 22 else int(255 * min(1, (dist - 22) / 13))
                pixels[x, y] = (r, g, b, alpha)
            elif dist < 50 and brightness < 55:
                alpha = int(a * min(1, (dist - 35) / 15))
                pixels[x, y] = (r, g, b, alpha)
    for dest in DESTS:
        img.save(dest, "PNG")
    print(f"Transparent logo written to {len(DESTS)} locations ({w}x{h})")


if __name__ == "__main__":
    main()
