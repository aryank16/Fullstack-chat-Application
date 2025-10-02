import React, { useEffect, useRef, useState } from 'react';
import { useChat } from '../contexts/ChatContext';
import ChatMessage from './ChatMessage';
import QuickActions from './QuickActions';

const ChatWindow: React.FC = () => {
  const { currentChat, sendMessage, isSendingMessage, error } = useChat();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

   // Auto-scroll when chat messages change
  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSendingMessage) return;
    
    const messageToSend = message.trim();
    setMessage('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    
    await sendMessage(messageToSend);
  };


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  const handleQuickAction = (action: string) => {
    setMessage(action);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  if (!currentChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
           {/* Logo icon */}
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-gray-200 mb-4">
           <img src="/public/favicon.png" alt="Chat icon" className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to Eraneos Chat</h3>
          <p className="text-gray-500">Select a chat from the sidebar or create a new one to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Chat Header */}
      <div className="border-b border-gray-200  p-4">
        <h2 className="text-lg font-semibold text-gray-900">{currentChat.name}</h2>
        <p className="text-sm text-gray-500">
          {currentChat.messages.length} messages • 
          Last updated {new Date(currentChat.updated_at).toLocaleString()}
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {currentChat.messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-orange-400 mb-4">
              <svg className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Start a conversation</h3>
            <p className="text-gray-500 mb-4">Send a message to begin chatting with the assistant.</p>
            <QuickActions onAction={handleQuickAction} />
          </div>
        ) : (
          <>
            {/* Render all messages */}
            {currentChat.messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {/* Show "typing..." animation while sending */}
            {isSendingMessage && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="flex-1  relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyPress={handleKeyPress}
              placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
              className="w-full overflow-hidden px-4 py-3 border border-orange-600 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              rows={1}
              disabled={isSendingMessage}
            />
          </div>
           {/* Send Button */}
          <button
            type="submit"
            disabled={!message.trim() || isSendingMessage}
            className="px-6  mb-1 bg-orange-500 text-white rounded-full hover:bg-black disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isSendingMessage ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending...
              </div>
            ) : (
              'Send'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
