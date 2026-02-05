# 🦅 LOCAL LLM SETUP GUIDE
## Emergency Backup When API Credits Run Out

---

## ⚡ QUICK START (macOS)

### 1. Install Ollama
```bash
brew install ollama
```

### 2. Start Ollama Service
```bash
ollama serve
```
(Leave this running in a terminal)

### 3. Pull a Model (New Terminal)
```bash
# Fastest (4GB RAM, good for quick tasks)
ollama pull llama3.2:3b

# OR: More powerful (8GB RAM, better reasoning)
ollama pull llama3.1:8b

# OR: Best for coding (7GB RAM)
ollama pull deepseek-coder:6.7b
```

### 4. Test It
```bash
ollama run llama3.2:3b "What is the Isnad Protocol?"
```

---

## 🔗 CONNECT TO ANTIGRAVITY

### Option A: MCP Server (If Supported)
1. Check Antigravity settings for "MCP Servers" or "Custom Models"
2. Add endpoint: `http://localhost:11434`
3. Select model: `llama3.2:3b`

### Option B: API Wrapper (Fallback)
If Antigravity doesn't support custom MCP, create a Python wrapper:

```python
# local_llm_wrapper.py
import requests
import json

def query_ollama(prompt, model="llama3.2:3b"):
    url = "http://localhost:11434/api/generate"
    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False
    }
    response = requests.post(url, json=payload)
    return response.json()['response']

# Usage
print(query_ollama("Explain the Isnad Protocol"))
```

---

## 📊 MODEL COMPARISON

| Model | RAM | Speed | Use Case |
|-------|-----|-------|----------|
| llama3.2:3b | 4GB | ⚡⚡⚡ | Quick tasks, chat |
| llama3.1:8b | 8GB | ⚡⚡ | Strategy, analysis |
| deepseek-coder:6.7b | 7GB | ⚡⚡ | Code generation |
| qwen2.5-coder:7b | 7GB | ⚡⚡ | Code + reasoning |

---

## 🎯 WHEN TO USE WHAT

**Cloud (Gemini/Claude):**
- Complex strategy
- Long context (100k+ tokens)
- Final "ship" decisions

**Local (Ollama):**
- Quick edits
- Bulk processing
- Testing ideas
- When credits are low

---

## ⚠️ TROUBLESHOOTING

**"Connection refused"**
→ Make sure `ollama serve` is running

**"Model not found"**
→ Run `ollama list` to see installed models

**Slow responses**
→ Use smaller model (3b instead of 8b)

---

**Status:** Installing now via Homebrew
**Next:** Pull model + test
**Goal:** Never run out of AI assistance 🦅
