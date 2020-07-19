import $ from 'jquery'
import { pixivHost, serveHost } from '../../../assets/script/config'

export function AListTagTask() {
  return $.ajax(`${serveHost}/collect/listTagTask`, {
    headers: window.authorizeForm
  })
}

export function APixivDrawSave(pixivDraw) {
  $.post({
    url: `${serveHost}/collect/save`,
    data: pixivDraw,
    dataType: 'json',
    headers: window.authorizeForm
  })
}

export function APixivErrorSave(error) {
  $.post({
    url: `${serveHost}/collect/saveError`,
    data: error,
    dataType: 'json',
    headers: window.authorizeForm
  })
}

export function ACollect(pixivId) {
  return $.ajax(
    `${pixivHost}/member_illust.php?mode=medium&illust_id=${pixivId}`
  )
}

export function ABookmarkUntagged(page) {
  return $.ajax(`${pixivHost}/bookmark.php`, {
    data: {
      untagged: 1,
      rest: 'show',
      p: page
    }
  })
}

export function ABookmarkTag(tag, page) {
  return $.ajax(`${pixivHost}/bookmark.php`, {
    data: {
      tag,
      rest: 'show',
      p: page
    }
  })
}
