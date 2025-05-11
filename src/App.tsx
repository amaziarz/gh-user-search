import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import SearchInput from './components/GithubUserSearchForm';

export default function App() {
  return (
    <Container>
      <Box component="main" sx={{ padding: 2 }}>
        <Typography component="h1" gutterBottom variant="h5">
          Github User Search
        </Typography>
        <Box>
          <SearchInput />
        </Box>
      </Box>
    </Container>
  );
}
