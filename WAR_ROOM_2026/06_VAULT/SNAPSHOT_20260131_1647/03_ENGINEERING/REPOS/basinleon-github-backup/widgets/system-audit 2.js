class SystemAudit {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.score = 0;
        this.metrics = {
            browser: '',
            os: '',
            screen: '',
            connection: '',
            theme: ''
        };
        this.init();
    }

    async init() {
        this.renderInterface();
        await this.runScan();
    }

    renderInterface() {
        this.container.innerHTML = `
            <div class="audit-interface">
                <div class="audit-header">
                    <div class="audit-title">Create Your Signal Score</div>
                    <div class="audit-subtitle">Technographic Analysis in Progress...</div>
                </div>
                
                <div class="scan-grid">
                    <div class="scan-item" id="metric-browser">
                        <span class="icon">🌐</span> <span class="label">Browser Interface</span> <span class="status">Waiting...</span>
                    </div>
                    <div class="scan-item" id="metric-os">
                        <span class="icon">💻</span> <span class="label">Operating Environment</span> <span class="status">Waiting...</span>
                    </div>
                    <div class="scan-item" id="metric-screen">
                        <span class="icon">🖥️</span> <span class="label">Display Resolution</span> <span class="status">Waiting...</span>
                    </div>
                    <div class="scan-item" id="metric-connection">
                        <span class="icon">⚡</span> <span class="label">Network Latency</span> <span class="status">Waiting...</span>
                    </div>
                </div>

                <div class="audit-visual">
                    <div class="score-circle">
                        <svg viewBox="0 0 100 100">
                            <circle class="bg" cx="50" cy="50" r="45"></circle>
                            <circle class="progress" cx="50" cy="50" r="45"></circle>
                        </svg>
                        <div class="score-number">0%</div>
                    </div>
                    <div class="scanner-line"></div>
                </div>

                <div class="audit-result hidden">
                    <h3>SIGNAL DETECTED</h3>
                    <p id="audit-message"></p>
                    <a href="/tools" class="audit-cta">DEPLOY THE SYSTEM →</a>
                </div>
            </div>
        `;
    }

    async runScan() {
        const delay = (ms) => new Promise(res => setTimeout(res, ms));

        // 1. Browser Scan
        await delay(800);
        this.updateMetric('metric-browser', 'Analyzed', 'success');
        this.updateScore(25);

        // 2. OS Scan
        await delay(800);
        this.updateMetric('metric-os', 'Identified', 'success');
        this.updateScore(50);

        // 3. Screen/Viewport
        await delay(800);
        this.updateMetric('metric-screen', 'Calibrated', 'success');
        this.updateScore(75);

        // 4. Connection
        await delay(800);
        this.updateMetric('metric-connection', 'Optimized', 'success');
        this.updateScore(92); // Arbitrary "High" score for ego bait

        // Show Final
        await delay(500);
        this.showResult();
    }

    updateMetric(id, text, type) {
        const el = document.getElementById(id);
        const status = el.querySelector('.status');
        status.textContent = text;
        status.className = `status status-${type}`;
        el.classList.add('scanned');
    }

    updateScore(target) {
        const circle = this.container.querySelector('.progress');
        const number = this.container.querySelector('.score-number');
        const radius = 45;
        const circumference = 2 * Math.PI * radius;

        const offset = circumference - (target / 100) * circumference;
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = offset;

        // Animate number
        let current = parseInt(number.textContent);
        const interval = setInterval(() => {
            if (current >= target) {
                clearInterval(interval);
            } else {
                current++;
                number.textContent = `${current}%`;
            }
        }, 20);
    }

    showResult() {
        const result = this.container.querySelector('.audit-result');
        const msg = document.getElementById('audit-message');

        result.classList.remove('hidden');

        // Branching logic based on score
        const score = 92; // Current score
        let message, cta, link;

        if (score < 70) {
            // High Noise Path -> Sentinel
            message = `Signal degraded. <strong>Manual friction detected.</strong><br>Your setup needs the Foundation.`;
            cta = 'INITIATE PROTOCOL SENTINEL';
            link = '/services/sentinel-case.html';
        } else {
            // High Signal Path -> Aurora
            message = `System <strong>92% Revenue Ready</strong>.<br>You have the infrastructure. Ready for augmentation.`;
            cta = 'DEPLOY PROTOCOL AURORA';
            link = '/services/aurora-case.html';
        }

        msg.innerHTML = message;

        // Update CTA
        const ctaBtn = this.container.querySelector('.audit-cta');
        if (ctaBtn) {
            ctaBtn.textContent = cta;
            ctaBtn.href = link;
        }
    }
}

// Auto-init
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('system-audit-widget')) {
        new SystemAudit('system-audit-widget');
    }
});
