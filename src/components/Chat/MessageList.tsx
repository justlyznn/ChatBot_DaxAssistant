import { useEffect, useRef } from 'react';
import type { ChatMessage } from '../../lib/gemini';
import { MessageBubble } from './MessageBubble';

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
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    if (messages.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center h-full relative">
                {/* Cyber Welcome Container */}
                <div className="max-w-3xl w-full relative">
                    {/* Corner Brackets */}
                    <div className="absolute -top-4 -left-4 w-16 h-16 border-l-2 border-t-2 border-cyan-400 opacity-50"></div>
                    <div className="absolute -top-4 -right-4 w-16 h-16 border-r-2 border-t-2 border-cyan-400 opacity-50"></div>
                    <div className="absolute -bottom-4 -left-4 w-16 h-16 border-l-2 border-b-2 border-cyan-400 opacity-50"></div>
                    <div className="absolute -bottom-4 -right-4 w-16 h-16 border-r-2 border-b-2 border-cyan-400 opacity-50"></div>

                    {/* Icon */}
                    <div className="relative inline-block mb-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-cyan-600 to-cyan-800 rotate-45 flex items-center justify-center cyber-glow">
                            <div className="-rotate-45 text-6xl">💰</div>
                        </div>
                        <div className="absolute inset-0 border-2 border-cyan-400/30 rotate-45 animate-pulse"></div>
                    </div>

                    {/* Title */}
                    <h2 className="font-['Orbitron'] text-3xl md:text-4xl font-bold text-cyan-400 mb-3 cyber-text-glow tracking-wider">
                        CRYPTOCURRENCY ANALYST
                    </h2>

                    {/* Subtitle */}
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <div className="h-px w-12 bg-gradient-to-r from-transparent to-cyan-500"></div>
                        <p className="font-['Share_Tech_Mono'] text-sm text-cyan-600 tracking-widest">
                            SYSTEM READY
                        </p>
                        <div className="h-px w-12 bg-gradient-to-l from-transparent to-cyan-500"></div>
                    </div>

                    {/* Description */}
                    <p className="text-cyan-400/70 mb-8 max-w-2xl mx-auto font-['Rajdhani'] text-lg leading-relaxed">
                        Analisis edukatif tentang blockchain, kripto, dan Web3 dengan fokus pada risiko dan pemahaman data-driven
                    </p>

                    {/* Example Questions Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                        {EXAMPLE_QUESTIONS.map((q, i) => (
                            <button
                                key={i}
                                className="group relative px-4 py-3 text-sm text-cyan-300 border border-cyan-700/50 bg-cyan-950/20 hover:bg-cyan-900/30 hover:border-cyan-500 transition-all font-['Rajdhani'] text-left overflow-hidden"
                                onClick={() => {
                                    window.dispatchEvent(new CustomEvent('setInput', { detail: q }));
                                }}
                            >
                                {/* Corner accents */}
                                <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                <span className="relative z-10 flex items-center gap-2">
                                    <span className="text-cyan-500 font-['Share_Tech_Mono']">&gt;</span>
                                    {q}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Status Bar */}
                    <div className="mt-8 flex items-center justify-center gap-3 text-xs font-['Share_Tech_Mono'] text-cyan-600/50">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse cyber-glow"></div>
                            <span>ONLINE</span>
                        </div>
                        <span>|</span>
                        <span>GEMINI 2.5 FLASH</span>
                        <span>|</span>
                        <span>GROUNDING ENABLED</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-6 relative">
            {/* Subtle grid pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.5)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
            </div>

            <div className="max-w-4xl mx-auto flex flex-col relative z-10">
                {messages.map((msg, index) => (
                    <MessageBubble
                        key={msg.id}
                        message={msg}
                        isLast={index === messages.length - 1}
                    />
                ))}
                {isLoading && (
                    <div className="flex justify-start mb-4">
                        <div className="relative px-6 py-4 bg-cyan-950/30 border border-cyan-700/50 backdrop-blur-sm">
                            {/* Corner brackets */}
                            <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-cyan-400"></div>
                            <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-cyan-400"></div>

                            <div className="flex gap-2 items-center">
                                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.3s] cyber-glow"></div>
                                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.15s] cyber-glow"></div>
                                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce cyber-glow"></div>
                                <span className="ml-2 text-cyan-400 font-['Share_Tech_Mono'] text-xs">PROCESSING</span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>
        </div>
    );
};
