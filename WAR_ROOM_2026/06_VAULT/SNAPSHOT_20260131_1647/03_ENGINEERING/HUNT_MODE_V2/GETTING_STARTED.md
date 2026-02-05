# 🎯 GETTING STARTED: HUNT MODE v2.0

Welcome to **HUNT MODE v2.0**, your autonomous Revenue Architecture Job Search Engine. This system is designed to treat your career hunt like a high-performance GTM motion.

## 🛠 Choose Your Setup Path

Based on your experience level, choose one of the following paths:

### 🟢 Path 1: The "Executive" (Easy)
*Best if you want it running in 5 minutes without touching code.*
1. Run `./setup.sh` in your terminal.
2. Follow the prompts to enter your API keys.
3. Open `http://localhost:5678` and start hunting.

### 🟡 Path 2: The "Architect" (Intermediate)
*Best if you want to customize the AI prompts and workflows.*
1. Use `make install` to set up the environment.
2. Manually import `hunt-mode-automated-workflow.json` into n8n.
3. Configure your Airtable CRM using the `AIRTABLE_SCHEMA.md`.

### 🔴 Path 3: The "Engineer" (Advanced)
*Best for full control over the Docker infrastructure.*
1. Review `compose.yml` and customize volumes/networks.
2. Run `docker-compose up -d`.
3. Integrate with your own custom LLM endpoints (Mistral/Groq).

## 📁 What's Inside?
- `compose.yml`: Docker configuration for persistent n8n.
- `hunt-mode-automated-workflow.json`: The complete 13-node brain.
- `Airtable_Schema.md`: Instructions for your GTM CRM.
- `Quickstart.md`: Step-by-step UI guide.
- `setup.sh`: The "one-click" automation script.

---
*"I build the engine, not just run it."*
