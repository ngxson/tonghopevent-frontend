import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import axios from 'axios'
import Config from '../Config'
import Utils from '../Utils'
import Doc from '../components/Doc'
import ToolsDialog from '../components/ToolsDialog'
import DuplicateDocDialog from '../components/DuplicateDocDialog'
import DuplicateHelper from '../DuplicateHelper'

class Home extends React.Component {
  constructor(props) {
    super()
    this.props = props
    this.state = {
      loading: true,
      list: [],
      toolsDialogOpen: false,
      toolsDialogDoc: {},
      duplicateHelper: new DuplicateHelper(),
      duplicateDocDialog: null,
      selectedDocID: '',
    }
    window.changeHeader('Quản lý dữ liệu - TongHopEvent')
  }

  componentDidMount() {
    this.loadData()
  }

  async loadData() {
    const duplicateHelper = new DuplicateHelper()
    const token = Utils.getToken()
    const res = await axios.get(`${Config.BACKEND}/feed?token=${token}`)
    Utils.checkError(res)
    res.data.forEach(doc => duplicateHelper.pushDoc(doc))
    this.setState({
      loading: false,
      list: res.data,
      duplicateHelper
    })
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value })
  }

  onClickEdit() {
    this.setState({edit: true})
  }

  setDoc(i, data) {
    this.setState(state => {
      const list = state.list
      list[i] = data
      return {list}
    })
  }

  openToolsDialog(doc) {
    this.setState({
      toolsDialogOpen: true,
      toolsDialogDoc: doc
    })
  }

  openDuplicateDocDialog(docs, docid) {
    this.setState({
      duplicateDocDialog: docs,
      selectedDocID: docid,
    })
  }

  render() {
    var classes = {
      input: {
        marginBottom: '20px',
        width: '500px',
        maxWidth: '100%'
      },
      container: {
        display: 'flex',
        flexWrap: 'wrap',
      },
      cardStyle: {
        maxWidth: '800px',
        marginTop: '20px',
        marginRight: 'auto',
        marginLeft: 'auto',
      }
    }

    const loading = <div>
      <br/><br/><br/>
      <center><CircularProgress /></center>
    </div>

    const { gotoPublish } = this.props
    const { duplicateDocDialog, duplicateHelper, selectedDocID } = this.state
    const home = (
      <React.Fragment>
        <div style={classes.cardStyle}>
          {
            this.state.list.length === 0 && <center><h2>Chưa có bài đăng nào</h2></center>
          }
          {this.state.list.map((doc, i) => {
            return doc ? <Doc
              doc={doc}
              setDoc={this.setDoc.bind(this)}
              key={doc.id}
              i={i}
              admin
              gotoPublish={gotoPublish}
              openToolsDialog={this.openToolsDialog.bind(this)}
              openDuplicateDocDialog={this.openDuplicateDocDialog.bind(this)}
              duplicateHelper={duplicateHelper}
            /> : null
          })}
        </div>
        <ToolsDialog
          open={this.state.toolsDialogOpen}
          closeToolsDialog={() => this.setState({toolsDialogOpen: false})}
          name={this.state.toolsDialogDoc.name}
          psid={this.state.toolsDialogDoc.psid}
          doc={this.state.toolsDialogDoc}
        />
        <DuplicateDocDialog
          docs={duplicateDocDialog}
          selectedDocID={selectedDocID}
          closeDuplicateDocDialog={() => this.setState({duplicateDocDialog: null})}
        />
      </React.Fragment>
    )

    return this.state.loading ? loading : home
  }
}

export default Home