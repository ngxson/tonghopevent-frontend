import React from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import Dialog from '@material-ui/core/Dialog'
import Divider from '@material-ui/core/Divider'
import PropTypes from 'prop-types'
import Utils from '../Utils'

class DuplicateDocDialog extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  static propTypes = {
    docs: PropTypes.any,
    selectedDocID: PropTypes.any,
    closeDuplicateDocDialog: PropTypes.func.isRequired,
  }

  _renderContent() {
    const { docs, selectedDocID } = this.props

    return (
      <List>
        {docs.map((doc) => {
          if (doc.id === selectedDocID) return null
          else return <ListItem button onClick={
            () => window.open(`/data/#/view/${doc.id}`, '_blank')
          } key={doc.id}>
            <ListItemText
              primary={doc.name}
              secondary={`${Utils.getDateStr(doc.created)} lúc ${Utils.getTimeStr(doc.created)}`}
            />
          </ListItem>
        })}
        <Divider />
        <ListItem button onClick={this.props.closeDuplicateDocDialog}>
          <ListItemText primary="Quay lại" />
        </ListItem>
      </List>
    )
  }

  render() {
    const { docs } = this.props

    return (
      <Dialog
        open={!!docs}
        aria-labelledby="simple-dialog-title"
      >
        <DialogTitle id="simple-dialog-title">Bài đăng trùng</DialogTitle>
        <DialogContent>
          Bài đăng này có thể bị trùng với những bài sau:
        </DialogContent>
        {docs && this._renderContent()}
      </Dialog>
    )
  }
}

export default DuplicateDocDialog
