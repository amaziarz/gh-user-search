import { useDebounce } from '@/utils/useDebounce';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import InfiniteScroll from 'react-infinite-scroller';

import GithubUsersList from './GithubUsersList';
import InfoMessage from './InfoMessage';
import { useGithubUsersSearch } from './useGithubUsersSearch';

const DEBOUNCE_DELAY = 500;

type FormValues = {
  username: string;
};

export default function GithubUsersSearch() {
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
    status,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isSuccess,
    refetch,
  } = useGithubUsersSearch(debouncedUsername);

  useEffect(() => {
    if (debouncedUsername) {
      void refetch();
    }
  }, [debouncedUsername, refetch]);

  const users = isSuccess ? data.pages.flatMap((page) => page.items) : [];
  const totalCount =
    isSuccess && data.pages.length > 0 ? data.pages[0].total_count : 0;
  const shouldRenderUsersList = !!username && isSuccess && users.length > 0;

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
      <InfoMessage
        username={username}
        status={status}
        usersCount={users.length}
        totalCount={totalCount}
        error={error}
      />
      {shouldRenderUsersList && (
        <>
          <Box sx={{ maxHeight: '70vh', mt: 2, overflow: 'auto' }}>
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
        </>
      )}
    </Box>
  );
}
