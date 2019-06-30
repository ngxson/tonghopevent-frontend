import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import axios from 'axios'
import Config from '../Config'
import Utils from '../Utils'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Img from 'react-image'
import DatePicker from '../components/DatePicker'

const classes = {
  cardStyle: {
    maxWidth: '800px',
    marginTop: '20px',
    marginRight: 'auto',
    marginLeft: 'auto',
  }
}

class Publish extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      completed: false,
      loading: true,
      stat: {},
    }
    if (props.data) {
      this.state.caption = props.data.caption
      this.state.url = props.data.url
      this.state.scheduled_publish_time = 0
    }
  }

  componentDidMount() {
    this.loadStat()
  }

  async loadStat() {
    const token = Utils.getLocalStorage('token')
    const res = await axios.get(`${Config.BACKEND}/publish/stat?token=${token}`)
    if (res.data.error)
      this.setState({loading: false, stat: []})
    else
      this.setState({loading: false, stat: res.data})
  }
  
  async doPublish() {
    this.setState({loading: true})
    const token = Utils.getLocalStorage('token')
    const res = await axios.post(`${Config.BACKEND}/publish?token=${token}`, {
      caption: this.state.caption,
      url: this.state.url,
      scheduled_publish_time: this.state.scheduled_publish_time
    })
    if (res.data.id)
      this.setState({loading: false, completed: true})
    else
      window.showAlert({
        title: 'Không thể đăng bài',
        text: 'Có lỗi xảy ra'
      })
  }

  _renderComposerCard() {
    const imgStyle = {
      height: '300px',
      maxWidth: '100%',
    }
    return (
      <Card>
        <CardContent>
          <p><b>Soạn bài đăng</b></p>
          <center>
            <Img alt=''
              src={this.state.url}
              style={imgStyle}
              loader={<div style={imgStyle}><center><br/><br/><CircularProgress /></center></div>}
            />  
          </center>
          <TextField
            label="Nội dung bài đăng"
            multiline
            rowsMax="20"
            value={this.state.caption}
            onChange={event => {this.setState({ caption: event.target.value });}}
            margin="normal"
            variant="outlined"
            fullWidth
          />
        </CardContent>        
      </Card>
    )
  }

  _renderPublishCard() {
    const { scheduled_publish_time } = this.state
    const isDateOK = (scheduled_publish_time - (Date.now() / 1000)) > 15*60
    const s = scheduled_publish_time * 1000

    return (
      <Card>
        <CardContent>
          <p><b>Lên lịch bài đăng</b></p>
          <DatePicker
            handleDateChange={(date) => this.setState({ scheduled_publish_time: Math.round(date) })}
          />
          <br/><br/>
          {isDateOK && <Button variant='outlined' onClick={() => {
            window.showAlert({
              title: 'Xác nhận đăng bài',
              text: `Đăng bài vào lúc ${Utils.getTimeStr(s)} ngày ${Utils.getDateStr(s)} ?`,
              onClickOK: this.doPublish.bind(this),
              showCancel: true
            })
          }}>Đăng bài</Button>}
          {!isDateOK && <p style={{color: 'red'}}>Giờ đăng bài phải cách hiện tại ít nhất 15 phút</p>}
        </CardContent>
      </Card>
    )
  }

  _renderCompletedCard() {
    const { scheduled_publish_time } = this.state
    const s = scheduled_publish_time * 1000

    return (
      <div style={classes.cardStyle}>
        <Card>
          <CardContent>
            <h2>Đăng bài thành công</h2>
            <p>Bài viết đã được đặt giờ để đăng vào lúc {Utils.getTimeStr(s)} ngày {Utils.getDateStr(s)}</p>
            <Button
              variant='outlined'
              onClick={() => window.location.hash = '#/'}>Trở về trang chủ</Button>
          </CardContent>
        </Card>
      <br/><br/>
      </div>
    )
  }

  _renderStatCard() {
    return (
      <Card>
        <CardContent>
          <p><b>Các bài đăng đã lên lịch</b></p>
          <ul>
            {this.state.stat.map(s => {
              return <li key={s}>{Utils.getTimeStr(s)} ngày {Utils.getDateStr(s)}</li>
            })}
          </ul>
        </CardContent>        
      </Card>
    )
  }

  _renderMain() {
    return (
      <React.Fragment>
        <div style={classes.cardStyle}>
          {this._renderComposerCard()}
        </div>
        <div style={classes.cardStyle}>
          {this._renderPublishCard()}
        </div>
        <div style={classes.cardStyle}>
          {this._renderStatCard()}
        </div>
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
        Hãy vào trang chủ và thử lại<br/>
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
    if (this.state.completed) return this._renderCompletedCard()

    return this.props.data ? this._renderMain() : this._renderError()
  }
}

export default Publish