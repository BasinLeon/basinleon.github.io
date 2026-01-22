#!/usr/bin/env python3
"""
Coding Metrics Tracker
Tracks lines of code, time spent coding, builds shipped, and deployment frequency.
"Building an airplane while flying it" - tracks the journey, not just the destination.
"""

import subprocess
import json
import os
from datetime import datetime, timedelta
from pathlib import Path
from collections import defaultdict
import re

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    RESET = '\033[0m'
    BOLD = '\033[1m'

def run_git_command(cmd, repo_path):
    """Run a git command and return output."""
    try:
        result = subprocess.run(
            cmd,
            shell=True,
            cwd=repo_path,
            capture_output=True,
            text=True,
            check=True
        )
        return result.stdout.strip()
    except subprocess.CalledProcessError:
        return ""

def count_lines_of_code(repo_path):
    """Count total lines of code across all repositories."""
    total_lines = 0
    file_counts = defaultdict(int)
    language_counts = defaultdict(int)
    
    # File extensions to count
    code_extensions = {
        '.py': 'Python',
        '.js': 'JavaScript',
        '.ts': 'TypeScript',
        '.tsx': 'TypeScript',
        '.jsx': 'JavaScript',
        '.html': 'HTML',
        '.css': 'CSS',
        '.sql': 'SQL',
        '.sh': 'Shell',
        '.md': 'Markdown',
        '.json': 'JSON',
        '.yaml': 'YAML',
        '.yml': 'YAML',
        '.go': 'Go',
        '.rs': 'Rust',
        '.java': 'Java',
        '.cpp': 'C++',
        '.c': 'C',
        '.h': 'C/C++',
    }
    
    for root, dirs, files in os.walk(repo_path):
        # Skip hidden directories and common ignores
        dirs[:] = [d for d in dirs if not d.startswith('.') and d not in ['node_modules', '__pycache__', 'venv', '.git']]
        
        for file in files:
            file_path = Path(root) / file
            ext = file_path.suffix.lower()
            
            if ext in code_extensions:
                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        lines = len(f.readlines())
                        total_lines += lines
                        file_counts[code_extensions[ext]] += lines
                        language_counts[code_extensions[ext]] += 1
                except Exception:
                    pass
    
    return total_lines, dict(file_counts), dict(language_counts)

def get_commit_stats(repo_path):
    """Get commit statistics from git."""
    stats = {
        'total_commits': 0,
        'commits_by_date': defaultdict(int),
        'commits_by_author': defaultdict(int),
        'files_changed': 0,
        'insertions': 0,
        'deletions': 0,
        'first_commit': None,
        'last_commit': None,
    }
    
    # Get total commits
    total = run_git_command('git rev-list --count HEAD', repo_path)
    if total:
        stats['total_commits'] = int(total)
    
    # Get commit log with stats
    log = run_git_command(
        'git log --pretty=format:"%H|%an|%ae|%ad|%s" --date=short --numstat',
        repo_path
    )
    
    if log:
        lines = log.split('\n')
        dates = []
        
        for line in lines:
            if '|' in line and not re.match(r'^\d+\s+\d+', line):
                # Commit header
                parts = line.split('|')
                if len(parts) >= 4:
                    author = parts[1]
                    date = parts[3]
                    dates.append(date)
                    stats['commits_by_author'][author] += 1
                    stats['commits_by_date'][date] += 1
            elif re.match(r'^\d+\s+\d+', line):
                # File stats
                parts = line.split('\t')
                if len(parts) >= 2:
                    try:
                        insertions = int(parts[0]) if parts[0] != '-' else 0
                        deletions = int(parts[1]) if parts[1] != '-' else 0
                        stats['insertions'] += insertions
                        stats['deletions'] += deletions
                        stats['files_changed'] += 1
                    except ValueError:
                        pass
        
        if dates:
            stats['first_commit'] = min(dates)
            stats['last_commit'] = max(dates)
    
    return stats

