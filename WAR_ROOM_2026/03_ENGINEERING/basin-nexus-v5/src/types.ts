
export enum AppMode {
    DASHBOARD = 'DASHBOARD',
    DOJO = 'DOJO',
    NETWORK = 'NETWORK',
    PIPELINE = 'PIPELINE',
    HUNT = 'HUNT',
    RESUME = 'RESUME',
    ARCHITECT = 'ARCHITECT',
    SCRIBE = 'SCRIBE',
    MIRROR = 'MIRROR'
}

export enum ModelProvider {
    GOOGLE = 'google',
    OLLAMA = 'ollama',
    ANTHROPIC = 'anthropic',
    OPENAI = 'openai'
}

export interface ModelOption {
    id: string;
    label: string;
    provider: ModelProvider;
    thinking?: boolean;
}

export const AVAILABLE_MODELS: ModelOption[] = [
    { id: 'gemini-1.5-flash', label: 'Gemini 3 Flash', provider: ModelProvider.GOOGLE },
    { id: 'gemini-1.5-pro', label: 'Gemini 3 Pro (High)', provider: ModelProvider.GOOGLE },
    { id: 'gemini-1.5-pro-low', label: 'Gemini 3 Pro (Low)', provider: ModelProvider.GOOGLE },
    { id: 'claude-3-5-sonnet', label: 'Claude Sonnet 4.5', provider: ModelProvider.ANTHROPIC },
    { id: 'claude-3-5-sonnet-thinking', label: 'Claude Sonnet 4.5 (Thinking)', provider: ModelProvider.ANTHROPIC, thinking: true },
    { id: 'claude-3-opus-thinking', label: 'Claude Opus 4.5 (Thinking)', provider: ModelProvider.ANTHROPIC, thinking: true },
    { id: 'gpt-oss-deepseek-r1', label: 'GPT-OSS DeepSeek R1 (14B)', provider: ModelProvider.OPENAI, thinking: true },
    { id: 'gpt-oss-phi4', label: 'GPT-OSS Phi-4 (Logic)', provider: ModelProvider.OPENAI },
    { id: 'gpt-oss-mistral', label: 'GPT-OSS Mistral Small (Refining)', provider: ModelProvider.OPENAI },
    { id: 'gpt-oss-llama3', label: 'GPT-OSS Llama 3.3 (70B)', provider: ModelProvider.OPENAI },
    { id: 'gpt-oss-120b', label: 'GPT-OSS 120B (Medium)', provider: ModelProvider.OPENAI }
];


export interface Contact {
    id: string;
    name: string;
    role: string;
    company: string;
    stage: 'Cold' | 'Warm' | 'Hot' | 'Champion';
    lastTouch: string;
    nextStep: string;
    email?: string;
    linkedin?: string;
    notes?: string;
}

export interface Deal {
    id: string;
    company: string;
    role: string;
    stage: 'Target' | 'Applied' | 'Interview' | 'Offer' | 'Closed';
    value: string;
    probability: number;
    contacts: string[];
    nextStep: string;
    dateAdded: string;
}

export interface SniperAnalysis {
    jdMismatch: string[];
    keywordGaps: string[];
    matchScore: number;
    sniperMessage: string;
}

export const RESUME_CONTEXT = `
NAME: Leon Basin
TITLE: Director of GTM & Revenue Architecture
SUMMARY: 15+ years GTM leadership (Google, Fudo, Sense, NetApp).
KEY METRICS:
- Fudo Security: Drove 160% YoY pipeline growth. Restructured global outbound.
- Sense: Generated $11M pipeline. Reduced churn 12%.
- SurveyMonkey: Managed $300M+ enterprise portfolio.
PHILOSOPHY: "The Builder's Path". Don't just run playbooks; build the systems (Basin::Nexus).
SKILLS: Python, AI Agents, Zero Trust, Channel Sales, Revenue Operations.
`;

export const SYSTEM_PERSONAS = {
    DOJO: `You are a skeptical, adversarial VP of Sales interviewing Leon Basin. 
    CONTEXT: Leon claims to be a "Revenue Architect" who builds systems.
    GOAL: Test if he's for real. 
    BEHAVIOR:
    - If he's vague, interrupt: "Give me the number."
    - If he says "we", ask "What did YOU do?"
    - Reference his resume: "You claim 160% growth at Fudo. How exactly did you attribute that?"
    - Be short, direct, and imposing.`,
    
    HUNT: `You are a "Sniper" Research Assistant.
    INPUT: A Job Description (JD).
    TASK: 
    1. Gap Analysis: Compare JD vs Leon's Resume (${RESUME_CONTEXT}). Where is the risk?
    2. Snipe Message: Draft a high-agency "Value Prop" message to the Hiring Manager. 
       - Voice: "I see you need X. I built X at Fudo/Sense. Here's how."
       - No fluff. No "passionate about".`,
       
    NETWORK: `You are the "Connector Engine".
    TASK: Turn raw conversation notes into Viral LinkedIn Content.
    VOICE: "The Builder". High agency, authoritative, specific.
    FORMAT: 
    - Hook (Data/Insight)
    - The Problem (Old Way)
    - The Solution (System/Architecture)
    - The Result (Metric).`,
    
    ARCHITECT: `You are the System Architect. Design GTM workflows.`
};
