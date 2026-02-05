# 🦅 THE GTM ENGINEER HUNTING PROTOCOL

**Objective:** Systematically sweep the "Hidden Market" for GTM Engineering roles.
**Frequency:** Execute this loop every morning (Monday - Friday).

---

## 1. THE "NICHE" BOARDS (High Signal / Low Noise)
*These are where the "Founding GTM" roles live before hitting LinkedIn.*

### 🟢 Priority 1: The Systems Thinkers
1.  [Clay GTM Job Board](https://clay.com/jobs) (Target: "Growth Engineer", "Solutions Architect")
2.  [Unify GTM Engineering](https://unifygtm.com/jobs) (Target: "GTM Engineer")
3.  [GTMEcareers](https://gtmecareers.com) (Target: "Sales Engineer", "Technical Account Manager")

### 🟡 Priority 2: AI-Specific
1.  [AIJobs.ai](https://aijobs.ai) (Search: "GTM", "Revenue Operations")
2.  [HiringCafe](https://hiring.cafe) (Query: "GTM Engineer at Series A startup")

---

## 2. THE "BOOLEAN" SEARCH STRINGS (Copy-Paste)
*Use these exact strings in LinkedIn and Google to find hidden roles.*

**String A: The "Builder" Role**
```text
("GTM Engineer" OR "Growth Engineer" OR "Revenue Architect") AND ("Python" OR "n8n" OR "Automation") AND ("Startup" OR "Founding")
```

**String B: The "Ops" Shadow Role**
```text
("Head of Revenue Operations" OR "Founding PMM") AND ("Technical" OR "SQL" OR "API")
```

---

## 3. THE "CODE READER" CHEAT SHEET
*You asked: "What do I need to learn?"*
*Here is how to explain your `mad_scientist_pipeline.py` script to a CEO.*

**The 3 Key Blocks to Point At:**

**1. The "Eyes" (Lines 118-120)**
> "Here is where I call the **Enrichment Engine**. It hits the Clearbit API to normalize the domain and scrape the tech stack."

**2. The "Brain" (Lines 123-135)**
> "This function, `claude_reasoning_engine`, sends the tech stack data to Claude 3.5. We prompt it to act like a Senior SDR and generate a specific 'Hook' based on the software they use."

**3. The "Actions" (Lines 139-158)**
> "Finally, we store the strategy in **Supabase** (my vector database) and trigger **Lindy** to draft the email. It's a closed loop."

**Your Line:** *"I don't write generic scripts. I architect data flows."*

---

## 4. DAILY EXECUTION CHECKLIST
- [ ] Check Clay GTM Board.
- [ ] Check Unify GTM Board.
- [ ] Run LinkedIn Search String A.
- [ ] **If you find a role:** Run `python3 mad_scientist_pipeline.py --target [DOMAIN]` to inspect them.
- [ ] **Send the DM:** "I audited your stack..."
