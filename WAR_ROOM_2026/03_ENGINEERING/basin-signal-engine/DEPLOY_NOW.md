# 🚀 BASIN::NEXUS — STREAMLIT CLOUD DEPLOYMENT

## Quick Deploy (5 Minutes)

### Step 1: Go to Streamlit Cloud

Open: **<https://share.streamlit.io>**

### Step 2: Sign In with GitHub

- Click "Sign up" or "Log in"
- Authorize with your GitHub account (BasinLeon)

### Step 3: Create New App

1. Click **"New app"** button
2. Fill in the form:

| Field | Value |
|-------|-------|
| Repository | `BasinLeon/basin-signal-engine` |
| Branch | `main` |
| Main file path | `app.py` |
| App URL | `basin-nexus` (makes it basin-nexus.streamlit.app) |

### Step 4: Configure Secrets

1. Click **"Advanced settings"** before deploying
2. In the **Secrets** section, paste:

```toml
GROQ_API_KEY = "gsk_YOUR_ACTUAL_GROQ_API_KEY_HERE"
```

**Get your Groq API key at:** <https://console.groq.com/keys>

### Step 5: Deploy

Click **"Deploy!"** — wait 2-3 minutes for build.

---

## 🔐 Required Secrets

| Secret | Required | Description |
|--------|----------|-------------|
| `GROQ_API_KEY` | ✅ Yes | Powers all LLM features |
| `OPENAI_API_KEY` | ❌ Optional | For GPT-4 fallback |
| `GOOGLE_API_KEY` | ❌ Optional | For Gemini |

---

## ✅ Pre-Deployment Checklist

- [x] All code committed to main branch
- [x] `requirements.txt` complete (35 dependencies)
- [x] `.streamlit/config.toml` with golden theme
- [x] `secrets.toml.example` for reference
- [x] No hardcoded API keys in code
- [x] All bare `except:` clauses fixed
- [x] Session state centralized
- [x] Caching added for performance

---

## 🌐 After Deployment

**Your app will be live at:**
`https://basin-nexus.streamlit.app`

### Post-Launch Actions

1. **Test all modules** — Interview Prep, Hunt Mode, Pipeline CRM
2. **Update basinleon.github.io** — Add live NEXUS link
3. **Update GitHub README** — Add deployed URL badge
4. **Share on LinkedIn** — Announce with #IWriteICode

---

## 🔧 Troubleshooting

### "ModuleNotFoundError"

- Check `requirements.txt` includes all dependencies
- Rebuild: Settings → Reboot app

### "GROQ_API_KEY not found"

- Verify secret is set in Streamlit Cloud settings
- Format: `GROQ_API_KEY = "gsk_..."` (with quotes)

### App shows but LLM not working

- API key may be invalid or expired
- Check Groq dashboard for quota

### Slow performance

- Caching is now enabled (5-10 min TTL)
- First load may be slow, subsequent loads fast

---

## 📊 Current Metrics

| Metric | Value |
|--------|-------|
| Lines of Code | 8,412 |
| Modules | 18 |
| Database Tables | 10 |
| LLM Providers | 5 |
| Version | v0.5 |

---

*Last Updated: 2025-12-07 | BASIN::NEXUS Executive OS*
