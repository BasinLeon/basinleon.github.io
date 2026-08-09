#!/usr/bin/env python3
"""
Site link validator for the current portfolio architecture.

Checks internal links and HTML fragments across the public site.
"""

import re
import sys
import os
from pathlib import Path


IGNORED_DIRS = {'.git', 'node_modules', 'publishing'}


def iter_public_files(repo_root):
    for current, directories, filenames in os.walk(repo_root):
        directories[:] = [name for name in directories if name not in IGNORED_DIRS]
        for filename in filenames:
            yield Path(current) / filename


class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    BLUE = '\033[94m'
    RESET = '\033[0m'
    BOLD = '\033[1m'


def print_success(msg):
    print(f"{Colors.GREEN}✓{Colors.RESET} {msg}")


def print_error(msg):
    print(f"{Colors.RED}✗{Colors.RESET} {msg}")


def print_info(msg):
    print(f"{Colors.BLUE}ℹ{Colors.RESET} {msg}")


def parse_front_matter(text):
    if not text.startswith('---'):
        return {}

    data = {}
    lines = text.splitlines()
    i = 1
    while i < len(lines):
        line = lines[i]
        if line.strip() == '---':
            break
        if ':' in line:
            key, value = line.split(':', 1)
            data[key.strip()] = value.strip().strip('"').strip("'")
        i += 1
    return data


def slug_from_filename(path):
    name = path.stem
    parts = name.split('-', 3)
    if len(parts) >= 4 and all(part.isdigit() for part in parts[:3]):
        return parts[3]
    return name


def categories_from_front_matter(raw_value):
    if not raw_value:
        return []

    value = raw_value.strip()
    if value.startswith('[') and value.endswith(']'):
        return [
            item.strip().strip('"').strip("'")
            for item in value[1:-1].split(',')
            if item.strip()
        ]
    return [value]


def collect_valid_paths(repo_root):
    valid = {
        '/',
        '/case-studies/',
        '/work-with-me/',
        '/answers/',
        '/blog/',
        '/library/',
        '/tools/',
        '/#case-studies',
    }

    docs_root = repo_root / 'docs'
    for md_file in docs_root.glob('*.md'):
        text = md_file.read_text(encoding='utf-8')
        front_matter = parse_front_matter(text)
        permalink = front_matter.get('permalink')
        if permalink:
            valid.add(f"/docs{permalink}")
        elif md_file.name == 'index.md':
            valid.add('/docs/')
        else:
            valid.add(f"/docs/{md_file.stem}/")

    for post_file in (docs_root / '_posts').glob('*.md'):
        text = post_file.read_text(encoding='utf-8')
        front_matter = parse_front_matter(text)
        categories = categories_from_front_matter(front_matter.get('categories', ''))
        slug = slug_from_filename(post_file)
        year, month, day = post_file.name.split('-', 3)[:3]
        category_path = '/'.join(categories)
        valid.add(f"/docs/{category_path}/{year}/{month}/{day}/{slug}/")

    for asset in iter_public_files(repo_root):
        if not asset.is_file():
            continue
        relative = asset.relative_to(repo_root).as_posix()
        valid.add('/' + relative)
        if asset.name == 'index.html':
            route = '/' + asset.parent.relative_to(repo_root).as_posix().strip('/')
            valid.add((route + '/') if route != '/' else '/')

    return valid


def find_internal_links(path):
    content = path.read_text(encoding='utf-8')
    patterns = [
        re.compile(r'href=["\']([^"\']+)["\']'),
        re.compile(r'\]\(([^)]+)\)'),
    ]
    links = []
    for pattern in patterns:
        for match in pattern.finditer(content):
            target = match.group(1).strip()
            if not target:
                continue
            if '{{' in target or '{%' in target:
                continue
            if target.startswith(('http://', 'https://', 'mailto:', 'tel:')):
                continue
            links.append(target)
    return links


