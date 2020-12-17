import { h, tag, WeElement } from 'omi'
import { myService, pixivService } from 'src/assets/script/service'
import storageUtil from 'src/assets/script/util/storage'
import '@omim/core/text-field'
import '@omim/core/switch'
import Switch from '@omim/core/switch'
import TextField from '@omim/core/text-field'
import analysisUtil from '../../../assets/script/util/analysis'

const AUTO_DETAIL = 'pixiv-tool-auto-collect-detail'

class AutoCollectStorageModel {
  defaultInterval = 1
  defaultSwitch = false
  lastCollectTime = 0
  defaultPageSize = 4
}

@tag('auto-detail')
export default class extends WeElement {
  $autoCollectSwitch: Switch
  $autoCollectInterval: TextField
  $pageSize: TextField

  autoCollectStorageModel = storageUtil.localGet(
    AUTO_DETAIL,
    new AutoCollectStorageModel()
  )
  timeout: NodeJS.Timeout

  onSwitch = async () => {
    this.autoCollectStorageModel.defaultInterval = Number(
      this.$autoCollectInterval.mdc.value
    )
    this.autoCollectStorageModel.defaultPageSize = Number(
      this.$pageSize.mdc.value
    )
    this.autoCollectStorageModel.defaultSwitch = this.$autoCollectSwitch.switchControl.checked
    storageUtil.localSet(AUTO_DETAIL, this.autoCollectStorageModel)
    this.getTask()
  }
  getTask = async () => {
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

      const result = await myService.pagingOriginalUrlTask(this.autoCollectStorageModel.defaultPageSize)
      await Promise.all(result.data.items.map(it => this.collect(it.pixivId)))
      this.autoCollectStorageModel.lastCollectTime = Date.now()
      storageUtil.localSet(AUTO_DETAIL, this.autoCollectStorageModel)
    }
    this.timeout = setTimeout(() => {
      this.getTask()
    }, this.autoCollectStorageModel.defaultInterval * 1000)
  }

  collect = async (pixivId: string) => {
    try {
      let html = await pixivService.collect(pixivId)
      await myService.updateOriginalUrl(analysisUtil.getUpdateOriginalUrlDto(html))
    } catch (e) {
      await myService.updateOriginalUrl({
        pixivId: pixivId,
        originalUrl: `采集失败：${e.message}`
      })
    }
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
        <m-text-field
          style="margin-left:15px;width:100px"
          label="线程数"
          outlined
          value={this.autoCollectStorageModel.defaultPageSize}
          ref={(e: TextField) => (this.$pageSize = e)}
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
