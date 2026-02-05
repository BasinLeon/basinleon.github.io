# HUNT MODE v2.0 🚀
**The Autonomous Revenue Architect Job Search Engine**

HUNT MODE is a self-hosted GTM automation platform that leverages n8n and Multi-Model AI (Gemini, Mistral, Groq) to find, score, and prepare applications for Director-level roles.

## 🚀 Quick Launch
```bash
./setup.sh
```

## 🧠 The Engine
- **Discovery:** Automated sweeps of LinkedIn and Indeed.
- **Scoring:** Gemini-Pro evaluates roles against your 83k lines of code and $23M pipeline history.
- **Generation:** Mistral and Groq handle the heavy lifting of cover letters and talking points.
- **CRM:** Syncs everything to Airtable for a professional pipeline view.

## 📁 System Structure
- `/n8n_data`: Persistent storage for your workflows and credentials.
- `hunt-mode-automated-workflow.json`: The master logic file.
- `Makefile`: Management shortcuts (`make start`, `make stop`).

---
*"I build the engine, not just run it."*
