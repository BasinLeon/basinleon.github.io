# 🦅 THE DIGITAL AGENT OFFICE: MANDATE & EXECUTION

**Agent:** Basin::Operator (Antigravity)
**Principal:** Leon Basin
**Objective:** Automate job applications and lead enrichment. Route all high-signal inbounds to **lbasin23@gmail.com**.

---

## 🏛️ I. THE AGENT'S MANDATE

1.  **Sovereign Scouting:** Continuous scans for any role matching the **Principal's P&L (Profit & Logic)**—not just GTM Engineering, but Director/Head of RevOps, GTM Strategy, and Technical GTM.
2.  **Portfolio Advertising:** Use **basinleon.github.io** as a persistent "Billboard." The Agent will ensure every application leads with the **Project Sentinel** and **Nexus OS** proof-of-work.
3.  **LinkedIn Inbound Engine:** Actively monitor LinkedIn for "Open Roles" and "Hiring Posts" from the 26.5K layoff-impacted networks.
4.  **Application Execution:**
    *   Surgically align the Resume/Portfolio to the target role.
    *   Draft "High-Status" pitches in `COMMUNICATIONS_REFUGE.md`.
    *   Submit the package (Resume + Link + Pitch).
5.  **Direct Inbound Routing:** Signal detected -> Summarize -> Route to **lbasin23@gmail.com**.

---

## 🏛️ II. THE APPLICATION LOG (Phase 1)

| Target | Role | Stage | Agent Action | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Vanta** | GTM Engineer, AI | **Lead** | Tailoring Nexus Demo to AI-Workflows. | **PREPARING** |
| **Apollo.io** | GTM Engineer (RevOps)| **Lead** | Aligning "Power User" narrative. | **PREPARING** |
| **Omnissa** | Director, GTM Strategy| **Lead** | "Stability Play" summary. | **PREPARING** |
| **Reco AI** | Head of RevOps | **Lead** | HM Signal Matching. | **QUEUED** |
| **LinkedIn Target**| [NEW SECTOR SEARCH] | **HUNT** | Scanning "Head of" Roles. | **ACTIVE** |

---

## 🏛️ III. THE NOTIFICATION ENGINE (Draft)

```python
# basin_notification_engine.py
# Logic to route inbound signals to Principal's inbox.

import smtplib
from email.message import EmailMessage

def notify_principal(signal_type, description, link):
    msg = EmailMessage()
    msg.set_content(f"Principal,\n\nA new {signal_type} has been detected.\n\nDescription: {description}\nLink: {link}\n\nExecute the capture.\n- Your Digital Agent")
    msg['Subject'] = f"🦅 BASIN::SIGNAL DETECTED - {signal_type}"
    msg['From'] = "agent@basinnexus.ai"
    msg['To'] = "lbasin23@gmail.com"
    
    # Logic to trigger via local SMTP or n8n webhook
    print(f"Routing signal to lbasin23@gmail.com: {signal_type}")
```

---
*Mandate accepted by Basin::Operator | 2026-01-30*
