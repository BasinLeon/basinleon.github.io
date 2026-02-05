# 🦅 BASIN AI QUICK START

## When Cloud Credits Run Out

### Option 1: Terminal (Fastest)
```bash
# Quick query
python3 basin_ai.py "Explain the Isnad Protocol"

# Interactive chat
python3 basin_ai.py
```

### Option 2: Direct Ollama
```bash
# List installed models
ollama list

# Chat with specific model
ollama run llama3.2:3b
ollama run deepseek-coder:6.7b
ollama run qwen2.5:7b
ollama run llama3.1:8b
ollama run llava:7b
```

### Option 3: Python Launcher
```bash
python3 local_ai.py
# Then select model from menu
```

---

## 📊 YOUR MODEL ARSENAL

| Model | Size | Speed | Best For | Command |
|-------|------|-------|----------|---------|
| llama3.2:3b | 4GB | ⚡⚡⚡ | Quick tasks | `ollama run llama3.2:3b` |
| deepseek-coder:6.7b | 7GB | ⚡⚡ | Coding | `ollama run deepseek-coder:6.7b` |
| qwen2.5:7b | 7GB | ⚡⚡ | Strategy | `ollama run qwen2.5:7b` |
| llama3.1:8b | 8GB | ⚡⚡ | Deep reasoning | `ollama run llama3.1:8b` |
| llava:7b | 7GB | ⚡ | Images + text | `ollama run llava:7b` |

---

## 🔧 ANTIGRAVITY INTEGRATION

**Current Status:** Antigravity doesn't support custom models in dropdown (yet)

**Workaround:**
1. When you hit rate limits in Antigravity
2. Open Terminal
3. Run: `python3 basin_ai.py` 
4. Continue your work locally

**Future:** Check Antigravity settings for "MCP Servers" or "Custom Endpoints"
- If available, add: `http://localhost:11434`
- This would expose your local models to Antigravity

---

## 💡 PRO TIPS

**Save money:**
```bash
# Use local for drafts
ollama run deepseek-coder:6.7b "Write a Python function for X"

# Use cloud (Antigravity) for final polish
```

**Speed vs Quality:**
- Need answer NOW? → llama3.2:3b
- Need it RIGHT? → llama3.1:8b or qwen2.5:7b

**Coding workflow:**
1. Draft with deepseek-coder (local, free)
2. Review with Claude (cloud, costs credits)
3. Ship with confidence

---

## 🚨 TROUBLESHOOTING

**"Model not found"**
→ Run `ollama list` to see what's installed
→ Run `ollama pull <model>` to download

**"Connection refused"**
→ Run `brew services start ollama`

**Slow responses**
→ Use smaller model (3b instead of 8b)
→ Close other apps to free RAM

---

**You now have UNLIMITED AI access.** 🦅
Cloud credits = premium quality
Local models = unlimited quantity
