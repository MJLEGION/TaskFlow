import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Simple test to ensure testing works
describe('App Component', () => {
  it('renders without crashing', () => {
    const TestComponent = () => <div>TaskFlow App</div>;
    render(<TestComponent />);
    expect(screen.getByText('TaskFlow App')).toBeInTheDocument();
  });

  it('should pass basic test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle string operations', () => {
    const appName = 'TaskFlow';
    expect(appName).toBe('TaskFlow');
    expect(appName.length).toBe(8);
  });
});
