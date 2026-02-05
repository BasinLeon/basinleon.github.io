
import React from 'react';
import { AppMode, AVAILABLE_MODELS, ModelProvider } from '../types';

interface SidebarProps {
    currentMode: AppMode;
    setMode: (mode: AppMode) => void;
    selectedModel: string;
    setSelectedModel: (model: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentMode, setMode, selectedModel, setSelectedModel }) => {
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
                <div className="text-[10px] font-mono text-slate-500 tracking-[0.2em] uppercase">V6 Sovereign Engine</div>
            </div>

            {/* Navigation */}
            <div className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
                <div className="px-3 mb-6">
                    <div className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em] mb-3 flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-[#D4AF37]"></div>
                        Neural Link Protocol
                    </div>
                    <div className="relative group">
                        <select 
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            className="w-full bg-slate-900/80 border border-slate-800/50 rounded-xl p-3 text-[10px] text-slate-300 font-mono focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/20 outline-none transition-all appearance-none cursor-pointer group-hover:border-slate-700/50"
                            style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23D4AF37\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '12px'}}
                        >
                            {AVAILABLE_MODELS.map(model => (
                                <option key={model.id} value={model.id} className="bg-slate-950 text-slate-300">
                                    {model.label} {model.provider === ModelProvider.OLLAMA ? ' (LOCAL)' : ''}
                                </option>
                            ))}
                        </select>
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#D4AF37] rounded-full blur-[2px] opacity-0 group-hover:opacity-50 transition-opacity"></div>
                    </div>
                </div>

                <div className="px-3 mb-2 text-[9px] font-black uppercase text-slate-600 tracking-[0.2em]">Command Area</div>
                {navItems.map(item => (
                    <button
                        key={item.mode}
                        onClick={() => setMode(item.mode)}
                        className={`w-full text-left p-3 rounded-xl transition-all border flex items-center gap-3 group ${currentMode === item.mode
                                ? 'bg-slate-900 border-[#D4AF37]/30 text-white shadow-[#D4AF37]/5 shadow-lg'
                                : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-900/50 hover:text-slate-300'
                            }`}
                    >
                        <span className={`text-base transition-transform group-hover:scale-110 ${currentMode === item.mode ? 'scale-110' : ''}`}>{item.icon}</span>
                        <div className="flex-1">
                            <div className={`text-[10px] font-black uppercase tracking-widest ${currentMode === item.mode ? 'text-[#D4AF37]' : ''}`}>{item.label}</div>
                        </div>
                        {currentMode === item.mode && (
                            <div className="w-1 h-1 rounded-full bg-[#D4AF37] animate-pulse"></div>
                        )}
                    </button>
                ))}

                <div className="pt-6 px-3 mb-2 text-[9px] font-black uppercase text-slate-600 tracking-[0.2em]">Refinery Segments</div>
                <div className="space-y-1">
                    {['Salesforce Ops', 'HubSpot Users', 'Founder List', 'LinkedIn Dumps'].map(segment => (
                        <button key={segment} className="w-full text-left px-3 py-2 rounded-lg text-[10px] text-slate-500 hover:text-gold-400 hover:bg-slate-900/50 transition-all font-mono">
                            # {segment}
                        </button>
                    ))}
                </div>
            </div>

            {/* Sovereignty Score */}
            <div className="p-6 border-t border-slate-800/50">
                <div className="flex justify-between items-end mb-2">
                    <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Sovereignty</div>
                    <div className="text-xs font-mono text-gold-500">12%</div>
                </div>
                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gold-400" style={{ width: '12%' }}></div>
                </div>
            </div>

            {/* Footer / Status */}
            <div className="p-6 border-t border-slate-800/50 bg-slate-950/50">
                <div className="flex items-center gap-3">
                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${AVAILABLE_MODELS.find(m => m.id === selectedModel)?.provider === ModelProvider.OLLAMA ? 'bg-cyan-500' : 'bg-emerald-500'}`}></div>
                    <div className="text-[9px] font-mono uppercase text-slate-500 tracking-widest">
                        Node: {AVAILABLE_MODELS.find(m => m.id === selectedModel)?.provider === ModelProvider.OLLAMA ? 'LOCAL HOST' : 'CLOUD UPLINK'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
