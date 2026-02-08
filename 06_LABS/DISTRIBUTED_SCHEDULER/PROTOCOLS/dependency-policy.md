# 🧩 BASIN::NEXUS DEPENDENCY POLICY

## Logic for External Tool & API Selection

### 1. ORCHESTRATION HIERARCHY

- **Clay:** Primary engine for Account/Identity enrichment.
- **n8n:** Primary engine for complex logic branching and long-running workflows.
- **Antigravity:** Primary engine for high-logic research and parallel agent orchestration.
- **Python Scripts:** Used as "Logic Gates" for custom transformations that external APIs cannot handle.

### 2. MODEL SELECTION MAPPING

- **Planning Mode:** Use Gemini 1.5 Pro / Claude 3.5 Sonnet.
- **Fast Mode:** Use Gemini Flash or similar high-velocity models.
- **Audit/Security:** Explicitly use Claude 3.5 Sonnet for its strict instruction following.

---

#### STATUS

*Status: Private // Internal Governance*
