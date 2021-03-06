import React from 'react';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link } from 'react-router-dom';

const theme = createTheme({
  palette: {
    secondary: {
      main: '#0055ff',
    },
  },
});
export const ResultButton = () => {
  return (
    <ThemeProvider theme={theme}>
      <Button
        variant='contained'
        size='large'
        color='secondary'
        component={Link}
        to='/results'
      >
        現在の投票結果を見る
      </Button>
    </ThemeProvider>
  );
};
