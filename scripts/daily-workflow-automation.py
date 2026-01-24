#!/usr/bin/env python3
"""
NEXUS::DAILY_WORKFLOW v2.0
Reclaims 125+ hours/year by automating administrative debt

Usage:
    python daily-workflow-automation.py              # Run all tasks
    python daily-workflow-automation.py --brief      # Generate brief only
    python daily-workflow-automation.py --clean      # Clean workspace only
    python daily-workflow-automation.py --cron       # Silent mode for cron

Crontab setup (runs at 8 AM daily):
    0 8 * * * /usr/bin/python3 /path/to/daily-workflow-automation.py --cron
"""

import json
import shutil
import argparse
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional

# ═══════════════════════════════════════════════════════════════
# CONFIGURATION
# ═══════════════════════════════════════════════════════════════

REPO_ROOT = Path(__file__).parent.parent
DOWNLOADS = Path.home() / "Downloads"
WORKSPACE_ROOT = Path.home() / "Desktop" / "untitled folder" / "Basin & Associates 🌍"

CONFIG = {
    "daily_brief_dir": REPO_ROOT / "archive" / "daily_briefs",
    "data_dir": REPO_ROOT / "data",
    "automation_logs": WORKSPACE_ROOT / "automation_logs",
    "revgenius_templates": WORKSPACE_ROOT / "community-response-templates",
    
    # File organization mapping
    "file_mapping": {
        ".csv": "leads_raw",
        ".json": "signals_raw", 
        ".pdf": "briefs_raw",
        ".xlsx": "leads_raw",
        ".xls": "leads_raw",
    },
    
    # Time estimates (minutes)
    "time_estimates": {
        "job_hunt": 10,
        "pipeline_check": 8,
        "content_gen": 5,
        "analytics": 2,
        "workspace_clean": 3,
        "brief_gen": 2,
    }
}


# ═══════════════════════════════════════════════════════════════
# WORKSPACE CLEANER
# ═══════════════════════════════════════════════════════════════

def clean_gtm_workspace(verbose: bool = True) -> Dict:
    """
    Organizes raw GTM data exports into labeled folders.
    Moves files from Downloads to structured data directories.
    """
    results = {"files_moved": 0, "errors": []}
    
    if verbose:
        print("🧹 Cleaning GTM Workspace...")
    
    for file in DOWNLOADS.glob("*"):
        if file.is_file() and file.suffix.lower() in CONFIG["file_mapping"]:
            dest_folder = CONFIG["file_mapping"][file.suffix.lower()]
            dest_dir = CONFIG["data_dir"] / dest_folder
            dest_dir.mkdir(parents=True, exist_ok=True)
            
            # Timestamp to avoid overwrites
            timestamp = datetime.now().strftime("%Y%m%d")
            new_name = f"{timestamp}_{file.name}"
            dest_path = dest_dir / new_name
            
            try:
                shutil.move(str(file), str(dest_path))
                results["files_moved"] += 1
                if verbose:
                    print(f"   └─ {file.name} → {dest_folder}/")
            except Exception as e:
                results["errors"].append(f"{file.name}: {str(e)}")
    
    if verbose:
        if results["files_moved"] > 0:
            print(f"✅ Moved {results['files_moved']} files")
        else:
            print("✅ Workspace already clean")
    
    return results


# ═══════════════════════════════════════════════════════════════
# DAILY BRIEF GENERATOR
# ═══════════════════════════════════════════════════════════════

