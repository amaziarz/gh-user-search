import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import GithubUsersSearch from './components/GithubUsersSearch';

export default function App() {
  return (
    <Container>
      <Box component="main" sx={{ py: 2 }}>
        <Typography component="h1" variant="h5" gutterBottom>
          Github Users Search
        </Typography>
        <GithubUsersSearch />
      </Box>
    </Container>
  );
}
