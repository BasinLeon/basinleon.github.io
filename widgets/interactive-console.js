/**
 * BASIN::NEXUS — Interactive Console
 * ═══════════════════════════════════════════════════════════════
 * 
 * A SQL-like query interface for basinleon.com that lets visitors
 * "query" Leon's background and skills.
 * 
 * Built with Google Antigravity | December 2025
 * 
 * COMMANDS:
 *   SELECT skills WHERE category = 'AI'
 *   SHOW career
 *   DESCRIBE projects
 *   QUERY signals
 *   HELP
 */

(function () {
    'use strict';

    // ═══════════════════════════════════════════════════════════════
    // DATA — Leon's Background
    // ═══════════════════════════════════════════════════════════════

    const DATA = {
        skills: {
            ai: ['Python', 'Streamlit', 'LLM APIs (Claude/Gemini)', 'n8n', 'AI Agent Workflows', 'LangChain'],
            gtm: ['GTM Strategy', 'Pipeline Architecture', 'Partner Ecosystems (US/LATAM)', 'Sales Enablement', 'MEDDICC', 'Sandler'],
            revops: ['CRM Design (HubSpot/Salesforce)', 'Forecasting', 'KPI Tracking', 'Automated Prospecting'],
            domain: ['Cybersecurity (PAM/Zero Trust/IAM)', 'Identity Security', 'AI & SaaS', 'Developer-First GTM']
        },

        career: [
            { company: 'Ambient.ai', role: 'GTM Engineering Lead (Final Round)', years: 'Jan 2026 – In Progress', metric: '🎯 Pro Bono Case Study: $424K Savings' },
            { company: 'Fudo Security', role: 'Sr. Manager, GTM Strategy (Americas)', years: 'Feb 2024 – Nov 2024', metric: '160% Pipeline Increase YoY' },
            { company: 'Sense', role: 'Group Manager, Global BD', years: '2021 – 2023', metric: '$10M+ Pipeline, 105% Quota' },
            { company: 'SurveyMonkey (Momentive)', role: 'Enterprise Account Manager', years: '2019 – 2021', metric: '$300M+ Portfolio, 700+ Accounts' },
            { company: 'Google', role: 'Operations Specialist (Shopping)', years: '2014 – 2015', metric: '15% Efficiency Increase' },
            { company: 'NetApp', role: 'Operations Analyst', years: '2013 – 2014', metric: 'Process Adherence' },
            { company: 'Hewlett-Packard', role: 'Field Sales Representative', years: '2010 – 2011', metric: 'Early Career' }
        ],

        projects: [
            { name: 'BASIN::NEXUS v10.0', desc: 'GTM Operating System — 5 AI agents, multi-agent orchestration, voice lab, interview simulator', lines: '27,000+', tech: 'Python/Streamlit/LLMs' },
            { name: 'Ambient.ai Signal Refinery', desc: 'Pro bono case study: AI-powered lead scoring replacing manual SDR workflows', tech: 'Python/LLMs/n8n' },
            { name: 'Lead Script Generator', desc: 'LLM-powered "Engineer-to-Engineer" outreach scripts based on technical friction signals', tech: 'Python/Claude/Gemini' },
            { name: 'Signal Architect', desc: 'Scoring engine to filter market noise and prioritize high-intent technical founders', tech: 'Python/SQLite' }
        ],

        signals: {
            scanned: 47,
            avgMatch: 85,
            sTier: 3,
            aTier: 8,
            lastUpdate: new Date().toISOString()
        },

        education: [
            { school: 'Santa Clara University', degree: 'MBA, Business Strategy & Technology Leadership', year: '2023' },
            { school: 'University of Phoenix', degree: 'B.S. Psychology & Business Administration', year: '2012' }
        ],

        certifications: ['MEDDICC (AE Accelerator)', 'Sandler Selling System', 'HubSpot Advanced', 'Salesforce', 'Gong'],

        summary: {
            title: 'Senior Manager, GTM Strategy & Partnerships',
            headline: 'Technical Revenue Architect with 15+ years of experience',
            focus: 'Bridging Product innovation and Commercial scale',
            differentiator: 'Unlike traditional sales leaders, I build the tooling I use.'
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // COMMAND PARSER
    // ═══════════════════════════════════════════════════════════════

    function parseCommand(input) {
        const cmd = input.trim().toLowerCase();

        // HELP
        if (cmd === 'help' || cmd === '?') {
            return {
                type: 'help',
                output: `
╔══════════════════════════════════════════════════════════╗
║  BASIN::NEXUS QUERY INTERFACE                            ║
╠══════════════════════════════════════════════════════════╣
║  COMMANDS:                                               ║
║    ABOUT                 → Professional summary          ║
║    SELECT skills         → All skills by category        ║
║    SHOW career           → Career timeline               ║
║    DESCRIBE projects     → Technical projects            ║
║    LIST certifications   → Certs & training              ║
║    LIST education        → Degrees                       ║
║    QUERY signals         → Market signal status          ║
║    HELP                  → This menu                     ║
╚══════════════════════════════════════════════════════════╝`
            };
        }

        // ABOUT
        if (cmd === 'about' || cmd === 'whoami' || cmd === 'summary') {
            const s = DATA.summary;
            return {
                type: 'result',
                output: `
┌──────────────────────────────────────────────────────────┐
│  ${s.title.padEnd(56)}│
├──────────────────────────────────────────────────────────┤
│  ${s.headline.padEnd(56)}│
│                                                          │
│  Focus: ${s.focus.padEnd(50)}│
│                                                          │
│  "${s.differentiator}"                                   │
└──────────────────────────────────────────────────────────┘`
            };
        }

        // SELECT skills
        if (cmd.startsWith('select skills')) {
            const categoryMatch = cmd.match(/category\s*=\s*['"]?(\w+)['"]?/);
            const category = categoryMatch ? categoryMatch[1] : null;

            if (category && DATA.skills[category]) {
                return {
                    type: 'result',
                    output: `→ ${DATA.skills[category].join(', ')}`
                };
            } else if (!category) {
                // Return all skills
                let output = '\n';
                for (const [cat, skills] of Object.entries(DATA.skills)) {
                    output += `[${cat.toUpperCase()}] ${skills.join(', ')}\n`;
                }
                return { type: 'result', output };
            } else {
                return { type: 'error', output: `Category "${category}" not found. Try: ai, gtm, revops, domain` };
            }
        }

        // SHOW career
        if (cmd.startsWith('show career')) {
            let output = '\n';
            for (const job of DATA.career) {
                output += `${job.years.padEnd(20)} ${job.company}\n`;
                output += `${' '.repeat(20)} └ ${job.role}\n`;
                if (job.metric) output += `${' '.repeat(20)}   → ${job.metric}\n`;
                output += '\n';
            }
            return { type: 'result', output };
        }

        // DESCRIBE projects
        if (cmd.startsWith('describe project')) {
            let output = '\n';
            for (const proj of DATA.projects) {
                output += `◆ ${proj.name}\n`;
                output += `  ${proj.desc}\n`;
                output += `  Tech: ${proj.tech}${proj.lines ? ` | ${proj.lines} lines` : ''}\n\n`;
            }
            return { type: 'result', output };
        }

        // QUERY signals
        if (cmd.startsWith('query signal')) {
            const s = DATA.signals;
            return {
                type: 'result',
                output: `
┌─────────────────────────────────┐
│ MARKET SIGNAL STATUS            │
├─────────────────────────────────┤
│ Signals Scanned:  ${String(s.scanned).padEnd(13)}│
│ Avg Match Score:  ${String(s.avgMatch + '%').padEnd(13)}│
│ S-Tier Matches:   ${String(s.sTier).padEnd(13)}│
│ A-Tier Matches:   ${String(s.aTier).padEnd(13)}│
└─────────────────────────────────┘`
            };
        }

        // LIST certifications
        if (cmd.startsWith('list cert')) {
            return {
                type: 'result',
                output: `\n→ ${DATA.certifications.join('\n→ ')}`
            };
        }

        // LIST education
        if (cmd.startsWith('list edu')) {
            let output = '\n';
            for (const edu of DATA.education) {
                output += `◆ ${edu.school}\n`;
                output += `  ${edu.degree}${edu.year ? ` (${edu.year})` : ''}\n`;
            }
            return { type: 'result', output };
        }

        // Unknown command
        return {
            type: 'error',
            output: `Unknown command: "${input}"\nType HELP for available commands.`
        };
    }

    // ═══════════════════════════════════════════════════════════════
    // STYLES
    // ═══════════════════════════════════════════════════════════════

    const STYLES = `
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500&display=swap');
        
        #basin-console {
            font-family: 'JetBrains Mono', monospace;
            background: #0a0a0c;
            border: 1px solid rgba(212, 175, 55, 0.3);
            border-radius: 6px;
            padding: 16px;
            max-width: 600px;
            margin: 20px auto;
        }
        
        #basin-console .console-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 12px;
            padding-bottom: 10px;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        
        #basin-console .console-header .dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
        }
        
        #basin-console .console-header .dot.red { background: #ff5f56; }
        #basin-console .console-header .dot.yellow { background: #ffbd2e; }
        #basin-console .console-header .dot.green { background: #27c93f; }
        
        #basin-console .console-title {
            flex: 1;
            text-align: center;
            color: #666;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }
        
        #basin-console .console-output {
            height: 250px;
            overflow-y: auto;
            margin-bottom: 12px;
            font-size: 12px;
            line-height: 1.6;
        }
        
        #basin-console .console-output .line {
            margin: 4px 0;
        }
        
        #basin-console .console-output .prompt {
            color: #D4AF37;
        }
        
        #basin-console .console-output .cmd {
            color: #e8e8e8;
        }
        
        #basin-console .console-output .result {
            color: #888;
            white-space: pre;
        }
        
        #basin-console .console-output .error {
            color: #ef4444;
        }
        
        #basin-console .console-input-row {
            display: flex;
            align-items: center;
            gap: 8px;
            border-top: 1px solid rgba(255,255,255,0.1);
            padding-top: 12px;
        }
        
        #basin-console .console-input-row .prompt {
            color: #D4AF37;
            font-size: 12px;
        }
        
        #basin-console .console-input {
            flex: 1;
            background: transparent;
            border: none;
            color: #e8e8e8;
            font-family: inherit;
            font-size: 12px;
            outline: none;
        }
        
        #basin-console .console-input::placeholder {
            color: #444;
        }
    `;

    // ═══════════════════════════════════════════════════════════════
    // CONSOLE UI
    // ═══════════════════════════════════════════════════════════════

    function createConsole() {
        return `
            <div class="console-header">
                <span class="dot red"></span>
                <span class="dot yellow"></span>
                <span class="dot green"></span>
                <span class="console-title">BASIN::NEXUS Terminal</span>
            </div>
            <div class="console-output" id="console-output">
                <div class="line result">Welcome to the BASIN::NEXUS Query Interface.</div>
                <div class="line result">Type HELP to see available commands.</div>
                <div class="line result">&nbsp;</div>
            </div>
            <div class="console-input-row">
                <span class="prompt">→</span>
                <input type="text" class="console-input" id="console-input" 
                       placeholder="Enter a command..." autocomplete="off">
            </div>
        `;
    }

    // ═══════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════════════════════════

    function init() {
        // Find target element
        const target = document.getElementById('basin-console');
        if (!target) {
            console.log('[BasinConsole] No #basin-console element found');
            return;
        }

        // Inject styles
        const styleEl = document.createElement('style');
        styleEl.textContent = STYLES;
        document.head.appendChild(styleEl);

        // Render console
        target.innerHTML = createConsole();

        // Get elements
        const input = document.getElementById('console-input');
        const output = document.getElementById('console-output');

        // Command history
        const history = [];
        let historyIndex = -1;

        // Handle input
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = input.value.trim();
                if (!cmd) return;

                // Add to history
                history.push(cmd);
                historyIndex = history.length;

                // Show command
                output.innerHTML += `<div class="line"><span class="prompt">→</span> <span class="cmd">${cmd}</span></div>`;

                // Parse and execute
                const result = parseCommand(cmd);
                const resultClass = result.type === 'error' ? 'error' : 'result';
                output.innerHTML += `<div class="line ${resultClass}">${result.output}</div>`;
                output.innerHTML += `<div class="line">&nbsp;</div>`;

                // Scroll to bottom
                output.scrollTop = output.scrollHeight;

                // Clear input
                input.value = '';
            }

            // History navigation
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (historyIndex > 0) {
                    historyIndex--;
                    input.value = history[historyIndex];
                }
            }
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (historyIndex < history.length - 1) {
                    historyIndex++;
                    input.value = history[historyIndex];
                } else {
                    historyIndex = history.length;
                    input.value = '';
                }
            }
        });

        console.log('[BasinConsole] Initialized');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
