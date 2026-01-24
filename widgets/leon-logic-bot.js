/**
 * BASIN::NEXUS INTELLIGENCE
 * The thinking layer of the Signal Engine
 * Knowledge base + context-aware responses + conversation memory
 */

(function () {
    'use strict';

    // ═══════════════════════════════════════════════════════════════
    // CONFIGURATION
    // ═══════════════════════════════════════════════════════════════

    const CONFIG = {
        maxContextMessages: 6,
        typingDelay: 600,
        showSignalStats: true
    };

    // Conversation memory
    let conversationHistory = [];

    // ═══════════════════════════════════════════════════════════════
    // KNOWLEDGE BASE - Leon's Complete Thinking System
    // ═══════════════════════════════════════════════════════════════

    const KNOWLEDGE_BASE = {
        // Core Philosophy
        philosophy: {
            keywords: ['philosophy', 'approach', 'thinking', 'mindset', 'believe', 'core'],
            response: `**Revenue as Architecture, Not Arithmetic**

My core belief: Revenue isn't about "more calls = more deals." It's about designing systems that route the right signal to the right action at the right time.

**The 3 Pillars:**
1. **SIGNAL** — Where data enters (webhooks, sheets, APIs)
2. **SYSTEM** — Where intelligence forms (scoring, enrichment, routing)
3. **SCALE** — Where outputs multiply (briefs, emails, CRM updates)

Traditional GTM is linear. Mine is recursive — the system learns from every interaction.

**The $424K Insight:** I don't add headcount. I replace $770K in costs with $150K in architecture. That's $424K saved.`
        },

        // Signal-to-System-to-Scale Framework
        framework: {
            keywords: ['signal', 'system', 'scale', 'framework', 'methodology', 'architecture', 's3', 'three pillars'],
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

**The Magic:** 1 human + 1 system = 10 SDRs worth of output.

**Real Results:** +160% pipeline YoY at Fudo, $424K projected savings for Ambient.`
        },

        // KPIs and Metrics
        kpis: {
            keywords: ['kpi', 'metric', 'measure', 'track', 'performance', 'results', 'numbers', 'data'],
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

        // Vision for GTM - Expanded Network
        vision: {
            keywords: ['vision', 'future', 'goal', 'direction', 'want to', 'looking for', 'next', 'build', 'dream'],
            response: `**My Vision for GTM — The Network**

**The Problem:** Most companies still operate like it's 2015. They hire SDRs to "smile and dial" through bad lists, burning $150K/year per rep on 2% conversion rates.

**The Opportunity:** AI + No-code tools make it possible to build autonomous revenue engines that:
- Monitor 50k signals/day (impossible for humans)
- Score and route leads in real-time
- Generate personalized outreach at scale
- Free humans to do what they do best: close deals

**What I Want to Build:**
A company where the GTM function is *engineered*, not managed. Where:
- Every SDR has an AI co-pilot that feeds them pre-qualified, researched leads
- Every AE gets auto-generated battle cards before every call
- Every executive gets real-time pipeline intelligence, not month-old spreadsheets

**The Architecture:**
- **Signal Layer:** 50k+ signals/day from 7 sources
- **Processing Layer:** 5 LLMs orchestrate scoring and routing
- **Output Layer:** Automated briefs, emails, CRM updates
- **Human Layer:** Focus on high-value activities (closing, strategy)

**The Role I'm Seeking:**
Director/VP of GTM Engineering — where I can build this vision from scratch.

**Why I'll Win:** Because I've already built it. BASIN::NEXUS is the proof. Now I just need a company ambitious enough to deploy it at scale.

**Connection to Past:**
- Google: Learned data systems at scale
- Series A Cybersecurity: Proved signal architecture works
- BASIN::NEXUS: Built the system that proves the thesis

**Related Topics:** Philosophy → Framework → Case Studies → Tools`
        },

        // GTM Strategy Approach
        strategy: {
            keywords: ['strategy', 'gtm', 'go-to-market', 'plan', 'approach sales', 'how would you', 'build gtm'],
            response: `**How I Build GTM Strategy**

**Step 1: Signal Identification**
- What buyer behaviors indicate intent?
  (e.g., hiring a CISO = security budget unlocked)
- What triggers create urgency?
  (e.g., funding round = new tools evaluation)

**Step 2: System Design**
- How do we capture these signals?
- How do we score them?
  (Recency + magnitude + fit = priority score)
- How do we route them?
  (High-intent → AE, Low-intent → nurture)

**Step 3: Scale Execution**
- What templates work for each persona?
- What sequences convert best?
- What bottlenecks exist?

**Example:**
At Fudo Security, I identified that "recently hired CISO at Series B" was a 10x signal. Built a system to monitor LinkedIn + Crunchbase, auto-enrich contacts, and generate personalized "congrats on new role" emails. 

**Result:** 18% reply rate, 160% pipeline increase YoY.

**The Principle:** Strategy without system is just PowerPoint.`
        },

        // Technical Stack & Tools
        tools: {
            keywords: ['tools', 'stack', 'technology', 'tech', 'use', 'build with', '$0', 'zero cost', 'free'],
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
I can deploy enterprise-grade GTM infrastructure for a startup with zero budget. That's the competitive advantage — speed without spend.`
        },

        // Interview Philosophy
        interviews: {
            keywords: ['interview', 'hire', 'candidate', 'recruit', 'assess', 'job'],
            response: `**How I Approach Interviews (Both Sides)**

**When I'm the Candidate:**
- I don't "interview" — I consult
- Show up with a pro bono case study already built
- Ask: "What's the blocker?" not "What's the role?"
- Example: Built Ambient.ai case study before on-site → showed $424K savings model → moved to final round

**When I'm the Hiring Manager:**
- Skip the "tell me about yourself" — waste of time
- Give real problems: "Here's our pipeline data, what's wrong?"
- Look for builders, not talkers
- Red flag: Someone who says "I'd hire more SDRs" (brute force)
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
            keywords: ['fit', 'culture', 'match', 'right for', 'work with', 'company', 'type', 'looking for', 'role'],
            response: `**How I Assess Company Fit**

**What I Look For:**
1. **Technical Respect** — Do they value engineering in GTM?
2. **Autonomy** — Can I build systems or just execute playbooks?
3. **Metrics** — Do they measure output or activity?
4. **Speed** — Do they ship fast or debate forever?

**Green Flags:**
- Founder/CEO is technical (understands what I'm building)
- Small team (< 50 people) — more impact, less politics
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

**Roles I'm Seeking:**
- Director/VP of GTM Engineering
- Director/VP of Sales (with systems focus)
- Strategic BD roles with real ownership
- Enterprise AE roles (SaaS / AI / Cybersecurity)

**Connection:** This connects to my Vision → Philosophy → Framework. I want to build, not just operate.

**Related Topics:** Vision → Philosophy → Case Studies`
        },

        // Problem Solving Approach
        problemsolving: {
            keywords: ['problem', 'solve', 'fix', 'debug', 'troubleshoot', 'stuck', 'issue', 'diagnose', 'dying', 'broken'],
            response: `**My Problem-Solving Framework**

**Step 1: Define the Real Problem**
- Not "low pipeline" — that's a symptom
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
- No "let's give it more time" — data decides

**Example: Fudo Security Pipeline Stall**
- Symptom: 60-day sales cycles
- Root cause: AEs waiting for Security reviews
- Fix: Built a "Security Requirement Checklist" tool
- Result: Cut cycles to 35 days, +160% pipeline YoY

**The Principle:** Most problems aren't hard — they're just poorly defined.`
        },

        // Leadership Style
        leadership: {
            keywords: ['leadership', 'manage', 'team', 'lead', 'style', 'people', 'boss'],
            response: `**My Leadership Philosophy**

**I Don't Manage People — I Remove Obstacles**

**What Good Leaders Do:**
- Build systems so the team can self-serve
- Unblock faster than problems arise
- Ship tools, not directives

**What Bad Leaders Do:**
- Micromanage activity ("Did you make 50 calls?")
- Hoard context ("Just do what I say")
- Confuse busyness with productivity

**How I Run Teams:**
1. **Clarity > Control** — Give the "why," let them decide the "how"
2. **Tools > Training** — Build an AI co-pilot vs. 40-hour onboarding deck
3. **Metrics > Meetings** — Async dashboards, not daily standups

**Example:**
At Sense, I built an "Outreach Autopsy" tool that analyzed why cold emails failed. Team used it to self-diagnose issues. Result: Reply rates went from 8% → 15% in 6 weeks without me "managing" anyone.

**Bottom Line:** The best leaders make themselves unnecessary.`
        },

        // Case Studies - Network of Projects
        casestudies: {
            keywords: ['case study', 'example', 'fudo', 'ambient', 'sense', 'sendbird', 'project', 'built', 'war story', 'sanho', 'hyperdrive', 'kickstarter', 'braintrust', 'slingshot', 'netapp', 'google', 'surveymonkey'],
            response: `**Case Studies Network — What I've Built**

**🔐 Series A Cybersecurity (2024-2025)**
- Challenge: Zero US presence, dormant partners, stalled PoCs
- Built: Americas GTM from scratch, activated NA & LATAM channels
- Signal Architecture: LinkedIn + Crunchbase monitoring for CISO hires
- Result: +160% pipeline YoY, partner channel → active revenue
- Connection: Proved signal architecture works at enterprise scale

**🎯 Interview Case Study (Ambient.ai)**
- Challenge: "How would you scale our GTM?"
- Built: $424K savings model showing 7 SDRs → 1 architect + automation
- Signal Architecture: Automated lead scoring + enrichment
- Result: Advanced to final round
- Connection: Showed how to architect before being hired

**📊 Sense (2022-2023)**
- Challenge: 5-person BDR team struggling — 8% reply rates, high churn
- Built: "Outreach Autopsy" diagnostic tool + Social Selling playbook
- Signal Architecture: Email failure analysis + persona targeting
- Result: Reply rates 8% → 18%, significant pipeline, $250K deal closed personally
- Connection: First tool I built to diagnose GTM problems

**🚀 Sanho/HyperDrive (2015-2019)**
- Challenge: Launch world's first USB-C Hub for iPad Pro via crowdfunding
- Built: Kickstarter/Indiegogo strategy across 16+ campaigns
- Signal Architecture: Community engagement + product-market fit signals
- Result: $7M+ raised total, $3.1M single campaign (most crowdfunded MacBook accessory)
- Connection: Learned community-driven growth before it was mainstream

**📊 SurveyMonkey (2019-2021)**
- Challenge: Manage $300M enterprise portfolio, 700+ accounts
- Built: Portfolio optimization, expansion revenue systems
- Signal Architecture: Account health scoring, renewal prediction
- Result: Managed largest portfolio in company history
- Connection: Proved I could handle enterprise scale

**🏢 NetApp (2013-2014)**
- Challenge: Security operations across 16-building campus
- Built: Led 3-person team, managed global backup operations
- Signal Architecture: Incident monitoring, threat detection
- Result: Zero security incidents under tenure
- Connection: Applied security rigor to revenue systems

**⚡ Basin::Nexus (2023-Present)**
- Challenge: Job hunting is broken — too much noise, not enough signal
- Built: 83K+ lines of code, 5 LLMs, React app, 3 interactive tools
- Signal Architecture: 7-vector job sweep, pipeline scoring, interview prep
- Result: Multiple active final-round interviews simultaneously
- Connection: The system that proves the thesis — 1 engineer > 10 SDRs

**🔍 Google (2014-2015)**
- Challenge: Operations at scale for Google Shopping
- Built: Data-driven decision systems, trend analysis
- Signal Architecture: User behavior patterns, conversion optimization
- Result: Foundation for signal-based thinking
- Connection: Learned how data systems work at massive scale

**The Pattern:** Every role I automate myself out of a job — that's the point. Each case study connects to the next, building a network of systems thinking.

**Related Topics:** Framework → Philosophy → Tools → Vision`
        },

        // About Leon - Expanded Network
        about: {
            keywords: ['about', 'leon', 'who', 'yourself', 'background', 'bio', 'you', 'leon basin'],
            response: `**About Leon Basin — The Network**

**The Short Version:**
Revenue Architect. 15+ years GTM. I build systems that replace $770K in headcount costs with $150K in architecture ($424K saved).

**Career Network — How Each Role Connected:**

**🔍 Google (2014-2015)**
Operations Specialist, Google Shopping
- Learned: Data-driven decision making at scale
- Connection: Foundation for signal-based thinking

**🛡️ NetApp (2013-2014)**
Led 3-person security team, 16 buildings, zero incidents
- Learned: Systems thinking for operations
- Connection: Applied security rigor to revenue systems

**🚀 Sanho/HyperDrive (2015-2019)**
$7M+ crowdfunded across 16 campaigns
- Learned: Community-driven growth, product-market fit
- Connection: Built audience-first GTM before it was cool

**📊 SurveyMonkey (2019-2021)**
$300M portfolio, 700+ accounts
- Learned: Enterprise sales at scale, portfolio management
- Connection: Proved I could manage massive pipeline

**📈 Sense (2022-2023)**
$10M pipeline, 8%→18% reply rates, $250K closed personally
- Learned: How to diagnose and fix broken GTM systems
- Connection: Built first "Outreach Autopsy" tool

**🔐 Series A Cybersecurity (2024-2025)**
160% pipeline growth, Americas GTM from scratch
- Learned: How to build GTM motion from zero
- Connection: Proved signal architecture works at scale

**⚡ Basin::Nexus (2023-Present)**
83K+ lines, 5 LLMs, significant pipeline generated
- Learned: How to code my own GTM stack
- Connection: The system that proves the thesis

**Education Network:**
- **MBA, Santa Clara University** — GTM Strategy & Technology
  - Connection: Strategic thinking meets execution
- **BS Psychology** — Buyer Psychology & Neuro-Marketing
  - Connection: Understanding human behavior in sales

**My Thesis:**
What if we treated GTM like a distributed system? Input signals, processing logic, output actions. No manual research. No spray-and-pray. Just signal → system → scale.

**What I Built:**
BASIN::NEXUS — 83K+ lines of code. React app + Python backend + 5 LLMs. Monitors 50k+ signals/day, runs job search, generates executive briefs. Proof that 1 engineer > 10 SDRs.

**The Vibe:**
- Mountain View, CA
- JetBrains Mono on everything
- Author: "Unlock the Power of Storytelling" (Amazon 2024)
- 1,884+ LinkedIn newsletter subscribers

**Connected Topics:** Philosophy → Framework → Case Studies → Tools → Vision

"Sales is just debugging human behavior." ⚡`
        },

        // $424K Savings / Replacement
        replacement: {
            keywords: ['424k', '424,000', '800k', '800,000', 'replace', 'headcount', 'cost', 'savings', 'roi', '$424k'],
            response: `**The $424K Savings Thesis**

**The Math:**
- Average SDR: $80K salary + $20K benefits + $10K tools = $110K/year
- Average SDR output: 50 calls/day, 2% meeting rate, 3 SQLs/month
- 7 SDRs: $770K/year → maybe 21 SQLs/month

**My Architecture:**
- 1 Revenue Architect: $150K/year
- Signal Engine: $0/month (self-hosted, local LLMs)
- Output: 50k+ signals/day monitored, 15-22% reply rates, 8-12% SQL conversion

**The Result:**
$770K in headcount costs → $150K in architecture = **$424K annual savings**
Same or better output. Zero burnout. 24/7 operation.

**Try the math yourself:**
Use my ROI Calculator at /tools/roi-calculator.html — plug in your numbers and see the savings.

**Proof:**
- Fudo: +160% pipeline with no new hires
- Sense: 5-person team → 105% quota, $10M pipeline
- Ambient model: $424K annual savings calculated
- Basin::Nexus: Running my job search while I sleep`
        },

        // Interactive Tools - Network
        tools_interactive: {
            keywords: ['calculator', 'roi', 'headline', 'case study', 'generator', 'interactive', 'try', 'demo', 'use', 'tools', 'what tools', 'built'],
            response: `**Tools Network — What I Built**

**💰 ROI Calculator** (/tools/roi-calculator.html)
Calculate your savings from Revenue Architecture vs traditional SDR model. Input your team size, costs, and see the $424K math in action.
- Connection: Proves the $424K savings thesis with your numbers
- Use Case: Business case for automation

**📋 Case Study Generator** (/tools/case-study-generator.html)
Generate GTM deployment strategies instantly. 4 templates:
- Signal Architecture
- Bifurcated Model
- SDR Transformation
- Partner Activation
- Connection: Turns frameworks into actionable plans

**💼 Headline Generator** (/tools/headline-generator.html)
Create LinkedIn headlines that get noticed. 6 styles:
- Results-Driven (metrics-focused)
- Authority (expert positioning)
- Value Prop (what you deliver)
- Builder (systems & scale)
- Storyteller (narrative hook)
- Contrarian (stand out bold)
- Connection: Personal brand optimization

**🎯 Job Pipeline Tracker** (/tools/job-pipeline-tracker.html)
Track your job search like a revenue pipeline. Stage-based CRM for career opportunities.
- Connection: Applied GTM thinking to career search
- Use Case: Manage multiple opportunities systematically

**📊 GTM Execution Dashboard** (/tools/gtm-execution-dashboard.html)
Interactive dashboard visualizing real-world GTM execution: pipeline growth, SDR program build-out, deals advanced.
- Connection: Shows the system in action
- Use Case: Proof of execution, not just theory

**🚀 Automation Dashboard** (/tools/automation-dashboard.html)
Control center for automated workflows: daily protocol, system integration, revenue automation.
- Connection: The orchestration layer of the Signal Engine
- Use Case: See how automation replaces manual work

**All free. No API costs. No sign-up required. 100% private.**

Try them at basinleon.github.io/tools/

**Related Topics:** Framework → Philosophy → Case Studies → Vision`
        },

        // Metrics & Lines of Code
        metrics: {
            keywords: ['lines', 'code', 'hours', 'metric', '83k', '83000', 'stats', 'numbers'],
            response: `**By The Numbers**

**Code Stats:**
- 83,000+ lines deployed across all projects
- BASIN::NEXUS React app: 8,400+ lines
- Python signal engine: 20,000+ lines
- This portfolio: 4,000+ lines HTML/CSS/JS

**Career Impact:**
- $310M+ portfolio managed (SurveyMonkey)
- $23M+ career pipeline generated
- $7M+ crowdfunded (Sanho/HyperDrive)
- $10M+ pipeline at Sense
- 160% YoY pipeline growth (Fudo)
- $424K projected annual savings model

**Efficiency Gains:**
- -92% manual toil
- -70% headcount reduction possible
- 5-day SDR ramp (vs 3-month industry avg)
- 8%→18% reply rate improvement (Sense)

**The System Never Sleeps:** 50k+ signals/day monitored, 24/7 operation.`
        },

        // Default/Fallback — now context-aware with network navigation
        default: {
            keywords: [''],
            response: `**How Can I Help? — Navigate the Network**

I'm the intelligence layer of BASIN::NEXUS — here to show you how Leon thinks about GTM, systems, and revenue architecture. Everything is connected.

**Core Topics (Click to Explore):**
- 🧠 **Philosophy:** "What's your approach to GTM?"
- 🔧 **Framework:** "Explain Signal-System-Scale"
- 📊 **KPIs:** "What metrics matter?"
- 🔮 **Vision:** "What do you want to build?"
- 🛠️ **Tools:** "What's in your $0 stack?"
- 💼 **Case Studies:** "Tell me about your projects"
- 💰 **The $424K Question:** "How do you replace headcount with architecture?"
- 👤 **About Leon:** "Tell me about your background"
- 🎯 **Interviews:** "How do you approach interviews?"
- 🔗 **Connections:** "How do these concepts connect?"

**Network Navigation:**
Every topic connects to others. Ask "How does philosophy connect to case studies?" or "What's the relationship between tools and framework?"

**Archive Search:**
Ask "What did you write about [topic]?" to search 160+ blog posts.

Or ask me anything about the Signal Engine powering this site. ⚡`
        },

        // Network Connections - New Topic
        connections: {
            keywords: ['connect', 'relationship', 'network', 'how does', 'related', 'link', 'tie', 'connection'],
            response: `**The Knowledge Network — How Everything Connects**

**Philosophy → Framework → Execution:**
My philosophy (signal-based thinking) → Framework (Signal-System-Scale) → Execution (Case Studies)

**Case Studies → Tools → Vision:**
What I built (Case Studies) → How I built it (Tools) → Where I'm going (Vision)

**Education → Career → Systems:**
Psychology degree → Understanding buyers → Signal detection
MBA → Strategic thinking → System architecture
Google/NetApp → Operations rigor → Revenue systems

**The $424K Thread:**
- Philosophy: Replace headcount with architecture
- Framework: Signal Engine replaces manual research
- Case Studies: Proved it at Series A cybersecurity company
- Tools: Built calculators to show the math
- Vision: Build this at scale for more companies

**Signal Engine Network:**
- Input: 50k+ signals/day (LinkedIn, Crunchbase, RSS, APIs)
- Processing: 5 LLMs orchestrate scoring and routing
- Output: Executive briefs, emails, CRM updates, pipeline

**Everything connects. Ask "How does [topic A] relate to [topic B]?" to explore the network. ⚡`
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // BLOG POSTS INTEGRATION — Search & Recommend
    // ═══════════════════════════════════════════════════════════════

    let blogPosts = [];

    // Load blog posts on init
    async function loadBlogPosts() {
        try {
            const response = await fetch('https://basinleon.github.io/data/posts.json');
            if (response.ok) {
                const data = await response.json();
                blogPosts = data.filter(p => p.url && p.url !== '#');
                console.log(`📚 NEXUS: Loaded ${blogPosts.length} blog posts for search`);
            }
        } catch (e) {
            console.warn('Could not load blog posts for NEXUS search');
        }
    }

    // Search blog posts by query
    function searchBlogPosts(query, limit = 3) {
        if (!blogPosts.length) return [];

        const terms = query.toLowerCase().split(/\s+/);

        const scored = blogPosts.map(post => {
            let score = 0;
            const title = (post.title || '').toLowerCase();
            const tags = (post.tags || []).map(t => t.toLowerCase());
            const excerpt = (post.excerpt || '').toLowerCase();

            for (const term of terms) {
                if (term.length < 3) continue;
                if (title.includes(term)) score += 10;
                if (tags.some(t => t.includes(term))) score += 8;
                if (excerpt.includes(term)) score += 3;
            }
            return { post, score };
        });

        return scored
            .filter(s => s.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map(s => s.post);
    }

    // Format blog recommendations for chat
    function formatBlogRecommendations(posts) {
        if (!posts.length) return '';

        let html = '\n\n**📚 From the Archive:**\n';
        posts.forEach(p => {
            const tag = (p.tags && p.tags[0]) ? `[${p.tags[0]}]` : '';
            html += `- [${p.title}](https://basinleon.github.io/blog/${p.url}) ${tag}\n`;
        });
        return html;
    }

    // Topic to blog post mapping for direct recommendations
    const TOPIC_POST_MAP = {
        'revenue': ['architecture-of-revenue', 'revenue-is-not-math', 'expansion-revenue-engine'],
        'gtm': ['0-gtm-stack', 'gtm-mission', 'interview-as-architecture'],
        'signal': ['signal-engine', 'the-artifact'],
        'architecture': ['architecture-of-revenue', 'architecture-of-belief', 'architecture-language'],
        'ai': ['ai-cybersecurity-sword', 'labyrinth-of-the-mind', 'fractal-intelligence'],
        'automation': ['how-to-automate-e2e-outreach', '0-gtm-stack', 'signal-engine'],
        'interview': ['interview-as-architecture', 'system-finds-the-role'],
        'case study': ['video-security-signal-architecture', 'the-artifact'],
        'cybersecurity': ['ai-cybersecurity-leadership', 'tprm-best-practices', 'future-cybersecurity'],
        'creative': ['keepers-of-dreams', 'labyrinth-of-the-mind', 'stories-in-code']
    };

    // ═══════════════════════════════════════════════════════════════
    // INTELLIGENT MATCHING — Fuzzy + Context-Aware + Blog Search
    // ═══════════════════════════════════════════════════════════════

    function findBestMatch(userInput) {
        const input = userInput.toLowerCase();
        let bestMatch = null;
        let bestScore = 0;

        // Check if user is explicitly searching for blog posts
        const isSearchQuery = input.includes('wrote') || input.includes('blog') ||
            input.includes('post') || input.includes('article') ||
            input.includes('read') || input.includes('archive');

        // Check each category for keyword matches
        for (const [category, data] of Object.entries(KNOWLEDGE_BASE)) {
            if (category === 'default') continue;

            let score = 0;
            for (const keyword of data.keywords) {
                if (input.includes(keyword)) {
                    // Longer keyword matches score higher
                    score += keyword.length;
                }
            }

            if (score > bestScore) {
                bestScore = score;
                bestMatch = data.response;
            }
        }

        // If we have conversation context, check for follow-up patterns
        if (!bestMatch && conversationHistory.length > 0) {
            const lastExchange = conversationHistory[conversationHistory.length - 1];
            if (input.includes('example') || input.includes('more') || input.includes('elaborate')) {
                // They want more on the last topic
                return `**Building on that...**\n\nI can dive deeper — what specific aspect interests you? For instance:\n- A real-world case study?\n- The technical implementation?\n- The metrics and results?`;
            }
        }

        // Search blog posts and add recommendations
        let response = bestMatch || KNOWLEDGE_BASE.default.response;

        if (isSearchQuery || bestScore > 0) {
            const relevantPosts = searchBlogPosts(input);
            if (relevantPosts.length > 0) {
                response += formatBlogRecommendations(relevantPosts);
            }
        }

        return response;
    }

    // ═══════════════════════════════════════════════════════════════
    // SIGNAL ENGINE INTEGRATION
    // ═══════════════════════════════════════════════════════════════

    async function getSignalStats() {
        try {
            const response = await fetch('https://basinleon.github.io/data/nexus-status.json', { cache: 'no-store' });
            if (!response.ok) throw new Error('Fetch failed');
            return await response.json();
        } catch (e) {
            return { signalsScanned: 52, matchScore: 88, pipelineActive: 4, status: 'ONLINE' };
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // UI RENDERING
    // ═══════════════════════════════════════════════════════════════

    const STYLES = `
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500&family=Orbitron:wght@500;700&display=swap');

        #leon-logic-bot {
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 9998;
            font-family: 'JetBrains Mono', monospace;
        }

        #bot-toggle {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: linear-gradient(135deg, #D4AF37 0%, #b8860b 100%);
            border: 2px solid rgba(255,255,255,0.2);
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(212, 175, 55, 0.4), 0 0 40px rgba(212, 175, 55, 0.15);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
            transition: all 0.3s ease;
            animation: pulse-glow 3s infinite;
        }

        @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 4px 20px rgba(212, 175, 55, 0.4), 0 0 40px rgba(212, 175, 55, 0.15); }
            50% { box-shadow: 0 4px 25px rgba(212, 175, 55, 0.6), 0 0 60px rgba(212, 175, 55, 0.25); }
        }

        #bot-toggle:hover {
            transform: scale(1.08);
        }

        #bot-window {
            position: absolute;
            bottom: 70px;
            right: 0;
            width: 400px;
            max-height: 550px;
            background: rgba(8, 8, 12, 0.98);
            border: 1px solid rgba(212, 175, 55, 0.25);
            border-radius: 16px;
            box-shadow: 0 12px 48px rgba(0, 0, 0, 0.7), 0 0 1px rgba(212, 175, 55, 0.5);
            display: none;
            flex-direction: column;
            overflow: hidden;
            backdrop-filter: blur(20px);
        }

        #bot-window.open {
            display: flex;
            animation: slideUp 0.25s ease-out;
        }

        @keyframes slideUp {
            from { opacity: 0; transform: translateY(16px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }

        #bot-header {
            padding: 14px 16px;
            background: linear-gradient(180deg, rgba(212, 175, 55, 0.12) 0%, rgba(212, 175, 55, 0.04) 100%);
            border-bottom: 1px solid rgba(212, 175, 55, 0.2);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        #bot-header-left {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        #bot-header-icon {
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, #D4AF37 0%, #b8860b 100%);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
        }

        #bot-header h3 {
            margin: 0;
            font-size: 11px;
            color: #D4AF37;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            font-family: 'Orbitron', sans-serif;
            font-weight: 500;
        }

        #bot-status {
            font-size: 9px;
            color: rgba(255,255,255,0.5);
            display: flex;
            align-items: center;
            gap: 4px;
        }

        #bot-status .dot {
            width: 6px;
            height: 6px;
            background: #22c55e;
            border-radius: 50%;
            animation: status-pulse 2s infinite;
        }

        @keyframes status-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        #bot-close {
            background: none;
            border: none;
            color: rgba(255,255,255,0.4);
            font-size: 18px;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            transition: all 0.2s;
        }

        #bot-close:hover {
            color: #D4AF37;
            background: rgba(212, 175, 55, 0.1);
        }

        #bot-messages {
            flex: 1;
            overflow-y: auto;
            padding: 14px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-height: 350px;
        }

        #bot-messages::-webkit-scrollbar {
            width: 4px;
        }

        #bot-messages::-webkit-scrollbar-track {
            background: transparent;
        }

        #bot-messages::-webkit-scrollbar-thumb {
            background: rgba(212, 175, 55, 0.3);
            border-radius: 2px;
        }

        .bot-message {
            padding: 10px 14px;
            border-radius: 12px;
            font-size: 12px;
            line-height: 1.65;
            word-wrap: break-word;
            animation: messageIn 0.2s ease-out;
        }

        @keyframes messageIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .bot-message.user {
            align-self: flex-end;
            background: linear-gradient(135deg, #D4AF37 0%, #b8860b 100%);
            color: #000;
            max-width: 85%;
            font-weight: 500;
        }

        .bot-message.assistant {
            align-self: flex-start;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(212, 175, 55, 0.15);
            color: rgba(255, 255, 255, 0.9);
            max-width: 95%;
        }

        .bot-message.assistant strong {
            color: #D4AF37;
            display: block;
            margin-bottom: 6px;
            font-weight: 600;
        }

        .bot-message.system {
            align-self: center;
            background: transparent;
            color: rgba(255,255,255,0.35);
            font-size: 10px;
            max-width: 100%;
            text-align: center;
            padding: 4px;
        }

        .bot-message.typing {
            align-self: flex-start;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(212, 175, 55, 0.15);
            color: #D4AF37;
            padding: 12px 18px;
        }

        .typing-dots {
            display: flex;
            gap: 4px;
        }

        .typing-dots span {
            width: 6px;
            height: 6px;
            background: #D4AF37;
            border-radius: 50%;
            animation: typingBounce 1.4s infinite;
        }

        .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
        .typing-dots span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typingBounce {
            0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
            30% { transform: translateY(-6px); opacity: 1; }
        }

        #bot-input-area {
            padding: 12px;
            border-top: 1px solid rgba(212, 175, 55, 0.15);
            background: rgba(212, 175, 55, 0.03);
        }

        #bot-input {
            width: 100%;
            padding: 10px 12px;
            background: rgba(0,0,0,0.4);
            border: 1px solid rgba(212, 175, 55, 0.2);
            border-radius: 8px;
            color: rgba(255,255,255,0.9);
            font-family: inherit;
            font-size: 12px;
            resize: none;
            outline: none;
            transition: border-color 0.2s;
        }

        #bot-input:focus {
            border-color: rgba(212, 175, 55, 0.5);
        }

        #bot-input::placeholder {
            color: rgba(255,255,255,0.3);
        }

        .quick-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-top: 10px;
        }

        .quick-action {
            padding: 5px 10px;
            background: rgba(212, 175, 55, 0.08);
            border: 1px solid rgba(212, 175, 55, 0.2);
            border-radius: 16px;
            color: rgba(212, 175, 55, 0.9);
            font-size: 10px;
            cursor: pointer;
            transition: all 0.2s ease;
            font-family: inherit;
        }

        .quick-action:hover {
            background: rgba(212, 175, 55, 0.15);
            border-color: rgba(212, 175, 55, 0.4);
            transform: translateY(-1px);
        }

        @media (max-width: 480px) {
            #bot-window {
                width: calc(100vw - 32px);
                max-height: calc(100vh - 120px);
                bottom: 70px;
                right: -8px;
            }
        }

        /* ============================================= */
        /* Light Theme Overrides                         */
        /* ============================================= */
        body.light-theme #bot-window {
            background: rgba(245, 243, 239, 0.99) !important;
            border-color: #d4af37 !important;
            box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15), 0 0 1px rgba(212, 175, 55, 0.5);
        }

        body.light-theme #bot-header {
            background: linear-gradient(180deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 100%) !important;
            border-bottom-color: #d4af37 !important;
        }

        body.light-theme #bot-header h3 {
            color: #8b6914 !important;
        }

        body.light-theme #bot-status {
            color: #666 !important;
        }

        body.light-theme #bot-close {
            color: #888 !important;
        }

        body.light-theme #bot-close:hover {
            color: #8b6914 !important;
            background: rgba(212, 175, 55, 0.15) !important;
        }

        body.light-theme #bot-messages {
            background: #fff !important;
        }

        body.light-theme .bot-message.assistant {
            background: rgba(245, 243, 239, 0.9) !important;
            border-color: #d4af37 !important;
            color: #333 !important;
        }

        body.light-theme .bot-message.assistant strong {
            color: #8b6914 !important;
        }

        body.light-theme .bot-message.system {
            color: #888 !important;
        }

        body.light-theme .bot-message.typing {
            background: rgba(245, 243, 239, 0.9) !important;
            border-color: #d4af37 !important;
            color: #8b6914 !important;
        }

        body.light-theme #bot-input-area {
            background: rgba(245, 243, 239, 0.8) !important;
            border-top-color: #d4af37 !important;
        }

        body.light-theme #bot-input {
            background: #fff !important;
            border-color: #d4af37 !important;
            color: #333 !important;
        }

        body.light-theme #bot-input::placeholder {
            color: #999 !important;
        }

        body.light-theme .quick-action {
            background: rgba(212, 175, 55, 0.1) !important;
            border-color: #d4af37 !important;
            color: #8b6914 !important;
        }

        body.light-theme .quick-action:hover {
            background: rgba(212, 175, 55, 0.2) !important;
        }

        body.light-theme .typing-dots span {
            background: #8b6914 !important;
        }
    `;

    async function init() {
        // Inject styles
        const styleEl = document.createElement('style');
        styleEl.textContent = STYLES;
        document.head.appendChild(styleEl);

        // Get signal stats for welcome message
        const stats = await getSignalStats();

        // Create chatbot HTML
        const container = document.createElement('div');
        container.id = 'leon-logic-bot';
        container.innerHTML = `
            <button id="bot-toggle" aria-label="Open BASIN::NEXUS Intelligence">
                🧠
            </button>
            <div id="bot-window">
                <div id="bot-header">
                    <div id="bot-header-left">
                        <div id="bot-header-icon">⚡</div>
                        <div>
                            <h3>NEXUS Intelligence</h3>
                            <div id="bot-status">
                                <span class="dot"></span>
                                <span>${stats.signalsScanned} signals • ${stats.matchScore}% match</span>
                            </div>
                        </div>
                    </div>
                    <button id="bot-close" aria-label="Close">×</button>
                </div>
                <div id="bot-messages">
                    <div class="bot-message system">
                        Signal Engine Active • v10.0
                    </div>
                    <div class="bot-message assistant">
                        <strong>Welcome to BASIN::NEXUS Intelligence</strong>
                        <br><br>
                        I'm the thinking layer of the Signal Engine — Leon's GTM philosophy, frameworks, and decision logic, codified into a knowledge network.
                        <br><br>
                        <strong>About Leon Basin:</strong>
                        <br>• Revenue Architect. 15+ years GTM leadership
                        <br>• Built systems that replace $770K in headcount with $150K in architecture ($424K saved)
                        <br>• BASIN::NEXUS: 83K+ lines, 5 LLMs, significant pipeline generated
                        <br><br>
                        <strong>Career Network:</strong>
                        <br>• Google → NetApp → Sanho/HyperDrive → SurveyMonkey → Sense → Series A Cybersecurity → BASIN::Nexus
                        <br>• Each role built on the last, creating a network of systems thinking
                        <br><br>
                        <strong>Education:</strong>
                        <br>• MBA, Santa Clara University (GTM Strategy & Technology)
                        <br>• BS Psychology (Buyer Psychology & Neuro-Marketing)
                        <br><br>
                        <strong>My Thesis:</strong>
                        <br>What if we treated GTM like a distributed system? Input signals, processing logic, output actions. No manual research. No spray-and-pray. Just signal → system → scale.
                        <br><br>
                        <strong>What I Built:</strong>
                        <br>BASIN::NEXUS — 83K+ lines of code. React app + Python backend + 5 LLMs. Monitors 50k+ signals/day, runs job search, generates executive briefs. Proof that 1 engineer > 10 SDRs.
                        <br><br>
                        <strong>The Vibe:</strong>
                        <br>• Mountain View, CA
                        <br>• JetBrains Mono on everything
                        <br>• Author: "Unlock the Power of Storytelling" (Amazon 2024)
                        <br>• 1,884+ LinkedIn newsletter subscribers
                        <br><br>
                        "Sales is just debugging human behavior." ⚡
                        <br><br>
                        <strong>📚 From the Archive (Connected Posts):</strong>
                        <br>• The Architect vs. The Applicant: 5 Power Plays [Career Strategy]
                        <br>• Stop Selling, Start Architecting: The Rise of the GTM Engineer [GTM Engineering]
                        <br>• 5 Counter-Intuitive Career Lessons [Career Strategy]
                        <br>• Stop Running a Pipeline, Start Building an Engine [GTM Strategy]
                        <br>• Decoding the GTM Engine: A Beginner's Guide [GTM Strategy]
                        <br><br>
                        <em>Ask "What did you write about [topic]?" to search 160+ posts</em>
                    </div>
                </div>
                <div id="bot-input-area">
                    <textarea id="bot-input" placeholder="Ask about philosophy, frameworks, KPIs..." rows="1"></textarea>
                    <div class="quick-actions">
                        <span class="quick-action" data-q="What's your GTM philosophy?">Philosophy</span>
                        <span class="quick-action" data-q="Explain Signal-System-Scale">Framework</span>
                        <span class="quick-action" data-q="How do you replace $424K in headcount costs?">$424K Savings</span>
                        <span class="quick-action" data-q="Show me your KPIs and metrics">KPIs</span>
                        <span class="quick-action" data-q="Tell me about your case studies">Case Studies</span>
                        <span class="quick-action" data-q="About Leon Basin">About Leon</span>
                        <span class="quick-action" data-q="What did you write about AI?">📚 Search Archive</span>
                        <span class="quick-action" data-q="What tools did you build?">Tools</span>
                        <span class="quick-action" data-q="What's your vision for GTM?">Vision</span>
                        <span class="quick-action" data-q="How do you approach interviews?">Interviews</span>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(container);

        // Event listeners
        document.getElementById('bot-toggle').addEventListener('click', toggleBot);
        document.getElementById('bot-close').addEventListener('click', toggleBot);
        document.getElementById('bot-input').addEventListener('keydown', handleInput);

        // Auto-resize textarea
        document.getElementById('bot-input').addEventListener('input', function () {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 80) + 'px';
        });

        // Quick actions
        document.querySelectorAll('.quick-action').forEach(btn => {
            btn.addEventListener('click', () => {
                const question = btn.dataset.q;
                document.getElementById('bot-input').value = question;
                handleInput({ key: 'Enter', target: document.getElementById('bot-input') });
            });
        });

        // Load blog posts for search
        loadBlogPosts();

        console.log('[NEXUS Intelligence] Widget initialized with blog search');
    }

    function toggleBot() {
        const botWindow = document.getElementById('bot-window');
        botWindow.classList.toggle('open');

        if (botWindow.classList.contains('open')) {
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
            e.target.style.height = 'auto';

            // Add user message
            addMessage(input, 'user');

            // Store in conversation history
            conversationHistory.push({ role: 'user', content: input });

            // Show typing indicator
            showTyping();

            // Get response with delay
            setTimeout(() => {
                hideTyping();
                const response = findBestMatch(input);
                addMessage(response, 'assistant');
                conversationHistory.push({ role: 'assistant', content: response });

                // Keep history manageable
                if (conversationHistory.length > CONFIG.maxContextMessages) {
                    conversationHistory = conversationHistory.slice(-CONFIG.maxContextMessages);
                }
            }, CONFIG.typingDelay);
        }
    }

    function showTyping() {
        const messagesContainer = document.getElementById('bot-messages');
        const typingEl = document.createElement('div');
        typingEl.className = 'bot-message typing';
        typingEl.id = 'typing-indicator';
        typingEl.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
        messagesContainer.appendChild(typingEl);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function hideTyping() {
        const typingEl = document.getElementById('typing-indicator');
        if (typingEl) typingEl.remove();
    }

    function addMessage(text, type) {
        const messagesContainer = document.getElementById('bot-messages');
        const messageEl = document.createElement('div');
        messageEl.className = `bot-message ${type}`;

        if (type === 'assistant') {
            // Parse markdown-style bold, line breaks, and links
            let html = text
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color: #D4AF37;">$1</a>')
                .replace(/\n\n/g, '<br><br>')
                .replace(/\n- /g, '<br>• ')
                .replace(/\n(\d+)\. /g, '<br>$1. ');
            messageEl.innerHTML = html;
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
