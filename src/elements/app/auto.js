import { define, WeElement } from 'omi'
import 'omim/tab'
import 'omim/text-field'
import 'omim/switch'
import { myService, pixivService } from '../../assets/script/service'
import storageUtil from '../../assets/script/util/storage'

const AUTO_COLLECT = 'pixiv-tool-auto-collect'

class AutoCollectStorageModel {
  constructor() {
    this.defaultInterval = 10
    this.defaultSwitch = false
    this.lastCollectTime = 0
  }
}

define('pixiv-auto', class extends WeElement {
  $autoCollectSwitch = null
  $autoCollectInterval = null

  autoCollectStorageModel = storageUtil.localGet(
    AUTO_COLLECT,
    new AutoCollectStorageModel()
  )
  timeout = null

  onSwitch = async () => {
    this.autoCollectStorageModel.defaultInterval = this.$autoCollectInterval.shadowRoot.getElementById(
      'my-text-field'
    ).value

    this.autoCollectStorageModel.defaultSwitch = this.$autoCollectSwitch.shadowRoot.getElementById(
      'basic-switch'
    ).checked
    storageUtil.localSet(AUTO_COLLECT, this.autoCollectStorageModel)
    this.collect()
  }
  collect = async () => {
    this.autoCollectStorageModel = storageUtil.localGet(
      AUTO_COLLECT,
      new AutoCollectStorageModel()
    )

    clearTimeout(this.timeout)
    if (
      this.autoCollectStorageModel.defaultSwitch &&
      Date.now() - this.autoCollectStorageModel.lastCollectTime >
        this.autoCollectStorageModel.defaultInterval * 1000 * 0.75
    ) {
      const result = await pixivService.listBookmarks(0)
      await myService.insert(result.body)
      this.autoCollectStorageModel.lastCollectTime = Date.now()
      storageUtil.localSet(AUTO_COLLECT, this.autoCollectStorageModel)
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
          ref={e => (this.$autoCollectInterval = e)}
        />
        <m-switch
          label="自动采集收藏夹"
          ref={e => (this.$autoCollectSwitch = e)}
          style="margin-left:30px"
          onChange={this.onSwitch}
          checked={this.autoCollectStorageModel.defaultSwitch}
        />
      </p>
    )
  }
})
