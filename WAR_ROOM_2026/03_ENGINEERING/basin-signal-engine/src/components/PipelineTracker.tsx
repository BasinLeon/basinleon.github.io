import React, { useState, useMemo } from 'react';
import { UserState, JobDeal, JobStage, AppView } from '../types';
import {
    Target, Plus, ChevronRight, TrendingUp, DollarSign,
    Building, Calendar, X, Zap, Activity, GripVertical
} from 'lucide-react';

interface PipelineTrackerProps {
    userState: UserState;
    updateUserState: (updates: Partial<UserState>) => void;
    addNotification: (type: 'SUCCESS' | 'ERROR' | 'INFO' | 'WARNING', msg: string, sub?: string) => void;
    onPrepJob: (job: JobDeal) => void;
}

const STAGE_CONFIG = {
    [JobStage.TARGET]: { label: 'Targets', color: '#64748b', bgColor: 'bg-slate-800' },
    [JobStage.APPLIED]: { label: 'Applied', color: '#D4AF37', bgColor: 'bg-[#D4AF37]/20' },
    [JobStage.INTERVIEWING]: { label: 'Interviewing', color: '#00E5FF', bgColor: 'bg-[#00E5FF]/20' },
    [JobStage.OFFER]: { label: 'Offer', color: '#10b981', bgColor: 'bg-emerald-500/20' },
    [JobStage.CLOSED]: { label: 'Closed', color: '#ef4444', bgColor: 'bg-red-500/20' },
};

