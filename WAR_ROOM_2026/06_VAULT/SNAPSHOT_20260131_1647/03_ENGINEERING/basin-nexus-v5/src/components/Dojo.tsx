
import React, { useState, useEffect, useRef } from 'react';
import { generateResponse } from '../services/geminiService';
import { AppMode } from '../types';

interface DojoProps {
    isActive: boolean;
}

const Dojo: React.FC<DojoProps> = ({ isActive }) => {
    // State
    const [transcript, setTranscript] = useState<{ source: string, text: string, timestamp: string }[]>([]);
    const [isRecording, setIsRecording] = useState(false);
    const [inputText, setInputText] = useState("");
    const [adversarialMode, setAdversarialMode] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    // Metrics (Real-time)
    const [metrics, setMetrics] = useState({
        star: 0,
        conviction: 0,
        specificity: 0,
        fillers: 0
    });

    const recognitionRef = useRef<any>(null);

    // Initialize Speech Recognition
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;

            recognitionRef.current.onresult = (event: any) => {
                let interimTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        setInputText(prev => prev + event.results[i][0].transcript);
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }
            };
        }
    }, []);

    // Real-time Analysis Heuristics
    useEffect(() => {
        const text = inputText.toLowerCase();

        // Fillers
        const fillers = (text.match(/\b(um|uh|like|sort of|kind of|basically)\b/g) || []).length;

        // Specificity (Numbers, Dates)
        const numbers = (text.match(/\d+/g) || []).length;
        const specifics = Math.min(100, numbers * 15);

        // Conviction (Strong words vs Weak words)
        const weak = (text.match(/\b(think|maybe|probably|guess)\b/g) || []).length;
        const strong = (text.match(/\b(drove|built|led|created|generated)\b/g) || []).length;
        const convictionScore = Math.min(100, Math.max(0, 50 + (strong * 10) - (weak * 10)));

        // STAR (Keywords)
        const hasSituation = /situation|context|background/.test(text) ? 1 : 0;
        const hasTask = /task|challenge|goal/.test(text) ? 1 : 0;
        const hasAction = /action|did|built|led/.test(text) ? 1 : 0;
        const hasResult = /result|outcome|revenue|growth/.test(text) ? 1 : 0;
        const starScore = ((hasSituation + hasTask + hasAction + hasResult) / 4) * 100;

        setMetrics({
            star: starScore,
            conviction: convictionScore,
            specificity: specifics,
            fillers: fillers
        });
    }, [inputText]);

    const toggleRecording = () => {
        if (isRecording) {
            recognitionRef.current?.stop();
        } else {
            recognitionRef.current?.start();
        }
        setIsRecording(!isRecording);
    };

    const handleSend = async () => {
        const userMsg = { source: 'YOU', text: inputText, timestamp: new Date().toLocaleTimeString() };
        setTranscript(prev => [...prev, userMsg]);
        setInputText("");

        // AI Response
        const response = await generateResponse(inputText, AppMode.DOJO);
        const aiMsg = { source: adversarialMode ? 'SKEPTIC VP' : 'INTERVIEWER', text: response, timestamp: new Date().toLocaleTimeString() };
        setTranscript(prev => [...prev, aiMsg]);

        // Text to Speech
        speakText(response);
    };

    const speakText = (text: string) => {
        if ('speechSynthesis' in window) {
            setIsSpeaking(true);
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.onend = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
        }
    };

    return (
        <div className="flex h-full gap-6 p-6 bg-slate-950 text-white font-sans overflow-hidden">
            {/* Left Panel: Metrics & Controls */}
            <div className="w-1/3 flex flex-col gap-6">

                {/* Adversarial Toggle */}
                <div className={`p-6 rounded-2xl border ${adversarialMode ? 'border-red-500 bg-red-950/20' : 'border-slate-800 bg-slate-900/50'} transition-all`}>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold uppercase tracking-widest text-xs text-slate-400">Simulation Mode</h3>
                        <button
                            onClick={() => setAdversarialMode(!adversarialMode)}
                            className={`px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-widest transition-colors ${adversarialMode ? 'bg-red-600 text-white' : 'bg-slate-700 text-slate-400'}`}
                        >
                            {adversarialMode ? 'NIGHTMARE' : 'STANDARD'}
                        </button>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                        {adversarialMode
                            ? "⚠️ WARNING: Interviewer will interrupt, doubt metrics, and demand proof. High stress simulation."
                            : "Standard behavioral interview practice."}
                    </p>
                </div>

                {/* Live Metrics */}
                <div className="flex-1 glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-900/50 flex flex-col justify-center gap-8">
                    <div>
                        <div className="flex justify-between text-[10px] uppercase font-black tracking-widest mb-2 text-slate-500">Conviction</div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${metrics.conviction}%` }} />
                        </div>
                        <div className="text-right text-xs mt-1 font-mono text-emerald-400">{metrics.conviction}/100</div>
                    </div>

                    <div>
                        <div className="flex justify-between text-[10px] uppercase font-black tracking-widest mb-2 text-slate-500">Specificity (Data/Names)</div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-cyan-500 transition-all duration-500" style={{ width: `${metrics.specificity}%` }} />
                        </div>
                        <div className="text-right text-xs mt-1 font-mono text-cyan-400">{metrics.specificity}/100</div>
                    </div>

                    <div>
                        <div className="flex justify-between text-[10px] uppercase font-black tracking-widest mb-2 text-slate-500">STAR Structure</div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-[#D4AF37] transition-all duration-500" style={{ width: `${metrics.star}%` }} />
                        </div>
                        <div className="text-right text-xs mt-1 font-mono text-[#D4AF37]">{metrics.star}/100</div>
                    </div>

                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-center">
                        <div className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1">Filler Words</div>
                        <div className={`text-3xl font-mono ${metrics.fillers > 5 ? 'text-red-500' : 'text-slate-300'}`}>{metrics.fillers}</div>
                    </div>
                </div>
            </div>

            {/* Right Panel: Chat & Input */}
            <div className="flex-1 flex flex-col glass-panel rounded-2xl border border-slate-800 bg-black relative">

                {/* Chat Log */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                    {transcript.map((msg, idx) => (
                        <div key={idx} className={`flex flex-col ${msg.source === 'YOU' ? 'items-end' : 'items-start'}`}>
                            <div className="text-[9px] uppercase font-black tracking-widest text-slate-600 mb-2">{msg.source} // {msg.timestamp}</div>
                            <div className={`max-w-[80%] p-6 rounded-2xl text-sm leading-relaxed ${msg.source === 'YOU'
                                    ? 'bg-slate-900 border border-slate-800 text-slate-300'
                                    : 'bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37]'
                                }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {transcript.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center opacity-20">
                            <div className="text-6xl mb-4">🥋</div>
                            <div className="text-sm font-mono uppercase tracking-[0.5em]">Dojo Active</div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-6 border-t border-slate-800 bg-slate-900/50">
                    <div className="flex gap-4">
                        <button
                            onClick={toggleRecording}
                            className={`p-4 rounded-xl transition-all ${isRecording ? 'bg-red-600 animate-pulse' : 'bg-slate-800 hover:bg-slate-700'}`}
                        >
                            🎤
                        </button>
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={isRecording ? "Listening..." : "Type your answer or use microphone..."}
                            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 text-sm focus:border-[#D4AF37] outline-none transition-colors font-mono"
                        />
                        <button
                            onClick={handleSend}
                            className="bg-[#D4AF37] text-black font-black uppercase tracking-widest text-xs px-8 rounded-xl hover:scale-105 active:scale-95 transition-transform"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dojo;
