import React from 'react';
import Theme from './Theme';
import LoginLayout from './layouts/Login';
import HomeLayout from './layouts/Home';
import ViewLayout from './layouts/View';
import PublishLayout from './layouts/Publish';
import GetImageLayout from './layouts/GetImage';
import './App.css';
import Header from './components/Header';
import CssBaseline from '@material-ui/core/CssBaseline';
import { HashRouter, Route } from 'react-router-dom';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import Alert from './components/Alert';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import Scheduled from './layouts/Scheduled';

class Main extends React.Component {
  constructor() {
    super()
    this.state = {
      header: 'Home',
      publishData: null,
    }
  }

  changeHeader(header) {
    if (this.state.header === header) return
    else this.setState({header})
  }

  gotoPublish(data, publishAction) {
    this.setState({publishData: data})
    window.location.hash = '#/' + publishAction
  }

  Login = () => {
    return <LoginLayout />
  }

  Scheduled = () => {
    return <Scheduled />
  }

  Home = () => {
    return <HomeLayout
      gotoPublish={this.gotoPublish.bind(this)}
    />
  }

  View = ({match}) => {
    return <ViewLayout
      id={match.params.id}
    />
  }

  Publish = () => {
    return <PublishLayout
      data={this.state.publishData}
    />
  }

  GetImage = () => {
    return <GetImageLayout
      data={this.state.publishData}
      gotoPublish={this.gotoPublish.bind(this)}
    />
  }

  Copyright = () => {
    return <center>
      Developed by&nbsp;
      <b><a href="https://ngxson.com" target="_blank" rel="noopener noreferrer">Nui</a></b><br/>
      Version 4.9
      <br/><br/>
    </center>
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
            <Route path="/view/:id" component={this.View} />
            <Route path="/publish" component={this.Publish} />
            <Route path="/getimage" component={this.GetImage} />
            <Route path="/scheduled" component={this.Scheduled} />
            <this.Copyright />
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
      <ToastContainer
        position="bottom-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnVisibilityChange
        draggable
        pauseOnHover
      />
    </HashRouter>
  );
}

export default App;