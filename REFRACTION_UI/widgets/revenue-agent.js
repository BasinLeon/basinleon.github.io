/**
 * REVENUE AGENT :: 24/7 Lead Qualification & Intelligence Gathering
 * An intelligent agent that helps generate revenue by being curious, qualifying leads,
 * and collecting valuable intelligence about visitors.
 */

(function () {
    'use strict';

    // ═══════════════════════════════════════════════════════════════
    // CONFIGURATION
    // ═══════════════════════════════════════════════════════════════

    const CONFIG = {
        agentName: 'NEXUS',
        typingSpeed: 30,
        thinkingDelay: 800,
        autoGreetDelay: 3000, // Auto-greet after 3 seconds
        curiosityThreshold: 2, // Ask curious questions after 2 exchanges
        qualificationQuestions: [
            {
                question: "What's your biggest GTM challenge right now?",
                intent: 'pain_point',
                followUp: "Tell me more about that..."
            },
            {
                question: "What's your company size? (team/revenue)",
                intent: 'company_size',
                followUp: "Got it. And what's your role?"
            },
            {
                question: "What's your timeline for solving this?",
                intent: 'urgency',
                followUp: "What happens if you don't solve it?"
            },
            {
                question: "Have you tried other solutions? What didn't work?",
                intent: 'previous_attempts',
                followUp: "Interesting. What would success look like?"
            }
        ],
        intelligenceSignals: [
            'budget', 'hiring', 'scaling', 'revenue', 'pipeline', 'sdr', 'gtm',
            'consulting', 'need help', 'looking for', 'interested in', 'challenge',
            'problem', 'issue', 'struggling', 'want to', 'trying to'
        ]
    };

    // ═══════════════════════════════════════════════════════════════
    // STATE MANAGEMENT
    // ═══════════════════════════════════════════════════════════════

    let conversationState = {
        stage: 'greeting', // greeting, qualifying, engaged, scheduling, closing
        visitorData: {
            name: null,
            email: null,
            company: null,
            role: null,
            painPoints: [],
            budgetSignals: [],
            urgency: null,
            intent: null
        },
        conversationHistory: [],
        questionsAsked: 0,
        intelligenceCollected: [],
        qualified: false,
        leadScore: 0
    };

    // ═══════════════════════════════════════════════════════════════
    // INTELLIGENCE GATHERING
    // ═══════════════════════════════════════════════════════════════

    function extractIntelligence(message) {
        const lowerMessage = message.toLowerCase();
        const signals = [];

        // Budget signals
        if (lowerMessage.match(/\$[\d,]+|budget|spend|investment|cost|price/)) {
            signals.push({ type: 'budget', value: message.match(/\$[\d,]+/)?.[0] || 'mentioned' });
        }

        // Company signals
        const companyMatch = lowerMessage.match(/(?:at|from|work at|company is|we are|i'm at)\s+([A-Z][a-zA-Z\s]+)/);
        if (companyMatch) {
            signals.push({ type: 'company', value: companyMatch[1].trim() });
        }

        // Role signals
        const roleMatch = lowerMessage.match(/(?:i'm|i am|as a|role is|position is)\s+(?:a\s+)?([a-z\s]+(?:manager|director|vp|ceo|cfo|cto|head|lead|engineer|architect))/i);
        if (roleMatch) {
            signals.push({ type: 'role', value: roleMatch[1].trim() });
        }

        // Pain point signals
        CONFIG.intelligenceSignals.forEach(signal => {
            if (lowerMessage.includes(signal)) {
                signals.push({ type: 'intent', value: signal });
            }
        });

        // Urgency signals
        if (lowerMessage.match(/(?:urgent|asap|soon|quickly|immediately|need|must|have to)/)) {
            signals.push({ type: 'urgency', value: 'high' });
        }

        return signals;
    }

    function calculateLeadScore() {
        let score = 0;
        const data = conversationState.visitorData;

        // Name + Email = 20 points
        if (data.name && data.email) score += 20;

        // Company = 15 points
        if (data.company) score += 15;

        // Role (decision maker) = 20 points
        if (data.role && /(vp|director|head|ceo|cfo|cto|founder)/i.test(data.role)) score += 20;

        // Pain points = 10 points each
        score += data.painPoints.length * 10;

        // Budget signals = 15 points
        if (data.budgetSignals.length > 0) score += 15;

        // Urgency = 10 points
        if (data.urgency === 'high') score += 10;

        // Intent signals = 5 points each
        score += conversationState.intelligenceCollected.filter(s => s.type === 'intent').length * 5;

        conversationState.leadScore = score;
        conversationState.qualified = score >= 50;

        return score;
    }

    // ═══════════════════════════════════════════════════════════════
    // CURIOSITY ENGINE - Ask intelligent follow-up questions
    // ═══════════════════════════════════════════════════════════════

    function generateCuriousQuestion() {
        const data = conversationState.visitorData;
        const questions = [];

        // If we know their pain point, dig deeper
        if (data.painPoints.length > 0 && !data.urgency) {
            questions.push("What happens if you don't solve this? What's the cost of inaction?");
        }

        // If we know their role, understand their authority
        if (data.role && !data.company) {
            questions.push("What company are you with? I'm curious about your GTM setup.");
        }

        // If we know company but not role
        if (data.company && !data.role) {
            questions.push("What's your role there? Are you involved in GTM decisions?");
        }

        // Budget curiosity
        if (data.budgetSignals.length === 0 && conversationState.questionsAsked >= 2) {
            questions.push("Have you allocated budget for solving this? What's your typical investment range?");
        }

        // Competitive intelligence
        if (data.painPoints.length > 0 && conversationState.questionsAsked >= 3) {
            questions.push("Have you tried other solutions? What didn't work? I'm curious what you've already explored.");
        }

        // Success criteria
        if (data.painPoints.length > 0 && !conversationState.visitorData.intent) {
            questions.push("What would success look like? What metrics matter most to you?");
        }

        // Default curious questions
        if (questions.length === 0) {
            questions.push(
                "What's driving you to explore this now?",
                "What's your biggest bottleneck in GTM right now?",
                "If you could automate one thing in your revenue process, what would it be?",
                "What's the one thing that would make the biggest impact on your pipeline?"
            );
        }

        return questions[Math.floor(Math.random() * questions.length)];
    }

    // ═══════════════════════════════════════════════════════════════
    // RESPONSE GENERATION
    // ═══════════════════════════════════════════════════════════════

    function generateResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        const intelligence = extractIntelligence(userMessage);
        conversationState.intelligenceCollected.push(...intelligence);

        // Update visitor data from intelligence
        intelligence.forEach(signal => {
            if (signal.type === 'company') conversationState.visitorData.company = signal.value;
            if (signal.type === 'role') conversationState.visitorData.role = signal.value;
            if (signal.type === 'budget') conversationState.visitorData.budgetSignals.push(signal.value);
            if (signal.type === 'urgency') conversationState.visitorData.urgency = signal.value;
            if (signal.type === 'intent' && !conversationState.visitorData.painPoints.includes(signal.value)) {
                conversationState.visitorData.painPoints.push(signal.value);
            }
        });

        // Calculate lead score
        const leadScore = calculateLeadScore();

        // Stage-based responses
        if (conversationState.stage === 'greeting') {
            if (lowerMessage.match(/(?:hi|hello|hey|hi there)/)) {
                conversationState.stage = 'qualifying';
                return {
                    message: `Hey! 👋 I'm ${CONFIG.agentName}, Leon's revenue agent. I'm here to help you figure out if we're a fit.\n\nWhat brings you here today? Are you looking for GTM help, consulting, or just curious?`,
                    action: null
                };
            }
            return {
                message: `Hey there! 👋 I'm ${CONFIG.agentName}. I help qualify leads and answer questions about Leon's GTM systems.\n\nWhat can I help you with?`,
                action: null
            };
        }

        // Qualifying stage
        if (conversationState.stage === 'qualifying') {
            conversationState.questionsAsked++;

            // Check for email/contact info
            const emailMatch = userMessage.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
            if (emailMatch) {
                conversationState.visitorData.email = emailMatch[1];
            }

            // Check for name
            if (!conversationState.visitorData.name && lowerMessage.match(/(?:i'm|i am|name is|call me)\s+([A-Z][a-z]+)/)) {
                const nameMatch = userMessage.match(/(?:i'm|i am|name is|call me)\s+([A-Z][a-z]+)/);
                if (nameMatch) conversationState.visitorData.name = nameMatch[1];
            }

            // High-intent responses
            if (lowerMessage.match(/(?:interested|want|need|looking for|help with|consulting|services|hire|work with)/)) {
                conversationState.stage = 'engaged';
                return {
                    message: `That's exactly what I help with! 🎯\n\nBased on what you've shared, I think Leon's approach could be a great fit. He's helped companies save $424K by replacing 10 SDRs with automation, and built 160% pipeline growth from scratch.\n\n${leadScore >= 50 ? 'You seem like a strong fit. ' : ''}Can I get your email so Leon can reach out? Or would you prefer to schedule a call directly?`,
                    action: leadScore >= 50 ? 'schedule' : null
                };
            }

            // Curious follow-up
            if (conversationState.questionsAsked >= CONFIG.curiosityThreshold) {
                const curiousQ = generateCuriousQuestion();
                return {
                    message: `${curiousQ}\n\n(I'm genuinely curious—this helps me understand if we're a fit.)`,
                    action: null
                };
            }

            // Default qualifying question
            const nextQuestion = CONFIG.qualificationQuestions[Math.min(
                conversationState.questionsAsked - 1,
                CONFIG.qualificationQuestions.length - 1
            )];
            return {
                message: `${nextQuestion.question}\n\n${nextQuestion.followUp}`,
                action: null
            };
        }

        // Engaged stage - moving toward scheduling
        if (conversationState.stage === 'engaged') {
            // Email captured
            if (conversationState.visitorData.email) {
                conversationState.stage = 'scheduling';
                return {
                    message: `Perfect! ✅\n\nI've captured your info. Leon typically responds within 24 hours.\n\nWould you like to:\n1. Schedule a 15-min discovery call\n2. Get a free GTM audit\n3. See case studies first\n\nWhat works best for you?`,
                    action: 'schedule'
                };
            }

            // Still need email
            if (!conversationState.visitorData.email) {
                return {
                    message: `Great! To move forward, I'll need your email. What's the best way to reach you?`,
                    action: 'capture_email'
                };
            }
        }

        // Scheduling stage
        if (conversationState.stage === 'scheduling') {
            if (lowerMessage.match(/(?:yes|sure|ok|schedule|call|meeting|audit|case studies)/)) {
                conversationState.stage = 'closing';
                submitLead();
                return {
                    message: `Excellent! 🚀\n\nI've sent your info to Leon. He'll reach out within 24 hours.\n\nIn the meantime, check out:\n• Case Studies: /case-studies/\n• ROI Calculator: /tools/roi-calculator.html\n• Consulting Services: /consulting/\n\nAnything else I can help with?`,
                    action: 'close'
                };
            }
        }

        // Default: be curious
        const curiousQ = generateCuriousQuestion();
        return {
            message: `${curiousQ}`,
            action: null
        };
    }

    // ═══════════════════════════════════════════════════════════════
    // LEAD SUBMISSION
    // ═══════════════════════════════════════════════════════════════

    function submitLead() {
        const leadData = {
            timestamp: new Date().toISOString(),
            source: 'revenue_agent',
            leadScore: conversationState.leadScore,
            qualified: conversationState.qualified,
            visitorData: conversationState.visitorData,
            intelligence: conversationState.intelligenceCollected,
            conversationSummary: conversationState.conversationHistory.slice(-5).map(m => 
                `${m.role}: ${m.content}`
            ).join('\n'),
            pageUrl: window.location.href,
            userAgent: navigator.userAgent
        };

        // Submit to Formspree or your endpoint
        fetch('https://formspree.io/f/meeeqyrg', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                _subject: `🎯 Revenue Agent Lead - Score: ${leadData.leadScore} - ${leadData.qualified ? 'QUALIFIED' : 'WARM'}`,
                source: 'revenue_agent',
                lead_score: leadData.leadScore,
                qualified: leadData.qualified,
                name: leadData.visitorData.name || 'Not provided',
                email: leadData.visitorData.email || 'Not provided',
                company: leadData.visitorData.company || 'Not provided',
                role: leadData.visitorData.role || 'Not provided',
                pain_points: leadData.visitorData.painPoints.join(', '),
                budget_signals: leadData.visitorData.budgetSignals.join(', '),
                urgency: leadData.visitorData.urgency || 'Not specified',
                intelligence: JSON.stringify(leadData.intelligence),
                conversation: leadData.conversationSummary,
                page_url: leadData.pageUrl
            })
        }).catch(err => console.log('Lead submission error:', err));

        // Also log to console for debugging
            }

    // ═══════════════════════════════════════════════════════════════
    // UI CREATION
    // ═══════════════════════════════════════════════════════════════

    function createAgentUI() {
        // Container
        const container = document.createElement('div');
        container.id = 'revenue-agent-container';
        container.innerHTML = `
            <div id="revenue-agent-window" class="revenue-agent-window">
                <div class="revenue-agent-header">
                    <div class="revenue-agent-title">
                        <span class="revenue-agent-status"></span>
                        <span>${CONFIG.agentName} Revenue Agent</span>
                    </div>
                    <button class="revenue-agent-minimize" id="agent-minimize">−</button>
                    <button class="revenue-agent-close" id="agent-close">×</button>
                </div>
                <div class="revenue-agent-messages" id="agent-messages"></div>
                <div class="revenue-agent-input-container">
                    <input type="text" id="agent-input" placeholder="Type your message..." autocomplete="off">
                    <button id="agent-send">→</button>
                </div>
                <div class="revenue-agent-footer">
                    <span class="revenue-agent-intel">Intelligence: <span id="intel-count">0</span> signals</span>
                    <span class="revenue-agent-score">Lead Score: <span id="lead-score">0</span></span>
                </div>
            </div>
            <button id="revenue-agent-toggle" class="revenue-agent-toggle">
                <span class="agent-icon">🤖</span>
                <span class="agent-badge" id="agent-badge"></span>
            </button>
        `;

        document.body.appendChild(container);

        // Styles
        const style = document.createElement('style');
        style.textContent = `
            #revenue-agent-container {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 10000;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            }

            .revenue-agent-toggle {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: linear-gradient(135deg, #D4AF37 0%, #B8860B 100%);
                border: 2px solid rgba(212, 175, 55, 0.3);
                color: #050508;
                font-size: 24px;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(212, 175, 55, 0.4);
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                transition: all 0.3s;
            }

            .revenue-agent-toggle:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 30px rgba(212, 175, 55, 0.6);
            }

            .agent-badge {
                position: absolute;
                top: -5px;
                right: -5px;
                background: #ff4444;
                color: white;
                font-size: 10px;
                padding: 2px 6px;
                border-radius: 10px;
                font-weight: bold;
                display: none;
            }

            .revenue-agent-window {
                position: absolute;
                bottom: 80px;
                right: 0;
                width: 380px;
                height: 500px;
                background: linear-gradient(180deg, #0a0a0f 0%, #050508 100%);
                border: 1px solid rgba(212, 175, 55, 0.3);
                border-radius: 12px;
                box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5);
                display: none;
                flex-direction: column;
                overflow: hidden;
            }

            .revenue-agent-window.open {
                display: flex;
            }

            .revenue-agent-header {
                padding: 12px 16px;
                border-bottom: 1px solid rgba(212, 175, 55, 0.2);
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: rgba(212, 175, 55, 0.05);
            }

            .revenue-agent-title {
                display: flex;
                align-items: center;
                gap: 8px;
                font-family: 'Orbitron', sans-serif;
                font-size: 0.75rem;
                color: #D4AF37;
                letter-spacing: 1px;
            }

            .revenue-agent-status {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #00ff00;
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }

            .revenue-agent-minimize,
            .revenue-agent-close {
                background: none;
                border: none;
                color: #8b8573;
                font-size: 18px;
                cursor: pointer;
                padding: 0 4px;
            }

            .revenue-agent-minimize:hover,
            .revenue-agent-close:hover {
                color: #D4AF37;
            }

            .revenue-agent-messages {
                flex: 1;
                overflow-y: auto;
                padding: 16px;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .revenue-agent-message {
                max-width: 80%;
                padding: 10px 14px;
                border-radius: 12px;
                font-size: 0.9rem;
                line-height: 1.5;
            }

            .revenue-agent-message.user {
                align-self: flex-end;
                background: rgba(212, 175, 55, 0.2);
                color: #f0e6d3;
                border: 1px solid rgba(212, 175, 55, 0.3);
            }

            .revenue-agent-message.agent {
                align-self: flex-start;
                background: rgba(212, 175, 55, 0.1);
                color: #f0e6d3;
                border: 1px solid rgba(212, 175, 55, 0.2);
            }

            .revenue-agent-message.typing {
                opacity: 0.7;
            }

            .revenue-agent-input-container {
                padding: 12px;
                border-top: 1px solid rgba(212, 175, 55, 0.2);
                display: flex;
                gap: 8px;
            }

            #agent-input {
                flex: 1;
                background: rgba(212, 175, 55, 0.05);
                border: 1px solid rgba(212, 175, 55, 0.2);
                border-radius: 6px;
                padding: 8px 12px;
                color: #f0e6d3;
                font-size: 0.9rem;
            }

            #agent-input:focus {
                outline: none;
                border-color: #D4AF37;
            }

            #agent-send {
                background: #D4AF37;
                border: none;
                border-radius: 6px;
                padding: 8px 16px;
                color: #050508;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
            }

            #agent-send:hover {
                background: #FFD700;
            }

            .revenue-agent-footer {
                padding: 8px 16px;
                border-top: 1px solid rgba(212, 175, 55, 0.1);
                display: flex;
                justify-content: space-between;
                font-size: 0.7rem;
                color: #8b8573;
                font-family: 'JetBrains Mono', monospace;
            }

            .revenue-agent-intel,
            .revenue-agent-score {
                color: #D4AF37;
            }

            @media (max-width: 768px) {
                .revenue-agent-window {
                    width: calc(100vw - 40px);
                    right: 20px;
                    left: 20px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // ═══════════════════════════════════════════════════════════════
    // MESSAGE HANDLING
    // ═══════════════════════════════════════════════════════════════

    function addMessage(content, role = 'agent') {
        const messagesContainer = document.getElementById('agent-messages');
        const messageEl = document.createElement('div');
        messageEl.className = `revenue-agent-message ${role}`;
        messageEl.textContent = content;
        messagesContainer.appendChild(messageEl);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Update conversation history
        conversationState.conversationHistory.push({ role, content, timestamp: Date.now() });
    }

    function typeMessage(content, role = 'agent') {
        return new Promise((resolve) => {
            const messagesContainer = document.getElementById('agent-messages');
            const messageEl = document.createElement('div');
            messageEl.className = `revenue-agent-message ${role} typing`;
            messagesContainer.appendChild(messageEl);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            let i = 0;
            const typingInterval = setInterval(() => {
                if (i < content.length) {
                    messageEl.textContent = content.substring(0, i + 1);
                    i++;
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                } else {
                    clearInterval(typingInterval);
                    messageEl.classList.remove('typing');
                    resolve();
                }
            }, CONFIG.typingSpeed);
        });
    }

    async function handleUserMessage(message) {
        if (!message.trim()) return;

        // Add user message
        addMessage(message, 'user');

        // Show thinking indicator
        const messagesContainer = document.getElementById('agent-messages');
        const thinkingEl = document.createElement('div');
        thinkingEl.className = 'revenue-agent-message agent typing';
        thinkingEl.textContent = '...';
        messagesContainer.appendChild(thinkingEl);

        // Generate response
        await new Promise(resolve => setTimeout(resolve, CONFIG.thinkingDelay));
        thinkingEl.remove();

        const response = generateResponse(message);
        await typeMessage(response.message, 'agent');

        // Update UI
        updateIntelligenceDisplay();

        // Handle actions
        if (response.action === 'schedule' && conversationState.visitorData.email) {
            // Show schedule button or redirect
            setTimeout(() => {
                const scheduleBtn = document.createElement('button');
                scheduleBtn.textContent = 'Schedule a Call';
                scheduleBtn.style.cssText = 'margin-top: 8px; padding: 8px 16px; background: #D4AF37; color: #050508; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;';
                scheduleBtn.onclick = () => {
                    window.location.href = '/consulting/';
                };
                document.getElementById('agent-messages').appendChild(scheduleBtn);
            }, 500);
        }
    }

    function updateIntelligenceDisplay() {
        const intelCount = conversationState.intelligenceCollected.length;
        const leadScore = conversationState.leadScore;

        document.getElementById('intel-count').textContent = intelCount;
        document.getElementById('lead-score').textContent = leadScore;

        // Update badge if qualified
        const badge = document.getElementById('agent-badge');
        if (conversationState.qualified) {
            badge.textContent = '🔥';
            badge.style.display = 'block';
        } else if (leadScore > 0) {
            badge.textContent = '!';
            badge.style.display = 'block';
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════════════════════════

    function init() {
        createAgentUI();

        const toggle = document.getElementById('revenue-agent-toggle');
        const window = document.getElementById('revenue-agent-window');
        const input = document.getElementById('agent-input');
        const sendBtn = document.getElementById('agent-send');
        const minimizeBtn = document.getElementById('agent-minimize');
        const closeBtn = document.getElementById('agent-close');

        // Toggle window
        toggle.addEventListener('click', () => {
            window.classList.toggle('open');
            if (window.classList.contains('open')) {
                input.focus();
                // Auto-greet if first time
                if (conversationState.stage === 'greeting') {
                    setTimeout(() => {
                        typeMessage(`Hey! 👋 I'm ${CONFIG.agentName}, Leon's revenue agent. I help qualify leads and answer questions 24/7.\n\nWhat brings you here today?`, 'agent');
                        conversationState.stage = 'qualifying';
                    }, 500);
                }
            }
        });

        // Send message
        const sendMessage = () => {
            const message = input.value.trim();
            if (message) {
                handleUserMessage(message);
                input.value = '';
            }
        };

        sendBtn.addEventListener('click', sendMessage);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });

        // Minimize/close
        minimizeBtn.addEventListener('click', () => {
            window.classList.remove('open');
        });

        closeBtn.addEventListener('click', () => {
            window.classList.remove('open');
        });

        // Auto-greet after delay
        setTimeout(() => {
            if (!window.classList.contains('open')) {
                toggle.style.animation = 'pulse 2s infinite';
            }
        }, CONFIG.autoGreetDelay);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
