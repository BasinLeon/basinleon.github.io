
import React, { useState } from 'react';
import { Deal } from '../types';

const MOCK_DEALS: Deal[] = [
    { id: '1', company: 'SnapMagic', role: 'Enterprise AE', stage: 'Interview', value: '$180k', probability: 60, contacts: ['Recruiter'], nextStep: 'Follow up', dateAdded: '2025-11-20' },
    { id: '2', company: 'Aikido Security', role: 'Account Executive', stage: 'Interview', value: '$200k', probability: 75, contacts: ['Kayleigh'], nextStep: 'Wait for response', dateAdded: '2025-11-20' },
    { id: '3', company: 'Verkada', role: 'Enterprise AE', stage: 'Applied', value: '$220k', probability: 20, contacts: ['Justin'], nextStep: 'Nudge Recruiter', dateAdded: '2025-11-18' },
    { id: '4', company: 'DepthFirst', role: 'Strategic AE', stage: 'Target', value: '$250k', probability: 10, contacts: ['Samuel Burns'], nextStep: 'Get CRO Intro', dateAdded: '2025-11-19' },
    { id: '5', company: 'Mistral AI', role: 'US Enterprise Sales', stage: 'Applied', value: '$240k', probability: 30, contacts: ['Recruiter'], nextStep: 'Check Application', dateAdded: '2025-11-18' }
];

const PipelineTracker: React.FC = () => {
    const [deals, setDeals] = useState<Deal[]>(MOCK_DEALS);

    const stages: Deal['stage'][] = ['Target', 'Applied', 'Interview', 'Offer', 'Closed'];

    const getStageColor = (stage: string) => {
        switch (stage) {
            case 'Target': return 'border-slate-700 bg-slate-900/50';
            case 'Applied': return 'border-cyan-500/30 bg-cyan-900/10';
            case 'Interview': return 'border-[#D4AF37]/50 bg-[#D4AF37]/10';
            case 'Offer': return 'border-emerald-500/50 bg-emerald-900/20';
            case 'Closed': return 'border-slate-800 bg-black opacity-50';
            default: return 'border-slate-800';
        }
    };

    return (
        <div className="flex h-full flex-col p-6 bg-slate-950 font-sans overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-2xl border border-slate-800 mb-6">
                <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                    <span className="text-cyan-400">📈</span> Pipeline Velocity
                </h2>
                <div className="flex gap-4 text-xs font-mono">
                    <div className="px-4 py-2 bg-slate-900 rounded-lg border border-slate-800">
                        <span className="text-slate-500 mr-2">TOTAL VALUE</span>
                        <span className="text-emerald-400 font-bold">$1.09M</span>
                    </div>
                </div>
            </div>

            {/* Kanban Board */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden flex gap-4 pb-4">
                {stages.map(stage => (
                    <div key={stage} className="min-w-[300px] flex flex-col h-full">
                        <div className="flex justify-between items-center p-3 mb-2 bg-slate-900/30 rounded-lg border border-slate-800/50">
                            <h3 className="text-[10px] uppercase font-black tracking-widest text-slate-400">{stage}</h3>
                            <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">{deals.filter(d => d.stage === stage).length}</span>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar p-1">
                            {deals.filter(d => d.stage === stage).map(deal => (
                                <div
                                    key={deal.id}
                                    className={`p-5 rounded-xl border transition-all hover:scale-[1.02] cursor-move shadow-lg group hover:shadow-black/60 active:cursor-grabbing ${getStageColor(stage)}`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="font-bold text-slate-200 group-hover:text-white transition-colors">{deal.company}</div>
                                        <div className="text-[10px] font-mono text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-900/50">{deal.value}</div>
                                    </div>
                                    <div className="text-xs text-slate-500 mb-4">{deal.role}</div>

                                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-800/50">
                                        <div className="text-[10px] text-slate-600 font-mono">{deal.nextStep}</div>
                                        <div className="h-1.5 w-1.5 rounded-full bg-slate-700 group-hover:bg-[#D4AF37] transition-colors"></div>
                                    </div>
                                </div>
                            ))}
                            {deals.filter(d => d.stage === stage).length === 0 && (
                                <div className="h-24 rounded-xl border border-dashed border-slate-800/50 flex items-center justify-center opacity-30">
                                    <span className="text-xs text-slate-600 uppercase tracking-widest">Empty</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PipelineTracker;
