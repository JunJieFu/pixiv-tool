import { tag, WeElement, h } from "omi";
import { myService, pixivService } from "../../assets/script/service";
import * as css from "./_index.less";
import "@omim/core/tab";
import "@omim/core/text-field";
import * as $ from "jquery";
import heightenUtil from "../../assets/script/util/heighten";

@tag("pixiv-collect")
export default class extends WeElement {
  static css = css;
  type = true;
  errorAmount = 0;
  currentAmount = 0;
  loading = false;
  $insertStartPageIndex: HTMLElement = null;
  $insertEndPageIndex: HTMLElement = null;
  $interval: HTMLElement = null;
  collectTag = async () => {
    let tagTaskList = await myService.listTagTask();
    const interval = parseInt(
      (this.$interval.shadowRoot.getElementById(
        "my-text-field"
      ) as HTMLInputElement).value
    );
    this.loading = true;
    for (let tagTask of tagTaskList.data) {
      try {
        if (!this.loading) {
          return;
        }
        let html = await pixivService.collect(tagTask.pixivId);
        let object = this.getPixivObject(html);
        await myService.save(object);
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
        .filter(
          (index: number, item: HTMLElement) => item.id === "meta-preload-data"
        )
        .attr("content")
    );
    let picture = null;

    picture = sourceObject.illust[Object.keys(sourceObject.illust)[0]];
    if (!picture) {
      throw Error("picture为空?");
    } else {
      return {
        pixivId: picture.id,
        name: picture.title,
        userName: picture.userName,
        userId: picture.userId,
        tagString: picture.tags.tags
          .map((item) => {
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
    const startPageIndex = parseInt(
      (this.$insertStartPageIndex.shadowRoot.getElementById(
        "my-text-field"
      ) as HTMLInputElement).value
    );
    const endPageIndex = parseInt(
      (this.$insertEndPageIndex.shadowRoot.getElementById(
        "my-text-field"
      ) as HTMLInputElement).value
    );
    const interval = parseInt(
      (this.$interval.shadowRoot.getElementById(
        "my-text-field"
      ) as HTMLInputElement).value
    );
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
            ref={(e: HTMLElement) => (this.$interval = e)}
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
            ref={(e: HTMLElement) => (this.$insertStartPageIndex = e)}
          />
          <m-text-field
            style="margin-left:10px"
            label="结束页数"
            outlined
            ref={(e: HTMLElement) => (this.$insertEndPageIndex = e)}
          />
        </p>
        <p>
          <m-button ripple dense raised onClick={this.insert}>
            采集收藏
          </m-button>
        </p>
      </div>
    );
  };
}
