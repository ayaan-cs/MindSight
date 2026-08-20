import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

test('renders the redesigned MindSight shell', () => {
  render(<App />);
  expect(screen.getByText(/EEG viewer & interpreter/i)).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /see what a brain recording actually looks like/i })).toBeInTheDocument();
  expect(screen.getByRole('navigation', { name: /main/i })).toBeInTheDocument();
  expect(screen.getByText(/alpha 8–13 hz/i)).toBeInTheDocument();
});

test('navigates to load data and opens a recording in the workspace', () => {
  render(<App />);

  userEvent.click(screen.getByRole('link', { name: /load data/i }));
  expect(screen.getByRole('heading', { name: /what would you like to look at/i })).toBeInTheDocument();

  userEvent.click(screen.getByRole('button', { name: /resting state, eyes closed/i }));
  expect(screen.getByRole('heading', { name: /the wave itself/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /what we measured/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /what it might mean/i })).toBeInTheDocument();
});
