import { render, screen } from '@testing-library/react';
import Dashboard from './dashboard';

test('renders dashboard title', () => {
  render(<Dashboard />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
