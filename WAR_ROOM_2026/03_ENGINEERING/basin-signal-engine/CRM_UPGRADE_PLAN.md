# 🚀 PIPELINE CRM v2.0 — ENTERPRISE UPGRADE PLAN

## **CURRENT STATE ANALYSIS**

### ✅ What Exists

- Contact database (session state)
- Deal pipeline (session state)
- Basic data editor tables
- Win/Loss feedback
- Calendar integration
- Network builder
- Market intel (stock prices)
- Networking hub
- Daily briefing

### ❌ Critical Bugs Found

1. **No Database Persistence** — Contacts/Deals stored only in session state, lost on refresh
2. **Hardcoded dates** — "12/06" hardcoded instead of dynamic
3. **No activity timeline** — No way to see interaction history per contact/deal
4. **No follow-up automation** — No reminders or scheduling
5. **Missing fields** — No email, phone, LinkedIn URL, salary range, etc.
6. **No deal value** — Can't track expected comp or projected revenue
7. **No pipeline velocity** — Can't measure time in each stage
8. **No conversion analytics** — No funnel metrics

---

## **🏗️ ENTERPRISE CRM ARCHITECTURE**

### Phase 1: Data Model Upgrade (Foundation)

#### NEW: `deals` Table Schema

```sql
CREATE TABLE deals (
    id INTEGER PRIMARY KEY,
    company TEXT NOT NULL,
    role TEXT,
    job_url TEXT,                    -- Link to original posting
    stage TEXT,
    substage TEXT,                   -- Detailed substage tracking
    priority INTEGER DEFAULT 2,
    signal TEXT,
    base_salary_min INTEGER,
    base_salary_max INTEGER,
    ote_min INTEGER,
    ote_max INTEGER,
    equity_range TEXT,
    remote_policy TEXT,              -- Remote/Hybrid/Onsite
    company_stage TEXT,              -- Seed/Series A/B/C/Public
    company_size TEXT,               -- 1-50/50-200/200-1000/1000+
    hiring_manager TEXT,
    recruiter_name TEXT,
    source TEXT,                     -- How you found it
    referral_contact_id INTEGER,     -- FK to contacts
    applied_date TIMESTAMP,
    next_interview_date TIMESTAMP,
    offer_deadline TIMESTAMP,
    expected_close_date TIMESTAMP,
    rejection_reason TEXT,
    win_reason TEXT,
    notes TEXT,
    tags TEXT,                       -- JSON array of tags
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### NEW: `contacts` Table Schema

```sql
CREATE TABLE contacts (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    company TEXT,
    role TEXT,
    email TEXT,
    phone TEXT,
    linkedin_url TEXT,
    twitter_handle TEXT,
    relationship_strength INTEGER,   -- 1-5 scale
    contact_type TEXT,               -- Recruiter/HM/Champion/Peer/Exec
    status TEXT,
    channel TEXT,                    -- How you communicate
    last_contacted TIMESTAMP,
    next_touchpoint TIMESTAMP,
    total_interactions INTEGER,
    notes TEXT,
    tags TEXT,
    deal_id INTEGER,                 -- FK to deals
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### NEW: `activities` Table (Timeline)

```sql
CREATE TABLE activities (
    id INTEGER PRIMARY KEY,
    deal_id INTEGER,
    contact_id INTEGER,
    activity_type TEXT,              -- Call/Email/LinkedIn/Interview/Offer
    direction TEXT,                  -- Inbound/Outbound
    summary TEXT,
    outcome TEXT,                    -- Positive/Neutral/Negative
    follow_up_date TIMESTAMP,
    follow_up_action TEXT,
    attachments TEXT,                -- JSON paths
    sentiment TEXT,                  -- AI-analyzed sentiment
    created_at TIMESTAMP
);
```

#### NEW: `interview_stages` Table

```sql
CREATE TABLE interview_stages (
    id INTEGER PRIMARY KEY,
    deal_id INTEGER NOT NULL,
    stage_name TEXT,                 -- Recruiter/HM/Tech/Culture/Final
    interviewer_name TEXT,
    interviewer_role TEXT,
    scheduled_date TIMESTAMP,
    duration_minutes INTEGER,
    format TEXT,                     -- Video/Phone/Onsite
    focus_area TEXT,                 -- Technical/Behavioral/Case
    questions_asked TEXT,            -- JSON
    your_questions TEXT,             -- JSON
    score INTEGER,                   -- 1-10
    feedback TEXT,
    outcome TEXT,                    -- Passed/Failed/Pending
    created_at TIMESTAMP
);
```

---

### Phase 2: UI/UX Overhaul

#### New Tab Structure

1. **📊 COMMAND CENTER** — Executive dashboard
2. **🎯 PIPELINE VIEW** — Kanban + list hybrid
3. **👥 CONTACTS** — Full contact management
4. **📅 CALENDAR** — Interview scheduling
5. **📈 ANALYTICS** — Conversion/velocity metrics
6. **🔔 TASKS** — Follow-up queue
7. **📜 ACTIVITY LOG** — Full timeline
8. **🧠 AI COACH** — Interview prep by deal

#### Pipeline View Features

- **Kanban Board** — Drag-drop between stages
- **List View** — Sortable/filterable table
- **Timeline View** — Visual timeline per deal
- **Calendar View** — Interview-centric view

#### Contact Management

- **Contact Cards** — Rich cards with all info
- **Relationship Map** — Network visualization
- **Quick Actions** — One-click email/call/LinkedIn
- **Merge Duplicates** — Contact deduplication

---

### Phase 3: Automation & Intelligence

#### Smart Reminders

- Follow-up reminders based on last touch
- Stale deal alerts (no activity in X days)
- Interview prep triggers (24hr before)
- Offer deadline countdowns

#### AI Features

- Auto-parse job descriptions (extract salary, stack, etc.)
- Company research automation
- Email/message suggestions based on context
- Interview prep personalized to deal stage

#### Analytics

- **Funnel Metrics** — Application → Screen → Interview → Offer → Accept
- **Velocity** — Avg time in each stage
- **Source Analysis** — Which channels convert best
- **Rejection Analysis** — Common rejection reasons

---

## **🛠️ IMPLEMENTATION ORDER**

### TODAY (Bug Fixes + Persistence)

1. ✅ Fix hardcoded dates
2. ✅ Add database persistence for deals/contacts
3. ✅ Add activity logging
4. ✅ Fix any bugs in current CRM

### THIS WEEK (Core Features)

5. Expand deal schema (salary, URL, etc.)
6. Expand contact schema (email, phone, LinkedIn)
7. Add kanban pipeline view
8. Add activity timeline

### NEXT WEEK (Intelligence)

9. Interview prep integration per deal
10. Smart follow-up reminders
11. Pipeline analytics dashboard
12. AI company research

---

## **KEY METRICS TO TRACK**

| Metric | Formula |
|--------|---------|
| **Pipeline Coverage** | Active Deals / Target Offers |
| **Application Rate** | Apps Sent / Week |
| **Screen Rate** | Screens / Applications |
| **Interview Rate** | Interviews / Screens |
| **Offer Rate** | Offers / Final Rounds |
| **Accept Rate** | Accepts / Offers |
| **Avg Velocity** | Days in Pipeline |
| **Response Rate** | Responses / Outreach |
| **Stale Deals** | No Activity 7+ Days |

---

## **LET'S BUILD THIS 🚀**

Starting with: Bug fixes + Database persistence