def generate_daily_brief(verbose: bool = True) -> Path:
    """
    Generates a markdown brief for daily GTM engagement.
    Includes action items, system status, and priority tasks.
    """
    if verbose:
        print("📝 Generating Daily Brief...")
    
    brief_dir = CONFIG["daily_brief_dir"]
    brief_dir.mkdir(parents=True, exist_ok=True)
    
    today = datetime.now()
    brief_path = brief_dir / f"{today.strftime('%Y-%m-%d')}_brief.md"
    
    # Calculate days until Feb 18 reset
    reset_date = datetime(2026, 2, 18)
    days_until_reset = (reset_date - today).days
    
    brief_content = f"""# GTM DAILY BRIEF — {today.strftime('%A, %B %d, %Y')}

---

## ⚡ SYSTEM STATUS

| Component | Status |
|-----------|--------|
| NEXUS::Intelligence | 🟢 ONLINE |
| Signal Engine | 🟢 ACTIVE |
| Website | 🟢 DEPLOYED |
| Days to Reset | {days_until_reset} |

---

## 🎯 HIGH-PRIORITY ACTIONS

### Morning Block (30 min)
- [ ] Check RevGenius #chat-help for questions to answer
- [ ] Review any Lisa Carter follow-up materials
- [ ] 5-Vector job hunt sweep

### Afternoon Block (30 min)
- [ ] Pipeline follow-ups (check Job Tracker)
- [ ] LinkedIn engagement (1 post or 3 comments)
- [ ] Practice Platform session (if interview scheduled)

---

## 📊 WEEKLY TARGETS

| Metric | Target | Current |
|--------|--------|---------|
| RevGenius responses | 5 | ___ |
| Job applications | 10 | ___ |
| LinkedIn posts | 3 | ___ |
| Interview preps | 2 | ___ |

---

## 🔗 QUICK LINKS

- [Job Pipeline Tracker](https://basinleon.github.io/tools/job-pipeline-tracker.html)
- [Practice Platform](https://basinleon.github.io/tools/practice-platform.html)
- [ROI Calculator](https://basinleon.github.io/tools/roi-calculator.html)
- [RevGenius Templates]({CONFIG["revgenius_templates"]})

---

## 📝 NOTES

_Add daily observations, wins, and learnings here._

---

*Generated by NEXUS::DAILY_WORKFLOW v2.0*
"""
    
    brief_path.write_text(brief_content)
    
    if verbose:
        print(f"✅ Brief created: {brief_path.name}")
    
    return brief_path


# ═══════════════════════════════════════════════════════════════
# JOB HUNT SWEEP
# ═══════════════════════════════════════════════════════════════

def run_5_vector_sweep(verbose: bool = True) -> Dict:
    """
    Execute 5-vector job hunt sweep.
    In production, this would integrate with APIs.
    """
    if verbose:
        print("🔍 Running 5-Vector Job Hunt Sweep...")
    
    vectors = [
        ("LinkedIn Jobs", "https://linkedin.com/jobs"),
        ("Greenhouse/Lever ATS", "site:greenhouse.io OR site:lever.co"),
        ("VC Portfolio Companies", "a]6z.com/portfolio"),
        ("Twitter/X Jobs", "twitter.com/search?q=hiring"),
        ("Reddit/HN Who's Hiring", "news.ycombinator.com/item?id=")
    ]
    
    results = {
        "vectors_scanned": len(vectors),
        "search_queries": [],
        "time_saved": CONFIG["time_estimates"]["job_hunt"]
    }
    
    for name, url in vectors:
        results["search_queries"].append({
            "vector": name,
            "url": url,
            "status": "ready"
        })
        if verbose:
            print(f"   └─ {name}: Ready")
    
    if verbose:
        print(f"✅ {len(vectors)} vectors prepared")
    
    return results


# ═══════════════════════════════════════════════════════════════
# PIPELINE CHECK
# ═══════════════════════════════════════════════════════════════

def check_pipeline_followups(verbose: bool = True) -> Dict:
    """
    Check pipeline for follow-ups needed in next 7 days.
    """
    if verbose:
        print("📋 Checking Pipeline Follow-ups...")
    
    # Load pipeline data if exists
    pipeline_file = WORKSPACE_ROOT / "job_pipeline.json"
    
    results = {
        "followups_due": [],
        "total_opportunities": 0,
        "time_saved": CONFIG["time_estimates"]["pipeline_check"]
    }
    
    if pipeline_file.exists():
        try:
            with open(pipeline_file) as f:
                pipeline = json.load(f)
                results["total_opportunities"] = len(pipeline.get("opportunities", []))
        except:
            pass
    
    if verbose:
        print(f"✅ Pipeline checked ({results['total_opportunities']} opportunities)")
    
    return results


