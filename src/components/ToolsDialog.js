import React from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import CircularProgress from '@material-ui/core/CircularProgress'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import TextField from '@material-ui/core/TextField'
import Utils from '../Utils'
import Config from '../Config'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import './ToolsDialog.css'

const copyObj = (obj) => JSON.parse(JSON.stringify(obj))

const TEMPLATES = [
  {
    desc: 'Báo trùng bài',
    text: 'Đã có người nhập thông tin của dự án / cuộc thi / sự kiện này. Không biết bạn có muốn bổ sung hay thay đổi gì không nhỉ?\n\nNếu không, chúng mình sẽ xóa thông tin bạn đã nhập để không bị trùng với bài đã đăng.'
  },{
    desc: 'Báo bị xóa vì ko phù hợp',
    text: 'Xin chào bạn,\n\nDự án / cuộc thi / sự kiện của bạn đã bị xóa do không phù hợp với Điều khoản sử dụng của chúng mình.\n\nHãy tham khảo Điều khoản sử dụng của fanpage tại đây: https://sites.google.com/view/tonghopevent'
  }, {
    desc: 'Báo dự án có lợi nhuận',
    text: 'Xin chào bạn,\n\nDự án / cuộc thi / sự kiện của bạn được điều hành bởi một tổ chức / cá nhân hoạt động có lợi nhuận. Dựa theo Điều khoản sử dụng của chúng mình, bài của bạn phải trả phí 100.000 VNĐ để có thể được đăng bài lên fanpage nhé.\n\nHãy tham khảo Điều khoản sử dụng của fanpage tại đây: https://sites.google.com/view/tonghopevent'
  },
  {
    desc: 'Báo thiếu thông tin',
    text: 'Admin đã xem bài viết của bạn. Tuy nhiên, do bài viết của bạn còn thiếu thông tin, như giới thiệu, ý nghĩa dự án / cuộc thi / sự kiện, nên chúng mình chưa thể phê duyệt được. Bạn hãy điền lại form với đầy đủ thông tin hơn nhé!\n\nHãy tham khảo ví dụ sau: https://bit.ly/2TZKbee'
  },
  {
    desc: 'Điền lại (không paste link)',
    text: 'Admin đã xem bài viết của bạn. Tuy nhiên, chúng mình không thể xử lý nếu bạn chỉ copy-paste mỗi link bài viết. Bạn hãy điền lại form thật rõ ràng, bao gồm cả phần giới thiệu, ý nghĩa dự án / cuộc thi / sự kiện nhé.\n\nHãy tham khảo ví dụ sau: https://bit.ly/2TZKbee'
  },
]

