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

        // FIT commands (always available - these are your portfolio pieces)
        if (lowerCmd === 'fit brm') {
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
            return;
        }

        if (lowerCmd === 'fit sendbird') {
            printLine(output, `
╔══════════════════════════════════════════════════════════════════╗
║  COMPANY FIT ANALYSIS: SENDBIRD                                  ║
╠══════════════════════════════════════════════════════════════════╣
║  ROLE: Mgr, Global SDR                                           ║
╠══════════════════════════════════════════════════════════════════╣
║  PAIN POINTS DETECTED:                                           ║
║    ! CAC Efficiency  ! Rep Burnout  ! "Spray and Pray" noise     ║
╠══════════════════════════════════════════════════════════════════╣
║  THE BASIN SOLUTION:                                             ║
║  Python List Building    ████████████████████ 100%               ║
║  Signal-Based Targeting  ███████████████████░ 95%                ║
║  Automated Sequences     ████████████████████ 100%               ║
╠══════════════════════════════════════════════════════════════════╣
║  WHY YOU FIT:                                                    ║
║  I don't manage reps to make calls. I engineer the lists so      ║
║  they only call buyers who are ready.                            ║
╠══════════════════════════════════════════════════════════════════╣
║  EFFICIENCY GAIN: ████████████████████ +50%                      ║
╚══════════════════════════════════════════════════════════════════╝
            `, 'text-cyan');
            return;
        }

        if (lowerCmd === 'fit ambient') {
            printLine(output, `
╔══════════════════════════════════════════════════════════════════╗
║  COMPANY FIT ANALYSIS: AMBIENT.AI                                ║
╠══════════════════════════════════════════════════════════════════╣
║  ROLE: Founding GTM Engineer                                     ║
╠══════════════════════════════════════════════════════════════════╣
║  ARCHITECTURE MATCH:                                             ║
║  Ambient Product:  Video In  → AI Filter → Security Out          ║
║  Basin Strategy:   Market In → AI Filter → Revenue Out           ║
╠══════════════════════════════════════════════════════════════════╣
║  SKILLS MATCH:                                                   ║
║  Signal vs Noise         ████████████████████ 100%               ║
║  Systems Architecture    ████████████████████ 100%               ║
║  Python/Automation       ███████████████████░ 95%                ║
║  Cultural Alignment      ████████████████████ 100%               ║
╠══════════════════════════════════════════════════════════════════╣
║  WHY YOU FIT:                                                    ║
║  We are building the exact same system.                          ║
║  You build it for Security. I build it for Sales.                ║
╠══════════════════════════════════════════════════════════════════╣
║  OVERALL MATCH: ████████████████████ 100%                        ║
╚══════════════════════════════════════════════════════════════════╝
            `, 'text-cyan');
            return;
        }

        if (lowerCmd === 'fit liveramp') {
            printLine(output, `
╔══════════════════════════════════════════════════════════════════╗
║  COMPANY FIT ANALYSIS: LIVERAMP                                  ║
╠══════════════════════════════════════════════════════════════════╣
║  ROLE: Strategy / PMM Lead                                       ║
╠══════════════════════════════════════════════════════════════════╣
║  THE CHALLENGE:                                                  ║
║    1. Identity (Enterprise / Slow / High Value)                  ║
║    2. Marketplace (Transactional / Fast / Volume)                ║
╠══════════════════════════════════════════════════════════════════╣
║  THE BASIN STRATEGY:                                             ║
║  Bifurcated GTM          ████████████████████ 100%               ║
║  Persona Mapping         ███████████████████░ 95%                ║
║  Technical Storytelling  ████████████████████ 100%               ║
╠══════════════════════════════════════════════════════════════════╣
║  WHY YOU FIT:                                                    ║
║  See Case Study: "The Bifurcation Architecture"                  ║
╠══════════════════════════════════════════════════════════════════╣
║  OVERALL MATCH: ██████████████████░░ 90%                         ║
╚══════════════════════════════════════════════════════════════════╝
            `, 'text-cyan');
            return;
        }

        switch (lowerCmd) {
            case 'help':
                printLine(output, `
Available Commands:
  <span class="cmd">about</span>        - Professional summary
  <span class="cmd">stack</span>        - Technical stack & tools
  <span class="cmd">projects</span>     - Key architectural wins
  <span class="cmd">contact</span>      - Communication channels
  <span class="cmd">sitrep</span>       - Mission Status (${isAuthenticated ? 'UNLOCKED' : 'REDACTED'})
  <span class="cmd">fit [company]</span> - Run fit analysis (brm, sendbird, ambient, liveramp)
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
