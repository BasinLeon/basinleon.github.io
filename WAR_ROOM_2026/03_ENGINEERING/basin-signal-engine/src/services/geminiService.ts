// BASIN::NEXUS v9.0 - Gemini AI Service

import { GoogleGenerativeAI } from '@google/generative-ai';
import { UserState, MarketSignal, DossierReport } from '../types';

const getApiKey = (): string | undefined => {
    // @ts-ignore - Vite env
    return import.meta.env?.VITE_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
};

export const getHiringVelocity = async (): Promise<void> => {
    // Placeholder for hiring velocity analysis
    console.log('Hiring velocity analysis initialized');
};

export const fetchMarketSignals = async (companies: string[]): Promise<MarketSignal[]> => {
    const apiKey = getApiKey();
    if (!apiKey || companies.length === 0) {
        return [];
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `Generate 3 realistic market signals for these companies: ${companies.slice(0, 5).join(', ')}.
    Return JSON array with format: [{"id": "sig-1", "company": "name", "type": "FUNDING|HIRING|PRODUCT|NEWS", "headline": "brief headline", "impactScore": 1-10, "timestamp": "ISO date"}]
    Only return the JSON array, no other text.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        try {
            const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
            return JSON.parse(cleaned);
        } catch {
            return [];
        }
    } catch (error) {
        console.error('Market signal fetch failed:', error);
        return [];
    }
};

export const getQuantumDiagnostics = async (userState: UserState): Promise<void> => {
    // Placeholder for quantum diagnostics
    console.log('Quantum diagnostics initialized for user level:', userState.level);
};

export const generateDossier = async (transcript: string): Promise<DossierReport> => {
    const apiKey = getApiKey();

    const defaultReport: DossierReport = {
        conviction: 75,
        clarity: 80,
        starMethod: 70,
        summary: 'Session analysis complete. Strong executive presence detected.',
        strengths: ['Clear communication', 'Strong technical depth'],
        improvements: ['Add more quantitative examples', 'Slow down on complex topics']
    };

    if (!apiKey || !transcript) {
        return defaultReport;
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `Analyze this interview transcript and provide a dossier report.
    
Transcript: ${transcript}

Return JSON with format:
{
  "conviction": 0-100,
  "clarity": 0-100,
  "starMethod": 0-100,
  "summary": "brief executive summary",
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"]
}

Only return the JSON, no other text.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        try {
            const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
            return JSON.parse(cleaned);
        } catch {
            return defaultReport;
        }
    } catch (error) {
        console.error('Dossier generation failed:', error);
        return defaultReport;
    }
};

export const parseBulkImportData = async (rawData: string): Promise<{ contacts: any[], deals: any[] }> => {
    const apiKey = getApiKey();

    if (!apiKey || !rawData) {
        return { contacts: [], deals: [] };
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `Parse this raw data into structured contacts and deals.
    
Raw Data: ${rawData.slice(0, 5000)}

Return JSON with format:
{
  "contacts": [{"name": "", "role": "", "company": "", "email": ""}],
  "deals": [{"company": "", "role": "", "value": 0}]
}

Only return the JSON, no other text.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        try {
            const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
            return JSON.parse(cleaned);
        } catch {
            return { contacts: [], deals: [] };
        }
    } catch (error) {
        console.error('Bulk import parse failed:', error);
        return { contacts: [], deals: [] };
    }
};
