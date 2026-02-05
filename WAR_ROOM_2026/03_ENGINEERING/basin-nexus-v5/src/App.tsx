
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Dojo from './components/Dojo';
import NetworkCRM from './components/NetworkCRM';
import PipelineTracker from './components/PipelineTracker';
import Hunt from './components/Hunt';
import { AppMode, AVAILABLE_MODELS } from './types';

function App() {
    const [mode, setMode] = useState<AppMode>(AppMode.DASHBOARD);
    const [selectedModel, setSelectedModel] = useState(AVAILABLE_MODELS[0].id);

    const renderContent = () => {
        switch (mode) {
            case AppMode.DASHBOARD: return <Dashboard setMode={setMode} />;
            case AppMode.DOJO: return <Dojo isActive={true} selectedModel={selectedModel} />;
            case AppMode.NETWORK: return <NetworkCRM />;
            case AppMode.PIPELINE: return <PipelineTracker />;
            case AppMode.HUNT: return <Hunt selectedModel={selectedModel} />;
            default: return <Dashboard setMode={setMode} />;
        }
    };

    return (
        <div className="flex h-screen bg-black text-white overflow-hidden selection:bg-[#D4AF37] selection:text-black">
            <Sidebar 
                currentMode={mode} 
                setMode={setMode} 
                selectedModel={selectedModel}
                setSelectedModel={setSelectedModel}
            />
            <div className="flex-1 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-black pointer-events-none"></div>
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent opacity-50"></div>
                <div className="relative h-full z-10">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

export default App;
