---
description: How to run BASIN::NEXUS locally
---

# Running BASIN::NEXUS

// turbo-all

## Quick Method (Recommended)

1. Run the start script:

```bash
/Users/leonbasin/.gemini/antigravity/scratch/basin-signal-engine/run.sh
```

## Manual Method

1. Navigate to the project:

```bash
cd /Users/leonbasin/.gemini/antigravity/scratch/basin-signal-engine
```

2. Activate the virtual environment:

```bash
source venv/bin/activate
```

3. Start Streamlit:

```bash
streamlit run app.py --server.port 8501
```

4. Open in browser: <http://localhost:8501>

## Stopping the Server

- Press `Ctrl+C` in the terminal
- Or run: `pkill -f streamlit`

## Troubleshooting

- If port 8501 is in use: `lsof -ti:8501 | xargs kill -9`
- If module not found: `pip install streamlit feedparser groq requests`
