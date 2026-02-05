import React, { useEffect, useState, useMemo } from 'react';
import { UserState, AppView, Contact, JobStage, JobDeal, MarketSignal } from '../types';
import {
    TrendingUp, Award, Globe, Zap, Bot, Target, Edit2,
    ArrowUpRight, Activity, Briefcase, ChevronRight, Sparkles,
    LayoutGrid, Timer, RefreshCw
} from 'lucide-react';
import { fetchMarketSignals } from '../services/geminiService';

interface DashboardProps {
    userState: UserState;
    setView: (view: AppView) => void;
    onPrepJob: (job: JobDeal) => void;
    onSimulateCall: (contact: Contact) => void;
    updateUserState: (updates: Partial<UserState>) => void;
    addNotification: (type: 'SUCCESS' | 'ERROR' | 'INFO' | 'WARNING', msg: string, sub?: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
    userState,
    setView,
    updateUserState,
    addNotification
}) => {
    const [marketSignals, setMarketSignals] = useState<MarketSignal[]>([]);
    const [isEditingTarget, setIsEditingTarget] = useState(false);
    const [tempTarget, setTempTarget] = useState(userState.revenueTarget || 3000000);

    useEffect(() => {
        const companies = (userState.pipeline || []).map(d => d.company);
        if (companies.length > 0) {
            fetchMarketSignals(companies).then(setMarketSignals);
        }
    }, [userState.pipeline?.length]);

    const stats = useMemo(() => {
        const pipeline = userState.pipeline || [];
        const totalValue = pipeline.reduce((acc, deal) => acc + (deal.value || 0), 0);
        const weightedValue = pipeline.reduce((acc, deal) => acc + ((deal.value || 0) * (deal.probability / 100)), 0);

        const distribution = [
            { name: 'Offer', value: pipeline.filter(d => d.stage === JobStage.OFFER).reduce((a, b) => a + (b.value || 0), 0) },
            { name: 'Interview', value: pipeline.filter(d => d.stage === JobStage.INTERVIEWING).reduce((a, b) => a + (b.value || 0), 0) },
            { name: 'Engaged', value: pipeline.filter(d => d.stage === JobStage.APPLIED).reduce((a, b) => a + (b.value || 0), 0) },
            { name: 'Targets', value: pipeline.filter(d => d.stage === JobStage.TARGET).reduce((a, b) => a + (b.value || 0), 0) },
        ];
        return { totalValue, weightedValue, distribution };
    }, [userState.pipeline]);

    const saveTarget = () => {
        updateUserState({ revenueTarget: tempTarget });
        setIsEditingTarget(false);
        addNotification('SUCCESS', 'Target Recalibrated', `Annual GTM target set to $${(tempTarget / 1000000).toFixed(1)}M`);
    };

    const gapToGoal = Math.max(0, tempTarget - stats.weightedValue);

    return (
        <div className="p-8 space-y-8 h-full overflow-y-auto bg-[#020617] custom-scrollbar animate-in fade-in duration-500 overflow-x-hidden">

            {/* HEADER HUD */}
            <div className="flex justify-between items-start mb-8">
                <div className="space-y-2">
                    <div className="flex items-center gap-4">
                        <div className="h-[2px] w-16 bg-gradient-to-r from-[#00E5FF] to-transparent"></div>
                        <span className="text-[11px] font-mono text-[#00E5FF] uppercase tracking-[0.8em] font-black">
                            Nexus Command // v9.0 Sovereign
                        </span>
                    </div>
                    <h1 className="text-9xl font-black text-white leading-none tracking-[-0.08em] uppercase select-none">
                        War <span className="text-[#D4AF37] italic opacity-90">Room</span>
                    </h1>
                </div>

                <div className="flex gap-6">
                    <div className="glass-panel p-8 rounded-[2.5rem] border border-slate-800 min-w-[280px] relative group overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                            <Target size={120} />
                        </div>
                        <div className="text-[10px] text-slate-500 uppercase font-black mb-2 flex justify-between items-center relative z-10">
                            <span className="tracking-[0.2em]">Revenue Target</span>
                            <button
                                onClick={() => setIsEditingTarget(!isEditingTarget)}
                                className="text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-[#D4AF37]/10 rounded"
                            >
                                <Edit2 size={12} />
                            </button>
                        </div>
                        {isEditingTarget ? (
                            <div className="mt-2 flex gap-3 relative z-10">
                                <input
                                    type="number"
                                    className="bg-black/50 border border-slate-700 text-white font-mono text-lg p-2 rounded-xl w-36 focus:border-[#D4AF37] outline-none"
                                    value={tempTarget}
                                    onChange={e => setTempTarget(parseInt(e.target.value) || 0)}
                                />
                                <button
                                    onClick={saveTarget}
                                    className="bg-[#D4AF37] text-black text-[10px] px-4 rounded-xl font-black tracking-widest hover:scale-105 active:scale-95 transition-transform"
                                >
                                    SAVE
                                </button>
                            </div>
                        ) : (
                            <div className="text-5xl font-mono font-bold text-white tracking-tighter relative z-10">
                                ${(tempTarget / 1000000).toFixed(1)}M
                            </div>
                        )}
                    </div>

                    <div className="bg-[#D4AF37]/5 p-8 rounded-[2.5rem] border border-[#D4AF37]/30 min-w-[280px] relative group overflow-hidden">
                        <div className="absolute top-0 left-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                            <TrendingUp size={120} />
                        </div>
                        <div className="text-[10px] text-[#D4AF37] uppercase font-black mb-2 flex justify-between relative z-10">
                            <span className="tracking-[0.2em]">Sovereign Forecast</span>
                            <span className="text-emerald-500 font-mono text-[9px] flex items-center gap-1 font-black uppercase">
                                +12.4% VELOCITY
                            </span>
                        </div>
                        <div className="text-5xl font-mono font-bold text-[#D4AF37] tracking-tighter relative z-10">
                            ${(stats.weightedValue / 1000).toFixed(0)}K
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8">
                {/* Market Intelligence Feed */}
                <div className="col-span-4 glass-panel p-10 rounded-[3.5rem] border border-slate-800 h-[520px] flex flex-col relative group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 text-[#00E5FF] group-hover:rotate-12 transition-transform duration-1000">
                        <Globe size={180} />
                    </div>
                    <div className="flex justify-between items-center mb-10 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-[#00E5FF]/20 rounded-xl">
                                <Activity size={20} className="text-[#00E5FF] animate-pulse" />
                            </div>
                            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em]">Market Pulse</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-ping"></div>
                            <span className="text-[10px] text-emerald-500 font-mono font-black uppercase tracking-widest">Live_Crawler</span>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-5 relative z-10">
                        {marketSignals.map(sig => (
                            <div key={sig.id} className="p-6 bg-slate-900/30 border-l-4 border-[#00E5FF] rounded-r-[1.5rem] group/sig hover:bg-slate-900 transition-all cursor-pointer">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[9px] font-mono text-slate-500 uppercase font-black tracking-widest">
                                        {sig.company} // {sig.type}
                                    </span>
                                    <ArrowUpRight size={14} className="text-slate-700 group-hover/sig:text-[#00E5FF] transition-colors" />
                                </div>
                                <p className="text-sm text-white font-bold leading-tight line-clamp-2 tracking-tight">{sig.headline}</p>
                                <div className="mt-4 flex items-center gap-3">
                                    <div className="h-1.5 flex-1 bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-cyan-600 to-[#00E5FF]" style={{ width: `${sig.impactScore * 10}%` }}></div>
                                    </div>
                                    <span className="text-[9px] text-slate-600 font-mono font-black uppercase">Level: {sig.impactScore}</span>
                                </div>
                            </div>
                        ))}
                        {marketSignals.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-slate-800 font-mono text-[10px] uppercase tracking-widest py-20">
                                <RefreshCw className="animate-spin mb-4" size={24} />
                                Awaiting Neural Uplink...
                            </div>
                        )}
                    </div>
                </div>

                {/* Revenue Corridor */}
                <div className="col-span-5 glass-panel p-10 rounded-[3.5rem] border border-slate-800 h-[520px] flex flex-col">
                    <div className="flex justify-between items-center mb-10">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-[#D4AF37]/20 rounded-xl">
                                <TrendingUp size={20} className="text-[#D4AF37]" />
                            </div>
                            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em]">Corridor Distribution</h3>
                        </div>
                        <div className="text-[10px] text-slate-700 font-mono font-black uppercase">
                            Nodes Active: {userState.pipeline?.length || 0}
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-center space-y-6">
                        {stats.distribution.map((item, i) => (
                            <div key={item.name} className="space-y-2">
                                <div className="flex justify-between text-[10px] font-mono font-black uppercase tracking-widest">
                                    <span className="text-slate-500">{item.name}</span>
                                    <span className="text-white">${(item.value / 1000).toFixed(0)}K</span>
                                </div>
                                <div className="h-4 bg-slate-900 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${i === 0 ? 'bg-emerald-500' : i === 1 ? 'bg-[#00E5FF]' : 'bg-[#D4AF37]'
                                            }`}
                                        style={{ width: `${Math.min(100, (item.value / tempTarget) * 100)}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Intelligence */}
                <div className="col-span-3 glass-panel p-10 rounded-[3.5rem] border border-[#00E5FF]/20 bg-[#00E5FF]/5 h-[520px] flex flex-col justify-between group">
                    <div>
                        <div className="flex justify-between items-center mb-10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-[#00E5FF]/30 rounded-xl">
                                    <Zap size={22} className="text-[#00E5FF] fill-[#00E5FF]" />
                                </div>
                                <h3 className="text-[11px] font-black text-[#00E5FF] uppercase tracking-[0.6em]">Nexus Signal</h3>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-3">
                                <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">
                                    <span>Path to Sovereignty</span>
                                    <span className="text-[#00E5FF]">
                                        {Math.min(100, ((stats.weightedValue / tempTarget) * 100)).toFixed(1)}%
                                    </span>
                                </div>
                                <div className="h-5 w-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 p-1 shadow-inner">
                                    <div
                                        className="h-full bg-gradient-to-r from-cyan-600 via-[#00E5FF] to-cyan-400 rounded-xl shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all duration-1000"
                                        style={{ width: `${Math.min(100, (stats.weightedValue / tempTarget) * 100)}%` }}
                                    />
                                </div>
                            </div>

                            <div className="p-8 bg-black/60 rounded-[2.5rem] border border-slate-800 space-y-6 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform">
                                    <Sparkles size={80} />
                                </div>
                                <div className="text-[10px] text-[#D4AF37] font-black uppercase mb-2 flex items-center gap-3 relative z-10">
                                    <Activity size={16} className="text-[#D4AF37] animate-pulse" /> Strategic Synthesis
                                </div>
                                <p className="text-[13px] text-slate-300 font-mono leading-relaxed uppercase tracking-tighter italic relative z-10">
                                    Neural analysis detects a ${(gapToGoal / 1000).toFixed(0)}K corridor gap.
                                    <br /><br />
                                    <span className="text-[#00E5FF] font-black">AI Command:</span> Deploy Agent::Social to capture emerging demand signals.
                                </p>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-900/30 rounded-2xl border border-slate-800/50">
                                <div className="flex items-center gap-3">
                                    <Timer size={16} className="text-orange-500" />
                                    <span className="text-[10px] font-mono font-black text-white uppercase">Consistency</span>
                                </div>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5, 6, 7].map(i => (
                                        <div
                                            key={i}
                                            className={`w-2 h-2 rounded-full ${i <= 6 ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]' : 'bg-slate-800'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setView(AppView.PIPELINE)}
                        className="w-full py-6 bg-[#00E5FF] text-black font-black rounded-3xl text-[12px] tracking-[0.4em] uppercase hover:bg-cyan-400 transition-all shadow-[0_0_50px_rgba(0,229,255,0.4)] flex items-center justify-center gap-3 group/btn hover:scale-105 active:scale-95"
                    >
                        Engage Revenue Ops <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

            {/* FOOTER WIDGETS */}
            <div className="grid grid-cols-3 gap-8 pb-16">
                <div className="glass-panel p-10 rounded-[3rem] border border-slate-800 h-[280px] flex flex-col justify-between hover:border-[#D4AF37] transition-all group overflow-hidden relative">
                    <div className="absolute -bottom-10 -right-10 opacity-5 text-[#D4AF37] group-hover:scale-110 transition-transform duration-1000">
                        <Award size={180} />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-4 mb-10 group-hover:text-[#D4AF37] transition-colors">
                            <Award size={18} className="text-[#D4AF37]" /> Identity Fidelity
                        </h3>
                        <div className="space-y-5">
                            <div className="flex justify-between items-center text-[11px] font-mono font-black uppercase tracking-widest">
                                <span className="text-slate-500">Neural Depth (L22)</span>
                                <span className="text-white">94.2%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden p-0.5">
                                <div className="h-full bg-gradient-to-r from-amber-600 to-[#D4AF37] rounded-full shadow-[0_0_15px_rgba(212,175,55,0.4)]" style={{ width: '94%' }}></div>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setView(AppView.KNOWLEDGE)}
                        className="w-full py-5 bg-slate-950 hover:bg-slate-900 text-[#D4AF37] font-black rounded-2xl text-[11px] tracking-[0.4em] uppercase transition-all border border-[#D4AF37]/20 relative z-10 group-hover:bg-[#D4AF37] group-hover:text-black"
                    >
                        Neural Core Sync
                    </button>
                </div>

                <div className="glass-panel p-10 rounded-[3rem] border border-slate-800 h-[280px] flex flex-col justify-between hover:border-[#00E5FF] transition-all group overflow-hidden relative">
                    <div className="absolute -bottom-10 -right-10 opacity-5 text-[#00E5FF] group-hover:scale-110 transition-transform duration-1000">
                        <Bot size={180} />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-4 mb-10 group-hover:text-[#00E5FF] transition-colors">
                            <Bot size={18} className="text-[#00E5FF]" /> Autonomous Units
                        </h3>
                        <div className="space-y-4">
                            {userState.agents?.slice(0, 2).map(a => (
                                <div key={a.id} className="flex justify-between items-center p-4 bg-slate-900/50 rounded-2xl border border-slate-800/50 backdrop-blur-md">
                                    <span className="text-[11px] font-mono font-black text-white uppercase tracking-tight">{a.name}</span>
                                    <span className="text-[9px] font-mono text-emerald-500 uppercase font-black px-3 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                                        {a.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={() => setView(AppView.AGENTS)}
                        className="w-full py-5 bg-slate-950 hover:bg-slate-900 text-[#00E5FF] font-black rounded-2xl text-[11px] tracking-[0.4em] uppercase transition-all border border-[#00E5FF]/20 relative z-10 group-hover:bg-[#00E5FF] group-hover:text-black"
                    >
                        Agent Command Hub
                    </button>
                </div>

                <div className="glass-panel p-10 rounded-[3rem] border border-slate-800 h-[280px] flex flex-col justify-between hover:border-emerald-500 transition-all group overflow-hidden relative">
                    <div className="absolute -bottom-10 -right-10 opacity-5 text-emerald-500 group-hover:scale-110 transition-transform duration-1000">
                        <LayoutGrid size={180} />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-4 mb-10 group-hover:text-emerald-500 transition-colors">
                            <Briefcase size={18} className="text-emerald-500" /> Pipeline Integrity
                        </h3>
                        <div className="space-y-5">
                            <div className="flex justify-between items-center text-[11px] font-mono font-black uppercase tracking-widest">
                                <span className="text-slate-500">Operational Nodes</span>
                                <span className="text-white">{userState.pipeline?.length || 0} Assets</span>
                            </div>
                            <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden p-0.5">
                                <div
                                    className="h-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)] rounded-full"
                                    style={{ width: `${Math.min(100, (userState.pipeline?.length || 0) * 15)}%` }}
                                />
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setView(AppView.NETWORK)}
                        className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-2xl text-[11px] tracking-[0.4em] uppercase transition-all shadow-[0_0_40px_rgba(16,185,129,0.3)] relative z-10 hover:scale-105 active:scale-95"
                    >
                        Identity Database
                    </button>
                </div>
            </div>
        </div>
    );
};
