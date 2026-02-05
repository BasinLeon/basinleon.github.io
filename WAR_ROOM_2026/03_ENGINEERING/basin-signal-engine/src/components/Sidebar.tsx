import React from 'react';
import { AppView, UserState } from '../types';
import {
    LayoutDashboard,
    Target,
    Users,
    Sword,
    Brain,
    Bot,
    Database,
    Sparkles,
    Settings,
    Zap
} from 'lucide-react';

interface SidebarProps {
    currentView: AppView;
    setView: (view: AppView) => void;
    userState: UserState;
}

const navItems = [
    { view: AppView.DASHBOARD, icon: LayoutDashboard, label: 'War Room' },
    { view: AppView.PIPELINE, icon: Target, label: 'Pipeline' },
    { view: AppView.NETWORK, icon: Users, label: 'Network' },
    { view: AppView.DOJO, icon: Sword, label: 'Dojo' },
    { view: AppView.KNOWLEDGE, icon: Brain, label: 'Identity' },
    { view: AppView.AGENTS, icon: Bot, label: 'Agents' },
    { view: AppView.VAULT, icon: Database, label: 'Vault' },
    { view: AppView.STUDIO, icon: Sparkles, label: 'Studio' },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, userState }) => {
    return (
        <div className="w-24 bg-black/40 border-r border-slate-800/50 flex flex-col items-center py-8 backdrop-blur-xl">
            {/* Logo */}
            <div className="mb-12">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-amber-600 flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
                    <Zap size={28} className="text-black" strokeWidth={3} />
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 flex flex-col gap-3 w-full px-3">
                {navItems.map(({ view, icon: Icon, label }) => {
                    const isActive = currentView === view;
                    return (
                        <button
                            key={view}
                            onClick={() => setView(view)}
                            className={`group relative w-full aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 transition-all ${isActive
                                    ? 'bg-[#D4AF37]/20 text-[#D4AF37] shadow-lg shadow-[#D4AF37]/10'
                                    : 'text-slate-600 hover:text-slate-400 hover:bg-slate-900/50'
                                }`}
                            title={label}
                        >
                            <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[8px] font-black uppercase tracking-wider">{label}</span>

                            {/* Active indicator */}
                            {isActive && (
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#D4AF37] rounded-l-full" />
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* XP Display */}
            <div className="mt-auto pt-8 text-center">
                <div className="text-[9px] text-slate-600 font-mono uppercase tracking-widest mb-1">Level</div>
                <div className="text-2xl font-black text-[#D4AF37]">{userState.level}</div>
                <div className="mt-2 w-12 h-1 bg-slate-900 rounded-full overflow-hidden mx-auto">
                    <div
                        className="h-full bg-[#D4AF37] rounded-full"
                        style={{ width: `${(userState.xp % 1000) / 10}%` }}
                    />
                </div>
            </div>

            {/* Settings */}
            <button
                onClick={() => setView(AppView.SETTINGS)}
                className={`mt-6 p-3 rounded-xl transition-all ${currentView === AppView.SETTINGS
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-700 hover:text-slate-400'
                    }`}
            >
                <Settings size={20} />
            </button>
        </div>
    );
};
