import { tag, WeElement, h } from "omi";
import { myService, pixivService } from "src/assets/script/service";
import * as css from "./_index.less";
import "@omim/core/text-field";
import TextField from "@omim/core/text-field";
import * as $ from "jquery";
import heightenUtil from "src/assets/script/util/heighten";
import { PixivDetail, PixivTagDetail } from "src/assets/constant/custom_type";
import {TestDetail} from "src/assets/constant/test_detail";

@tag("pixiv-collect")
export default class extends WeElement {
  static css = css;
  type = true;
  errorAmount = 0;
  currentAmount = 0;
  loading = false;
  $interval: TextField;
  $insertStartPageIndex: TextField;
  $insertEndPageIndex: TextField;

  collectTag = async () => {
    let tagTaskList = await myService.listTagTask();
    const interval = Number(this.$interval.mdc.value);
    this.loading = true;
    for (let tagTask of tagTaskList.data) {
      try {
        if (!this.loading) {
          return;
        }
        let html = await pixivService.collect(tagTask.pixivId);
        await myService.save(this.getPixivObject(html));
        this.currentAmount++;
      } catch (e) {
        this.errorAmount++;
      } finally {
        await heightenUtil.sleep(interval * 1000);
        this.update();
      }
    }
  };

  getPixivObject(html: string) {
    let sourceObject = JSON.parse(
      $(html)
        .filter((_, item: HTMLElement) => item.id === "meta-preload-data")
        .attr("content")
    );

    let picture: PixivDetail =
      sourceObject.illust[Object.keys(sourceObject.illust)[0]];
    if (!picture) {
      throw Error("picture为空?");
    } else {
      return {
        pixivId: picture.id,
        name: picture.title,
        userName: picture.userName,
        userId: picture.userId,
        tagString: picture.tags.tags
          .map((item: PixivTagDetail) => {
            if (item.translation && item.translation.en) {
              return item.translation.en;
            }
            return item.tag;
          })
          .join("|"),
      };
    }
  }

  getText() {
    const html: string = TestDetail.html;
    let sourceObject = JSON.parse(
      $(html)
        .filter((_, item: HTMLElement) => item.id === "meta-preload-data")
        .attr("content")
    );

    let picture: PixivDetail =
      sourceObject.illust[Object.keys(sourceObject.illust)[0]];
      
    if (!picture) {
      throw Error("picture为空?");
    } else {
      return {
        pixivId: picture.id,
        name: picture.title,
        userName: picture.userName,
        userId: picture.userId,
        tagString: picture.tags.tags
          .map((item: PixivTagDetail) => {
            if (item.translation && item.translation.en) {
              return item.translation.en;
            }
            return item.tag;
          })
          .join("|"),
      };
    }
  }

  insert = async () => {
    const startPageIndex = Number(this.$insertStartPageIndex.mdc.value);
    const endPageIndex = Number(this.$insertEndPageIndex.mdc.value);
    const interval = Number(this.$interval.mdc.value);
    if (
      !isNaN(startPageIndex) &&
      !isNaN(endPageIndex) &&
      startPageIndex <= endPageIndex
    ) {
      for (let i = startPageIndex; i <= endPageIndex; i++) {
        const result = await pixivService.listBookmarks(i);
        await myService.insert(result.body);
        await heightenUtil.sleep(interval * 1000);
      }
    }
  };

  render = () => {
    return (
      <div>
        <p>
          <m-text-field
            label="间隔时间"
            outlined
            value={5}
            ref={(e: TextField) => (this.$interval = e)}
          />
        </p>
        <hr />
        <p>采集坐标：{this.currentAmount}</p>
        <p>采集异常数：{this.errorAmount}</p>
        <p>
          <m-button ripple dense raised onClick={this.collectTag}>
            采集标签
          </m-button>
          <m-button
            ripple
            dense
            raised
            onClick={() => (this.loading = false)}
            style="margin-left:10px"
          >
            停止
          </m-button>
        </p>
        <hr />
        <p>
          <m-text-field
            label="开始页数"
            outlined
            ref={(e: TextField) => (this.$insertStartPageIndex = e)}
          />
          <m-text-field
            style="margin-left:10px"
            label="结束页数"
            outlined
            ref={(e: TextField) => (this.$insertEndPageIndex = e)}
          />
        </p>
        <p>
          <m-button ripple dense raised onClick={this.insert}>
            采集收藏
          </m-button>
          <m-button ripple dense raised onClick={this.getText}>
            测试
          </m-button>
        </p>
      </div>
    );
  };
}
