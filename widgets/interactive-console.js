/**
 * BASIN::NEXUS Interactive Console
 * Self-contained console widget with SITREP and FIT commands
 * 
 * "The signal exists on multiple planes. Those who seek, find."
 */

(function () {
    'use strict';

    // HISTORY SYSTEM
    let commandHistory = [];
    let historyIndex = -1;

    // QUANTUM STATE - hidden layer
    let quantumState = {
        unlocked: false,
        depth: 0
    };

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
        .output-line .cmd {
            color: #4fc3f7;
        }
        .output-line.text-green {
            color: #27c93f;
        }
        .output-line.text-cyan {
            color: #4fc3f7;
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
                        <span class="prompt">guest@basin-nexus:~$</span>
                        <input type="text" id="console-input" placeholder="type a command..." autocomplete="off" spellcheck="false">
                    </div>
                </div>
            </div>
        `;

        // Get references
        const input = document.getElementById('console-input');
        const output = document.getElementById('console-output');
        const terminalBody = document.getElementById('console-body');

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
                const validCmds = ['help', 'about', 'stack', 'projects', 'contact', 'sitrep', 'status', 'gravity', 'clear'];
                const current = input.value.toLowerCase();
                const match = validCmds.find(c => c.startsWith(current));
                if (match) input.value = match;
            } else if (e.key === 'Enter') {
                executeCommand(input.value.trim());
            }
        });
    }

    function executeCommand(command) {
        const input = document.getElementById('console-input');
        const output = document.getElementById('console-output');
        const terminalBody = document.getElementById('console-body');

        if (command) {
            commandHistory.push(command);
            historyIndex = -1;
        }
        input.value = '';

        // Show command
        const cmdLine = document.createElement('div');
        cmdLine.className = 'output-line';
        cmdLine.innerHTML = `<span class="prompt">guest@basin-nexus:~$</span> ${command}`;
        output.appendChild(cmdLine);

        // Process command
        processCommand(command, output);

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
            printLine(output, "SYSTEM REBOOT INITIATED...", "text-green");
            printLine(output, "\"What falls, rises again.\"", "text-purple");
        }, 1200);
    }

    function processCommand(cmd, output) {
        const lowerCmd = cmd.toLowerCase().trim();

        // Easter egg: gravity effect
        if (lowerCmd === 'gravity') {
            triggerGravity(output);
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
  <span class="cmd">sitrep</span>       - Mission Status Board
  <span class="cmd">status</span>       - Current operational metrics
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
3. Pipeline Engine — +160% YoY growth (Fudo Security)

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

            case 'sitrep':
            case 'status':
                printLine(output, `
╔══════════════════════════════════════════════════════════════════╗
║  MISSION SITREP: ACTIVE OPERATIONS                               ║
╠══════════════════════════════════════════════════════════════════╣
║  DATE: JAN 2026  │  STATUS: HIGH VELOCITY                        ║
╠══════════════════════════════════════════════════════════════════╣
║  SIGNAL          │  CLASSIFICATION       │  PHASE                ║
╠═══════════════════╪═══════════════════════╪══════════════════════╣
║  PHOENIX         │  Vision Systems       │  FINAL STAGE          ║
║  MERCURY         │  Communication Grid   │  ACTIVE               ║
║  ARCHITECT       │  Infrastructure       │  ENGAGED              ║
║  CIPHER          │  Identity Protocol    │  IN PROGRESS          ║
╠══════════════════════════════════════════════════════════════════╣
║  OPERATIONAL NOTES:                                              ║
║  > 4 concurrent signal streams                                   ║
║  > Architecture deployed across all vectors                      ║
║  > Artifacts transmitted. Awaiting response frequencies.         ║
╠══════════════════════════════════════════════════════════════════╣
║  SYSTEM STATUS: ALL GREEN. READY FOR DEPLOYMENT.                 ║
╚══════════════════════════════════════════════════════════════════╝
                `, 'text-green');
                break;

            case 'clear':
                output.innerHTML = '';
                break;

            // Hidden philosophical easter eggs
            case 'signal':
                printLine(output, `
"The signal is not the noise.
 The signal is what remains when the noise is removed.
 Most never filter. That's why they stay lost."
                `, 'text-purple');
                break;

            case 'labyrinth':
                printLine(output, `
"Every choice reveals the chooser.
 The maze is not the obstacle—
 it is the mirror."

 → basinleon.com/labyrinth-of-the-mind
                `, 'text-purple');
                break;

            case 'architect':
                printLine(output, `
"I don't build products.
 I build systems that build outcomes.
 The architecture is the strategy."
                `, 'text-purple');
                break;

            case 'quantum':
                printLine(output, `
"The signal exists on multiple planes:
 Monetary. Spiritual. Temporal.
 What you measure, you multiply.
 Choose your instruments wisely."
                `, 'text-purple');
                break;

            default:
                if (cmd) {
                    printLine(output, `Command not found: ${cmd}. Type <span class="cmd">help</span> for options.`, 'error');
                }
        }
    }

    // Expose global function for clickable commands
    window.runConsoleCommand = function (cmd) {
        const input = document.getElementById('console-input');
        if (input) {
            input.focus();
            executeCommand(cmd);
        }
    };

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createConsoleUI);
    } else {
        createConsoleUI();
    }
})();
