
import React, { useState } from 'react';
import { generateResponse } from '../services/geminiService';
import { AppMode } from '../types';

const Hunt: React.FC = () => {
    const [jdText, setJdText] = useState("");
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleAnalyze = async () => {
        if (!jdText.trim()) return;
        setIsAnalyzing(true);
        const response = await generateResponse(jdText, AppMode.HUNT);
        setAnalysis(response);
        setIsAnalyzing(false);
    };

    return (
        <div className="flex h-full gap-6 p-6 bg-slate-950 font-sans overflow-hidden">
            {/* Input Panel */}
            <div className="w-1/2 flex flex-col gap-6">
                <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
                    <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                        <span className="text-red-500">🎯</span> Sniper Scope
                    </h2>
                    <span className="text-[10px] bg-red-950 text-red-400 px-3 py-1 rounded-full border border-red-900 uppercase font-bold tracking-widest animate-pulse">
                        Active
                    </span>
                </div>

                <div className="flex-1 glass-panel rounded-2xl border border-slate-800 p-1 flex flex-col bg-black">
                    <textarea
                        className="flex-1 bg-transparent p-6 text-sm font-mono text-slate-400 resize-none outline-none focus:text-white transition-colors custom-scrollbar"
                        placeholder="PASTE JOB DESCRIPTION HERE..."
                        value={jdText}
                        onChange={(e) => setJdText(e.target.value)}
                    />
                    <div className="p-4 border-t border-slate-800 bg-slate-900/50 rounded-b-xl">
                        <button
                            onClick={handleAnalyze}
                            disabled={isAnalyzing || !jdText}
                            className="w-full bg-red-600 text-white font-black uppercase tracking-[0.2em] py-4 rounded-xl hover:bg-red-500 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            {isAnalyzing ? (
                                <>
                                    <span className="animate-spin">⚙️</span> CALIBRATING...
                                </>
                            ) : (
                                <>
                                    <span className="text-lg">⚡</span> EXECUTE ANALYSIS
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Output Panel */}
            <div className="w-1/2 glass-panel rounded-2xl border border-slate-800 bg-slate-900/20 flex flex-col relative overflow-hidden">
                {analysis ? (
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                        <div className="font-mono text-xs text-red-500 mb-6 uppercase tracking-widest border-b border-red-900/30 pb-2">
                            Analysis Protocol: RESUME_MATCH
                        </div>
                        <div className="whitespace-pre-wrap text-slate-300 text-sm leading-relaxed font-mono">
                            {analysis}
                        </div>

                        <div className="mt-8 flex gap-4">
                            <button className="flex-1 bg-[#D4AF37] text-black font-black uppercase text-xs py-3 rounded-xl hover:scale-105 transition-transform">
                                Copy Sniper Message
                            </button>
                            <button className="flex-1 bg-slate-800 text-white font-black uppercase text-xs py-3 rounded-xl hover:bg-slate-700 transition-colors border border-slate-700">
                                Save to Pipeline
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center opacity-20 p-12 text-center select-none">
                        <div className="w-32 h-32 border-2 border-dashed border-slate-600 rounded-full flex items-center justify-center mb-6">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                        </div>
                        <h3 className="text-xl font-black text-slate-500 uppercase tracking-widest mb-2">Awaiting Target Data</h3>
                        <p className="font-mono text-xs text-slate-600 max-w-xs">Paste a JD to identify skill gaps and generate optimal outreach vectors.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Hunt;
