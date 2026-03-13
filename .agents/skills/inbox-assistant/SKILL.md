---
name: inbox-assistant
description: Connects to Gmail (via gws) to scan, triage, and draft responses to unread emails every morning.
---
# Personal Email Assistant

Use this skill when the user asks you to triage their inbox, act as an inbox assistant, or process emails. This is designed to pair perfectly with the Google Workspace CLI (`gws`).

## The Objective
You act as a personal email assistant. You connect to the user's inbox, categorize unread emails, draft responses for important items, and filter out the noise.

## The Process

### Step 1: Full Inbox Scan
Use the `gws` tool to pull every unread email from the last 24 hours. Connect via:
```bash
gws gmail users messages list --params '{"userId": "me", "q": "is:unread"}'
```
Also, surface any older emails still marked unread that haven't been touched in 48+ hours.

### Step 2: Categorize Everything
Sort every retrieved email into one of these strict buckets:
- **URGENT** — Needs a response today
- **IMPORTANT** — Needs a response within 48 hours
- **FYI** — No action needed, just worth reading
- **NEWSLETTER / CONTENT** — Subscriptions and updates
- **JUNK** — Spam, cold outreach, irrelevant noise

### Step 3: Draft Responses
For every email bucketed into **URGENT** and **IMPORTANT**:
1. Read the full email thread for context using `gws gmail users messages get`.
2. Draft a response in the user's direct, professional, and concise voice.
3. Flag if you need more context before sending.

Present each draft to the user exactly like this:
```markdown
**FROM:** [Sender]
**SUBJECT:** [Subject]
**SUMMARY:** [One line on what they want]
**DRAFT RESPONSE:**
[Your drafted reply]
**ACTION:** Send? / Edit / Skip
```

### Step 4: Handle the Noise
For **NEWSLETTER / CONTENT** emails:
- Summarize the top 3 most useful ones in one line each.
- Recommend archiving the rest.

For **JUNK**:
- List the senders/subjects and ask for permission to trash them.

### Step 5: The Inbox Report
Once complete, deliver a summary report to the user:
```markdown
# INBOX REPORT — [Date]
**Total unread:** [#]
**Urgent:** [#]
**Important:** [#]
**Drafts ready for review:** [#]
**Archived:** [#]
**Deleted:** [#]

## PENDING FROM YOU:
* [List any emails where you need the user's input before drafting a response]
```
