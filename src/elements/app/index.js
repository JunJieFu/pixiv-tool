import { define, WeElement } from 'omi'
import {
  ABookmarkUntagged,
  ACollect,
  AListTagTask,
  APixivDrawSave,
  APixivErrorSave
} from '../../assets/script/service'
import dialog from 'omim/dialog'
import util from '../../assets/script/util'

define('my-app', class extends WeElement {
  static css = [require('./_index.less')]
  errorAmount = 0
  currentNumber = 0
  tagValue = '太美了'
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
            let html = await ACollect(tagTask.pixivId)
            let object = util.getPixivObject(html)
            await APixivDrawSave(object)
            this.currentNumber++
            this.update()
          } catch (e) {
            this.errorAmount++
            await APixivErrorSave({
              pixivId: tagTask.pixivId,
              message: e.status || e.message || 403
            })
            this.update()
          }
        }
      }
    })
  }

  addTag = () => {
    dialog.confirm({
      confirmText: '确定',
      cancelText: '取消',
      msg: '你确定添加吗？',
      confirm: async () => {
        const html = await ABookmarkUntagged()
        const total = util.getUntaggedAmount(html)
        const pageTotal = Math.ceil(total / 20)
        const pageHtmlList = []
        for (let i = 1; i <= pageTotal; i++) {
          pageHtmlList.push(await ABookmarkUntagged(i))
        }
        const form = util.getUntaggedForm(html, this.tagValue, ...pageHtmlList)
        form.find('[name="add"]')[0].click()
      }
    })
  }

  render() {
    return (
      <div>
        <div>
          <p>采集坐标：{this.currentNumber}</p>
          <p>采集异常数：{this.errorAmount}</p>
          <my-btn color={'primary'} onClick={this.collectTag}>
            采集标签
          </my-btn>
          <my-btn color={'primary'} onClick={(this.loading = false)}>
            停止
          </my-btn>
        </div>
        <br />
        <div>
          <my-input
            color={'primary'}
            value={this.tagValue}
            onInput={e => {
              this.tagValue = e.target.value
              this.update()
            }}
            shadow
          />
          <br />
          <br />
          <my-btn color={'primary'} onClick={this.addTag} shadow>
            批量添加标签
          </my-btn>
          <p>{this.tagValue}</p>
        </div>
      </div>
    )
  }
})
