# ⚡️ QUICKSTART GUIDE: HUNT MODE v2.0

Follow these 5 steps to get the system live.

### Step 1: Fire up the Engine
Open terminal in the `HUNT_MODE_V2` folder and run:
```bash
make setup
```

### Step 2: Open n8n Dashboard
Go to [http://localhost:5678](http://localhost:5678). If it's your first time, create an account.

### Step 3: Import the Brain
1. Go to **Workflows** -> **Add Workflow** -> **Import from File**.
2. Select `hunt-mode-automated-workflow.json`.

### Step 4: Connect Your Credentials
You need to add credentials for:
- **Google Gemini** (for fit scoring)
- **Mistral/Groq** (for content generation)
- **Airtable** (for your CRM)
- **Gmail** (for daily digests)

### Step 5: Activate
Flip the "Active" toggle in the top right.
The system will now run every morning at 9:00 AM. 

---
**Pro Tip:** You can manually trigger the "Job Discovery" node to run a test sweep immediately.
