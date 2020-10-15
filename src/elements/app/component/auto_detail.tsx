import { tag, WeElement, h } from 'omi'
import { myService, pixivService } from 'src/assets/script/service'
import storageUtil from 'src/assets/script/util/storage'
import '@omim/core/text-field'
import '@omim/core/switch'
import Switch from '@omim/core/switch'
import TextField from '@omim/core/text-field'
import analysisUtil from '../../../assets/script/util/analysis'
import heightenUtil from '../../../assets/script/util/heighten'

const AUTO_DETAIL = 'pixiv-tool-auto-collect-detail'

class AutoCollectStorageModel {
  defaultInterval = 1
  defaultSwitch = false
  lastCollectTime = 0
}

@tag('auto-detail')
export default class extends WeElement {
  $autoCollectSwitch: Switch
  $autoCollectInterval: TextField

  autoCollectStorageModel = storageUtil.localGet(
    AUTO_DETAIL,
    new AutoCollectStorageModel()
  )
  timeout: NodeJS.Timeout

  onSwitch = async () => {
    this.autoCollectStorageModel.defaultInterval = Number(
      this.$autoCollectInterval.mdc.value
    )

    this.autoCollectStorageModel.defaultSwitch = this.$autoCollectSwitch.switchControl.checked
    storageUtil.localSet(AUTO_DETAIL, this.autoCollectStorageModel)
    this.collect()
  }
  collect = async () => {
    this.autoCollectStorageModel = storageUtil.localGet(
      AUTO_DETAIL,
      new AutoCollectStorageModel()
    )
    clearTimeout(this.timeout)
    if (
      this.autoCollectStorageModel.defaultSwitch &&
      Date.now() - this.autoCollectStorageModel.lastCollectTime >
      this.autoCollectStorageModel.defaultInterval * 1000 * 0.75
    ) {

      const result = await myService.pagingOriginalUrlTask(1)
      for (let tagTask of result.data.content) {
        try {
          let html = await pixivService.collect(tagTask.pixivId)
          await myService.updateOriginalUrl(analysisUtil.getUpdateOriginalUrlDto(html))
        } catch (e) {
          await myService.updateOriginalUrl({
            pixivId: tagTask.pixivId,
            originalUrl: `采集失败：${e.message}`
          })
        }
      }
      this.autoCollectStorageModel.lastCollectTime = Date.now()
      storageUtil.localSet(AUTO_DETAIL, this.autoCollectStorageModel)
    }
    this.timeout = setTimeout(() => {
      this.collect()
    }, this.autoCollectStorageModel.defaultInterval * 1000)
  }

  installed = () => {
    this.onSwitch()
  }
  render = () => {
    return (
      <p>
        <m-text-field
          label="间隔秒数"
          outlined
          value={this.autoCollectStorageModel.defaultInterval}
          ref={(e: TextField) => (this.$autoCollectInterval = e)}
        />
        <m-switch
          label="自动采集详情"
          ref={(e: Switch) => (this.$autoCollectSwitch = e)}
          style="margin-left:30px"
          onChange={this.onSwitch}
          checked={this.autoCollectStorageModel.defaultSwitch}
        />
      </p>
    )
  }
}
