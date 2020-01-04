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
import WarningIcon from '@material-ui/icons/Warning'
import NoteEditDialog from './NoteEditDialog'
import './Doc.css'

class Doc extends React.Component {
  constructor(props) {
    super()
    this.props = props
    this.state = {
      loading: false,
      isNoteEditOpen: false,
      isCopied: false,
      isExpanded: !this.props.admin,
      copyContent: this.props.admin ? this.getCopyContent() : '',
    }

    if (this.props.doc && this.props.doc.linkfb) {
      this.fbusername = Utils.extractFacebookUsername(this.props.doc.linkfb)
    }

    if (props.admin) {
      if (props.doc.image)
        this.state.publishAction = 'publish'
      else if (this.fbusername)
        this.state.publishAction = 'getimage'
      else
        this.state.publishAction = null
    }
  }

  static propTypes = {
    doc: PropTypes.object.isRequired,
  }

  async askDeleteDoc() {
    window.showAlert({
      title: 'Xác nhận xoá',
      text: 'Xoá "' + this.props.doc.name + '" ? Người điền form sẽ KHÔNG nhận đc thông báo xóa.',
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

  async updateDocField(field, val, url, data) {
    this.setState({loading: true})
    const {doc} = this.props
    const res = await axios.post(url, data)
    if (res.data.success) {
      const newDoc = JSON.parse(JSON.stringify(doc))
      newDoc[field] = val
      this.props.setDoc(this.props.i, newDoc)
    } else {
      window.showAlert({
        title: 'Error',
        text: res.data.error
      })
    }
    this.setState({loading: false})
  }

  async toggleApproved() {
    const {doc} = this.props
    const approved = !doc.approved
    const token = Utils.getLocalStorage('token')
    await this.updateDocField(
      'approved', approved,
      `${Config.BACKEND}/doc/${doc.id}/approved?token=${token}`, {approved}
    )
  }

  async updateComment(cmt) {
    const {doc} = this.props
    const token = Utils.getLocalStorage('token')
    await this.updateDocField(
      'comment', cmt || '',
      `${Config.BACKEND}/doc/${doc.id}/comment?token=${token}`, {comment: cmt}
    )
  }

  getCopyContent() {
    const { doc } = this.props

    const content = `-- ${doc.name} --\n` +
    `${this.generateLocationTag(doc)} ${doc.type.join(' ')}\n\n` +
    `● Mô tả: ${doc.description.trim()}\n\n` +
    `● Link facebook: ${Utils.cleanFBLink(doc.linkfb)}\n` +
    (!!doc.wanted ? '● Yêu cầu đối tượng: ' + doc.wanted.join(', ').trim() + '\n' : '') + 
    (!!doc.deadline ? '● Deadline tuyển nhân sự: ' + doc.deadline.trim() + '\n' : '') +
    (!!doc.benefit ? '● Quyền lợi khi tham gia dự án: ' + doc.benefit.trim() + '\n' : '') +
    `\nTrackID:${doc.psid}:${doc.id}`

    return content.trim()
  }

  nl2br(text) {
    return text.trim().replace(/\r/g, '').split('\n').map(function(item, i, arr) {
      const isLast = i === arr.length - 1
      return <span key={i}>{item}{!isLast && <br/>}</span>
    })
  }

  generateLocationTag(doc) {
    const { location } = doc
    if (!location) return ''
    return location === 'Toàn quốc'
      ? `#dự_án_toàn_quốc`
      : `#dự_án_ở_${doc.location.replace(/\s+/g, '_')}`
  }

  getImageUrl() {
    const { doc } = this.props
    return doc.image ? 'https://drive.google.com/uc?export=view&id=' + doc.image[0] : null
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

  _renderDuplicatedWarningIcon() {
    const { doc, duplicateHelper, openDuplicateDocDialog } = this.props
    if (!duplicateHelper || doc.approved) return null
    const duplicatedDocs = duplicateHelper.checkDoc(doc)
    if (!duplicatedDocs) return null
    else return (
      <Fab
        size="small"
        color="primary"
        style={{marginRight: '15px'}}
        onClick={() => openDuplicateDocDialog(duplicatedDocs, doc.id)}
      >
        <WarningIcon />
      </Fab>
    )
  }

  _renderPostContent() {
    const { doc } = this.props
    return (
      <React.Fragment>
        <p>{this.generateLocationTag(doc)} {doc.type.join(' ')}</p>
        <p>{this.nl2br(doc.description)}</p>
        <p>
          ● Link facebook: {Utils.cleanFBLink(doc.linkfb)}<br/>
          {!!doc.wanted && <span>● Yêu cầu đối tượng: {doc.wanted.join(', ')}<br/></span>}
          {!!doc.deadline && <span>● Deadline tuyển nhân sự: {this.nl2br(doc.deadline)}<br/></span>}
          {!!doc.benefit && <span>● Quyền lợi khi tham gia dự án: <br/>{this.nl2br(doc.benefit)}<br/></span>}
        </p>
        {this.props.admin && <p>TrackID:{doc.psid}:{doc.id}</p>}
        {!!doc.image && <p>Ảnh tuỳ chọn: {'https://drive.google.com/open?id=' + doc.image[0]}</p>}
        <p>
          (Gửi lúc {Utils.getTimeStr(doc.created)} ngày {Utils.getDateStr(doc.created)})
          {!!doc.org && <span><br/>Đơn vị tổ chức: {Utils.getOrgName(doc)}</span>}
        </p>
        {(!this.props.admin && !!doc.feedback) && <p>● Câu hỏi, góp ý: {doc.feedback}</p>}
      </React.Fragment>
    )
  }

  render() {
    const { doc } = this.props
    const { isExpanded, copyContent, publishAction, isNoteEditOpen } = this.state
    const gotoPublish = this.props.gotoPublish || (() => {})

    const componentDecorator = (href, text, key) => (
      <a href={href} key={key} target="_blank" rel="noopener noreferrer">
        {text}
      </a>
    )

    /* TEXT CONTENT (visible for all) */

    const content = <div>
      <div style={isExpanded ? null : {maxHeight: '315px', overflow:'hidden', position: 'relative'}} className={isExpanded ? null : 'fade-out'}>
        {!this.props.admin && this._renderNonAdminInfo()}
        <p>
          {doc.approved && <Fab size="small" color="primary" style={{marginRight: '15px'}} disabled>
            <CheckIcon />
          </Fab>}
          {this._renderDuplicatedWarningIcon()}
          <b>-- {doc.name} --</b>
          {doc.plan && <p><span className='doc-plan'>█ Gói {doc.plan.toUpperCase()}</span></p>}
        </p>
        <Linkify componentDecorator={componentDecorator}>
          {this._renderPostContent()}
        </Linkify>
      </div>
      {this.props.admin && <div>
        <center>
          <Button onClick={() => this.setState({isExpanded: !isExpanded})}>
            {isExpanded ? 'Thu gọn' : 'Hiện thêm ...'}
          </Button>
        </center>
      </div>}
      <Divider />

      {/* ADMIN BUTTONS */}

      {this.props.admin &&
        <React.Fragment>
          {!this.state.loading ? <div>
            {doc.comment && doc.comment.trim().length > 0 && <p><b>● Ghi chú:</b> {this.nl2br(doc.comment)}</p>}
            {!!doc.feedback && <p>● Câu hỏi, góp ý: {doc.feedback}</p>}
            <Button variant="outlined" onClick={this.askDeleteDoc.bind(this)} color='primary'>Xóa</Button>
            <Button variant="outlined" onClick={this.toggleApproved.bind(this)} color='primary'>Tick</Button>
            <CopyToClipboard
              text={copyContent}
              onCopy={() => this.setState({isCopied: true})}
            >
              <Button variant="outlined" color='primary'>
                {this.state.isCopied ? '(Đã copy)' : 'Copy'}
              </Button>
            </CopyToClipboard>
            {publishAction &&
              <Button variant="outlined" onClick={() => {gotoPublish({
                caption: copyContent,
                url: this.getImageUrl(),
                fbusername: this.fbusername,
              }, publishAction)}} color='primary'>Đăng bài</Button>
            }
            <Button variant="outlined" onClick={() => this.setState({isNoteEditOpen: true})} color='primary'>Ghi chú</Button>
            <Button variant="outlined" onClick={() => this.props.openToolsDialog(doc)} color='primary'>+</Button>
          </div>
          : <center>
            <CircularProgress />
          </center>}
        </React.Fragment>
      }
    </div>

    /* CARD BACKGROUND */

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
        {isNoteEditOpen && <NoteEditDialog doc={doc} onClose={(cmt) => {
          this.setState({isNoteEditOpen: false})
          if (cmt !== false) this.updateComment(cmt)
        }}/>}
      </div>
    )
  }
}

export default Doc