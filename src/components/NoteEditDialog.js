import React from 'react'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import PropTypes from 'prop-types'

class NoteEditDialog extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      comment: props.doc.comment || '',
    }
  }

  static propTypes = {
    onClose: PropTypes.func.isRequired,
    doc: PropTypes.any.isRequired,
  }

  render() {
    const { comment } = this.state
    const { onClose } = this.props

    return (
      <React.Fragment>
        <Dialog open={true} onClose={() => onClose(false)} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Ghi chú</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Bạn có thể để lại ghi chú cho bài viết này. Chỉ có Admin mới nhìn thấy ghi chú.
            </DialogContentText>
            <TextField
              multiline
              rowsMax="20"
              value={comment}
              onChange={event => {this.setState({ comment: event.target.value })}}
              margin="normal"
              variant="outlined"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => onClose(false)} color="primary">
              Quay lại
            </Button>
            <Button onClick={() => onClose(comment)} color="primary">
              LƯU GHI CHÚ
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
}

export default NoteEditDialog
