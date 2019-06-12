import React from 'react'

import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import CardContent from '@material-ui/core/CardContent'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import axios from 'axios'
import Config from '../Config'
import Utils from '../Utils'

class Login extends React.Component {
  constructor(props) {
    super()
    this.props = props
    this.state = {}
    window.changeHeader('Login')
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value })
  }

  async onLogin() {
    if (this.state.username === '' || this.state.password === '') {
      return window.showAlert({
        title: 'Please fill in',
        text: 'Please fill in your username and password'
      })
    } else {
      this.setState({loading: true})
      const {username, password} = this.state
      const res = await axios.post(`${Config.BACKEND}/login`, {
        username, password
      })
      this.setState({loading: false})
      if (res.data.token) {
        Utils.setLocalStorage('token', res.data.token)
        window.location.href = '#/'
      } else {
        return window.showAlert({
          title: 'Error',
          text: res.data.error
        })
      }
    }
  }

  async onRegister() {}

  render() {
    var classes = {
      input: {
        marginBottom: '20px',
        width: '500px',
        maxWidth: '100%'
      },
      container: {
        display: 'flex',
        flexWrap: 'wrap',
      },
      cardStyle: {
        maxWidth: '500px',
        marginTop: '20px',
        marginRight: 'auto',
        marginLeft: 'auto',
      }
    }

    const loading = <div>
      <br/><br/><br/>
      <center><CircularProgress /></center>
    </div>

    const form = (
      <div>
        <Card style={classes.cardStyle}>
          <CardContent>
            <Typography variant="h5" component="h2">Admin - TongHopEvent</Typography>
            <Typography color="textSecondary">Please login to continue</Typography>
            <TextField
              label="Username"
              type="text"
              value={this.state.username}
              style={classes.input}
              onChange={this.handleChange('username')}
              margin="normal"
            />
            <TextField
              label="Password"
              type="password"
              value={this.state.password}
              style={classes.input}
              onChange={this.handleChange('password')}
              margin="normal"
            />
            <div>
              <Button onClick={this.onLogin.bind(this)} color='primary'>Login</Button>
            </div>
          </CardContent>        
        </Card>
      </div>
    )

    return this.state.loading ? loading : form
  }
}

export default Login