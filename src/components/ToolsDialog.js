import React from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import CircularProgress from '@material-ui/core/CircularProgress'
import Divider from '@material-ui/core/Divider'
import Utils from '../Utils'
import Config from '../Config'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import { CopyToClipboard } from 'react-copy-to-clipboard'

const TEMPLATES = [
  {
    desc: 'Thông báo trùng bài',
    text: '⬢ Đã có người nhập thông tin của dự án / cuộc thi / sự kiện này. Không biết bạn có muốn bổ sung hay thay đổi gì không nhỉ?\n\nNếu không, chúng mình sẽ xóa thông tin bạn đã nhập để không bị trùng với bài đã đăng.'
  }, {
    desc: 'Báo bị xóa vì trùng',
    text: '⬢ Bài của bạn đã bị xóa do trùng với bài đã đăng trên fanpage.'
  }, {
    desc: 'Báo bị xóa vì ko phù hợp',
    text: '⬢ Xin chào bạn,\n\nDự án / cuộc thi / sự kiện của bạn đã bị xóa do không phù hợp với Điều khoản sử dụng của chúng mình.\n\nHãy tham khảo Điều khoản sử dụng của fanpage tại đây: https://sites.google.com/view/tonghopevent'
  }, {
    desc: 'Báo dự án có lợi nhuận',
    text: '⬢ Xin chào bạn,\n\nDự án / cuộc thi / sự kiện của bạn được điều hành bởi một tổ chức / cá nhân hoạt động có lợi nhuận. Dựa theo Điều khoản sử dụng của chúng mình, bài của bạn phải trả phí 100.000 VNĐ để có thể được đăng bài lên fanpage nhé.\n\nHãy tham khảo Điều khoản sử dụng của fanpage tại đây: https://sites.google.com/view/tonghopevent'
  }
]

class ToolsDialog extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      error: false,
      showTemplates: false,
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
    this.setState({ error: false, loading: true, showTemplates: false })
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

  async sendInbox(t) {
    this.props.closeToolsDialog()
    const res = await Utils.makeRequest(
      `${Config.BACKEND}/inbox/${this.props.psid}`,
      'post', { message: t.text }
    )
    if (res.data && res.data.success) {
      toast('Đã gửi tin nhắn thành công!')
    } else {
      toast('Có lỗi xảy ra, ko thể gửi tin nhắn')
    }
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
        <ListItem button onClick={() => window.open(`https://fb.com${inboxData.link}`, '_blank')}>
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
          return <ListItem button onClick={() => this.sendInbox(t)} key={i}>
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
      <Dialog
        open={open}
        onEnter={this.fetchData.bind(this)}
        aria-labelledby="simple-dialog-title"
      >
        <DialogTitle id="simple-dialog-title">{name ? name.substr(0,24) : ''}</DialogTitle>
        {this.state.loading
          ? <center><CircularProgress /></center>
          : this.state.error ? this._renderError() : this._renderContent()
        }
      </Dialog>
    )
  }
}

export default ToolsDialog
