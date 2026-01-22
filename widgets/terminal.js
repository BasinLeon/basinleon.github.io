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
                    Terminal.executeCommand(command);
                });
            });
            
            // Handle Enter key
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const command = input.value.trim();
                    if (command) {
                        Terminal.executeCommand(command);
                        input.value = '';
                    }
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
        
        executeCommand(command) {
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
                result = Terminal.commands[cmd].execute();
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
