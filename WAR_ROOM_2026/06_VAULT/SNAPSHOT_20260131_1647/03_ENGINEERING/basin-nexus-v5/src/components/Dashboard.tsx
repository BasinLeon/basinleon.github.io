
import React, { useState, useEffect } from 'react';
import { AppMode } from '../types';

interface DashboardProps {
    setMode: (mode: AppMode) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setMode }) => {
    const [timeLeft, setTimeLeft] = useState("");

    // War Room Countdown (Jan 31, 2026)
    useEffect(() => {
        const targetDate = new Date('2026-01-31T00:00:00').getTime();
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            setTimeLeft(`${days} DAYS TO TARGET`);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const MetricCard = ({ label, value, sub, color }: any) => (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-slate-600 transition-colors group cursor-default">
            <div className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-2 group-hover:text-slate-400">{label}</div>
            <div className={`text-4xl font-mono mb-2 ${color} font-bold`}>{value}</div>
            <div className="text-xs text-slate-500 font-mono">{sub}</div>
        </div>
    );

    return (
        <div className="flex h-full flex-col p-8 bg-slate-950 font-sans overflow-y-auto custom-scrollbar">
            {/* Top Bar */}
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-1">
                        Basin<span className="text-[#D4AF37]">::</span>Nexus <span className="text-xs align-top bg-[#D4AF37] text-black px-1 rounded ml-1">V5.2</span>
                    </h1>
                    <div className="text-xs text-slate-500 font-mono uppercase tracking-widest">Ecosystem Owner // War Room Active</div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-mono text-red-500 font-bold animate-pulse">{timeLeft}</div>
                    <div className="text-[10px] text-red-900 uppercase font-black tracking-[0.3em]">Mission Clock</div>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-4 gap-6 mb-10">
                <MetricCard label="Pipeline Velocity" value="160%" sub="+24% vs Target (Fudo)" color="text-emerald-400" />
                <MetricCard label="Pipeline Generated" value="$11M" sub="At Sense (Social Selling)" color="text-cyan-400" />
                <MetricCard label="Active Deals" value="5" sub="SnapMagic, Aikido, Verkada..." color="text-[#D4AF37]" />
                <MetricCard label="System Status" value="ONLINE" sub="All Modules Operational" color="text-white" />
            </div>

            {/* Modules (Visual Navigation) */}
            <div className="flex-1 grid grid-cols-2 gap-6">
                <div
                    onClick={() => setMode(AppMode.PIPELINE)}
                    className="group glass-panel rounded-3xl border border-slate-800 bg-slate-900/20 p-8 relative overflow-hidden cursor-pointer hover:bg-slate-900/40 transition-all hover:scale-[1.01]"
                >
                    <div className="absolute top-0 right-0 p-32 bg-cyan-500/5 rounded-full blur-3xl group-hover:bg-cyan-500/10 transition-colors"></div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2 z-10 relative">Pipeline Tracker</h3>
                    <p className="text-sm text-slate-500 font-mono mb-6 max-w-sm z-10 relative">Manage job applications with Kanban visualization. Forecast value and track stage velocity.</p>
                    <div className="text-cyan-400 font-mono text-xs uppercase tracking-widest flex items-center gap-2">
                        View Board <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                </div>

                <div
                    onClick={() => setMode(AppMode.DOJO)}
                    className="group glass-panel rounded-3xl border border-slate-800 bg-slate-900/20 p-8 relative overflow-hidden cursor-pointer hover:bg-slate-900/40 transition-all hover:scale-[1.01]"
                >
                    <div className="absolute top-0 right-0 p-32 bg-[#D4AF37]/5 rounded-full blur-3xl group-hover:bg-[#D4AF37]/10 transition-colors"></div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2 z-10 relative">The Dojo</h3>
                    <p className="text-sm text-slate-500 font-mono mb-6 max-w-sm z-10 relative">Adversarial interview simulation with real-time audio analysis and heuristic scoring.</p>
                    <div className="text-[#D4AF37] font-mono text-xs uppercase tracking-widest flex items-center gap-2">
                        Enter Simulation <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                </div>

                <div
                    onClick={() => setMode(AppMode.NETWORK)}
                    className="group glass-panel rounded-3xl border border-slate-800 bg-slate-900/20 p-8 relative overflow-hidden cursor-pointer hover:bg-slate-900/40 transition-all hover:scale-[1.01]"
                >
                    <div className="absolute top-0 right-0 p-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors"></div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2 z-10 relative">Network CRM</h3>
                    <p className="text-sm text-slate-500 font-mono mb-6 max-w-sm z-10 relative">Relationship tracking and 'Content Factory' for viral LinkedIn generation.</p>
                    <div className="text-emerald-400 font-mono text-xs uppercase tracking-widest flex items-center gap-2">
                        Open Database <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                </div>

                <div
                    onClick={() => setMode(AppMode.HUNT)}
                    className="group glass-panel rounded-3xl border border-slate-800 bg-slate-900/20 p-8 relative overflow-hidden cursor-pointer hover:bg-slate-900/40 transition-all hover:scale-[1.01]"
                >
                    <div className="absolute top-0 right-0 p-32 bg-red-500/5 rounded-full blur-3xl group-hover:bg-red-500/10 transition-colors"></div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2 z-10 relative">Sniper Scope</h3>
                    <p className="text-sm text-slate-500 font-mono mb-6 max-w-sm z-10 relative">JD analysis against Leon's resume. Gap detection and value proposition drafting.</p>
                    <div className="text-red-500 font-mono text-xs uppercase tracking-widest flex items-center gap-2">
                        Acquire Target <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
