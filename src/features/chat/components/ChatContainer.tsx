import { Coins, Menu, X, Plus } from 'lucide-react';
import { useState } from 'react';
import { useChat } from '../hooks/useChat';
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
        <div className="flex h-screen w-full bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans relative overflow-hidden">
            {/* Sidebar / Menu */}
            <div className={`fixed inset-y-0 left-0 z-40 w-72 bg-[var(--bg-secondary)] border-r border-[#3C4043]/30 transform transition-transform duration-300 ease-in-out flex flex-col ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
                <div className="flex items-center justify-between p-4">
                    <button 
                        onClick={() => setIsMenuOpen(false)}
                        className="md:hidden p-2 text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                    <button
                        onClick={createNewConversation}
                        className="flex-1 flex items-center gap-2 bg-[var(--bg-primary)] hover:bg-[var(--bg-hover)] px-4 py-2.5 rounded-full text-sm font-medium transition-colors border border-[#3C4043]/50"
                    >
                        <Plus size={18} />
                        New Chat
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
                    <div className="text-xs font-medium text-[var(--text-secondary)] px-3 mb-2 mt-4">Recent</div>
                    {conversations.length === 0 ? (
                        <div className="text-sm text-[var(--text-secondary)] px-3 italic">No recent chats</div>
                    ) : (
                        conversations.map((conv) => (
                            <ConversationItem
                                key={conv.id}
                                conversation={conv}
                                isActive={conv.id === activeConversationId}
                                onClick={() => {
                                    switchConversation(conv.id);
                                    if (window.innerWidth < 768) setIsMenuOpen(false);
                                }}
                                onDelete={(e) => {
                                    e.stopPropagation();
                                    if (confirm('Delete this conversation?')) deleteConversation(conv.id);
                                }}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 bg-[var(--bg-primary)]">
                {/* Header */}
                <header className="h-16 flex items-center justify-between px-4 md:px-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 -ml-2 text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] rounded-full transition-colors md:hidden"
                        >
                            <Menu size={24} />
                        </button>
                        <div className="flex items-center gap-2 text-xl font-medium tracking-tight text-[var(--text-primary)]">
                            DaxAssistant
                        </div>
                    </div>
                </header>

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col relative overflow-hidden max-w-4xl w-full mx-auto">
                    <MessageList messages={messages} isLoading={isLoading} />

                    {/* Error Display */}
                    {error && (
                        <div className="mx-4 my-2 p-4 bg-red-900/30 text-red-200 rounded-xl border border-red-500/30 flex items-center gap-3 text-sm">
                            <span>{error}</span>
                            <button onClick={() => window.location.reload()} className="ml-auto hover:text-white underline font-medium">
                                Retry
                            </button>
                        </div>
                    )}

                    <div className="w-full px-4 md:px-6 pb-6 pt-2">
                        <InputArea
                            input={input}
                            setInput={setInput}
                            onSend={() => sendMessage(input)}
                            onStop={stopGeneration}
                            isLoading={isLoading}
                        />
                        <div className="text-center mt-3 text-xs text-[var(--text-secondary)]">
                            DaxAssistant can make mistakes. Consider verifying important information.
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}
        </div>
    );
};
