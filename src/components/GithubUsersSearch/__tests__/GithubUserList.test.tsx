import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';

import type { GithubUser } from '../githubApiSchema';

import GithubUserSearchList from '../GithubUsersList';

const mockUsers = [
  {
    id: 1,
    login: 'user1',
    avatar_url: 'https://example.com/avatar1.png',
    html_url: 'https://github.com/user1',
    type: 'User',
  },
  {
    id: 2,
    login: 'user2',
    avatar_url: 'https://example.com/avatar2.png',
    html_url: 'https://github.com/user2',
    type: 'User',
  },
] satisfies GithubUser[];

test('should render user list items', () => {
  render(<GithubUserSearchList users={mockUsers} />);

  expect(screen.getAllByRole('listitem')).toHaveLength(mockUsers.length);
  expect(screen.getByText(/user1/i)).toBeInTheDocument();
  expect(screen.getByText(/user2/i)).toBeInTheDocument();
});

test('should render user links with correct href and target attributes', () => {
  render(<GithubUserSearchList users={mockUsers} />);

  const user1Link = screen.getByRole('link', { name: /user1/i });
  const user2Link = screen.getByRole('link', { name: /user2/i });

  expect(user1Link).toHaveAttribute('href', 'https://github.com/user1');
  expect(user1Link).toHaveAttribute('target', '_blank');
  expect(user2Link).toHaveAttribute('href', 'https://github.com/user2');
  expect(user2Link).toHaveAttribute('target', '_blank');
});

test('should render an empty list when no users provided', () => {
  render(<GithubUserSearchList users={[]} />);

  expect(screen.getByRole('list')).toBeInTheDocument();
  expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
});
