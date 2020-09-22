import { tag, WeElement, h } from "omi";
import "@omim/core/text-field";
import "@omim/core/switch";
import { myService, pixivService } from "../../assets/script/service";
import storageUtil from "../../assets/script/util/storage";

const AUTO_COLLECT = "pixiv-tool-auto-collect";

class AutoCollectStorageModel {
  defaultInterval = 10;
  defaultSwitch = false;
  lastCollectTime = 0;
}

@tag("pixiv-auto")
export default class extends WeElement {
  $autoCollectSwitch: HTMLElement = null;
  $autoCollectInterval: HTMLElement = null;

  autoCollectStorageModel = storageUtil.localGet(
    AUTO_COLLECT,
    new AutoCollectStorageModel()
  );
  timeout = null;

  onSwitch = async () => {
    this.autoCollectStorageModel.defaultInterval = parseInt(
      (this.$autoCollectInterval.shadowRoot.getElementById(
        "my-text-field"
      ) as HTMLInputElement).value
    );

    this.autoCollectStorageModel.defaultSwitch = (this.$autoCollectSwitch.shadowRoot.getElementById(
      "basic-switch"
    ) as HTMLInputElement).checked;
    storageUtil.localSet(AUTO_COLLECT, this.autoCollectStorageModel);
    this.collect();
  };
  collect = async () => {
    this.autoCollectStorageModel = storageUtil.localGet(
      AUTO_COLLECT,
      new AutoCollectStorageModel()
    );

    clearTimeout(this.timeout);
    if (
      this.autoCollectStorageModel.defaultSwitch &&
      Date.now() - this.autoCollectStorageModel.lastCollectTime >
        this.autoCollectStorageModel.defaultInterval * 1000 * 0.75
    ) {
      const result = await pixivService.listBookmarks(0);
      await myService.insert(result.body);
      this.autoCollectStorageModel.lastCollectTime = Date.now();
      storageUtil.localSet(AUTO_COLLECT, this.autoCollectStorageModel);
    }
    this.timeout = setTimeout(() => {
      this.collect();
    }, this.autoCollectStorageModel.defaultInterval * 1000);
  };

  installed = () => {
    this.onSwitch();
  };
  render = () => {
    return (
      <p>
        <m-text-field
          label="间隔秒数"
          outlined
          value={this.autoCollectStorageModel.defaultInterval}
          ref={(e: HTMLElement) => (this.$autoCollectInterval = e)}
        />
        <m-switch
          label="自动采集收藏夹"
          ref={(e: HTMLElement) => (this.$autoCollectSwitch = e)}
          style="margin-left:30px"
          onChange={this.onSwitch}
          checked={this.autoCollectStorageModel.defaultSwitch}
        />
      </p>
    );
  };
}