def normalize_link(target):
    if target.startswith(('../', './', '#')):
        return None
    if not target.startswith('/'):
        return None

    target = target.split('?', 1)[0]
    if '#' in target:
        base, anchor = target.split('#', 1)
        if not base:
            return f"/#{anchor}"
        target = base

    if target != '/' and not Path(target).suffix and not target.endswith('/'):
        target += '/'
    return target


def validate_internal_links(repo_root, valid_paths):
    files_to_scan = [
        path for path in iter_public_files(repo_root)
        if path.is_file()
        and path.suffix.lower() in {'.html', '.md'}
    ]

    broken = []
    for file_path in files_to_scan:
        if not file_path.exists():
            continue
        for raw_link in find_internal_links(file_path):
            normalized = normalize_link(raw_link)
            if not normalized:
                continue
            if normalized not in valid_paths:
                broken.append({
                    'file': file_path.relative_to(repo_root).as_posix(),
                    'link': raw_link,
                    'normalized': normalized,
                })
    return broken


def public_route_to_file(repo_root, route):
    clean = route.split('?', 1)[0].split('#', 1)[0]
    if not clean or clean == '/':
        return repo_root / 'index.html'
    candidate = repo_root / clean.lstrip('/')
    if candidate.is_dir() or clean.endswith('/'):
        return candidate / 'index.html'
    return candidate


def source_public_route(repo_root, path):
    relative = path.relative_to(repo_root)
    if relative.name == 'index.html':
        parent = relative.parent.as_posix().strip('.')
        return '/' + (parent + '/' if parent else '')
    return '/' + relative.as_posix()


def validate_fragments(repo_root):
    html_files = [
        path for path in iter_public_files(repo_root)
        if path.suffix.lower() == '.html'
    ]
    id_cache = {}
    broken = []
    for source in html_files:
        source_route = source_public_route(repo_root, source)
        content = source.read_text(encoding='utf-8')
        for raw in re.findall(r'href=["\']([^"\']*#[^"\']+)["\']', content):
            if raw.startswith(('http://', 'https://', 'mailto:', 'tel:')):
                continue
            base, fragment = raw.split('#', 1)
            if not fragment:
                continue
            if base.startswith('/'):
                target_route = base
            elif not base:
                target_route = source_route
            else:
                continue
            target_file = public_route_to_file(repo_root, target_route)
            if not target_file.exists() or target_file.suffix.lower() != '.html':
                continue
            ids = id_cache.get(target_file)
            if ids is None:
                target_text = target_file.read_text(encoding='utf-8')
                ids = set(re.findall(r'(?:id|name)=["\']([^"\']+)["\']', target_text))
                id_cache[target_file] = ids
            if fragment not in ids:
                broken.append({
                    'file': source.relative_to(repo_root).as_posix(),
                    'link': raw,
                    'normalized': f"missing fragment #{fragment} in {target_route or source_route}",
                })
    return broken


def main():
    print(f"\n{Colors.BOLD}{Colors.BLUE}╔════════════════════════════════════════╗{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.BLUE}║   Site Link Validator v2.0            ║{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.BLUE}╚════════════════════════════════════════╝{Colors.RESET}\n")

    repo_root = Path(__file__).resolve().parent.parent
    print_info("Collecting valid site paths...")
    valid_paths = collect_valid_paths(repo_root)
    print_success(f"Collected {len(valid_paths)} valid paths")

    print_info("Scanning public HTML and Markdown links...")
    broken_links = validate_internal_links(repo_root, valid_paths)
    broken_links.extend(validate_fragments(repo_root))

    print(f"\n{Colors.BOLD}Validation Results:{Colors.RESET}\n")
    if not broken_links:
        print_success("All links are valid! No issues found.")
        return 0

    print_error(f"Found {len(broken_links)} broken internal links:")
    for broken in broken_links:
        print(f"  • {broken['file']}")
        print(f"    Link: {broken['link']}")
        print(f"    Normalized: {broken['normalized']}")
        print()

    print(f"\n{Colors.BOLD}Summary:{Colors.RESET}")
    print(f"  Valid paths: {len(valid_paths)}")
    print(f"  Broken internal links: {len(broken_links)}\n")
    return 1


if __name__ == '__main__':
    sys.exit(main())
