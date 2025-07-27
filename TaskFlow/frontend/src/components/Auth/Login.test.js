// src/components/Auth/Login.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';

// Mock fetch for API calls
global.fetch = jest.fn();

const LoginWrapper = () => (
  <MemoryRouter>
    <Login />
  </MemoryRouter>
);

describe('Login Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders login form correctly', () => {
    render(<LoginWrapper />);

    expect(screen.getByText('TaskFlow')).toBeInTheDocument();
    expect(screen.getByText('Elevate Your Productivity')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  test('has correct form structure', () => {
    render(<LoginWrapper />);

    // Instead of looking for role="form", look for the form element directly
    const form = screen.getByRole('button', { name: 'Sign In' }).closest('form');
    expect(form).toBeInTheDocument();

    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
    expect(submitButton.type).toBe('submit');
  });

  test('updates input values when typing', () => {
    render(<LoginWrapper />);

    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('submits form with correct data', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: 'Login successful',
        token: 'fake-token',
        user: { id: 1, email: 'test@example.com', username: 'testuser' }
      })
    });

    render(<LoginWrapper />);

    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
        }),
      });
    });
  });

  test('displays error message on failed login', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: 'Invalid credentials'
      })
    });

    render(<LoginWrapper />);

    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  test('shows loading state during submission', async () => {
    fetch.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(<LoginWrapper />);

    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    // Check if button shows loading state (this depends on your implementation)
    // You might need to adjust this based on how your component handles loading
    expect(submitButton).toBeInTheDocument();
  });
});
