import { createMuiTheme } from '@material-ui/core';

export const theme = createMuiTheme({
  palette: {
    type: 'dark',
    secondary: {
      main: '#1A567B'
    },
    primary: {
      main: '#61dafb',
    },
    /*    secondary: {
          light: '#6B9BC2',
          main: '#558DC4',
          dark: '#1A567B',
          contrastText: '#fff',
        },*/
    /*    primary: {
          light: '#61dafb',
          main: '#00aca2',
          dark: '#00726a',
          contrastText: '#243443',
        },*/
    error: {
      main: '#cd544e',
      contrastText: '#1A567B',
    },
  },
});