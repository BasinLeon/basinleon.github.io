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
        },

        // Company Fit Analysis
        companies: {
            ambient: {
                name: 'Ambient.ai',
                role: 'GTM Engineering Lead',
                culture: ['Technical founder', 'Builder-first', 'AI-native', 'Small team autonomy'],
                skills_match: { 'Python': 95, 'AI/LLMs': 90, 'GTM Strategy': 95, 'Signal Processing': 100, 'Automation': 95 },
                proof_points: [
                    'Built pro bono case study: $424K savings model',
                    '27,000+ lines of Python production code',
                    'Signal Engine matches their video→security architecture',
                    'Ex-Google, Fudo (security), SurveyMonkey (SaaS scale)'
                ],
                why_fit: 'You already built what they\'re hiring for. The case study IS the interview.'
            },
            brm: {
                name: 'BRM Labs',
                role: 'Founding GTM Engineer',
                culture: ['Series A', 'Systems thinker', 'Hybrid marketer+builder', 'Infrastructure-first'],
                skills_match: { 'Python': 95, 'Messaging→Signals': 100, 'GTM Infrastructure': 95, 'Clear Communication': 90, 'Systems Design': 95 },
                proof_points: [
                    'JD says "infrastructure that turns messaging into signals" - built Signal Engine',
                    'BASIN::NEXUS is 27,000+ lines of messaging→action automation',
                    'LiveRamp case study shows bifurcated system design thinking',
                    'MBA + 15 years GTM = perfect "hybrid marketer + builder"'
                ],
                why_fit: 'Your JD reads like a description of BASIN::NEXUS. You ARE the spec.'
            },
            sendbird: {
                name: 'Sendbird',
                role: 'Manager, Global SDR',
                culture: ['CMO-led', 'Efficiency-focused', 'Scale without bloat', 'Data-driven'],
                skills_match: { 'SDR Management': 85, 'Automation': 95, 'Python for Sales Ops': 100, 'Pipeline Architecture': 95, 'CAC Optimization': 90 },
                proof_points: [
                    '160% pipeline increase YoY at Fudo (zero additional headcount)',
                    'Built $0 GTM Stack (replaces $950/mo in SaaS tools)',
                    'Lead Script Generator automates list-building & personalization',
                    'Managed $10M+ pipeline at Sense (105% quota attainment)'
                ],
                why_fit: 'You don\'t just manage SDRs - you build the Python scripts that 10x their output.'
            },
            liveramp: {
                name: 'LiveRamp',
                role: 'Lead PMM / GTM Strategy',
                culture: ['Dual-product complexity', 'Enterprise + SMB mix', 'Data-first', 'Bifurcated systems'],
                skills_match: { 'Dual-GTM Architecture': 100, 'Identity/Data Marketplace': 95, 'Enterprise Sales': 90, 'PMM Strategy': 85, 'Systems Thinking': 95 },
                proof_points: [
                    'Built entire LiveRamp case study unprompted (shows initiative)',
                    'Bifurcated dashboard design (Identity vs Marketplace personas)',
                    'Managed $300M+ portfolio at SurveyMonkey (enterprise scale)',
                    'Partner ecosystems (US/LATAM) at Fudo (channel experience)'
                ],
                why_fit: 'Your case study shows you understand their dual-product architecture better than most employees.'
            }
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
║    FIT <company>         → Company fit analysis          ║
║       → fit ambient, fit brm, fit sendbird, fit liveramp ║
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

        // FIT <company> - Company fit analysis
        if (cmd.startsWith('fit ')) {
            const company = cmd.split(' ')[1];
            const data = DATA.companies[company];

            if (!data) {
                return {
                    type: 'error',
                    output: `Company not found. Try: fit ambient, fit brm, fit sendbird, fit liveramp`
                };
            }

            // Generate ASCII bar chart for skills
            let skillsChart = '';
            for (const [skill, pct] of Object.entries(data.skills_match)) {
                const bars = '█'.repeat(Math.floor(pct / 5));
                const spaces = '░'.repeat(20 - Math.floor(pct / 5));
                skillsChart += `\n║  ${skill.padEnd(23)} ${bars}${spaces} ${pct}%     ║`;
            }

            // Calculate overall match (average of skills)
            const overall = Math.round(Object.values(data.skills_match).reduce((a, b) => a + b, 0) / Object.values(data.skills_match).length);
            const overallBars = '█'.repeat(Math.floor(overall / 5));
            const overallSpaces = '░'.repeat(20 - Math.floor(overall / 5));

            return {
                type: 'result',
                output: `
╔══════════════════════════════════════════════════════════╗
║  COMPANY FIT ANALYSIS: ${data.name.toUpperCase().padEnd(27)}║
╠══════════════════════════════════════════════════════════╣
║  ROLE: ${data.role.padEnd(48)}║
╠══════════════════════════════════════════════════════════╣
║  CULTURE INDICATORS:                                     ║
${data.culture.map(c => `║    ✓ ${c.padEnd(50)}║`).join('\n')}
╠══════════════════════════════════════════════════════════╣
║  SKILLS MATCH:                                           ║
${skillsChart}
╠══════════════════════════════════════════════════════════╣
║  PROOF POINTS:                                           ║
${data.proof_points.map((p, i) => `║  ${String(i + 1)}. ${p.substring(0, 52).padEnd(52)}║${p.length > 52 ? `\n║     ${p.substring(52).padEnd(52)}║` : ''}`).join('\n')}
╠══════════════════════════════════════════════════════════╣
║  WHY YOU FIT:                                            ║
║  ${data.why_fit.substring(0, 54).padEnd(54)}║
${data.why_fit.length > 54 ? `║  ${data.why_fit.substring(54).padEnd(54)}║` : ''}
╠══════════════════════════════════════════════════════════╣
║  OVERALL MATCH: ${overallBars}${overallSpaces} ${overall}%                ║
╚══════════════════════════════════════════════════════════╝

TIP: Type "DESCRIBE projects" to see your portfolio, or "SHOW career" for experience.`
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
