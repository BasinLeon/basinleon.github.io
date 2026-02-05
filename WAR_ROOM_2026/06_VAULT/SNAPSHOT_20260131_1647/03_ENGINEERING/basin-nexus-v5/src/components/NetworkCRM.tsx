
import React, { useState } from 'react';
import { generateResponse } from '../services/geminiService';
import { AppMode, Contact } from '../types';

const MOCK_CONTACTS: Contact[] = [
    { id: '1', name: 'Samuel Burns', role: 'Hiring Manager', company: 'DepthFirst', stage: 'Hot', lastTouch: '2 days ago', nextStep: 'Wait for Cyrus intro', notes: 'Referred to CRO' },
    { id: '2', name: 'Kyu Kim', role: 'Founder', company: 'Spray.io', stage: 'Hot', lastTouch: 'Yesterday', nextStep: 'Follow up on micro-contract', notes: 'Founder conversation done' },
    { id: '3', name: 'Asaph Wutawunashe', role: 'Chairman', company: 'FYM Africa', stage: 'Champion', lastTouch: '1 week ago', nextStep: 'Deliver 2-page GTM system', notes: 'Partner-track' },
    { id: '4', name: 'Karan Shah', role: 'Founder', company: 'SolveJet', stage: 'Warm', lastTouch: '3 days ago', nextStep: 'Review GTM proposal', notes: 'In evaluation' },
    { id: '5', name: 'Dennis O.', role: 'Growth Lead', company: 'ServiceUp', stage: 'Warm', lastTouch: '1 week ago', nextStep: 'SCU connection check-in', notes: 'Referral contact' }
];

