# 🛡️ BASIN::NEXUS SECURITY-FIRST RULEBOOK
## Governance for High-Risk Agent Operations

### 1. IDENTITY & PII PROTECTION
- **The Redaction Rule:** Agents are strictly forbidden from committing files containing `@` symbols in contact strings or 10-digit numeric strings that resemble phone numbers.
- **Redaction Protocol:** Replace PII with `{{REDACTED_CONTACT}}` or `{{LINKEDIN_ONLY}}`.

### 2. AUTHENTICATION & SECRETS
- **Zero-Trust Logic:** No secrets in `.py` or `.js` files. All keys must be pulled from `os.environ`.
- **Logic Isolation:** Authentication logic must be isolated from GTM logic to prevent leakage in speculative audits.

### 3. THIRD-PARTY OUTREACH (Anti-Spam)
- **Signal Threshold:** Automated outreach is only triggered if the "Logic Gate" identifies a high-density intent signal (e.g., Job Change + Tech Stack match).
- **The Human Loop:** Initial outreach templates must be approved by the USER_ARCHITECT once per campaign.

### 4. AUDIT TRAIL
- Every automated action must be logged in `08_LOG_VAULT/SCOUT_DAILY_YIELD.md`.
- The log must contain: Timestamp, Agent ID, Target Account, Logic Used, and Result.

---

#### STATUS
*Status: Private // Sovereign Security Protocol*
