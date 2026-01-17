/**
 * BASIN::NEXUS — Neural Core Widget
 * ═══════════════════════════════════════════════════════════════
 * 
 * A floating status widget for basinleon.github.io that shows real-time
 * data from the BASIN::NEXUS system.
 * 
 * Built with Google Antigravity | December 2025
 * 
 * USAGE:
 * Add to your Write.as custom JavaScript or embed in any page:
 * <script src="neural-core-widget.js"></script>
 */

(function () {
    'use strict';

    // ═══════════════════════════════════════════════════════════════
    // CONFIGURATION
    // ═══════════════════════════════════════════════════════════════

    const CONFIG = {
        // Where to fetch live data (update to your hosted JSON)
        dataUrl: 'https://basinleon.github.io/data/nexus-status.json',

        // Fallback data if fetch fails
        fallbackData: {
            signalsScanned: 47,
            matchScore: 85,
            lastTransmission: 'moments ago',
            status: 'ONLINE',
            pipelineActive: 3,
            version: 'v10.0'
        },

        // Update interval (ms)
        updateInterval: 60000, // 1 minute

        // Position: 'bottom-right', 'bottom-left', 'top-right', 'top-left'
        position: 'bottom-left'
    };

    // ═══════════════════════════════════════════════════════════════
    // STYLES — Archivist Aesthetic
    // ═══════════════════════════════════════════════════════════════

    const STYLES = `
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500&display=swap');
        
        #neural-core-widget {
            position: fixed;
            ${CONFIG.position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
            ${CONFIG.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
            z-index: 9999;
            font-family: 'JetBrains Mono', monospace;
            font-size: 11px;
            line-height: 1.5;
            user-select: none;
            transition: bottom 0.3s ease;
        }

        @media (max-width: 768px) {
            #neural-core-widget {
                bottom: 80px !important; /* Avoid floating CTA */
                left: 10px !important;
                right: auto !important;
                transform: scale(0.9);
                transform-origin: bottom left;
            }
        }
        
        #neural-core-widget .ncw-container {
            background: rgba(10, 10, 12, 0.95);
            border: 1px solid rgba(212, 175, 55, 0.3);
            border-radius: 4px;
            padding: 12px 16px;
            min-width: 200px;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
            transition: all 0.3s ease;
        }
        
        #neural-core-widget .ncw-container:hover {
            border-color: rgba(212, 175, 55, 0.6);
            box-shadow: 0 4px 30px rgba(212, 175, 55, 0.15);
        }
        
        #neural-core-widget .ncw-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 10px;
            padding-bottom: 8px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        
        #neural-core-widget .ncw-status-dot {
            width: 8px;
            height: 8px;
            background: #22c55e;
            border-radius: 50%;
            animation: ncw-pulse 2s infinite;
        }
        
        #neural-core-widget .ncw-status-dot.offline {
            background: #ef4444;
            animation: none;
        }
        
        @keyframes ncw-pulse {
            0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
            50% { opacity: 0.7; box-shadow: 0 0 0 4px rgba(34, 197, 94, 0); }
        }
        
        #neural-core-widget .ncw-title {
            color: #D4AF37;
            font-weight: 500;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            font-size: 10px;
        }
        
        #neural-core-widget .ncw-row {
            display: flex;
            justify-content: space-between;
            margin: 4px 0;
        }
        
        #neural-core-widget .ncw-label {
            color: #666;
        }
        
        #neural-core-widget .ncw-value {
            color: #e8e8e8;
        }
        
        #neural-core-widget .ncw-value.highlight {
            color: #D4AF37;
        }
        
        #neural-core-widget .ncw-footer {
            margin-top: 10px;
            padding-top: 8px;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            font-size: 9px;
            color: #444;
            text-align: center;
        }
        
        #neural-core-widget .ncw-footer a {
            color: #666;
            text-decoration: none;
        }
        
        #neural-core-widget .ncw-footer a:hover {
            color: #D4AF37;
        }
        
        #neural-core-widget .ncw-toggle {
            position: absolute;
            top: -8px;
            right: -8px;
            width: 20px;
            height: 20px;
            background: #1a1a1d;
            border: 1px solid rgba(212, 175, 55, 0.3);
            border-radius: 50%;
            color: #666;
            font-size: 10px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }
        
        #neural-core-widget .ncw-toggle:hover {
            color: #D4AF37;
            border-color: #D4AF37;
        }
        
        #neural-core-widget.minimized .ncw-container {
            padding: 8px 12px;
            min-width: auto;
        }
        
        #neural-core-widget.minimized .ncw-body,
        #neural-core-widget.minimized .ncw-footer {
            display: none;
        }
        
        #neural-core-widget.minimized .ncw-header {
            margin-bottom: 0;
            padding-bottom: 0;
            border-bottom: none;
        }

        /* Light Theme Overrides */
        body.light-theme #neural-core-widget .ncw-container {
            background: rgba(245, 243, 239, 0.98) !important;
            border-color: #d4af37 !important;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        
        body.light-theme #neural-core-widget .ncw-container:hover {
            box-shadow: 0 4px 30px rgba(212, 175, 55, 0.2);
        }
        
        body.light-theme #neural-core-widget .ncw-header {
            border-bottom-color: rgba(0, 0, 0, 0.1);
        }
        
        body.light-theme #neural-core-widget .ncw-label {
            color: #666 !important;
        }
        
        body.light-theme #neural-core-widget .ncw-value {
            color: #333 !important;
        }
        
        body.light-theme #neural-core-widget .ncw-footer {
            border-top-color: rgba(0, 0, 0, 0.1);
            color: #888;
        }
        
        body.light-theme #neural-core-widget .ncw-footer a {
            color: #666 !important;
        }
        
        body.light-theme #neural-core-widget .ncw-toggle {
            background: #e8e4dc !important;
            border-color: #d4af37 !important;
            color: #666 !important;
        }
    `;

    // ═══════════════════════════════════════════════════════════════
    // WIDGET HTML
    // ═══════════════════════════════════════════════════════════════

    function formatDisplayDate(dateStr) {
        if (!dateStr || dateStr.includes('ago')) return dateStr;
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
        } catch (e) {
            return dateStr;
        }
    }

    function createWidget(data) {
        const statusClass = data.status === 'ONLINE' ? '' : 'offline';
        const formattedDate = formatDisplayDate(data.lastTransmission);

        return `
            <div class="ncw-container">
                <button class="ncw-toggle" onclick="window.NeuralCore.toggle()" title="Toggle">−</button>
                
                <div class="ncw-header">
                    <div class="ncw-status-dot ${statusClass}"></div>
                    <span class="ncw-title">Signal Engine ${data.status}</span>
                </div>
                
                <div class="ncw-body">
                    <div class="ncw-row">
                        <span class="ncw-label">Signals Scanned</span>
                        <span class="ncw-value">${data.signalsScanned}</span>
                    </div>
                    <div class="ncw-row">
                        <span class="ncw-label">Match Score</span>
                        <span class="ncw-value highlight">${data.matchScore}%</span>
                    </div>
                    <div class="ncw-row">
                        <span class="ncw-label">Pipeline Active</span>
                        <span class="ncw-value">${data.pipelineActive}</span>
                    </div>
                    <div class="ncw-row">
                        <span class="ncw-label">Last Transmission</span>
                        <span class="ncw-value" style="font-size: 10px;">${formattedDate}</span>
                    </div>
                </div>
                
                <div class="ncw-footer">
                    <a href="https://basinleon.github.io/nexus" target="_blank">
                        BASIN::NEXUS ${data.version}
                    </a>
                </div>
            </div>
        `;
    }

    // ═══════════════════════════════════════════════════════════════
    // DATA FETCHING
    // ═══════════════════════════════════════════════════════════════

    async function fetchData() {
        try {
            const response = await fetch(CONFIG.dataUrl, { cache: 'no-store' });
            if (!response.ok) throw new Error('Fetch failed');
            return await response.json();
        } catch (e) {
            console.log('[NeuralCore] Using fallback data');
            return CONFIG.fallbackData;
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════════════════════════

    async function init() {
        // Inject styles
        const styleEl = document.createElement('style');
        styleEl.textContent = STYLES;
        document.head.appendChild(styleEl);

        // Create widget container
        const widget = document.createElement('div');
        widget.id = 'neural-core-widget';
        document.body.appendChild(widget);

        // Fetch data and render
        const data = await fetchData();
        widget.innerHTML = createWidget(data);

        // Set up periodic updates
        setInterval(async () => {
            const newData = await fetchData();
            widget.innerHTML = createWidget(newData);
        }, CONFIG.updateInterval);

        console.log('[NeuralCore] Widget initialized');
    }

    // ═══════════════════════════════════════════════════════════════
    // PUBLIC API
    // ═══════════════════════════════════════════════════════════════

    window.NeuralCore = {
        toggle: function () {
            const widget = document.getElementById('neural-core-widget');
            const btn = widget.querySelector('.ncw-toggle');
            widget.classList.toggle('minimized');
            btn.textContent = widget.classList.contains('minimized') ? '+' : '−';
        },

        refresh: async function () {
            const widget = document.getElementById('neural-core-widget');
            const data = await fetchData();
            widget.innerHTML = createWidget(data);
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
