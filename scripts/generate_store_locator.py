#!/usr/bin/env python3
"""
generate_store_locator.py

Reads Zambos_USA_Store_Locator.csv, geocodes each address via the
Google Maps Geocoding API, and splits results by US state into
individual JSON files under src/locales/us/store_locator/

This improves performance by allowing lazy loading of stores by state
instead of loading all 7K+ stores at once.

Requirements:
    pip install requests python-dotenv

.env (project root):
    GOOGLE_MAPS_API_KEY=your_key_here
"""

import csv
import json
import os
import re
import sys
import time
from pathlib import Path
from collections import defaultdict

import requests
from dotenv import load_dotenv

# ── Paths ─────────────────────────────────────────────────────────────────────
ROOT = Path(__file__).resolve().parent.parent
CSV_PATH = ROOT / "Zambos_USA_Store_Locator.csv"
STORE_LOCATOR_DIR = ROOT / "public" / "data" / "store_locator"
ENV_PATH = ROOT / ".env"

# ── Config ────────────────────────────────────────────────────────────────────
GEOCODE_URL = "https://maps.googleapis.com/maps/api/geocode/json"
REQUEST_DELAY = 0.05   # seconds between API calls (avoid rate-limit)
MAX_RETRIES = 3

# US State name to code mapping for file naming
STATE_NAMES = {
    'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR',
    'california': 'CA', 'colorado': 'CO', 'connecticut': 'CT', 'delaware': 'DE',
    'florida': 'FL', 'georgia': 'GA', 'hawaii': 'HI', 'idaho': 'ID',
    'illinois': 'IL', 'indiana': 'IN', 'iowa': 'IA', 'kansas': 'KS',
    'kentucky': 'KY', 'louisiana': 'LA', 'maine': 'ME', 'maryland': 'MD',
    'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN', 'mississippi': 'MS',
    'missouri': 'MO', 'montana': 'MT', 'nebraska': 'NE', 'nevada': 'NV',
    'new hampshire': 'NH', 'new jersey': 'NJ', 'new mexico': 'NM', 'new york': 'NY',
    'north carolina': 'NC', 'north dakota': 'ND', 'ohio': 'OH', 'oklahoma': 'OK',
    'oregon': 'OR', 'pennsylvania': 'PA', 'rhode island': 'RI', 'south carolina': 'SC',
    'south dakota': 'SD', 'tennessee': 'TN', 'texas': 'TX', 'utah': 'UT',
    'vermont': 'VT', 'virginia': 'VA', 'washington': 'WA', 'west virginia': 'WV',
    'wisconsin': 'WI', 'wyoming': 'WY', 'district of columbia': 'DC',
    'puerto rico': 'PR', 'guam': 'GU', 'virgin islands': 'VI'
}


def load_api_key() -> str:
    load_dotenv(ENV_PATH)
    key = os.getenv("GOOGLE_MAPS_API_KEY", "").strip()
    if not key:
        sys.exit(
            "ERROR: GOOGLE_MAPS_API_KEY not found in .env\n"
            f"Expected file: {ENV_PATH}"
        )
    return key


def extract_zip_from_address(address: str) -> str:
    """Extract 5-digit ZIP code (or ZIP+4) from address string."""
    # Match 5-digit zip optionally followed by -4 digits
    match = re.search(r'\b(\d{5}(?:-\d{4})?)\b', address)
    return match.group(1).split('-')[0] if match else ''


def extract_state_from_address(address: str) -> str:
    """Extract state from address like 'City, State, ZIP, Country' or 'Street, City, State, ZIP'"""
    # Remove "United States" suffix
    address = address.replace(", United States", "").strip()
    
    # Pattern: look for state name before ZIP code (5 digits, possibly with +4)
    # Match: something like ", California, 90021-3217" or ", New York, 11372"
    parts = [p.strip() for p in address.split(",")]
    
    # Find state by looking for a part that matches a known state name
    for part in parts:
        part_lower = part.lower()
        if part_lower in STATE_NAMES:
            return STATE_NAMES[part_lower]
    
    # If no match found, try partial matching for multi-word states
    for i, part in enumerate(parts):
        part_lower = part.lower()
        # Check if this part or combination with previous parts forms a state name
        if i > 0:
            two_part = f"{parts[i-1]} {part}".lower().strip()
            if two_part in STATE_NAMES:
                return STATE_NAMES[two_part]
        if part_lower in STATE_NAMES:
            return STATE_NAMES[part_lower]
    
    # Fallback: return "unknown" for manual review
    return "unknown"


def geocode(address: str, api_key: str) -> dict:
    """Return a dict with lat, lng, country (ISO 3166-1 alpha-2)."""
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            resp = requests.get(
                GEOCODE_URL,
                params={"address": address, "key": api_key},
                timeout=10,
            )
            data = resp.json()
        except requests.RequestException as exc:
            print(f"  [retry {attempt}/{MAX_RETRIES}] network error: {exc}")
            time.sleep(1)
            continue

        status = data.get("status")
        if status == "OK" and data.get("results"):
            result = data["results"][0]
            loc = result["geometry"]["location"]
            # Extract country from address_components
            country = ""
            for component in result.get("address_components", []):
                if "country" in component.get("types", []):
                    country = component.get("short_name", "")
                    break
            return {
                "lat": loc["lat"],
                "lng": loc["lng"],
                "country": country,
            }
        elif status == "OVER_QUERY_LIMIT":
            print(f"  [retry {attempt}/{MAX_RETRIES}] OVER_QUERY_LIMIT, waiting 2s…")
            time.sleep(2)
            continue
        else:
            # ZERO_RESULTS, INVALID_REQUEST, etc.
            print(f"  WARNING: geocode status '{status}' for address: {address}")
            return {"lat": None, "lng": None, "country": ""}

    print(f"  ERROR: max retries reached for: {address}")
    return {"lat": None, "lng": None, "country": ""}