export const PipelineTracker: React.FC<PipelineTrackerProps> = ({
    userState,
    updateUserState,
    addNotification,
    onPrepJob
}) => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedDeal, setSelectedDeal] = useState<JobDeal | null>(null);
    const [newDeal, setNewDeal] = useState<Partial<JobDeal>>({
        company: '', role: '', stage: JobStage.TARGET, value: 200000, probability: 20
    });

    const pipeline = userState.pipeline || [];

    const stats = useMemo(() => {
        const total = pipeline.reduce((acc, d) => acc + (d.value || 0), 0);
        const weighted = pipeline.reduce((acc, d) => acc + ((d.value || 0) * (d.probability / 100)), 0);
        return { total, weighted, count: pipeline.length };
    }, [pipeline]);

    const dealsByStage = useMemo(() => {
        const stages = Object.values(JobStage);
        return stages.reduce((acc, stage) => {
            acc[stage] = pipeline.filter(d => d.stage === stage);
            return acc;
        }, {} as Record<JobStage, JobDeal[]>);
    }, [pipeline]);

    const handleAddDeal = () => {
        if (!newDeal.company || !newDeal.role) {
            addNotification('ERROR', 'Validation Failed', 'Company and Role are required.');
            return;
        }

        const deal: JobDeal = {
            id: `deal-${Date.now()}`,
            company: newDeal.company!,
            role: newDeal.role!,
            stage: newDeal.stage || JobStage.TARGET,
            value: newDeal.value || 200000,
            probability: newDeal.probability || 20,
            contacts: [],
            notes: '',
            nextAction: 'Initial research',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        updateUserState({ pipeline: [...pipeline, deal], xp: userState.xp + 100 });
        addNotification('SUCCESS', 'Pipeline Node Created', `${deal.company} added to ${STAGE_CONFIG[deal.stage].label}`);
        setShowAddModal(false);
        setNewDeal({ company: '', role: '', stage: JobStage.TARGET, value: 200000, probability: 20 });
    };

    const moveToStage = (deal: JobDeal, newStage: JobStage) => {
        const updated = pipeline.map(d =>
            d.id === deal.id
                ? { ...d, stage: newStage, updatedAt: new Date().toISOString() }
                : d
        );
        updateUserState({ pipeline: updated, xp: userState.xp + 50 });
        addNotification('SUCCESS', 'Stage Updated', `${deal.company} moved to ${STAGE_CONFIG[newStage].label}`);
    };

    return (
        <div className="p-8 h-full flex flex-col bg-[#020617] relative animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-5xl font-black text-white leading-none tracking-tighter uppercase">
                        Revenue <span className="text-[#D4AF37]">Pipeline</span>
                    </h2>
                    <p className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.5em] mt-3">
                        Opportunity Corridor // Sovereign GTM
                    </p>
                </div>
                <div className="flex gap-6">
                    <div className="glass-panel px-8 py-4 rounded-2xl border border-slate-800">
                        <div className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Total Pipeline</div>
                        <div className="text-2xl font-mono font-bold text-white">${(stats.total / 1000).toFixed(0)}K</div>
                    </div>
                    <div className="glass-panel px-8 py-4 rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/5">
                        <div className="text-[9px] text-[#D4AF37] uppercase font-black tracking-widest">Weighted</div>
                        <div className="text-2xl font-mono font-bold text-[#D4AF37]">${(stats.weighted / 1000).toFixed(0)}K</div>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-[#D4AF37] hover:bg-yellow-500 text-black px-8 py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase flex items-center gap-3 transition-all shadow-[0_0_30px_rgba(212,175,55,0.2)]"
                    >
                        <Plus size={18} strokeWidth={3} /> Add Opportunity
                    </button>
                </div>
            </div>

            {/* Kanban Board */}
            <div className="flex-1 flex gap-6 overflow-x-auto custom-scrollbar pb-4">
                {Object.entries(STAGE_CONFIG).map(([stage, config]) => (
                    <div
                        key={stage}
                        className="flex-shrink-0 w-[340px] flex flex-col bg-black/30 rounded-3xl border border-slate-800 overflow-hidden"
                    >
                        {/* Column Header */}
                        <div className={`p-6 border-b border-slate-800 ${config.bgColor}`}>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: config.color }}
                                    />
                                    <span className="text-sm font-black text-white uppercase tracking-widest">
                                        {config.label}
                                    </span>
                                </div>
                                <span className="text-[10px] font-mono text-slate-500 font-black">
                                    {dealsByStage[stage as JobStage]?.length || 0}
                                </span>
                            </div>
                        </div>

                        {/* Cards */}
                        <div className="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar">
                            {dealsByStage[stage as JobStage]?.map(deal => (
                                <div
                                    key={deal.id}
                                    onClick={() => setSelectedDeal(deal)}
                                    className="p-6 bg-slate-900/60 rounded-2xl border border-slate-800 hover:border-slate-600 cursor-pointer transition-all group"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-2 text-[#D4AF37]">
                                            <Building size={14} />
                                            <span className="text-xs font-black uppercase tracking-widest">{deal.company}</span>
                                        </div>
                                        <GripVertical size={14} className="text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <h4 className="text-sm font-bold text-white mb-3 line-clamp-2">{deal.role}</h4>
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-mono font-bold text-white">
                                            ${(deal.value / 1000).toFixed(0)}K
                                        </span>
                                        <span className="text-[10px] font-mono text-slate-500">
                                            {deal.probability}% prob
                                        </span>
                                    </div>
                                </div>
                            ))}

                            {(!dealsByStage[stage as JobStage] || dealsByStage[stage as JobStage].length === 0) && (
                                <div className="flex flex-col items-center justify-center py-12 opacity-30">
                                    <Target size={32} className="mb-3" />
                                    <span className="text-[10px] font-mono uppercase tracking-widest">Empty</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-[#020617]/95 z-[200] flex items-center justify-center p-12 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="w-full max-w-xl glass-panel p-12 rounded-[3rem] border border-[#D4AF37]/30 shadow-2xl">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-3xl font-black text-white uppercase tracking-tighter">
                                Add <span className="text-[#D4AF37]">Opportunity</span>
                            </h3>
                            <button onClick={() => setShowAddModal(false)} className="text-slate-600 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Company *</label>
                                <input
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white font-mono focus:border-[#D4AF37] outline-none"
                                    value={newDeal.company}
                                    onChange={e => setNewDeal({ ...newDeal, company: e.target.value })}
                                    placeholder="Company name..."
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Role *</label>
                                <input
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white font-mono focus:border-[#D4AF37] outline-none"
                                    value={newDeal.role}
                                    onChange={e => setNewDeal({ ...newDeal, role: e.target.value })}
                                    placeholder="Job title..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Value ($)</label>
                                    <input
                                        type="number"
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white font-mono focus:border-[#D4AF37] outline-none"
                                        value={newDeal.value}
                                        onChange={e => setNewDeal({ ...newDeal, value: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Stage</label>
                                    <select
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white font-mono focus:border-[#D4AF37] outline-none"
                                        value={newDeal.stage}
                                        onChange={e => setNewDeal({ ...newDeal, stage: e.target.value as JobStage })}
                                    >
                                        {Object.entries(STAGE_CONFIG).map(([stage, config]) => (
                                            <option key={stage} value={stage}>{config.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <button
                                onClick={handleAddDeal}
                                className="w-full py-5 bg-[#D4AF37] text-black font-black rounded-2xl text-sm tracking-[0.4em] uppercase hover:bg-yellow-500 transition-all flex items-center justify-center gap-3"
                            >
                                <Zap size={18} /> Create Opportunity
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
