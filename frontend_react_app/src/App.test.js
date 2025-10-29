import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app title in navbar', () => {
  render(<App />);
  const title = screen.getByText(/Ticket Metrics Dashboard/i);
  expect(title).toBeInTheDocument();
});
