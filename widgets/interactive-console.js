/**
 * BASIN::NEXUS Interactive Console
 * Self-contained widget with AUTH system and REDACTED protocol
 * 
 * "The signal exists on multiple planes. Those who seek, find."
 */

(function () {
    'use strict';

    // STATE MANAGEMENT
    let commandHistory = [];
    let historyIndex = -1;
    let isAuthenticated = false; // Default: Locked

    // Console Styles
    const STYLES = `
        .console-widget {
            background: #0a0a0f;
            border: 1px solid rgba(212, 175, 55, 0.3);
            border-radius: 8px;
            overflow: hidden;
            font-family: 'JetBrains Mono', 'Courier New', monospace;
            font-size: 13px;
        }
        .console-header {
            background: linear-gradient(90deg, #1a1a24 0%, #0f0f18 100%);
            padding: 10px 16px;
            border-bottom: 1px solid rgba(212, 175, 55, 0.3);
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .console-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
        }
        .console-dot.red { background: #ff5f56; }
        .console-dot.yellow { background: #ffbd2e; }
        .console-dot.green { background: #27c93f; }
        .console-header-title {
            color: #888;
            font-size: 11px;
            margin-left: 8px;
        }
        #console-body {
            padding: 16px;
            max-height: 400px;
            overflow-y: auto;
            background: #050508;
        }
        #console-output {
            margin-bottom: 12px;
        }
        .output-line {
            color: #c0c0c0;
            margin-bottom: 4px;
            line-height: 1.5;
        }
        .output-line .prompt {
            color: #D4AF37;
        }
        .output-line .prompt.admin {
            color: #27c93f;
        }
        .output-line .cmd {
            color: #4fc3f7;
        }
        .output-line.text-green {
            color: #27c93f;
        }
        .output-line.text-yellow {
            color: #ffbd2e;
        }
        .output-line.text-cyan {
            color: #4fc3f7;
        }
        .output-line.text-red {
            color: #ff5f56;
        }
        .output-line.text-purple {
            color: #a855f7;
        }
        .output-line.error {
            color: #ff5f56;
        }
        .console-input-line {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .console-input-line .prompt {
            color: #D4AF37;
            white-space: nowrap;
        }
        #console-input {
            flex: 1;
            background: transparent;
            border: none;
            color: #f0e6d3;
            font-family: inherit;
            font-size: 13px;
            outline: none;
            caret-color: #D4AF37;
        }
        #console-input::placeholder {
            color: #555;
        }
    `;

    function createConsoleUI() {
        const container = document.getElementById('basin-console');
        if (!container) return;

        // Inject styles
        const styleEl = document.createElement('style');
        styleEl.textContent = STYLES;
        document.head.appendChild(styleEl);

        // Create console HTML
        container.innerHTML = `
            <div class="console-widget">
                <div class="console-header">
                    <span class="console-dot red"></span>
                    <span class="console-dot yellow"></span>
                    <span class="console-dot green"></span>
                    <span class="console-header-title">basin-nexus — zsh</span>
                </div>
                <div id="console-body">
                    <div id="console-output">
                        <div class="output-line">Welcome to BASIN::NEXUS v10.0</div>
                        <div class="output-line">Type <span class="cmd">help</span> for commands, or try <span class="cmd">sitrep</span></div>
                        <div class="output-line">&nbsp;</div>
                    </div>
                    <div class="console-input-line">
                        <span class="prompt" id="console-prompt">guest@basin-nexus:~$</span>
                        <input type="text" id="console-input" placeholder="type a command..." autocomplete="off" spellcheck="false">
                    </div>
                </div>
            </div>
        `;

        // Get references
        const input = document.getElementById('console-input');
        const output = document.getElementById('console-output');
        const terminalBody = document.getElementById('console-body');
        const promptEl = document.getElementById('console-prompt');

        // Focus management
        terminalBody.addEventListener('click', () => input.focus());

        // Mobile fix
        input.addEventListener('focus', () => {
            setTimeout(() => {
                terminalBody.scrollTop = terminalBody.scrollHeight;
            }, 300);
        });

        // Keyboard handling
        input.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    input.value = commandHistory[commandHistory.length - 1 - historyIndex];
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (historyIndex > 0) {
                    historyIndex--;
                    input.value = commandHistory[commandHistory.length - 1 - historyIndex];
                } else {
                    historyIndex = -1;
                    input.value = '';
                }
            } else if (e.key === 'Tab') {
                e.preventDefault();
                const validCmds = ['help', 'about', 'stack', 'projects', 'contact', 'sitrep', 'gravity', 'clear', 'auth'];
                const current = input.value.toLowerCase();
                const match = validCmds.find(c => c.startsWith(current));
                if (match) input.value = match;
            } else if (e.key === 'Enter') {
                executeCommand(input.value.trim(), promptEl);
            }
        });
    }

    function executeCommand(command, promptEl) {
        const input = document.getElementById('console-input');
        const output = document.getElementById('console-output');
        const terminalBody = document.getElementById('console-body');

        if (command) {
            commandHistory.push(command);
            historyIndex = -1;
        }
        input.value = '';

        // Show command with current auth state
        const cmdLine = document.createElement('div');
        cmdLine.className = 'output-line';
        const promptClass = isAuthenticated ? 'prompt admin' : 'prompt';
        const promptText = isAuthenticated ? 'admin@basin-nexus:~$' : 'guest@basin-nexus:~$';
        cmdLine.innerHTML = `<span class="${promptClass}">${promptText}</span> ${command}`;
        output.appendChild(cmdLine);

        // Process command
        processCommand(command, output, promptEl);

        // Scroll
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    function printLine(output, text, className = 'output-line') {
        const line = document.createElement('div');
        line.className = className;
        if (text.includes('╔') || text.includes('█') || text.includes('│')) {
            line.style.whiteSpace = 'pre';
            line.style.fontFamily = "'JetBrains Mono', monospace";
            line.style.lineHeight = '1.2';
        }
        line.innerHTML = text;
        output.appendChild(line);
    }

    function triggerGravity(output) {
        const lines = output.querySelectorAll('.output-line');
        lines.forEach(line => {
            line.style.transition = 'transform 1s ease-in, opacity 1s';
            const randomRot = Math.random() * 90 - 45;
            const randomY = Math.random() * 500 + 100;
            line.style.transform = `translateY(${randomY}px) rotate(${randomRot}deg)`;
            line.style.opacity = '0';
        });
        setTimeout(() => {
            output.innerHTML = '';
            printLine(output, "⚠️ SYSTEM CRASH DETECTED.", "text-red");
            setTimeout(() => printLine(output, "REBOOTING KERNEL...", "text-yellow"), 800);
            setTimeout(() => printLine(output, "SYSTEM ONLINE. WELCOME BACK, ARCHITECT.", "text-green"), 1800);
        }, 1200);
    }

    function processCommand(rawCmd, output, promptEl) {
        const lowerCmd = rawCmd.toLowerCase().trim();
        const parts = lowerCmd.split(' ');
        const cmd = parts[0];
        const arg = parts[1] || '';

        // AUTH SYSTEM - Secret unlock code
        if (cmd === 'auth') {
            if (arg === 'nexus') {
                isAuthenticated = true;
                promptEl.textContent = 'admin@basin-nexus:~$';
                promptEl.classList.add('admin');
                printLine(output, "🔓 ACCESS GRANTED. LEVEL 5 CLEARANCE CONFIRMED.", "text-green");
                printLine(output, "Type <span class='cmd'>sitrep</span> to view declassified intel.", "text-green");
                return;
            } else if (arg === 'logout') {
                isAuthenticated = false;
                promptEl.textContent = 'guest@basin-nexus:~$';
                promptEl.classList.remove('admin');
                printLine(output, "Session terminated. Guest mode active.", "text-yellow");
                return;
            } else {
                printLine(output, "❌ ACCESS DENIED. Invalid clearance code.", "text-red");
                return;
            }
        }

        // Easter egg: gravity effect
        if (lowerCmd === 'gravity') {
            triggerGravity(output);
            return;
        }

        // SITREP with auth check
        if (lowerCmd === 'sitrep' || lowerCmd === 'status') {
            if (isAuthenticated) {
                // DECLASSIFIED VIEW (ADMIN)
                printLine(output, `
╔══════════════════════════════════════════════════════════════════╗
║  MISSION SITREP: DECLASSIFIED ACCESS                             ║
╠══════════════════════════════════════════════════════════════════╣
║  DATE: JAN 14 2026  │  STATUS: HIGH VELOCITY                     ║
╠══════════════════════════════════════════════════════════════════╣
║  TARGET           │  ROLE                 │  STATUS              ║
╠═══════════════════╪═══════════════════════╪══════════════════════╣
║  AMBIENT.AI       │  Founding GTM Eng     │  ON-SITE (FRI)       ║
║  SENDBIRD         │  Mgr, Global SDR      │  INTERVIEW (THU)     ║
║  BRM LABS         │  Founding GTM Eng     │  INTERVIEW (WED)     ║
║  LIVERAMP         │  Identity Strategy    │  ACTIVE ROUNDS       ║
╠══════════════════════════════════════════════════════════════════╣
║  OPERATIONAL NOTES:                                              ║
║  > Ambient: "Refinery" Architecture Deployed. Artifacts Sent.    ║
║  > Sendbird: Portfolio implanted in calendar invites.            ║
║  > BRM Labs: JD is a 95% match for Basin::Nexus.                 ║
╠══════════════════════════════════════════════════════════════════╣
║  SYSTEM STATUS: ALL GREEN. READY TO DEPLOY.                      ║
╚══════════════════════════════════════════════════════════════════╝
                `, 'text-green');
            } else {
                // REDACTED VIEW (PUBLIC)
                printLine(output, `
╔══════════════════════════════════════════════════════════════════╗
║  MISSION SITREP: ACTIVE PIPELINE OPERATIONS                      ║
╠══════════════════════════════════════════════════════════════════╣
║  DATE: JAN 14 2026  │  STATUS: HIGH VELOCITY                     ║
╠══════════════════════════════════════════════════════════════════╣
║  TARGET           │  ROLE                 │  STATUS              ║
╠═══════════════════╪═══════════════════════╪══════════════════════╣
║  [REDACTED]       │  Founding GTM Eng     │  FINAL STAGE         ║
║  [REDACTED]       │  Mgr, Global SDR      │  ACTIVE ROUNDS       ║
║  [REDACTED]       │  Founding GTM Eng     │  ACTIVE ROUNDS       ║
║  [REDACTED]       │  Identity Strategy    │  IN PROGRESS         ║
╠══════════════════════════════════════════════════════════════════╣
║  SECURITY PROTOCOL:                                              ║
║  > Target names classified to protect ongoing negotiations.      ║
║  > "Revenue Architect" framework deployed across all vectors.    ║
╠══════════════════════════════════════════════════════════════════╣
║  SYSTEM STATUS: ALL GREEN.                                       ║
╚══════════════════════════════════════════════════════════════════╝
                `, 'text-yellow');
            }
            return;
        }

        switch (lowerCmd) {
            case 'fit brm':
                if (!isAuthenticated) {
                    printLine(output, "🔒 ACCESS DENIED. LEVEL 5 CLEARANCE REQUIRED.", "text-red");
                    printLine(output, "Run <span class='cmd'>auth [code]</span> to unlock.", "text-muted");
                    return;
                }
                printLine(output, `
╔══════════════════════════════════════════════════════════════════╗
║  COMPANY FIT ANALYSIS: BRM LABS                                  ║
╠══════════════════════════════════════════════════════════════════╣
║  ROLE: Founding GTM Engineer                                     ║
╠══════════════════════════════════════════════════════════════════╣
║  CULTURE INDICATORS:                                             ║
║    ✓ Series A  ✓ Systems thinker  ✓ Hybrid marketer+builder      ║
╠══════════════════════════════════════════════════════════════════╣
║  SKILLS MATCH:                                                   ║
║  Messaging→Signals       ████████████████████ 100%               ║
║  GTM Infrastructure      ███████████████████░ 95%                ║
║  Systems Design          ███████████████████░ 95%                ║
╠══════════════════════════════════════════════════════════════════╣
║  WHY YOU FIT:                                                    ║
║  Your JD reads like a description of BASIN::NEXUS.               ║
║  I didn't write a resume. I built your infrastructure.           ║
╠══════════════════════════════════════════════════════════════════╣
║  OVERALL MATCH: ██████████████████░░ 95%                         ║
╚══════════════════════════════════════════════════════════════════╝
                `, 'text-cyan');
                break;

            case 'fit ambient':
                if (!isAuthenticated) {
                    printLine(output, "🔒 ACCESS DENIED. LEVEL 5 CLEARANCE REQUIRED.", "text-red");
                    printLine(output, "Run <span class='cmd'>auth [code]</span> to unlock.", "text-muted");
                    return;
                }
                printLine(output, `
╔══════════════════════════════════════════════════════════╗
║  COMPANY FIT ANALYSIS: AMBIENT.AI                        ║
╠══════════════════════════════════════════════════════════╣
║  ARCHITECTURE MATCH:                                     ║
║  Ambient: Video → AI Filter → Security Alert             ║
║  Basin:   Market Data → AI Filter → Revenue Alert        ║
╠══════════════════════════════════════════════════════════╣
║  MATCH SCORE: ████████████████████ 100%                  ║
╚══════════════════════════════════════════════════════════╝
                `, 'text-cyan');
                break;

            case 'fit sendbird':
                if (!isAuthenticated) {
                    printLine(output, "🔒 ACCESS DENIED. LEVEL 5 CLEARANCE REQUIRED.", "text-red");
                    printLine(output, "Run <span class='cmd'>auth [code]</span> to unlock.", "text-muted");
                    return;
                }
                printLine(output, `
╔══════════════════════════════════════════════════════════╗
║  COMPANY FIT ANALYSIS: SENDBIRD                          ║
╠══════════════════════════════════════════════════════════╣
║  PAIN: "Spray and Pray" SDR noise + High CAC             ║
║  CURE: Python-based Signal Targeting + Low Touch         ║
╠══════════════════════════════════════════════════════════╣
║  EFFICIENCY GAIN: ████████████████████ +50%              ║
╚══════════════════════════════════════════════════════════╝
                `, 'text-cyan');
                break;

            case 'fit liveramp':
                if (!isAuthenticated) {
                    printLine(output, "🔒 ACCESS DENIED. LEVEL 5 CLEARANCE REQUIRED.", "text-red");
                    printLine(output, "Run <span class='cmd'>auth [code]</span> to unlock.", "text-muted");
                    return;
                }
                printLine(output, `
╔══════════════════════════════════════════════════════════╗
║  COMPANY FIT ANALYSIS: LIVERAMP                          ║
╠══════════════════════════════════════════════════════════╣
║  STRATEGY: Bifurcated GTM (Identity vs Marketplace)      ║
╠══════════════════════════════════════════════════════════╣
║  MATCH SCORE: ██████████████████░░ 90%                   ║
╚══════════════════════════════════════════════════════════╝
                `, 'text-cyan');
                break;
            case 'help':
                printLine(output, `
Available Commands:
  <span class="cmd">about</span>        - Professional summary
  <span class="cmd">stack</span>        - Technical stack & tools
  <span class="cmd">projects</span>     - Key architectural wins
  <span class="cmd">contact</span>      - Communication channels
  <span class="cmd">sitrep</span>       - Mission Status (${isAuthenticated ? 'UNLOCKED' : 'REDACTED'})
  <span class="cmd">fit [company]</span> - Run fit analysis (brm, sendbird, ambient, liveramp)
  <span class="cmd">metrics</span>      - Director-level performance stats
  <span class="cmd">case [name]</span>  - War stories (horizon, reddit, mantech)
  <span class="cmd">viz</span>          - ASCII pipeline visualizations
  <span class="cmd">protocol 90</span>  - 30/60/90 Day Onboarding Plan
  <span class="cmd">stack audit</span> - Tech Stack Governance Matrix
  <span class="cmd">model</span>        - GTM Architecture Diagram
  <span class="cmd">governance</span>   - System Health Audit Protocol
  <span class="cmd">wins</span>         - War Stories from Weekly Roll-Ups
  <span class="cmd">auth [code]</span>  - Unlock classified data
  <span class="cmd">gravity</span>      - ⚠️ System Stress Test
  <span class="cmd">clear</span>        - Clear terminal
                `);
                break;

            case 'about':
                printLine(output, `
Leon Basin | Revenue Architect
------------------------------
I translate market signals into revenue systems.
Currently architecting GTM engines for Series B+ startups.

Signal. Architecture. Revenue.
                `);
                break;

            case 'stack':
                printLine(output, `
Core Architecture Stack:
> Python (Data Engineering)
> n8n / Zapier (Workflow Automation)
> Streamlit (Internal Apps)
> HubSpot / SFDC (CRM Logic)
> LLMs (Signal Processing)
                `);
                break;

            case 'projects':
                printLine(output, `
Active Deployments:
1. BASIN::NEXUS — Proprietary GTM Intelligence OS
2. Signal Refinery — AI-powered revenue filtering
3. Pipeline Engine — +160% YoY growth

"The architecture speaks for itself."
                `);
                break;

            case 'contact':
                printLine(output, `
Secure Channels:
> Email: lbasin23@gmail.com
> Phone: (408) 933-8269
> LinkedIn: /in/leonbasin
                `);
                break;

            // === DIRECTOR-LEVEL METRICS ===
            case 'metrics':
                printLine(output, `
╔══════════════════════════════════════════════════════════════════╗
║  DIRECTOR-LEVEL METRICS: BASIN::NEXUS                            ║
╠══════════════════════════════════════════════════════════════════╣
║  PIPELINE VELOCITY     │  160% YoY Growth                        ║
║  COST AVOIDANCE        │  \$424K/year (7 SDRs → 1 Eng + Auto)     ║
║  SPEED TO VALUE        │  5 Days to "Call Ready" (Avg: 3 mo)     ║
║  RETENTION             │  12% Churn Reduction (Multi-\$M ARR)     ║
║  DEAL RESCUE           │  \$30K Horizon Opp Revived               ║
╠══════════════════════════════════════════════════════════════════╣
║  Type: case_study [horizon|reddit|mantech] for war stories       ║
╚══════════════════════════════════════════════════════════════════╝
                `, 'text-green');
                break;

            // === CASE STUDIES (WAR STORIES) ===
            case 'case_study horizon':
            case 'case horizon':
                printLine(output, `
╔══════════════════════════════════════════════════════════════════╗
║  CASE STUDY: HORIZON MEDIA — THE VALUE-ADD PIVOT                 ║
╠══════════════════════════════════════════════════════════════════╣
║  PROBLEM:  Partner canceled, deal stalled at evaluation.         ║
║  ACTION:   Executed "Value-Add Pivot" with a Success Checklist   ║
║            to reframe the technical evaluation.                  ║
║  RESULT:   Deal moved to Legal. \$30K opportunity preserved.      ║
╚══════════════════════════════════════════════════════════════════╝
                `, 'text-cyan');
                break;

            case 'case_study reddit':
            case 'case reddit':
                printLine(output, `
╔══════════════════════════════════════════════════════════════════╗
║  CASE STUDY: REDDIT AIR STRIKE — ZERO-COST LEAD GEN              ║
╠══════════════════════════════════════════════════════════════════╣
║  PROBLEM:  Cold email dying (0.3% reply rate).                   ║
║  ACTION:   Built "Reddit Air Strike" script to identify          ║
║            problem-aware leads asking buying questions.          ║
║  RESULT:   3 High-Value SQLs with \$0 ad spend.                   ║
╚══════════════════════════════════════════════════════════════════╝
                `, 'text-cyan');
                break;

            case 'case_study mantech':
            case 'case mantech':
                printLine(output, `
╔══════════════════════════════════════════════════════════════════╗
║  CASE STUDY: MANTECH — THE FEDRAMP PLAYBOOK                      ║
╠══════════════════════════════════════════════════════════════════╣
║  PROBLEM:  Scheduling conflicts on P0 federal deal.              ║
║  ACTION:   Systemized "FedRAMP Playbook" and aligned execs       ║
║            for a single high-leverage call.                      ║
║  RESULT:   Meeting locked, deal advanced to tech validation.     ║
╚══════════════════════════════════════════════════════════════════╝
                `, 'text-cyan');
                break;

            // === ASCII VISUALIZATIONS ===
            case 'visualize':
            case 'visualize growth':
            case 'viz':
                printLine(output, `
PIPELINE VELOCITY (Millions \$)
────────────────────────────────────────
2023: [██░░░░░░░░] \$1.2M
2024: [██████░░░░] \$2.5M
2025: [██████████] \$4.0M (Fudo Scale)
              160% YoY Growth ↑

EFFICIENCY INDEX (Manual Toil vs Automation)
────────────────────────────────────────
Manual:     [██████████] 100% (Industry)
Basin Arch: [█░░░░░░░░░]   8% (-92% Toil)

UNIT ECONOMICS
────────────────────────────────────────
Traditional: \$670/meeting  (10 SDRs)
Bifurcated:  \$211/meeting  (1 Eng + 3 SDRs)
                            -68% CAC ↓
                `, 'text-yellow');
                break;

            // === STRATEGIC MODULES (Commercial Grade) ===
            case 'protocol 90':
            case '90':
                printLine(output, `
>>> LOADING ONBOARDING_PROTOCOL.exe...

[DAYS 0-30]: AUDIT & STABILIZE
─────────────────────────────────────────
• Audit HubSpot/SFDC schema for data rot
• Interview top 5 Sales Reps: map "Real Funnel" vs "Spreadsheet"
• Ship ONE "Quick Win" automation (e.g., auto-enrichment)
• Deliverable: Infrastructure Health Report

[DAYS 31-60]: ARCHITECT & BUILD
─────────────────────────────────────────
• Deploy Basin::Signal v1 (Ingest > Score > Action)
• Train BDRs on Signal-Based workflow (100 calls → 20 high-intent)
• Establish weekly "Revenue Ops" sync with Finance
• Deliverable: Signal Engine MVP + BDR Training Deck

[DAYS 61-90]: SCALE & OPTIMIZE
─────────────────────────────────────────
• Bifurcate funnel: High-intent → AEs, Low-intent → Nurture
• Present "Cost Avoidance" report to Execs
• Hand off "Manual Toil" tasks to the machine
• Deliverable: ROI Report + Automation Handoff
                `, 'text-green');
                break;

            case 'stack audit':
                printLine(output, `
╔═══════════════════════════════════════════════════════════╗
║  TECH STACK GOVERNANCE MATRIX                             ║
╠════════════╦══════╦═════════════╦═════════════════════════╣
║  TOOL      ║ COST ║ UTILIZATION ║  ROI STATUS             ║
╠════════════╬══════╬═════════════╬═════════════════════════╣
║  HubSpot   ║ $$$  ║  High       ║  CORE INFRA             ║
║  Salesforce║ $$$$ ║  Med        ║  DATA LAKE              ║
║  Clay      ║ $$   ║  Max        ║  HIGH LEVERAGE (Keep)   ║
║  ZoomInfo  ║ $$$$ ║  Low        ║  AT RISK (Replace?)     ║
║  n8n       ║ $    ║  Max        ║  THE GLUE               ║
╠════════════╩══════╩═════════════╩═════════════════════════╣
║  STACK EFFICIENCY: 82%                                    ║
║  ACTION: Cut ZoomInfo, reinvest in Signal Data            ║
╚═══════════════════════════════════════════════════════════╝
                `, 'text-yellow');
                break;

            case 'model architecture':
            case 'model':
            case 'arch':
                printLine(output, `
       MARKET NOISE (The Ocean)
                 │
                 ▼
    ╔════════════════════════════╗
    ║    LAYER 1: INGEST         ║
    ║ (Python / Intent Scrapers) ║
    ╚════════════╦═══════════════╝
                 │
                 ▼
    ╔════════════════════════════╗
    ║    LAYER 2: REFINE    ◄────║──── YOU ARE HERE
    ║  (LLM Scoring / ICP Match) ║
    ╚════════════╦═══════════════╝
                 │
                 ▼
    ╔════════════════════════════╗
    ║    LAYER 3: ACT            ║
    ║ (Slack Alerts / Auto-Draft)║
    ╚════════════╦═══════════════╝
                 │
                 ▼
       REVENUE SIGNAL (The Gold)
                `, 'text-cyan');
                break;

            case 'governance_protocol':
            case 'governance':
            case 'audit':
                printLine(output, `
>>> AUDITING GTM GOVERNANCE PROTOCOL...

╔══════════════════════════════════════════════════════════╗
║  GTM GOVERNANCE PROTOCOL (WEEKLY CADENCE)                ║
╠══════════════════════════════════════════════════════════╣
║  1. BLUF (Bottom Line Up Front)                          ║
║     Executive summary of P0 deal movements & risks.      ║
╠══════════════════════════════════════════════════════════╣
║  2. KPI SCORECARD                                        ║
║     > Meetings Booked (Source: Signal vs Outbound)       ║
║     > Pipeline Velocity (Stage conversion rates)         ║
║     > SDR Touches (Goal: 150/day | Actual: 172/day)      ║
╠══════════════════════════════════════════════════════════╣
║  3. P0 DEAL TRIAGE                                       ║
║     > "ManTech": Locked via FedRAMP pivot.               ║
║     > "Horizon": Unblocked via "Parallel Path" strategy. ║
╠══════════════════════════════════════════════════════════╣
║  4. SYSTEM HEALTH                                        ║
║     [OK] Data Schema: Unified SFDC/HubSpot Identity      ║
║     [OK] SLA Monitor: <5 min Response Enforced           ║
║     [OK] False Positive Rate: <5%                        ║
╚══════════════════════════════════════════════════════════╝
                `, 'text-yellow');
                break;

            case 'view wins':
            case 'wins':
            case 'stories':
                printLine(output, `
>>> DECLASSIFYING "WAR STORIES" FROM WEEKLY ROLL-UPS...

╔══════════════════════════════════════════════════════════╗
║  [1] OPERATION: WHITE HOUSE EOP                          ║
╠══════════════════════════════════════════════════════════╣
║  CONTEXT: Inbound demo request from Executive Office     ║
║           of the President.                              ║
║  ACTION:  Pivoted from standard demo to "Supply Chain    ║
║           Security" consult for federal positioning.     ║
║  RESULT:  Moving to High-Level Nurture (P0 Status).      ║
╚══════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════╗
║  [2] OPERATION: O'REILLY RESCUE ($60k)                   ║
╠══════════════════════════════════════════════════════════╣
║  CONTEXT: Deal stalled at Legal/NDA for 3 weeks.         ║
║  ACTION:  Identified tool error, bypassed gatekeeper,    ║
║           moved directly to DocuSign.                    ║
║  RESULT:  NDA Signed, Technical Validation Unblocked.    ║
╚══════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════╗
║  [3] OPERATION: REDDIT AIR STRIKE                        ║
╠══════════════════════════════════════════════════════════╣
║  CONTEXT: Cold email dying (0.3% reply rate).            ║
║  ACTION:  Deployed "Secret Shopper" play on              ║
║           r/cybersecurity to identify problem-aware ICP. ║
║  RESULT:  3 High-Value Leads ($0 CAC) + 15 convos.       ║
╚══════════════════════════════════════════════════════════╝
                `, 'text-green');
                break;

            case 'clear':
                output.innerHTML = '';
                break;

            default:
                if (rawCmd) {
                    printLine(output, `Command not found: ${rawCmd}. Type <span class="cmd">help</span> for options.`, 'error');
                }
        }
    }

    // Expose global function for clickable commands
    window.runConsoleCommand = function (cmd) {
        const input = document.getElementById('console-input');
        const promptEl = document.getElementById('console-prompt');
        if (input) {
            input.focus();
            executeCommand(cmd, promptEl);
        }
    };

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createConsoleUI);
    } else {
        createConsoleUI();
    }
})();
