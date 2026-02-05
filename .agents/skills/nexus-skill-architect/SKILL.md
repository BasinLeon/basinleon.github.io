---
name: nexus-skill-architect
description: "Meta-skill for designing, building, and refining new Basin::Nexus Agent Skills. Use when the user wants to codify a new workflow, process, or expert capability into the local OS."
---

# Nexus Skill Architect

## Overview

A meta-skill that ensures all your proprietary workflows are codified into high-performance "Agent Skills" following industry standards (Anthropic, GitHub, Vercel).

## The Process

### 1. Requirements Capture

- **Purpose**: What problem is this skill solving?
- **Triggers**: When should the agent automatically reach for this skill?
- **Expertise**: What specific Basin::Nexus frameworks does it use (e.g., "Signal Refinery," "Invisible Ledger")?

### 2. Design & Scaffolding

- **Name**: lowercase-kebab-case.
- **Frontmatter**: Descriptive and trigger-focused YAML.
- **Directory Structure**: Create `.agents/skills/<name>/SKILL.md`.
- **Resources**: Identify if help scripts (Python) or templates (Markdown) are required in `./scripts` or `./resources`.

### 3. Body Construction

- **"Use when"**: Define clear situational awareness.
- **The Process**: Step-by-step instructions with clear exit criteria.
- **High-Status Principles**: Inject the "Revenue Architect" voice into the instructions.
- **Examples**: Provide "Good" vs "Bad" output examples.

### 4. Validation & Deployment

- Check for Markdown linting compliance.
- Commit the skill folder to git.
- Perform a "Dry Run" by asking the agent to explain the new skill.

## Key Principles

- **Focus**: One skill, one core competency.
- **Modularity**: Skills should call each other where appropriate.
- **Documentation**: Assume the executing agent is skilled but context-poor.
- **Refinement**: Regularly review and update skills as your GTM strategy evolves.
