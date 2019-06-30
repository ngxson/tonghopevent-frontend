import 'date-fns';
import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

class MaterialUIPickers extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      publish_time: new Date(
        Date.now() + 20 * 60 * 1000
      )
    }
  }

  componentDidMount() {
    this.props.handleDateChange(this.state.publish_time.getTime() / 1000)
  }

  handleDateChange(date) {
    this.setState({publish_time: date})
    this.props.handleDateChange(date.getTime() / 1000)
  }

  render() {
    const { publish_time } = this.state;

    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          margin="normal"
          id="mui-pickers-date"
          label="Date picker"
          value={publish_time}
          onChange={this.handleDateChange.bind(this)}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <KeyboardTimePicker
          margin="normal"
          id="mui-pickers-time"
          label="Time picker"
          value={publish_time}
          onChange={this.handleDateChange.bind(this)}
          KeyboardButtonProps={{
            'aria-label': 'change time',
          }}
        />
      </MuiPickersUtilsProvider>
    );
  }
}

export default MaterialUIPickers;