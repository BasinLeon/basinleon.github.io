/**
 * LEON'S LOGIC BOT
 * No API required - Pure knowledge base of thinking, frameworks, KPIs, and vision
 * Shows how Leon approaches problems across different scenarios
 */

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════════
    // KNOWLEDGE BASE - Leon's Thinking & Frameworks
    // ═══════════════════════════════════════════════════════════════

    const KNOWLEDGE_BASE = {
        // Core Philosophy
        philosophy: {
            keywords: ['philosophy', 'approach', 'thinking', 'mindset', 'believe'],
            response: `**Revenue as Architecture, Not Arithmetic**

My core belief: Revenue isn't about "more calls = more deals." It's about designing systems that route the right signal to the right action at the right time.

**The 3 Pillars:**
1. **SIGNAL** - Where data enters (webhooks, sheets, APIs)
2. **SYSTEM** - Where intelligence forms (scoring, enrichment, routing)
3. **SCALE** - Where outputs multiply (briefs, emails, CRM updates)

Traditional GTM is linear. Mine is recursive - the system learns from every interaction.`
        },

        // Signal-to-System-to-Scale Framework
        framework: {
            keywords: ['signal', 'system', 'scale', 'framework', 'methodology', 'architecture'],
            response: `**SIGNAL → SYSTEM → SCALE Framework**

**Layer 1: SIGNAL (Input)**
- Google Sheets, RSS feeds, LinkedIn webhooks
- Funding announcements, hiring patterns, tech stack changes
- 50k+ signals/day monitored across 7 sources

**Layer 2: SYSTEM (Processing)**
- Python + LLMs score each signal (0-100)
- n8n workflows route high-intent leads automatically
- Enrichment APIs add contact data, tech stack, persona

**Layer 3: SCALE (Output)**
- Auto-generate personalized cold emails
- Create executive briefs for board meetings
- Update CRM, send Slack alerts, trigger sequences

**The Magic:** One human + one system = 10 SDRs worth of output.

**Real Results:** +160% pipeline YoY at Fudo, $424K projected savings for Ambient.`
        },

        // KPIs and Metrics
        kpis: {
            keywords: ['kpi', 'metric', 'measure', 'track', 'performance', 'results'],
            response: `**Key Performance Indicators I Track**

**Pipeline Metrics:**
- **Signal-to-SQL Conversion:** 8-12% (vs. 2-4% industry avg)
- **Cost per Qualified Lead:** $18 (vs. $150 industry avg)
- **Velocity:** 23 days to first meeting (vs. 45 days avg)

**Efficiency Metrics:**
- **Toil Reduction:** -92% manual research time
- **Output Multiplication:** +50% more outreach with same headcount
- **ROI:** $424K annual savings on 10-SDR equivalent workload

**Quality Metrics:**
- **Reply Rate:** 15-22% (cold outbound)
- **Meeting Show Rate:** 78%
- **SQL-to-Opp:** 45%

**How I Measure Success:**
Not "how many calls" but "how much signal captured per dollar spent."`
        },

        // Vision for GTM
        vision: {
            keywords: ['vision', 'future', 'goal', 'direction', 'want to', 'looking for'],
            response: `**My Vision for GTM**

**The Problem:** Most companies still operate like it's 2015. They hire SDRs to "smile and dial" through bad lists, burning $150K/year per rep on 2% conversion rates.

**The Opportunity:** AI + No-code tools make it possible to build autonomous revenue engines that:
- Monitor 50k signals/day (impossible for humans)
- Score and route leads in real-time
- Generate personalized outreach at scale
- Free humans to do what they do best: close deals

**What I Want to Build:**
A company where the GTM function is engineered, not managed. Where:
- Every SDR has an AI co-pilot that feeds them pre-qualified, researched leads
- Every AE gets auto-generated battle cards before every call
- Every executive gets real-time pipeline intelligence, not month-old spreadsheets

**The Role I'm Seeking:**
Director/VP of GTM Engineering - where I can build this vision from scratch.

**Why I'll Win:** Because I've already built it. Now I just need a company ambitious enough to deploy it.`
        },

        // GTM Strategy Approach
        strategy: {
            keywords: ['strategy', 'gtm', 'go-to-market', 'plan', 'approach sales'],
            response: `**How I Build GTM Strategy**

**Step 1: Signal Identification**
- What buyer behaviors indicate intent?
  (e.g., hiring a CISO = security budget unlocked)
- What triggers create urgency?
  (e.g., funding round = new tools evaluation)

**Step 2: System Design**
- How do we capture these signals?
  (APIs, webhooks, scrapers, manual intel)
- How do we score them?
  (Recency + magnitude + fit = priority score)
- How do we route them?
  (High-intent → AE, Low-intent → nurture)

**Step 3: Scale Execution**
- What templates work for each persona?
  (Technical founder ≠ Procurement VP)
- What sequences convert best?
  (A/B test everything, kill losers fast)
- What bottlenecks exist?
  (If reply rate is high but meeting rate is low → fix SDR qualification)

**Example:**
At Fudo Security, I identified that "recently hired CISO at Series B" was a 10x signal. Built a system to monitor LinkedIn + Crunchbase, auto-enrich contacts, and generate personalized "congrats on new role" emails. Result: 18% reply rate, 160% pipeline increase YoY.

**The Principle:** Strategy without system is just PowerPoint.`
        },

        // Technical Stack & Tools
        tools: {
            keywords: ['tools', 'stack', 'technology', 'tech', 'use', 'build with'],
            response: `**The $0 GTM Stack I Built**

**Orchestration:** n8n (free, self-hosted Zapier alternative)
**Data Sources:**
- Google Sheets (free pipeline tracking)
- RSS feeds (company news, funding announcements)
- LinkedIn webhooks (hiring signals)
- Clearbit/Hunter APIs (free tiers for enrichment)

**Processing:**
- Python + Pandas (scoring logic)
- Local LLMs via Ollama (free GPT-4 alternative)
- Streamlit (free app hosting)

**Output:**
- Gmail API (auto-send sequences)
- Slack webhooks (team alerts)
- PDF generation (executive briefs)

**Total Monthly Cost:** $0 (vs. $950+/mo for Outreach + ZoomInfo + Clay)

**Why This Matters:**
I can deploy enterprise-grade GTM infrastructure for a startup with zero budget. That's the competitive advantage - speed without spend.`
        },

        // Interview Philosophy
        interviews: {
            keywords: ['interview', 'hire', 'candidate', 'recruit', 'assess'],
            response: `**How I Approach Interviews (Both Sides)**

**When I'm the Candidate:**
- I don't "interview" - I consult
- Show up with a pro bono case study already built
- Ask: "What's the blocker?" not "What's the role?"
- Example: Built Ambient.ai case study before on-site → showed $424K savings model → moved to final round

**When I'm the Hiring Manager:**
- Skip the "tell me about yourself" - waste of time
- Give real problems: "Here's our pipeline data, what's wrong?"
- Look for builders, not talkers
- Red flag: Someone who says "I'd hire more SDRs" (brute force thinking)
- Green flag: Someone who says "First, let's see where the signal drops off" (systems thinking)

**What I Value:**
- Curiosity > Credentials
- Shipping > Planning
- Metrics > Narratives

**Deal Breaker:**
"That's not my job" mentality. In startups, everyone wears 3 hats.`
        },

        // Company Fit Assessment
        fit: {
            keywords: ['fit', 'culture', 'match', 'right for', 'work with'],
            response: `**How I Assess Company Fit**

**What I Look For:**
1. **Technical Respect** - Do they value engineering in GTM?
2. **Autonomy** - Can I build systems or just execute playbooks?
3. **Metrics** - Do they measure output or activity?
4. **Speed** - Do they ship fast or debate forever?

**Green Flags:**
- Founder/CEO is technical (understands what I'm building)
- Small team (< 50 people) - more impact, less politics
- Scrappy budget (forces creative solutions)
- "Show us what you'd build" vs. "Tell us about your experience"

**Red Flags:**
- "We need someone to manage our SDR team" (I don't babysit)
- "What's your Salesforce admin experience?" (I build, not configure)
- "Our process is very structured" (code for: slow and bureaucratic)

**Companies I'd Thrive At:**
- Series A/B SaaS (post-PMF, pre-bloat)
- Developer tools or cybersecurity (I speak the language)
- Founder-led sales → scaling motion
- Budget-conscious (my superpower: $0 stack)

**Deal Makers:**
Ambient.ai, BRM Labs, LiveRamp-type companies where GTM = competitive advantage, not cost center.`
        },

        // Problem Solving Approach
        problemsolving: {
            keywords: ['problem', 'solve', 'fix', 'debug', 'troubleshoot', 'stuck'],
            response: `**My Problem-Solving Framework**

**Step 1: Define the Real Problem**
- Not "low pipeline" - that's a symptom
- Real problem: "Where in the funnel is signal dying?"
- Tool: Conversion rate audit at each stage

**Step 2: Identify the Constraint**
- Theory of Constraints: Fix the bottleneck first
- Example: If reply rate is 20% but meeting rate is 5%, problem is SDR qualification, not top-of-funnel

**Step 3: Build the Minimum Viable Fix**
- Don't build enterprise software
- Start with a Google Sheet + n8n workflow
- Ship in 48 hours, iterate weekly

**Step 4: Measure, Kill, or Scale**
- If it works: Automate it
- If it doesn't: Kill it fast
- No "let's give it more time" - data decides

**Example: Fudo Security Pipeline Stall**
- Symptom: 60-day sales cycles
- Root cause: AEs waiting for Security reviews
- Fix: Built a "Security Requirement Checklist" tool
- Result: Cut cycles to 35 days, +160% pipeline YoY

**The Principle:** Most problems aren't hard - they're just poorly defined.`
        },

        // Leadership Style
        leadership: {
            keywords: ['leadership', 'manage', 'team', 'lead', 'style', 'people'],
            response: `**My Leadership Philosophy**

**I Don't Manage People - I Remove Obstacles**

**What Good Leaders Do:**
- Build systems so the team can self-serve
- Unblock faster than problems arise
- Ship tools, not directives

**What Bad Leaders Do:**
- Micromanage activity ("Did you make 50 calls?")
- Hoard context ("Just do what I say")
- Confuse busyness with productivity

**How I Run Teams:**
1. **Clarity > Control** - Give the "why," let them decide the "how"
2. **Tools > Training** - Build an AI co-pilot vs. 40-hour onboarding deck
3. **Metrics > Meetings** - Async dashboards, not daily standups

**Example:**
At Sense, I built an "Outreach Autopsy" tool that analyzed why cold emails failed. Team used it to self-diagnose issues. Result: Reply rates went from 8% → 15% in 6 weeks without me "managing" anyone.

**What I Won't Do:**
- Hire/fire based on "culture fit" - I care about output
- Run "pizza party" morale events - pay people well instead
- Pretend I have all the answers - I build systems to find them

**Bottom Line:** The best leaders make themselves unnecessary.`
        },

        // Default/Fallback
        default: {
            keywords: [''],
            response: `**How Can I Help?**

I'm Leon's Logic Bot - here to show you how he thinks. Try asking about:

- **Philosophy:** "What's your GTM philosophy?"
- **Framework:** "Explain Signal-System-Scale"
- **KPIs:** "What metrics do you track?"
- **Vision:** "What's your GTM vision?"
- **Strategy:** "How do you build GTM strategy?"
- **Tools:** "What's in your tech stack?"
- **Interviews:** "How do you approach interviews?"
- **Fit:** "What companies are you a good fit for?"
- **Problem Solving:** "How do you solve problems?"
- **Leadership:** "What's your leadership style?"

Or just ask me anything about revenue architecture, AI-powered GTM, or building systems.`
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // MATCHING LOGIC
    // ═══════════════════════════════════════════════════════════════

    function findBestMatch(userInput) {
        const input = userInput.toLowerCase();

        // Check each category for keyword matches
        for (const [category, data] of Object.entries(KNOWLEDGE_BASE)) {
            if (category === 'default') continue;

            for (const keyword of data.keywords) {
                if (input.includes(keyword)) {
                    return data.response;
                }
            }
        }

        // Return default if no match
        return KNOWLEDGE_BASE.default.response;
    }

    // ═══════════════════════════════════════════════════════════════
    // UI RENDERING
    // ═══════════════════════════════════════════════════════════════

    const STYLES = `
        #leon-logic-bot {
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 9999;
            font-family: 'JetBrains Mono', monospace;
        }

        #bot-toggle {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #D4AF37 0%, #FFD700 100%);
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(212, 175, 55, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            transition: all 0.3s ease;
        }

        #bot-toggle:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(212, 175, 55, 0.6);
        }

        #bot-window {
            position: absolute;
            bottom: 80px;
            right: 0;
            width: 420px;
            max-height: 600px;
            background: #0a0a0f;
            border: 1px solid rgba(212, 175, 55, 0.3);
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
            display: none;
            flex-direction: column;
            overflow: hidden;
        }

        #bot-window.open {
            display: flex;
            animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        #bot-header {
            padding: 16px;
            background: rgba(212, 175, 55, 0.1);
            border-bottom: 1px solid rgba(212, 175, 55, 0.3);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        #bot-header h3 {
            margin: 0;
            font-size: 14px;
            color: #D4AF37;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-family: 'Orbitron', sans-serif;
        }

        #bot-close {
            background: none;
            border: none;
            color: #666;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        #bot-close:hover {
            color: #D4AF37;
        }

        #bot-messages {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            max-height: 400px;
        }

        .bot-message {
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 13px;
            line-height: 1.6;
            word-wrap: break-word;
        }

        .bot-message.user {
            align-self: flex-end;
            background: #D4AF37;
            color: #000;
            max-width: 80%;
        }

        .bot-message.assistant {
            align-self: flex-start;
            background: rgba(212, 175, 55, 0.1);
            border: 1px solid rgba(212, 175, 55, 0.3);
            color: #f0e6d3;
            max-width: 95%;
        }

        .bot-message.assistant strong {
            color: #FFD700;
            display: block;
            margin-bottom: 8px;
        }

        .bot-message.system {
            align-self: center;
            background: transparent;
            color: #666;
            font-size: 11px;
            font-style: italic;
            max-width: 100%;
            text-align: center;
        }

        #bot-input-area {
            padding: 12px;
            border-top: 1px solid rgba(212, 175, 55, 0.3);
            background: rgba(212, 175, 55, 0.05);
        }

        #bot-input {
            width: 100%;
            padding: 10px;
            background: #050508;
            border: 1px solid rgba(212, 175, 55, 0.3);
            border-radius: 6px;
            color: #f0e6d3;
            font-family: inherit;
            font-size: 13px;
            resize: none;
            outline: none;
        }

        #bot-input:focus {
            border-color: #D4AF37;
        }

        .quick-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-top: 8px;
        }

        .quick-action {
            padding: 4px 10px;
            background: rgba(212, 175, 55, 0.1);
            border: 1px solid rgba(212, 175, 55, 0.3);
            border-radius: 12px;
            color: #D4AF37;
            font-size: 10px;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .quick-action:hover {
            background: rgba(212, 175, 55, 0.2);
            border-color: #D4AF37;
        }

        @media (max-width: 480px) {
            #bot-window {
                width: calc(100vw - 32px);
                max-height: calc(100vh - 120px);
                bottom: 80px;
                right: 16px;
            }
        }
    `;

    function init() {
        // Inject styles
        const styleEl = document.createElement('style');
        styleEl.textContent = STYLES;
        document.head.appendChild(styleEl);

        // Create chatbot HTML
        const container = document.createElement('div');
        container.id = 'leon-logic-bot';
        container.innerHTML = `
            <button id="bot-toggle" aria-label="Open Leon's Logic Bot">
                🧠
            </button>
            <div id="bot-window">
                <div id="bot-header">
                    <h3>Leon's Logic Bot</h3>
                    <button id="bot-close" aria-label="Close bot">×</button>
                </div>
                <div id="bot-messages">
                    <div class="bot-message system">
                        No API needed - Pure logic & frameworks
                    </div>
                    <div class="bot-message assistant">
                        <strong>Hi! I'm Leon's thinking, codified.</strong>
                        Ask me about his GTM philosophy, frameworks, KPIs, vision, or problem-solving approach. I don't need an API - all the knowledge is built-in.
                    </div>
                </div>
                <div id="bot-input-area">
                    <textarea id="bot-input" placeholder="Ask about philosophy, strategy, KPIs..." rows="2"></textarea>
                    <div class="quick-actions">
                        <span class="quick-action" data-q="What's your GTM philosophy?">Philosophy</span>
                        <span class="quick-action" data-q="Explain Signal-System-Scale">Framework</span>
                        <span class="quick-action" data-q="What metrics do you track?">KPIs</span>
                        <span class="quick-action" data-q="What's your vision?">Vision</span>
                        <span class="quick-action" data-q="How do you solve problems?">Problem Solving</span>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(container);

        // Event listeners
        document.getElementById('bot-toggle').addEventListener('click', toggleBot);
        document.getElementById('bot-close').addEventListener('click', toggleBot);
        document.getElementById('bot-input').addEventListener('keydown', handleInput);

        // Quick actions
        document.querySelectorAll('.quick-action').forEach(btn => {
            btn.addEventListener('click', () => {
                const question = btn.dataset.q;
                document.getElementById('bot-input').value = question;
                handleInput({ key: 'Enter', target: document.getElementById('bot-input') });
            });
        });
    }

    function toggleBot() {
        const window = document.getElementById('bot-window');
        window.classList.toggle('open');

        if (window.classList.contains('open')) {
            document.getElementById('bot-input').focus();
        }
    }

    function handleInput(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const input = e.target.value.trim();
            if (!input) return;

            // Clear input
            e.target.value = '';

            // Add user message
            addMessage(input, 'user');

            // Get response
            const response = findBestMatch(input);

            // Add bot response with slight delay for realism
            setTimeout(() => {
                addMessage(response, 'assistant');
            }, 300);
        }
    }

    function addMessage(text, type) {
        const messagesContainer = document.getElementById('bot-messages');
        const messageEl = document.createElement('div');
        messageEl.className = `bot-message ${type}`;

        if (type === 'assistant') {
            // Parse markdown-style bold
            messageEl.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        } else {
            messageEl.textContent = text;
        }

        messagesContainer.appendChild(messageEl);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
