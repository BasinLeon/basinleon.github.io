// BASIN::NEXUS Terminal - Interactive Command Interface
(function() {
    const Terminal = {
        history: [],
        historyIndex: -1,
        output: [],
        
        commands: {
            help: {
                description: 'Show all available commands',
                execute: () => {
                    return `Available Commands:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
help              Show this help message
show career       Display career timeline
select skills     List technical skills
describe projects Show project details
calculate roi     Open ROI Calculator
show metrics      Display key metrics
contact           Show contact options
clear             Clear terminal output
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
                }
            },
            'show career': {
                description: 'Display career timeline',
                execute: () => {
                    return `Career Journey
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Series A Cybersecurity Company
Senior Manager, Business Development & GTM (Americas)
Feb 2024 - Nov 2025
• Led Americas GTM strategy
• Operationalized partner channel across NA & LATAM
• Zero Trust / PAM positioning
• 160% YoY Pipeline Growth

Basin & Associates
Principal Consultant (GTM & Pipeline Strategy)
Aug 2023 - Present
• Advising early-stage AI & Cyber teams
• Built BASIN::NEXUS v10.0 (83,000+ lines)
• $621K Active Pipeline

Sense
Group Manager, Global Business Development
Jul 2022 - Apr 2023
• Managed BDR team
• Built "Social Selling" playbook
• $11M Pipeline | 12% Churn Reduction

[Type 'help' for more commands]`;
                }
            },
            'select skills': {
                description: 'List technical skills',
                execute: () => {
                    return `Technical Stack
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Languages:        Python, JavaScript, SQL, TypeScript
Frameworks:        Streamlit, LangChain, React
AI/LLMs:          OpenAI, Claude, Gemini, Llama, Whisper
CRM/GTM:          HubSpot, Salesforce, Apollo, Clay, n8n
Infrastructure:   Docker, Git, APIs, ETL pipelines

[Type 'help' for more commands]`;
                }
            },
            'describe projects': {
                description: 'Show project details',
                execute: () => {
                    return `Featured Projects
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BASIN::NEXUS v10.0
• 83,000+ lines of code
• AI Career Intelligence Platform
• Hunt → Prep → Close workflow
• 5 LLMs orchestrated

$424K Savings Case Study
• Replaced 10 SDRs with 2 + automation
• 77 meetings/month (vs 45 before)
• 5-day SDR ramp (vs 3-month average)
• Built from scratch in 2 years

[Type 'help' for more commands]`;
                }
            },
            'calculate roi': {
                description: 'Open ROI Calculator',
                execute: () => {
                    window.location.href = '/tools/roi-calculator.html';
                    return 'Opening ROI Calculator...';
                }
            },
            'show metrics': {
                description: 'Display key metrics',
                execute: () => {
                    return `Key Metrics
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
$23M+              Career Pipeline
160%               Pipeline Growth
$424K              Annual Savings
5                  LLMs Orchestrated
83,000+            Lines of Code
270+               Commits
22                 Builds Shipped
19                 Repositories

[Type 'help' for more commands]`;
                }
            },
            contact: {
                description: 'Show contact options',
                execute: () => {
                    return `Contact Options
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 Schedule:      https://cal.mixmax.com/leonbasin
📧 Email:         lbasin23@gmail.com
💼 LinkedIn:      linkedin.com/in/leonbasin
🐙 GitHub:        github.com/BasinLeon

[Type 'help' for more commands]`;
                }
            },
            clear: {
                description: 'Clear terminal output',
                execute: () => {
                    Terminal.output = [];
                    Terminal.renderOutput();
                    return '';
                }
            },
            'fit brm': {
                description: 'BRM Compatibility Analysis (Executive Mode)',
                async: true,
                execute: async () => {
                    const outputContainer = document.getElementById('terminal-output');
                    if (!outputContainer) return '';
                    
                    // Add loading message
                    const loadingId = `loading-${Date.now()}`;
                    Terminal.addOutput(`[SYSTEM]: Initializing BRM Compatibility Protocol...`, 'system');
                    Terminal.renderOutput();
                    
                    // Simulate loading bar (0-100% in 800ms)
                    let progress = 0;
                    const loadingInterval = setInterval(() => {
                        progress += 2;
                        if (progress > 100) progress = 100;
                        
                        const barLength = Math.floor(progress / 2);
                        const bar = '█'.repeat(barLength) + '░'.repeat(50 - barLength);
                        const loadingLine = `[SYSTEM]: Analyzing JD requirements... [${bar}] ${progress}%`;
                        
                        // Update the last system line
                        const lastSystemIndex = Terminal.output.length - 1;
                        if (lastSystemIndex >= 0 && Terminal.output[lastSystemIndex].type === 'system') {
                            Terminal.output[lastSystemIndex].text = loadingLine;
                        } else {
                            Terminal.addOutput(loadingLine, 'system');
                        }
                        Terminal.renderOutput();
                        
                        if (progress >= 100) {
                            clearInterval(loadingInterval);
                            
                            // Small delay before showing results
                            setTimeout(() => {
                                const brmFit = {
                                    role: "GTM Engineer, Marketing",
                                    company: "BRM",
                                    match_score: "98.5%",
                                    analysis_timestamp: new Date().toISOString(),
                                    core_alignment: [
                                        {
                                            requirement: "Engineer growth systems",
                                            match: "Basin::Nexus",
                                            evidence: "Custom Python/Streamlit OS for pipeline signal detection."
                                        },
                                        {
                                            requirement: "Automation scripts",
                                            match: "n8n + Clay + LLM",
                                            evidence: "Autonomous agent workflows replacing SDR manual toil."
                                        },
                                        {
                                            requirement: "Data-driven experimentation",
                                            match: "Quantitative GTM",
                                            evidence: "Reduced CAC by converting headcount spend into API spend."
                                        }
                                    ],
                                    system_architecture: {
                                        frontend: "Streamlit / React",
                                        orchestration: "n8n",
                                        intelligence: "Gemini / OpenAI",
                                        database: "Postgres / AirTable"
                                    },
                                    verdict: "Ready to deploy."
                                };
                                
                                // Format the output
                                let output = `\n[SYSTEM]: Analysis Complete\n`;
                                output += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
                                output += `\n[MATCH ANALYSIS]\n`;
                                output += `Role:        ${brmFit.role}\n`;
                                output += `Company:     ${brmFit.company}\n`;
                                output += `Match Score: <span style="color: #4ade80; font-weight: bold;">${brmFit.match_score}</span>\n`;
                                output += `Timestamp:   ${new Date(brmFit.analysis_timestamp).toLocaleString()}\n`;
                                
                                output += `\n[CORE ALIGNMENT]\n`;
                                brmFit.core_alignment.forEach((item, idx) => {
                                    output += `\n${idx + 1}. Requirement: ${item.requirement}\n`;
                                    output += `   Match: <span style="color: #4ade80;">${item.match}</span>\n`;
                                    output += `   Evidence: ${item.evidence}\n`;
                                });
                                
                                output += `\n[SYSTEM ARCHITECTURE]\n`;
                                Object.entries(brmFit.system_architecture).forEach(([key, value]) => {
                                    output += `${key.padEnd(15)} ${value}\n`;
                                });
                                
                                output += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
                                output += `<span style="color: #4ade80; font-weight: bold; font-size: 1.1em;">[VERDICT]: ${brmFit.verdict}</span>\n`;
                                
                                Terminal.addOutput(output, 'output');
                                Terminal.renderOutput();
                            }, 200);
                        }
                    }, 16); // ~60fps for smooth animation
                    
                    return ''; // Return empty, we're handling output async
                }
            }
        },
        
        init() {
            const input = document.getElementById('terminal-input');
            const outputContainer = document.getElementById('terminal-output');
            
            if (!input) return;
            
            // Create output container if it doesn't exist
            if (!outputContainer) {
                const terminalDiv = input.closest('div').parentElement;
                const outputDiv = document.createElement('div');
                outputDiv.id = 'terminal-output';
                outputDiv.style.cssText = 'margin-top: 16px; max-height: 400px; overflow-y: auto; font-size: 0.85rem; line-height: 1.6;';
                terminalDiv.insertBefore(outputDiv, input.closest('div').nextSibling);
            }
            
            // Make suggestion links clickable
            const suggestions = document.querySelectorAll('#query-terminal span[style*="cursor: pointer"]');
            suggestions.forEach(span => {
                span.addEventListener('click', () => {
                    const command = span.textContent.trim();
                    input.value = command;
                    (async () => {
                        await Terminal.executeCommand(command);
                    })();
                });
            });
            
            // Auto-complete suggestions
            let suggestions = [];
            let suggestionIndex = -1;
            
            function getSuggestions(partial) {
                if (!partial) return [];
                const partialLower = partial.toLowerCase();
                return Object.keys(Terminal.commands).filter(cmd => 
                    cmd.toLowerCase().startsWith(partialLower)
                );
            }
            
            function showSuggestions() {
                const partial = input.value.trim();
                const matches = getSuggestions(partial);
                
                // Remove existing suggestions
                const existing = document.getElementById('terminal-suggestions');
                if (existing) existing.remove();
                
                if (matches.length > 0 && partial) {
                    const suggestionsDiv = document.createElement('div');
                    suggestionsDiv.id = 'terminal-suggestions';
                    suggestionsDiv.style.cssText = 'margin-top: 8px; font-size: 0.8rem; color: var(--text-muted);';
                    suggestionsDiv.innerHTML = `Suggestions: ${matches.map((m, i) => 
                        `<span style="color: var(--gold-primary); cursor: pointer; margin-right: 12px;" data-suggestion="${m}">${m}</span>`
                    ).join('')}`;
                    
                    input.parentElement.appendChild(suggestionsDiv);
                    
                    // Make suggestions clickable
                    suggestionsDiv.querySelectorAll('[data-suggestion]').forEach(span => {
                        span.addEventListener('click', () => {
                            input.value = span.textContent;
                            suggestionsDiv.remove();
                            input.focus();
                        });
                    });
                    
                    suggestions = matches;
                }
            }
            
            // Handle input for auto-complete
            input.addEventListener('input', () => {
                showSuggestions();
            });
            
            // Handle Enter key
            input.addEventListener('keydown', (e) => {
                // Remove suggestions on any key
                const suggestionsDiv = document.getElementById('terminal-suggestions');
                if (suggestionsDiv && e.key !== 'Tab') {
                    suggestionsDiv.remove();
                }
                
                if (e.key === 'Enter') {
                    const command = input.value.trim();
                    if (command) {
                        (async () => {
                            await Terminal.executeCommand(command);
                        })();
                        input.value = '';
                        suggestions = [];
                    }
                } else if (e.key === 'Tab' && suggestions.length > 0) {
                    e.preventDefault();
                    // Auto-complete first suggestion
                    input.value = suggestions[0];
                    if (suggestionsDiv) suggestionsDiv.remove();
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    if (Terminal.historyIndex > 0) {
                        Terminal.historyIndex--;
                        input.value = Terminal.history[Terminal.historyIndex];
                    } else if (Terminal.history.length > 0) {
                        Terminal.historyIndex = 0;
                        input.value = Terminal.history[0];
                    }
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    if (Terminal.historyIndex < Terminal.history.length - 1) {
                        Terminal.historyIndex++;
                        input.value = Terminal.history[Terminal.historyIndex];
                    } else {
                        Terminal.historyIndex = Terminal.history.length;
                        input.value = '';
                    }
                }
            });
        },
        
        async executeCommand(command) {
            const cmd = command.toLowerCase().trim();
            const outputContainer = document.getElementById('terminal-output');
            
            if (!outputContainer) return;
            
            // Add to history
            if (cmd && (!Terminal.history.length || Terminal.history[Terminal.history.length - 1] !== command)) {
                Terminal.history.push(command);
            }
            Terminal.historyIndex = Terminal.history.length;
            
            // Add command to output
            Terminal.addOutput(`→ ${command}`, 'command');
            
            // Execute command
            let result = '';
            if (Terminal.commands[cmd]) {
                const commandObj = Terminal.commands[cmd];
                if (commandObj.async) {
                    // Handle async commands
                    await commandObj.execute();
                } else {
                    result = commandObj.execute();
                }
            } else {
                result = `Command not found: "${command}"\nType 'help' to see available commands.`;
            }
            
            if (result) {
                Terminal.addOutput(result, 'output');
            }
            
            Terminal.renderOutput();
        },
        
        addOutput(text, type = 'output') {
            Terminal.output.push({ text, type, timestamp: new Date() });
        },
        
        renderOutput() {
            const outputContainer = document.getElementById('terminal-output');
            if (!outputContainer) return;
            
            outputContainer.innerHTML = Terminal.output.map(item => {
                if (item.type === 'command') {
                    return `<div style="color: var(--gold-primary); margin-bottom: 8px;">${item.text}</div>`;
                } else if (item.type === 'system') {
                    return `<div style="color: #60a5fa; margin-bottom: 8px; font-family: 'JetBrains Mono', monospace; white-space: pre-wrap;">${item.text}</div>`;
                } else {
                    return `<div style="color: var(--text-secondary); margin-bottom: 12px; white-space: pre-wrap;">${item.text}</div>`;
                }
            }).join('');
            
            outputContainer.scrollTop = outputContainer.scrollHeight;
        }
    };
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => Terminal.init());
    } else {
        Terminal.init();
    }
    
    // Expose globally
    window.Terminal = Terminal;
})();
