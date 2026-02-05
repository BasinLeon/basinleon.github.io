---
name: nexus-automation-scaffolder
description: "Use this to quickly generate the skeleton of a new Basin::Nexus automation module. Ensures consistency with the 'Signal Refinery' architecture principles."
---

# Nexus Automation Scaffolder

## Overview

Accelerate the development of new GTM bots and automation scripts. This skill ensures every new tool follows the "Refinery" pattern: Ingest -> Logic -> Mission.

## The Process

### 1. Module Definition
- **Name**: What is the bot called? (e.g., `GovEagleScraper`, `ApolloSignalListener`).
- **Trigger**: What starts the flow? (Cron, Webhook, API Poll).
- **Mission**: What is the desired output? (Slack alert, CRM update, LinkedIn DM).

### 2. Scaffold Generation
Generate a Python file in `WAR_ROOM_2026/03_ENGINEERING/` following this template:

```python
import os
import json
import datetime

class NexusRefineryModule:
    """
    Basin::Nexus Refinery Module: <NAME>
    Objective: <MISSION>
    """
    def __init__(self):
        self.base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        
    def ingest(self):
        """Step 1: Raw data ingestion from <SOURCE>."""
        pass
        
    def logic_gate(self, data):
        """Step 2: Scoring and qualification logic."""
        # Is this high-signal?
        return True
        
    def execute_mission(self, qualified_data):
        """Step 3: Actionable output (Alert/DM/CRM)."""
        pass

if __name__ == "__main__":
    module = NexusRefineryModule()
    # module.run()
```

### 3. Integration
- Update `CURRENT_BATTLEFIELD.html` to reflect the new "System Status" or tool connection.
- Log the new tool in the `03_ENGINEERING` manifest.

## Key Principles

- **Python-Native**: Prefer code over no-code for core logic to minimize "Human Latency."
- **Stateless where possible**: Keep modules simple and easily replaceable.
- **Fail Gracefully**: Log errors to `08_LOG_VAULT/` but don't break the main loop.
- **Agentic Ready**: Ensure the tool can be invoked or read by other sub-agents.
