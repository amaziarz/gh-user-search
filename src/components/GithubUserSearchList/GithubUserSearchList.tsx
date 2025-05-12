import { useDebounce } from '@/utils/useDebounce';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useForm } from 'react-hook-form';

import { useGithubUsersSearch } from './useGithubUsersSearch';

const DEBOUNCE_DELAY = 2000;

type FormValues = {
  username: string;
};

export default function GithubUserSearchInput() {
  const { register, watch } = useForm<FormValues>({
    defaultValues: {
      username: '',
    },
  });
  const username = watch('username');
  const debouncedUsername = useDebounce(username, DEBOUNCE_DELAY);
  const {
    data: users,
    error,
    isError,
    isFetching,
    isSuccess,
  } = useGithubUsersSearch(debouncedUsername);

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
      {isSuccess &&
        (users.length > 0 ? (
          <List>
            {users.map((user) => (
              <ListItem key={user.id}>{user.login}</ListItem>
            ))}
          </List>
        ) : (
          <Typography sx={{ ml: 1, mt: 1 }} variant="body1">
            No users found for {debouncedUsername}.
          </Typography>
        ))}
      {isError && (
        <Typography color="error" sx={{ ml: 1, mt: 1 }} variant="body1">
          Error fetching users: {error.message}
        </Typography>
      )}
    </Box>
  );
}