const NetworkCRM: React.FC = () => {
    const [viewMode, setViewMode] = useState<'LIST' | 'KANBAN'>('KANBAN');
    const [contacts, setContacts] = useState<Contact[]>(MOCK_CONTACTS);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [contentDraft, setContentDraft] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerateContent = async (contact: Contact) => {
        setIsGenerating(true);
        const prompt = `Generate a viral LinkedIn post about my conversation with ${contact.name} (${contact.role} at ${contact.company}). Context: ${contact.notes}. Voice: "The Builder".`;
        const response = await generateResponse(prompt, AppMode.NETWORK);
        setContentDraft(response);
        setIsGenerating(false);
    };

    const StatusBadge = ({ stage }: { stage: string }) => {
        const colors: Record<string, string> = {
            'Cold': 'bg-slate-700 text-slate-300',
            'Warm': 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
            'Hot': 'bg-red-500/20 text-red-300 border border-red-500/30',
            'Champion': 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
        };
        return (
            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-black tracking-widest ${colors[stage] || colors['Cold']}`}>
                {stage}
            </span>
        );
    };

    return (
        <div className="flex h-full gap-6 p-6 bg-slate-950 font-sans overflow-hidden">
            {/* Main Content */}
            <div className="flex-1 flex flex-col gap-6">

                {/* Header / Controls */}
                <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                    <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                        <span className="text-[#D4AF37]">🌐</span> Network CRM
                    </h2>
                    <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800">
                        <button
                            onClick={() => setViewMode('LIST')}
                            className={`px-4 py-2 rounded-md text-[10px] uppercase font-bold transition-colors ${viewMode === 'LIST' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            List View
                        </button>
                        <button
                            onClick={() => setViewMode('KANBAN')}
                            className={`px-4 py-2 rounded-md text-[10px] uppercase font-bold transition-colors ${viewMode === 'KANBAN' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            Kanban
                        </button>
                    </div>
                </div>

                {/* Database View */}
                <div className="flex-1 glass-panel rounded-2xl border border-slate-800 overflow-hidden relative">
                    {viewMode === 'LIST' ? (
                        <div className="overflow-y-auto h-full p-4">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-900/50 text-[10px] uppercase text-slate-500 font-black tracking-widest sticky top-0">
                                    <tr>
                                        <th className="p-4 rounded-tl-xl">Name</th>
                                        <th className="p-4">Role / Company</th>
                                        <th className="p-4">Stage</th>
                                        <th className="p-4">Last Touch</th>
                                        <th className="p-4 rounded-tr-xl">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm divide-y divide-slate-800/50">
                                    {contacts.map(c => (
                                        <tr key={c.id} className="hover:bg-slate-900/30 transition-colors group cursor-pointer" onClick={() => setSelectedContact(c)}>
                                            <td className="p-4 font-bold text-white group-hover:text-[#D4AF37] transition-colors">{c.name}</td>
                                            <td className="p-4 text-slate-400">{c.role} @ <span className="text-slate-300">{c.company}</span></td>
                                            <td className="p-4"><StatusBadge stage={c.stage} /></td>
                                            <td className="p-4 text-slate-500 font-mono text-xs">{c.lastTouch}</td>
                                            <td className="p-4">
                                                <button className="text-[10px] bg-slate-800 hover:bg-slate-700 text-white px-3 py-1 rounded transition-colors uppercase tracking-wider">
                                                    Activate
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="h-full overflow-x-auto p-6 flex gap-6">
                            {['Cold', 'Warm', 'Hot', 'Champion'].map(stage => (
                                <div key={stage} className="min-w-[280px] bg-slate-900/30 rounded-xl flex flex-col border border-slate-800/50 h-full">
                                    <div className="p-4 border-b border-slate-800/50 flex justify-between items-center">
                                        <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">{stage}</span>
                                        <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-500">
                                            {contacts.filter(c => c.stage === stage).length}
                                        </span>
                                    </div>
                                    <div className="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                                        {contacts.filter(c => c.stage === stage).map(c => (
                                            <div
                                                key={c.id}
                                                onClick={() => setSelectedContact(c)}
                                                className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-[#D4AF37]/50 cursor-pointer transition-all hover:translate-y-[-2px] hover:shadow-lg shadow-black/50 group"
                                            >
                                                <div className="font-bold text-slate-200 mb-1 group-hover:text-[#D4AF37] transition-colors">{c.name}</div>
                                                <div className="text-xs text-slate-500 mb-3">{c.role} @ {c.company}</div>
                                                <div className="text-[10px] text-slate-600 bg-slate-900 inline-block px-2 py-1 rounded border border-slate-800">
                                                    Example: {c.nextStep}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Panel: Content Factory */}
            <div className="w-[400px] glass-panel rounded-2xl border border-slate-800 bg-black flex flex-col">
                <div className="p-6 border-b border-slate-800">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                        <span className="text-cyan-400">⚡</span> Content Factory
                    </h3>
                </div>

                {selectedContact ? (
                    <div className="flex-1 p-6 flex flex-col gap-6">
                        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                            <div className="text-[10px] uppercase text-slate-500 font-bold mb-2">Subject</div>
                            <div className="font-bold text-white text-lg">{selectedContact.name}</div>
                            <div className="text-xs text-slate-400">{selectedContact.role} @ {selectedContact.company}</div>
                        </div>

                        <div className="flex-1 bg-slate-950 rounded-xl border border-slate-800 p-4 font-mono text-xs text-slate-300 leading-relaxed overflow-y-auto whitespace-pre-wrap">
                            {contentDraft || (
                                <div className="h-full flex flex-col items-center justify-center opacity-30 text-center">
                                    <div className="mb-2">⚠️</div>
                                    <div>No content generated</div>
                                    <div className="text-[10px] mt-2">Select a contact to generate viral LinkedIn/X posts</div>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => handleGenerateContent(selectedContact)}
                            disabled={isGenerating}
                            className="bg-[#D4AF37] text-black w-full py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isGenerating ? 'Processing Signal...' : 'Generate Content'}
                        </button>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center opacity-20 p-8 text-center">
                        <div className="text-4xl mb-4">👆</div>
                        <div className="text-sm font-mono uppercase tracking-widest">Select a contact from the grid</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NetworkCRM;