class ToolsDialog extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      error: false,
      showTemplates: true,
      sendInboxData: null,
      inboxData: {},
      isLinkCopied: false,
    }
  }

  static propTypes = {
    open: PropTypes.bool.isRequired,
    closeToolsDialog: PropTypes.func.isRequired,
    name: PropTypes.string,
    psid: PropTypes.string,
    doc: PropTypes.any.isRequired,
  }

  async fetchData() {
    this.setState({ error: false, loading: true, showTemplates: true, isLinkCopied: false })
    const response = await Utils.makeRequest(
      `${Config.BACKEND}/inbox/${this.props.psid}`
    )
    const { data } = response
    if (data && Object.keys(data).length > 0) {
      this.setState({
        loading: false,
        error: false,
        inboxData: data,
      })
    } else {
      this.setState({
        loading: false,
        error: true,
      })
    }
  }

  async sendInbox() {
    const inboxData = copyObj(this.state.sendInboxData)
    this.setState({sendInboxData: null})
    this.props.closeToolsDialog()
    const res = await Utils.makeRequest(
      `${Config.BACKEND}/inbox/${this.props.psid}`,
      'post', { message: '⬢ ' + inboxData.text }
    )
    if (res.data && res.data.success) {
      toast('Đã gửi tin nhắn thành công!')
    } else {
      toast('⚠️⚠️⚠️⚠️ Có lỗi xảy ra, ko thể gửi tin nhắn ⚠️⚠️⚠️⚠️')
    }
  }

  goToPageInbox() {
    window.open(`https://fb.com${this.state.inboxData.link}`, '_blank')
  }

  _renderSendInboxDialogAsk() {
    const { sendInboxData } = this.state;
    const isWithin24HWindow = (Date.now() - this.props.doc.created) < (86400 * 1000)
    const handleClose = () => this.setState({sendInboxData: null});
    if (!sendInboxData) return null;
    else return <Dialog open={!!sendInboxData} onClose={handleClose}>
      <DialogTitle id="alert-dialog-title">{sendInboxData.desc}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {
            isWithin24HWindow
             ? 'Gửi tin nhắn có nội dung như sau (có thể sửa):'
             : 'Không thể tự động gửi tin nhắn. Hãy copy-paste và inbox thủ công:'
          }<br/><br/>
          <TextField
            multiline
            rowsMax="20"
            value={sendInboxData.text}
            onChange={event => {this.setState({
              sendInboxData: {
                ...sendInboxData,
                text: event.target.value,
              }
            })}}
            margin="normal"
            variant="outlined"
            fullWidth
          />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary"> Quay lại </Button>
        {!isWithin24HWindow
          && <Button onClick={() => Utils.copyTextToClipboard(sendInboxData.text)} color="primary"> Copy tin nhắn </Button>
        }
        {isWithin24HWindow
          ? <Button onClick={() => this.sendInbox()} color="primary"> GỬI </Button>
          : <Button onClick={() => this.goToPageInbox()} color="primary"> Đi tới inbox </Button>
        }
      </DialogActions>
    </Dialog>
  }

  _renderError() {
    return (
      <List>
        <ListItem button>
          <ListItemText primary="(Có lỗi xảy ra)" />
        </ListItem>
        <ListItem button onClick={this.props.closeToolsDialog}>
          <ListItemText primary="Quay lại" />
        </ListItem>
      </List>
    )
  }

  _renderContent() {
    const { inboxData, showTemplates, isLinkCopied } = this.state

    return (
      <List>
        <ListItem button onClick={this.goToPageInbox.bind(this)}>
          <ListItemText
            primary="Đi tới inbox"
            secondary={`Tên FB: ${inboxData.senders.data[0].name}`}
          />
        </ListItem>
        <Divider />
        {!showTemplates && <ListItem button onClick={() => this.setState({showTemplates: true})}>
          <ListItemText primary={`💬 (Hiện các mẫu tin nhắn)`} />
        </ListItem>}
        {showTemplates && TEMPLATES.map((t, i) => {
          return <ListItem button onClick={() => this.setState({ sendInboxData: t })} key={i}>
            <ListItemText primary={`💬 ${t.desc}`} />
          </ListItem>
        })}
        <Divider />
          <CopyToClipboard
            text={`${window.location.protocol}//${window.location.host}/data/#/view/${this.props.doc.id}`}
            onCopy={() => this.setState({isLinkCopied: true})}
          >
            <ListItem button>
              <ListItemText primary={isLinkCopied ? "(Đã copy link)" : "Copy link bài viết"} />
            </ListItem>
          </CopyToClipboard>
        <Divider />
        <ListItem button onClick={this.props.closeToolsDialog}>
          <ListItemText primary="Quay lại" />
        </ListItem>
      </List>
    )
  }

  render() {
    const { name, open } = this.props

    return (
      <React.Fragment>
        {this._renderSendInboxDialogAsk()}
        <Dialog
          open={open}
          onEnter={this.fetchData.bind(this)}
          onBackdropClick={this.props.closeToolsDialog}
          className="tools-dialog"
          aria-labelledby="simple-dialog-title"
        >
          <DialogTitle id="simple-dialog-title">{name ? name.substr(0,24) : ''}</DialogTitle>
          {this.state.loading
            ? <center><CircularProgress /></center>
            : this.state.error ? this._renderError() : this._renderContent()
          }
        </Dialog>
      </React.Fragment>
    )
  }
}

export default ToolsDialog
