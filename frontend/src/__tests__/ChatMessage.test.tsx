import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ChatMessage from '../components/ChatMessage';

describe('ChatMessage', () => {
  it('renders user message', () => {
    const message = {
      id: '1',
      type: 'user' as const,
      content: 'Hello world!',
      timestamp: '2024-01-01T10:00:00Z',
    };

    render(<ChatMessage message={message} />);
    
    expect(screen.getByText('Hello world!')).toBeInTheDocument();
  });

  it('renders assistant message', () => {
    const message = {
      id: '2',
      type: 'assistant' as const,
      content: 'Hi! How can I help you?',
      timestamp: '2024-01-01T10:01:00Z',
    };

    render(<ChatMessage message={message} />);
    
    expect(screen.getByText('Hi! How can I help you?')).toBeInTheDocument();
  });

  it('shows timestamp', () => {
    const message = {
      id: '1',
      type: 'user' as const,
      content: 'Test message',
      timestamp: '2024-01-01T10:30:00Z',
    };

    render(<ChatMessage message={message} />);
    
    // The timestamp should be displayed (it shows as 11:30 AM in the test output)
    expect(screen.getByText(/AM/)).toBeInTheDocument();
  });
});
