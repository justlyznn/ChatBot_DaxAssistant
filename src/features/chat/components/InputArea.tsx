import { Send, StopCircle } from 'lucide-react';
import { useRef, useEffect } from 'react';

interface InputAreaProps {
    input: string;
    setInput: (value: string) => void;
    onSend: () => void;
    onStop: () => void;
    isLoading: boolean;
}

export const InputArea = ({ input, setInput, onSend, onStop, isLoading }: InputAreaProps) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [input]);

    // Listen for custom event to set input from example questions
    useEffect(() => {
        const handler = (e: CustomEvent) => {
            setInput(e.detail);
            textareaRef.current?.focus();
        };
        window.addEventListener('setInput', handler as EventListener);
        return () => window.removeEventListener('setInput', handler as EventListener);
    }, [setInput]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
        }
    };

    return (
        <div className="relative bg-[var(--bg-secondary)] rounded-3xl border border-[#3C4043]/50 focus-within:bg-[var(--bg-hover)] transition-colors shadow-sm">
            <div className="flex items-end gap-2 p-2">
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask DaxAssistant..."
                    rows={1}
                    className="w-full bg-transparent text-[var(--text-primary)] placeholder-[var(--text-secondary)] px-4 py-3 max-h-40 resize-none focus:outline-none font-sans text-base"
                    disabled={isLoading}
                />
                
                <div className="flex-shrink-0 p-1">
                    {isLoading ? (
                        <button
                            onClick={onStop}
                            className="p-3 bg-[var(--bg-primary)] text-[var(--text-primary)] hover:bg-[#3C4043] rounded-full transition-colors flex items-center justify-center"
                            title="Stop generating"
                        >
                            <StopCircle size={20} className="text-red-400" />
                        </button>
                    ) : (
                        <button
                            onClick={onSend}
                            disabled={!input.trim()}
                            className="p-3 bg-[var(--bg-primary)] text-[var(--text-primary)] hover:bg-[#3C4043] disabled:opacity-30 disabled:cursor-not-allowed rounded-full transition-colors flex items-center justify-center"
                        >
                            <Send size={20} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
