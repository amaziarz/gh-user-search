import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import CssBaseline from '@mui/material/CssBaseline';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import Providers from './Providers';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <CssBaseline />
      <App />
    </Providers>
  </StrictMode>,
);
