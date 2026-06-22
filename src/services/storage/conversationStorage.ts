import type { ChatMessage } from '../api/gemini';

const CONVERSATIONS_KEY = 'buildmate-conversations';
const OLD_STORAGE_KEY = 'gemini-chat-history';

export interface Conversation {
    id: string;
    title: string;
    createdAt: number;
    lastModifiedAt: number;
    messages: ChatMessage[];
}



/**
 * Migrate old single-conversation storage to new multi-conversation format
 */
const migrateOldStorage = (): void => {
    try {
        const oldMessages = localStorage.getItem(OLD_STORAGE_KEY);
        if (!oldMessages) return;

        const messages: ChatMessage[] = JSON.parse(oldMessages);
        if (messages.length === 0) return;

        // Create conversation from old messages
        const conversation: Conversation = {
            id: crypto.randomUUID(),
            title: messages[0]?.text?.substring(0, 50) || 'Percakapan Lama',
            createdAt: messages[0]?.timestamp || Date.now(),
            lastModifiedAt: messages[messages.length - 1]?.timestamp || Date.now(),
            messages: messages,
        };

        // Save to new format
        localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify([conversation]));

        // Remove old storage
        localStorage.removeItem(OLD_STORAGE_KEY);

        console.log('Migrated old chat history to new conversation format');
    } catch (error) {
        console.error('Failed to migrate old storage:', error);
    }
};

/**
 * Get all conversations sorted by last modified (most recent first)
 */
export const getAllConversations = (): Conversation[] => {
    try {
        // Check for migration on first access
        const existing = localStorage.getItem(CONVERSATIONS_KEY);
        if (!existing) {
            migrateOldStorage();
        }

        const stored = localStorage.getItem(CONVERSATIONS_KEY);
        if (!stored) return [];

        const conversations: Conversation[] = JSON.parse(stored);
        return conversations.sort((a, b) => b.lastModifiedAt - a.lastModifiedAt);
    } catch (error) {
        console.error('Failed to load conversations:', error);
        return [];
    }
};

/**
 * Get a specific conversation by ID
 */
export const getConversation = (id: string): Conversation | null => {
    const conversations = getAllConversations();
    return conversations.find(conv => conv.id === id) || null;
};

/**
 * Save or update a conversation
 */
export const saveConversation = (conversation: Conversation): void => {
    try {
        const conversations = getAllConversations();
        const index = conversations.findIndex(conv => conv.id === conversation.id);

        if (index >= 0) {
            // Update existing
            conversations[index] = conversation;
        } else {
            // Add new
            conversations.push(conversation);
        }

        localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
    } catch (error) {
        console.error('Failed to save conversation:', error);
        throw error;
    }
};

/**
 * Delete a conversation by ID
 */
export const deleteConversation = (id: string): void => {
    try {
        const conversations = getAllConversations();
        const filtered = conversations.filter(conv => conv.id !== id);
        localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(filtered));
    } catch (error) {
        console.error('Failed to delete conversation:', error);
        throw error;
    }
};

/**
 * Create a new empty conversation
 */
export const createNewConversation = (): Conversation => {
    const now = Date.now();
    return {
        id: crypto.randomUUID(),
        title: 'Percakapan Baru',
        createdAt: now,
        lastModifiedAt: now,
        messages: [],
    };
};


