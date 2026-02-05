
import React, { useState, useEffect, useRef } from 'react';
import { generateResponse } from '../services/geminiService';
import { AppMode } from '../types';

interface DojoProps {
    isActive: boolean;
    selectedModel: string;
}

// Leon's specific filler words from the Glean transcript
const FILLER_PATTERNS = [
    'um', 'uh', 'like', 'essentially', 'kind of', 'sort of', 
    'basically', 'you know', 'i mean', 'right', 'so,'
];

const Dojo: React.FC<DojoProps> = ({ isActive, selectedModel }) => {
    // State
    const [transcript, setTranscript] = useState<{ source: string, text: string, timestamp: string, fillerCount?: number }[]>([]);
    const [isRecording, setIsRecording] = useState(false);
    const [inputText, setInputText] = useState("");
    const [adversarialMode, setAdversarialMode] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    // Metrics (Real-time)
    const [metrics, setMetrics] = useState({
        star: 0,
        conviction: 0,
        specificity: 0,
        fillers: 0,
        wpm: 0
    });

    // WPM Tracking
    const [recordingStartTime, setRecordingStartTime] = useState<number | null>(null);
    const [wordCount, setWordCount] = useState(0);

    // Detected Fillers (for highlighting)
    const [detectedFillers, setDetectedFillers] = useState<string[]>([]);

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
        const words = text.split(/\s+/).filter(w => w.length > 0);

        // Filler Detection (Leon's specific words)
        let fillerCount = 0;
        const foundFillers: string[] = [];
        FILLER_PATTERNS.forEach(filler => {
            const regex = new RegExp(`\\b${filler}\\b`, 'gi');
            const matches = text.match(regex);
            if (matches) {
                fillerCount += matches.length;
                foundFillers.push(...matches);
            }
        });
        setDetectedFillers(foundFillers);

        // Specificity (Numbers, Dates, Dollar Signs)
        const numbers = (text.match(/\d+/g) || []).length;
        const dollars = (text.match(/\$/g) || []).length;
        const specifics = Math.min(100, (numbers + dollars) * 12);

        // Conviction (Strong words vs Weak words)
        const weak = (text.match(/\b(think|maybe|probably|guess|might|could)\\b/g) || []).length;
        const strong = (text.match(/\b(drove|built|led|created|generated|achieved|delivered|closed)\\b/g) || []).length;
        const convictionScore = Math.min(100, Math.max(0, 50 + (strong * 12) - (weak * 15)));

        // STAR (Keywords)
        const hasSituation = /situation|context|background|at|when/.test(text) ? 1 : 0;
        const hasTask = /task|challenge|goal|problem|objective/.test(text) ? 1 : 0;
        const hasAction = /action|did|built|led|created|implemented|designed/.test(text) ? 1 : 0;
        const hasResult = /result|outcome|revenue|growth|pipeline|\$|percent|%/.test(text) ? 1 : 0;
        const starScore = ((hasSituation + hasTask + hasAction + hasResult) / 4) * 100;

        // WPM Calculation
        let wpm = 0;
        if (recordingStartTime && isRecording) {
            const elapsedMinutes = (Date.now() - recordingStartTime) / 60000;
            if (elapsedMinutes > 0.1) {
                wpm = Math.round(words.length / elapsedMinutes);
            }
        }

        setWordCount(words.length);
        setMetrics({
            star: starScore,
            conviction: convictionScore,
            specificity: specifics,
            fillers: fillerCount,
            wpm: wpm
        });
    }, [inputText, isRecording, recordingStartTime]);

    const toggleRecording = () => {
        if (isRecording) {
            recognitionRef.current?.stop();
            setRecordingStartTime(null);
        } else {
            recognitionRef.current?.start();
            setRecordingStartTime(Date.now());
            setInputText("");
        }
        setIsRecording(!isRecording);
    };

    const handleSend = async () => {
        const userMsg = { 
            source: 'YOU', 
            text: inputText, 
            timestamp: new Date().toLocaleTimeString(),
            fillerCount: metrics.fillers
        };
        setTranscript(prev => [...prev, userMsg]);
        setInputText("");
        setRecordingStartTime(null);

        // AI Response
        const prompt = adversarialMode 
            ? `You are a skeptical VP of Sales interviewing a candidate. Challenge their answer, ask for proof, interrupt with doubts. Their answer: "${inputText}"`
            : `You are a friendly hiring manager conducting a behavioral interview. Ask a natural follow-up question based on: "${inputText}"`;
        
        const response = await generateResponse(prompt, AppMode.DOJO, selectedModel);
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

    // Highlight fillers in the text
    const highlightFillers = (text: string) => {
        let result = text;
        FILLER_PATTERNS.forEach(filler => {
            const regex = new RegExp(`(\\b${filler}\\b)`, 'gi');
            result = result.replace(regex, '<span class="filler-highlight">$1</span>');
        });
        return result;
    };

    return (
        <div className="flex h-full gap-6 p-6 bg-slate-950 text-white font-sans overflow-hidden">
            {/* Left Panel: Metrics & Controls */}
            <div className="w-1/3 flex flex-col gap-4">

                {/* Adversarial Toggle */}
                <div className={`p-5 rounded-2xl border ${adversarialMode ? 'border-red-500 bg-red-950/20' : 'border-slate-800 bg-slate-900/50'} transition-all`}>
                    <div className="flex justify-between items-center mb-3">
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
                            ? "⚠️ WARNING: Interviewer will interrupt, doubt metrics, and demand proof."
                            : "Standard behavioral interview practice."}
                    </p>
                </div>

                {/* WPM & Word Count */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 text-center">
                        <div className="text-[9px] uppercase font-black tracking-widest text-slate-500 mb-1">WPM</div>
                        <div className={`text-2xl font-mono ${metrics.wpm > 160 ? 'text-yellow-500' : metrics.wpm < 100 ? 'text-blue-400' : 'text-emerald-400'}`}>
                            {metrics.wpm || '--'}
                        </div>
                        <div className="text-[8px] text-slate-600 mt-1">Target: 120-150</div>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 text-center">
                        <div className="text-[9px] uppercase font-black tracking-widest text-slate-500 mb-1">Words</div>
                        <div className="text-2xl font-mono text-slate-300">{wordCount}</div>
                    </div>
                </div>

                {/* Filler Alert */}
                <div className={`p-4 rounded-xl border ${metrics.fillers > 3 ? 'border-red-500 bg-red-950/30' : 'border-slate-800 bg-slate-900/50'} text-center transition-all`}>
                    <div className="text-[9px] uppercase font-black tracking-widest text-slate-500 mb-1">Filler Words</div>
                    <div className={`text-3xl font-mono ${metrics.fillers > 5 ? 'text-red-500 animate-pulse' : metrics.fillers > 2 ? 'text-yellow-500' : 'text-emerald-400'}`}>
                        {metrics.fillers}
                    </div>
                    {detectedFillers.length > 0 && (
                        <div className="mt-2 text-[10px] text-red-400">
                            {[...new Set(detectedFillers)].join(', ')}
                        </div>
                    )}
                </div>

                {/* Live Metrics */}
                <div className="flex-1 p-5 rounded-2xl border border-slate-800 bg-slate-900/50 flex flex-col justify-center gap-5">
                    <div>
                        <div className="flex justify-between text-[10px] uppercase font-black tracking-widest mb-2 text-slate-500">Conviction</div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${metrics.conviction}%` }} />
                        </div>
                        <div className="text-right text-xs mt-1 font-mono text-emerald-400">{metrics.conviction}/100</div>
                    </div>

                    <div>
                        <div className="flex justify-between text-[10px] uppercase font-black tracking-widest mb-2 text-slate-500">Specificity ($, %, Names)</div>
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
                </div>
            </div>

            {/* Right Panel: Chat & Input */}
            <div className="flex-1 flex flex-col glass-panel rounded-2xl border border-slate-800 bg-black relative">

                {/* Chat Log */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                    {transcript.map((msg, idx) => (
                        <div key={idx} className={`flex flex-col ${msg.source === 'YOU' ? 'items-end' : 'items-start'}`}>
                            <div className="text-[9px] uppercase font-black tracking-widest text-slate-600 mb-2">
                                {msg.source} // {msg.timestamp}
                                {msg.source === 'YOU' && msg.fillerCount !== undefined && msg.fillerCount > 0 && (
                                    <span className="ml-2 text-red-500">({msg.fillerCount} fillers)</span>
                                )}
                            </div>
                            <div 
                                className={`max-w-[80%] p-6 rounded-2xl text-sm leading-relaxed ${msg.source === 'YOU'
                                        ? 'bg-slate-900 border border-slate-800 text-slate-300'
                                        : 'bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37]'
                                    }`}
                                dangerouslySetInnerHTML={{ __html: msg.source === 'YOU' ? highlightFillers(msg.text) : msg.text }}
                            />
                        </div>
                    ))}
                    {transcript.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center opacity-20">
                            <div className="text-6xl mb-4">🥋</div>
                            <div className="text-sm font-mono uppercase tracking-[0.5em]">Dojo Active</div>
                            <div className="text-xs text-slate-600 mt-2">Press the mic and start practicing</div>
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

            {/* CSS for filler highlighting */}
            <style>{`
                .filler-highlight {
                    background: rgba(255, 107, 107, 0.3);
                    color: #ff6b6b;
                    padding: 0 3px;
                    border-radius: 3px;
                    font-weight: 600;
                }
            `}</style>
        </div>
    );
};

export default Dojo;
