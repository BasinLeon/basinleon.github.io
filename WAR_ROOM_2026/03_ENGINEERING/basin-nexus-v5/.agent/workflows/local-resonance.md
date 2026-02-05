---
description: how to activate local resonance (Ollama + Cline)
---

# 🛰️ Local Resonance Activation Protocol

Follow these steps to link your local Mac hardware directly into the AI agent workflow.

## 1. Verify Local Engine
Run the resonance check from your terminal:
```bash
npm run local-agent
```
*Expected: "Status: ONLINE"*

## 2. Configure Cline (Kangaroo Icon)
1. Open the **Cline** extension from the sidebar.
2. Select **"Bring my own API key"**.
3. In the "API Provider" dropdown, select **Ollama**.
4. Model ID: `deepseek-r1:14b` (for complex audits) or `phi4` (for fast edits).
5. Base URL: `http://localhost:11434`

## 3. Global Dashboard Integration
1. Open the **"The Dojo"** or **"Sniper Scope"** in the Nexus UI.
2. Use the Model Selector in the sidebar.
3. Select any model labeled **(Local)**.

## 4. Emergency Fallback
If you run out of credits, switch to `GPT-OSS DeepSeek R1 (14B)` in the Agent Manager dropdown to use local chips.
