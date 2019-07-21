
import axios from 'axios'

class Utils {
  static getToken() {
    const token = Utils.getLocalStorage('token')
    if (!token) window.location.href = '#/login'
    else return token
  }

  static checkDebounce(name) {
    if (!window.lastRun) window.lastRun = {}
    const last = window.lastRun[name] || 0
    const now = Date.now()
    if (now - last < 500) {
      return true
    } else {
      window.lastRun[name] = now
    }
  }

  static checkError(res) {
    if (res && res.data && res.data.error === 'Invalid token') {
      Utils.removeLocalStorage('token')
      window.location.reload()
    }
  }

  static setLocalStorage(name, value) {
    localStorage.setItem(name, JSON.stringify(value))
  }
  
  static getLocalStorage(name) {
    const item = localStorage.getItem(name) || null
    if (item === null) return null
    return JSON.parse(localStorage.getItem(name))
  }
  
  static removeLocalStorage(name) {
    localStorage.removeItem(name)
  }
  
  static getDateStr(timestamp) {
    let date = new Date(timestamp || 1)
    let d = date.getDate()
    let m = date.getMonth() + 1
    let y = date.getFullYear()
    return `${d < 10 ? '0' : ''}${d}-${m < 10 ? '0' : ''}${m}-${y}`
  }

  static getTimeStr(timestamp) {
    let date = new Date(timestamp || 1)
    let hh = date.getHours()
    let mm = date.getMinutes()
    return `${hh < 10 ? '0' : ''}${hh}h${mm < 10 ? '0' : ''}${mm}`
  }

  static extractFacebookUsername(text = '') {
    const matched = text.replace('/pg/', '/').match(/[facebok]+\.com\/([^?/]+)/)
    if (!matched || matched.length < 1) return null
    const uname = matched[1]
    const _id = uname.match(/-([0-9]{7,20})$/)
    if (!_id || _id.length < 1) return uname
    else return _id[1]
  }

  static makeRequest(url, method = 'get', payload = {}) {
    const token = Utils.getLocalStorage('token')
    const _url = url + (url.indexOf('?') !== -1 ? '&' : '?') + 'token=' + token
    return axios[method](_url, payload)
  }

  static cleanFBLink(url = '') {
    return url.replace(/[&?](__|eid|fref)[^&?\s]+/g, '')
  }
}

export default Utils
