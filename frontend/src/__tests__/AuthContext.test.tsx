import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

// Test component that uses the auth context
const TestComponent = () => {
  const { isAuthenticated, user, login, signup, logout } = useAuth();
  
  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? 'authenticated' : 'not-authenticated'}</div>
      <div data-testid="user-info">{user ? `${user.firstName} ${user.lastName}` : 'no-user'}</div>
      <button onClick={() => login('test@example.com', 'password')}>Login</button>
      <button onClick={() => signup({ firstName: 'John', lastName: 'Doe', email: 'john@example.com', password: 'password123' })}>Signup</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts unauthenticated', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated');
    expect(screen.getByTestId('user-info')).toHaveTextContent('no-user');
  });

  it('signs up a new user', async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    const signupButton = screen.getByText('Signup');
    await user.click(signupButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
      expect(screen.getByTestId('user-info')).toHaveTextContent('John Doe');
    });
  });

  it('logs out user', async () => {
    const user = userEvent.setup();
    
    // First signup
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    await user.click(screen.getByText('Signup'));
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
    });
    
    // Then logout
    await user.click(screen.getByText('Logout'));
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated');
    });
  });
});
