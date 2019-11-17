
import Utils from './Utils'

class DuplicateHelper {
  seen = {}

  /**
   * Remember that we've seen this doc
   * @param {*} doc 
   */
  pushDoc(doc) {
    const uname = Utils.extractFacebookUsername(doc.linkfb)
    if (!uname) return null
    if (this.seen[uname]) {
      this.seen[uname].push(doc)
    } else {
      this.seen[uname] = [doc]
    }
  }

  /**
   * Returns arr of docs if doc is seen
   * Returns null if doc isn't seen
   * @param {*} doc 
   */
  checkDoc(doc) {
    const uname = Utils.extractFacebookUsername(doc.linkfb)
    const arr = this.seen[uname]
    return (arr && arr.length > 1) ? arr : null
  }

  /**
   * Clear all remembered docs
   */
  clear() {
    this.seen = {}
  }
}

export default DuplicateHelper