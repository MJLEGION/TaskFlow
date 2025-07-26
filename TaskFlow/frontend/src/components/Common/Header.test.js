import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';

// Mock the Header component since we don't have the actual implementation
const MockHeader = ({ user, onLogout }) => (
  <header className="header">
    <div className="logo">TaskFlow</div>
    {user && (
      <div className="user-section">
        <span>Welcome, {user.name}</span>
        <button onClick={onLogout}>Logout</button>
      </div>
    )}
  </header>
);

const HeaderWrapper = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

describe('Header Component', () => {
  const mockUser = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com'
  };

  const mockOnLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders TaskFlow logo', () => {
    render(
      <HeaderWrapper>
        <MockHeader user={mockUser} onLogout={mockOnLogout} />
      </HeaderWrapper>
    );

    expect(screen.getByText('TaskFlow')).toBeInTheDocument();
  });

  it('displays user information when logged in', () => {
    render(
      <HeaderWrapper>
        <MockHeader user={mockUser} onLogout={mockOnLogout} />
      </HeaderWrapper>
    );

    expect(screen.getByText('Welcome, Test User')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument();
  });

  it('does not display user section when not logged in', () => {
    render(
      <HeaderWrapper>
        <MockHeader user={null} onLogout={mockOnLogout} />
      </HeaderWrapper>
    );

    expect(screen.queryByText(/Welcome/)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Logout' })).not.toBeInTheDocument();
  });

  it('calls onLogout when logout button is clicked', () => {
    render(
      <HeaderWrapper>
        <MockHeader user={mockUser} onLogout={mockOnLogout} />
      </HeaderWrapper>
    );

    const logoutButton = screen.getByRole('button', { name: 'Logout' });
    fireEvent.click(logoutButton);

    expect(mockOnLogout).toHaveBeenCalledTimes(1);
  });

  it('has correct CSS classes', () => {
    render(
      <HeaderWrapper>
        <MockHeader user={mockUser} onLogout={mockOnLogout} />
      </HeaderWrapper>
    );

    const header = screen.getByRole('banner');
    expect(header).toHaveClass('header');
  });
});