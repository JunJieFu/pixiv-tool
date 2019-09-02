import { define, WeElement } from 'omi'
import {
  ABookmarkUntagged,
  ACollect,
  AListTagTask,
  APixivDrawSave,
  APixivErrorSave
} from '../../assets/script/service'
import util from '../../assets/script/util'

define('pixiv-tool', class extends WeElement {
  static css = [require('./_index.less')]
  errorAmount = 0
  currentNumber = 0
  tagValue = '太美了'

  collectTag = async () => {
    if (confirm('你确定采集吗？')) {
      let tagTaskList = await AListTagTask()
      for (let tagTask of tagTaskList) {
        try {
          let html = await ACollect(tagTask.pixivId)
          let object = util.getPixivObject(html)
          await APixivDrawSave(object)
          this.currentNumber++
          this.update()
        } catch (e) {
          this.currentNumber++
          await APixivErrorSave({ pixivId: tagTask.pixivId, message: e.status })
          this.update()
        }
      }
    }
  }

  addTag = async () => {
    if (confirm('你确定添加吗？')) {
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
  }

  render() {
    return (
      <div>
        <div>
          <p>采集坐标：{this.currentNumber}</p>
          <p>采集异常数：{this.errorAmount}</p>
          <button onClick={this.collectTag}>采集标签</button>
        </div>
        <div>
          <input
            type="text"
            value={this.tagValue}
            onInput={event => (this.tagValue = event.target.value)}
          />
          <button onClick={this.addTag}>批量添加标签</button>
        </div>
      </div>
    )
  }
})
