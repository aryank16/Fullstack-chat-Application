import React, { createContext,  useContext, useEffect, useState } from 'react';
import { chatApi } from '../services/api';
import type { Chat } from '../types/index.ts';
import type { ReactNode } from 'react';

// Define the shape of the context
interface ChatContextType {
  chats: Array<Chat>;
  currentChat: Chat | null;
  isLoading: boolean;
  error: string | null;
  loadChats: () => Promise<void>;
  selectChat: (chatId: string) => Promise<void>;
  createNewChat: (name?: string) => Promise<Chat>;
  deleteChat: (chatId: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  isSendingMessage: boolean;
}

// Create Context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Custom hook to consume context safely
export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

// Props for Provider
interface ChatProviderProps {
  children: ReactNode;
}

// Provider component
export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [chats, setChats] = useState<Array<Chat>>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSendingMessage, setIsSendingMessage] = useState(false);

// Load all chats
  const loadChats = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const chatsData = await chatApi.getChats();
      setChats(chatsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load chats');
      console.error('Error loading chats:', err);
    } finally {
      setIsLoading(false);
    }
  };

// Select a chat by ID
  const selectChat = async (chatId: string) => {
    if (currentChat?.id === chatId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const chat = await chatApi.getChat(chatId);
      setCurrentChat(chat);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load chat');
      console.error('Error loading chat:', err);
    } finally {
      setIsLoading(false);
    }
  };

// Create a new chat
  const createNewChat = async (name: string = ' '): Promise<Chat> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newChat = await chatApi.createChat(name);
      setChats(prev => [newChat, ...prev]);
      setCurrentChat(newChat);
      return newChat;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create chat');
      console.error('Error creating chat:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };


// Delete a chat
  const deleteChat = async (chatId: string) => {
    setError(null);
    
    try {
      await chatApi.deleteChat(chatId);
      setChats(prev => prev.filter(chat => chat.id !== chatId));
      
      if (currentChat?.id === chatId) {
        setCurrentChat(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete chat');
      console.error('Error deleting chat:', err);
    }
  };

// Send a message in the current chat
  const sendMessage = async (content: string) => {
    if (!currentChat || !content.trim()) return;
    
    setIsSendingMessage(true);
    setError(null);
    
    // Create user message immediately
    const userMessage = {
      id: `user-${Date.now()}`,
      type: 'user' as const,
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };
    
    // Add user message to UI immediately
    const updatedChatWithUserMessage = {
      ...currentChat,
      messages: [...currentChat.messages, userMessage],
      updated_at: new Date().toISOString(),
    };
    
    setCurrentChat(updatedChatWithUserMessage);
    setChats(prev => prev.map(chat => 
      chat.id === currentChat.id ? updatedChatWithUserMessage : chat
    ));
    
    try {
      // Send message to backend (backend will add assistant message after delay)
      const assistantMessage = await chatApi.sendMessage(currentChat.id, { content: content.trim() });
      
      // Add assistant message to UI
      const finalUpdatedChat = {
        ...updatedChatWithUserMessage,
        messages: [...updatedChatWithUserMessage.messages, assistantMessage],
        updated_at: new Date().toISOString(),
      };
      
      setCurrentChat(finalUpdatedChat);
      setChats(prev => prev.map(chat => 
        chat.id === currentChat.id ? finalUpdatedChat : chat
      ));
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      console.error('Error sending message:', err);
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Load chats on mount
  useEffect(() => {
    loadChats();
  }, []);

  
  // Provide context value
  const value: ChatContextType = {
    chats,
    currentChat,
    isLoading,
    error,
    loadChats,
    selectChat,
    createNewChat,
    deleteChat,
    sendMessage,
    isSendingMessage,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
