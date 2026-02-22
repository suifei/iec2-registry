#!/usr/bin/env python3
"""
Validate package structure in packages/ directory.
Used by CI to check Pull Requests.
"""

import json
import os
import sys
import zipfile

PACKAGES_DIR = "packages"
REQUIRED_META_FIELDS = ["name", "version", "description", "author", "license", "category"]
REQUIRED_MANIFEST_FIELDS = ["name", "version"]

errors = []


def error(msg):
    errors.append(msg)
    print(f"  ERROR: {msg}", file=sys.stderr)


def validate_json(filepath, required_fields):
    if not os.path.isfile(filepath):
        error(f"Missing file: {filepath}")
        return None

    try:
        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)
    except json.JSONDecodeError as e:
        error(f"Invalid JSON in {filepath}: {e}")
        return None

    for field in required_fields:
        if field not in data:
            error(f"{filepath}: missing required field '{field}'")

    return data


def validate_ieclib(filepath):
    if not os.path.isfile(filepath):
        return

    try:
        with zipfile.ZipFile(filepath, "r") as zf:
            names = zf.namelist()
            if "manifest.json" not in names:
                error(f"{filepath}: missing manifest.json inside archive")
                return

            with zf.open("manifest.json") as mf:
                manifest = json.load(mf)
                for field in REQUIRED_MANIFEST_FIELDS:
                    if field not in manifest:
                        error(f"{filepath}/manifest.json: missing '{field}'")

            st_files = [n for n in names if n.endswith(".st")]
            if not st_files:
                error(f"{filepath}: no .st source files found in archive")

    except zipfile.BadZipFile:
        error(f"{filepath}: not a valid ZIP file")


def validate_package(pkg_dir, pkg_name):
    print(f"Validating {pkg_name}...")

    meta = validate_json(os.path.join(pkg_dir, "metadata.json"), REQUIRED_META_FIELDS)

    if meta and meta.get("name") != pkg_name:
        error(f"{pkg_name}/metadata.json: 'name' ({meta['name']}) does not match directory name")

    readme = os.path.join(pkg_dir, "README.md")
    if not os.path.isfile(readme):
        print(f"  WARNING: {pkg_name}/README.md not found (recommended)")

    for f in os.listdir(pkg_dir):
        if f.endswith(".ieclib"):
            validate_ieclib(os.path.join(pkg_dir, f))


def main():
    if not os.path.isdir(PACKAGES_DIR):
        print(f"No {PACKAGES_DIR}/ directory", file=sys.stderr)
        sys.exit(1)

    for pkg_name in sorted(os.listdir(PACKAGES_DIR)):
        pkg_dir = os.path.join(PACKAGES_DIR, pkg_name)
        if os.path.isdir(pkg_dir):
            validate_package(pkg_dir, pkg_name)

    if errors:
        print(f"\nValidation failed with {len(errors)} error(s)", file=sys.stderr)
        sys.exit(1)
    else:
        print(f"\nAll packages validated successfully")


if __name__ == "__main__":
    main()
