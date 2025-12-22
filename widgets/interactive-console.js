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
            ai: ['Python', 'LangChain', 'Gemini', 'GPT-4', 'Claude', 'Whisper', 'Llama'],
            gtm: ['Revenue Operations', 'Pipeline Strategy', 'Forecasting', 'Territory Planning'],
            tech: ['Salesforce', 'HubSpot', 'SQL', 'Streamlit', 'N8N', 'Git'],
            soft: ['Executive Presence', 'Stakeholder Management', 'Cross-functional Leadership']
        },

        career: [
            { company: 'Fudo Security', role: 'Sr. Manager, BD & GTM', years: '2024-2025', metric: '160% Pipeline' },
            { company: 'Basin & Associates', role: 'Principal Consultant', years: '2023-Present', metric: 'BASIN::NEXUS' },
            { company: 'Sense', role: 'Group Manager, Global BD', years: '2022-2023', metric: '$11M Pipeline' },
            { company: 'SurveyMonkey', role: 'Enterprise BD', years: '2019-2021', metric: '$300M Portfolio' },
            { company: 'Google', role: 'Operations Specialist', years: '2014-2015', metric: 'Wallet & Compliance' }
        ],

        projects: [
            { name: 'BASIN::NEXUS', desc: 'AI Career Intelligence Platform', lines: '10,500+', tech: 'Python/Streamlit' },
            { name: 'Market Signal Factory', desc: 'JD Analyzer & Match Scorer', lines: '500+', tech: 'Python/SQLite' },
            { name: 'BS Detector', desc: 'Outreach Credibility Scorer', tech: 'JavaScript/Node' },
            { name: 'Lead Script Gen', desc: 'LLM-Powered Outbound', tech: 'Python/LLM' }
        ],

        signals: {
            scanned: 47,
            avgMatch: 72,
            sTier: 3,
            aTier: 8,
            lastUpdate: new Date().toISOString()
        },

        education: [
            { school: 'Santa Clara University', degree: 'Executive MBA', year: '2023' },
            { school: 'University of Phoenix', degree: 'B.S. Psychology' }
        ]
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
║    SELECT skills WHERE category = 'ai|gtm|tech|soft'    ║
║    SHOW career                                           ║
║    DESCRIBE projects                                     ║
║    QUERY signals                                         ║
║    LIST education                                        ║
║    HELP                                                  ║
╚══════════════════════════════════════════════════════════╝`
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
                return { type: 'error', output: `Category "${category}" not found. Try: ai, gtm, tech, soft` };
            }
        }

        // SHOW career
        if (cmd.startsWith('show career')) {
            let output = '\n';
            for (const job of DATA.career) {
                output += `${job.years.padEnd(12)} ${job.company.padEnd(18)} ${job.role}\n`;
                if (job.metric) output += `             └── ${job.metric}\n`;
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
