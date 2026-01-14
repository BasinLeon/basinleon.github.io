document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('console-input');
    const output = document.getElementById('console-output');
    const terminalBody = document.getElementById('console-body');

    // HISTORY SYSTEM (Commercial Grade Requirement)
    let commandHistory = [];
    let historyIndex = -1;

    // Focus management
    terminalBody.addEventListener('click', () => {
        input.focus();
    });

    // Mobile Viewport Fix (Keep input visible above keyboard)
    input.addEventListener('focus', () => {
        setTimeout(() => {
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }, 300);
    });

    input.addEventListener('keydown', (e) => {
        // ARROW UP: Previous Command
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                input.value = commandHistory[commandHistory.length - 1 - historyIndex];
            }
        }
        // ARROW DOWN: Next Command
        else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                input.value = commandHistory[commandHistory.length - 1 - historyIndex];
            } else {
                historyIndex = -1;
                input.value = '';
            }
        }
        // TAB: Auto-Completion
        else if (e.key === 'Tab') {
            e.preventDefault();
            const validCmds = ['help', 'about', 'stack', 'projects', 'contact', 'sitrep', 'fit brm', 'fit sendbird', 'fit ambient', 'fit liveramp', 'gravity', 'clear'];
            const current = input.value.toLowerCase();
            const match = validCmds.find(c => c.startsWith(current));
            if (match) input.value = match;
        }
        // ENTER: Execute
        else if (e.key === 'Enter') {
            const command = input.value.trim();
            if (command) {
                commandHistory.push(command);
                historyIndex = -1;
            }
            input.value = '';

            // Create command line
            const cmdLine = document.createElement('div');
            cmdLine.className = 'output-line';
            cmdLine.innerHTML = `<span class="prompt">guest@basin-nexus:~$</span> ${command}`;
            output.appendChild(cmdLine);

            // Process command
            processCommand(command);

            // Auto scroll to bottom
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    });

    function printLine(text, className = 'output-line') {
        const line = document.createElement('div');
        line.className = className;
        // Handle ASCII art alignment
        if (text.includes('╔') || text.includes('█')) {
            line.style.whiteSpace = 'pre';
            line.style.fontFamily = "'JetBrains Mono', monospace";
            line.style.lineHeight = '1.2';
        }
        line.innerHTML = text;
        output.appendChild(line);
    }

    function triggerGravity() {
        const lines = document.querySelectorAll('.output-line');
        lines.forEach(line => {
            line.style.transition = 'transform 1s ease-in, opacity 1s';
            // Random rotation and drop
            const randomRot = Math.random() * 90 - 45;
            const randomY = Math.random() * 500 + 100;
            line.style.transform = `translateY(${randomY}px) rotate(${randomRot}deg)`;
            line.style.opacity = '0';
        });
        setTimeout(() => {
            output.innerHTML = ''; // Clean up after crash
            printLine("SYSTEM REBOOT INITIATED...", "text-green");
        }, 1200);
    }

    function processCommand(cmd) {
        const lowerCmd = cmd.toLowerCase().trim();

        if (lowerCmd === 'gravity') {
            triggerGravity();
            return;
        }

        switch (lowerCmd) {
            case 'help':
                printLine(`
Available Commands:
  <span class="cmd">about</span>        - Professional summary
  <span class="cmd">stack</span>        - Technical stack & tools
  <span class="cmd">projects</span>     - Key architectural wins
  <span class="cmd">contact</span>      - Communication channels
  <span class="cmd">sitrep</span>       - [RESTRICTED] Mission Status
  <span class="cmd">fit [company]</span> - Run fit analysis (brm, sendbird, ambient, liveramp)
  <span class="cmd">gravity</span>      - ⚠️ System Crash Test
  <span class="cmd">clear</span>        - Clear terminal
                `);
                break;

            case 'about':
                printLine(`
Leon Basin | Revenue Architect
------------------------------
I translate market signals into revenue systems.
Currently architecting GTM engines for Series B+ startups.
                `);
                break;

            case 'stack':
                printLine(`
Core Architecture Stack:
> Python (Data Engineering)
> n8n / Zapier (Workflow Automation)
> Streamlit (Internal Apps)
> HubSpot / SFDC (CRM Logic)
> LLMs (Signal Processing)
                `);
                break;

            case 'projects':
                printLine(`
1. BASIN::NEXUS (Proprietary GTM OS)
2. Ambient.ai Signal Refinery (Concept)
3. Fudo Security Pipeline Engine (+160% Growth)
                `);
                break;

            case 'contact':
                printLine(`
Email: lbasin23@gmail.com
Phone: (408) 933-8269
                `);
                break;

            case 'sitrep':
                printLine(`
╔══════════════════════════════════════════════════════════════════╗
║  MISSION SITREP: ACTIVE PIPELINE OPERATIONS                      ║
╠══════════════════════════════════════════════════════════════════╣
║  DATE: JAN 14 2026  |  STATUS: HIGH VELOCITY                     ║
╠══════════════════════════════════════════════════════════════════╣
║  TARGET           │  ROLE                 │  STATUS              ║
╠═══════════════════╪═══════════════════════╪══════════════════════╣
║  AMBIENT.AI       │  Founding GTM Eng     │  ON-SITE (FRI)       ║
║  SENDBIRD         │  Mgr, Global SDR      │  INTERVIEW (THU)     ║
║  BRM LABS         │  Founding GTM Eng     │  INTERVIEW (WED)     ║
║  LIVERAMP         │  Identity Strategy    │  ACTIVE ROUNDS       ║
╠═══════════════════╪═══════════════════════╪══════════════════════╣
║  OPERATIONAL NOTES:                                              ║
║  > Ambient: "Refinery" Architecture Deployed. Artifacts Sent.    ║
║  > Sendbird: Portfolio implanted in calendar invites.            ║
║  > BRM Labs: JD is a 95% match for Basin::Nexus.                 ║
╠══════════════════════════════════════════════════════════════════╣
║  SYSTEM STATUS: ALL GREEN. READY TO DEPLOY.                      ║
╚══════════════════════════════════════════════════════════════════╝
                `, 'text-green');
                break;

            case 'fit brm':
                printLine(`
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

            case 'fit sendbird':
                printLine(`
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
                break;

            case 'fit ambient':
                printLine(`
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
                break;

            case 'fit liveramp':
                printLine(`
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
                break;

            case 'clear':
                output.innerHTML = '';
                break;

            default:
                printLine(`Command not found: ${cmd}. Type <span class="cmd">help</span> for options.`, 'error');
        }
    }
});
