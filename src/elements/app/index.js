import { define, WeElement } from 'omi'
import {
  ACollect,
  AListTagTask,
  APixivDrawSave
} from '../../assets/script/service'
import dialog from 'omim/dialog'
import util from '../../assets/script/util'

define('pixiv-tool', class extends WeElement {
  static css = [require('./_index.less')]
  type = true
  errorAmount = 0
  currentAmount = 0
  loading = false

  collectTag = () => {
    dialog.confirm({
      confirmText: '确定',
      cancelText: '取消',
      msg: '你确定添加吗？',
      confirm: async () => {
        let tagTaskList = await AListTagTask()
        this.loading = true
        for (let tagTask of tagTaskList.data) {
          try {
            if (!this.loading) {
              return
            }
            let html = await ACollect(tagTask.pixivId)
            let object = util.getPixivObject(html)
            await APixivDrawSave(object)
            this.currentAmount++
          } catch (e) {
            this.errorAmount++
          } finally {
            this.update()
          }
        }
      }
    })
  }

  render() {
    return (
      <div class="pixiv-tool">
        <p>采集坐标：{this.currentAmount}</p>
        <p>采集异常数：{this.errorAmount}</p>
        <p>
          <my-btn color={'primary'} onClick={this.collectTag} shadow>
            采集标签
          </my-btn>
        </p>
        <p>
          <my-btn
            color={'primary'}
            onClick={() => (this.loading = false)}
            shadow
          >
            停止
          </my-btn>
        </p>
      </div>
    )
  }
})
