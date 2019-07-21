import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import axios from 'axios'
import Utils from '../Utils'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Img from 'react-image'

const imgStyle = {
  maxHeight: '300px',
  maxWidth: '100%',
}

const imgLoaderStyle = {
  height: '300px',
  width: '100%',
}

const classes = {
  cardStyle: {
    maxWidth: '800px',
    marginTop: '20px',
    marginRight: 'auto',
    marginLeft: 'auto',
  }
}

class GetImage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showGetToken: false,
      access_token: '',
      completed: false,
      loading: true,
      imgs: [],
    }
    if (props.data) {
      this.state.caption = props.data.caption
      this.state.fbusername = props.data.fbusername
    } else {
      this.state.error = 'Hãy về trang chủ và thử lại'
    }
    window.changeHeader('Chọn ảnh bài đăng - TongHopEvent')
  }

  componentDidMount() {
    this.fetchFacebookApi()
  }

  async fetchFacebookApi() {
    const fbtoken = Utils.getLocalStorage('fbtoken')
    try {
      const res = await axios.get(`https://graph.facebook.com/${this.state.fbusername}?fields=feed.limit(20)%7Bfull_picture%7D%2Cpicture.width(720)%7Burl%7D&access_token=${fbtoken}`)
      if (res.data.error) {
        this.setState({loading: false, showGetToken: true})
      } else {
        const imgs = res.data.feed.data.map(post => post.full_picture)
        imgs.unshift(res.data.picture.data.url)
        this.setState({
          loading: false,
          showGetToken: false,
          imgs: imgs,
        })
      }
    } catch (e) {
      if (e.response.status === 404) {
        this.setState({loading: false, error: 'Không thể mở trang facebook này'})
      } else {
        this.setState({loading: false, showGetToken: true})
      }
    }
  }

  onSaveToken() {
    let fbtoken = this.state.access_token
    fbtoken = fbtoken.match(/EA[a-zA-Z0-9]+/)
    Utils.setLocalStorage('fbtoken', fbtoken[0])
    const urlNow = window.location.hash
    window.location.hash = '#/reload'
    setTimeout(() => { window.location.hash = urlNow }, 50)
  }

  _renderTitleCard() {
    return (
      <Card>
        <CardContent>
          <p>
            <Button
              variant='outlined'
              size='small'
              onClick={() => window.location.hash = '#/'}>Trở về</Button>
            &nbsp;&nbsp;&nbsp;
            <b>Chọn ảnh cho bài đăng</b>
          </p>
        </CardContent>        
      </Card>
    )
  }

  _renderImageCard(url) {
    return (
      <Card>
        <CardContent>
          <center>
            <Img alt=''
              src={url}
              style={imgStyle}
              loader={<div style={imgLoaderStyle}><center><br/><br/><CircularProgress /></center></div>}
            />  
          </center>
          <Button
              variant='outlined'
              size='small'
              style={{ float: 'right', margin: '10px' }}
              onClick={() => {
                const _data = JSON.parse(JSON.stringify(this.props.data))
                _data.url = url
                this.props.gotoPublish(_data, 'publish')
              }}>Chọn ảnh này</Button>
        </CardContent>
      </Card>
    )
  }

  _renderGetTokenCard() {
    return (
      <Card>
        <CardContent>
          <p>
            <Button
              variant='outlined'
              size='small'
              onClick={() => window.location.hash = '#/'}
            >Trở về</Button>
            &nbsp;&nbsp;&nbsp;
            <b>Lấy token</b><br/>
            <br/>
            Bạn chưa có token hoặc token đã bị hết hạn. Hãy làm theo hướng dẫn này để lấy token: <a href="https://blog.ngxson.com/tonghopevent/#lay-token" target="_blank" rel="noopener noreferrer">[Bấm vào đây]</a><br/>
            Lưu ý: token sẽ đc lưu trên máy này. Bạn có thể lấy token từ máy tính để dùng trên ĐT.<br/>
            Điền token của bạn vào ô dưới đây:<br/>
          </p>
          <TextField
            multiline
            rowsMax="5"
            value={this.state.access_token}
            onChange={event => {this.setState({ access_token: event.target.value });}}
            margin="normal"
            variant="outlined"
            fullWidth
          /><br/>
          <Button
            variant='outlined'
            onClick={this.onSaveToken.bind(this)}
          >Tiếp tục</Button>
        </CardContent>        
      </Card>
    )
  }

  _renderMain() {
    return (
      <React.Fragment>
        {this.state.showGetToken &&
          <div style={classes.cardStyle}>
            {this._renderGetTokenCard()}
          </div>
        }
        {!this.state.showGetToken &&
          <div style={classes.cardStyle}>
            {this._renderTitleCard()}
          </div>
        }
        {!this.state.showGetToken &&
          this.state.imgs.map((url, i) =>
            <div style={classes.cardStyle} key={i}>
              {this._renderImageCard(url)}
            </div>
          )
        }
        <br />
        <br />
      </React.Fragment>
    )
  }

  _renderError() {
    return (
      <center>
        <br/><br/>
        <h2>Có lỗi xảy ra</h2>
        {this.state.error}<br/><br/>
        <Button
          variant='outlined'
          size='small'
          onClick={() => window.location.hash = '#/'}
        >Trở về</Button>
        <br/><br/>
      </center>
    )
  }

  render() {
    const loading = <div>
      <br/><br/><br/>
      <center><CircularProgress /></center>
    </div>

    if (this.state.loading) return loading
    if (this.state.error) return this._renderError()

    return this._renderMain()
  }
}

export default GetImage