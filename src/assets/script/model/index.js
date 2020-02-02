export class AuthorizeForm {
  constructor() {
    this.accessKey = null
    this.secretKey = null
  }
}

export class OptionEnum {
  /**
   * 下拉枚举
   * @param {String,Number}label
   * @param {*}value
   */
  constructor(label = 0, value = null) {
    this.label = label
    this.value = value
  }
}