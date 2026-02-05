// BASIN::NEXUS v9.0 - Type Definitions

export enum AppView {
    DASHBOARD = 'DASHBOARD',
    PIPELINE = 'PIPELINE',
    NETWORK = 'NETWORK',
    DOJO = 'DOJO',
    KNOWLEDGE = 'KNOWLEDGE',
    AGENTS = 'AGENTS',
    VAULT = 'VAULT',
    STUDIO = 'STUDIO',
    SETTINGS = 'SETTINGS'
}

export enum JobStage {
    TARGET = 'TARGET',
    APPLIED = 'APPLIED',
    INTERVIEWING = 'INTERVIEWING',
    OFFER = 'OFFER',
    CLOSED = 'CLOSED'
}

export interface JobDeal {
    id: string;
    company: string;
    role: string;
    stage: JobStage;
    value: number;
    probability: number;
    contacts: string[];
    notes: string;
    nextAction: string;
    createdAt: string;
    updatedAt: string;
}

export interface Contact {
    id: string;
    name: string;
    role: string;
    company: string;
    email?: string;
    verifiedEmail?: string;
    phone?: string;
    linkedin?: string;
    lastContact: string;
    resurfaceInDays: number;
    signalScore: number;
    notes: string;
    intent: 'LOW' | 'MEDIUM' | 'HIGH';
    triggers: string[];
    securityTier?: 'T1_OPERATOR' | 'T2_MANAGER' | 'T3_EXECUTIVE' | 'SOVEREIGN_ADMIN';
    pamRole?: 'CHAMPION' | 'INFLUENCER' | 'DECISION_MAKER' | 'BLOCKER';
}

export interface NexusAgent {
    id: string;
    name: string;
    type: 'SOCIAL' | 'EMAIL' | 'WEB' | 'RESEARCH';
    status: 'ACTIVE' | 'IDLE' | 'OFFLINE';
    capabilities: string[];
    lastRun?: string;
}

export interface AgentTask {
    id: string;
    type: 'SOCIAL' | 'EMAIL' | 'WEB' | 'RESEARCH';
    status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
    description: string;
    result?: string;
    timestamp: string;
}

export interface MarketSignal {
    id: string;
    company: string;
    type: 'FUNDING' | 'HIRING' | 'PRODUCT' | 'NEWS';
    headline: string;
    impactScore: number;
    timestamp: string;
}

export interface NeuralCore {
    identity: string;
    ledger: string;
    caseStudies: string;
    playbooks: string;
    techStack: string;
    personas: string;
    marketThesis: string;
    narrativeForge: string;
    assetLibrary: string;
    dojoIntel: string;
    roadmap: string;
    culturalAlignment: string;
    leadershipPhil: string;
    revenueArchitecture: string;
    ecosystemGraph: string;
    riskMitigation: string;
    productVision: string;
    talentStrategy: string;
    categoryTheory: string;
    unitEconomics: string;
    boardPresence: string;
    executiveSynthesis: string;
}

export interface DojoSessionConfig {
    mode: 'FRIENDLY' | 'SKEPTIC' | 'BRUTAL' | 'RIDDLER';
    stage: string;
    targetCompany: string;
    targetRole: string;
}

export interface SessionHistory {
    id: string;
    config: DojoSessionConfig;
    transcript: string[];
    score: number;
    timestamp: string;
}

export interface DossierReport {
    conviction: number;
    clarity: number;
    starMethod: number;
    summary: string;
    strengths: string[];
    improvements: string[];
}

export interface UserState {
    xp: number;
    level: number;
    revenueTarget: number;
    pipeline: JobDeal[];
    contacts: Contact[];
    agents: NexusAgent[];
    agentTasks: AgentTask[];
    neuralCore: NeuralCore;
    sessionHistory: SessionHistory[];
    lastSimulacrumScore: number;
    settings: {
        theme: 'SOVEREIGN' | 'MINIMAL';
        notifications: boolean;
    };
}

export interface Notification {
    id: string;
    type: 'SUCCESS' | 'ERROR' | 'INFO' | 'WARNING';
    message: string;
    subMessage?: string;
    timestamp: Date;
}
