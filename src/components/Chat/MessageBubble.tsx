import { useEffect, useState } from 'react';
import { User, Bot } from 'lucide-react';
import type { ChatMessage } from '../../lib/gemini';

interface MessageBubbleProps {
    message: ChatMessage;
    isLast: boolean;
}

export const MessageBubble = ({ message, isLast }: MessageBubbleProps) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const isUser = message.role === 'user';

    useEffect(() => {
        if (isUser || !isLast) {
            setDisplayedText(message.text);
            setIsTyping(false);
            return;
        }

        // Typing animation for AI responses
        setIsTyping(true);
        let currentIndex = 0;
        const typingInterval = setInterval(() => {
            if (currentIndex <= message.text.length) {
                setDisplayedText(message.text.slice(0, currentIndex));
                currentIndex++;
            } else {
                setIsTyping(false);
                clearInterval(typingInterval);
            }
        }, 10);

        return () => clearInterval(typingInterval);
    }, [message.text, isUser, isLast]);

    const formatTimestamp = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className={`flex mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[85%] md:max-w-[75%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`relative flex-shrink-0 w-10 h-10 flex items-center justify-center ${isUser
                    ? 'bg-gradient-to-br from-cyan-600 to-cyan-800'
                    : 'bg-gradient-to-br from-cyan-900 to-cyan-950 border border-cyan-700'
                    } cyber-glow`}>
                    {isUser ? <User size={20} className="text-white" /> : <Bot size={20} className="text-cyan-400" />}
                    {/* Corner accents */}
                    <div className="absolute -top-0.5 -left-0.5 w-2 h-2 border-l border-t border-cyan-400"></div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 border-r border-b border-cyan-400"></div>
                </div>

                {/* Message Content */}
                <div className="flex flex-col flex-1">
                    {/* Header */}
                    <div className={`flex items-center gap-2 mb-1.5 text-xs font-['Share_Tech_Mono'] ${isUser ? 'justify-end' : 'justify-start'
                        }`}>
                        <span className={isUser ? 'text-cyan-400' : 'text-cyan-600'}>
                            {isUser ? 'USER' : 'DAXASSISTANT'}
                        </span>
                        <span className="text-cyan-800">|</span>
                        <span className="text-cyan-700">{formatTimestamp(message.timestamp)}</span>
                    </div>

                    {/* Message Bubble */}
                    <div className={`relative px-5 py-3.5 ${isUser
                        ? 'bg-gradient-to-br from-cyan-600/90 to-cyan-700/90 text-white border border-cyan-500/70'
                        : 'bg-[#0a0e1a]/80 text-gray-100 border border-cyan-700/40'
                        } backdrop-blur-sm`}>
                        {/* Corner Brackets */}
                        <div className={`absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 ${isUser ? 'border-cyan-300' : 'border-cyan-600'
                            }`}></div>
                        <div className={`absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 ${isUser ? 'border-cyan-300' : 'border-cyan-600'
                            }`}></div>

                        <div className="whitespace-pre-wrap leading-relaxed text-sm md:text-base font-['Rajdhani']">
                            {displayedText}
                            {isTyping && <span className="animate-pulse inline-block w-1.5 h-4 ml-1 align-middle bg-cyan-400 cyber-glow" />}
                        </div>

                        {/* Glow effect for user messages */}
                        {isUser && (
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-transparent pointer-events-none"></div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
