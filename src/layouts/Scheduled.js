import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import axios from 'axios'
import Config from '../Config'
import Utils from '../Utils'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'

const classes = {
  cardStyle: {
    maxWidth: '800px',
    marginTop: '20px',
    marginRight: 'auto',
    marginLeft: 'auto',
  }
}

class Scheduled extends React.Component {
  constructor(props) {
    super()
    this.props = props
    this.state = {
      loading: true,
      posts: [],
    }
    window.changeHeader('Bài đã lên lịch - TongHopEvent')
  }

  componentDidMount() {
    this.loadData()
  }

  async loadData() {
    const token = Utils.getLocalStorage('token')
    const res = await axios.get(`${Config.BACKEND}/publish/scheduled?token=${token}`)
    if (res.data.error)
      this.setState({loading: false, posts: []})
    else
      this.setState({loading: false, posts: res.data})
  }

  deletePost = (post) => async () => {
    if (window.confirm('Bạn có chắc chắn xóa?')) {
      this.setState({loading: true})
      const token = Utils.getLocalStorage('token')
      await axios.delete(`${Config.BACKEND}/publish/post/${post.id}?token=${token}`)
      this.loadData()
    }
  }

  _renderMainView() {
    return this.state.posts.map((post, i) => (
      <div style={classes.cardStyle} key={post.id}>
        <Card>
          <CardContent>
            <p><b>{Utils.getTimeStr(post.time)} ngày {Utils.getDateStr(post.time)}</b></p>
            <p>
              {Utils.nl2br(post.expanded ? post.message : post.message.substring(0, 250))}
              <br/>
              <a href="#/scheduled" onClick={(e) => {
                e.preventDefault()
                this.setState({posts: this.state.posts.map((p, j) => {
                  const cloned = JSON.parse(JSON.stringify(p))
                  if (i === j) cloned.expanded = !cloned.expanded
                  return cloned
                })})
              }}>{post.expanded ? 'Thu gọn' : '... Đọc thêm'}</a><br/>
            </p>
            <p>
              <Button color="primary" variant="outlined" onClick={this.deletePost(post)}>Xóa</Button>
            </p>
          </CardContent>
        </Card>
      </div>
    ))
  }

  _renderDocNotFound() {
    return (
      <center>
        <br/><br/>
        (Chưa có bài đăng nào được hẹn giờ)<br/>
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
      this.state.posts.length > 0 ? this._renderMainView() : this._renderDocNotFound()
  }
}

export default Scheduled