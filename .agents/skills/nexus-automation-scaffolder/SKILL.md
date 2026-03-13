---
name: nexus-automation-scaffolder
description: "Use this to quickly generate the skeleton of a new Basin::Nexus automation module. Ensures consistency with the 'Signal Refinery' architecture principles."
---

# Nexus Automation Scaffolder

## Use when
Use this skill when we need to build a new technical pipeline (e.g., "Connect LinkedIn signals to Gmail drafts"). This moves from "Idea" to "Code Blueprint."

## The Scaffolding Logic
1.  **Trigger Definition**: What is the "Event" that starts the flow? (Webhook, Cron, DB Change).
2.  **Schema Design**: Define the JSON payload that moves through the system.
3.  **The Logic Layer**: Define the "Agents" or "Functions" that transform the data.
4.  **Error Handling**: How does the system handle a "Signal Void"?
5.  **Output Channel**: Where does the value end up? (CRM, Spreadsheet, Slack).

## Output Structure
Provide:
- **Mermaid Workflow Diagram**.
- **Python/JS Code Snippets** for the core logic.
- **Configuration YAML** for n8n or local deployment.

## High-Status Principles
- **Build Clean, Not Fast**: Prioritize modularity so the automation can be reused.
- **Instrument Everything**: Automatically add logging and "Yield Tracking" hooks.
- **No Hardcoding**: Everything must be environment-variable driven.
