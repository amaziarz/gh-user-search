import { useDebounce } from '@/utils/useDebounce';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import InfiniteScroll from 'react-infinite-scroller';

import type { GithubUser } from './types';

import GithubUsersList from './GithubUsersList';
import { useGithubUsersSearch } from './useGithubUsersSearch';

const DEBOUNCE_DELAY = 2000;

type FormValues = {
  username: string;
};

export default function GithubUserSearchList() {
  const { register, watch } = useForm<FormValues>({
    defaultValues: {
      username: '',
    },
  });
  const username = watch('username');
  const debouncedUsername = useDebounce(username, DEBOUNCE_DELAY);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetching,
    isSuccess,
    refetch,
  } = useGithubUsersSearch(debouncedUsername);

  useEffect(() => {
    if (debouncedUsername) {
      void refetch();
    }
  }, [debouncedUsername, refetch]);

  const allUsers: GithubUser[] = isSuccess
    ? data.pages.flatMap((page) => page.items)
    : [];

  const totalCount =
    isSuccess && data.pages.length > 0 ? data.pages[0].total_count : 0;

  return (
    <Box component="section">
      <Box autoComplete="off" component="form" noValidate sx={{ mt: 2 }}>
        <TextField
          {...register('username')}
          label="GitHub Username"
          placeholder="Search for a GitHub user..."
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  {isFetching && <CircularProgress size={20} />}
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
      </Box>
      {isSuccess && allUsers.length > 0 && (
        <>
          <Typography sx={{ ml: 1, mt: 1 }} variant="body2">
            Found {totalCount} users matching "{debouncedUsername}"
            {totalCount > allUsers.length && `, showing ${allUsers.length}`}
          </Typography>
          <Box sx={{ maxHeight: '70vh', mt: 2, overflow: 'auto' }}>
            <InfiniteScroll
              hasMore={hasNextPage}
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
              loadMore={() => hasNextPage && fetchNextPage()}
              pageStart={0}
              useWindow={false}
            >
              <GithubUsersList users={allUsers} />
            </InfiniteScroll>
          </Box>
        </>
      )}
      {isSuccess && allUsers.length === 0 && (
        <Typography sx={{ ml: 1, mt: 1 }} variant="body2">
          No users found for {debouncedUsername}.
        </Typography>
      )}
      {isError && (
        <Typography color="error" sx={{ ml: 1, mt: 1 }} variant="body2">
          Error fetching users: {error.message}
        </Typography>
      )}
    </Box>
  );
}
