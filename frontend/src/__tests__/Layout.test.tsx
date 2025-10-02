import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Layout from '../components/Layout';

// Mock the child components
vi.mock('../components/Sidebar', () => ({
  default: () => <div data-testid="sidebar">Sidebar</div>,
}));

vi.mock('../components/ChatWindow', () => ({
  default: () => <div data-testid="chat-window">ChatWindow</div>,
}));

describe('Layout', () => {
  it('renders sidebar and chat window', () => {
    render(<Layout />);
    
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('chat-window')).toBeInTheDocument();
  });

  it('renders without crashing', () => {
    expect(() => render(<Layout />)).not.toThrow();
  });
});
