import $ from 'jquery'
export default {
  /**
   *
   * @param html
   * @returns {{pixivId: *, name: *, tagString: *, userName: *, userId: *}}
   */
  getPixivObject(html) {
    let scriptList = html.match(/<script>'use strict'[\s\S]+?<\/script>/g)
    let draw = null
    for (let script of scriptList) {
      let scriptString = $(script).html()
      let sourceObject = (function() {
        // eslint-disable-next-line no-eval
        window.eval(
          scriptString.replace(
            "'use strict';var globalInitData",
            'var collectInitData'
          )
        )
        try {
          return collectInitData
        } catch (e) {
          return null
        }
      })()
      if (sourceObject) {
        draw =
          sourceObject.preload.illust[
            Object.keys(sourceObject.preload.illust)[0]
          ]
        break
      }
    }
    if (!draw) {
      throw new Error('draw为空?')
    } else {
      return {
        pixivId: draw.id,
        name: draw.title,
        userName: draw.userName,
        userId: draw.userId,
        tagString: draw.tags.tags
          .map(item => {
            if (item.translation && item.translation.en) {
              return item.translation.en
            }
            return item.tag
          })
          .join('|')
      }
    }
  },

  getUntaggedAmount(html) {
    return (
      $(html)
        .find('[href="/bookmark.php?untagged=1"] .cnt')
        .text()
        .replace(/[^0-9]/gi, '') * 1
    )
  },

  getUntaggedForm(html) {
    let clone = $(html)
      .find('[action="bookmark_setting.php"]')
      .clone()
    clone.remove('._image-items.js-legacy-mark-unmark-list .image-item')
    return clone
  }
}
