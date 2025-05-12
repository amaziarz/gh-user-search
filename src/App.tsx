import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import GithubUserSearchList from './components/GithubUserSearchList';

export default function App() {
  return (
    <Container>
      <Box component="main" sx={{ py: 2 }}>
        <Typography component="h1" gutterBottom variant="h5">
          Github User Search
        </Typography>
        <GithubUserSearchList />
      </Box>
    </Container>
  );
}
