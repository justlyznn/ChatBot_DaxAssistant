import { Trash2 } from 'lucide-react';
import type { Conversation } from '../../lib/conversationStorage';

interface ConversationItemProps {
    conversation: Conversation;
    isActive: boolean;
    onClick: () => void;
    onDelete: (e: React.MouseEvent) => void;
}

export const ConversationItem = ({
    conversation,
    isActive,
    onClick,
    onDelete,
}: ConversationItemProps) => {
    const formatTimestamp = (timestamp: number) => {
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'JUST NOW';
        if (minutes < 60) return `${minutes}MIN AGO`;
        if (hours < 24) return `${hours}HR AGO`;
        return `${days}D AGO`;
    };

    return (
        <div
            onClick={onClick}
            className={`
                group relative px-4 py-3 cursor-pointer transition-all border-l-2
                ${isActive
                    ? 'bg-cyan-950/50 border-cyan-400 shadow-[inset_0_0_20px_rgba(0,240,255,0.1)]'
                    : 'border-transparent hover:bg-cyan-950/30 hover:border-cyan-600/50'
                }
            `}
        >
            {/* Corner brackets on hover/active */}
            <div className={`absolute top-1 left-1 w-2 h-2 border-l border-t border-cyan-400 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                }`}></div>
            <div className={`absolute bottom-1 right-10 w-2 h-2 border-r border-b border-cyan-400 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                }`}></div>

            <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate font-['Rajdhani'] ${isActive ? 'text-cyan-300' : 'text-gray-300'
                        }`}>
                        {conversation.title}
                    </p>
                    <p className="text-[10px] text-cyan-600/70 mt-0.5 font-['Share_Tech_Mono'] tracking-wider">
                        {formatTimestamp(conversation.lastModifiedAt)}
                    </p>
                </div>

                <button
                    onClick={onDelete}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-cyan-500/70 hover:text-red-400 hover:bg-red-950/30 transition-all flex-shrink-0 border border-transparent hover:border-red-500/30"
                    title="Hapus percakapan"
                >
                    <Trash2 size={14} />
                </button>
            </div>

            {/* Active indicator */}
            {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-transparent via-cyan-400 to-transparent cyber-glow"></div>
            )}
        </div>
    );
};
