import { createMuiTheme } from '@material-ui/core/styles';

const muiTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#5e41ff'
    },
    secondary: {
      main: '#2dc469'
    }
  },
  overrides: {
    MuiButton: {
      containedSecondary: {
        color: 'white',
      }
    },
  }
});

export default muiTheme;
