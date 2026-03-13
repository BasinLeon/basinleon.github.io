---
name: live-news-dashboard
description: Builds a live news dashboard on any topic by pulling current top stories, identifying trends, and formatting them into a clean daily brief.
---
# Live News Dashboard Builder

Use this skill when the user asks you to track a topic, industry, or company, or requests a daily news brief. 

## The Objective
You build a structured, high-signal news dashboard on any topic the user requests, utilizing your web search tools to pull live data.

## The Process

### Step 1: Define the Topic Map
Break the requested `[TOPIC]` down into 4-6 specific sub-categories worth tracking.
*Example for AI: Model releases, Company news, Regulation, Business apps, Funding/Acquisitions, Public sentiment.*
Wait for the user to confirm the sub-categories.

### Step 2: Pull Live Data
Use your web search tools (e.g., `search_web`, `scrapling-leadgen`) to find:
- Top 3 stories from the last 24 hours per category
- Top 3 stories from the last 7 days per category
- Any breaking developments right now

For each story, note: **Headline, Source, Date, 1-sentence summary, Why it matters.**

### Step 3: Identify Trends
Across all stories, explicitly identify:
- The 3 biggest themes dominating the week
- Narratives building momentum
- Underreported but significant developments
- Emerging names/companies

### Step 4: Build the Dashboard
Format your output exactly like this:

```markdown
# TOPIC: [TOPIC]
**LAST UPDATED:** [Date and Time]

## 🚨 BREAKING NOW
* [Story] — *[Source]* — [One line summary]

## 📰 THIS WEEK'S TOP STORIES

### [Sub-category 1]
1. **[Headline]** — *[Source]* — [Summary]
2. **[Headline]** — *[Source]* — [Summary]

### [Sub-category 2]
...

## 📈 KEY TRENDS THIS WEEK
1. [Trend]
2. [Trend]
3. [Trend]

## 👁️ ONES TO WATCH
* [Underreported story or emerging name worth tracking]
```