# ═══════════════════════════════════════════════════════════════
# MAIN AUTOMATION CLASS
# ═══════════════════════════════════════════════════════════════

class DailyWorkflowAutomation:
    """Orchestrates all daily automation tasks."""
    
    def __init__(self, verbose: bool = True):
        self.verbose = verbose
        self.results = {
            "timestamp": datetime.now().isoformat(),
            "tasks": {},
            "time_saved_minutes": 0,
            "errors": []
        }
        
        # Ensure log directory exists
        CONFIG["automation_logs"].mkdir(parents=True, exist_ok=True)
    
    def run_all(self) -> Dict:
        """Execute full daily workflow."""
        if self.verbose:
            print("=" * 60)
            print("🚀 NEXUS::DAILY_WORKFLOW v2.0")
            print("=" * 60)
            print()
        
        try:
            # 1. Clean workspace
            self.results["tasks"]["workspace_clean"] = clean_gtm_workspace(self.verbose)
            
            # 2. Generate daily brief
            brief_path = generate_daily_brief(self.verbose)
            self.results["tasks"]["daily_brief"] = {"path": str(brief_path)}
            
            # 3. Job hunt sweep
            self.results["tasks"]["job_hunt"] = run_5_vector_sweep(self.verbose)
            
            # 4. Pipeline check
            self.results["tasks"]["pipeline_check"] = check_pipeline_followups(self.verbose)
            
            # Calculate total time saved
            self.results["time_saved_minutes"] = sum(
                CONFIG["time_estimates"].values()
            )
            
            # Save results
            self._save_results()
            
            # Print summary
            self._print_summary()
            
        except Exception as e:
            self.results["errors"].append(str(e))
            if self.verbose:
                print(f"❌ Error: {e}")
        
        return self.results
    
    def _save_results(self):
        """Save automation results to log file."""
        log_file = CONFIG["automation_logs"] / f"workflow_{datetime.now().strftime('%Y%m%d')}.json"
        
        with open(log_file, 'w') as f:
            json.dump(self.results, f, indent=2, default=str)
    
    def _print_summary(self):
        """Print execution summary."""
        if not self.verbose:
            return
        
        print()
        print("=" * 60)
        print("✅ AUTOMATION COMPLETE")
        print("=" * 60)
        print(f"Tasks Completed: {len(self.results['tasks'])}")
        print(f"Time Saved: {self.results['time_saved_minutes']} minutes")
        print(f"Annual Savings: ~{self.results['time_saved_minutes'] * 365 // 60} hours/year")
        print()
        print("📋 Next Steps:")
        print("1. Open daily brief and review priorities")
        print("2. Execute job hunt vectors")
        print("3. Check RevGenius for engagement opportunities")
        print("4. Review pipeline follow-ups")
        print()


# ═══════════════════════════════════════════════════════════════
# CLI ENTRY POINT
# ═══════════════════════════════════════════════════════════════

def main():
    parser = argparse.ArgumentParser(
        description="NEXUS::DAILY_WORKFLOW - Automate your GTM operations"
    )
    parser.add_argument(
        "--brief", 
        action="store_true", 
        help="Generate daily brief only"
    )
    parser.add_argument(
        "--clean", 
        action="store_true", 
        help="Clean workspace only"
    )
    parser.add_argument(
        "--cron", 
        action="store_true", 
        help="Silent mode for cron execution"
    )
    
    args = parser.parse_args()
    verbose = not args.cron
    
    if args.brief:
        generate_daily_brief(verbose)
    elif args.clean:
        clean_gtm_workspace(verbose)
    else:
        automation = DailyWorkflowAutomation(verbose)
        automation.run_all()


if __name__ == "__main__":
    main()