def parse_csv(path: Path) -> list[dict]:
    stores = []
    with open(path, newline="", encoding="utf-8-sig") as fh:
        reader = csv.DictReader(fh, delimiter=";")
        for row in reader:
            name = row.get("Store", "").strip()
            address = row.get("Address", "").strip()
            if name and address:
                state = extract_state_from_address(address)
                zip_code = extract_zip_from_address(address)
                stores.append({
                    "name": name,
                    "address": address,
                    "state": state,
                    "zip": zip_code,
                })
    return stores


CHECKPOINT_FILE = ROOT / "scripts" / ".geocode_checkpoint.json"


def load_checkpoint() -> dict:
    """Load previously geocoded results to allow resume after interruption."""
    if CHECKPOINT_FILE.exists():
        try:
            with open(CHECKPOINT_FILE, "r", encoding="utf-8") as fh:
                data = json.load(fh)
                print(f"  Resuming from checkpoint: {len(data)} addresses already geocoded.")
                return data
        except Exception:
            pass
    return {}


def save_checkpoint(cache: dict) -> None:
    with open(CHECKPOINT_FILE, "w", encoding="utf-8") as fh:
        json.dump(cache, fh, ensure_ascii=False)


def build_store_locator(stores: list[dict], api_key: str) -> dict:
    """Group stores by state and geocode each one, with checkpoint/resume."""
    stores_by_state = defaultdict(list)
    total = len(stores)
    cache = load_checkpoint()

    for i, store in enumerate(stores, 1):
        addr = store["address"]
        if addr in cache:
            geo = cache[addr]
        else:
            print(f"[{i}/{total}] Geocoding: {store['name']} — {addr}")
            geo = geocode(addr, api_key)
            cache[addr] = geo
            if i % 50 == 0:
                save_checkpoint(cache)
                print(f"  ✓ Checkpoint saved ({i}/{total})")
            time.sleep(REQUEST_DELAY)

        store_data = {
            "name": store["name"],
            "address": addr,
            "zip": store.get("zip", ""),
            "lat": geo["lat"],
            "lng": geo["lng"],
            "country": geo["country"] or "US",
        }

        stores_by_state[store["state"]].append(store_data)

    save_checkpoint(cache)
    return dict(stores_by_state)


def sanitize_filename(state_code: str) -> str:
    """Create safe filename from state code."""
    return re.sub(r'[^a-zA-Z0-9_-]', '_', state_code).lower()


def write_state_files(stores_by_state: dict, output_dir: Path) -> dict:
    """Write each state's stores to a separate JSON file."""
    output_dir.mkdir(parents=True, exist_ok=True)
    
    index = {
        "total_states": len(stores_by_state),
        "total_stores": sum(len(stores) for stores in stores_by_state.values()),
        "states": {}
    }
    
    for state_code, stores in sorted(stores_by_state.items()):
        filename = f"{sanitize_filename(state_code)}.json"
        filepath = output_dir / filename
        
        state_data = {
            "state_code": state_code,
            "count": len(stores),
            "stores": stores
        }
        
        with open(filepath, "w", encoding="utf-8") as fh:
            json.dump(state_data, fh, ensure_ascii=False, indent=2)
        
        index["states"][state_code] = {
            "file": filename,
            "count": len(stores)
        }
        
        print(f"  ✓ {state_code}: {len(stores)} stores → {filepath}")
    
    return index


def write_index_file(index: dict, output_dir: Path) -> None:
    """Write index.json with metadata about all states."""
    index_path = output_dir / "index.json"
    
    with open(index_path, "w", encoding="utf-8") as fh:
        json.dump(index, fh, ensure_ascii=False, indent=2)
    
    print(f"\n✓ Index written to {index_path}")
    print(f"  Total: {index['total_stores']} stores across {index['total_states']} states")


def main() -> None:
    api_key = load_api_key()

    print(f"Reading CSV: {CSV_PATH}")
    stores = parse_csv(CSV_PATH)
    print(f"Found {len(stores)} store entries.\n")
    
    # Show state distribution before geocoding
    state_preview = defaultdict(int)
    for s in stores:
        state_preview[s["state"]] += 1
    print("State distribution (pre-geocoding):")
    for state, count in sorted(state_preview.items()):
        print(f"  {state}: {count} stores")
    print()

    print("Geocoding and grouping by state...\n")
    stores_by_state = build_store_locator(stores, api_key)

    print(f"\nWriting state files to {STORE_LOCATOR_DIR}...")
    index = write_state_files(stores_by_state, STORE_LOCATOR_DIR)
    write_index_file(index, STORE_LOCATOR_DIR)
    
    print("\nDone!")
    print(f"\nUsage in Astro:")
    print(f"  import index from '~/locales/us/store_locator/index.json'")
    print(f"  import caStores from '~/locales/us/store_locator/ca.json'")


if __name__ == "__main__":
    main()
