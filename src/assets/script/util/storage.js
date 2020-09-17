export default {
  /**
   * @template T
   * @param key
   * @param {T}value
   * @returns {T}
   */
  localSet(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
    return value
  },
  /**
   * @template T
   * @param key
   * @param {T}defaultValue
   * @returns {T}
   */
  localGet(key, defaultValue = null) {
    const stringValue = localStorage.getItem(key)
    return stringValue ? JSON.parse(stringValue) : defaultValue
  },
  sessionSet(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value))
    return value
  },
  sessionGet(key, defaultValue = null) {
    const stringValue = sessionStorage.getItem(key)
    return stringValue ? JSON.parse(stringValue) : defaultValue
  }
}
