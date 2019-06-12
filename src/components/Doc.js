import React from 'react'
import PropTypes from 'prop-types'
import CircularProgress from '@material-ui/core/CircularProgress'
import axios from 'axios'
import Config from '../Config'
import Utils from '../Utils'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Linkify from 'react-linkify'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import Fab from '@material-ui/core/Fab'
import CheckIcon from '@material-ui/icons/Check'

class Doc extends React.Component {
  constructor(props) {
    super()
    this.props = props
    this.state = {
      loading: false,
      isCopied: false
    }
  }

  static propTypes = {
    doc: PropTypes.object.isRequired,
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

  getCopyContent() {
    const { doc } = this.props

    const content = `${doc.name}\n` +
    `#dự_án_ở_${doc.location.replace(/\s+/g, '_')} ${doc.type.join(' ')}\n\n` +
    `● Mô tả: ${doc.description.trim()}\n\n` +
    `● Link facebook: ${doc.linkfb}\n` +
    (!!doc.wanted ? '● Yêu cầu đối tượng: ' + doc.wanted.trim() + '\n' : '') + 
    (!!doc.deadline ? '● Deadline tuyển nhân sự: ' + doc.deadline.trim() + '\n' : '') +
    (!!doc.benefit ? '● Quyền lợi khi tham gia dự án: ' + doc.benefit.trim() + '\n' : '') +
    `\nTrackID:${doc.psid}:${doc.trackId}`

    return content.trim()
  }

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
      <Linkify>
        {!this.props.admin && doc.approved && <p style={{backgroundColor: '#eee', padding: '10px', width: '100%'}}>
          <center>Bài viết này đã đc admin phê duyệt và sẽ sớm đc đăng lên fanpage</center>
        </p>}
        <p>
          {doc.approved && <Fab size="small" color="primary" style={{marginRight: '15px'}} disabled>
            <CheckIcon />
          </Fab>}
          <b>{doc.name}</b>
        </p>
        <p>#dự_án_ở_{doc.location.replace(/\s+/g, '_')} {doc.type.join(' ')}</p>
        <p>{doc.description}</p>
        <p>
          ● Link facebook: {doc.linkfb}<br/>
          {!!doc.wanted && <span>● Yêu cầu đối tượng: {doc.wanted}<br/></span>}
          {!!doc.deadline && <span>● Deadline tuyển nhân sự: {doc.deadline}<br/></span>}
          {!!doc.benefit && <span>● Quyền lợi khi tham gia dự án: {doc.benefit}<br/></span>}
        </p>
        {this.props.admin && <p>TrackID:{doc.psid}:{doc.trackId}</p>}
        {
          !!doc.image &&
          !!doc.feedback &&
          <p><b>== Thông tin riêng ==</b></p>
        }
        {!!doc.image && <p>● Ảnh tuỳ chọn: {doc.image[0]}</p>}
        {!!doc.feedback && <p>● Câu hỏi, góp ý: {doc.feedback}</p>}
      </Linkify>
      {this.props.admin &&
        <div>
          <Button variant="outlined" onClick={this.deleteDoc.bind(this)} color='primary'>Xóa</Button>&nbsp;&nbsp;
          <Button variant="outlined" onClick={this.toggleApproved.bind(this)} color='primary'>
            {doc.approved ? 'Bỏ duyệt' : 'Duyệt'}
          </Button>&nbsp;&nbsp;
          <CopyToClipboard
            text={this.getCopyContent()}
            onCopy={() => this.setState({isCopied: true})}
          >
            <Button variant="outlined" color='primary'>
              {this.state.isCopied ? '(Đã copy)' : 'Copy'}
            </Button>
          </CopyToClipboard>
        </div>
      }
    </div>

    return (
      <div>
        <Card>
          <CardContent style={{backgroundColor: (doc.approved && this.props.admin) ? '#cfd8dc' : '#fff'}}>
            {this.state.loading ? loading : content}
          </CardContent>        
        </Card>
      </div>
    )
  }
}

export default Doc