import { PixivDetail, PixivTagDetail, PixivWork } from '../../constant/custom_type'
import * as $ from 'jquery'

export default {
  getUpdateOriginalUrlDto(html: string): PixivWork {
    let sourceObject = JSON.parse(
      $(html)
        .filter((_, item: HTMLElement) => item.id === 'meta-preload-data')
        .attr('content')
    )

    let picture: PixivDetail =
      sourceObject.illust[Object.keys(sourceObject.illust)[0]]
    if (!picture) {
      throw Error('picture为空?')
    } else {
      return {
        pixivId: picture.id,
        description: picture.illustComment,
        originalUrl: picture.urls.original,
        translateTags: picture.tags.tags
          .map((item: PixivTagDetail) => {
            if (item.translation && item.translation.en) {
              return item.translation.en
            }
            return item.tag
          })
          .join('|')
      }
    }
  }
}
