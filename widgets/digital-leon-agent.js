/**
 * DIGITAL LEON :: Soul-Matching Revenue Agent
 * A delightful, guided experience that:
 * - Discovers visitors naturally (not pushy)
 * - Guides them through information with curiosity
 * - Creates "soul matching" - deep understanding
 * - Drip campaign - remembers them, brings them back
 * - Makes it enjoyable, not cheesy
 */

(function () {
    'use strict';

    // ═══════════════════════════════════════════════════════════════
    // CONFIGURATION
    // ═══════════════════════════════════════════════════════════════

    const CONFIG = {
        agentName: 'Leon',
        personality: {
            curious: true,
            helpful: true,
            direct: true,
            builder: true
        },
        entryPoints: {
            autoGreet: false, // Don't auto-popup (too pushy)
            contextual: true, // Show when relevant
            scrollBased: true, // Appear after engagement
            exitIntent: true // Show on exit intent
        },
        typingSpeed: 20,
        thinkingDelay: 400
    };

    // ═══════════════════════════════════════════════════════════════
    // SOUL MATCHING - Deep Visitor Understanding
    // ═══════════════════════════════════════════════════════════════

    const SoulMatcher = {
        visitorProfile: {
            archetype: null, // builder, operator, strategist, explorer
            energy: null, // high, medium, low
            communication: null, // direct, story-driven, data-driven, visual
            goals: [],
            painPoints: [],
            stage: null, // just_browsing, researching, ready_to_buy, comparison
            visitCount: 0,
            lastVisit: null,
            interests: []
        },

        detectArchetype(message, behavior) {
            const lower = message.toLowerCase();
            
            if (lower.match(/(?:build|code|create|system|architecture|engineer)/)) {
                return 'builder';
            } else if (lower.match(/(?:operate|manage|run|execute|process)/)) {
                return 'operator';
            } else if (lower.match(/(?:strategy|plan|vision|roadmap|direction)/)) {
                return 'strategist';
            } else if (lower.match(/(?:explore|learn|curious|understand|research)/)) {
                return 'explorer';
            }
            
            return 'explorer'; // default
        },

        detectEnergy(interactionSpeed, messageLength) {
            if (interactionSpeed < 2000 && messageLength > 50) return 'high';
            if (interactionSpeed < 5000) return 'medium';
            return 'low';
        },

        detectCommunication(message) {
            const lower = message.toLowerCase();
            if (lower.match(/(?:show me|see|visual|picture|diagram)/)) return 'visual';
            if (lower.match(/(?:tell me|story|narrative|journey)/)) return 'story-driven';
            if (lower.match(/(?:data|numbers|metrics|proof|results)/)) return 'data-driven';
            return 'direct';
        },

        matchResponse(profile) {
            const responses = {
                builder: {
                    greeting: "Hey builder! 👋 I see you're interested in systems. I've built 83K+ lines of code—want to see how?",
                    style: "technical, code-focused, architecture-first"
                },
                operator: {
                    greeting: "Hey! 👋 Looking to optimize your GTM operations? I've helped companies save $424K by replacing 10 SDRs with automation.",
                    style: "results-focused, efficiency-driven, ROI-first"
                },
                strategist: {
                    greeting: "Hey! 👋 Thinking about GTM strategy? I've architected systems that delivered 160% pipeline growth. Want to explore?",
                    style: "big-picture, framework-driven, vision-oriented"
                },
                explorer: {
                    greeting: "Hey! 👋 Curious about revenue architecture? I'm Leon—I build systems that replace headcount. What are you exploring?",
                    style: "curious, question-driven, discovery-focused"
                }
            };
            
            return responses[profile.archetype] || responses.explorer;
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // GUIDED JOURNEYS - Contextual Help
    // ═══════════════════════════════════════════════════════════════

    const GuidedJourneys = {
        journeys: {
            'case-study-explorer': {
                trigger: 'user views case study',
                steps: [
                    {
                        message: "I see you're looking at the $424K case study. Want me to walk you through how I built it?",
                        action: 'explain_architecture'
                    },
                    {
                        message: "The key was signal detection—finding high-intent prospects automatically. Want to see how that works?",
                        action: 'show_signals'
                    }
                ]
            },
            'pricing-explorer': {
                trigger: 'user asks about pricing',
                steps: [
                    {
                        message: "Great question! My services range from $2,500 (GTM Audit) to $25,000 (SDR Replacement System).",
                        action: 'show_services'
                    },
                    {
                        message: "What's your biggest challenge? That'll help me recommend the right fit.",
                        action: 'qualify'
                    }
                ]
            },
            'first-time-visitor': {
                trigger: 'first visit',
                steps: [
                    {
                        message: "Hey! 👋 First time here? I'm Leon. I build revenue systems that replace headcount with code.",
                        action: 'introduce'
                    },
                    {
                        message: "Want a quick tour? I can show you:\n• How I saved $424K\n• My code (83K+ lines)\n• Case studies\n\nWhat interests you?",
                        action: 'offer_tour'
                    }
                ]
            },
            'returning-visitor': {
                trigger: 'returning visitor',
                steps: [
                    {
                        message: "Welcome back! 👋 Last time you were interested in [previous interest]. Still exploring that, or something new?",
                        action: 'continue_journey'
                    }
                ]
            }
        },

        detectContext() {
            const path = window.location.pathname;
            const hash = window.location.hash;
            
            if (path.includes('case-studies') || hash.includes('case-studies')) {
                return 'case-study-explorer';
            }
            if (path.includes('consulting') || hash.includes('consulting')) {
                return 'pricing-explorer';
            }
            if (path.includes('tools')) {
                return 'tools-explorer';
            }
            
            // Check if first visit
            const visitCount = parseInt(localStorage.getItem('visit_count') || '0');
            if (visitCount === 0) {
                return 'first-time-visitor';
            } else if (visitCount > 0) {
                return 'returning-visitor';
            }
            
            return 'general-explorer';
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // DISCOVERY MECHANISMS - Natural Entry Points
    // ═══════════════════════════════════════════════════════════════

    const Discovery = {
        createEntryPoints() {
            // 1. Subtle hint in hero section
            this.addHeroHint();
            
            // 2. Contextual prompts on key sections
            this.addContextualPrompts();
            
            // 3. Scroll-based appearance
            this.setupScrollTrigger();
            
            // 4. Exit intent (but subtle)
            this.setupExitIntent();
            
            // 5. Natural conversation starters
            this.addConversationStarters();
        },

        addHeroHint() {
            // Add a subtle "Ask me anything" hint in hero
            const hero = document.querySelector('.hero');
            if (hero) {
                const hint = document.createElement('div');
                hint.className = 'leon-hint';
                hint.innerHTML = `
                    <div class="leon-hint-content">
                        <span class="leon-hint-icon">💬</span>
                        <span class="leon-hint-text">Questions? Ask me anything</span>
                    </div>
                `;
                hint.style.cssText = `
                    position: absolute;
                    bottom: 20px;
                    right: 20px;
                    background: rgba(212, 175, 55, 0.1);
                    border: 1px solid rgba(212, 175, 55, 0.3);
                    border-radius: 20px;
                    padding: 8px 16px;
                    font-size: 0.8rem;
                    color: #D4AF37;
                    cursor: pointer;
                    transition: all 0.3s;
                    font-family: 'JetBrains Mono', monospace;
                `;
                hint.onmouseenter = () => {
                    hint.style.background = 'rgba(212, 175, 55, 0.2)';
                    hint.style.transform = 'scale(1.05)';
                };
                hint.onmouseleave = () => {
                    hint.style.background = 'rgba(212, 175, 55, 0.1)';
                    hint.style.transform = 'scale(1)';
                };
                hint.onclick = () => {
                    window.dispatchEvent(new CustomEvent('open-leon'));
                };
                
                if (hero.style.position === 'relative' || getComputedStyle(hero).position === 'relative') {
                    hero.appendChild(hint);
                }
            }
        },

        addContextualPrompts() {
            // Add prompts near key sections
            const sections = [
                { selector: '#case-studies', message: "Curious about this case study? Ask me how I built it." },
                { selector: '#star-story', message: "Want to know how I replaced 10 SDRs? Let's talk." },
                { selector: '.consulting-section', message: "Questions about services? I'm here." }
            ];
            
            sections.forEach(({ selector, message }) => {
                const section = document.querySelector(selector);
                if (section) {
                    const prompt = document.createElement('div');
                    prompt.className = 'leon-contextual-prompt';
                    prompt.textContent = message;
                    prompt.style.cssText = `
                        position: absolute;
                        top: 20px;
                        right: 20px;
                        background: rgba(212, 175, 55, 0.1);
                        border: 1px solid rgba(212, 175, 55, 0.3);
                        border-radius: 12px;
                        padding: 10px 16px;
                        font-size: 0.75rem;
                        color: #D4AF37;
                        cursor: pointer;
                        opacity: 0;
                        transition: opacity 0.3s;
                        font-family: 'JetBrains Mono', monospace;
                        max-width: 200px;
                    `;
                    
                    const observer = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                prompt.style.opacity = '1';
                            } else {
                                prompt.style.opacity = '0';
                            }
                        });
                    }, { threshold: 0.5 });
                    
                    observer.observe(section);
                    
                    prompt.onclick = () => {
                        window.dispatchEvent(new CustomEvent('open-leon', { detail: { message } }));
                    };
                    
                    if (getComputedStyle(section).position !== 'static') {
                        section.style.position = 'relative';
                    }
                    section.appendChild(prompt);
                }
            });
        },

        setupScrollTrigger() {
            let scrollCount = 0;
            let hasTriggered = false;
            
            window.addEventListener('scroll', () => {
                scrollCount++;
                const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
                
                // Show subtle hint after 30% scroll
                if (scrollPercent > 30 && !hasTriggered) {
                    hasTriggered = true;
                    this.showSubtleHint();
                }
            });
        },

        showSubtleHint() {
            const hint = document.createElement('div');
            hint.className = 'leon-scroll-hint';
            hint.innerHTML = `
                <div class="leon-scroll-hint-content">
                    <span>💡 Questions? I'm here to help</span>
                    <button class="leon-scroll-hint-close">×</button>
                </div>
            `;
            hint.style.cssText = `
                position: fixed;
                bottom: 100px;
                right: 20px;
                background: linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(212, 175, 55, 0.05));
                border: 1px solid rgba(212, 175, 55, 0.4);
                border-radius: 12px;
                padding: 12px 18px;
                font-size: 0.85rem;
                color: #D4AF37;
                cursor: pointer;
                z-index: 9999;
                font-family: 'Inter', sans-serif;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                animation: slideInRight 0.3s ease;
            `;
            
            document.body.appendChild(hint);
            
            hint.onclick = () => {
                window.dispatchEvent(new CustomEvent('open-leon'));
                hint.remove();
            };
            
            hint.querySelector('.leon-scroll-hint-close').onclick = (e) => {
                e.stopPropagation();
                hint.remove();
            };
            
            setTimeout(() => {
                if (hint.parentNode) {
                    hint.style.animation = 'slideOutRight 0.3s ease';
                    setTimeout(() => hint.remove(), 300);
                }
            }, 5000);
        },

        setupExitIntent() {
            let exitIntentShown = false;
            
            document.addEventListener('mouseout', (e) => {
                if (!e.toElement && !e.relatedTarget && !exitIntentShown) {
                    exitIntentShown = true;
                    this.showExitIntent();
                }
            });
        },

        showExitIntent() {
            const modal = document.createElement('div');
            modal.className = 'leon-exit-intent';
            modal.innerHTML = `
                <div class="leon-exit-intent-content">
                    <div class="leon-exit-intent-close">×</div>
                    <h3>Before you go...</h3>
                    <p>Want a quick answer to something? I'm here 24/7.</p>
                    <button class="leon-exit-intent-button">Ask a Question</button>
                    <button class="leon-exit-intent-dismiss">No thanks</button>
                </div>
            `;
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 100000;
                animation: fadeIn 0.3s;
            `;
            
            const content = modal.querySelector('.leon-exit-intent-content');
            content.style.cssText = `
                background: linear-gradient(180deg, #0a0a0f 0%, #050508 100%);
                border: 1px solid rgba(212, 175, 55, 0.4);
                border-radius: 16px;
                padding: 32px;
                max-width: 400px;
                text-align: center;
                color: #f0e6d3;
            `;
            
            modal.querySelector('.leon-exit-intent-close').onclick = () => modal.remove();
            modal.querySelector('.leon-exit-intent-dismiss').onclick = () => modal.remove();
            modal.querySelector('.leon-exit-intent-button').onclick = () => {
                window.dispatchEvent(new CustomEvent('open-leon'));
                modal.remove();
            };
            
            document.body.appendChild(modal);
        },

        addConversationStarters() {
            // Add conversation starter buttons in key places
            const starters = [
                { selector: '.hero', text: "How did you build this?", context: "hero" },
                { selector: '#case-studies', text: "Tell me about this case", context: "case-study" },
                { selector: '.consulting-section', text: "What services do you offer?", context: "services" }
            ];
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // DRIP CAMPAIGN - Remember & Re-engage
    // ═══════════════════════════════════════════════════════════════

    const DripCampaign = {
        init() {
            this.trackVisit();
            this.checkReturningVisitor();
            this.setupFollowUp();
        },

        trackVisit() {
            const visitCount = parseInt(localStorage.getItem('visit_count') || '0') + 1;
            localStorage.setItem('visit_count', visitCount.toString());
            localStorage.setItem('last_visit', new Date().toISOString());
            
            // Store interests
            const path = window.location.pathname;
            const interests = JSON.parse(localStorage.getItem('interests') || '[]');
            if (!interests.includes(path)) {
                interests.push(path);
                localStorage.setItem('interests', JSON.stringify(interests));
            }
        },

        checkReturningVisitor() {
            const lastVisit = localStorage.getItem('last_visit');
            const visitCount = parseInt(localStorage.getItem('visit_count') || '0');
            
            if (visitCount > 1 && lastVisit) {
                const daysSince = (Date.now() - new Date(lastVisit).getTime()) / (1000 * 60 * 60 * 24);
                
                if (daysSince > 1) {
                    // Returning after a day
                    return {
                        isReturning: true,
                        daysSince: Math.floor(daysSince),
                        message: `Welcome back! Last time you were here, you checked out [interests]. Still exploring?`
                    };
                }
            }
            
            return { isReturning: false };
        },

        setupFollowUp() {
            // Schedule follow-up messages (subtle)
            const interests = JSON.parse(localStorage.getItem('interests') || '[]');
            const lastInteraction = localStorage.getItem('last_interaction');
            
            if (interests.length > 0 && !lastInteraction) {
                // Show gentle follow-up after 24 hours
                setTimeout(() => {
                    if (document.visibilityState === 'visible') {
                        this.showFollowUp();
                    }
                }, 24 * 60 * 60 * 1000);
            }
        },

        showFollowUp() {
            const interests = JSON.parse(localStorage.getItem('interests') || '[]');
            const lastInterest = interests[interests.length - 1];
            
            const notification = document.createElement('div');
            notification.className = 'leon-follow-up';
            notification.innerHTML = `
                <div class="leon-follow-up-content">
                    <span>💭 Still thinking about ${lastInterest}? I'm here if you have questions.</span>
                    <button class="leon-follow-up-close">×</button>
                </div>
            `;
            notification.style.cssText = `
                position: fixed;
                bottom: 100px;
                right: 20px;
                background: rgba(212, 175, 55, 0.1);
                border: 1px solid rgba(212, 175, 55, 0.4);
                border-radius: 12px;
                padding: 12px 18px;
                font-size: 0.85rem;
                color: #D4AF37;
                z-index: 9999;
                max-width: 300px;
                animation: slideInRight 0.3s;
            `;
            
            notification.querySelector('.leon-follow-up-close').onclick = () => notification.remove();
            notification.onclick = () => {
                window.dispatchEvent(new CustomEvent('open-leon'));
                notification.remove();
            };
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.style.animation = 'slideOutRight 0.3s';
                    setTimeout(() => notification.remove(), 300);
                }
            }, 8000);
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // STATE & RESPONSE GENERATION
    // ═══════════════════════════════════════════════════════════════

    let conversationState = {
        stage: 'discovery',
        visitorProfile: SoulMatcher.visitorProfile,
        context: GuidedJourneys.detectContext(),
        conversationHistory: []
    };

    function generateResponse(userMessage) {
        // Update soul matching
        const archetype = SoulMatcher.detectArchetype(userMessage, {});
        conversationState.visitorProfile.archetype = archetype;
        conversationState.visitorProfile.energy = SoulMatcher.detectEnergy(1000, userMessage.length);
        conversationState.visitorProfile.communication = SoulMatcher.detectCommunication(userMessage);
        
        const matched = SoulMatcher.matchResponse(conversationState.visitorProfile);
        
        // Context-aware responses
        if (conversationState.stage === 'discovery') {
            conversationState.stage = 'engaged';
            return {
                message: matched.greeting,
                action: 'continue'
            };
        }
        
        // Be curious, not salesy
        if (userMessage.toLowerCase().match(/(?:how|what|why|tell me|explain|show me)/)) {
            return {
                message: generateCuriousResponse(userMessage),
                action: 'explain'
            };
        }
        
        // Default: be helpful and curious
        return {
            message: generateCuriousQuestion(),
            action: 'continue'
        };
    }

    function generateCuriousResponse(question) {
        const lower = question.toLowerCase();
        
        if (lower.includes('build') || lower.includes('code')) {
            return "I started coding at 40. Built 83K+ lines across Python, JavaScript, TypeScript. The key? Treating GTM as an engineering problem.\n\nWant to see a specific project?";
        }
        
        if (lower.includes('424k') || lower.includes('savings') || lower.includes('sdr')) {
            return "The $424K came from replacing 10 SDRs with 2 + automation. But it's not just headcount—it's signal architecture. Finding the right prospects automatically.\n\nWant me to walk you through the system?";
        }
        
        if (lower.includes('case study') || lower.includes('project')) {
            return "Project::Sentinel was a Series A cybersecurity company. Zero pipeline. I built their entire GTM motion in 2 years.\n\nKey systems:\n• Signal detection\n• AI-powered outreach\n• Pipeline scoring\n• Just-in-time training\n\nWhich part interests you most?";
        }
        
        return "That's a great question. Let me think about the best way to explain this...\n\n" + generateCuriousQuestion();
    }

    function generateCuriousQuestion() {
        const questions = [
            "What's driving you to explore this?",
            "What's your biggest GTM challenge right now?",
            "If you could automate one thing in your revenue process, what would it be?",
            "What would success look like for you?",
            "What's the bottleneck in your pipeline?"
        ];
        
        return questions[Math.floor(Math.random() * questions.length)];
    }

    // ═══════════════════════════════════════════════════════════════
    // UI CREATION - Delightful & Discoverable
    // ═══════════════════════════════════════════════════════════════

    function createAgentUI() {
        const container = document.createElement('div');
        container.id = 'digital-leon-container';
        container.innerHTML = `
            <div id="digital-leon-window" class="digital-leon-window">
                <div class="digital-leon-header">
                    <div class="digital-leon-title">
                        <span class="digital-leon-avatar">👤</span>
                        <span>Leon</span>
                        <span class="digital-leon-subtitle">Ask me anything</span>
                    </div>
                    <button class="digital-leon-minimize" id="leon-minimize">−</button>
                    <button class="digital-leon-close" id="leon-close">×</button>
                </div>
                <div class="digital-leon-messages" id="leon-messages"></div>
                <div class="digital-leon-suggestions" id="leon-suggestions"></div>
                <div class="digital-leon-input-container">
                    <input type="text" id="leon-input" placeholder="Type your question..." autocomplete="off">
                    <button id="leon-send">→</button>
                </div>
            </div>
            <button id="digital-leon-toggle" class="digital-leon-toggle">
                <span class="leon-icon">💬</span>
            </button>
        `;

        document.body.appendChild(container);

        // Styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            #digital-leon-container {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 10000;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            }

            .digital-leon-toggle {
                width: 56px;
                height: 56px;
                border-radius: 50%;
                background: linear-gradient(135deg, #D4AF37 0%, #B8860B 100%);
                border: 2px solid rgba(212, 175, 55, 0.4);
                color: #050508;
                font-size: 24px;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(212, 175, 55, 0.4);
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s;
            }

            .digital-leon-toggle:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 30px rgba(212, 175, 55, 0.6);
            }

            .digital-leon-window {
                position: absolute;
                bottom: 76px;
                right: 0;
                width: 380px;
                height: 550px;
                background: linear-gradient(180deg, #0a0a0f 0%, #050508 100%);
                border: 1px solid rgba(212, 175, 55, 0.3);
                border-radius: 16px;
                box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5);
                display: none;
                flex-direction: column;
                overflow: hidden;
            }

            .digital-leon-window.open {
                display: flex;
                animation: slideInRight 0.3s;
            }

            .digital-leon-header {
                padding: 16px;
                border-bottom: 1px solid rgba(212, 175, 55, 0.2);
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: rgba(212, 175, 55, 0.05);
            }

            .digital-leon-title {
                display: flex;
                align-items: center;
                gap: 10px;
                font-family: 'Inter', sans-serif;
                font-size: 0.9rem;
                color: #D4AF37;
                font-weight: 600;
            }

            .digital-leon-avatar {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background: rgba(212, 175, 55, 0.2);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
            }

            .digital-leon-subtitle {
                font-size: 0.7rem;
                color: #8b8573;
                font-weight: 400;
            }

            .digital-leon-minimize,
            .digital-leon-close {
                background: none;
                border: none;
                color: #8b8573;
                font-size: 20px;
                cursor: pointer;
                padding: 0 4px;
                transition: color 0.2s;
            }

            .digital-leon-minimize:hover,
            .digital-leon-close:hover {
                color: #D4AF37;
            }

            .digital-leon-messages {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
                display: flex;
                flex-direction: column;
                gap: 16px;
            }

            .digital-leon-message {
                max-width: 80%;
                padding: 12px 16px;
                border-radius: 12px;
                font-size: 0.9rem;
                line-height: 1.6;
                white-space: pre-wrap;
            }

            .digital-leon-message.user {
                align-self: flex-end;
                background: rgba(212, 175, 55, 0.2);
                color: #f0e6d3;
                border: 1px solid rgba(212, 175, 55, 0.3);
            }

            .digital-leon-message.agent {
                align-self: flex-start;
                background: rgba(212, 175, 55, 0.1);
                color: #f0e6d3;
                border: 1px solid rgba(212, 175, 55, 0.2);
            }

            .digital-leon-suggestions {
                padding: 12px 20px;
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
                border-top: 1px solid rgba(212, 175, 55, 0.1);
                background: rgba(212, 175, 55, 0.02);
            }

            .digital-leon-suggestion {
                padding: 6px 12px;
                background: rgba(212, 175, 55, 0.1);
                border: 1px solid rgba(212, 175, 55, 0.2);
                border-radius: 16px;
                font-size: 0.75rem;
                color: #D4AF37;
                cursor: pointer;
                transition: all 0.2s;
            }

            .digital-leon-suggestion:hover {
                background: rgba(212, 175, 55, 0.2);
                transform: translateY(-2px);
            }

            .digital-leon-input-container {
                padding: 16px;
                border-top: 1px solid rgba(212, 175, 55, 0.2);
                display: flex;
                gap: 10px;
            }

            #leon-input {
                flex: 1;
                background: rgba(212, 175, 55, 0.05);
                border: 1px solid rgba(212, 175, 55, 0.2);
                border-radius: 8px;
                padding: 10px 14px;
                color: #f0e6d3;
                font-size: 0.9rem;
            }

            #leon-input:focus {
                outline: none;
                border-color: #D4AF37;
            }

            #leon-send {
                background: #D4AF37;
                border: none;
                border-radius: 8px;
                padding: 10px 20px;
                color: #050508;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
            }

            #leon-send:hover {
                background: #FFD700;
            }
        `;
        document.head.appendChild(style);
    }

    // ═══════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════════════════════════

    function init() {
        createAgentUI();
        Discovery.createEntryPoints();
        DripCampaign.init();

        const toggle = document.getElementById('digital-leon-toggle');
        const window = document.getElementById('digital-leon-window');
        const input = document.getElementById('leon-input');
        const sendBtn = document.getElementById('leon-send');
        const minimizeBtn = document.getElementById('leon-minimize');
        const closeBtn = document.getElementById('leon-close');
        const suggestions = document.getElementById('leon-suggestions');

        // Conversation starters
        const starters = [
            "How did you build this?",
            "Tell me about the $424K case",
            "What services do you offer?",
            "Show me your code"
        ];

        starters.forEach(starter => {
            const btn = document.createElement('button');
            btn.className = 'digital-leon-suggestion';
            btn.textContent = starter;
            btn.onclick = () => {
                handleUserMessage(starter);
                btn.remove();
            };
            suggestions.appendChild(btn);
        });

        // Listen for open events
        window.addEventListener('open-leon', (e) => {
            window.classList.add('open');
            input.focus();
            if (e.detail?.message) {
                setTimeout(() => {
                    handleUserMessage(e.detail.message);
                }, 500);
            }
        });

        toggle.addEventListener('click', () => {
            window.classList.toggle('open');
            if (window.classList.contains('open')) {
                input.focus();
                const context = GuidedJourneys.detectContext();
                const journey = GuidedJourneys.journeys[context];
                if (journey && conversationState.stage === 'discovery') {
                    setTimeout(() => {
                        typeMessage(journey.steps[0].message, 'agent');
                        conversationState.stage = 'engaged';
                    }, 500);
                }
            }
        });

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

        minimizeBtn.addEventListener('click', () => {
            window.classList.remove('open');
        });

        closeBtn.addEventListener('click', () => {
            window.classList.remove('open');
        });
    }

    function addMessage(content, role = 'agent') {
        const messagesContainer = document.getElementById('leon-messages');
        const messageEl = document.createElement('div');
        messageEl.className = `digital-leon-message ${role}`;
        messageEl.textContent = content;
        messagesContainer.appendChild(messageEl);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        conversationState.conversationHistory.push({ role, content, timestamp: Date.now() });
    }

    function typeMessage(content, role = 'agent') {
        return new Promise((resolve) => {
            const messagesContainer = document.getElementById('leon-messages');
            const messageEl = document.createElement('div');
            messageEl.className = `digital-leon-message ${role} typing`;
            messagesContainer.appendChild(messageEl);

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

        addMessage(message, 'user');

        const thinkingEl = document.createElement('div');
        thinkingEl.className = 'digital-leon-message agent typing';
        thinkingEl.textContent = '...';
        document.getElementById('leon-messages').appendChild(thinkingEl);

        await new Promise(resolve => setTimeout(resolve, CONFIG.thinkingDelay));
        thinkingEl.remove();

        const response = generateResponse(message);
        await typeMessage(response.message, 'agent');
        
        localStorage.setItem('last_interaction', new Date().toISOString());
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
