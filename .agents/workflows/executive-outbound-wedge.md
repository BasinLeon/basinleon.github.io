---
description: Execute High-Status Outbound Campaigns & Generate Targeted Wedges
---

This workflow defines the standard operating procedure for extracting executive contacts, generating high-status "Outbound Wedges," and tracking the execution of the outbound sequence in the master sheet. Use this when launching outbound campaigns targeting legacy manufacturing, healthcare, and credit union executives.

## Phase 1: Target Identification & Extraction
1. **Identify the Target Account**: Target legacy or enterprise-scale companies (e.g., Gillig, Simpson Strong-Tie, Stanford FCU, Omnicell).
2. **Identify the Decision Maker**: Isolate the C-Suite or VP level executives responsible for ops and revenue (e.g., Chief Operating Officer, Chief Commercial Officer, Chief Growth Officer, SVP of Operations).
3. **Extract Contact Info**: Locate the Executive Name and extract the verified Email Address using platforms like Apollo or Scrapling. 

## Phase 2: Hypothesis & Wedge Generation (Negative Constraints Active)
1. **Analyze Recent Company Signals**: Look for recent market moves: expansions, tech investments, supply chain shifts, or regional scaling.
2. **Draft the Outbound Wedge**: Generate a highly-tailored, technical intro line that highlights a specific operational friction point (the "logic gap"). The wedge should bridge their public signal with a localized structural issue.
   * **The Formula:** `[Observation of public signal/growth]` + `[Hypothesis of internal structural friction bridging front-end CRM to back-end ERP]`.
   * **Syntax Rule:** Zero exclamation points. Maximum two sentences.
   * **Banned Vocabulary:** Do not use the words *help, empower, synergize, transform, or streamline*. 
   * **Required Vocabulary:** Use *architect, bridge, eliminate friction, data latency, and logic gap*.
   * **The Persona:** The tone must be peer-to-peer, clinical, and structurally focused. You are diagnosing a system failure, not pitching a service.
   * *Example (Manufacturing/Supply Chain)*: "Saw the push for tech-driven supply chain resilience. Curious if your internal ops layer has the structural rigidity to eliminate data latency across fulfillment nodes."
   * *Example (Healthcare/Clinical)*: "Noticed the continued clinical momentum. Curious if your internal infrastructure is fully aligned to capitalize on that growth without adding operational overhead."
3. **Refine Voice (Architect vs. Vendor)**: Ensure the wedge sounds like a high-status systems engineer or Revenue Architect. Remove all traditional AI sales conversational filler.

## Phase 3: Tracker Setup & Execution Logging
1. **Log to Outbound Tracker**: Record the prospect details into the master execution sheet:
   * `Company`
   * `Executive Name`
   * `Title`
   * `Email Address`
   * `Outbound Wedge (Intro Line)`
2. **Define Next Action**: Update the `Notes / Next Action` column (e.g., "Verify email via Apollo; Queue for intro sequence", "Extracted / Needs sequence queued").
3. **Queue the Sequence**: Stage the contact and wedge for the automated sequence. Once the first touch goes out, log the date in `Date: Wedge Sent`.

## Phase 4: Omni-Channel Follow-up & Bump
1. **T+0 Action**: Agent logs initial Wedge email. Track responses and queue the follow-up bump. 
2. **T+4 Hour Action**: Agent prompts user to send a *blank* LinkedIn connection request to the target executive.
3. **T+72 Hour Conditional Trigger**: If Email 1 is unanswered AND the LinkedIn Connection is accepted, the agent prompts the user to deploy the 30-second LinkedIn Voice Note script.
4. **Log Bump**: Once the bump sequence triggers, log the date in `Date: Bump Sent`.

## Phase 5: The Fractional Pivot (The Backdoor)
1. **The Trigger**: If the target replies with an objection regarding headcount/budget (e.g., "We don't have the headcount/budget for a full-time hire.").
2. **The Output**: The agent automatically generates the Fractional Pivot response: *"Understood on headcount. Let's decouple the architecture from the W-2. I run this exact integration as a fixed-price 14-day sprint to unblock your Q2 pipeline without the overhead."*
