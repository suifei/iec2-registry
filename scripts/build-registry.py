#!/usr/bin/env python3
"""
Rebuild registry.json from packages/*/metadata.json files.
Run from the repository root.
"""

import json
import os
import sys
from datetime import datetime, timezone

PACKAGES_DIR = "packages"
REGISTRY_FILE = "registry.json"
BASE_URL = "https://suifei.github.io/iec2-registry"

REQUIRED_FIELDS = ["name", "version", "description", "author", "license", "category"]


def load_metadata(pkg_dir):
    meta_path = os.path.join(pkg_dir, "metadata.json")
    if not os.path.isfile(meta_path):
        return None

    with open(meta_path, "r", encoding="utf-8") as f:
        meta = json.load(f)

    for field in REQUIRED_FIELDS:
        if field not in meta:
            print(f"  WARNING: {meta_path} missing required field '{field}'", file=sys.stderr)
            return None

    return meta


def find_ieclib(pkg_dir, name):
    """Find the latest .ieclib file in the package directory."""
    for f in sorted(os.listdir(pkg_dir), reverse=True):
        if f.endswith(".ieclib"):
            return f
    return None


def build_registry():
    packages = []

    if not os.path.isdir(PACKAGES_DIR):
        print(f"No {PACKAGES_DIR}/ directory found", file=sys.stderr)
        sys.exit(1)

    for pkg_name in sorted(os.listdir(PACKAGES_DIR)):
        pkg_dir = os.path.join(PACKAGES_DIR, pkg_name)
        if not os.path.isdir(pkg_dir):
            continue

        meta = load_metadata(pkg_dir)
        if meta is None:
            print(f"  Skipping {pkg_name}: invalid or missing metadata.json")
            continue

        ieclib = find_ieclib(pkg_dir, pkg_name)
        if ieclib:
            meta["url"] = f"{BASE_URL}/packages/{pkg_name}/{ieclib}"
        else:
            meta["url"] = ""

        meta["homepage"] = f"{BASE_URL}/#/packages/{pkg_name}"

        if "downloads" not in meta:
            meta["downloads"] = 0

        entry = {
            "name": meta["name"],
            "version": meta["version"],
            "description": meta["description"],
            "author": meta["author"],
            "category": meta.get("category", "other"),
            "tags": meta.get("tags", []),
            "license": meta.get("license", "MIT"),
            "downloads": meta.get("downloads", 0),
            "url": meta["url"],
            "homepage": meta["homepage"],
            "source": meta.get("source", ""),
            "pous": [e["name"] for e in meta.get("exports", [])] if "exports" in meta else meta.get("pous", []),
            "dependencies": meta.get("dependencies", []),
            "platforms": meta.get("platforms", ["any"]),
            "iecVersion": meta.get("iecVersion", "3.0"),
        }

        packages.append(entry)
        print(f"  Added: {pkg_name} v{meta['version']} ({len(entry['pous'])} POUs)")

    registry = {
        "version": "1.0.0",
        "updated": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "packages": packages,
    }

    with open(REGISTRY_FILE, "w", encoding="utf-8") as f:
        json.dump(registry, f, indent=2, ensure_ascii=False)

    print(f"\nRegistry rebuilt: {len(packages)} packages -> {REGISTRY_FILE}")


if __name__ == "__main__":
    build_registry()
