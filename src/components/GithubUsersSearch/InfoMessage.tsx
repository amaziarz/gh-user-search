import type { QueryStatus } from '@tanstack/react-query';

import Typography from '@mui/material/Typography';
import { match, P } from 'ts-pattern';

type Props = {
  username: string;
  status: QueryStatus;
  usersCount: number;
  totalCount: number;
  error: Error | null;
};

export default function InfoMessage({
  username,
  status,
  usersCount,
  totalCount,
  error,
}: Props) {
  // pattern matching technique
  const message = match({
    status,
    usersCount,
    totalCount,
    error,
    username,
  })
    .with({ username: P.string.length(0) }, () => '')
    .with(
      { status: 'success', usersCount: P.number.gt(0) },
      () =>
        `Found ${totalCount} users matching "${username}" ${totalCount > usersCount ? `, showing ${usersCount}` : ''}`,
    )
    .with(
      { status: 'success', usersCount: 0 },
      () => `No users found for "${username}".`,
    )
    .with(
      { status: 'error', error: P.nonNullable },
      ({ error }) => `Error fetching users: ${error.message}`,
    )
    .otherwise(() => '');

  return message ? (
    <Typography
      color={error ? 'error' : undefined}
      sx={{ ml: 1, mt: 1 }}
      variant="body2"
    >
      {message}
    </Typography>
  ) : null;
}
