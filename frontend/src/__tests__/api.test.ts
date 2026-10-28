import { beforeEach, describe, expect, it, vi } from 'vitest';
import { chatApi } from '../services/api';

// Mock fetch globally
const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

describe('chatApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches all chats', async () => {
    const mockChats = [
      { id: '1', name: 'Test Chat', messages: [], created_at: '2024-01-01', updated_at: '2024-01-01' }
    ];
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockChats),
    });

    const result = await chatApi.getChats();

    expect(result).toEqual(mockChats);
    expect(mockFetch).toHaveBeenCalledWith('http://127.0.0.1:8000/chats');
  });

  it('creates a new chat', async () => {
    const newChat = { id: '2', name: 'New Chat', messages: [], created_at: '2024-01-01', updated_at: '2024-01-01' };
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(newChat),
    });

    const result = await chatApi.createChat('New Chat');

    expect(result).toEqual(newChat);
    expect(mockFetch).toHaveBeenCalledWith('http://127.0.0.1:8000/chats?name=New%20Chat', {
      method: 'POST',
    });
  });

  it('handles API errors', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ detail: 'Server error' }),
    });

    await expect(chatApi.getChats()).rejects.toThrow();
  });

  it('sends a message', async () => {
    const mockAssistantMessage = {
      id: 'assistant-123',
      type: 'assistant',
      content: 'Hello! How can I help you?',
      timestamp: '2024-01-01T10:00:00Z'
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockAssistantMessage),
    });

    const result = await chatApi.sendMessage('1', { content: 'Hello' });

    expect(result).toEqual(mockAssistantMessage);
    expect(mockFetch).toHaveBeenCalledWith('http://127.0.0.1:8000/chats/1/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: 'Hello' }),
    });
  });
});
