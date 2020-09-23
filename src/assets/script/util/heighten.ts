export default {
  /**
   * 防抖函数
   * @param fn
   * @param wait
   * @param immediate
   */
  debounce(fn: Function, wait: number, immediate: boolean) {
    let timer: NodeJS.Timeout;
    return function () {
      const context = this;
      const args = arguments;
      if (timer) clearTimeout(timer);
      if (immediate) {
        const callNow = !timer;
        timer = setTimeout(() => {
          timer = null;
        }, wait);
        if (callNow) fn.apply(context, args);
      } else {
        timer = setTimeout(() => {
          fn.apply(context, args);
        }, wait);
      }
    };
  },

  /**
   * 节流函数
   * @param fn
   * @param wait
   */
  throttle(fn: Function, wait: number) {
    // let previous = 0
    // return function() {
    //   const now = Date.now()
    //   if (now - previous > wait) {
    //     fn.apply(this, arguments)
    //     previous = now
    //   }
    // }
    let timeout: NodeJS.Timeout;
    return function () {
      const context = this;
      const args = arguments;
      if (!timeout) {
        timeout = setTimeout(() => {
          timeout = null;
          fn.apply(context, args);
        }, wait);
      }
    };
  },

  /**
   * 可选链
   * @param object
   * @param rest
   */
  optionalChaining(object: object, ...rest: string[]) {
    let tmp = object;
    for (let key in rest) {
      let name = rest[key];
      tmp = tmp?.[name];
    }
    return tmp || undefined;
  },
  /**
   * 枚举代理
   * @param object
   */
  enumProxy<T extends object>(param: T) {
    const map: Map<string, { key: string; value: string }> = new Map();
    Object.keys(param).forEach((key) => {
      map[key] = { key, value: param[key] };
    });
    return map;
  },
  /**
   * 沉睡
   * @param wait
   */
  sleep(wait: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, wait);
    });
  },
};
