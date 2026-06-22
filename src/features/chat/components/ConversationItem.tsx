import { Trash2 } from 'lucide-react';
import type { Conversation } from '../../../services/storage/conversationStorage';

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

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    return (
        <div
            onClick={onClick}
            className={`
                group relative px-3 py-2.5 mx-2 my-1 cursor-pointer transition-colors rounded-xl flex items-center justify-between gap-3
                ${isActive
                    ? 'bg-[var(--bg-hover)] text-[var(--text-primary)]'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
                }
            `}
        >
            <div className="flex-1 min-w-0">
                <p className={`text-sm truncate font-medium ${isActive ? 'text-[var(--text-primary)]' : ''}`}>
                    {conversation.title}
                </p>
                <p className="text-xs mt-0.5 opacity-70">
                    {formatTimestamp(conversation.lastModifiedAt)}
                </p>
            </div>

            <button
                onClick={onDelete}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-[var(--text-secondary)] hover:text-red-400 hover:bg-[#3C4043] rounded-full transition-all flex-shrink-0"
                title="Hapus percakapan"
            >
                <Trash2 size={16} />
            </button>
        </div>
    );
};
