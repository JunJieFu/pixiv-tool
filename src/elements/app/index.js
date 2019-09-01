import { define, extend, WeElement } from 'omi'
import '../../components/form/input/index'
import '../../components/form/btn/index'
import $ from 'jquery'
import {
  AListTagTask,
  ACollect,
  APixivDrawSave,
  APixivErrorSave,
  ABookmarkUntagged
} from '../../assets/script/service'
import util from '../../assets/script/util'

define('pixiv-tool', class extends WeElement {
  static css = [require('./_index.less')]
  errorAmount = 0
  currentNumber = 0
  tagValue = 'fuck'
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
      let html = await ABookmarkUntagged()
      let total = util.getUntaggedAmount(html)
      let form = util.getUntaggedForm(html)
      let pageTotal = Math.ceil(total / 20)
      for (let i = 1; i <= pageTotal; i++) {
        let pageHtml = await ABookmarkUntagged(i)
        $(pageHtml)
          .find('.btn-container')
          .each((index, item) => {
            form.find('._image-items.js-legacy-mark-unmark-list').append(item)
          })
      }
      form.find('.btn-container btn').prop({ checked: true })
      form.css('display', 'none')
      $('body').append(form)
      form.find('[name="add_tag"]').each((index, item) => {
        item.value = '太美了'
      })
      form.find('[name="add"]')[0].click()
    }
  }

  render() {
    return (
      <div style={`width:100%;height:100%`}>
        <p>{this.errorAmount}</p>
        <p>{this.currentNumber}</p>
        <div>
          <my-btn color={`primary`} onClick={this.collectTag}>
            采集标签
          </my-btn>
        </div>
        <div>
          <my-input
            color={`primary`}
            value={this.tagValue}
            onInput={e => {
              this.tagValue = e.target.props.value
              this.update()
            }}
          />
          <my-btn color={`primary`} onClick={this.addTag}>
            批量添加书签
          </my-btn>
          <p>{this.tagValue}</p>
        </div>
      </div>
    )
  }
})
