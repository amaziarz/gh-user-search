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

export default function InfoMessage(props: Props) {
  // pattern matching technique
  const message = match(props)
    .with({ username: P.string.length(0) }, () => '')
    .with(
      { status: 'success', usersCount: P.number.gt(0) },
      ({ totalCount, username, usersCount }) =>
        `Found ${totalCount} users matching "${username}" ${totalCount > usersCount ? `, showing ${usersCount}` : ''}`,
    )
    .with(
      { status: 'success', usersCount: 0 },
      ({ username }) => `No users found for "${username}".`,
    )
    .with(
      { status: 'error', error: P.nonNullable },
      ({ error }) => error.message,
    )
    .otherwise(() => '');

  return message ? (
    <Typography
      variant="body2"
      color={props.error ? 'error' : undefined}
      sx={{ pl: 1 }}
    >
      {message}
    </Typography>
  ) : null;
}
