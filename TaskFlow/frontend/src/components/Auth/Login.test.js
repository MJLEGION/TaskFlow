import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import App from '../../App';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Wrapper component for Router
const AppWrapper = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

describe('Login Component', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue(null);
    jest.clearAllMocks();
  });

  it('renders login form correctly', () => {
    render(<App />, { wrapper: AppWrapper });
    
    expect(screen.getByText('TaskFlow')).toBeInTheDocument();
    expect(screen.getByText('Elevate Your Productivity')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows validation error for empty fields', async () => {
    render(<App />, { wrapper: AppWrapper });
    
    const signInButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(screen.getByText('Please fill in all required fields')).toBeInTheDocument();
    });
  });

  it('toggles password visibility', () => {
    render(<App />, { wrapper: AppWrapper });
    
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const toggleButton = screen.getByRole('button', { name: '' }); // Eye icon button
    
    expect(passwordInput.type).toBe('password');
    
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('text');
    
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('password');
  });

  it('switches between login and registration modes', () => {
    render(<App />, { wrapper: AppWrapper });
    
    // Initially in login mode
    expect(screen.getByText('Elevate Your Productivity')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Enter your full name')).not.toBeInTheDocument();
    
    // Switch to registration
    const switchButton = screen.getByText(/don't have an account/i);
    fireEvent.click(switchButton);
    
    expect(screen.getByText('Join TaskFlow Today')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your full name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm your password')).toBeInTheDocument();
  });

  it('validates registration form correctly', async () => {
    render(<App />, { wrapper: AppWrapper });
    
    // Switch to registration mode
    const switchButton = screen.getByText(/don't have an account/i);
    fireEvent.click(switchButton);
    
    const signUpButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(signUpButton);

    await waitFor(() => {
      expect(screen.getByText('Please fill in all required fields')).toBeInTheDocument();
    });
  });

  it('validates password confirmation in registration', async () => {
    render(<App />, { wrapper: AppWrapper });
    
    // Switch to registration mode
    const switchButton = screen.getByText(/don't have an account/i);
    fireEvent.click(switchButton);
    
    // Fill form with mismatched passwords
    fireEvent.change(screen.getByPlaceholderText('Enter your full name'), {
      target: { value: 'Test User' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'password123' }
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), {
      target: { value: 'differentpassword' }
    });
    
    const signUpButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(signUpButton);

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });
  });

  it('validates minimum password length', async () => {
    render(<App />, { wrapper: AppWrapper });
    
    // Switch to registration mode
    const switchButton = screen.getByText(/don't have an account/i);
    fireEvent.click(switchButton);
    
    // Fill form with short password
    fireEvent.change(screen.getByPlaceholderText('Enter your full name'), {
      target: { value: 'Test User' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: '123' }
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), {
      target: { value: '123' }
    });
    
    const signUpButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(signUpButton);

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters long')).toBeInTheDocument();
    });
  });

  it('shows loading state during form submission', async () => {
    render(<App />, { wrapper: AppWrapper });
    
    // Fill valid login form
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'password123' }
    });
    
    const signInButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(signInButton);

    // Should show loading state
    expect(screen.getByText('Signing you in...')).toBeInTheDocument();
    expect(signInButton).toBeDisabled();
  });

  it('toggles theme correctly', () => {
    render(<App />, { wrapper: AppWrapper });
    
    const themeToggle = screen.getByRole('button', { name: '' }); // Theme toggle button
    
    // Initial state should be dark mode
    expect(document.querySelector('.bg-gradient-to-br.from-slate-900')).toBeInTheDocument();
    
    fireEvent.click(themeToggle);
    
    // Should switch to light mode
    expect(document.querySelector('.bg-gradient-to-br.from-blue-50')).toBeInTheDocument();
  });
});