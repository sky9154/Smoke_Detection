import { FC } from 'react';
import { useRoutes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import routes from './routes';


const App: FC = () => {
  const allPages = useRoutes(routes);

  const theme = createTheme({
    typography: {
      fontFamily: [
        'Noto Sans TC',
        'Roboto',
        'sans-serif'
      ].join(',')
    },
    palette: {
      mode: 'dark'
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster />
      {allPages}
    </ThemeProvider>
  );
}

export default App;