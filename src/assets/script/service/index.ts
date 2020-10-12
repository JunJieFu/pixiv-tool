import * as $ from 'jquery'
import {
  Page,
  PixivCollectBody,
  PixivPicture,
  PixivResult,
  PixivWork,
  Result,
  SaveDto
} from 'src/assets/constant/custom_type'
import { pixivHost, serveHost } from 'src/assets/script/config'


export const myService = {
  listTagTask(): JQuery.jqXHR<Result<PixivPicture[]>> {
    return $.ajax(`${serveHost}/collect/listTagTask`)
  },
  pagingOriginalUrlTask(size: number = 5): JQuery.jqXHR<Result<Page<PixivWork>>> {
    return $.get({
      url: `${serveHost}/collect/pagingOriginalUrlTask`,
      data: { size }
    })
  },
  updateOriginalUrl(dto: PixivWork): JQuery.jqXHR<Result<boolean>> {
    return $.post({
      url: `${serveHost}/collect/updateOriginalUrl`,
      data: JSON.stringify(dto),
      contentType: 'application/json'
    })
  },
  save(saveDto: SaveDto): JQuery.jqXHR<Result<boolean>> {
    return $.post({
      url: `${serveHost}/collect/save`,
      data: saveDto,
      dataType: 'json'
    })
  },
  insert(data: PixivCollectBody): JQuery.jqXHR<Result<boolean>> {
    return $.post({
      url: `${serveHost}/collect/insert`,
      data: JSON.stringify(data),
      contentType: 'application/json'
    })
  }
}

export const pixivService = {
  collect(pixivId: string): JQuery.jqXHR<string> {
    return $.ajax(
      `${pixivHost}/artworks/${pixivId}`
    )
  },
  bookmarkUntagged(page: number): JQuery.jqXHR<string> {
    return $.ajax(`${pixivHost}/bookmark.php`, {
      data: {
        untagged: 1,
        rest: 'show',
        p: page
      }
    })
  },
  listBookmarks(
    pageIndex: number,
    userId = 17225384
  ): JQuery.jqXHR<PixivResult<PixivCollectBody>> {
    const limit = 48
    return $.ajax(`${pixivHost}/ajax/user/${userId}/illusts/bookmarks`, {
      data: {
        tag: null,
        offset: pageIndex * limit,
        limit,
        rest: 'show',
        lang: 'zh'
      }
    })
  }
}
