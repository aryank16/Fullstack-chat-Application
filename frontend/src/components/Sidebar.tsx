import React, { useState } from 'react';
import { useChat } from '../contexts/ChatContext';
import { useAuth } from '../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const { chats, currentChat, selectChat, createNewChat, deleteChat, isLoading } = useChat();
  const { user, logout } = useAuth();
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [newChatName, setNewChatName] = useState('');

  const handleCreateChat = async () => {
    if (!newChatName.trim()) return;
    
    setIsCreatingChat(true);
    try {
      await createNewChat(newChatName.trim());
      setNewChatName('');
    } catch (error) {
      console.error('Failed to create chat:', error);
    } finally {
      setIsCreatingChat(false);
    }
  };

  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this chat?')) {
      await deleteChat(chatId);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="w-80 bg-black text-white flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Eraneos Chat</h1>
          <button
            onClick={logout}
            className="text-gray-400 hover:text-orange-400 transition-colors"
            title="Logout"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            LogOut
          </button>
        </div>
        
        {/* User info */}
        <div className="text-sm text-gray-300">
          <p className="font-medium">{user?.firstName} {user?.lastName}</p>
          <p className="text-gray-400">{user?.email}</p>
        </div>
      </div>

      {/* New Chat Section */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="New chat name..."
            value={newChatName}
            onChange={(e) => setNewChatName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCreateChat()}
            className="flex-1 px-3 py-2 bg-black border border-orange-600 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            disabled={isCreatingChat}
          />
          <button
            onClick={handleCreateChat}
            disabled={!newChatName.trim() || isCreatingChat}
            className="px-3 py-2 bg-orange-500 hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
          >
            {isCreatingChat ? '...' : '+'}
          </button>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto dark-scrollbar">
        {isLoading ? (
          <div className="p-4 text-center text-gray-400">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto"></div>
            <p className="mt-2">Loading chats...</p>
          </div>
        ) : chats.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            <p>No chats yet. Create your first chat!</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => selectChat(chat.id)}
                className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                  currentChat?.id === chat.id
                    ? 'bg-orange-500 text-white'
                    : 'hover:bg-gray-800 text-gray-300'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{chat.name}</p>
                  <p className="text-xs opacity-75">
                    {formatDate(chat.updated_at)} • {chat.messages.length} messages
                  </p>
                </div>
                <button
                  onClick={(e) => handleDeleteChat(chat.id, e)}
                  className="opacity-0 group-hover:opacity-100 ml-2 p-1 hover:bg-black rounded transition-all"
                  title="Delete chat"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
