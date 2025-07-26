import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Simple Login component for testing
const Login = ({ onLogin }) => (
  <div>
    <h1>TaskFlow</h1>
    <p>Elevate Your Productivity</p>
    <form>
      <input type="email" placeholder="Enter your email" />
      <input type="password" placeholder="Enter your password" />
      <button type="submit">Sign In</button>
    </form>
  </div>
);

describe('Login Component', () => {
  it('renders login form correctly', () => {
    render(<Login />);
    
    expect(screen.getByText('TaskFlow')).toBeInTheDocument();
    expect(screen.getByText('Elevate Your Productivity')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('has correct form structure', () => {
    render(<Login />);
    
    const form = screen.getByRole('form');
    expect(form).toBeInTheDocument();
    
    const emailInput = screen.getByPlaceholderText('Enter your email');
    expect(emailInput).toHaveAttribute('type', 'email');
    
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('renders submit button', () => {
    render(<Login />);
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    expect(submitButton).toHaveAttribute('type', 'submit');
  });
});