def get_recent_activity(repo_path, days=30):
    """Get recent coding activity."""
    since = (datetime.now() - timedelta(days=days)).strftime('%Y-%m-%d')
    
    commits = run_git_command(
        f'git log --since="{since}" --pretty=format:"%ad|%s" --date=short',
        repo_path
    )
    
    commit_count = len([l for l in commits.split('\n') if l.strip()]) if commits else 0
    
    # Get files changed in last period
    files_changed = run_git_command(
        f'git log --since="{since}" --name-only --pretty=format: | sort -u',
        repo_path
    )
    
    unique_files = len([f for f in files_changed.split('\n') if f.strip()]) if files_changed else 0
    
    return {
        'commits_last_30_days': commit_count,
        'files_changed_last_30_days': unique_files,
        'period_start': since,
    }

def calculate_coding_time(commits_by_date):
    """Estimate coding time based on commits (rough estimate)."""
    # Rough estimate: 2-4 hours per day with commits
    days_with_commits = len(commits_by_date)
    estimated_hours = days_with_commits * 3  # Average 3 hours per coding day
    
    return {
        'days_with_commits': days_with_commits,
        'estimated_hours': estimated_hours,
        'estimated_days': estimated_hours / 8,
    }

def get_builds_shipped(repo_path):
    """Count deployments/builds shipped."""
    # Look for deployment commits, tags, or release markers
    tags = run_git_command('git tag -l', repo_path)
    tag_count = len([t for t in tags.split('\n') if t.strip()]) if tags else 0
    
    # Look for deployment-related commits
    deploy_commits = run_git_command(
        r'git log --grep="deploy\|release\|ship\|build" --oneline --all',
        repo_path
    )
    deploy_count = len([c for c in deploy_commits.split('\n') if c.strip()]) if deploy_commits else 0
    
    return {
        'git_tags': tag_count,
        'deployment_commits': deploy_count,
        'total_builds': tag_count + deploy_count,
    }

