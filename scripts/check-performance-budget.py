#!/usr/bin/env python3
"""Guard the public site's critical-path asset and document budgets."""

from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]

FILE_BUDGETS = {
    "index.html": 90_000,
    "blog/index.html": 70_000,
    "blog/fiction/index.html": 55_000,
    "library/index.html": 90_000,
    "tools/index.html": 100_000,
    "assets/img/leon-basin-portrait.png": 160_000,
    "assets/img/archive-writing-photo-960.jpg": 120_000,
    "assets/img/archive-writing-photo-1600.jpg": 400_000,
    "assets/img/fiction/sam-to-ink-listening-room-v2.webp": 130_000,
    "assets/img/fiction/sam-to-ink-path-v2.webp": 300_000,
    "assets/img/frameworks/signal-refinery-hud-1000.jpg": 140_000,
    "assets/img/frameworks/signal-refinery-hud-1800.jpg": 300_000,
    "assets/img/frameworks/gtm-architecture-live-900.jpg": 210_000,
    "assets/img/frameworks/gtm-architecture-live-1600.jpg": 460_000,
}

CRITICAL_DOCUMENTS = (
    "index.html",
    "blog/index.html",
    "library/index.html",
    "tools/index.html",
    "docs/_layouts/home.html",
    "docs/_layouts/frameworks.html",
    "docs/about/index.html",
)

LEGACY_HEAVY_REFERENCES = (
    "archive-writing-photo.jpeg",
    "gtm_arch_live_screenshot.png",
    "signal_refinery_hud_actual_fixed.png",
)


def human_bytes(value: int) -> str:
    return f"{value / 1024:.0f} KB"


def main() -> int:
    errors = []

    for relative, budget in FILE_BUDGETS.items():
        path = ROOT / relative
        if not path.exists():
            errors.append(f"Missing performance asset: {relative}")
            continue
        size = path.stat().st_size
        if size > budget:
            errors.append(
                f"{relative} is {human_bytes(size)}; budget is {human_bytes(budget)}"
            )

    for relative in CRITICAL_DOCUMENTS:
        text = (ROOT / relative).read_text(encoding="utf-8")
        for legacy in LEGACY_HEAVY_REFERENCES:
            if legacy in text:
                errors.append(f"{relative} still references heavy legacy asset {legacy}")

    if errors:
        print("Performance budget failed:")
        for error in errors:
            print(f"- {error}")
        return 1

    print(f"Performance budget passed for {len(FILE_BUDGETS)} critical files.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
