import React, { useState, useEffect, useCallback } from 'react';
import { AppView, UserState, Contact, JobDeal, Notification } from './types';
import { INITIAL_USER_STATE } from './constants';
import { loadUserState, saveUserState } from './services/storageService';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { AgentHub } from './components/AgentHub';
import { KnowledgeBase } from './components/KnowledgeBase';
import { NetworkCRM } from './components/NetworkCRM';
import { PipelineTracker } from './components/PipelineTracker';
import { Dojo } from './components/Dojo';

const App: React.FC = () => {
    const [userState, setUserState] = useState<UserState>(INITIAL_USER_STATE);
    const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // Load state on mount
    useEffect(() => {
        const loaded = loadUserState();
        setUserState(loaded);
    }, []);

    // Save state on change
    useEffect(() => {
        saveUserState(userState);
    }, [userState]);

    const updateUserState = useCallback((updates: Partial<UserState>) => {
        setUserState(prev => ({ ...prev, ...updates }));
    }, []);

    const addNotification = useCallback((
        type: 'SUCCESS' | 'ERROR' | 'INFO' | 'WARNING',
        message: string,
        subMessage?: string
    ) => {
        const notification: Notification = {
            id: `notif-${Date.now()}`,
            type,
            message,
            subMessage,
            timestamp: new Date()
        };
        setNotifications(prev => [notification, ...prev.slice(0, 4)]);

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== notification.id));
        }, 5000);
    }, []);

    const handlePrepJob = useCallback((job: JobDeal) => {
        console.log('Prepping job:', job);
        setCurrentView(AppView.DOJO);
    }, []);

    const handleSimulateCall = useCallback((contact: Contact) => {
        console.log('Simulating call with:', contact);
        setCurrentView(AppView.DOJO);
    }, []);

    const handleUpdateContacts = useCallback((contacts: Contact[]) => {
        updateUserState({ contacts });
    }, [updateUserState]);

    const renderView = () => {
        switch (currentView) {
            case AppView.DASHBOARD:
                return (
                    <Dashboard
                        userState={userState}
                        setView={setCurrentView}
                        onPrepJob={handlePrepJob}
                        onSimulateCall={handleSimulateCall}
                        updateUserState={updateUserState}
                        addNotification={addNotification}
                    />
                );
            case AppView.AGENTS:
                return (
                    <AgentHub
                        userState={userState}
                        updateUserState={updateUserState}
                        addNotification={addNotification}
                    />
                );
            case AppView.KNOWLEDGE:
                return (
                    <KnowledgeBase
                        userState={userState}
                        updateUserState={updateUserState}
                        addNotification={addNotification}
                    />
                );
            case AppView.NETWORK:
                return (
                    <NetworkCRM
                        userState={userState}
                        onUpdateContacts={handleUpdateContacts}
                        onSimulateCall={handleSimulateCall}
                        addNotification={addNotification}
                    />
                );
            case AppView.PIPELINE:
                return (
                    <PipelineTracker
                        userState={userState}
                        updateUserState={updateUserState}
                        addNotification={addNotification}
                        onPrepJob={handlePrepJob}
                    />
                );
            case AppView.DOJO:
                return (
                    <Dojo
                        userState={userState}
                        updateUserState={updateUserState}
                        addNotification={addNotification}
                    />
                );
            default:
                return (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <h2 className="text-4xl font-black text-white mb-4">{currentView}</h2>
                            <p className="text-slate-500 font-mono">Module coming soon...</p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="flex h-screen bg-[#020617] overflow-hidden">
            <Sidebar
                currentView={currentView}
                setView={setCurrentView}
                userState={userState}
            />

            <main className="flex-1 overflow-hidden">
                {renderView()}
            </main>

            {/* Notifications */}
            <div className="fixed bottom-8 right-8 z-50 space-y-3">
                {notifications.map(notif => (
                    <div
                        key={notif.id}
                        className={`p-6 rounded-2xl border shadow-2xl backdrop-blur-xl animate-in slide-in-from-right-10 duration-300 max-w-md ${notif.type === 'SUCCESS' ? 'bg-emerald-950/90 border-emerald-500/30' :
                            notif.type === 'ERROR' ? 'bg-red-950/90 border-red-500/30' :
                                notif.type === 'WARNING' ? 'bg-amber-950/90 border-amber-500/30' :
                                    'bg-cyan-950/90 border-cyan-500/30'
                            }`}
                    >
                        <div className={`text-sm font-black uppercase tracking-widest ${notif.type === 'SUCCESS' ? 'text-emerald-400' :
                            notif.type === 'ERROR' ? 'text-red-400' :
                                notif.type === 'WARNING' ? 'text-amber-400' :
                                    'text-cyan-400'
                            }`}>
                            {notif.message}
                        </div>
                        {notif.subMessage && (
                            <div className="text-xs text-slate-400 mt-1 font-mono">{notif.subMessage}</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default App;
