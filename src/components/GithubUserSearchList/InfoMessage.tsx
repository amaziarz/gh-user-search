import type { QueryStatus } from '@tanstack/react-query';

import Typography from '@mui/material/Typography';
import { match, P } from 'ts-pattern';

type Props = {
  username: string;
  status: QueryStatus;
  itemsCount: number;
  totalCount: number;
  error: Error | null;
};

export default function InfoMessage({
  username,
  status,
  itemsCount,
  totalCount,
  error,
}: Props) {
  // pattern matching technique
  const message = match({
    status,
    itemsCount,
    totalCount,
    error,
    username,
  })
    .with({ username: P.string.length(0) }, () => '')
    .with(
      { status: 'success', itemsCount: P.number.gt(0) },
      () =>
        `Found ${totalCount} users matching "${username}" ${totalCount > itemsCount ? `, showing ${itemsCount}` : ''}`,
    )
    .with(
      { status: 'success', itemsCount: 0 },
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
