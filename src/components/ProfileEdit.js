import React from 'react'

import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import axios from 'axios'
import Config from '../Config'
import Utils from '../Utils'

const classes = {
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

class ProfileEdit extends React.Component {
  constructor(props) {
    super()
    this.props = props
    this.state = {
      name: props.profile.name,
      family: props.profile.family,
      race: props.profile.race,
      food: props.profile.food,
    }
    this.token = Utils.getLocalStorage('token')
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value })
  }

  async onClickDone() {
    await axios.patch(`${Config.BACKEND}/dinosaur/me?token=${this.token}`, this.state)
    window.location.reload()
  }

  render() {
    return (
      <div>
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2">Edit Profile</Typography>
            <TextField
              label="Name"
              type="text"
              value={this.state.name}
              style={classes.input}
              onChange={this.handleChange('name')}
              margin="normal"
            />
            <TextField
              label="Family"
              type="text"
              value={this.state.family}
              style={classes.input}
              onChange={this.handleChange('family')}
              margin="normal"
            />
            <TextField
              label="Race"
              type="text"
              value={this.state.race}
              style={classes.input}
              onChange={this.handleChange('race')}
              margin="normal"
            />
            <TextField
              label="Food"
              type="text"
              value={this.state.food}
              style={classes.input}
              onChange={this.handleChange('food')}
              margin="normal"
            />
            <Button onClick={this.onClickDone.bind(this)} color='primary'>Done</Button>
          </CardContent>        
        </Card>
      </div>
    )
  }
}

export default ProfileEdit