import React, { useState, useMemo } from 'react';
import { UserState, Contact, JobDeal, AppView } from '../types';
import {
    Users, Search, UploadCloud,
    Phone, Plus, X,
    Brain, Activity, Fingerprint, ShieldCheck,
    Zap, Flame
} from 'lucide-react';

interface NetworkCRMProps {
    userState: UserState;
    onUpdateContacts: (contacts: Contact[]) => void;
    onSimulateCall: (contact: Contact) => void;
    addNotification: (type: 'SUCCESS' | 'ERROR' | 'INFO' | 'WARNING', msg: string, sub?: string) => void;
}

export const NetworkCRM: React.FC<NetworkCRMProps> = ({
    userState,
    onUpdateContacts,
    onSimulateCall,
    addNotification
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newContact, setNewContact] = useState<Partial<Contact>>({
        name: '', role: '', company: '', intent: 'LOW', signalScore: 5,
        securityTier: 'T1_OPERATOR', pamRole: 'CHAMPION'
    });

    const filteredContacts = useMemo(() => {
        return userState.contacts.filter(c =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.role.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [userState.contacts, searchTerm]);

    const handleAddNode = () => {
        if (!newContact.name || !newContact.company) {
            addNotification('ERROR', 'Validation Failed', 'Name and Company are mandatory fields.');
            return;
        }
        const node: Contact = {
            id: `node-${Date.now()}`,
            name: newContact.name!,
            role: newContact.role || 'GTM Asset',
            company: newContact.company!,
            lastContact: new Date().toISOString().split('T')[0],
            resurfaceInDays: 7,
            signalScore: newContact.signalScore || 5,
            notes: newContact.notes || 'Identity shard initialized via Sovereign Command.',
            intent: newContact.intent || 'LOW',
            verifiedEmail: newContact.verifiedEmail,
            triggers: [],
            securityTier: newContact.securityTier,
            pamRole: newContact.pamRole
        };
        onUpdateContacts([...userState.contacts, node]);
        addNotification('SUCCESS', 'Neural Node Synchronized', `${node.name} established.`);
        setShowAddModal(false);
        setNewContact({ name: '', role: '', company: '', intent: 'LOW', signalScore: 5 });
    };

    return (
        <div className="p-8 h-full flex flex-col bg-[#020617] relative animate-in fade-in duration-700">

            <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-5xl font-black text-white flex items-center gap-5 leading-none">
                        <Fingerprint className="text-[#00E5FF] animate-pulse" size={40} />
                        Identity <span className="text-[#00E5FF]">Constellation</span>
                    </h2>
                    <p className="text-[10px] text-slate-500 font-mono uppercase mt-2 tracking-[0.5em] font-black italic">
                        Network Intelligence // Executive PAM v7.2
                    </p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => addNotification('INFO', 'Quantum Ingest', 'Feature coming soon...')}
                        className="bg-slate-900 border border-slate-700 hover:border-[#00E5FF] text-slate-400 hover:text-white px-6 py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase flex items-center gap-3 transition-all"
                    >
                        <UploadCloud size={16} /> Quantum Ingest
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-[#D4AF37] hover:bg-yellow-500 text-black px-8 py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase flex items-center gap-3 transition-all shadow-[0_0_30px_rgba(212,175,55,0.2)]"
                    >
                        <Plus size={18} strokeWidth={3} /> Initialize Node
                    </button>
                </div>
            </div>

            <div className="flex-1 flex gap-8 overflow-hidden">
                <div className="flex-1 glass-panel rounded-3xl border border-slate-800 flex flex-col overflow-hidden shadow-2xl bg-black/40">
                    <div className="p-6 border-b border-slate-800/50 flex items-center gap-4 bg-slate-900/30 backdrop-blur-md">
                        <Search size={18} className="text-slate-600" />
                        <input
                            className="bg-transparent border-none focus:outline-none text-sm text-slate-200 w-full font-mono placeholder:text-slate-800 uppercase tracking-widest font-bold"
                            placeholder="QUERY NEURAL DATABASE..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-900/80 sticky top-0 text-[9px] uppercase font-black font-mono text-slate-500 z-10 backdrop-blur-md tracking-[0.2em]">
                                <tr>
                                    <th className="p-6 border-b border-slate-800/50">Security_Lvl</th>
                                    <th className="p-6 border-b border-slate-800/50">Identity_Asset</th>
                                    <th className="p-6 border-b border-slate-800/50">Operational_Entity</th>
                                    <th className="p-6 border-b border-slate-800/50">Link_Status</th>
                                    <th className="p-6 border-b border-slate-800/50 text-right">Ops</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredContacts.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-32 text-center">
                                            <div className="flex flex-col items-center gap-6 opacity-20">
                                                <Activity size={64} className="text-slate-600 animate-pulse" />
                                                <p className="font-mono text-xs uppercase tracking-[0.5em] font-black">
                                                    Database Empty // System Standby
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredContacts.map(contact => (
                                    <tr
                                        key={contact.id}
                                        onClick={() => setSelectedContact(contact)}
                                        className={`group hover:bg-[#00E5FF]/5 cursor-pointer border-b border-slate-800/20 transition-all ${selectedContact?.id === contact.id ? 'bg-[#00E5FF]/10' : ''
                                            }`}
                                    >
                                        <td className="p-6">
                                            <div className={`px-2 py-1 rounded text-[8px] font-black text-center border inline-block tracking-tighter ${contact.securityTier === 'SOVEREIGN_ADMIN' ? 'bg-purple-900/30 border-purple-500 text-purple-400' :
                                                    contact.securityTier === 'T3_EXECUTIVE' ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]' :
                                                        'bg-slate-900 border-slate-700 text-slate-500'
                                                }`}>
                                                {contact.securityTier?.replace('_', ' ') || 'T1'}
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="font-black text-slate-100 group-hover:text-[#00E5FF] transition-colors text-sm uppercase tracking-tight">
                                                {contact.name}
                                            </div>
                                            <div className="text-[10px] text-slate-600 font-mono uppercase font-bold mt-1 tracking-tighter">
                                                {contact.role}
                                            </div>
                                        </td>
                                        <td className="p-6 text-[11px] text-[#D4AF37] font-mono font-black uppercase tracking-widest">
                                            {contact.company}
                                        </td>
                                        <td className="p-6">
                                            {contact.intent === 'HIGH' ? (
                                                <div className="flex items-center gap-2">
                                                    <Flame size={12} className="text-orange-500 animate-pulse" />
                                                    <span className="text-[9px] text-orange-400 font-black uppercase tracking-widest">Active Link</span>
                                                </div>
                                            ) : (
                                                <span className="text-[9px] text-slate-700 font-mono uppercase font-bold">Stable</span>
                                            )}
                                        </td>
                                        <td className="p-6 text-right">
                                            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onSimulateCall(contact); }}
                                                    className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all"
                                                >
                                                    <Phone size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {selectedContact && (
                    <div className="w-[520px] flex flex-col gap-6 animate-in slide-in-from-right-10 duration-500">
                        <div className="glass-panel p-10 rounded-[3rem] border border-slate-800 flex-1 flex flex-col shadow-2xl relative overflow-hidden bg-slate-950/60">
                            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none rotate-12">
                                <Brain size={150} />
                            </div>

                            <div className="flex justify-between items-start mb-10 z-10 relative">
                                <div className="space-y-2">
                                    <div className="text-[10px] text-[#00E5FF] font-mono uppercase tracking-[0.6em] mb-4 font-black border-l-4 border-[#00E5FF] pl-3">
                                        Neural Node 0x{selectedContact.id.slice(-4)}
                                    </div>
                                    <h3 className="text-5xl font-black text-white leading-none tracking-tighter">
                                        {selectedContact.name}
                                    </h3>
                                    <p className="text-[#D4AF37] text-xs font-black uppercase tracking-[0.2em]">
                                        {selectedContact.company}
                                    </p>
                                    <p className="text-slate-500 text-[10px] font-mono uppercase tracking-widest mt-2">
                                        {selectedContact.role} // {selectedContact.pamRole}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedContact(null)}
                                    className="text-slate-700 hover:text-white transition-colors bg-slate-900/50 p-2 rounded-full"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex-1 space-y-10 z-10 overflow-y-auto pr-2 custom-scrollbar">
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                                        <Activity size={14} /> Neural Intelligence Log
                                    </h4>
                                    <p className="text-xs text-slate-400 font-mono leading-relaxed bg-black/60 p-6 rounded-3xl border border-slate-800 italic">
                                        "{selectedContact.notes}"
                                    </p>
                                </div>
                            </div>

                            <div className="mt-10 pt-10 border-t border-slate-800/50 flex gap-4 z-10">
                                <button
                                    onClick={() => onSimulateCall(selectedContact)}
                                    className="flex-1 py-6 bg-[#D4AF37] hover:bg-yellow-500 text-black font-black rounded-3xl flex items-center justify-center gap-4 text-xs tracking-[0.4em] uppercase transition-all shadow-[0_0_40px_rgba(212,175,55,0.3)]"
                                >
                                    <ShieldCheck size={20} /> Launch Briefing
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-[#020617]/95 z-[200] flex items-center justify-center p-12 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="w-full max-w-xl glass-panel p-12 rounded-[3rem] border border-[#D4AF37]/30 shadow-2xl">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-3xl font-black text-white uppercase tracking-tighter">
                                Initialize <span className="text-[#D4AF37]">Node</span>
                            </h3>
                            <button onClick={() => setShowAddModal(false)} className="text-slate-600 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Name *</label>
                                <input
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white font-mono focus:border-[#D4AF37] outline-none"
                                    value={newContact.name}
                                    onChange={e => setNewContact({ ...newContact, name: e.target.value })}
                                    placeholder="Contact name..."
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Company *</label>
                                <input
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white font-mono focus:border-[#D4AF37] outline-none"
                                    value={newContact.company}
                                    onChange={e => setNewContact({ ...newContact, company: e.target.value })}
                                    placeholder="Company name..."
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Role</label>
                                <input
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white font-mono focus:border-[#D4AF37] outline-none"
                                    value={newContact.role}
                                    onChange={e => setNewContact({ ...newContact, role: e.target.value })}
                                    placeholder="Job title..."
                                />
                            </div>
                            <button
                                onClick={handleAddNode}
                                className="w-full py-5 bg-[#D4AF37] text-black font-black rounded-2xl text-sm tracking-[0.4em] uppercase hover:bg-yellow-500 transition-all flex items-center justify-center gap-3"
                            >
                                <Zap size={18} /> Synchronize Node
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
