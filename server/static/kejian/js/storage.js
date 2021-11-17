/**
 * @description storage封装
 * @author 凉风有信、
 */

export default {
  setItem (key, value) {
    const storage = this.getStorage()
    storage[key] = value
    window.localStorage.setItem(config.namespace, JSON.stringify(storage))
  },
  getItem (key) {
    return this.getStorage()[key]
  },
  getStorage () {
    return JSON.parse(window.localStorage.getItem('music') || '{}')
  },
  clearItem (key) {
    const storage = this.getStorage()
    delete storage[key]
    window.localStorage.setItem('music', JSON.stringify(storage))
  },
  clearAll () {
    window.localStorage.clear()
  }
}
