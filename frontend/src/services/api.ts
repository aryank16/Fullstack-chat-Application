import type { Chat, ChatMessage, SendMessageRequest } from '../types/index.ts';

const API_BASE_URL = 'http://127.0.0.1:8000';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new ApiError(response.status, errorData.detail || 'Request failed');
  }
  return response.json();
}

export const chatApi = {
  // Get all chats
  async getChats(): Promise<Array<Chat>> {
    const response = await fetch(`${API_BASE_URL}/chats`);
    return handleResponse<Array<Chat>>(response);
  },



  // Get a specific chat
  async getChat(chatId: string): Promise<Chat> {
    const response = await fetch(`${API_BASE_URL}/chats/${chatId}`);
    return handleResponse<Chat>(response);
  },

  // Create a new chat
  async createChat(name: string = 'New Chat'): Promise<Chat> {
    const response = await fetch(`${API_BASE_URL}/chats?name=${encodeURIComponent(name)}`, {
      method: 'POST',
    });
    return handleResponse<Chat>(response);
  },

  

  // Delete a chat
  async deleteChat(chatId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/chats/${chatId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'An error occurred' }));
      throw new ApiError(response.status, errorData.detail || 'Delete failed');
    }
  },

  // Send a message (calls real backend endpoint)
  async sendMessage(chatId: string, request: SendMessageRequest): Promise<ChatMessage> {
    const response = await fetch(`${API_BASE_URL}/chats/${chatId}/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    return handleResponse<ChatMessage>(response);
  },
};

export { ApiError };
