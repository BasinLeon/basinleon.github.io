#!/usr/bin/env python3
"""Fail the public-site build when private workspace material is tracked."""

from __future__ import annotations

import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

FORBIDDEN_PREFIXES = (
    ".agents/",
    "PROTOCOLS/",
    "docs/_drafts/",
    "docs/data/",
    "docs/mock_that_interview/",
    "docs/plans/",
)

FORBIDDEN_EXACT = {
    "crm_leads.json",
    "docs/career_dashboard_data.json",
    "docs/career_dashboard_public.json",
    "docs/nexus_vault.json",
    "docs/operator_status.md",
    "docs/opportunities.json",
    "docs/nikolai_signal_blueprint.html",
}

TEXT_PATTERNS = {
    "absolute local user path": re.compile(r"/Users/" + r"basin/", re.I),
    "AWS access key": re.compile(r"\bAKIA[0-9A-Z]{16}\b"),
    "GitHub token": re.compile(r"\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9_]{30,}\b|github_pat_[A-Za-z0-9_]{60,}\b"),
    "Google API key": re.compile(r"\bAIza[0-9A-Za-z_-]{35}\b"),
    "OpenAI API key": re.compile(r"\bsk-(?:proj-)?[A-Za-z0-9_-]{32,}\b"),
    "Slack token": re.compile(r"\bxox[baprs]-[A-Za-z0-9-]{20,}\b"),
    "private key": re.compile(r"BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY"),
    "Telegram token assignment": re.compile(r"TELEGRAM_(?:BOT_TOKEN|CHAT_ID)\s*=", re.I),
    "Telegram bot token": re.compile(r"\b\d{8,12}:AA[0-9A-Za-z_-]{30,}\b"),
    "US phone number": re.compile(r"(?<!\d)(?:\+?1[\s().-]*)?\d{3}[\s().-]*\d{3}[\s.-]*\d{4}(?!\d)"),
    "browser-side passcode": re.compile(r"(?:passcode|password)\s*(?:===|==|:|=)\s*[\"'][^\"']+[\"']", re.I),
}

TEXT_SUFFIXES = {
    ".css", ".html", ".js", ".json", ".md", ".mjs", ".py", ".txt", ".xml", ".yml", ".yaml"
}


def tracked_files() -> list[str]:
    result = subprocess.run(
        ["git", "ls-files"],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
    )
    return [line for line in result.stdout.splitlines() if line]


def main() -> int:
    failures: list[str] = []
    tracked = tracked_files()

    for rel in tracked:
        if rel in FORBIDDEN_EXACT or rel.startswith(FORBIDDEN_PREFIXES):
            failures.append(f"forbidden public path: {rel}")
            continue

        path = ROOT / rel
        if path.suffix.lower() not in TEXT_SUFFIXES or not path.exists():
            continue

        try:
            text = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue

        for label, pattern in TEXT_PATTERNS.items():
            if pattern.search(text):
                failures.append(f"{label}: {rel}")

        if path.suffix.lower() == ".json":
            try:
                value = json.loads(text)
            except json.JSONDecodeError:
                continue
            if isinstance(value, list) and len(value) >= 25:
                email_rows = sum(
                    1 for row in value
                    if isinstance(row, dict) and any("email" in str(key).lower() for key in row)
                )
                if email_rows >= 10:
                    failures.append(f"bulk contact-like JSON ({email_rows} email rows): {rel}")

    if failures:
        print("Public-safety validation failed:")
        for failure in sorted(set(failures)):
            print(f"  - {failure}")
        return 1

    print(f"Public-safety validation passed for {len(tracked)} tracked files.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
