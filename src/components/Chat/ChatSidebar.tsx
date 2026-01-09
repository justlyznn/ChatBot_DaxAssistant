import { MessageSquarePlus } from 'lucide-react';
import type { Conversation } from '../../lib/conversationStorage';
import { ConversationItem } from './ConversationItem';

interface ChatSidebarProps {
    conversations: Conversation[];
    activeConversationId: string | null;
    onSelectConversation: (id: string) => void;
    onNewConversation: () => void;
    onDeleteConversation: (id: string) => void;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

export const ChatSidebar = ({
    conversations,
    activeConversationId,
    onSelectConversation,
    onNewConversation,
    onDeleteConversation,
    isCollapsed,
}: ChatSidebarProps) => {
    return (
        <div
            className={`
                flex-shrink-0 bg-black border-r border-cyan-900/50 
                transition-all duration-300 ease-in-out overflow-hidden
                ${isCollapsed ? 'w-0' : 'w-72'}
            `}
        >
            <div className="flex flex-col h-full w-72">
                {/* Sidebar Header */}
                <div className="p-3 border-b border-cyan-900/50">
                    <button
                        onClick={onNewConversation}
                        className="w-full px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                    >
                        <MessageSquarePlus size={18} />
                        Chat Baru
                    </button>
                </div>

                {/* Conversations List */}
                <div className="flex-1 overflow-y-auto">
                    {conversations.length === 0 ? (
                        <div className="p-4 text-center text-cyan-700 text-sm">
                            Belum ada percakapan
                        </div>
                    ) : (
                        <div className="py-2">
                            {conversations.map((conv) => (
                                <ConversationItem
                                    key={conv.id}
                                    conversation={conv}
                                    isActive={conv.id === activeConversationId}
                                    onClick={() => onSelectConversation(conv.id)}
                                    onDelete={(e) => {
                                        e.stopPropagation();
                                        if (confirm('Hapus percakapan ini?')) {
                                            onDeleteConversation(conv.id);
                                        }
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
