
import { AppMode, AVAILABLE_MODELS, ModelProvider, SYSTEM_PERSONAS } from '../types';

export const generateResponse = async (
    prompt: string,
    mode: AppMode,
    modelId: string = 'gemini-1.5-flash'
): Promise<string> => {
    const selectedModel = AVAILABLE_MODELS.find(m => m.id === modelId) || AVAILABLE_MODELS[0];
    
    console.log(`[Nexus AI Request] Mode: ${mode}, Model: ${selectedModel.label} (${selectedModel.provider})`);

    // System Persona for the mode
    const systemPersona = (SYSTEM_PERSONAS as any)[mode] || "You are a helpful assistant.";

    if (selectedModel.provider === ModelProvider.OLLAMA) {
        try {
            const response = await fetch('http://localhost:11434/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: selectedModel.id,
                    messages: [
                        { role: 'system', content: systemPersona },
                        { role: 'user', content: prompt }
                    ],
                    stream: false
                })
            });

            if (!response.ok) throw new Error('Ollama connection failed. Is it running?');
            
            const data = await response.json();
            return data.message.content;
            
        } catch (error) {
            console.error('Ollama Error:', error);
            return `ERROR: Local Model (${selectedModel.label}) is offline. Check if Ollama is running at http://localhost:11434.`;
        }
    }

    if (selectedModel.provider === ModelProvider.ANTHROPIC || selectedModel.provider === ModelProvider.OPENAI) {
        return `UPLINK REJECTED: ${selectedModel.label} requires an external API Key. Please provide your ${selectedModel.provider.toUpperCase()} credentials in settings to unlock this node. Switching to local DeepSeek-R1 or Phi-4 is recommended to avoid credit exhaustion.`;
    }

    // Google Gemini Implementation (Placeholder - assumes API integration logic)
    // For now, mirroring the simulated high-signal logic but acknowledging the key-constrained reality.

    await new Promise(resolve => setTimeout(resolve, 1200)); 

    if (mode === AppMode.DOJO) {
        return `[INTERVIEWER] \n\n"I'm looking at your pipeline metrics. 160% growth is impressive, but was that driven by market tailwinds or your actual GTM architecture? Prove it to me."`;
    }

    if (mode === AppMode.HUNT) {
        return `SNIPER ANALYSIS:\n\n1. GAP: Your resume mentions HubSpot/Salesforce, but this JD is heavy on 'Modern Data Stack' (Snowflake/Fivetran). \n\n2. MESSAGE: "I notice you're building a Snowflake-centric GTM. At Fudo, I integrated the signal layer directly into our BigQuery warehouse to drive 160% growth. Let's discuss bridging your current gaps."`;
    }

    return `Gemini Response (Simulated): Nexus Uplink Active. You requested analysis for: "${prompt.substring(0, 30)}..."`;
};
