
import { AppMode, SYSTEM_PERSONAS } from '../types';

export const generateResponse = async (
    prompt: string,
    mode: AppMode,
    model: string = 'gemini-1.5-flash'
): Promise<string> => {
    // In a real implementation, this would call the Google Generative AI API.
    // For this V5.2 War Room setup, we return simulated "Smart" responses 
    // to verify the UI flow without needing an API key immediately.

    console.log(`[Gemini Request] Mode: ${mode}, Model: ${model}`);

    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate latency

    if (mode === AppMode.DOJO) {
        return `[Simulated AI Interruption] \n\n"Hold on. You mentioned 160% growth at Fudo. That's a big number. What was the BASELINE? And specifically, what change did YOU make to drive that? Don't give me the 'team effort' speech. I want to know your architectural contribution."`;
    }

    if (mode === AppMode.HUNT) {
        return `SNIPER ANALYSIS:\n\n1. MISMATCH: JD asks for "SaaS PLG" experience. Your resume highlights "SLG/Enterprise" (Fudo/Sense). \n\n2. BRIDGE: Position your "Social Selling Playbook" at Sense (125% response rate) as your PLG proxy.\n\n3. SNIPER MESSAGE:\n"Hi [Name], I see you're scaling PLG. At Sense, I built a hybrid engine that used PLG signals to drive Enterprise deals ($11M pipeline). Happy to share the blueprint."`;
    }

    if (mode === AppMode.NETWORK) {
        return `LinkedIn Draft:\n\n🚀 Just analyzed the "DepthFirst" GTM motion.\n\nThe Mistake: Most security startups hire sales reps before they have a signal engine.\n\nThe Fix: I built the "Data Supply Chain" at Fudo that drove 160% growth without adding headcount.\n\nAre you hiring a Resume or a Revenue Engine?\n\n#RevenueArchitecture #DeepWork #GTM`;
    }

    return "AI Response Generation Complete.";
};
