export default {
  /**
   * @param key
   * @param value
   */
  localSet<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
    return value;
  },

  /**
   *
   * @param key
   * @param defaultValue
   */
  localGet<T>(key: string, defaultValue: T = null) {
    const stringValue = localStorage.getItem(key);
    return stringValue ? (JSON.parse(stringValue) as T) : defaultValue;
  },

  /**
   * @param key
   * @param value
   */
  sessionSet<T>(key: string, value: T) {
    sessionStorage.setItem(key, JSON.stringify(value));
    return value;
  },
  /**
   *
   * @param key
   * @param defaultValue
   */
  sessionGet<T>(key: string, defaultValue: T = null) {
    const stringValue = sessionStorage.getItem(key);
    return stringValue ? (JSON.parse(stringValue) as T) : defaultValue;
  },
};
