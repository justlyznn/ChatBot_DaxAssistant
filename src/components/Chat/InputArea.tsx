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
        <div className="relative z-20 border-t border-cyan-500/30 bg-[#0a0e1a]/90 backdrop-blur-md p-4">
            <div className="max-w-4xl mx-auto relative">
                {/* Corner Brackets */}
                <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-cyan-400"></div>
                <div className="absolute -top-2 -right-2 w-4 h-4 border-r-2 border-t-2 border-cyan-400"></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 border-l-2 border-b-2 border-cyan-400"></div>
                <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-cyan-400"></div>

                <div className="relative flex items-end gap-3 p-3 bg-[#050810] border border-cyan-600/50 focus-within:border-cyan-400 focus-within:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all">
                    {/* Status Indicator */}
                    <div className="absolute -top-3 left-4 px-2 bg-[#0a0e1a] border-x border-t border-cyan-600/50">
                        <span className="text-[10px] font-['Share_Tech_Mono'] text-cyan-600 tracking-widest flex items-center gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-cyan-500'}`}></div>
                            {isLoading ? 'PROCESSING' : 'READY'}
                        </span>
                    </div>

                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Tanyakan tentang blockchain, cryptocurrency, DeFi..."
                        rows={1}
                        className="w-full bg-transparent text-gray-100 placeholder-cyan-800 px-4 py-3 max-h-40 resize-none focus:outline-none font-['Rajdhani'] text-base"
                        disabled={isLoading}
                    />
                    {isLoading ? (
                        <button
                            onClick={() => {
                                console.log('[InputArea] Stop button clicked, isLoading:', isLoading);
                                onStop();
                            }}
                            className="relative p-3 bg-red-600/90 text-white hover:bg-red-500 transition-all group flex-shrink-0"
                            title="Hentikan respons"
                        >
                            <StopCircle size={22} />
                            <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-red-300 opacity-0 group-hover:opacity-100"></div>
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-red-300 opacity-0 group-hover:opacity-100"></div>
                        </button>
                    ) : (
                        <button
                            onClick={onSend}
                            disabled={!input.trim()}
                            className="relative p-3 bg-gradient-to-br from-cyan-600 to-cyan-700 text-white hover:from-cyan-500 hover:to-cyan-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all group flex-shrink-0 cyber-glow"
                        >
                            <Send size={22} />
                            <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                        </button>
                    )}
                </div>

                {/* Character count / info bar */}
                <div className="mt-2 flex justify-between items-center text-[10px] font-['Share_Tech_Mono'] text-cyan-700">
                    <span>{input.length} CHARS</span>
                    <span className="flex items-center gap-2">
                        <span className="hidden md:inline">SHIFT + ENTER FOR NEW LINE</span>
                        <span className="w-1 h-1 bg-cyan-600 rounded-full animate-pulse"></span>
                    </span>
                </div>
            </div>
        </div>
    );
};
