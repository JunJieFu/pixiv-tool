import * as $ from "jquery";
import { pixivHost, serveHost } from "../../../assets/script/config";

export const myService = {
  listTagTask() {
    return $.ajax(`${serveHost}/collect/listTagTask`);
  },
  save(pixivDraw) {
    $.post({
      url: `${serveHost}/collect/save`,
      data: pixivDraw,
      dataType: "json",
    });
  },
  saveError(error) {
    $.post({
      url: `${serveHost}/collect/saveError`,
      data: error,
      dataType: "json",
    });
  },
  insert(data) {
    $.post({
      url: `${serveHost}/collect/insert`,
      data: JSON.stringify(data),
      contentType: "application/json",
    });
  },
};

export const pixivService = {
  collect(pixivId: string) {
    return $.ajax(
      `${pixivHost}/member_illust.php?mode=medium&illust_id=${pixivId}`
    );
  },
  bookmarkUntagged(page: number) {
    return $.ajax(`${pixivHost}/bookmark.php`, {
      data: {
        untagged: 1,
        rest: "show",
        p: page,
      },
    });
  },
  listBookmarks(pageIndex: number, userId = 17225384) {
    const limit = 48;
    return $.ajax(`${pixivHost}/ajax/user/${userId}/illusts/bookmarks`, {
      data: {
        tag: null,
        offset: pageIndex * limit,
        limit: 48,
        rest: "show",
        lang: "zh",
      },
    });
  },
};
