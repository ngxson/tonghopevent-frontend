import { createMuiTheme } from '@material-ui/core/styles';
import lightGreen from '@material-ui/core/colors/lightGreen';
import orange from '@material-ui/core/colors/orange';

export default createMuiTheme({
  palette: {
    primary: { main: lightGreen[700] },
    secondary: { main: lightGreen[200] },
    error: { main: orange[900] }
  }
})