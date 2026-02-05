
import React from 'react';
import { AppMode } from '../types';

interface SidebarProps {
    currentMode: AppMode;
    setMode: (mode: AppMode) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentMode, setMode }) => {
    const navItems = [
        { mode: AppMode.DASHBOARD, label: 'Command Center', icon: '⚡' },
        { mode: AppMode.DOJO, label: 'The Dojo', icon: '🥋' },
        { mode: AppMode.PIPELINE, label: 'Pipeline Tracker', icon: '📈' },
        { mode: AppMode.NETWORK, label: 'Network CRM', icon: '🌐' },
        { mode: AppMode.HUNT, label: 'Sniper Scope', icon: '🎯' },
    ];

    return (
        <div className="w-64 glass-panel border-r border-slate-800 flex flex-col bg-black/80 backdrop-blur-xl">
            {/* Logo Area */}
            <div className="p-8 border-b border-slate-800/50">
                <div className="text-2xl font-black text-white tracking-tighter uppercase mb-1">
                    Basin<span className="text-[#D4AF37]">::</span>Nexus
                </div>
                <div className="text-[10px] font-mono text-slate-500 tracking-[0.2em] uppercase">V5.2 Ecosystem Owner</div>
            </div>

            {/* Navigation */}
            <div className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map(item => (
                    <button
                        key={item.mode}
                        onClick={() => setMode(item.mode)}
                        className={`w-full text-left p-4 rounded-xl transition-all border flex items-center gap-4 group ${currentMode === item.mode
                                ? 'bg-slate-900 border-[#D4AF37]/50 text-white shadow-[#D4AF37]/20 shadow-lg'
                                : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-900/50 hover:text-slate-300'
                            }`}
                    >
                        <span className={`text-lg transition-transform group-hover:scale-110 ${currentMode === item.mode ? 'scale-110' : ''}`}>{item.icon}</span>
                        <div className="flex-1">
                            <div className={`text-xs font-black uppercase tracking-widest ${currentMode === item.mode ? 'text-[#D4AF37]' : ''}`}>{item.label}</div>
                        </div>
                        {currentMode === item.mode && (
                            <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse"></div>
                        )}
                    </button>
                ))}
            </div>

            {/* Footer / Status */}
            <div className="p-6 border-t border-slate-800/50">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <div className="text-[10px] font-mono uppercase text-slate-500 tracking-widest">System Online</div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
