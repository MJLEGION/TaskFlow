// Mock the API service before importing the component
jest.mock('../../services/api', () => ({
  authAPI: {
    login: jest.fn()
  },
  setToken: jest.fn()
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';

const LoginWrapper = ({ onLogin = jest.fn() }) => (
  <MemoryRouter>
    <Login onLogin={onLogin} />
  </MemoryRouter>
);

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form correctly', () => {
    render(<LoginWrapper />);

    expect(screen.getByText('Sign in to TaskFlow')).toBeInTheDocument();
    expect(screen.getByText('create a new account')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });

  test('has correct form structure', () => {
    render(<LoginWrapper />);

    const form = screen.getByRole('button', { name: 'Sign in' }).closest('form');
    expect(form).toBeInTheDocument();

    const emailInput = screen.getByPlaceholderText('Email address');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign in' });

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
    expect(submitButton.type).toBe('submit');
  });

  test('updates input values when typing', () => {
    render(<LoginWrapper />);

    const emailInput = screen.getByPlaceholderText('Email address');
    const passwordInput = screen.getByPlaceholderText('Password');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('toggles password visibility', () => {
    render(<LoginWrapper />);

    const passwordInput = screen.getByPlaceholderText('Password');
    const toggleButton = screen.getByRole('button', { name: '' }); // Eye icon button

    expect(passwordInput.type).toBe('password');

    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('text');

    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('password');
  });

  test('shows loading state during submission', async () => {
    const { authAPI } = require('../../services/api');
    authAPI.login.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(<LoginWrapper />);

    const emailInput = screen.getByPlaceholderText('Email address');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign in' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(screen.getByText('Signing in...')).toBeInTheDocument();
  });
});
