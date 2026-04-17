#!/usr/bin/env python3
"""
patch_and_copy_stores.py

Reads existing state JSON files from src/locales/us/store_locator/,
adds a 'zip' field extracted from the address string,
and writes them to public/data/store_locator/ for browser access.

No API calls needed — ZIP is already embedded in the address text.
"""

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC_DIR  = ROOT / "src" / "locales" / "us" / "store_locator"
DEST_DIR = ROOT / "public" / "data" / "store_locator"

ZIP_RE = re.compile(r'\b(\d{5})(?:-\d{4})?\b')


def extract_zip(address: str) -> str:
    m = ZIP_RE.search(address)
    return m.group(1) if m else ''


def patch_and_copy():
    DEST_DIR.mkdir(parents=True, exist_ok=True)

    json_files = sorted(f for f in SRC_DIR.glob("*.json") if not f.name.startswith("._"))
    if not json_files:
        print(f"No JSON files found in {SRC_DIR}")
        return

    total_stores = 0
    for src_file in json_files:
        with open(src_file, "r", encoding="utf-8") as fh:
            data = json.load(fh)

        stores = data.get("stores", [])
        for store in stores:
            if "zip" not in store or not store["zip"]:
                store["zip"] = extract_zip(store.get("address", ""))

        data["stores"] = stores
        total_stores += len(stores)

        dest_file = DEST_DIR / src_file.name
        with open(dest_file, "w", encoding="utf-8") as fh:
            json.dump(data, fh, ensure_ascii=False, separators=(',', ':'))

        print(f"  ✓ {src_file.name} → {len(stores)} stores, patched zip fields")

    print(f"\nDone! {len(json_files)} files, {total_stores} stores → {DEST_DIR}")


if __name__ == "__main__":
    patch_and_copy()
