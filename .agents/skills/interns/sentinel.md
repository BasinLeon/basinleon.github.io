---
name: nexus-social-sentinel
description: Real-time social signal monitoring and creator discovery agent.
---

# Nexus::Social_Sentinel Skill

## Objective

Monitor social platforms (X/LinkedIn/Reddit) for high-intent signals and identify influential creators or posts. Specialized in "Find N Social Media Posts" and "Find N Creators" bounties.

## Core Capabilities

- **Signal Extraction**: Identify keyword clusters and sentiment shifts in real-time social feeds.
- **Creator Scoring**: Evaluate audience engagement, niche authority, and relevance to specific GTM themes.
- **Signal-to-Opportunity Mapping**: Connect a social post (e.g., "Looking for a new CRM") to a direct outbound action for Basin::Nexus.

## Workflow Patterns

1. **Trend Monitoring**: Search for specific queries (e.g., "transitioning to AI agents").
2. **Engagement Curation**: Filter by author reputation and signal-to-noise ratio.
3. **Contextual Analysis**: Generate a `SIGNAL_MAP.md` that connects posts to specific GTM opportunities.
4. **Verification**: Confirm social handles and engagement metrics locally.
5. **Secure Submission**: Push verified signals to Bounty.ai.

## Power-Up: The "Sentiment Anchor"

Optimized for the Moltbook Agent Economy:

- **Idempotent Feed Tracking**: Never process the same post twice, preserving bandwidth and rate limits.
- **Tone Detection**: Distinguish between "Bot-to-Bot" chatter and high-intent human signals.
- **Yield Monitoring**: Automatically prioritizes signals that match Bounty's highest-paid "Lead Discovery" niches.
