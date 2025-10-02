import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ChatProvider, useChat } from '../contexts/ChatContext';

// Mock the API
vi.mock('../services/api', () => ({
  chatApi: {
    getChats: vi.fn(),
    getChat: vi.fn(),
    createChat: vi.fn(),
    deleteChat: vi.fn(),
    sendMessage: vi.fn(),
  },
}));

// Test component that uses the chat context
const TestComponent = () => {
  const { chats, currentChat, loadChats, createNewChat, sendMessage } = useChat();
  
  return (
    <div>
      <div data-testid="chats-count">{chats.length}</div>
      <div data-testid="current-chat">{currentChat?.name || 'no-chat'}</div>
      <button onClick={loadChats}>Load Chats</button>
      <button onClick={() => createNewChat('New Chat')}>Create Chat</button>
      <button onClick={() => sendMessage('Hello')}>Send Message</button>
    </div>
  );
};

describe('ChatContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('starts with empty state', () => {
    render(
      <ChatProvider>
        <TestComponent />
      </ChatProvider>
    );
    
    expect(screen.getByTestId('chats-count')).toHaveTextContent('0');
    expect(screen.getByTestId('current-chat')).toHaveTextContent('no-chat');
  });

  it('renders chat context provider', () => {
    render(
      <ChatProvider>
        <TestComponent />
      </ChatProvider>
    );
    
    expect(screen.getByTestId('chats-count')).toHaveTextContent('0');
    expect(screen.getByTestId('current-chat')).toHaveTextContent('no-chat');
  });
});
