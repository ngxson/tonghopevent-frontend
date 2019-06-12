import React from 'react'

import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'

class Profile extends React.Component {
  constructor(props) {
    super()
    this.props = props
    this.state = {}
  }

  render() {
    const { profile } = this.props

    return (
      <div>
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2">{profile.name || 'New Dinosaur'}</Typography>
            <p><b>Username: </b>{profile.username}</p>
            <p><b>Family: </b>{profile.family}</p>
            <p><b>Race: </b>{profile.race}</p>
            <p><b>Food: </b>{profile.food}</p>
            {this.props.remove ? <Button onClick={this.props.remove} color='primary'>Remove</Button> : null}
            {this.props.edit ? <Button onClick={this.props.edit} color='primary'>Edit Profile</Button> : null}
          </CardContent>        
        </Card>
      </div>
    )
  }
}

export default Profile