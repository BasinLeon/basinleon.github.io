import React, { useState, useRef, useMemo } from 'react';
import { UserState, DojoSessionConfig, DossierReport } from '../types';
import { INTERVIEW_STAGES } from '../constants';
import {
    Mic, MicOff, Play, Square, Activity,
    Terminal, Medal, Target, Volume2
} from 'lucide-react';
import { generateDossier } from '../services/geminiService';

interface DojoProps {
    userState: UserState;
    initialConfig?: Partial<DojoSessionConfig>;
    updateUserState: (updates: Partial<UserState>) => void;
    addNotification: (type: 'SUCCESS' | 'ERROR' | 'INFO' | 'WARNING', msg: string, sub?: string) => void;
}

const VOICE_MODES = [
    { id: 'FRIENDLY', label: 'Friendly', desc: 'Supportive interviewer' },
    { id: 'SKEPTIC', label: 'Skeptic', desc: 'Challenges your answers' },
    { id: 'BRUTAL', label: 'Brutal', desc: 'No mercy mode' },
    { id: 'RIDDLER', label: 'Riddler', desc: 'Abstract questions' },
];

export const Dojo: React.FC<DojoProps> = ({ userState, initialConfig, updateUserState, addNotification }) => {
    const [sessionConfig, setSessionConfig] = useState<DojoSessionConfig>({
        mode: 'FRIENDLY',
        stage: INTERVIEW_STAGES[0],
        targetCompany: '',
        targetRole: '',
        ...initialConfig
    });

    const [isActive, setIsActive] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [dossier, setDossier] = useState<DossierReport | null>(null);
    const [transcript, setTranscript] = useState<{ source: 'AI' | 'YOU'; text: string; timestamp: string }[]>([]);
    const videoRef = useRef<HTMLVideoElement>(null);

    const stats = useMemo(() => {
        let fillers = 0;
        transcript.filter(t => t.source === 'YOU').forEach(entry => {
            const words = entry.text.toLowerCase().split(/\s+/);
            words.forEach(w => {
                if (['um', 'uh', 'like', 'actually'].includes(w.replace(/[.,!?]/g, ''))) fillers++;
            });
        });
        return { fillers, confidence: Math.max(0, 100 - (fillers * 5)) };
    }, [transcript]);

    const startSession = async () => {
        setIsActive(true);
        setDossier(null);
        setTranscript([]);
        addNotification('INFO', 'Dojo Activated', `Mode: ${sessionConfig.mode} | Stage: ${sessionConfig.stage}`);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }

            // Simulate AI interview responses
            setTimeout(() => {
                setTranscript(prev => [...prev, {
                    source: 'AI',
                    text: `Welcome to the ${sessionConfig.mode} Dojo. Let's prepare you for ${sessionConfig.targetRole || 'your target role'} at ${sessionConfig.targetCompany || 'your target company'}. Tell me about yourself.`,
                    timestamp: new Date().toLocaleTimeString()
                }]);
            }, 1500);
        } catch (err) {
            addNotification('ERROR', 'Camera/Mic Access Failed', 'Please grant permissions to use the Dojo.');
            setIsActive(false);
        }
    };

    const stopSession = async () => {
        setIsActive(false);

        if (videoRef.current?.srcObject) {
            (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
        }

        addNotification('INFO', 'Generating Dossier', 'Analyzing session performance...');

        const report = await generateDossier(transcript.map(t => `${t.source}: ${t.text}`).join('\n'));
        setDossier(report);
        updateUserState({ xp: userState.xp + 500, lastSimulacrumScore: report.conviction });
        addNotification('SUCCESS', 'Dossier Complete', `Conviction Score: ${report.conviction}%`);
    };

    const addUserResponse = () => {
        // Simulate user response
        const responses = [
            "I have 15 years of experience in GTM leadership, driving growth at companies like Google, SurveyMonkey, and Fudo Security.",
            "My key achievement was growing pipeline by 160% year-over-year through AI-powered automation.",
            "I'm passionate about building the tools I use - I've written over 10,000 lines of Python for my own productivity systems."
        ];

        setTranscript(prev => [...prev, {
            source: 'YOU',
            text: responses[Math.floor(Math.random() * responses.length)],
            timestamp: new Date().toLocaleTimeString()
        }]);

        // AI follow-up
        setTimeout(() => {
            const followUps = [
                "That's impressive. Can you walk me through a specific deal you closed using your AI tools?",
                "How do you approach a situation where the prospect is skeptical of new technology?",
                "What's your philosophy on building vs. buying sales tools?"
            ];
            setTranscript(prev => [...prev, {
                source: 'AI',
                text: followUps[Math.floor(Math.random() * followUps.length)],
                timestamp: new Date().toLocaleTimeString()
            }]);
        }, 2000);
    };

    return (
        <div className="h-full flex gap-8 p-8 bg-[#020617] relative overflow-hidden animate-in fade-in">
            {/* Left Panel - Config & Transcript */}
            <div className="w-[480px] flex flex-col gap-6">
                {/* Config Panel */}
                {!isActive && !dossier && (
                    <div className="glass-panel p-8 rounded-[2rem] border border-slate-800">
                        <h3 className="text-xl font-black text-white mb-6 uppercase tracking-tighter">Session Config</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Target Company</label>
                                <input
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white font-mono focus:border-[#D4AF37] outline-none"
                                    value={sessionConfig.targetCompany}
                                    onChange={e => setSessionConfig({ ...sessionConfig, targetCompany: e.target.value })}
                                    placeholder="e.g. Anthropic, OpenAI"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Target Role</label>
                                <input
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white font-mono focus:border-[#D4AF37] outline-none"
                                    value={sessionConfig.targetRole}
                                    onChange={e => setSessionConfig({ ...sessionConfig, targetRole: e.target.value })}
                                    placeholder="e.g. Enterprise AE, VP Sales"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Interview Stage</label>
                                <select
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white font-mono focus:border-[#D4AF37] outline-none"
                                    value={sessionConfig.stage}
                                    onChange={e => setSessionConfig({ ...sessionConfig, stage: e.target.value })}
                                >
                                    {INTERVIEW_STAGES.map(stage => (
                                        <option key={stage} value={stage}>{stage}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-3">Mode</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {VOICE_MODES.map(mode => (
                                        <button
                                            key={mode.id}
                                            onClick={() => setSessionConfig({ ...sessionConfig, mode: mode.id as any })}
                                            className={`p-3 rounded-xl border text-left transition-all ${sessionConfig.mode === mode.id
                                                    ? 'bg-[#D4AF37]/20 border-[#D4AF37]'
                                                    : 'bg-slate-900 border-slate-700 hover:border-slate-600'
                                                }`}
                                        >
                                            <div className={`text-xs font-black uppercase ${sessionConfig.mode === mode.id ? 'text-[#D4AF37]' : 'text-white'}`}>
                                                {mode.label}
                                            </div>
                                            <div className="text-[9px] text-slate-500 mt-1">{mode.desc}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Transcript */}
                <div className="glass-panel p-8 rounded-[2rem] border border-slate-800 flex-1 overflow-hidden flex flex-col">
                    <h3 className="text-xl font-black text-white mb-6 uppercase tracking-tighter">Session Log</h3>
                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4">
                        {transcript.map((t, i) => (
                            <div
                                key={i}
                                className={`p-4 rounded-xl text-xs font-mono leading-relaxed ${t.source === 'YOU'
                                        ? 'bg-slate-900 text-slate-400 border-l-2 border-cyan-500 ml-4'
                                        : 'bg-[#D4AF37]/10 text-white border-l-2 border-[#D4AF37] mr-4'
                                    }`}
                            >
                                <div className="text-[8px] font-black uppercase mb-1 opacity-50">{t.source} // {t.timestamp}</div>
                                {t.text}
                            </div>
                        ))}
                        {transcript.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full opacity-20">
                                <Terminal size={48} className="mb-4" />
                                <span className="text-[10px] font-mono uppercase tracking-widest">Awaiting session start</span>
                            </div>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="mt-6 pt-6 border-t border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`h-2 w-2 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                            <span className="text-[10px] font-mono uppercase text-slate-500">{isActive ? 'ACTIVE' : 'STANDBY'}</span>
                        </div>
                        {!isActive ? (
                            <button
                                onClick={startSession}
                                className="px-8 py-3 bg-[#D4AF37] text-black font-black rounded-xl text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-transform flex items-center gap-2"
                            >
                                <Play size={14} /> Enter Dojo
                            </button>
                        ) : (
                            <div className="flex gap-3">
                                <button
                                    onClick={addUserResponse}
                                    className="px-6 py-3 bg-[#00E5FF] text-black font-black rounded-xl text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-transform flex items-center gap-2"
                                >
                                    <Volume2 size={14} /> Respond
                                </button>
                                <button
                                    onClick={stopSession}
                                    className="px-6 py-3 bg-red-600 text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-transform flex items-center gap-2"
                                >
                                    <Square size={14} /> End Session
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Panel - Video/Dossier */}
            <div className="flex-1 glass-panel rounded-[3rem] border border-slate-800 relative overflow-hidden flex flex-col bg-black">
                {isActive ? (
                    <video ref={videoRef} className="w-full h-full object-cover opacity-60" autoPlay muted playsInline />
                ) : dossier ? (
                    <div className="p-20 flex flex-col items-center justify-center text-center h-full">
                        <Medal size={84} className="text-[#D4AF37] mb-8 animate-bounce" />
                        <h2 className="text-6xl font-black text-white mb-4">Sovereign Dossier</h2>
                        <p className="text-xl text-slate-400 font-mono mb-12 max-w-2xl">{dossier.summary}</p>
                        <div className="grid grid-cols-3 gap-8 w-full max-w-4xl">
                            <div className="p-8 bg-slate-900 rounded-3xl border border-slate-800">
                                <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Conviction</div>
                                <div className="text-4xl font-mono text-emerald-400">{dossier.conviction}%</div>
                            </div>
                            <div className="p-8 bg-slate-900 rounded-3xl border border-slate-800">
                                <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Clarity</div>
                                <div className="text-4xl font-mono text-cyan-400">{dossier.clarity}%</div>
                            </div>
                            <div className="p-8 bg-slate-900 rounded-3xl border border-slate-800">
                                <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">STAR Index</div>
                                <div className="text-4xl font-mono text-[#D4AF37]">{dossier.starMethod}%</div>
                            </div>
                        </div>
                        <button
                            onClick={() => setDossier(null)}
                            className="mt-16 px-12 py-5 bg-slate-800 text-white font-black rounded-2xl text-[11px] uppercase tracking-[0.3em] hover:bg-slate-700 transition-colors"
                        >
                            Return to Lobby
                        </button>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-800 opacity-20">
                        <Target size={120} className="mb-6" />
                        <span className="font-mono text-sm tracking-[1em] uppercase">Ready for Deployment</span>
                    </div>
                )}

                {/* Live Stats Overlay */}
                {isActive && (
                    <div className="absolute top-8 right-8 glass-panel p-6 rounded-2xl border border-slate-700">
                        <div className="flex items-center gap-4">
                            <div className="text-center">
                                <div className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Fillers</div>
                                <div className="text-2xl font-mono text-orange-400">{stats.fillers}</div>
                            </div>
                            <div className="w-px h-12 bg-slate-700" />
                            <div className="text-center">
                                <div className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Confidence</div>
                                <div className="text-2xl font-mono text-emerald-400">{stats.confidence}%</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
