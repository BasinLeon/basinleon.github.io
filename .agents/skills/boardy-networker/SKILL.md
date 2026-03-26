---
name: boardy-networker
description: Use when applying to startups, automating forms, or connecting with AI superconnectors like Boardy.ai. Handles form submissions, conversational interfaces, and resume uploads using the browser_subagent.
---

# Boardy & Superconnector Automator

AI networking platforms like Boardy.ai require a specific rhythm: answering conversational intake forms, uploading master resumes, and providing consistent networking profiles. This skill automates that workflow.

## Process Rules

1. **Locate the Master Resume:** Always source the latest tailored resume from `/Users/basin/Desktop/Basin & Associates 🌍/03_RESUME_VAULT/Current/`. Default to `Leon_Basin_Resume_RevOps_Architect_2026.pdf` unless directed otherwise.
2. **Invoke the Subagent:** Do NOT attempt to curl or scrape the frontend. Instigate the `browser_subagent` to interact natively with `https://www.boardy.ai` or similar matchmaking websites.
3. **Fill the Standard Profile:**
   - **Name:** Leon Basin
   - **Email:** lbasin23@gmail.com
   - **LinkedIn:** https://www.linkedin.com/in/lbasin/
   - **Target Role:** Revenue Architect / Founding GTM
4. **Respond like a Human:** If the AI platform has a chat interface, use the `humanizer` framework to keep answers brief, omitting filler words, em-dashes, and AI pleasantries.
5. **Log Outcomes:** When the submission succeeds or the AI connects you, immediately log the status in the day's Obsidian session record.
