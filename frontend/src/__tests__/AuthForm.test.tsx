import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import AuthForm from '../components/AuthForm';

// Mock the AuthContext
const mockLogin = vi.fn();
const mockSignup = vi.fn();

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
    signup: mockSignup,
    isLoading: false,
  }),
}));

describe('AuthForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form by default', () => {
    render(<AuthForm />);
    
    expect(screen.getByText('Eraneos Analytics')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('switches to signup form', async () => {
    const user = userEvent.setup();
    render(<AuthForm />);
    
    const signUpLink = screen.getByText('Sign Up');
    await user.click(signUpLink);
    
    expect(screen.getByText('Create your account')).toBeInTheDocument();
    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
  });

  it('renders form fields correctly', () => {
    render(<AuthForm />);
    
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('calls login with correct data', async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue(true);
    render(<AuthForm />);
    
    await user.type(screen.getByLabelText('Email Address'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    
    const submitButton = screen.getByRole('button', { name: 'Sign In' });
    await user.click(submitButton);
    
    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
  });
});
