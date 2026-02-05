import React, { useState, useEffect } from 'react';
import { UserState, NexusAgent, AgentTask } from '../types';
import {
    Bot, Zap, Send, Globe, Mail, Share2,
    Terminal, Activity, RefreshCw
} from 'lucide-react';

interface AgentHubProps {
    userState: UserState;
    updateUserState: (updates: Partial<UserState>) => void;
    addNotification: (type: 'SUCCESS' | 'ERROR' | 'INFO' | 'WARNING', msg: string, sub?: string) => void;
}

export const AgentHub: React.FC<AgentHubProps> = ({ userState, updateUserState, addNotification }) => {
    const [selectedAgent, setSelectedAgent] = useState<NexusAgent | null>(userState.agents?.[0] || null);
    const [taskInput, setTaskInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [neuralSyncPct, setNeuralSyncPct] = useState(0);

    const agents = userState.agents || [];
    const tasks = userState.agentTasks || [];

    useEffect(() => {
        const timer = setInterval(() => {
            setNeuralSyncPct(prev => (prev < 99 ? prev + 1 : 99));
        }, 50);
        return () => clearInterval(timer);
    }, []);

    const handleTaskExecution = async () => {
        if (!selectedAgent || !taskInput.trim()) return;
        setIsProcessing(true);
        addNotification('INFO', 'Quantum Link Active', `Deploying ${selectedAgent.name} with Sovereign L22 context.`);

        // Simulate agent execution
        setTimeout(() => {
            const newTask: AgentTask = {
                id: `task-${Date.now()}`,
                type: selectedAgent.type,
                status: 'COMPLETED',
                description: taskInput,
                result: `Agent ${selectedAgent.name} executed task successfully. Output synthesized using Sovereign protocol.`,
                timestamp: new Date().toISOString()
            };

            updateUserState({
                agentTasks: [newTask, ...tasks],
                xp: userState.xp + 200
            });
            setTaskInput('');
            addNotification('SUCCESS', 'Operation Complete', `${selectedAgent.name} finalized the objective.`);
            setIsProcessing(false);
        }, 2000);
    };

    const getAgentIcon = (type: string) => {
        switch (type) {
            case 'SOCIAL': return <Share2 size={24} />;
            case 'EMAIL': return <Mail size={24} />;
            case 'WEB': return <Globe size={24} />;
            default: return <Bot size={24} />;
        }
    };

    return (
        <div className="p-8 h-full flex flex-col bg-[#020617] relative animate-in fade-in duration-700 overflow-hidden">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-5xl font-black text-white leading-none tracking-tighter uppercase">
                        Nexus <span className="text-[#D4AF37]">Agents</span>
                    </h2>
                    <p className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.5em] mt-3">
                        Autonomous Neural Workforce // L22 Identity Shards
                    </p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <div className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-1">Neural Sync</div>
                        <div className="text-2xl font-mono font-bold text-emerald-500 tracking-tighter">{neuralSyncPct}%</div>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex gap-8 overflow-hidden">
                <div className="w-[440px] flex flex-col gap-6">
                    <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-4">
                        {agents.map(agent => (
                            <button
                                key={agent.id}
                                onClick={() => setSelectedAgent(agent)}
                                className={`w-full p-8 rounded-[2.5rem] border text-left transition-all relative overflow-hidden group ${selectedAgent?.id === agent.id
                                        ? 'bg-[#D4AF37]/10 border-[#D4AF37] shadow-lg shadow-[#D4AF37]/10'
                                        : 'bg-slate-900/30 border-slate-800/50 hover:border-slate-600'
                                    }`}
                            >
                                <div className="flex items-center gap-6 relative z-10">
                                    <div className={`p-4 rounded-2xl ${selectedAgent?.id === agent.id ? 'bg-[#D4AF37] text-black' : 'bg-slate-800 text-slate-500'
                                        }`}>
                                        {getAgentIcon(agent.type)}
                                    </div>
                                    <div>
                                        <div className={`text-lg font-black uppercase tracking-tighter ${selectedAgent?.id === agent.id ? 'text-white' : 'text-slate-400'
                                            }`}>{agent.name}</div>
                                        <div className="text-[9px] text-slate-500 font-mono uppercase tracking-widest mt-1">
                                            {agent.status} // {agent.type}
                                        </div>
                                    </div>
                                </div>
                                {selectedAgent?.id === agent.id && (
                                    <div className="absolute top-0 right-0 p-4">
                                        <Activity size={18} className="text-[#D4AF37] animate-pulse" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 flex flex-col gap-8">
                    <div className="glass-panel p-12 rounded-[3.5rem] border border-slate-800 flex flex-col shadow-2xl bg-black/40">
                        <div className="flex justify-between items-center mb-10">
                            <div className="flex items-center gap-6">
                                <div className="p-4 bg-[#D4AF37]/20 rounded-2xl text-[#D4AF37]">
                                    {selectedAgent ? getAgentIcon(selectedAgent.type) : <Bot size={24} />}
                                </div>
                                <h3 className="text-3xl font-black text-white uppercase tracking-tighter">
                                    {selectedAgent?.name}
                                    <span className="text-slate-700 ml-4 font-mono text-sm tracking-widest">v2.1_CMD</span>
                                </h3>
                            </div>
                        </div>
                        <div className="flex-1 space-y-8">
                            <div className="p-8 bg-slate-950 border border-slate-800 rounded-3xl relative overflow-hidden">
                                <label className="text-[10px] text-slate-600 font-black uppercase tracking-widest block mb-4">
                                    Command Input Buffer
                                </label>
                                <textarea
                                    className="w-full h-32 bg-transparent text-slate-200 font-mono text-lg focus:outline-none placeholder:text-slate-900"
                                    placeholder="Enter objective for autonomous execution..."
                                    value={taskInput}
                                    onChange={e => setTaskInput(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={handleTaskExecution}
                                disabled={isProcessing || !taskInput.trim()}
                                className={`w-full py-7 rounded-3xl font-black text-sm tracking-[0.5em] uppercase transition-all flex items-center justify-center gap-4 ${isProcessing
                                        ? 'bg-slate-900 text-slate-600'
                                        : 'bg-[#D4AF37] hover:bg-yellow-500 text-black shadow-2xl shadow-[#D4AF37]/20'
                                    }`}
                            >
                                {isProcessing ? <RefreshCw className="animate-spin" size={20} /> : <Zap size={20} fill="black" />}
                                {isProcessing ? "Deploying Neural Stream..." : "Authorize Deployment"}
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 glass-panel rounded-[3.5rem] border border-slate-800 overflow-hidden flex flex-col bg-black/40">
                        <div className="p-10 border-b border-slate-800 flex justify-between items-center bg-slate-900/30">
                            <h4 className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] flex items-center gap-3">
                                <Terminal size={14} /> Execution Logs
                            </h4>
                            <span className="text-[9px] text-emerald-500 font-mono font-black uppercase">All Nodes Operational</span>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-6">
                            {tasks.map(task => (
                                <div key={task.id} className="p-8 bg-slate-900/50 rounded-3xl border border-slate-800 animate-in slide-in-from-bottom-4">
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                {task.type} // {new Date(task.timestamp).toLocaleTimeString()}
                                            </span>
                                        </div>
                                        <span className="text-[9px] font-mono text-emerald-500 uppercase font-black px-3 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                                            {task.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-100 font-bold mb-4 uppercase tracking-tighter">
                                        Objective: {task.description}
                                    </p>
                                    <div className="p-6 bg-black/60 rounded-2xl border border-slate-800 font-mono text-xs text-slate-400 leading-relaxed whitespace-pre-wrap">
                                        {task.result}
                                    </div>
                                </div>
                            ))}
                            {tasks.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center opacity-10">
                                    <Activity size={84} className="mb-6" />
                                    <p className="font-mono text-xs uppercase tracking-[0.5em]">No active logs</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
