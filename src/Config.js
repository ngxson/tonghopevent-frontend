
/*var ConfigDebug = {
  BACKEND: 'http://localhost:5000/tonghopevent'
}
var ConfigProduction = {
  BACKEND: 'https://nuichatbot.herokuapp.com/tonghopevent'
}

var Config = ConfigDebug
var MODE = process.env.REACT_APP_MODE
if (MODE === 'production')
  Config = ConfigProduction*/

const Config = {
  BACKEND: 'https://nuichatbot.herokuapp.com/tonghopevent'
}

export default Config