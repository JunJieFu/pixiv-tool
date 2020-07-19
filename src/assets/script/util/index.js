import $ from 'jquery'
export default {
  /**
   *
   * @param html
   * @returns {{pixivId: *, name: *, tagString: *, userName: *, userId: *}}
   */
  getPixivObject(html) {
    let sourceObject = JSON.parse(
      $(html)
        .filter((index, item) => item.id === 'meta-preload-data')
        .attr('content')
    )
    let draw = null

    draw = sourceObject.illust[Object.keys(sourceObject.illust)[0]]
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

  getPixivError(html) {
    return $(html)
      .find('error-message')[0]
      .text()
  },

  getUntaggedAmount(html) {
    return (
      $(html)
        .find('[href="/bookmark.php?untagged=1"] .cnt')
        .text()
        .replace(/[^0-9]/gi, '') * 1
    )
  },

  getUntaggedForm(html, tagName, ...pageHtmlList) {
    const clone = $(html)
      .find('[action="bookmark_setting.php"]')
      .clone()
    clone.remove('._image-items.js-legacy-mark-unmark-list .image-item')

    pageHtmlList.forEach(pageHtml => {
      $(pageHtml)
        .find('.input-container')
        .each((index, item) => {
          clone.find('._image-items.js-legacy-mark-unmark-list').append(item)
        })
    })

    clone.find('.input-container input').prop({ checked: true })
    clone.css('display', 'none')
    clone.find('[name="add_tag"]').each((index, item) => {
      item.value = tagName
    })
    $('body').append(clone)
    return clone
  }
}