def generate_report(repo_path):
    """Generate comprehensive coding metrics report."""
    print(f"\n{Colors.BOLD}{Colors.CYAN}╔══════════════════════════════════════════════════════╗{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.CYAN}║   CODING METRICS TRACKER :: Building While Flying  ║{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.CYAN}╚══════════════════════════════════════════════════════╝{Colors.RESET}\n")
    
    print(f"{Colors.BOLD}📊 Analyzing Repository: {repo_path}{Colors.RESET}\n")
    
    # Count lines of code
    print(f"{Colors.BLUE}Counting lines of code...{Colors.RESET}")
    total_lines, file_counts, language_counts = count_lines_of_code(repo_path)
    
    # Get commit stats
    print(f"{Colors.BLUE}Analyzing git commits...{Colors.RESET}")
    commit_stats = get_commit_stats(repo_path)
    
    # Get recent activity
    print(f"{Colors.BLUE}Calculating recent activity...{Colors.RESET}")
    recent = get_recent_activity(repo_path)
    
    # Calculate coding time
    time_stats = calculate_coding_time(commit_stats['commits_by_date'])
    
    # Get builds shipped
    print(f"{Colors.BLUE}Counting builds shipped...{Colors.RESET}")
    builds = get_builds_shipped(repo_path)
    
    # Generate report
    print(f"\n{Colors.BOLD}{Colors.GREEN}══════════════════════════════════════════════════════{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.GREEN}  METRICS REPORT{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.GREEN}══════════════════════════════════════════════════════{Colors.RESET}\n")
    
    # Lines of Code
    print(f"{Colors.BOLD}📝 LINES OF CODE{Colors.RESET}")
    print(f"  Total: {Colors.CYAN}{total_lines:,}{Colors.RESET} lines")
    print(f"  Files: {Colors.CYAN}{sum(language_counts.values())}{Colors.RESET} code files")
    print(f"\n  By Language:")
    for lang, lines in sorted(file_counts.items(), key=lambda x: x[1], reverse=True)[:10]:
        pct = (lines / total_lines * 100) if total_lines > 0 else 0
        print(f"    {lang:15} {lines:>8,} lines ({pct:>5.1f}%)")
    
    # Git Activity
    print(f"\n{Colors.BOLD}🔄 GIT ACTIVITY{Colors.RESET}")
    print(f"  Total Commits: {Colors.CYAN}{commit_stats['total_commits']:,}{Colors.RESET}")
    print(f"  Lines Added: {Colors.GREEN}+{commit_stats['insertions']:,}{Colors.RESET}")
    print(f"  Lines Removed: {Colors.RED}-{commit_stats['deletions']:,}{Colors.RESET}")
    print(f"  Net Change: {Colors.CYAN}{commit_stats['insertions'] - commit_stats['deletions']:,}{Colors.RESET} lines")
    if commit_stats['first_commit']:
        print(f"  First Commit: {Colors.YELLOW}{commit_stats['first_commit']}{Colors.RESET}")
    if commit_stats['last_commit']:
        print(f"  Last Commit: {Colors.YELLOW}{commit_stats['last_commit']}{Colors.RESET}")
    
    # Recent Activity
    print(f"\n{Colors.BOLD}⚡ RECENT ACTIVITY (Last 30 Days){Colors.RESET}")
    print(f"  Commits: {Colors.CYAN}{recent['commits_last_30_days']}{Colors.RESET}")
    print(f"  Files Changed: {Colors.CYAN}{recent['files_changed_last_30_days']}{Colors.RESET}")
    
    # Time Spent
    print(f"\n{Colors.BOLD}⏱️  TIME INVESTED{Colors.RESET}")
    print(f"  Days with Commits: {Colors.CYAN}{time_stats['days_with_commits']}{Colors.RESET}")
    print(f"  Estimated Hours: {Colors.CYAN}{time_stats['estimated_hours']:,}{Colors.RESET}")
    print(f"  Estimated Days: {Colors.CYAN}{time_stats['estimated_days']:.1f}{Colors.RESET} (8-hour days)")
    
    # Builds Shipped
    print(f"\n{Colors.BOLD}🚀 BUILDS SHIPPED{Colors.RESET}")
    print(f"  Git Tags: {Colors.CYAN}{builds['git_tags']}{Colors.RESET}")
    print(f"  Deployment Commits: {Colors.CYAN}{builds['deployment_commits']}{Colors.RESET}")
    print(f"  Total Builds: {Colors.GREEN}{builds['total_builds']}{Colors.RESET}")
    
    # Velocity Metrics
    if commit_stats['first_commit'] and commit_stats['last_commit']:
        first = datetime.strptime(commit_stats['first_commit'], '%Y-%m-%d')
        last = datetime.strptime(commit_stats['last_commit'], '%Y-%m-%d')
        days_active = (last - first).days + 1
        
        print(f"\n{Colors.BOLD}📈 VELOCITY METRICS{Colors.RESET}")
        if days_active > 0:
            commits_per_day = commit_stats['total_commits'] / days_active
            lines_per_day = (commit_stats['insertions'] - commit_stats['deletions']) / days_active
            print(f"  Commits/Day: {Colors.CYAN}{commits_per_day:.2f}{Colors.RESET}")
            print(f"  Lines/Day: {Colors.CYAN}{lines_per_day:.0f}{Colors.RESET}")
            print(f"  Active Days: {Colors.CYAN}{days_active}{Colors.RESET}")
    
    # Save to JSON
    metrics = {
        'timestamp': datetime.now().isoformat(),
        'lines_of_code': {
            'total': total_lines,
            'by_language': file_counts,
            'file_counts': language_counts,
        },
        'git_stats': commit_stats,
        'recent_activity': recent,
        'time_invested': time_stats,
        'builds_shipped': builds,
    }
    
    output_file = Path(repo_path) / 'coding-metrics.json'
    with open(output_file, 'w') as f:
        json.dump(metrics, f, indent=2)
    
    print(f"\n{Colors.GREEN}✓{Colors.RESET} Metrics saved to: {output_file}")
    print(f"\n{Colors.BOLD}{Colors.YELLOW}💡 Building an airplane while flying it!{Colors.RESET}\n")
    
    return metrics

def main():
    import sys
    
    # Get repo path (default to current directory)
    if len(sys.argv) > 1:
        repo_path = sys.argv[1]
    else:
        repo_path = os.getcwd()
    
    if not os.path.exists(repo_path):
        print(f"{Colors.RED}Error: Path not found: {repo_path}{Colors.RESET}")
        sys.exit(1)
    
    if not os.path.exists(os.path.join(repo_path, '.git')):
        print(f"{Colors.YELLOW}Warning: Not a git repository. Some metrics may be limited.{Colors.RESET}")
    
    metrics = generate_report(repo_path)
    return 0

if __name__ == '__main__':
    import sys
    sys.exit(main())
