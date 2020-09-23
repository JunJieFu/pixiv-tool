import { tag, WeElement, h } from "omi";
import "@omim/core/tab";
import "@omim/core/text-field";
import * as css from "./_index.less";
import "./collect";
import "./auto";
import { EnumModel } from "src/assets/script/model";

type TabKey = "collect" | "auto";

const TabEnumList = [
  new EnumModel<TabKey>("collect", "采集"),
  new EnumModel<TabKey>("auto", "自动"),
];

@tag("pixiv-tool")
export default class extends WeElement {
  static css = css;

  activeTab: TabKey = "collect";

  updateTab = (value: TabKey) => {
    this.activeTab = value;
    this.update();
  };
  changeTab = (customEvent: CustomEvent) => {
    this.activeTab = customEvent.detail.value;
    this.update();
  };

  render = () => {
    return (
      <div>
        <div className={"tab"}>
          {TabEnumList.map((it: EnumModel<TabKey>) => (
            <button
              o-ripple
              onClick={(_) => this.updateTab(it.key)}
              className={this.activeTab === it.key ? "active" : null}
            >
              {it.value}
            </button>
          ))}
        </div>
        {/* 在入侵网站中，不知道为什么没事件触发，导致切换不了 */}
        {/* <m-tab
          default-active="collect"
          onChange={(event: CustomEvent) => {
            this.changeTab(event);
          }}
          align="end"
        >
          <item label="采集" value="collect"></item>
          <item label="自动" value="auto"></item>
        </m-tab> */}

        <pixiv-collect
          style={{ display: this.activeTab === "collect" ? "block" : "none" }}
        />
        <pixiv-auto
          style={{ display: this.activeTab === "collect" ? "none" : "block" }}
        />
      </div>
    );
  };
}
