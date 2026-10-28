export interface ChatMessage {
  id: string;
  type: 'assistant' | 'user';
  content: string;
  timestamp: string;
}

export interface Chat {
  id: string;
  name: string;
  messages: Array<ChatMessage>;
  created_at: string;
  updated_at: string;
}

export interface SendMessageRequest {
  content: string;
}

export interface UpdateChatRequest {
  name: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}
