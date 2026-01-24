/**
 * BASIN::NEXUS — Antigravity Logs
 * ═══════════════════════════════════════════════════════════════
 * 
 * A live feed showing what Leon's AI agents are building today.
 * Styled as a transmission log from the Archivist's archive.
 * 
 * Built with Google Antigravity | December 2025
 */

(function () {
    'use strict';

    // ═══════════════════════════════════════════════════════════════
    // LOG DATA — Auto-populated from activities
    // ═══════════════════════════════════════════════════════════════

    const LOGS = [
        { time: '20:45', action: 'Created interactive-console.js', category: 'BUILD', agent: 'Antigravity' },
        { time: '20:40', action: 'Built neural-core-widget.js', category: 'BUILD', agent: 'Antigravity' },
        { time: '20:35', action: 'Analyzed 3 JDs via Market Signal Factory', category: 'SIGNAL', agent: 'MarketSignal' },
        { time: '20:30', action: 'Reviewed basinleon.github.io architecture', category: 'PLAN', agent: 'Antigravity' },
        { time: '20:15', action: 'Market Signal Factory tested at 80% match', category: 'VERIFY', agent: 'Antigravity' },
        { time: '20:00', action: 'Created market_signal_factory.py (500+ lines)', category: 'BUILD', agent: 'Antigravity' },
        { time: '19:45', action: 'Initialized planning for Director RevOps search', category: 'PLAN', agent: 'Antigravity' },
    ];

    // ═══════════════════════════════════════════════════════════════
    // STYLES
    // ═══════════════════════════════════════════════════════════════

    const STYLES = `
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500&display=swap');
        
        #antigravity-logs {
            font-family: 'JetBrains Mono', monospace;
            background: #0a0a0c;
            border: 1px solid rgba(212, 175, 55, 0.2);
            border-radius: 6px;
            padding: 20px;
            max-width: 600px;
            margin: 20px auto;
        }
        
        #antigravity-logs .logs-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        
        #antigravity-logs .logs-pulse {
            width: 8px;
            height: 8px;
            background: #22c55e;
            border-radius: 50%;
            animation: logs-pulse 2s infinite;
        }
        
        @keyframes logs-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
        }
        
        #antigravity-logs .logs-title {
            color: #D4AF37;
            font-size: 11px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }
        
        #antigravity-logs .logs-date {
            margin-left: auto;
            color: #444;
            font-size: 10px;
        }
        
        #antigravity-logs .log-entry {
            display: grid;
            grid-template-columns: 50px 60px 1fr;
            gap: 12px;
            padding: 10px 0;
            border-bottom: 1px solid rgba(255,255,255,0.04);
            font-size: 11px;
            transition: background 0.2s;
        }
        
        #antigravity-logs .log-entry:hover {
            background: rgba(212, 175, 55, 0.05);
            margin: 0 -10px;
            padding: 10px;
        }
        
        #antigravity-logs .log-entry:last-child {
            border-bottom: none;
        }
        
        #antigravity-logs .log-time {
            color: #555;
        }
        
        #antigravity-logs .log-category {
            font-size: 9px;
            padding: 2px 6px;
            border-radius: 3px;
            text-transform: uppercase;
            font-weight: 500;
            text-align: center;
        }
        
        #antigravity-logs .log-category.build { background: rgba(34, 197, 94, 0.15); color: #22c55e; }
        #antigravity-logs .log-category.signal { background: rgba(212, 175, 55, 0.15); color: #D4AF37; }
        #antigravity-logs .log-category.plan { background: rgba(59, 130, 246, 0.15); color: #3b82f6; }
        #antigravity-logs .log-category.verify { background: rgba(168, 85, 247, 0.15); color: #a855f7; }
        
        #antigravity-logs .log-action {
            color: #999;
        }
        
        #antigravity-logs .log-agent {
            color: #555;
            font-size: 9px;
            margin-top: 3px;
        }
        
        #antigravity-logs .logs-footer {
            margin-top: 16px;
            padding-top: 12px;
            border-top: 1px solid rgba(255,255,255,0.08);
            font-size: 9px;
            color: #333;
            text-align: center;
        }
        
        #antigravity-logs .logs-footer a {
            color: #555;
            text-decoration: none;
        }
        
        #antigravity-logs .logs-footer a:hover {
            color: #D4AF37;
        }
    `;

    // ═══════════════════════════════════════════════════════════════
    // RENDER
    // ═══════════════════════════════════════════════════════════════

    function renderLogs() {
        const today = new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric'
        });

        let html = `
            <div class="logs-header">
                <div class="logs-pulse"></div>
                <span class="logs-title">Antigravity Transmission Log</span>
                <span class="logs-date">${today}</span>
            </div>
        `;

        for (const log of LOGS) {
            html += `
                <div class="log-entry">
                    <span class="log-time">${log.time}</span>
                    <span class="log-category ${log.category.toLowerCase()}">${log.category}</span>
                    <div>
                        <span class="log-action">${log.action}</span>
                        <div class="log-agent">via ${log.agent}</div>
                    </div>
                </div>
            `;
        }

        html += `
            <div class="logs-footer">
                Powered by <a href="https://github.com/BasinLeon/basin-signal-engine" target="_blank">BASIN::NEXUS</a> + Google Antigravity
            </div>
        `;

        return html;
    }

    // ═══════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════════════════════════

    function init() {
        const target = document.getElementById('antigravity-logs');
        if (!target) {
                        return;
        }

        // Inject styles
        const styleEl = document.createElement('style');
        styleEl.textContent = STYLES;
        document.head.appendChild(styleEl);

        // Render logs
        target.innerHTML = renderLogs();

            }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
