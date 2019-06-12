import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class Alert extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      onClickOK: null
    }
    window.showAlert = this.show.bind(this)
  }

  show(data) {
    this.setState({
      open: true,
      title: data.title,
      text: data.text,
      onClickOK: data.onClickOK || null,
      showCancel: data.showCancel
    })
  }

  handleClose = () => {
    if (this.state.onClickOK) {
      this.state.onClickOK();
      this.setState({ onClickOK: null });
    }
    this.setState({ open: false });
  };

  handleCancel = () => {
    this.setState({ open: false });
  };

  render() {
    return (
      <div>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{this.state.title}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {this.state.text}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose.bind(this)} color="primary" autoFocus>OK</Button>
            {this.state.showCancel
              ? <Button onClick={this.handleCancel.bind(this)} color="primary" autoFocus>Cancel</Button>
              : null}
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default Alert;