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
import Divider from '@material-ui/core/Divider'
import CheckIcon from '@material-ui/icons/Check'
import './Doc.css'

class Doc extends React.Component {
  constructor(props) {
    super()
    this.props = props
    this.state = {
      loading: false,
      isCopied: false,
      isExpanded: !this.props.admin
    }
  }

  static propTypes = {
    doc: PropTypes.object.isRequired,
  }

  async askDeleteDoc() {
    window.showAlert({
      title: 'Xác nhận xoá',
      text: 'Xoá "' + this.props.doc.name + '" ?',
      onClickOK: this.deleteDoc.bind(this),
      showCancel: true
    })
  }

  async deleteDoc() {
    const {doc} = this.props
    this.setState({loading: true})
    const token = Utils.getLocalStorage('token')
    const res = await axios.delete(`${Config.BACKEND}/doc/${doc.id}?token=${token}`)
    if (res.data.success) {
      this.props.setDoc(this.props.i, null)
    } else {
      this.setState({loading: false})
      window.showAlert({
        title: 'ERROR',
        text: 'Message: ' + res.data.error
      })
    }
  }

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

    const content = `-- ${doc.name} --\n` +
    `${this.generateLocationTag(doc)} ${doc.type.join(' ')}\n\n` +
    `● Mô tả: ${doc.description.trim()}\n\n` +
    `● Link facebook: ${doc.linkfb}\n` +
    (!!doc.wanted ? '● Yêu cầu đối tượng: ' + doc.wanted.join(', ').trim() + '\n' : '') + 
    (!!doc.deadline ? '● Deadline tuyển nhân sự: ' + doc.deadline.trim() + '\n' : '') +
    (!!doc.benefit ? '● Quyền lợi khi tham gia dự án: ' + doc.benefit.trim() + '\n' : '') +
    `\nTrackID:${doc.psid}:${doc.id}`

    return content.trim()
  }

  nl2br(text) {
    return text.trim().replace(/\r/g, '').split('\n').map(function(item, i, arr) {
      const isLast = i === arr.length - 1
      return <span>{item}{!isLast && <br/>}</span>
    })
  }

  generateLocationTag(doc) {
    const { location } = doc
    if (!location) return ''
    return location === 'Toàn quốc'
      ? `#dự_án_toàn_quốc`
      : `#dự_án_ở_${doc.location.replace(/\s+/g, '_')}`
  }

  _renderNonAdminInfo() {
    const { doc } = this.props
    return <p style={{backgroundColor: '#eee', padding: '10px', width: '100%'}}>
      <center>
        {doc.approved
          ? 'Bài viết này đã được duyệt và sẽ sớm đc đăng lên fanpage'
          : 'Bài viết này đang đợi để được kiểm duyệt'
        }
      </center>
    </p>
  }

  openImageView() {
    const { doc } = this.props
    window.open('https://drive.google.com/uc?export=view&id=' + doc.image[0])
  }

  render() {
    const { doc } = this.props
    const { isExpanded } = this.state

    const componentDecorator = (href, text, key) => (
      <a href={href} key={key} target="_blank" rel="noopener noreferrer">
        {text}
      </a>
    )

    const content = <div>
      <Linkify componentDecorator={componentDecorator}>
        <div style={isExpanded ? null : {maxHeight: '315px', overflowY:'hidden', position: 'relative'}} className={isExpanded ? null : 'fade-out'}>
          {!this.props.admin && this._renderNonAdminInfo()}
          <p>
            {doc.approved && <Fab size="small" color="primary" style={{marginRight: '15px'}} disabled>
              <CheckIcon />
            </Fab>}
            <b>-- {doc.name} --</b>
          </p>
          <p>{this.generateLocationTag(doc)} {doc.type.join(' ')}</p>
          <p>{this.nl2br(doc.description)}</p>
          <p>
            ● Link facebook: {doc.linkfb}<br/>
            {!!doc.wanted && <span>● Yêu cầu đối tượng: {doc.wanted.join(', ')}<br/></span>}
            {!!doc.deadline && <span>● Deadline tuyển nhân sự: {this.nl2br(doc.deadline)}<br/></span>}
            {!!doc.benefit && <span>● Quyền lợi khi tham gia dự án: <br/>{this.nl2br(doc.benefit)}<br/></span>}
          </p>
          {this.props.admin && <p>TrackID:{doc.psid}:{doc.id}</p>}
          {
            (!!doc.image || !!doc.feedback) &&
            <p><b>== Thông tin riêng ==</b></p>
          }
          {!!doc.image && <p>● Ảnh tuỳ chọn: {'https://drive.google.com/open?id=' + doc.image[0]}</p>}
          {!!doc.feedback && <p>● Câu hỏi, góp ý: {doc.feedback}</p>}
        </div>
        {this.props.admin && <div>
          <center>
            <Button onClick={() => this.setState({isExpanded: !isExpanded})}>
              {isExpanded ? 'Thu gọn' : 'Hiện thêm ...'}
            </Button>
          </center>
        </div>}
      </Linkify>
      <Divider style={{marginBottom: '20px'}}/>
      {this.props.admin &&
        <React.Fragment>
          {!this.state.loading ? <div>
            <Button variant="outlined" onClick={this.askDeleteDoc.bind(this)} color='primary'>Xóa</Button>&nbsp;&nbsp;
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
            </CopyToClipboard>&nbsp;&nbsp;
            {doc.image &&
              <Button variant="outlined" onClick={this.openImageView.bind(this)} color='primary'>Lấy ảnh</Button>
            }
          </div>
          : <center>
            <CircularProgress />
          </center>}
        </React.Fragment>
      }
    </div>

    return (
      <div style={{paddingBottom: '20px'}}>
        <Card>
          <CardContent
            style={{backgroundColor: (doc.approved && this.props.admin) ? '#cfd8dc' : '#fff'}}
            className={(doc.approved && this.props.admin) ? 'approved' : null}
          >
            {content}
          </CardContent>        
        </Card>
      </div>
    )
  }
}

export default Doc