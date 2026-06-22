import { useEffect, useState, useRef } from 'react';
import { User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ChatMessage } from '../../../services/api/gemini';
import { DaxLogo } from '../../../components/icons/DaxLogo';

interface MessageBubbleProps {
    message: ChatMessage;
    isLast: boolean;
}

export const MessageBubble = ({ message, isLast }: MessageBubbleProps) => {
    const [displayedText, setDisplayedText] = useState('');
    const isUser = message.role === 'user';
    const textToRender = useRef('');

    useEffect(() => {
        if (isUser || !isLast) {
            setDisplayedText(message.text);
            return;
        }

        if (displayedText.length === 0 && message.text.length > 0) {
            window.dispatchEvent(new CustomEvent('chat-scroll'));
        }

        textToRender.current = message.text;
    }, [message.text, isUser, isLast]);

    useEffect(() => {
        if (isUser || !isLast) return;

        const interval = setInterval(() => {
            setDisplayedText(current => {
                const target = textToRender.current;
                if (current.length < target.length) {
                    const diff = target.length - current.length;
                    // Catch up smoothly: 20% of the difference per frame, min 1 char
                    const chunk = Math.max(1, Math.floor(diff / 5));
                    return target.slice(0, current.length + chunk);
                }
                return current;
            });
        }, 16); // ~60fps

        return () => clearInterval(interval);
    }, [isUser, isLast]);

    const formatTimestamp = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className={`flex w-full mb-6 px-4 md:px-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-4 max-w-3xl w-full ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-[var(--accent-color)] text-[var(--bg-primary)]' : 'bg-white text-black'}`}>
                    {isUser ? <User size={18} /> : <DaxLogo className="w-4 h-4" />}
                </div>

                {/* Message Content */}
                <div className={`flex flex-col min-w-0 ${isUser ? 'items-end' : 'items-start'} pt-1`}>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                            {isUser ? 'You' : 'DaxAssistant'}
                        </span>
                        <span className="text-xs text-[var(--text-secondary)]">
                            {formatTimestamp(message.timestamp)}
                        </span>
                    </div>

                    <div className={`text-[15px] leading-relaxed break-words ${isUser ? 'bg-[var(--bg-hover)] px-4 py-2.5 rounded-2xl rounded-tr-sm' : ''} markdown-body [&>p]:mb-4 [&>ul]:list-disc [&>ul]:ml-6 [&>ul]:mb-4 [&>ol]:list-decimal [&>ol]:ml-6 [&>ol]:mb-4 [&_a]:text-[var(--accent-color)] [&_a]:underline [&_code]:bg-[#282A2C] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:text-[#E3E3E3] [&_pre]:bg-[#282A2C] [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:overflow-x-auto [&_pre]:mb-4 [&_table]:w-full [&_table]:mb-4 [&_table]:border-collapse [&_th]:border [&_th]:border-[#3C4043] [&_th]:bg-[#282A2C] [&_th]:p-2 [&_td]:border [&_td]:border-[#3C4043] [&_td]:p-2`}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {displayedText}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>
        </div>
    );
};
