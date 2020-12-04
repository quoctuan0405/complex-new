import { createMuiTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#009688',
    },
    secondary: {
      main: '#ff1744',
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;