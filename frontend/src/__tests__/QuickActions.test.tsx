import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import QuickActions from '../components/QuickActions';

describe('QuickActions', () => {
  it('renders quick action buttons', () => {
    const mockOnAction = vi.fn();
    render(<QuickActions onAction={mockOnAction} />);
    
    expect(screen.getByText('Quick Actions:')).toBeInTheDocument();
    expect(screen.getByText('Hi! What can you help me with?')).toBeInTheDocument();
  });

  it('calls onAction when button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnAction = vi.fn();
    
    render(<QuickActions onAction={mockOnAction} />);
    
    const button = screen.getByText('Hi! What can you help me with?');
    await user.click(button);
    
    expect(mockOnAction).toHaveBeenCalledWith('Hi! What can you help me with?');
  });

  it('renders all 6 quick actions', () => {
    const mockOnAction = vi.fn();
    render(<QuickActions onAction={mockOnAction} />);
    
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(6);
  });
});
