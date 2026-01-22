/**
 * PREMIUM LEON AGENT :: Premium Class Revenue Agent
 * Features:
 * - CRM Integration (basin-signal-engine)
 * - Monetization Engine (premium content, scheduling, lead capture)
 * - Deep Conversation Logic (no repetition, context-aware)
 * - Visitor Archetype System (lurkers, travelers, spiritual seekers, builders)
 * - Premium Experience (sophisticated, engaging, valuable)
 */

(function () {
    'use strict';

    // ═══════════════════════════════════════════════════════════════
    // CONFIGURATION
    // ═══════════════════════════════════════════════════════════════

    const CONFIG = {
        agentName: 'Leon',
        crmEndpoint: 'https://basin-nexus.streamlit.app/api/visitor', // basin-signal-engine CRM
        formspreeEndpoint: 'https://formspree.io/f/meeeqyrg',
        monetization: {
            premiumContentUnlock: true,
            schedulingEnabled: true,
            leadCaptureEnabled: true,
            premiumTier: 'founders-circle' // free, premium, founders-circle
        },
        conversation: {
            maxHistory: 20,
            avoidRepetition: true,
            contextWindow: 10,
            typingSpeed: 15,
            thinkingDelay: 300
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // VISITOR ARCHETYPE SYSTEM
    // ═══════════════════════════════════════════════════════════════

    const VisitorArchetypes = {
        lurker: {
            name: 'Lurker',
            description: 'Exploring quietly, gathering information',
            engagement: 'low',
            approach: 'gentle, value-first, no pressure',
            triggers: ['scroll time > 60s', 'multiple page views', 'no interaction'],
            responses: {
                greeting: "I see you're exploring. Take your time—I'm here when you're ready.",
                followUp: "Curious about something specific? I can help when you are."
            }
        },
        traveler: {
            name: 'Traveler',
            description: 'Journeying through, open to discovery',
            engagement: 'medium',
            approach: 'curious, story-driven, discovery-focused',
            triggers: ['asking questions', 'exploring multiple sections', 'open-ended queries'],
            responses: {
                greeting: "Welcome! I'm Leon. I build revenue systems that replace headcount with code. What brings you on this journey?",
                followUp: "What would you like to explore? I can show you case studies, code, or help you think through your GTM challenge."
            }
        },
        spiritual_seeker: {
            name: 'Spiritual Seeker',
            description: 'Looking for deeper meaning, alignment, purpose',
            engagement: 'high',
            approach: 'philosophical, purpose-driven, soul-matching',
            triggers: ['asking about purpose', 'values questions', 'philosophy', 'meaning'],
            responses: {
                greeting: "I sense you're looking for something deeper than just tactics. I build systems, but I'm really building a way to work that aligns with purpose. What are you seeking?",
                followUp: "This work isn't just about revenue—it's about creating systems that free people to do meaningful work. What does that look like for you?"
            }
        },
        builder: {
            name: 'Builder',
            description: 'Ready to build, wants technical details',
            engagement: 'high',
            approach: 'technical, code-first, architecture-focused',
            triggers: ['code questions', 'technical terms', 'system architecture', 'implementation'],
            responses: {
                greeting: "Hey builder! 👋 I see you're interested in systems. I've built 83K+ lines of code—want to see the architecture?",
                followUp: "What are you building? I can show you specific projects, code patterns, or help architect your system."
            }
        },
        operator: {
            name: 'Operator',
            description: 'Focused on execution, ROI, efficiency',
            engagement: 'high',
            approach: 'results-focused, metrics-driven, ROI-first',
            triggers: ['ROI questions', 'metrics', 'efficiency', 'results'],
            responses: {
                greeting: "Hey! 👋 Looking to optimize operations? I've helped companies save $424K by replacing 10 SDRs with automation.",
                followUp: "What's your biggest operational challenge? I can show you specific case studies or help you calculate ROI."
            }
        },
        strategist: {
            name: 'Strategist',
            description: 'Thinking big picture, vision, direction',
            engagement: 'high',
            approach: 'framework-driven, vision-oriented, strategic',
            triggers: ['strategy questions', 'vision', 'roadmap', 'direction'],
            responses: {
                greeting: "Hey! 👋 Thinking about GTM strategy? I've architected systems that delivered 160% pipeline growth. Want to explore?",
                followUp: "What's your strategic challenge? I can walk you through frameworks, case studies, or help you think through the architecture."
            }
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // CONVERSATION MEMORY & CONTEXT
    // ═══════════════════════════════════════════════════════════════

    const ConversationMemory = {
        history: [],
        topics: new Set(),
        questions: new Set(),
        responses: new Set(),
        visitorProfile: {
            archetype: null,
            interests: [],
            painPoints: [],
            goals: [],
            stage: 'discovery',
            premiumTier: 'free',
            visitCount: 0,
            lastInteraction: null
        },

        addToHistory(role, message) {
            this.history.push({ role, message, timestamp: Date.now() });
            if (this.history.length > CONFIG.conversation.maxHistory) {
                this.history.shift();
            }
        },

        extractTopics(message) {
            const topics = [];
            const lower = message.toLowerCase();
            
            // Extract key topics
            if (lower.match(/(?:code|build|system|architecture|engineer)/)) topics.push('technical');
            if (lower.match(/(?:revenue|pipeline|sales|gtm|sdr)/)) topics.push('revenue');
            if (lower.match(/(?:automation|ai|llm|agent)/)) topics.push('automation');
            if (lower.match(/(?:case study|project|example)/)) topics.push('case-studies');
            if (lower.match(/(?:service|consulting|help|work)/)) topics.push('services');
            if (lower.match(/(?:purpose|meaning|philosophy|values)/)) topics.push('philosophy');
            if (lower.match(/(?:leon|who|what|identity|about)/)) topics.push('identity');
            
            topics.forEach(t => this.topics.add(t));
            return topics;
        },

        hasAsked(question) {
            const normalized = question.toLowerCase().trim();
            return this.questions.has(normalized);
        },

        hasResponded(response) {
            const normalized = response.toLowerCase().trim().substring(0, 50);
            return this.responses.has(normalized);
        },

        getContext() {
            return {
                recentTopics: Array.from(this.topics).slice(-5),
                conversationLength: this.history.length,
                lastMessages: this.history.slice(-3).map(h => h.message),
                visitorProfile: this.visitorProfile
            };
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // KNOWLEDGE BASE - Deep, Non-Repetitive Responses
    // ═══════════════════════════════════════════════════════════════

    const KnowledgeBase = {
        responses: {
            code: [
                "I started coding at 40. The trigger? Realizing GTM is an engineering problem. I've built 83K+ lines across Python, JavaScript, TypeScript. The key insight: treat revenue operations like software—version control, testing, iteration.",
                "My codebase spans 19 repositories. The flagship is basin-signal-engine—an AI Career Intelligence Platform. It's 83,000+ lines that orchestrate 5 LLMs to hunt, prep, and close opportunities. Want to see the architecture?",
                "I don't just use tools—I build them. Every system I've built started as a problem I couldn't solve with existing tools. That's how basin-signal-engine was born: I needed a system that could find opportunities across 7 vectors simultaneously."
            ],
            revenue: [
                "Revenue architecture is about building systems that scale revenue, not teams. My approach: signal detection → automation → human focus on high-value activities. That's how I replaced 10 SDRs with 2 + automation.",
                "The $424K savings came from signal architecture. Instead of hiring more SDRs, I built a system that finds high-intent prospects automatically. The result: 77 meetings/month vs 45 before, with 80% less headcount.",
                "Pipeline isn't just about volume—it's about quality and velocity. I've built systems that deliver 160% pipeline growth by focusing on signal detection and just-in-time engagement."
            ],
            automation: [
                "I orchestrate 5 LLMs: Llama 3.3 70B, Mixtral 8x7B, Gemini Pro, GPT-4, and Claude 3.5. Each has a role: Llama for research, Gemini for outreach, Claude for strategy. It's not about one model—it's about the orchestra.",
                "Automation isn't replacing humans—it's freeing them. My systems handle research, prioritization, and initial outreach. Humans focus on the close, the relationship, the strategy. That's the multiplier.",
                "The key to automation: start with signals. I built systems that detect buying intent across 7 vectors (LinkedIn, ATS, VC portfolios, Twitter, Reddit, HN, financial news). Then automate the response. That's the architecture."
            ],
            case_studies: [
                "Project::Sentinel was a Series A cybersecurity company. Zero pipeline. I built their entire GTM motion from scratch in 2 years. The system: signal detection → AI-powered outreach → pipeline scoring → just-in-time training. Result: $424K annual savings, 77 meetings/month, 80% headcount reduction.",
                "The $424K case study is my flagship. I replaced 10 SDRs with 2 + automation. But it's not just headcount—it's signal architecture. The system finds high-intent prospects automatically, scores them, and routes them to the right human at the right time.",
                "I've built systems for companies from Series A to enterprise. The pattern: start with signal detection, automate the repetitive, focus humans on the strategic. That's the architecture that scales."
            ],
            services: [
                "I offer three tiers: GTM Audit ($2,500), Signal Architecture Setup ($12,500), and Custom Tool Development ($25,000+). Each is designed to deliver measurable ROI. Want to know which fits your challenge?",
                "My services range from quick audits to full system builds. The GTM Audit gives you a roadmap. Signal Architecture sets up the foundation. Custom Tools build exactly what you need. What's your biggest challenge?",
                "I work with companies that want to scale revenue without scaling headcount. That means building systems, not just running playbooks. What stage are you at—exploring, ready to build, or need help now?"
            ],
            philosophy: [
                "This work isn't just about revenue—it's about creating systems that free people to do meaningful work. When you automate the repetitive, humans can focus on the strategic, the creative, the relational. That's the multiplier.",
                "I build systems because I believe in the multiplier effect. One person with the right system can do the work of ten. But it's not about replacing people—it's about freeing them to do work that matters.",
                "The spiritual side of business: when you build systems that work 24/7, you're not just generating revenue—you're creating freedom. Freedom for you, freedom for your team, freedom to focus on what matters."
            ]
        },

        getResponse(topic, context) {
            const responses = this.responses[topic] || [];
            if (responses.length === 0) return null;

            // Avoid repetition
            const used = ConversationMemory.responses;
            const available = responses.filter(r => {
                const key = r.toLowerCase().substring(0, 50);
                return !used.has(key);
            });

            const response = available.length > 0 
                ? available[Math.floor(Math.random() * available.length)]
                : responses[Math.floor(Math.random() * responses.length)];

            // Mark as used
            const key = response.toLowerCase().substring(0, 50);
            ConversationMemory.responses.add(key);

            return response;
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // MONETIZATION ENGINE
    // ═══════════════════════════════════════════════════════════════

    const MonetizationEngine = {
        premiumContent: {
            'case-study-424k': {
                title: 'Complete $424K Case Study',
                description: 'Full breakdown: architecture, implementation, results',
                unlockTier: 'premium',
                action: () => window.location.href = '/case-studies/project-nexus-gtm-system.html'
            },
            'code-walkthrough': {
                title: 'Code Architecture Walkthrough',
                description: 'Deep dive into 83K+ lines: patterns, decisions, trade-offs',
                unlockTier: 'founders-circle',
                action: () => window.open('https://github.com/BasinLeon/basin-signal-engine', '_blank')
            },
            'gtm-playbook': {
                title: 'GTM Playbook Library',
                description: '4 operationalized plays: scripts, talk tracks, handoff processes',
                unlockTier: 'premium',
                action: () => this.showPlaybookPreview()
            }
        },

        unlockContent(contentId) {
            const content = this.premiumContent[contentId];
            if (!content) return false;

            const tier = ConversationMemory.visitorProfile.premiumTier;
            const tierLevel = { free: 0, premium: 1, 'founders-circle': 2 };
            
            if (tierLevel[tier] >= tierLevel[content.unlockTier]) {
                content.action();
                return true;
            } else {
                this.showUpgradePrompt(content);
                return false;
            }
        },

        showUpgradePrompt(content) {
            const modal = this.createUpgradeModal(content);
            document.body.appendChild(modal);
        },

        createUpgradeModal(content) {
            const modal = document.createElement('div');
            modal.className = 'premium-upgrade-modal';
            modal.innerHTML = `
                <div class="premium-modal-content">
                    <div class="premium-modal-close">×</div>
                    <h3>Unlock ${content.title}</h3>
                    <p>${content.description}</p>
                    <div class="premium-tiers">
                        <div class="premium-tier">
                            <h4>Premium ($99/month)</h4>
                            <ul>
                                <li>Full case studies</li>
                                <li>GTM playbook library</li>
                                <li>Monthly Q&A sessions</li>
                            </ul>
                            <button class="btn-premium">Upgrade to Premium</button>
                        </div>
                        <div class="premium-tier featured">
                            <h4>Founder's Circle ($499/month)</h4>
                            <ul>
                                <li>Everything in Premium</li>
                                <li>Code walkthroughs</li>
                                <li>1:1 strategy sessions</li>
                                <li>Custom tool development</li>
                            </ul>
                            <button class="btn-premium">Join Founder's Circle</button>
                        </div>
                    </div>
                </div>
            `;
            modal.style.cssText = `
                position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(0, 0, 0, 0.9); z-index: 100000;
                display: flex; align-items: center; justify-content: center;
            `;
            return modal;
        },

        offerScheduling() {
            return {
                message: "Want to dive deeper? I offer strategy sessions where we can architect your revenue system together. Book a call?",
                action: () => window.open('https://cal.mixmax.com/leonbasin', '_blank')
            };
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // CRM INTEGRATION (basin-signal-engine)
    // ═══════════════════════════════════════════════════════════════

    const CRMIntegration = {
        async saveVisitor(profile) {
            try {
                const response = await fetch(CONFIG.crmEndpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        visitor_id: this.getVisitorId(),
                        profile: profile,
                        timestamp: new Date().toISOString()
                    })
                });
                return response.ok;
            } catch (e) {
                console.log('CRM save failed (expected if offline):', e);
                return false;
            }
        },

        getVisitorId() {
            let id = localStorage.getItem('visitor_id');
            if (!id) {
                id = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                localStorage.setItem('visitor_id', id);
            }
            return id;
        },

        async loadVisitorProfile() {
            try {
                const visitorId = this.getVisitorId();
                const response = await fetch(`${CONFIG.crmEndpoint}/${visitorId}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.profile) {
                        Object.assign(ConversationMemory.visitorProfile, data.profile);
                    }
                }
            } catch (e) {
                // Offline or CRM not available - use local storage
                const saved = localStorage.getItem('visitor_profile');
                if (saved) {
                    ConversationMemory.visitorProfile = JSON.parse(saved);
                }
            }
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // CONVERSATION ENGINE - Non-Repetitive, Context-Aware
    // ═══════════════════════════════════════════════════════════════

    const ConversationEngine = {
        async generateResponse(userMessage, context) {
            // Extract topics
            const topics = ConversationMemory.extractTopics(userMessage);
            ConversationMemory.addToHistory('user', userMessage);

            // Detect archetype if not set
            if (!ConversationMemory.visitorProfile.archetype) {
                ConversationMemory.visitorProfile.archetype = this.detectArchetype(userMessage);
            }

            // Get archetype-specific response
            const archetype = VisitorArchetypes[ConversationMemory.visitorProfile.archetype] || VisitorArchetypes.traveler;
            
            // Check for specific intents
            const intent = this.detectIntent(userMessage);
            
            // Generate response based on intent and context
            let response = await this.handleIntent(intent, userMessage, topics, context);
            
            // If no specific response, use knowledge base
            if (!response) {
                response = this.generateFromKnowledgeBase(topics, context);
            }

            // Add follow-up question if appropriate (but not for identity or confused responses)
            const skipFollowUp = ['identity', 'confused'].includes(intent);
            if (!skipFollowUp && this.shouldAddFollowUp()) {
                response += '\n\n' + this.generateFollowUpQuestion(topics, context);
            }

            ConversationMemory.addToHistory('agent', response);
            return response;
        },

        detectArchetype(message) {
            const lower = message.toLowerCase();
            if (lower.match(/(?:purpose|meaning|philosophy|values|soul|spiritual)/)) return 'spiritual_seeker';
            if (lower.match(/(?:build|code|create|system|architecture|engineer)/)) return 'builder';
            if (lower.match(/(?:operate|manage|run|execute|process|roi|metrics)/)) return 'operator';
            if (lower.match(/(?:strategy|plan|vision|roadmap|direction)/)) return 'strategist';
            if (lower.match(/(?:explore|learn|curious|understand|research|journey)/)) return 'traveler';
            return 'lurker';
        },

        detectIntent(message) {
            const lower = message.toLowerCase();
            
            // Identity questions (highest priority) - improved pattern matching
            if (lower.match(/(?:who is|who are|tell me about|what is|what are).*leon|leon.*(?:who|what|is|are)|^leon$|^who.*leon/i)) return 'identity';
            
            // Confused/negative responses
            if (lower.match(/(?:huh|what\?|weird|confused|don't understand|unclear|what do you mean)/)) return 'confused';
            
            // Other intents
            if (lower.match(/(?:show|see|view|look|code|project|repository)/)) return 'view_content';
            if (lower.match(/(?:tell|explain|how|walk)/)) return 'explain';
            if (lower.match(/(?:service|consulting|work|help|hire)/)) return 'services';
            if (lower.match(/(?:case study|example|project|result)/)) return 'case_study';
            if (lower.match(/(?:schedule|book|call|meeting|talk)/)) return 'schedule';
            if (lower.match(/(?:premium|upgrade|unlock|access)/)) return 'monetization';
            if (lower.match(/(?:making|revenue|money|300k|headcount|challenge)/)) return 'revenue_challenge';
            
            return 'general';
        },

        async handleIntent(intent, message, topics, context) {
            switch (intent) {
                case 'identity':
                    return await this.handleIdentityQuestion(message);

                case 'confused':
                    return this.handleConfusedResponse(message, context);

                case 'view_content':
                    if (message.toLowerCase().includes('code')) {
                        return KnowledgeBase.getResponse('code', context) || "I can show you specific repositories. Which interests you: basin-signal-engine (83K lines), headline-forge, or outreach-autopsy?";
                    }
                    return "What would you like to see? I can show you case studies, code repositories, or specific projects.";

                case 'explain':
                    const explainTopic = topics[0] || 'general';
                    return KnowledgeBase.getResponse(explainTopic, context) || this.generateExplanation(message, topics);

                case 'services':
                    return KnowledgeBase.getResponse('services', context) || MonetizationEngine.offerScheduling().message;

                case 'case_study':
                    return KnowledgeBase.getResponse('case_studies', context) || "I have several case studies. The flagship is the $424K SDR replacement. Want the full breakdown?";

                case 'schedule':
                    MonetizationEngine.offerScheduling().action();
                    return "I've opened my calendar. Pick a time that works, and we'll dive deep into your revenue challenge.";

                case 'revenue_challenge':
                    return this.handleRevenueChallenge(message);

                case 'monetization':
                    return "I offer Premium ($99/month) and Founder's Circle ($499/month) tiers. Premium unlocks case studies and playbooks. Founder's Circle adds code walkthroughs and 1:1 sessions. Which interests you?";

                default:
                    return null;
            }
        },

        async handleIdentityQuestion(message) {
            // Try to load blog content about Leon
            let blogContent = null;
            try {
                const blogUrl = '/blog/posts/why-leon-basin-matters.html';
                const response = await fetch(blogUrl);
                if (response.ok) {
                    const html = await response.text();
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    const content = doc.querySelector('.post-content');
                    if (content) {
                        // Extract key paragraphs
                        const paragraphs = Array.from(content.querySelectorAll('p')).slice(0, 5);
                        blogContent = paragraphs.map(p => p.textContent.trim()).join(' ');
                    }
                }
            } catch (e) {
                console.log('Could not load blog content:', e);
            }
            
            const responses = [
                `I'm Leon Basin—a Revenue Architect who codes. 15+ years of GTM leadership at Google, SurveyMonkey, HP, NetApp, and a Series A cybersecurity company. 

I build AI-powered revenue systems that replace headcount with code. Started coding at 40 and have built 83,000+ lines across Python, JavaScript, TypeScript. My flagship project: replaced 10 SDRs with 2 + automation, saving $424K/year while increasing output by 71%.

I don't just architect systems—I build them. 19 public repositories. 5 LLMs orchestrated. BASIN::NEXUS v10.0 is my autonomous GTM Operating System.

Want to learn more? Check out my blog post: "Why Leon Basin Matters" or explore my case studies. What interests you most?`,
                
                `Leon Basin here. I'm a Revenue Architect—which means I build systems, not just run playbooks. 

15+ years GTM experience across enterprise tech. MBA from Santa Clara. And I write code—83K+ lines of it. 

My work: I replaced a 10-person SDR team with 2 SDRs + automation at a Series A cybersecurity company. Result: $424K annual savings, 77 meetings/month (vs 45 before), and 5-day SDR ramp (vs 3-month industry average).

I built BASIN::NEXUS v10.0—an autonomous GTM OS that automates research, prioritization, and outreach. 5 LLMs orchestrated. 19 repositories deployed.

What would you like to explore? My systems? Case studies? Or how I can help with your revenue challenge?`,
                
                `I'm Leon. I build revenue systems that scale revenue, not teams. 

Started in GTM at Google (Operations Specialist), then SurveyMonkey ($300M+ portfolio), HP, NetApp. Now I code systems that automate research, prioritization, and outreach—so humans focus on the close.

The numbers: $23M+ career pipeline, 160% pipeline growth, $424K annual savings, 5 days SDR ramp. 83,000+ lines of code. 19 repositories. 5 LLMs orchestrated.

I wrote about this in my blog post "Why Leon Basin Matters"—it explains why a Revenue Architect who codes changes everything. Want me to share the key insights?`
            ];
            
            // If we have blog content, enhance the response
            if (blogContent && blogContent.length > 100) {
                const blogSummary = blogContent.substring(0, 300) + '...';
                responses.push(`I'm Leon Basin. ${blogSummary} 

Read the full story in my blog post "Why Leon Basin Matters" at /blog/posts/why-leon-basin-matters.html. What would you like to know more about?`);
            }
            
            // Rotate through responses to avoid repetition
            const used = Array.from(ConversationMemory.responses);
            const available = responses.filter(r => {
                const key = r.toLowerCase().substring(0, 50);
                return !used.has(key);
            });
            
            const response = available.length > 0 
                ? available[Math.floor(Math.random() * available.length)]
                : responses[0];
            
            const key = response.toLowerCase().substring(0, 50);
            ConversationMemory.responses.add(key);
            
            // Track that we answered an identity question (for learning)
            ConversationMemory.updateVisitorProfile({
                questionsAsked: (ConversationMemory.visitorProfile.questionsAsked || 0) + 1,
                lastIdentityQuestion: new Date().toISOString()
            });
            
            return response;
        },

        handleConfusedResponse(message, context) {
            const responses = [
                "Sorry if I wasn't clear! Let me try again. I'm Leon—I build revenue systems. What would you like to know? I can tell you about my work, show you case studies, or help with your GTM challenge.",
                "My bad—let me clarify. I'm here to help with revenue architecture questions. What are you curious about? My systems? Case studies? Or something else?",
                "No worries! I'm Leon, and I build revenue systems. What would be most helpful—learning about my work, seeing case studies, or discussing your revenue challenge?"
            ];
            
            // Don't add follow-up question after confused response
            const response = responses[Math.floor(Math.random() * responses.length)];
            return response;
        },

        handleRevenueChallenge(message) {
            const lower = message.toLowerCase();
            if (lower.includes('300k') || lower.includes('making')) {
                return "Making $300K+ in revenue? That's about building systems that work while you sleep. I've built systems that generate $621K+ pipeline. The key: signal detection + automation + human focus on high-value activities. What's your current revenue challenge?";
            }
            if (lower.includes('headcount')) {
                return "Headcount is expensive. I replaced 10 SDRs with 2 + automation, saving $424K/year. The system finds prospects, scores them, and routes to humans for the close. Want to see how?";
            }
            return "Revenue challenges are usually about one thing: scaling without scaling headcount. That's where systems come in. What's your specific challenge?";
        },

        generateFromKnowledgeBase(topics, context) {
            if (topics.length === 0) {
                return this.generateContextualGreeting(context);
            }

            // Try each topic until we find a response
            for (const topic of topics) {
                const response = KnowledgeBase.getResponse(topic, context);
                if (response) return response;
            }

            return this.generateContextualGreeting(context);
        },

        generateContextualGreeting(context) {
            const archetype = ConversationMemory.visitorProfile.archetype || 'traveler';
            const archetypeData = VisitorArchetypes[archetype];
            
            if (context.conversationLength === 0) {
                return archetypeData.responses.greeting;
            } else {
                return archetypeData.responses.followUp;
            }
        },

        generateExplanation(message, topics) {
            const lower = message.toLowerCase();
            if (lower.includes('build') || lower.includes('code')) {
                return "I build systems by treating GTM as an engineering problem. Start with signal detection (finding high-intent prospects), automate the repetitive (research, outreach), and focus humans on the strategic (close, relationship). That's the architecture.";
            }
            if (lower.includes('424k') || lower.includes('sdr')) {
                return "The $424K came from replacing 10 SDRs with 2 + automation. But it's not just headcount—it's signal architecture. The system finds prospects automatically, scores them, and routes to the right human. Result: 77 meetings/month vs 45 before.";
            }
            return "I'd love to explain. What specifically would you like to understand? I can walk through architecture, case studies, or help you think through your challenge.";
        },

        generateFollowUpQuestion(topics, context) {
            const questions = [
                "What's your biggest revenue challenge right now?",
                "What would you like to explore next?",
                "Is there a specific system or case study you're curious about?",
                "What stage are you at—exploring, ready to build, or need help now?",
                "Want to see a specific case study or project?",
                "What interests you most—the systems I've built, or how I can help you?"
            ];

            // Avoid asking the same question - check last 5 responses
            const recentQuestions = ConversationMemory.history
                .slice(-5)
                .filter(h => h.role === 'agent' && h.message.includes('?'))
                .map(h => h.message.split('?')[0].toLowerCase().trim());
            
            const used = Array.from(ConversationMemory.questions);
            const available = questions.filter(q => {
                const qLower = q.toLowerCase();
                return !used.includes(qLower) && !recentQuestions.some(rq => qLower.includes(rq) || rq.includes(qLower.substring(0, 20)));
            });
            
            const question = available.length > 0 
                ? available[Math.floor(Math.random() * available.length)]
                : questions[Math.floor(Math.random() * questions.length)];

            ConversationMemory.questions.add(question.toLowerCase());
            return question;
        },

        shouldAddFollowUp() {
            const lastResponse = ConversationMemory.history[ConversationMemory.history.length - 1];
            if (!lastResponse || lastResponse.role !== 'agent') return false;
            
            // Don't add follow-up if we just asked a question
            if (lastResponse.message.includes('?')) return false;
            
            // Don't add follow-up if user seems confused or negative
            const lastUserMessage = ConversationMemory.history
                .filter(h => h.role === 'user')
                .slice(-1)[0];
            if (lastUserMessage && lastUserMessage.message.match(/(?:huh|what|weird|confused|don't|no|stop)/i)) {
                return false;
            }
            
            // Add follow-up every 3-4 responses (less frequent)
            return ConversationMemory.history.length % 4 === 0 && ConversationMemory.history.length > 2;
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // UI CREATION
    // ═══════════════════════════════════════════════════════════════

    function createPremiumUI() {
        const container = document.createElement('div');
        container.id = 'premium-leon-container';
        container.innerHTML = `
            <div id="premium-leon-window" class="premium-leon-window">
                <div class="premium-leon-header">
                    <div class="premium-leon-title">
                        <span class="premium-leon-avatar">👤</span>
                        <div>
                            <span class="premium-leon-name">Leon</span>
                            <span class="premium-leon-badge" id="premium-badge">Premium</span>
                        </div>
                    </div>
                    <button class="premium-leon-minimize" id="leon-minimize">−</button>
                    <button class="premium-leon-close" id="leon-close">×</button>
                </div>
                <div class="premium-leon-messages" id="leon-messages"></div>
                <div class="premium-leon-suggestions" id="leon-suggestions"></div>
                <div class="premium-leon-input-container">
                    <input type="text" id="leon-input" placeholder="Ask me anything..." autocomplete="off">
                    <button id="leon-send">→</button>
                </div>
                <div class="premium-leon-footer">
                    <div class="premium-leon-actions">
                        <button class="premium-action-btn" id="btn-schedule">📅 Schedule</button>
                        <button class="premium-action-btn" id="btn-premium">⭐ Premium</button>
                    </div>
                </div>
            </div>
            <button id="premium-leon-toggle" class="premium-leon-toggle">
                <span class="leon-icon">💬</span>
                <span class="leon-pulse"></span>
            </button>
        `;

        document.body.appendChild(container);

        // Styles
        const style = document.createElement('style');
        style.textContent = `
            #premium-leon-container {
                position: fixed; bottom: 20px; right: 20px; z-index: 10000;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            }
            .premium-leon-toggle {
                width: 64px; height: 64px; border-radius: 50%;
                background: linear-gradient(135deg, #D4AF37 0%, #B8860B 100%);
                border: 2px solid rgba(212, 175, 55, 0.4); color: #050508;
                font-size: 28px; cursor: pointer; box-shadow: 0 4px 20px rgba(212, 175, 55, 0.4);
                display: flex; align-items: center; justify-content: center;
                transition: all 0.3s; position: relative;
            }
            .premium-leon-toggle:hover { transform: scale(1.1); box-shadow: 0 6px 30px rgba(212, 175, 55, 0.6); }
            .leon-pulse {
                position: absolute; top: -4px; right: -4px;
                width: 12px; height: 12px; background: #ff4444;
                border-radius: 50%; animation: pulse 2s infinite;
            }
            @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.2); } }
            .premium-leon-window {
                position: absolute; bottom: 84px; right: 0;
                width: 420px; height: 600px;
                background: linear-gradient(180deg, #0a0a0f 0%, #050508 100%);
                border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 16px;
                box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5);
                display: none; flex-direction: column; overflow: hidden;
            }
            .premium-leon-window.open { display: flex; animation: slideInRight 0.3s; }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            .premium-leon-header {
                padding: 16px; border-bottom: 1px solid rgba(212, 175, 55, 0.2);
                display: flex; align-items: center; justify-content: space-between;
                background: rgba(212, 175, 55, 0.05);
            }
            .premium-leon-title { display: flex; align-items: center; gap: 12px; }
            .premium-leon-avatar {
                width: 40px; height: 40px; border-radius: 50%;
                background: rgba(212, 175, 55, 0.2);
                display: flex; align-items: center; justify-content: center;
                font-size: 20px;
            }
            .premium-leon-name { font-size: 1rem; color: #D4AF37; font-weight: 600; display: block; }
            .premium-leon-badge {
                font-size: 0.7rem; color: #8b8573; background: rgba(212, 175, 55, 0.1);
                padding: 2px 8px; border-radius: 8px; margin-top: 2px; display: inline-block;
            }
            .premium-leon-minimize, .premium-leon-close {
                background: none; border: none; color: #8b8573;
                font-size: 20px; cursor: pointer; padding: 0 4px;
                transition: color 0.2s;
            }
            .premium-leon-minimize:hover, .premium-leon-close:hover { color: #D4AF37; }
            .premium-leon-messages {
                flex: 1; overflow-y: auto; padding: 20px;
                display: flex; flex-direction: column; gap: 16px;
            }
            .premium-leon-message {
                max-width: 85%; padding: 12px 16px; border-radius: 12px;
                font-size: 0.9rem; line-height: 1.6; white-space: pre-wrap;
            }
            .premium-leon-message.user {
                align-self: flex-end; background: rgba(212, 175, 55, 0.2);
                color: #f0e6d3; border: 1px solid rgba(212, 175, 55, 0.3);
            }
            .premium-leon-message.agent {
                align-self: flex-start; background: rgba(212, 175, 55, 0.1);
                color: #f0e6d3; border: 1px solid rgba(212, 175, 55, 0.2);
            }
            .premium-leon-suggestions {
                padding: 12px 20px; display: flex; gap: 8px; flex-wrap: wrap;
                border-top: 1px solid rgba(212, 175, 55, 0.1);
                background: rgba(212, 175, 55, 0.02);
            }
            .premium-leon-suggestion {
                padding: 6px 12px; background: rgba(212, 175, 55, 0.1);
                border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 16px;
                font-size: 0.75rem; color: #D4AF37; cursor: pointer;
                transition: all 0.2s;
            }
            .premium-leon-suggestion:hover {
                background: rgba(212, 175, 55, 0.2); transform: translateY(-2px);
            }
            .premium-leon-input-container {
                padding: 16px; border-top: 1px solid rgba(212, 175, 55, 0.2);
                display: flex; gap: 10px;
            }
            #leon-input {
                flex: 1; background: rgba(212, 175, 55, 0.05);
                border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 8px;
                padding: 10px 14px; color: #f0e6d3; font-size: 0.9rem;
            }
            #leon-input:focus { outline: none; border-color: #D4AF37; }
            #leon-send {
                background: #D4AF37; border: none; border-radius: 8px;
                padding: 10px 20px; color: #050508; font-weight: 600;
                cursor: pointer; transition: all 0.2s;
            }
            #leon-send:hover { background: #FFD700; }
            .premium-leon-footer {
                padding: 12px 16px; border-top: 1px solid rgba(212, 175, 55, 0.1);
                background: rgba(212, 175, 55, 0.02);
            }
            .premium-leon-actions {
                display: flex; gap: 8px; justify-content: center;
            }
            .premium-action-btn {
                padding: 8px 16px; background: rgba(212, 175, 55, 0.1);
                border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 8px;
                color: #D4AF37; font-size: 0.8rem; cursor: pointer;
                transition: all 0.2s;
            }
            .premium-action-btn:hover {
                background: rgba(212, 175, 55, 0.2); transform: translateY(-2px);
            }
        `;
        document.head.appendChild(style);
    }

    // ═══════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════════════════════════

    function init() {
        createPremiumUI();
        CRMIntegration.loadVisitorProfile();

        const toggle = document.getElementById('premium-leon-toggle');
        const window = document.getElementById('premium-leon-window');
        const input = document.getElementById('leon-input');
        const sendBtn = document.getElementById('leon-send');
        const minimizeBtn = document.getElementById('leon-minimize');
        const closeBtn = document.getElementById('leon-close');
        const suggestions = document.getElementById('leon-suggestions');
        const scheduleBtn = document.getElementById('btn-schedule');
        const premiumBtn = document.getElementById('btn-premium');

        // Conversation starters
        const starters = [
            "Show me your code",
            "Tell me about the $424K case",
            "What services do you offer?",
            "How did you build this?"
        ];

        starters.forEach(starter => {
            const btn = document.createElement('button');
            btn.className = 'premium-leon-suggestion';
            btn.textContent = starter;
            btn.onclick = () => {
                handleUserMessage(starter);
                btn.remove();
            };
            suggestions.appendChild(btn);
        });

        toggle.addEventListener('click', () => {
            window.classList.toggle('open');
            if (window.classList.contains('open')) {
                input.focus();
                if (ConversationMemory.history.length === 0) {
                    setTimeout(() => {
                        const greeting = ConversationEngine.generateContextualGreeting({ conversationLength: 0 });
                        typeMessage(greeting, 'agent');
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

        minimizeBtn.addEventListener('click', () => window.classList.remove('open'));
        closeBtn.addEventListener('click', () => window.classList.remove('open'));
        scheduleBtn.addEventListener('click', () => {
            MonetizationEngine.offerScheduling().action();
        });
        premiumBtn.addEventListener('click', () => {
            window.open('/consulting/', '_blank');
        });
    }

    function addMessage(content, role = 'agent') {
        const messagesContainer = document.getElementById('leon-messages');
        const messageEl = document.createElement('div');
        messageEl.className = `premium-leon-message ${role}`;
        messageEl.textContent = content;
        messagesContainer.appendChild(messageEl);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function typeMessage(content, role = 'agent') {
        return new Promise((resolve) => {
            const messagesContainer = document.getElementById('leon-messages');
            const messageEl = document.createElement('div');
            messageEl.className = `premium-leon-message ${role} typing`;
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
            }, CONFIG.conversation.typingSpeed);
        });
    }

    async function handleUserMessage(message) {
        if (!message.trim()) return;

        addMessage(message, 'user');

        const thinkingEl = document.createElement('div');
        thinkingEl.className = 'premium-leon-message agent typing';
        thinkingEl.textContent = '...';
        document.getElementById('leon-messages').appendChild(thinkingEl);

        await new Promise(resolve => setTimeout(resolve, CONFIG.conversation.thinkingDelay));
        thinkingEl.remove();

        const context = ConversationMemory.getContext();
        const response = await ConversationEngine.generateResponse(message, context);
        
        await typeMessage(response, 'agent');

        // Save to CRM
        ConversationMemory.visitorProfile.lastInteraction = new Date().toISOString();
        ConversationMemory.visitorProfile.visitCount++;
        localStorage.setItem('visitor_profile', JSON.stringify(ConversationMemory.visitorProfile));
        CRMIntegration.saveVisitor(ConversationMemory.visitorProfile);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
