import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import axios from 'axios'
import Config from '../Config'
import Utils from '../Utils'
import Doc from '../components/Doc'

const classes = {
  cardStyle: {
    maxWidth: '800px',
    marginTop: '20px',
    marginRight: 'auto',
    marginLeft: 'auto',
  }
}

class View extends React.Component {
  constructor(props) {
    super()
    this.props = props
    this.state = {
      loading: true,
      doc: {},
    }
    window.changeHeader('Quản lý dữ liệu - TongHopEvent')
  }

  componentDidMount() {
    this.loadData()
  }

  async loadData() {
    const token = Utils.getLocalStorage('token')
    const res = await axios.get(`${Config.BACKEND}/doc/${this.props.id}?token=${token}`)
    if (res.data.error)
      this.setState({loading: false, doc: null})
    else
      this.setState({loading: false, doc: res.data})
  }

  _renderDocView() {
    return (
      <div style={classes.cardStyle}>
        <Doc doc={this.state.doc || {}} />
      </div>
    )
  }

  _renderDocNotFound() {
    return (
      <center>
        <br/><br/>
        <h2>Có lỗi xảy ra</h2>
        Bài đăng này không tồn tại hoặc đã bị xoá<br/>
        <br/><br/>
      </center>
    )
  }

  render() {
    const loading = <div>
      <br/><br/><br/>
      <center><CircularProgress /></center>
    </div>

    return this.state.loading ? loading : 
      this.state.doc ? this._renderDocView() : this._renderDocNotFound()
  }
}

export default View