I Built a Whale Detector in 3 Hours.
(How Basin::Nexus routes leads in <200ms)

Last night, I got tired of the noise.

I realized my system was treating everyone the same. A Chief Revenue Officer at a Fortune 500 company would take my assessment and get the exact same "Thank You" email as a college student.

That’s not architecture. That’s a mail merge.

So I opened up the code and built a "Whale Detector."

This isn't a metaphor. It’s an actual system that takes a lead, enriches it in real-time, and decides in under 200 milliseconds whether to alert me or nurture them.

Here is exactly how I built it (and the code is below).

***

### The Problem: "Flat" GTM

Most companies have what I call "Flat Architecture."

Ingest Lead → Add to CSV → Send Drip Sequence.

It’s efficient, but it’s dumb. It creates a waiting room where your best leads—the "Whales"—rot alongside the "Minnows" for 48 hours until a human SDR logs in.

I wanted zero latency. 

When a VP hits my server, I want my phone to buzz before they even verify their email.

### The Solution: The Signal Refinery

I wrote a simple classification engine. It doesn't use complex ML models. It uses common sense.

Here represents the logic I shipped:

```python
# The Classification Engine
WHALE_TITLES = ["chief", "vp", "vice president", "director", "founder"]
WHALE_REVENUE_THRESHOLD = 50  # $50M+

def classify_lead(lead):
    # Simple logic beats complex AI 
    title = lead.job_title.lower()
    whale_title = any(t in title for t in WHALE_TITLES)
    whale_revenue = lead.company_revenue >= WHALE_REVENUE_THRESHOLD
    
    if whale_title or whale_revenue:
        return "🐋 WHALE"  # Wake me up
    else:
        return "🐟 MINNOW"  # Send them love (automatically)
```

That’s it. 
No "Intent Score." 
No "Predictive Analytics." 
Just: **Is this person a decision maker?** Yes/No.

### The Architecture

I wired this logic into the intake webhook. Here is the full blueprint:

[INSERT DIAGRAM HERE]

**The Stats:**
- **Latency:** <200ms from form submit to Slack alert.
- **Cost:** ~$100/mo (Enrichment APIs).
- **Impact:** I deleted the "Human Latency" gap.

### Why This Matters

By the time a human sees a notification, the buying window is technically closing. 

We talk about "Speed to Lead," but we usually mean "how fast can a human dial." 
I’m talking about "how fast can the system think."

When a Whale gets their report, they don't see a score. They see a **Career Trajectory Report**. They see the gap between where they are and where they want to be. 

And while they are reading that PDF, I am already calling them.

### What I Learned

1. **Speed beats perfection.** A slightly wrong routing decision made in 200ms is infinitely more valuable than a perfect decision made in 2 days.
2. **Titles > Scores.** Job title is still the highest signal proxy for budget.
3. **The User doesn't care.** They just want the report. The routing happens in the dark.

I’m running this live on traffic this week. If the conversion lift holds (+22% projected), I’ll open source the entire repo.

**Subscribe to get the update.**

- Leon
