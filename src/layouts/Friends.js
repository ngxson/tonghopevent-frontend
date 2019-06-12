import React from 'react'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { Redirect } from 'react-router'
import CircularProgress from '@material-ui/core/CircularProgress'
import axios from 'axios'
import Config from '../Config'
import Utils from '../Utils'
import Profile from '../components/Profile'
import Grid from '@material-ui/core/Grid'

const classes = {
  input: {
    marginBottom: '20px',
    width: '500px',
    maxWidth: '100%'
  }
}

class Home extends React.Component {
  constructor(props) {
    super()
    this.props = props
    this.state = {
      loading: true,
      friends: []
    }
    this.props.changeHeader('Friend list')
    this.token = Utils.getLocalStorage('token')
    this.loadData()
  }

  async loadData() {
    if (!this.token) window.location.href = '/login'
    const res = await axios.get(`${Config.BACKEND}/friend?token=${this.token}`)
    this.setState({loading: false, friends: res.data})
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value })
  }

  async onConfirmAddFriend(profile) {
    const res = await axios.post(`${Config.BACKEND}/friend?token=${this.token}`, {
      friendId: profile._id
    })

    if (res.data.success) this.props.alert.current.show({
      title: 'Success',
      text: 'Added ' + profile.name + ' to your friend list',
      onClickOK: () => { this.loadData() }
    })

    else this.props.alert.current.show({
      title: 'Cannot add this friend',
      text: res.data.error
    })
  }

  async onClickAddFriend() {
    const res = await axios.get(`${Config.BACKEND}/dinosaur/find?token=${this.token}&username=${this.state.friendUsername}`)
    const profile = res.data
    const clickOK = () => { this.onConfirmAddFriend(profile) }

    if (!profile) this.props.alert.current.show({
      title: 'Cannot find this friend',
      text: 'Please try again'
    })

    else this.props.alert.current.show({
      title: 'Please confirm',
      text: 'Do you want to add ' + profile.name + ' to your friend list?',
      onClickOK: clickOK.bind(this),
      showCancel: true
    })
  }

  onClickRemoveFriend = (profile) => () => {
    const confirm = async () => {
      const res = await axios.delete(`${Config.BACKEND}/friend?token=${this.token}&friendId=${profile._id}`)
  
      if (res.data.success) this.props.alert.current.show({
        title: 'Success',
        text: 'Removed ' + profile.name + ' from your friend list',
        onClickOK: this.loadData.bind(this)
      })
  
      else this.props.alert.current.show({
        title: 'Cannot remove this friend',
        text: res.data.error
      })
    }

    this.props.alert.current.show({
      title: 'Please confirm',
      text: 'Do you want to remove ' + profile.name + ' from your friend list?',
      onClickOK: confirm.bind(this),
      showCancel: true
    })
  }

  render() {
    const loading = <div>
      <br/><br/><br/>
      <center><CircularProgress /></center>
    </div>

    const view = (
      <Grid container spacing={24} style={{padding: '20px'}}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <p>Add friend:</p>
              <TextField
                label="Your friend's Username"
                type="text"
                value={this.state.friendUsername}
                style={classes.input}
                onChange={this.handleChange('friendUsername')}
                margin="normal"
              />
              <br/>
              <Button onClick={this.onClickAddFriend.bind(this)} color='primary'>Add this friend</Button>
            </CardContent>        
          </Card>
        </Grid>
        {this.state.friends.map(friend => {
          return <Grid item xs={12} md={6} lg={4}>
            <Profile profile={friend} remove={this.onClickRemoveFriend(friend)}/>
          </Grid>
        })}
      </Grid>
    )

    if (this.state.redirect) return <Redirect to={this.state.redirect} />
    return this.state.loading ? loading : view
  }
}

export default Home