
import React, { useState } from 'react';
import { AppMode } from '../types';
import { LEADS_DATA } from '../leadsData';

const NetworkCRM: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedLead, setSelectedLead] = useState<any>(null);

    const filteredLeads = LEADS_DATA.filter((l: any) => 
        l['Full Name'].toLowerCase().includes(searchTerm.toLowerCase()) ||
        l['Company'].toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 100);

    const StatusBadge = ({ score }: { score: number }) => {
        let color = 'bg-slate-800 text-slate-500';
        if(score >= 80) color = 'bg-gold-500/10 text-gold-400 border border-gold-500/20';
        else if(score >= 50) color = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
        
        return (
            <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-black tracking-widest ${color}`}>
                {score >= 80 ? 'High Priority' : 'Signal: ' + score}
            </span>
        );
    };

    return (
        <div className="flex h-full gap-6 p-6 bg-slate-950 font-sans overflow-hidden">
            {/* Main Content: Feed */}
            <div className="flex-1 flex flex-col gap-6 overflow-hidden">
                <div className="flex justify-between items-center bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                    <div>
                        <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                            <span className="text-[#D4AF37]">📡</span> Sovereign Signal Feed
                        </h2>
                        <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase tracking-widest">Real-time enrichment from Basin::Refinery</p>
                    </div>
                    <div className="relative group w-64">
                         <div className="absolute -inset-0.5 bg-gradient-to-r from-gold-500/20 to-purple-600/20 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                         <input 
                            type="text" 
                            placeholder="Filter signals..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="relative w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-gold-500/50"
                         />
                    </div>
                </div>

                <div className="flex-1 bg-slate-900/20 rounded-2xl border border-slate-800/50 overflow-y-auto custom-scrollbar p-4 space-y-3">
                    {filteredLeads.map((lead: any, idx) => (
                        <div 
                            key={idx}
                            onClick={() => setSelectedLead(lead)}
                            className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer group ${selectedLead === lead ? 'bg-slate-800 border-gold-500/30' : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'}`}
                        >
                            <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center font-bold text-slate-400 border border-white/5">
                                {lead['Full Name']?.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-bold text-slate-200 group-hover:text-gold-400 transition-colors">{lead['Full Name']}</h4>
                                    <StatusBadge score={parseInt(lead['GTM Score']) || 10} />
                                </div>
                                <p className="text-xs text-slate-500 truncate">{lead['Title']} @ {lead['Company']}</p>
                            </div>
                            {lead['Tech Stack'] && (
                                <div className="hidden md:flex gap-2">
                                    <span className="text-[9px] font-mono text-slate-600 border border-slate-800 px-2 py-0.5 rounded italic">
                                        {lead['Tech Stack'].split(',')[0]}
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Panel: Detail view (War Room) */}
            <div className="w-[450px] glass-panel rounded-2xl border border-slate-800 bg-black flex flex-col overflow-hidden">
                {selectedLead ? (
                    <div className="flex-1 flex flex-col">
                        <div className="p-8 border-b border-slate-800 bg-gradient-to-b from-slate-900 to-black text-center">
                            <div className="w-20 h-20 rounded-full bg-slate-900 border-2 border-gold-500/20 mx-auto mb-4 flex items-center justify-center text-2xl font-black text-gold-400 shadow-2xl">
                                {selectedLead['Full Name']?.charAt(0)}
                            </div>
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter">{selectedLead['Full Name']}</h3>
                            <p className="text-xs text-gold-500 font-mono mt-1 uppercase tracking-widest">{selectedLead['Company']}</p>
                        </div>
                        
                        <div className="flex-1 p-8 space-y-8 overflow-y-auto custom-scrollbar">
                            <div className="space-y-4">
                                <h4 className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em] border-b border-slate-800 pb-2">Technical Audit</h4>
                                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800 text-xs text-slate-300 leading-relaxed italic">
                                    "{selectedLead['Nexus Pitch'] || 'No signal data found. Initializing discovery...'}"
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em] border-b border-slate-800 pb-2">Target Profile</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-900">
                                        <div className="text-[8px] text-slate-600 uppercase font-black mb-1">Industry</div>
                                        <div className="text-xs text-slate-400">{selectedLead['Industry'] || 'Unknown'}</div>
                                    </div>
                                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-900">
                                        <div className="text-[8px] text-slate-600 uppercase font-black mb-1">Tech Stack</div>
                                        <div className="text-xs text-slate-400 truncate">{selectedLead['Tech Stack'] || 'Legacy'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-900/20 border-t border-slate-800 space-y-3">
                            <button 
                                onClick={() => {
                                    navigator.clipboard.writeText(selectedLead['Nexus Pitch'] || "");
                                    alert("Pitch copied to clipboard.");
                                }}
                                className="w-full bg-gold-400 text-black py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                            >
                                Copy Sovereign Pitch
                            </button>
                            <button className="w-full bg-slate-800 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-slate-700 transition-all">
                                Enrich Signal
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-30">
                        <div className="text-6xl mb-6">🛰️</div>
                        <h3 className="text-sm font-mono uppercase tracking-[0.4em] text-white">Awaiting Signal Selection</h3>
                        <p className="text-[10px] text-slate-500 mt-4 max-w-[200px] leading-relaxed">Select a high-value signal from the feed to initiate the technical audit war room.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NetworkCRM;
