import React, { useState } from 'react';
import { ChevronRight, Target, Building2, Users, AlertTriangle, Zap, MessageSquare, DollarSign, Shield, Clock } from 'lucide-react';

const sections = [
  { id: 'brief', label: 'BRIEF', icon: Target },
  { id: 'company', label: 'KETCH', icon: Building2 },
  { id: 'role', label: 'ROLE', icon: Users },
  { id: 'bridge', label: 'BRIDGE', icon: Shield },
  { id: 'questions', label: 'THEIR Qs', icon: AlertTriangle },
  { id: 'yours', label: 'YOUR Qs', icon: MessageSquare },
  { id: 'comp', label: 'COMP', icon: DollarSign },
  { id: 'checklist', label: 'PRE-CALL', icon: Clock },
];

export default function KetchHUD() {
  const [active, setActive] = useState('brief');

  const content = {
    brief: (
      <div className="space-y-5">
        <div className="bg-amber-400/10 border border-amber-400/30 rounded-lg p-4">
          <h3 className="text-amber-400 text-xs tracking-widest mb-2">TODAY — MONDAY</h3>
          <p className="text-white text-sm font-medium">11:00 AM PDT / 1:00 PM CDT</p>
          <p className="text-zinc-300 text-sm">Samantha Harvey Fleeman — Recruiting Consultant, LinkedIn Talent Solutions</p>
          <p className="text-zinc-300 text-sm">Format: Microsoft Teams</p>
          <p className="text-zinc-500 text-xs mt-2">This is a recruiter screen, not the hiring manager. Goal: advance to the next round.</p>
        </div>
        <div className="border-l-2 border-emerald-400 pl-4">
          <h3 className="text-emerald-400 text-xs tracking-widest mb-2">YOUR FRAME</h3>
          <p className="text-zinc-300 text-sm leading-relaxed">
            You are a 10-year GTM Architect who has built channel and partnership programs from zero at Fudo Security, scaled global outbound systems at Sense, and now runs fractional consulting building signal engines and partner enablement for B2B SaaS. Your last partnership role title was literally "Americas Channel & Strategic Alliances." Ketch is hiring a "Partnership Alliance Lead." The title overlap is almost 1:1.
          </p>
        </div>
        <div className="border-l-2 border-rose-400 pl-4">
          <h3 className="text-rose-400 text-xs tracking-widest mb-2">THE ONE THING</h3>
          <p className="text-zinc-300 text-sm leading-relaxed">
            Ketch launched their Partner Program in November 2024. It is early-stage. They need someone who has built a partner program from zero, not managed an existing one. That is your entire career arc. Say it clearly: "I have built this exact thing before, from scratch, in cybersecurity. The partner motion for privacy software is nearly identical."
          </p>
        </div>
        <div className="border-l-2 border-zinc-600 pl-4">
          <h3 className="text-zinc-400 text-xs tracking-widest mb-2">RESUME THEY HAVE</h3>
          <p className="text-zinc-400 text-sm">Leon Basin - Partnerships & GTM Architecture.pdf (sent Wed night, 285 KB)</p>
          <p className="text-zinc-500 text-xs mt-1">Samantha said she'd review before the call. Expect questions directly from your resume.</p>
        </div>
      </div>
    ),
    company: (
      <div className="space-y-5">
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Founded', value: '2020' },
            { label: 'HQ', value: 'San Francisco' },
            { label: 'Raised', value: '$43M (A/A1)' },
            { label: 'Headcount', value: '~91' },
            { label: 'CEO', value: 'Tom Chavez' },
            { label: 'Sales Growth', value: '+78% YoY' },
          ].map(item => (
            <div key={item.label} className="bg-zinc-800/50 rounded p-2.5">
              <p className="text-zinc-500 text-xs">{item.label}</p>
              <p className="text-white text-sm font-medium">{item.value}</p>
            </div>
          ))}
        </div>
        <div className="border-l-2 border-cyan-400 pl-4">
          <h3 className="text-cyan-400 text-xs tracking-widest mb-2">WHAT KETCH DOES</h3>
          <p className="text-zinc-300 text-sm leading-relaxed">
            Data Permissioning Platform. Helps brands collect, control, and activate privacy-safe data. Products: consent management, DSR automation, data mapping, AI governance, and the new "Data Sentry" (privacy pentest for websites). Competes with OneTrust, BigID, TrustArc. Differentiator: identity-first architecture with real-time enforcement across systems.
          </p>
        </div>
        <div className="border-l-2 border-cyan-400 pl-4">
          <h3 className="text-cyan-400 text-xs tracking-widest mb-2">CEO: TOM CHAVEZ</h3>
          <p className="text-zinc-300 text-sm leading-relaxed">
            Serial founder. Built Krux (acquired by Salesforce for $1B+). Runs super&#123;set&#125; startup studio. 11+ companies founded. 17.5x return for investors. Harvard. Builder, not a suit.
          </p>
        </div>
        <div className="border-l-2 border-cyan-400 pl-4">
          <h3 className="text-cyan-400 text-xs tracking-widest mb-2">PARTNER PROGRAM (EARLY STAGE)</h3>
          <p className="text-zinc-300 text-sm leading-relaxed">
            Launched Nov 2024. Named partners: Bounteous x Accolite, Myna, SafeGuard Privacy, Americaneagle.com, PML. Three types: referral, reseller, integration. The program page exists (ketch.com/partnerships) but this is still being built. That is why they are hiring.
          </p>
        </div>
        <div className="border-l-2 border-cyan-400 pl-4">
          <h3 className="text-cyan-400 text-xs tracking-widest mb-2">TAILWIND: 2026 PRIVACY REGULATION</h3>
          <p className="text-zinc-300 text-sm leading-relaxed">
            Indiana, Kentucky, Rhode Island laws took effect Jan 1. Amendments in CT, OR, TX, VA. No federal law coming. Every new state regulation = sales trigger for Ketch and its partners. Plaintiffs' attorneys sending hundreds of demand letters monthly. Compliance is not optional.
          </p>
        </div>
      </div>
    ),
    role: (
      <div className="space-y-5">
        <div className="border-l-2 border-violet-400 pl-4">
          <h3 className="text-violet-400 text-xs tracking-widest mb-2">JD SUMMARY</h3>
          <p className="text-zinc-300 text-sm leading-relaxed">
            "Partnership Alliance Lead." Activate dormant partners, recruit new ones, support co-sell motions. "Highly execution-focused." Reports into CMO-led strategy. Listed as 2-4 years experience but comp ($100K-$145K + equity) signals they want more than junior.
          </p>
        </div>
        <div className="border-l-2 border-violet-400 pl-4">
          <h3 className="text-violet-400 text-xs tracking-widest mb-2">YOUR RESUME → THEIR JD</h3>
          <div className="space-y-2 mt-2">
            {[
              { jd: 'Activate dormant partners', you: 'Tru Technical: dormant → $50K pipeline in 7 days' },
              { jd: 'Recruit new partners', you: 'Built Americas Channel from zero at Fudo. Recruited Evotek, Avantic, Tru.' },
              { jd: 'Support co-sell motions', you: 'Evotek: recovered stalled $30K deal via parallel-path co-sell' },
              { jd: 'Partner enablement', you: '"Partner-in-a-Box" toolkits. SDR ramp 90→5 days at Sense.' },
              { jd: 'Outbound partner recruitment', you: 'Built Signal Engine for automated lead identification' },
              { jd: 'Cross-functional with Sales', you: 'Integrated intent signals into CRM, +125% co-sell response rate' },
            ].map((item, i) => (
              <div key={i} className="bg-zinc-800/50 rounded p-3 flex gap-3">
                <div className="flex-1">
                  <p className="text-zinc-500 text-xs">THEY NEED</p>
                  <p className="text-zinc-300 text-sm">{item.jd}</p>
                </div>
                <div className="flex-1">
                  <p className="text-amber-400 text-xs">YOU HAVE</p>
                  <p className="text-zinc-300 text-sm">{item.you}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="border-l-2 border-violet-400 pl-4">
          <h3 className="text-violet-400 text-xs tracking-widest mb-2">PARTNER TYPES AT KETCH</h3>
          <div className="space-y-1.5 mt-2">
            <div className="bg-zinc-800/50 rounded p-2.5">
              <p className="text-white text-sm font-medium">Consultancies / Agencies</p>
              <p className="text-zinc-400 text-xs">Privacy consulting firms, digital agencies. They recommend Ketch during privacy audits.</p>
            </div>
            <div className="bg-zinc-800/50 rounded p-2.5">
              <p className="text-white text-sm font-medium">Resellers / SIs</p>
              <p className="text-zinc-400 text-xs">Bundle Ketch with implementation services. SafeGuard Privacy model.</p>
            </div>
            <div className="bg-zinc-800/50 rounded p-2.5">
              <p className="text-white text-sm font-medium">Technology / Integration</p>
              <p className="text-zinc-400 text-xs">MarTech/AdTech that integrate with Ketch. Snowflake, Braze, Salesforce. 1000+ connectors.</p>
            </div>
          </div>
        </div>
      </div>
    ),
    bridge: (
      <div className="space-y-5">
        <div className="bg-orange-400/10 border border-orange-400/30 rounded-lg p-4">
          <h3 className="text-orange-400 text-xs tracking-widest mb-2">THE BRIDGE STATEMENT (say this early)</h3>
          <p className="text-zinc-200 text-sm leading-relaxed italic">
            "At Fudo Security, I was hired to build the Americas Channel and Strategic Alliances program from scratch. There was no existing US partner ecosystem, no playbooks, no partner pipeline. I adapted the EMEA model, recruited MSPs, resellers, and strategic alliances, built the co-sell motions, and generated pipeline within the first weeks. Ketch's partner program looks like it is at a similar stage, and that is exactly the environment where I deliver the most value."
          </p>
        </div>
        <div className="border-l-2 border-orange-400 pl-4">
          <h3 className="text-orange-400 text-xs tracking-widest mb-2">PROOF POINTS FROM YOUR RESUME</h3>
          <div className="space-y-3 mt-2">
            <div className="bg-zinc-800/50 rounded p-3">
              <p className="text-amber-300 text-xs font-medium">TRU TECHNICAL — DORMANT ACTIVATION</p>
              <p className="text-zinc-400 text-sm">Designed "Founding Partner" framework. Deployed playbooks + PoC tech-doc packs. Net-new $50K joint opportunity within 7 days of launch.</p>
              <p className="text-zinc-600 text-xs mt-1">→ Maps to: "Activate dormant partners" in JD</p>
            </div>
            <div className="bg-zinc-800/50 rounded p-3">
              <p className="text-amber-300 text-xs font-medium">EVOTEK — CO-SELL RECOVERY</p>
              <p className="text-zinc-400 text-sm">$30K enterprise deal (Horizon) stalled. Ran parallel-path co-sell, aligned partner with end-customer champion, co-authored final presentation. Moved from stalled PoC to closing.</p>
              <p className="text-zinc-600 text-xs mt-1">→ Maps to: "Support co-sell motions" in JD</p>
            </div>
            <div className="bg-zinc-800/50 rounded p-3">
              <p className="text-amber-300 text-xs font-medium">AVANTIC — LATAM EXPANSION</p>
              <p className="text-zinc-400 text-sm">End-to-end enablement for Watt's and UTEM. Tiered $22K/$26K pricing architecture. $45K+ in active partner-led pipeline.</p>
              <p className="text-zinc-600 text-xs mt-1">→ Maps to: "Recruit and onboard new partners" in JD</p>
            </div>
            <div className="bg-zinc-800/50 rounded p-3">
              <p className="text-amber-300 text-xs font-medium">SENSE — SCALE SYSTEMS</p>
              <p className="text-zinc-400 text-sm">$10M+ outbound pipeline. SDR onboarding 90→5 days. Intent signals into CRM. 125% co-sell response rate increase.</p>
              <p className="text-zinc-600 text-xs mt-1">→ Maps to: "Cross-functional with Sales teams" in JD</p>
            </div>
          </div>
        </div>
        <div className="border-l-2 border-orange-400 pl-4">
          <h3 className="text-orange-400 text-xs tracking-widest mb-2">FUDO → KETCH TRANSLATION</h3>
          <div className="bg-zinc-800/50 rounded p-3 space-y-1.5">
            <p className="text-zinc-300 text-sm">Fudo = cybersecurity PAM. Ketch = data privacy platform.</p>
            <p className="text-zinc-300 text-sm">Both sell to security/compliance buyers (CISOs, DPOs, GRC teams).</p>
            <p className="text-zinc-300 text-sm">Both require partner enablement to translate technical value.</p>
            <p className="text-zinc-300 text-sm">Both compete against larger incumbents (CyberArk → OneTrust).</p>
            <p className="text-zinc-300 text-sm">The partner motion is nearly identical.</p>
          </div>
        </div>
        <div className="border-l-2 border-orange-400 pl-4">
          <h3 className="text-orange-400 text-xs tracking-widest mb-2">IF ASKED ABOUT "2024-PRESENT" CONSULTING</h3>
          <p className="text-zinc-300 text-sm leading-relaxed">
            "I've been running fractional GTM consulting, building signal engines and partner enablement systems for early-stage B2B companies. It has sharpened my ability to build from zero with limited resources, which is exactly the muscle this role requires." Keep it brief. Don't over-explain.
          </p>
        </div>
      </div>
    ),
    questions: (
      <div className="space-y-4">
        <p className="text-zinc-500 text-xs">Likely questions with scripted answers. Adjust tone to sound natural, not rehearsed.</p>
        {[
          {
            q: "Walk me through your partnership experience.",
            a: "Start with Fudo: 'I was brought in to build the Americas channel from scratch. No existing US partners, no playbooks. I adapted the EMEA model, recruited MSPs and resellers like Evotek and Tru Technical, built co-sell playbooks, and generated pipeline within the first weeks.' Then bridge: 'Before that at Sense, I built global outbound systems that generated $10M+ in pipeline and redesigned partner enablement to cut SDR ramp from 90 days to 5.' Then land: 'Now I'm doing this same build fractionally for early-stage B2B companies.'"
          },
          {
            q: "You have 10 years of experience. This role lists 2-4 years. Why are you interested?",
            a: "I am looking for a company where the partner program is early enough that I can shape it. Ketch launched its program recently and is building from the ground up. That is where I do my best work. I am not looking to manage an existing machine. I want to build one. The comp range reflects the scope and I am comfortable with it."
          },
          {
            q: "Why Ketch?",
            a: "Three things. First, privacy regulation is accelerating state by state with no federal law coming. Every new state law is a sales trigger for Ketch and its partners. That is a massive tailwind. Second, I have been tracking the company. I follow Ketch on LinkedIn and the data permissioning space maps directly to the security compliance world I came from at Fudo. Third, Tom Chavez built Krux and sold it to Salesforce. He builds real companies. I want to be part of that next chapter."
          },
          {
            q: "Tell me about activating a dormant partner.",
            a: "Tru Technical Partners. Dormant MSP in cybersecurity. I designed a 'Founding Partner' framework, deployed customized playbooks and PoC documentation, and we generated a net-new $50K joint opportunity within the first week. The key was removing friction: I handed them a pre-built go-to-market kit so they could sell our product without having to figure it out themselves."
          },
          {
            q: "How do you measure partner success?",
            a: "Pipeline velocity and closed revenue. Not vanity metrics. I track three things: time-to-first-meeting (how fast from signing to a joint call), sourced pipeline, and co-sell win rate. At Sense I integrated intent signals into the CRM and increased partner co-sell response rates by 125%. If a partner is not generating pipeline, the partnership is not real."
          },
          {
            q: "What does your consulting work look like right now?",
            a: "I build signal engines and partner enablement systems for early-stage B2B SaaS companies. It is fractional work that has sharpened my ability to build from zero with limited resources. But I am looking for the right full-time opportunity where I can go deep on a single partner program and scale it. Ketch is that opportunity."
          },
          {
            q: "How do you approach recruiting new partners?",
            a: "I build Signal Engines. I scan the market for companies that have a specific problem our joint solution can solve right now. Then I qualify through a simple logic gate: strategic fit, clear revenue path, and alignment. Partners who commit to generating joint pipeline immediately go to the top. I hand them my pre-built 'Partner-in-a-Box' enablement playbooks, and we focus on getting technical validation meetings booked."
          },
        ].map((item, i) => (
          <div key={i} className="bg-zinc-800/50 rounded-lg p-4">
            <p className="text-white text-sm font-medium mb-2">"{item.q}"</p>
            <p className="text-zinc-400 text-sm leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>
    ),
    yours: (
      <div className="space-y-4">
        <p className="text-zinc-500 text-xs">Ask 2-3 of these. Don't run through all of them. Pick based on conversation flow.</p>
        {[
          {
            q: "Where is the biggest friction in the partner program right now?",
            why: "You told Samantha's AI you'd ask this. It shows you think in terms of removing friction. Listen carefully: the answer tells you what Day 1 looks like."
          },
          {
            q: "How many partners are currently active vs. signed?",
            why: "Reveals the activation gap. If 30 signed and 5 active, your entire job is waking up the dormant 25."
          },
          {
            q: "Who does this role report to?",
            why: "JD says CMO-led strategy. You need to know if you have autonomy or if you are executing a rigid playbook."
          },
          {
            q: "Is the internal sales team already engaged with partners on co-sell, or is that something this role needs to build?",
            why: "Tells you if the sales-partner bridge exists or if you are building it from scratch (your strength)."
          },
          {
            q: "What does success look like at 90 days for this hire?",
            why: "You build 30/60/90 plans. This is your language. Shows you are already thinking about execution."
          },
          {
            q: "What is the interview process from here?",
            why: "Standard recruiter-screen close. Shows interest and lets you plan your week."
          },
        ].map((item, i) => (
          <div key={i} className="bg-zinc-800/50 rounded-lg p-4">
            <p className="text-white text-sm font-medium mb-1">"{item.q}"</p>
            <p className="text-zinc-500 text-xs italic">{item.why}</p>
          </div>
        ))}
      </div>
    ),
    comp: (
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-zinc-800/50 rounded-lg p-3">
            <p className="text-zinc-500 text-xs">Base Range</p>
            <p className="text-white text-lg font-medium">$100K — $145K</p>
          </div>
          <div className="bg-zinc-800/50 rounded-lg p-3">
            <p className="text-zinc-500 text-xs">+ Equity + Benefits</p>
            <p className="text-white text-lg font-medium">Details TBD</p>
          </div>
        </div>
        <div className="border-l-2 border-green-400 pl-4">
          <h3 className="text-green-400 text-xs tracking-widest mb-2">WHAT YOU ALREADY SAID</h3>
          <p className="text-zinc-300 text-sm leading-relaxed">
            You told the AI pre-screen: "Comfortable with the listed base salary range of $100k-$140k, targeting the upper end. Primary focus is on total OTE." This is locked in. If Samantha asks again: "I confirmed my comfort with the range in the pre-screen. Happy to discuss total comp when we're further along."
          </p>
        </div>
        <div className="border-l-2 border-green-400 pl-4">
          <h3 className="text-green-400 text-xs tracking-widest mb-2">HOW THIS FITS YOUR REVENUE MAP</h3>
          <p className="text-zinc-300 text-sm leading-relaxed">
            Ketch at $140K base = W-2 basecamp. Add MTI rev share ($10K-$30K) and TalSmart ($20K-$60K). Year 1 total: $170K-$230K. That is Scenario B: debt clearance and equity building territory.
          </p>
        </div>
        <div className="border-l-2 border-green-400 pl-4">
          <h3 className="text-green-400 text-xs tracking-widest mb-2">EQUITY CONTEXT</h3>
          <p className="text-zinc-300 text-sm leading-relaxed">
            $43M raised at Series A/A1 in 2021. No public raise since. 91 employees. If they are approaching a B round, early equity matters. Don't lead with equity questions in a recruiter screen. Ask about vesting, cliff, and exercise window only if they bring it up.
          </p>
        </div>
      </div>
    ),
    checklist: (
      <div className="space-y-5">
        <div className="border-l-2 border-white pl-4">
          <h3 className="text-white text-xs tracking-widest mb-3">PRE-CALL CHECKLIST</h3>
          <div className="space-y-2.5">
            {[
              'Teams link received and tested',
              'Camera on. Light source in front of you, not behind',
              'This HUD open on second screen or phone',
              'Resume open (same version you sent Samantha)',
              'Water nearby',
              'Quiet room. Notifications off.',
              'LinkedIn open to Ketch company page (in case you need to reference)',
            ].map((item, i) => (
              <label key={i} className="flex items-center gap-3 cursor-pointer group">
                <div className="w-4 h-4 rounded border border-zinc-600 group-hover:border-zinc-400 flex-shrink-0" />
                <p className="text-zinc-300 text-sm group-hover:text-white transition-colors">{item}</p>
              </label>
            ))}
          </div>
        </div>
        <div className="border-l-2 border-amber-400 pl-4">
          <h3 className="text-amber-400 text-xs tracking-widest mb-2">OPENING LINE</h3>
          <p className="text-zinc-300 text-sm leading-relaxed italic">
            "Hi Samantha, great to finally connect live. I really appreciated the thorough pre-screen process. I'm excited to dig into the Ketch partner motion."
          </p>
        </div>
        <div className="border-l-2 border-amber-400 pl-4">
          <h3 className="text-amber-400 text-xs tracking-widest mb-2">CLOSING LINE</h3>
          <p className="text-zinc-300 text-sm leading-relaxed italic">
            "This is exactly the kind of build I specialize in. I'd love to continue the conversation with the hiring manager. What are the next steps from here?"
          </p>
        </div>
        <div className="border-l-2 border-rose-400 pl-4">
          <h3 className="text-rose-400 text-xs tracking-widest mb-2">DO NOT</h3>
          <div className="space-y-1.5 mt-1">
            <p className="text-zinc-400 text-sm">— Mention unemployment or financial pressure</p>
            <p className="text-zinc-400 text-sm">— Over-explain the consulting period</p>
            <p className="text-zinc-400 text-sm">— Negotiate comp in this call</p>
            <p className="text-zinc-400 text-sm">— Talk about MTI, TalSmart, or Basin::Nexus by name</p>
            <p className="text-zinc-400 text-sm">— Apologize for being "overqualified"</p>
          </div>
        </div>
      </div>
    ),
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white" style={{ fontFamily: "'IBM Plex Mono', 'SF Mono', monospace" }}>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&display=swap" rel="stylesheet" />
      
      <div className="border-b border-zinc-800 px-3 py-2.5">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div>
            <p className="text-zinc-600 text-xs tracking-widest">BASIN::NEXUS // INTERVIEW HUD v2</p>
            <h1 className="text-base font-semibold tracking-tight" style={{ color: '#E8C872' }}>
              KETCH — Partnership Alliance Lead
            </h1>
          </div>
          <div className="text-right">
            <p className="text-emerald-400 text-xs font-medium">TODAY</p>
            <p className="text-zinc-400 text-xs">11:00 AM PDT</p>
          </div>
        </div>
      </div>

      <div className="border-b border-zinc-800 overflow-x-auto">
        <div className="flex max-w-4xl mx-auto">
          {sections.map(s => {
            const Icon = s.icon;
            const isActive = active === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={`flex items-center gap-1.5 px-2.5 py-2 text-xs tracking-wider whitespace-nowrap transition-colors border-b-2 ${
                  isActive 
                    ? 'border-amber-400 text-amber-400' 
                    : 'border-transparent text-zinc-600 hover:text-zinc-400'
                }`}
              >
                <Icon size={12} />
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-5">
        {content[active]}
      </div>

      <div className="border-t border-zinc-800 px-4 py-2 mt-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <p className="text-zinc-700 text-xs">LEON BASIN — BASIN & ASSOCIATES</p>
          <p className="text-zinc-700 text-xs">2026.03.23</p>
        </div>
      </div>
    </div>
  );
}
