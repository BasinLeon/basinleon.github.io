// BASIN::NEXUS v9.0 - Constants

export const INTERVIEW_STAGES = [
    'Phone Screen',
    'Technical Interview',
    'Behavioral Interview',
    'Case Study',
    'Executive Interview',
    'Final Round',
    'Offer Negotiation'
];

export const DEFAULT_AGENTS: import('./types').NexusAgent[] = [
    {
        id: 'agent-social',
        name: 'Nexus::Social',
        type: 'SOCIAL',
        status: 'ACTIVE',
        capabilities: ['LinkedIn Outreach', 'Content Generation', 'Engagement Analysis']
    },
    {
        id: 'agent-email',
        name: 'Nexus::Email',
        type: 'EMAIL',
        status: 'ACTIVE',
        capabilities: ['Cold Email Crafting', 'Follow-up Sequences', 'A/B Testing']
    },
    {
        id: 'agent-web',
        name: 'Nexus::Web',
        type: 'WEB',
        status: 'IDLE',
        capabilities: ['Company Research', 'News Monitoring', 'Competitive Intel']
    },
    {
        id: 'agent-research',
        name: 'Nexus::Research',
        type: 'RESEARCH',
        status: 'ACTIVE',
        capabilities: ['Market Analysis', 'Hiring Signals', 'Funding Alerts']
    }
];

export const DEFAULT_NEURAL_CORE: import('./types').NeuralCore = {
    identity: `Leon Basin | Revenue Architect | 15+ Years GTM Leadership
  
Unlike traditional sales leaders, I build the tooling I use. Google, Fudo Security, SurveyMonkey, Sense, HP, NetApp.

Core Differentiator: I architect autonomous systems that find leads, score signals, and craft outreach—while I sleep.`,
    ledger: `160% Pipeline Growth YoY (Fudo Security)
$10M+ Pipeline Generated (Sense)
$300M+ Portfolio Managed (SurveyMonkey)
105% Quota Attainment Avg
125% Reply Rate Increase`,
    caseStudies: '',
    playbooks: 'MEDDICC | Sandler Selling System | Challenger Sale | SPIN',
    techStack: 'Python | React | Streamlit | Gemini | Claude | OpenAI | HubSpot | Salesforce | Clay | Apollo',
    personas: '',
    marketThesis: 'AI is collapsing the GTM stack. Winners will be those who can architect, not just operate.',
    narrativeForge: '',
    assetLibrary: '',
    dojoIntel: '',
    roadmap: '',
    culturalAlignment: '',
    leadershipPhil: '',
    revenueArchitecture: '',
    ecosystemGraph: '',
    riskMitigation: '',
    productVision: '',
    talentStrategy: '',
    categoryTheory: '',
    unitEconomics: '',
    boardPresence: '',
    executiveSynthesis: ''
};

export const INITIAL_USER_STATE: import('./types').UserState = {
    xp: 0,
    level: 1,
    revenueTarget: 3000000,
    pipeline: [],
    contacts: [],
    agents: DEFAULT_AGENTS,
    agentTasks: [],
    neuralCore: DEFAULT_NEURAL_CORE,
    sessionHistory: [],
    lastSimulacrumScore: 0,
    settings: {
        theme: 'SOVEREIGN',
        notifications: true
    }
};
