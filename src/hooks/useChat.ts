import { useState, useEffect, useCallback, useRef } from 'react';
import { type ChatMessage, generateResponse } from '../lib/gemini';
import {
    type Conversation,
    getAllConversations,
    saveConversation,
    deleteConversation as deleteConversationFromStorage,
    createNewConversation as createConversation,
    updateConversationTitle,
} from '../lib/conversationStorage';

export const useChat = () => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    // Load conversations on mount
    useEffect(() => {
        const loadedConversations = getAllConversations();

        if (loadedConversations.length === 0) {
            // Create initial conversation for new users
            const newConv = createConversation();
            saveConversation(newConv);
            setConversations([newConv]);
            setActiveConversationId(newConv.id);
        } else {
            setConversations(loadedConversations);
            // Set most recent conversation as active
            setActiveConversationId(loadedConversations[0].id);
        }
    }, []);

    // Get active conversation
    const activeConversation = conversations.find(conv => conv.id === activeConversationId);
    const messages = activeConversation?.messages || [];

    // Save active conversation whenever it changes
    const saveActiveConversation = useCallback((updatedMessages: ChatMessage[]) => {
        if (!activeConversationId) return;

        const now = Date.now();
        let updatedConversation: Conversation = {
            ...(activeConversation || createConversation()),
            id: activeConversationId,
            messages: updatedMessages,
            lastModifiedAt: now,
        };

        // Always update title based on messages (will use first user message)
        if (updatedMessages.length > 0) {
            updatedConversation = updateConversationTitle(updatedConversation);
        }

        saveConversation(updatedConversation);

        // Update local state
        setConversations(prev => {
            const index = prev.findIndex(conv => conv.id === activeConversationId);
            if (index >= 0) {
                const updated = [...prev];
                updated[index] = updatedConversation;
                // Re-sort by lastModifiedAt
                return updated.sort((a, b) => b.lastModifiedAt - a.lastModifiedAt);
            }
            return [updatedConversation, ...prev];
        });
    }, [activeConversationId, activeConversation]);

    const clearHistory = useCallback(() => {
        if (!activeConversationId) return;

        // Delete current conversation
        deleteConversationFromStorage(activeConversationId);

        // Create new conversation
        const newConv = createConversation();
        saveConversation(newConv);

        setConversations(prev => {
            const filtered = prev.filter(conv => conv.id !== activeConversationId);
            return [newConv, ...filtered];
        });
        setActiveConversationId(newConv.id);
    }, [activeConversationId]);

    const stopGeneration = useCallback(() => {
        console.log('[useChat] stopGeneration called, abortController exists:', !!abortControllerRef.current);
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
            setIsLoading(false);
            console.log('[useChat] Request aborted, isLoading set to false');
        }
    }, []);

    const sendMessage = useCallback(async (text: string) => {
        if (!text.trim() || !activeConversationId) return;

        const newUserMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: 'user',
            text: text,
            timestamp: Date.now(),
        };

        // Optimistically add user message
        const updatedMessagesWithUser = [...messages, newUserMessage];
        saveActiveConversation(updatedMessagesWithUser);

        console.log('[useChat] sendMessage starting, setting isLoading true');
        setInput('');
        setIsLoading(true);
        setError(null);

        // Create new AbortController for this request
        abortControllerRef.current = new AbortController();
        console.log('[useChat] AbortController created');

        try {
            const responseText = await generateResponse(messages, text, abortControllerRef.current.signal);

            const newAiMessage: ChatMessage = {
                id: crypto.randomUUID(),
                role: 'model',
                text: responseText,
                timestamp: Date.now(),
            };

            const updatedMessagesWithAi = [...updatedMessagesWithUser, newAiMessage];
            saveActiveConversation(updatedMessagesWithAi);
            console.log('[useChat] Response received and saved');
        } catch (err: any) {
            // Don't show error if request was aborted by user
            if (err.name !== 'AbortError') {
                setError(err.message || 'Something went wrong');
                console.error('[useChat] Error:', err);
            } else {
                console.log('[useChat] Request was aborted by user');
            }
        } finally {
            setIsLoading(false);
            abortControllerRef.current = null;
            console.log('[useChat] Request completed, isLoading set to false');
        }
    }, [messages, activeConversationId, saveActiveConversation]);

    const switchConversation = useCallback((conversationId: string) => {
        setActiveConversationId(conversationId);
        setError(null);
    }, []);

    const createNewConversation = useCallback(() => {
        const newConv = createConversation();
        saveConversation(newConv);
        setConversations(prev => [newConv, ...prev]);
        setActiveConversationId(newConv.id);
        setError(null);
    }, []);

    const deleteConversation = useCallback((conversationId: string) => {
        deleteConversationFromStorage(conversationId);

        setConversations(prev => {
            const filtered = prev.filter(conv => conv.id !== conversationId);

            // If deleting active conversation, switch to another or create new
            if (conversationId === activeConversationId) {
                if (filtered.length > 0) {
                    setActiveConversationId(filtered[0].id);
                } else {
                    // No conversations left, create a new one
                    const newConv = createConversation();
                    saveConversation(newConv);
                    setActiveConversationId(newConv.id);
                    return [newConv];
                }
            }

            return filtered;
        });
    }, [activeConversationId]);

    return {
        // Conversation management
        conversations,
        activeConversationId,
        switchConversation,
        createNewConversation,
        deleteConversation,

        // Messages (from active conversation)
        messages,
        input,
        setInput,
        isLoading,
        error,
        sendMessage,
        clearHistory,
        stopGeneration,
    };
};

