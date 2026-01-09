import { Coins, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useChat } from '../../hooks/useChat';
import { InputArea } from './InputArea';
import { MessageList } from './MessageList';
import { ChatSidebar } from './ChatSidebar';

export const ChatContainer = () => {
    const {
        conversations,
        activeConversationId,
        switchConversation,
        createNewConversation,
        deleteConversation,
        messages,
        input,
        setInput,
        isLoading,
        error,
        sendMessage,
        stopGeneration
    } = useChat();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen w-full bg-[#050810] relative overflow-hidden font-sans">
            {/* Cyber Grid Background Effect */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar Component */}
            <ChatSidebar
                conversations={conversations}
                activeConversationId={activeConversationId}
                onSelectConversation={(id) => {
                    switchConversation(id);
                    setIsSidebarOpen(false); // Close on selection (mobile)
                }}
                onNewConversation={() => {
                    createNewConversation();
                    setIsSidebarOpen(false);
                }}
                onDeleteConversation={deleteConversation}
                isCollapsed={false} // Always expanded in this view, explicitly controlled via transform on mobile
                className={`
                    fixed md:relative z-50 h-full border-r border-cyan-900/50
                    transform transition-transform duration-300 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}
            />

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col h-full relative z-10 overflow-hidden w-full">

                {/* Header */}
                <header className="flex-shrink-0 border-b border-cyan-500/30 bg-[#0a0e1a]/90 backdrop-blur-md h-16 flex items-center justify-between px-4 sticky top-0 z-20">
                    <div className="flex items-center gap-3">
                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 md:hidden border border-cyan-500/50 bg-cyan-950/30 text-cyan-400 hover:bg-cyan-900/40 rounded-sm transition-colors"
                        >
                            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>

                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <div className="relative w-8 h-8 flex items-center justify-center">
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-cyan-700 rotate-45 opacity-80"></div>
                                <Coins size={16} className="text-black relative z-10" />
                            </div>
                            <div>
                                <h1 className="font-['Orbitron'] font-bold text-base md:text-lg text-cyan-400 tracking-wider">
                                    DAXASSISTANT
                                </h1>
                            </div>
                        </div>
                    </div>

                    <div className="hidden md:block text-[10px] text-cyan-600 font-['Share_Tech_Mono'] tracking-[0.2em]">
                        SECURE CONNECTION ESTABLISHED
                    </div>
                </header>

                {/* Message List */}
                <div className="flex-1 overflow-hidden relative">
                    <MessageList messages={messages} isLoading={isLoading} />

                    {/* Error Display */}
                    {error && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] md:w-auto bg-red-950/90 border border-red-500/70 text-red-200 px-4 py-3 text-sm flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,0,0,0.3)] backdrop-blur-sm font-['Rajdhani'] rounded-sm z-30">
                            <span className="w-2 h-2 bg-red-500 animate-pulse rounded-full"></span>
                            <span>{error}</span>
                            <button onClick={() => window.location.reload()} className="hover:text-white underline ml-2 font-bold">
                                RELOAD
                            </button>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="flex-shrink-0 relative z-20">
                    <InputArea
                        input={input}
                        setInput={setInput}
                        onSend={() => sendMessage(input)}
                        onStop={stopGeneration}
                        isLoading={isLoading}
                    />
                </div>
            </div>

            {/* Global Scanline Overlay */}
            <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
                <div className="w-full h-[2px] bg-cyan-500/20 animate-scanline absolute top-0"></div>
            </div>

            <style>{`
                @keyframes scanline {
                    0% { top: 0%; opacity: 0; }
                    50% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
                .animate-scanline {
                    animation: scanline 8s linear infinite;
                }
            `}</style>
        </div>
    );
};
