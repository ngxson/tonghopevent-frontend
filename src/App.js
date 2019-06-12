import React from 'react';
import Theme from './Theme';
import LoginLayout from './layouts/Login';
import HomeLayout from './layouts/Home';
import './App.css';
import Header from './components/Header';
import CssBaseline from '@material-ui/core/CssBaseline';
import { HashRouter, Route } from 'react-router-dom';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import Alert from './components/Alert';

class Main extends React.Component {
  constructor() {
    super()
    this.state = {header: 'Home'}
  }

  changeHeader(header) {
    if (this.state.header === header) return
    else this.setState({header})
  }

  Login = () => {
    return <LoginLayout />
  }

  Home = () => {
    return <HomeLayout />
  }

  render() {
    window.changeHeader = this.changeHeader.bind(this)

    return (
      <MuiThemeProvider theme={Theme}>
        <React.Fragment>
          <CssBaseline />
          <Header header={this.state.header}/>
          <div className="mainView">
            <Route exact path="/" component={this.Home} />
            <Route path="/login" component={this.Login} />
          </div>
          <Alert />
        </React.Fragment>
      </MuiThemeProvider>
    );
  }
}

function App() {
  return (
    <HashRouter>
      <Main />
    </HashRouter>
  );
}

export default App;