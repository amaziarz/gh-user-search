import { yupResolver } from '@hookform/resolvers/yup';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { useState, useEffect } from 'react';
import { useForm, useController } from 'react-hook-form';
import InfiniteScroll from 'react-infinite-scroller';
import * as yup from 'yup';

import GithubUsersList from './GithubUsersList';
import InfoMessage from './InfoMessage';
import { useGithubUsersSearch } from './useGithubUsersSearch';

const DEBOUNCE_DELAY = 2000;

const formSchema = yup.object({
  username: yup
    .string()
    .transform((value: string) => (value === '' ? undefined : value))
    .nullable()
    .test(
      'min-length',
      'Minimum 3 characters',
      (value) => !value || value.length >= 3,
    ),
});

export default function GithubUsersSearch() {
  const {
    control,
    formState: { errors },
    trigger,
  } = useForm({
    defaultValues: {
      username: '',
    },
    resolver: yupResolver(formSchema),
    mode: 'onBlur',
  });
  const { field: usernameField } = useController({
    name: 'username',
    control,
  });
  const { value: username } = usernameField;
  const [debouncedUsername, setDebouncedUsername] = useState(username ?? '');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedUsername(username ?? '');
      void trigger('username');
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [username, trigger]);

  const {
    data,
    error,
    status,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isSuccess,
  } = useGithubUsersSearch({
    username: debouncedUsername,
    enabled: !!debouncedUsername && !errors.username,
  });

  const users = isSuccess ? data.pages.flatMap((page) => page.items) : [];
  const totalCount =
    isSuccess && data.pages.length > 0 ? data.pages[0].total_count : 0;

  const shouldRenderUsersList =
    !errors.username && isSuccess && users.length > 0;
  const shouldRenderInputLoader =
    isFetching || (!!username && username !== debouncedUsername);

  return (
    <Box
      component="section"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        py: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <TextField
          {...usernameField}
          label="GitHub Username"
          placeholder="Search for a GitHub user..."
          autoComplete="off"
          error={!!errors.username}
          helperText={errors.username?.message}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  {shouldRenderInputLoader && <CircularProgress size={20} />}
                </InputAdornment>
              ),
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            maxWidth: '100%',
            transition: 'width 0.3s ease',
            width: {
              sm: '400px',
              xs: '100%',
            },
          }}
        />
        <InfoMessage
          username={debouncedUsername}
          status={status}
          usersCount={users.length}
          totalCount={totalCount}
          error={error}
        />
      </Box>
      {shouldRenderUsersList && (
        <Box sx={{ maxHeight: '70vh', overflow: 'auto' }}>
          <InfiniteScroll
            loadMore={() => hasNextPage && !isFetching && fetchNextPage()}
            hasMore={hasNextPage}
            pageStart={0}
            useWindow={false}
            loader={
              <Box
                key="loader"
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  p: 2,
                }}
              >
                <CircularProgress size={30} />
              </Box>
            }
          >
            <GithubUsersList users={users} />
          </InfiniteScroll>
        </Box>
      )}
    </Box>
  );
}
