import { Coins, Menu, X, Plus } from 'lucide-react';
import { useState } from 'react';
import { useChat } from '../../hooks/useChat';
import { InputArea } from './InputArea';
import { MessageList } from './MessageList';
import { ConversationItem } from './ConversationItem';

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

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="flex flex-col h-screen w-full bg-[#050810] relative overflow-hidden">
            {/* Cyber Grid Background Effect */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
            </div>

            {/* Top Navbar - New Layout */}
            <header className="relative z-20 border-b border-cyan-500/30 bg-[#0a0e1a]/90 backdrop-blur-md">
                <div className="flex items-center justify-between px-4 md:px-6 h-16">
                    {/* Left: Logo & Title */}
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center rotate-45 cyber-glow">
                                <Coins size={20} className="-rotate-45 text-black" />
                            </div>
                            <div className="absolute -top-1 -left-1 w-3 h-3 border-l-2 border-t-2 border-cyan-400"></div>
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-r-2 border-b-2 border-cyan-400"></div>
                        </div>
                        <div>
                            <h1 className="font-['Orbitron'] font-bold text-lg md:text-xl text-cyan-400 cyber-text-glow tracking-wider">
                                DAXASSISTANT
                            </h1>
                            <p className="text-[10px] md:text-xs text-cyan-600 font-['Share_Tech_Mono'] tracking-widest">
                                AI CRYPTO ANALYST v2.0
                            </p>
                        </div>
                    </div>

                    {/* Right: Menu Toggle */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2.5 border border-cyan-500/50 bg-cyan-950/30 hover:bg-cyan-900/40 text-cyan-400 transition-all relative group"
                    >
                        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-cyan-400 group-hover:border-cyan-300"></div>
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-cyan-400 group-hover:border-cyan-300"></div>
                    </button>
                </div>

                {/* Animated underline effect */}
                <div className="h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
            </header>

            {/* Conversations Dropdown Menu */}
            {isMenuOpen && (
                <div className="absolute top-16 right-0 w-full md:w-96 bg-[#0a0e1a]/95 backdrop-blur-md border-b border-l border-cyan-500/30 z-30 max-h-[60vh] overflow-hidden shadow-[0_0_30px_rgba(0,240,255,0.3)]">
                    {/* New Chat Button */}
                    <div className="p-3 border-b border-cyan-500/20">
                        <button
                            onClick={() => {
                                createNewConversation();
                                setIsMenuOpen(false);
                            }}
                            className="w-full px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-black font-['Rajdhani'] font-semibold text-sm transition-all flex items-center justify-center gap-2 relative overflow-hidden group"
                        >
                            <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                            NEW CHAT
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                        </button>
                    </div>

                    {/* Conversations List */}
                    <div className="overflow-y-auto max-h-[calc(60vh-80px)]">
                        {conversations.length === 0 ? (
                            <div className="p-6 text-center text-cyan-600/50 font-['Share_Tech_Mono'] text-sm">
                                &gt; NO ACTIVE SESSIONS
                            </div>
                        ) : (
                            <div className="py-2">
                                {conversations.map((conv) => (
                                    <ConversationItem
                                        key={conv.id}
                                        conversation={conv}
                                        isActive={conv.id === activeConversationId}
                                        onClick={() => {
                                            switchConversation(conv.id);
                                            setIsMenuOpen(false);
                                        }}
                                        onDelete={(e) => {
                                            e.stopPropagation();
                                            if (confirm('Delete this conversation?')) {
                                                deleteConversation(conv.id);
                                            }
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
                <MessageList messages={messages} isLoading={isLoading} />

                {/* Error Display */}
                {error && (
                    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-red-950/90 border border-red-500/70 text-red-200 px-4 py-2.5 text-sm flex items-center gap-3 shadow-[0_0_20px_rgba(255,0,0,0.3)] backdrop-blur-sm font-['Rajdhani']">
                        <span className="w-2 h-2 bg-red-500 animate-pulse cyber-glow"></span>
                        <span>ERROR: {error}</span>
                        <button onClick={() => window.location.reload()} className="hover:text-red-400 underline">
                            RETRY
                        </button>
                    </div>
                )}

                {/* Input Area */}
                <InputArea
                    input={input}
                    setInput={setInput}
                    onSend={() => sendMessage(input)}
                    onStop={stopGeneration}
                    isLoading={isLoading}
                />
            </div>

            {/* Cyber Scan Line Effect */}
            <div className="absolute inset-0 pointer-events-none z-50">
                <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent animate-scanline"></div>
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
