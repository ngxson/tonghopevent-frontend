import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import axios from 'axios'
import Config from '../Config'
import Utils from '../Utils'
import Doc from '../components/Doc'

class Home extends React.Component {
  constructor(props) {
    super()
    this.props = props
    this.state = {
      loading: true,
      list: [],
    }
    window.changeHeader('Quản lý dữ liệu - TongHopEvent')
  }

  componentDidMount() {
    this.loadData()
  }

  async loadData() {
    const token = Utils.getToken()
    const res = await axios.get(`${Config.BACKEND}/feed?token=${token}`)
    this.setState({loading: false, list: res.data})
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value })
  }

  onClickEdit() {
    this.setState({edit: true})
  }

  setDoc(i, data) {
    console.log(i, data)
    this.setState(state => {
      const list = state.list
      list[i] = data
      return {list}
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

    const home = (
      <div style={classes.cardStyle}>
        {this.state.list.map((doc, i) => {
          return <Doc doc={doc} setDoc={this.setDoc.bind(this)} key={doc.id} i={i} admin />
        })}
      </div>
    )

    return this.state.loading ? loading : home
  }
}

export default Home