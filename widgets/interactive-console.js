// /widgets/interactive-console.js

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('console-input');
    const output = document.getElementById('console-output');
    const terminalBody = document.getElementById('console-body');

    // Focus input when clicking anywhere in the terminal
    terminalBody.addEventListener('click', () => {
        input.focus();
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = input.value.trim();
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
        // Handle ASCII art whitespace preservation
        if (text.includes('╔') || text.includes('█')) {
            line.style.whiteSpace = 'pre';
            line.style.fontFamily = "'JetBrains Mono', monospace";
            line.style.lineHeight = '1.2';
        }
        line.innerHTML = text;
        output.appendChild(line);
    }

    function processCommand(cmd) {
        const lowerCmd = cmd.toLowerCase();

        switch (lowerCmd) {
            case 'help':
                printLine(`
Available Commands:
  <span class="cmd">about</span>        - Professional summary
  <span class="cmd">stack</span>        - Technical stack & tools
  <span class="cmd">projects</span>     - Key architectural wins
  <span class="cmd">contact</span>      - Communication channels
  <span class="cmd">clear</span>        - Clear terminal
  <span class="cmd">sitrep</span>       - [RESTRICTED] Current Mission Status
  <span class="cmd">fit [company]</span> - Run fit analysis (e.g., fit ambient)
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
║    ✓ Series A                                                    ║
║    ✓ Systems thinker                                             ║
║    ✓ Hybrid marketer+builder                                     ║
║    ✓ Infrastructure-first                                        ║
╠══════════════════════════════════════════════════════════════════╣
║  SKILLS MATCH:                                                   ║
║  Python                  ███████████████████░ 95%                ║
║  Messaging→Signals       ████████████████████ 100%               ║
║  GTM Infrastructure      ███████████████████░ 95%                ║
║  Clear Communication     ██████████████████░░ 90%                ║
║  Systems Design          ███████████████████░ 95%                ║
╠══════════════════════════════════════════════════════════════════╣
║  PROOF POINTS:                                                   ║
║  1. JD says "infrastructure that turns messaging..."             ║
║  2. BASIN::NEXUS is 27,000+ lines of messaging...                ║
║  3. LiveRamp case study shows bifurcated system...               ║
║  4. MBA + 15 years GTM = perfect "hybrid marketer..."            ║
╠══════════════════════════════════════════════════════════════════╣
║  WHY YOU FIT:                                                    ║
║  Your JD reads like a description of BASIN::NEXUS...             ║
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
║    ! CAC Efficiency                                              ║
║    ! Rep Burnout / Toil                                          ║
║    ! "Spray and Pray" noise                                      ║
╠══════════════════════════════════════════════════════════════════╣
║  THE BASIN SOLUTION:                                             ║
║  Manual Coaching         ░░░░░░░░░░░░░░░░░░░░ 0%                 ║
║  Python List Building    ████████████████████ 100%               ║
║  Signal-Based Targeting  ███████████████████░ 95%                ║
║  Automated Sequences     ████████████████████ 100%               ║
╠══════════════════════════════════════════════════════════════════╣
║  WHY YOU FIT:                                                    ║
║  I don't manage reps to make calls. I engineer the               ║
║  lists so they only call buyers who are ready.                   ║
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
