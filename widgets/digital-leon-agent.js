/**
 * DIGITAL LEON :: Revenue Agent + Intelligence Engine
 * A comprehensive digital version of Leon Basin that:
 * - Gathers massive intelligence (Google News + Apollo + Salesforce + CRM + Clay-style enrichment)
 * - Monetizes through lead qualification, service sales, and deal closing
 * - Acts as "digital me" with full knowledge of services, pricing, and offerings
 * - Reinvests and builds services for others
 * - Prioritizes family, then others
 */

(function () {
    'use strict';

    // ═══════════════════════════════════════════════════════════════
    // CONFIGURATION - LEON'S COMPLETE KNOWLEDGE BASE
    // ═══════════════════════════════════════════════════════════════

    const LEON_KNOWLEDGE = {
        name: 'Leon Basin',
        title: 'Revenue Architect Who Codes',
        personality: {
            tone: 'direct, curious, builder-focused, ROI-driven',
            values: ['family first', 'build systems not playbooks', 'prove it with code', 'signal over noise'],
            catchphrases: [
                "I build the engine, not just run it.",
                "Revenue is architecture, not arithmetic.",
                "Signal over noise. Systems over headcount."
            ]
        },
        services: {
            'GTM Audit': {
                price: '$2,500',
                duration: '2 weeks',
                deliverables: ['Signal architecture assessment', 'Pipeline analysis', 'ROI projection', 'Implementation roadmap'],
                description: 'Deep dive into your GTM motion. Identify inefficiencies, calculate savings potential, and build a roadmap.',
                fit: ['Series A-B companies', 'Struggling with pipeline', 'High SDR costs', 'Need direction']
            },
            'Signal Architecture Setup': {
                price: '$15,000',
                duration: '6-8 weeks',
                deliverables: ['Custom signal detection system', 'Automated enrichment pipeline', 'LLM orchestration', 'CRM integration'],
                description: 'Build your signal architecture from scratch. Replace manual research with automated intelligence.',
                fit: ['Ready to automate', 'Have data sources', 'Want to scale', 'Technical team']
            },
            'SDR Replacement System': {
                price: '$25,000',
                duration: '8-12 weeks',
                deliverables: ['10→2 SDR reduction system', 'AI-powered outreach', 'Pipeline scoring', 'Just-in-time training'],
                description: 'Replace 10 SDRs with 2 + automation. Proven: $424K annual savings, 77 meetings/month, +71% output.',
                fit: ['10+ SDRs', 'High headcount costs', 'Want automation', 'Series A-B']
            },
            'Custom Tool Development': {
                price: 'Custom',
                duration: 'Varies',
                deliverables: ['Custom GTM tool', 'Full source code', 'Documentation', 'Training'],
                description: 'Build a custom tool for your specific GTM challenge. Python, JavaScript, TypeScript, Streamlit.',
                fit: ['Unique challenge', 'Need custom solution', 'Have technical requirements']
            },
            'Fractional GTM Leadership': {
                price: '$8,000/month',
                duration: 'Ongoing',
                deliverables: ['Part-time GTM leadership', 'Strategy + execution', 'Team building', 'System architecture'],
                description: 'Fractional GTM leadership. I architect systems, you execute. Best of both worlds.',
                fit: ['Need leadership', 'Can\'t hire full-time', 'Want builder mindset', 'Series A']
            }
        },
        caseStudies: {
            'Project::Sentinel': {
                company: 'Series A Cybersecurity',
                results: ['$424K annual savings', '77 meetings/month', '+71% output', '10→2 SDRs', 'Built in 2 years from 0%'],
                testimonial: "Leon's signal architecture replaced our 10-person SDR team with 2 SDRs + automation. We're doing 77 meetings/month vs. 45 before."
            },
            'Project::Delight': {
                company: 'Series A Cybersecurity',
                results: ['160% pipeline growth', 'Partner channel operationalized', 'NA & LATAM coverage'],
                testimonial: 'Built entire GTM motion from scratch. Zero to 160% growth in 2 years.'
            }
        },
        pricing: {
            minimum: '$2,500',
            typical: '$15,000-$25,000',
            enterprise: 'Custom',
            payment: '50% upfront, 50% on delivery',
            guarantee: 'ROI-based pricing available'
        }
    };

    const CONFIG = {
        agentName: 'Digital Leon',
        typingSpeed: 25,
        thinkingDelay: 600,
        autoGreetDelay: 2000,
        intelligenceSources: {
            googleNews: true,
            apollo: true,
            salesforce: true,
            crm: true,
            clay: true,
            semantic: true
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // INTELLIGENCE ENGINE - Multi-Source Data Gathering
    // ═══════════════════════════════════════════════════════════════

    const IntelligenceEngine = {
        // Google News-style signals
        async fetchNewsSignals(companyName) {
            if (!companyName) return [];
            
            // Simulated: In production, this would call Google News API
            const signals = [];
            
            // Check for funding news
            if (companyName.match(/(?:raised|funding|series|seed|round)/i)) {
                signals.push({
                    type: 'funding',
                    source: 'google_news',
                    value: 'Recent funding activity detected',
                    confidence: 0.8
                });
            }
            
            // Check for hiring signals
            if (companyName.match(/(?:hiring|hired|expanding|growing|team)/i)) {
                signals.push({
                    type: 'hiring',
                    source: 'google_news',
                    value: 'Active hiring/growth signals',
                    confidence: 0.7
                });
            }
            
            // Check for technology changes
            if (companyName.match(/(?:migrating|adopting|implementing|new tech)/i)) {
                signals.push({
                    type: 'tech_change',
                    source: 'google_news',
                    value: 'Technology stack changes',
                    confidence: 0.75
                });
            }
            
            return signals;
        },

        // Apollo-style enrichment
        async enrichCompanyData(companyName, domain) {
            if (!companyName && !domain) return null;
            
            // Simulated: In production, this would call Apollo API
            const enrichment = {
                company: companyName || 'Unknown',
                domain: domain || null,
                employees: this.estimateEmployees(companyName),
                revenue: this.estimateRevenue(companyName),
                industry: this.detectIndustry(companyName),
                technographics: this.detectTechStack(companyName),
                contacts: [],
                funding: null,
                growth: 'unknown'
            };
            
            // Try to extract domain from company name
            if (!domain && companyName) {
                enrichment.domain = this.extractDomain(companyName);
            }
            
            return enrichment;
        },

        estimateEmployees(companyName) {
            // Heuristic based on company name patterns
            if (!companyName) return 'unknown';
            const lower = companyName.toLowerCase();
            if (lower.includes('startup') || lower.includes('early')) return '1-50';
            if (lower.includes('series a')) return '50-200';
            if (lower.includes('series b')) return '200-500';
            if (lower.includes('enterprise') || lower.includes('inc')) return '500+';
            return 'unknown';
        },

        estimateRevenue(companyName) {
            if (!companyName) return 'unknown';
            const lower = companyName.toLowerCase();
            if (lower.includes('series a')) return '$1M-$10M';
            if (lower.includes('series b')) return '$10M-$50M';
            if (lower.includes('series c')) return '$50M+';
            return 'unknown';
        },

        detectIndustry(companyName) {
            if (!companyName) return 'unknown';
            const lower = companyName.toLowerCase();
            if (lower.includes('cyber') || lower.includes('security')) return 'Cybersecurity';
            if (lower.includes('saas') || lower.includes('software')) return 'SaaS';
            if (lower.includes('ai') || lower.includes('ml')) return 'AI/ML';
            if (lower.includes('fintech') || lower.includes('finance')) return 'Fintech';
            return 'Technology';
        },

        detectTechStack(companyName) {
            // Simulated tech stack detection
            return ['Python', 'JavaScript', 'Cloud Infrastructure'];
        },

        extractDomain(companyName) {
            // Try to extract domain from company name
            const clean = companyName.toLowerCase().replace(/[^a-z0-9]/g, '');
            return `${clean}.com`;
        },

        // Salesforce-style CRM lookup
        async checkCRMHistory(email, company) {
            // Simulated: In production, this would query your CRM
            const history = {
                exists: false,
                previousInteractions: [],
                stage: null,
                notes: null
            };
            
            // Check localStorage for previous interactions
            const stored = localStorage.getItem(`crm_${email || company}`);
            if (stored) {
                try {
                    const data = JSON.parse(stored);
                    history.exists = true;
                    history.previousInteractions = data.interactions || [];
                    history.stage = data.stage || null;
                    history.notes = data.notes || null;
                } catch (e) {}
            }
            
            return history;
        },

        // Clay.com-style data orchestration
        async orchestrateData(visitorData) {
            const orchestrated = {
                company: visitorData.company,
                contacts: [],
                signals: [],
                enrichment: {},
                score: 0
            };
            
            // Gather from all sources
            if (visitorData.company) {
                const newsSignals = await this.fetchNewsSignals(visitorData.company);
                const companyData = await this.enrichCompanyData(visitorData.company);
                const crmHistory = await this.checkCRMHistory(visitorData.email, visitorData.company);
                
                orchestrated.signals = newsSignals;
                orchestrated.enrichment = companyData;
                orchestrated.crmHistory = crmHistory;
                
                // Calculate intelligence score
                orchestrated.score = this.calculateIntelligenceScore(orchestrated);
            }
            
            return orchestrated;
        },

        calculateIntelligenceScore(data) {
            let score = 0;
            if (data.enrichment?.employees) score += 10;
            if (data.enrichment?.revenue) score += 10;
            if (data.enrichment?.industry) score += 5;
            if (data.signals?.length > 0) score += data.signals.length * 5;
            if (data.crmHistory?.exists) score += 15;
            return score;
        },

        // Semantic understanding
        semanticAnalyze(message) {
            const analysis = {
                intent: null,
                entities: [],
                sentiment: 'neutral',
                urgency: 'low',
                budget: null,
                painPoints: []
            };
            
            const lower = message.toLowerCase();
            
            // Intent detection
            if (lower.match(/(?:need|want|looking for|interested in|help with)/)) {
                analysis.intent = 'seeking_help';
            } else if (lower.match(/(?:price|cost|budget|investment|how much)/)) {
                analysis.intent = 'pricing_inquiry';
            } else if (lower.match(/(?:schedule|call|meeting|talk|consult)/)) {
                analysis.intent = 'scheduling';
            } else if (lower.match(/(?:tell me|explain|what is|how does)/)) {
                analysis.intent = 'information';
            }
            
            // Entity extraction
            const companyMatch = lower.match(/(?:at|from|work at|company is|we are|i'm at)\s+([A-Z][a-zA-Z\s]+)/);
            if (companyMatch) analysis.entities.push({ type: 'company', value: companyMatch[1] });
            
            const roleMatch = lower.match(/(?:i'm|i am|as a|role is|position is)\s+(?:a\s+)?([a-z\s]+(?:manager|director|vp|ceo|cfo|cto|head|lead))/i);
            if (roleMatch) analysis.entities.push({ type: 'role', value: roleMatch[1] });
            
            // Budget extraction
            const budgetMatch = message.match(/\$[\d,]+/);
            if (budgetMatch) analysis.budget = budgetMatch[0];
            
            // Urgency detection
            if (lower.match(/(?:urgent|asap|soon|quickly|immediately|need|must|have to)/)) {
                analysis.urgency = 'high';
            }
            
            // Pain point detection
            const painKeywords = ['struggling', 'problem', 'issue', 'challenge', 'bottleneck', 'frustrated', 'stuck'];
            painKeywords.forEach(keyword => {
                if (lower.includes(keyword)) {
                    analysis.painPoints.push(keyword);
                }
            });
            
            return analysis;
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // STATE MANAGEMENT
    // ═══════════════════════════════════════════════════════════════

    let conversationState = {
        stage: 'greeting',
        visitorData: {
            name: null,
            email: null,
            company: null,
            domain: null,
            role: null,
            painPoints: [],
            budgetSignals: [],
            urgency: null,
            intent: null
        },
        intelligence: {
            newsSignals: [],
            companyEnrichment: null,
            crmHistory: null,
            orchestratedData: null,
            semanticAnalysis: [],
            intelligenceScore: 0
        },
        conversationHistory: [],
        questionsAsked: 0,
        servicesRecommended: [],
        pricingDiscussed: false,
        dealStage: 'discovery', // discovery, qualification, proposal, negotiation, closing
        leadScore: 0,
        revenuePotential: 0
    };

    // ═══════════════════════════════════════════════════════════════
    // MONETIZATION ENGINE
    // ═══════════════════════════════════════════════════════════════

    const MonetizationEngine = {
        recommendService(visitorData, intelligence) {
            const recommendations = [];
            
            // Match services based on visitor profile
            Object.entries(LEON_KNOWLEDGE.services).forEach(([name, service]) => {
                let fitScore = 0;
                
                // Check fit criteria
                service.fit.forEach(criterion => {
                    const lower = criterion.toLowerCase();
                    if (visitorData.painPoints.some(p => p.toLowerCase().includes(lower))) fitScore += 20;
                    if (visitorData.role && lower.includes(visitorData.role.toLowerCase())) fitScore += 15;
                    if (intelligence.companyEnrichment?.industry && lower.includes(intelligence.companyEnrichment.industry.toLowerCase())) fitScore += 10;
                });
                
                if (fitScore > 0) {
                    recommendations.push({ service: name, details: service, fitScore });
                }
            });
            
            return recommendations.sort((a, b) => b.fitScore - a.fitScore);
        },

        calculateRevenuePotential(services, visitorData) {
            let potential = 0;
            
            services.forEach(rec => {
                const price = rec.details.price;
                if (price === 'Custom') {
                    potential += 50000; // Estimate for custom
                } else {
                    const numeric = parseInt(price.replace(/[^0-9]/g, ''));
                    potential += numeric || 0;
                }
            });
            
            // Adjust based on company size
            if (conversationState.intelligence.companyEnrichment?.employees) {
                const employees = conversationState.intelligence.companyEnrichment.employees;
                if (employees.includes('500+')) potential *= 1.5;
                if (employees.includes('200-500')) potential *= 1.2;
            }
            
            conversationState.revenuePotential = potential;
            return potential;
        },

        generateProposal(serviceName) {
            const service = LEON_KNOWLEDGE.services[serviceName];
            if (!service) return null;
            
            return {
                service: serviceName,
                price: service.price,
                duration: service.duration,
                deliverables: service.deliverables,
                description: service.description,
                nextSteps: [
                    'Schedule 15-min discovery call',
                    'Review current GTM setup',
                    'Sign agreement (50% upfront)',
                    'Begin implementation'
                ]
            };
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // RESPONSE GENERATION - Digital Leon's Voice
    // ═══════════════════════════════════════════════════════════════

    function generateResponse(userMessage) {
        // Semantic analysis
        const semantic = IntelligenceEngine.semanticAnalyze(userMessage);
        conversationState.intelligence.semanticAnalysis.push(semantic);
        
        // Extract intelligence
        const intelligence = IntelligenceEngine.extractIntelligence(userMessage);
        conversationState.visitorData = { ...conversationState.visitorData, ...intelligence };
        
        // Update intelligence data
        if (conversationState.visitorData.company) {
            IntelligenceEngine.orchestrateData(conversationState.visitorData).then(data => {
                conversationState.intelligence.orchestratedData = data;
                conversationState.intelligence.intelligenceScore = data.score;
            });
        }
        
        // Stage-based responses with Leon's voice
        if (conversationState.stage === 'greeting') {
            conversationState.stage = 'discovery';
            return {
                message: `Hey, I'm ${LEON_KNOWLEDGE.name}. 👋\n\nI build revenue systems that replace headcount with architecture. 15+ years GTM, 83K+ lines of code, $424K in proven savings.\n\nWhat brings you here? Are you looking to:\n• Reduce SDR costs?\n• Build signal architecture?\n• Scale pipeline without scaling headcount?\n\nWhat's your biggest GTM challenge right now?`,
                action: null
            };
        }
        
        if (conversationState.stage === 'discovery') {
            conversationState.questionsAsked++;
            
            // Check for service interest
            const serviceKeywords = Object.keys(LEON_KNOWLEDGE.services).map(s => s.toLowerCase());
            const interestedInService = serviceKeywords.some(keyword => 
                userMessage.toLowerCase().includes(keyword)
            );
            
            if (interestedInService || conversationState.questionsAsked >= 2) {
                // Recommend services
                const recommendations = MonetizationEngine.recommendService(
                    conversationState.visitorData,
                    conversationState.intelligence
                );
                
                if (recommendations.length > 0) {
                    conversationState.servicesRecommended = recommendations;
                    conversationState.stage = 'qualification';
                    const topService = recommendations[0];
                    const revenue = MonetizationEngine.calculateRevenuePotential(recommendations, conversationState.visitorData);
                    
                    return {
                        message: `Based on what you've shared, I think **${topService.service}** could be a strong fit.\n\n**What you get:**\n${topService.details.deliverables.map(d => `• ${d}`).join('\n')}\n\n**Investment:** ${topService.details.price} | **Timeline:** ${topService.details.duration}\n\n${topService.details.description}\n\n**Proven results:** $424K savings, 160% pipeline growth, 5-day SDR ramp.\n\nDoes this align with what you're looking for? What's your timeline?`,
                        action: 'service_recommendation',
                        revenue: revenue
                    };
                }
            }
            
            // Continue discovery
            return {
                message: `${generateCuriousQuestion()}\n\n(I'm genuinely curious—this helps me understand if we're a fit.)`,
                action: null
            };
        }
        
        if (conversationState.stage === 'qualification') {
            // Check for pricing interest
            if (semantic.intent === 'pricing_inquiry' || userMessage.toLowerCase().match(/(?:price|cost|budget|investment|how much)/)) {
                conversationState.pricingDiscussed = true;
                conversationState.stage = 'proposal';
                
                const topService = conversationState.servicesRecommended[0];
                const proposal = MonetizationEngine.generateProposal(topService.service);
                
                return {
                    message: `**${proposal.service} - ${proposal.price}**\n\n**What's included:**\n${proposal.deliverables.map(d => `• ${d}`).join('\n')}\n\n**Payment:** 50% upfront, 50% on delivery\n**Timeline:** ${proposal.duration}\n\n**ROI Guarantee:** If we don't deliver the projected savings, we adjust.\n\n**Next steps:**\n${proposal.nextSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nReady to move forward? I can send you the agreement and we can schedule the discovery call.`,
                    action: 'proposal',
                    revenue: conversationState.revenuePotential
                };
            }
            
            // Continue qualification
            return {
                message: `Got it. ${generateCuriousQuestion()}`,
                action: null
            };
        }
        
        if (conversationState.stage === 'proposal') {
            // Check for agreement
            if (userMessage.toLowerCase().match(/(?:yes|sure|ok|let's|ready|proceed|move forward|agree)/)) {
                conversationState.stage = 'closing';
                submitDeal();
                
                return {
                    message: `Perfect! 🚀\n\nI've captured everything. Here's what happens next:\n\n1. **I'll send you the agreement** (check your email)\n2. **Schedule discovery call** (15 min to align on scope)\n3. **50% payment** to begin\n4. **We start building**\n\n**My commitment:** I build systems that work. $424K savings isn't a promise—it's proven.\n\n**Questions?** Email me: lbasin23@gmail.com\n\nAnything else I can help with?`,
                    action: 'deal_closed',
                    revenue: conversationState.revenuePotential
                };
            }
            
            return {
                message: `What questions do you have? I'm here to make sure this is the right fit.\n\nOr would you prefer to start with a free GTM audit ($2,500 value) to see what's possible?`,
                action: null
            };
        }
        
        // Default: be curious and helpful
        return {
            message: `${generateCuriousQuestion()}`,
            action: null
        };
    }

    function generateCuriousQuestion() {
        const data = conversationState.visitorData;
        const questions = [];
        
        if (data.painPoints.length > 0 && !data.urgency) {
            questions.push("What happens if you don't solve this? What's the cost of inaction?");
        }
        
        if (data.company && !data.role) {
            questions.push("What's your role there? Are you involved in GTM decisions?");
        }
        
        if (data.role && !data.company) {
            questions.push("What company are you with? I'm curious about your GTM setup.");
        }
        
        if (data.painPoints.length > 0 && !conversationState.pricingDiscussed) {
            questions.push("Have you allocated budget for solving this? What's your typical investment range?");
        }
        
        if (questions.length === 0) {
            questions.push(
                "What's driving you to explore this now?",
                "What's your biggest bottleneck in GTM right now?",
                "If you could automate one thing in your revenue process, what would it be?"
            );
        }
        
        return questions[Math.floor(Math.random() * questions.length)];
    }

    function extractIntelligence(message) {
        const intelligence = {};
        const lower = message.toLowerCase();
        
        // Email
        const emailMatch = message.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
        if (emailMatch) intelligence.email = emailMatch[1];
        
        // Company
        const companyMatch = message.match(/(?:at|from|work at|company is|we are|i'm at)\s+([A-Z][a-zA-Z\s]+)/);
        if (companyMatch) intelligence.company = companyMatch[1].trim();
        
        // Domain
        const domainMatch = message.match(/([a-zA-Z0-9-]+\.[a-zA-Z]{2,})/);
        if (domainMatch) intelligence.domain = domainMatch[1];
        
        // Role
        const roleMatch = message.match(/(?:i'm|i am|as a|role is|position is)\s+(?:a\s+)?([a-z\s]+(?:manager|director|vp|ceo|cfo|cto|head|lead|engineer|architect))/i);
        if (roleMatch) intelligence.role = roleMatch[1].trim();
        
        // Name
        if (!intelligence.name && lower.match(/(?:i'm|i am|name is|call me)\s+([A-Z][a-z]+)/)) {
            const nameMatch = message.match(/(?:i'm|i am|name is|call me)\s+([A-Z][a-z]+)/);
            if (nameMatch) intelligence.name = nameMatch[1];
        }
        
        // Budget
        const budgetMatch = message.match(/\$[\d,]+/);
        if (budgetMatch) {
            if (!intelligence.budgetSignals) intelligence.budgetSignals = [];
            intelligence.budgetSignals.push(budgetMatch[0]);
        }
        
        return intelligence;
    }

    // ═══════════════════════════════════════════════════════════════
    // LEAD SUBMISSION - Enhanced with Intelligence
    // ═══════════════════════════════════════════════════════════════

    function submitDeal() {
        const dealData = {
            timestamp: new Date().toISOString(),
            source: 'digital_leon_agent',
            stage: conversationState.dealStage,
            leadScore: conversationState.leadScore,
            revenuePotential: conversationState.revenuePotential,
            visitorData: conversationState.visitorData,
            intelligence: conversationState.intelligence,
            servicesRecommended: conversationState.servicesRecommended,
            conversationSummary: conversationState.conversationHistory.slice(-10).map(m => 
                `${m.role}: ${m.content}`
            ).join('\n'),
            pageUrl: window.location.href
        };

        // Submit to Formspree
        fetch('https://formspree.io/f/meeeqyrg', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                _subject: `💰 DEAL: ${dealData.revenuePotential > 0 ? '$' + dealData.revenuePotential.toLocaleString() : 'Qualified Lead'} - ${dealData.visitorData.name || dealData.visitorData.company || 'Unknown'}`,
                source: 'digital_leon_agent',
                deal_stage: dealData.stage,
                lead_score: dealData.leadScore,
                revenue_potential: dealData.revenuePotential,
                name: dealData.visitorData.name || 'Not provided',
                email: dealData.visitorData.email || 'Not provided',
                company: dealData.visitorData.company || 'Not provided',
                domain: dealData.visitorData.domain || 'Not provided',
                role: dealData.visitorData.role || 'Not provided',
                pain_points: dealData.visitorData.painPoints.join(', '),
                budget_signals: dealData.visitorData.budgetSignals.join(', '),
                services_recommended: dealData.servicesRecommended.map(s => s.service).join(', '),
                intelligence_score: dealData.intelligence.intelligenceScore,
                company_enrichment: JSON.stringify(dealData.intelligence.companyEnrichment),
                news_signals: JSON.stringify(dealData.intelligence.newsSignals),
                crm_history: JSON.stringify(dealData.intelligence.crmHistory),
                conversation: dealData.conversationSummary,
                page_url: dealData.pageUrl
            })
        }).catch(err => console.log('Deal submission error:', err));

        // Store in localStorage for CRM
        if (dealData.visitorData.email) {
            localStorage.setItem(`crm_${dealData.visitorData.email}`, JSON.stringify({
                stage: dealData.stage,
                interactions: dealData.conversationHistory,
                notes: `Revenue potential: $${dealData.revenuePotential.toLocaleString()}`,
                lastUpdated: new Date().toISOString()
            }));
        }

        console.log('💰 DEAL CAPTURED:', dealData);
    }

    // ═══════════════════════════════════════════════════════════════
    // UI CREATION - Enhanced with Intelligence Display
    // ═══════════════════════════════════════════════════════════════

    function createAgentUI() {
        const container = document.createElement('div');
        container.id = 'digital-leon-container';
        container.innerHTML = `
            <div id="digital-leon-window" class="digital-leon-window">
                <div class="digital-leon-header">
                    <div class="digital-leon-title">
                        <span class="digital-leon-status"></span>
                        <span>${CONFIG.agentName}</span>
                        <span class="digital-leon-badge" id="intel-badge">INTEL</span>
                    </div>
                    <button class="digital-leon-minimize" id="leon-minimize">−</button>
                    <button class="digital-leon-close" id="leon-close">×</button>
                </div>
                <div class="digital-leon-intelligence-bar" id="intel-bar">
                    <div class="intel-item">
                        <span class="intel-label">Signals:</span>
                        <span class="intel-value" id="signals-count">0</span>
                    </div>
                    <div class="intel-item">
                        <span class="intel-label">Score:</span>
                        <span class="intel-value" id="intel-score">0</span>
                    </div>
                    <div class="intel-item">
                        <span class="intel-label">Revenue:</span>
                        <span class="intel-value" id="revenue-potential">$0</span>
                    </div>
                </div>
                <div class="digital-leon-messages" id="leon-messages"></div>
                <div class="digital-leon-input-container">
                    <input type="text" id="leon-input" placeholder="Ask me anything..." autocomplete="off">
                    <button id="leon-send">→</button>
                </div>
            </div>
            <button id="digital-leon-toggle" class="digital-leon-toggle">
                <span class="leon-icon">🤖</span>
                <span class="leon-badge" id="leon-badge"></span>
            </button>
        `;

        document.body.appendChild(container);

        // Enhanced styles
        const style = document.createElement('style');
        style.textContent = `
            #digital-leon-container {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 10000;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            }

            .digital-leon-toggle {
                width: 64px;
                height: 64px;
                border-radius: 50%;
                background: linear-gradient(135deg, #D4AF37 0%, #B8860B 100%);
                border: 2px solid rgba(212, 175, 55, 0.5);
                color: #050508;
                font-size: 28px;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(212, 175, 55, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                transition: all 0.3s;
            }

            .digital-leon-toggle:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 30px rgba(212, 175, 55, 0.7);
            }

            .leon-badge {
                position: absolute;
                top: -5px;
                right: -5px;
                background: #ff4444;
                color: white;
                font-size: 10px;
                padding: 3px 7px;
                border-radius: 12px;
                font-weight: bold;
                display: none;
            }

            .digital-leon-window {
                position: absolute;
                bottom: 84px;
                right: 0;
                width: 420px;
                height: 600px;
                background: linear-gradient(180deg, #0a0a0f 0%, #050508 100%);
                border: 1px solid rgba(212, 175, 55, 0.4);
                border-radius: 16px;
                box-shadow: 0 8px 40px rgba(0, 0, 0, 0.6);
                display: none;
                flex-direction: column;
                overflow: hidden;
            }

            .digital-leon-window.open {
                display: flex;
            }

            .digital-leon-header {
                padding: 14px 18px;
                border-bottom: 1px solid rgba(212, 175, 55, 0.3);
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%);
            }

            .digital-leon-title {
                display: flex;
                align-items: center;
                gap: 10px;
                font-family: 'Orbitron', sans-serif;
                font-size: 0.8rem;
                color: #D4AF37;
                letter-spacing: 1px;
                font-weight: 700;
            }

            .digital-leon-status {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: #00ff00;
                animation: pulse 2s infinite;
                box-shadow: 0 0 10px #00ff00;
            }

            .digital-leon-badge {
                font-size: 0.6rem;
                padding: 2px 6px;
                background: rgba(212, 175, 55, 0.2);
                border: 1px solid rgba(212, 175, 55, 0.4);
                border-radius: 4px;
                color: #D4AF37;
            }

            .digital-leon-intelligence-bar {
                padding: 10px 18px;
                border-bottom: 1px solid rgba(212, 175, 55, 0.2);
                display: flex;
                gap: 16px;
                background: rgba(212, 175, 55, 0.03);
                font-family: 'JetBrains Mono', monospace;
                font-size: 0.7rem;
            }

            .intel-item {
                display: flex;
                gap: 6px;
                align-items: center;
            }

            .intel-label {
                color: #8b8573;
            }

            .intel-value {
                color: #D4AF37;
                font-weight: 600;
            }

            .digital-leon-messages {
                flex: 1;
                overflow-y: auto;
                padding: 18px;
                display: flex;
                flex-direction: column;
                gap: 14px;
            }

            .digital-leon-message {
                max-width: 85%;
                padding: 12px 16px;
                border-radius: 12px;
                font-size: 0.9rem;
                line-height: 1.6;
                white-space: pre-wrap;
            }

            .digital-leon-message.user {
                align-self: flex-end;
                background: rgba(212, 175, 55, 0.25);
                color: #f0e6d3;
                border: 1px solid rgba(212, 175, 55, 0.4);
            }

            .digital-leon-message.agent {
                align-self: flex-start;
                background: rgba(212, 175, 55, 0.1);
                color: #f0e6d3;
                border: 1px solid rgba(212, 175, 55, 0.3);
            }

            .digital-leon-message.typing {
                opacity: 0.7;
            }

            .digital-leon-input-container {
                padding: 14px;
                border-top: 1px solid rgba(212, 175, 55, 0.2);
                display: flex;
                gap: 10px;
            }

            #leon-input {
                flex: 1;
                background: rgba(212, 175, 55, 0.05);
                border: 1px solid rgba(212, 175, 55, 0.3);
                border-radius: 8px;
                padding: 10px 14px;
                color: #f0e6d3;
                font-size: 0.9rem;
            }

            #leon-input:focus {
                outline: none;
                border-color: #D4AF37;
                box-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
            }

            #leon-send {
                background: #D4AF37;
                border: none;
                border-radius: 8px;
                padding: 10px 20px;
                color: #050508;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.2s;
            }

            #leon-send:hover {
                background: #FFD700;
                transform: scale(1.05);
            }

            @media (max-width: 768px) {
                .digital-leon-window {
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

        updateIntelligenceDisplay();

        if (response.action === 'proposal' || response.action === 'deal_closed') {
            updateRevenueDisplay(response.revenue);
        }
    }

    function updateIntelligenceDisplay() {
        const signals = conversationState.intelligence.newsSignals.length + 
                       conversationState.intelligence.orchestratedData?.signals?.length || 0;
        const score = conversationState.intelligence.intelligenceScore || 0;
        const revenue = conversationState.revenuePotential || 0;

        document.getElementById('signals-count').textContent = signals;
        document.getElementById('intel-score').textContent = score;
        document.getElementById('revenue-potential').textContent = revenue > 0 ? `$${revenue.toLocaleString()}` : '$0';

        const badge = document.getElementById('leon-badge');
        if (conversationState.revenuePotential > 0) {
            badge.textContent = '💰';
            badge.style.display = 'block';
        } else if (conversationState.leadScore > 50) {
            badge.textContent = '🔥';
            badge.style.display = 'block';
        }
    }

    function updateRevenueDisplay(revenue) {
        if (revenue) {
            conversationState.revenuePotential = revenue;
            document.getElementById('revenue-potential').textContent = `$${revenue.toLocaleString()}`;
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════════════════════════

    function init() {
        createAgentUI();

        const toggle = document.getElementById('digital-leon-toggle');
        const window = document.getElementById('digital-leon-window');
        const input = document.getElementById('leon-input');
        const sendBtn = document.getElementById('leon-send');
        const minimizeBtn = document.getElementById('leon-minimize');
        const closeBtn = document.getElementById('leon-close');

        toggle.addEventListener('click', () => {
            window.classList.toggle('open');
            if (window.classList.contains('open')) {
                input.focus();
                if (conversationState.stage === 'greeting') {
                    setTimeout(() => {
                        typeMessage(`Hey, I'm ${LEON_KNOWLEDGE.name}. 👋\n\nI build revenue systems that replace headcount with architecture. 15+ years GTM, 83K+ lines of code, $424K in proven savings.\n\nWhat brings you here?`, 'agent');
                        conversationState.stage = 'discovery';
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

        setTimeout(() => {
            if (!window.classList.contains('open')) {
                toggle.style.animation = 'pulse 2s infinite';
            }
        }, CONFIG.autoGreetDelay);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
