import { createMuiTheme } from '@material-ui/core/styles';
import blueGrey from '@material-ui/core/colors/blueGrey';
import orange from '@material-ui/core/colors/orange';

export default createMuiTheme({
  palette: {
    primary: { main: blueGrey[700] },
    secondary: { main: blueGrey[200] },
    error: { main: orange[900] }
  }
})