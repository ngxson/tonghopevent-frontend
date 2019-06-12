import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import axios from 'axios'
import Config from '../Config'
import Utils from '../Utils'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'

class Profile extends React.Component {
  constructor(props) {
    super()
    this.props = props
    this.state = {
      loading: false,
      isCopied: false
    }
  }

  async deleteDoc() {}

  async toggleApproved() {
    this.setState({loading: true})
    const {doc} = this.props
    const approved = !doc.approved
    const token = Utils.getLocalStorage('token')
    const res = await axios.post(`${Config.BACKEND}/doc/${doc.id}/approved?token=${token}`, {approved})
    const newDoc = JSON.parse(JSON.stringify(doc))
    newDoc.approved = approved
    if (res.data.success) {
      this.props.setDoc(this.props.i, newDoc)
    } else {
      window.showAlert({
        title: 'Error',
        text: res.data.error
      })
    }
    this.setState({loading: false})
  }

  copy() {}

  render() {
    const { doc } = this.props

    const loading = <div>
      <br/><br/><br/>
      <center>
        <CircularProgress /><br/>
        Xin chờ...
      </center>
      <br/><br/><br/>
    </div>

    const content = <div>
      <p><b>{doc.name}</b></p>
      <p>{doc.type.join(' ')}</p>
      <p>{doc.description}</p>
      <p>● Link facebook: {doc.linkfb}</p>
      {this.props.admin &&
        <div>
          <Button onClick={this.deleteDoc.bind(this)} color='primary'>Xóa</Button>
          <Button onClick={this.toggleApproved.bind(this)} color='primary'>
            {doc.approved ? 'Duyệt' : 'Bỏ duyệt'}
          </Button>
          <Button onClick={this.copy.bind(this)} color='primary'>
            {this.state.isCopied ? '(Đã copy)' : 'Copy'}
          </Button>
        </div>
      }
    </div>

    return (
      <div>
        <Card>
          <CardContent>
            {this.state.loading ? loading : content}
          </CardContent>        
        </Card>
      </div>
    )
  }
}

export default Profile