import { useEffect, useRef } from 'react';
import type { ChatMessage } from '../../../services/api/gemini';
import { MessageBubble } from './MessageBubble';
import { DaxLogo } from '../../../components/icons/DaxLogo';

interface MessageListProps {
    messages: ChatMessage[];
    isLoading: boolean;
}

const EXAMPLE_QUESTIONS = [
    "Apa perbedaan Layer 1 dan Layer 2?",
    "Jelaskan tokenomics dan inflasi token",
    "Apa itu rug pull dan cara deteksinya?",
    "Bagaimana staking menghasilkan yield?",
    "Risiko apa saja dalam DeFi?"
];

export const MessageList = ({ messages, isLoading }: MessageListProps) => {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const scrollToBottom = () => bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        scrollToBottom();

        window.addEventListener('chat-scroll', scrollToBottom);
        return () => window.removeEventListener('chat-scroll', scrollToBottom);
    }, [messages, isLoading]);

    if (messages.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center h-full max-w-3xl mx-auto w-full">
                <div className="w-16 h-16 bg-gradient-to-br from-[var(--accent-color)] to-blue-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <DaxLogo className="w-8 h-8 text-white" />
                </div>
                
                <h2 className="text-3xl font-medium text-[var(--text-primary)] mb-2">
                    Hello, I'm DaxAssistant
                </h2>
                
                <p className="text-[var(--text-secondary)] mb-10 text-lg">
                    How can I help you analyze cryptocurrency today?
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                    {EXAMPLE_QUESTIONS.map((q, i) => (
                        <button
                            key={i}
                            className="p-4 text-sm text-[var(--text-secondary)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)] border border-[#3C4043]/30 rounded-2xl transition-colors text-left flex items-start gap-3"
                            onClick={() => {
                                window.dispatchEvent(new CustomEvent('setInput', { detail: q }));
                            }}
                        >
                            <DaxLogo className="w-4 h-4 text-[var(--accent-color)] mt-0.5 flex-shrink-0" />
                            <span>{q}</span>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-6 w-full">
            <div className="flex flex-col relative z-10 w-full">
                {messages.map((msg, index) => (
                    <MessageBubble
                        key={msg.id}
                        message={msg}
                        isLast={index === messages.length - 1}
                    />
                ))}
                {isLoading && (
                    <div className="flex justify-start mb-6 px-4 md:px-6 w-full">
                        <div className="flex gap-4 max-w-3xl w-full">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center">
                                <DaxLogo className="w-4 h-4 animate-pulse" />
                            </div>
                            <div className="flex flex-col items-start justify-center pt-2">
                                <div className="flex gap-1.5 items-center bg-[var(--bg-secondary)] px-4 py-3 rounded-2xl rounded-tl-sm border border-[#3C4043]/30">
                                    <div className="w-2 h-2 bg-[var(--text-secondary)] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-2 h-2 bg-[var(--text-secondary)] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-2 h-2 bg-[var(--text-secondary)] rounded-full animate-bounce"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>
        </div>
    );
};
