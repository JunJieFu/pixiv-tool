import { define, WeElement } from 'omi'
import {
  ABookmarkUntagged,
  ACollect,
  AListTagTask,
  APixivDrawSave,
  APixivErrorSave,
  ABookmarkTag
} from '../../assets/script/service'
import dialog from 'omim/dialog'
import util from '../../assets/script/util'
import { AuthorizeForm } from '../../assets/script/model'

define('my-app', class extends WeElement {
  static css = [require('./_index.less')]
  type = true
  errorAmount = 0
  currentAmount = 0
  tagValue = '太美了'
  pageTotal = 20
  loading = false
  authorizeForm = new AuthorizeForm()
  authorizeTips = '待设置授权信息'
  authorize = () => {
    window.authorizeForm = this.authorizeForm
    if (window.authorizeForm.accessKey && window.authorizeForm.secretKey) {
      this.authorizeTips = '设置授权信息成功'
    }
    this.update()
  }

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
            this.currentAmount++
            this.update()
          } catch (e) {
            this.errorAmount++
            await APixivErrorSave({
              pixivId: tagTask.pixivId,
              status: e.status || 403,
              message: e.message
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
  removeTag = () => {
    dialog.confirm({
      confirmText: '确定',
      cancelText: '取消',
      msg: '你确定取消吗？',
      confirm: async () => {
        const html = await ABookmarkTag(this.tagValue)
        const pageTotal = this.pageTotal
        const pageHtmlList = []
        for (let i = 1; i <= pageTotal; i++) {
          pageHtmlList.push(await ABookmarkTag(this.tagValue, i))
        }
        const form = util.getUntaggedForm(html, this.tagValue, ...pageHtmlList)
        form.find('[name="del_tag"]')[0].click()
      }
    })
  }

  render() {
    let resultDiv = null
    if (this.type) {
      resultDiv = (
        <div>
          <div style={{ marginBottom: '15px' }}>
            <my-input
              color={'primary'}
              value={this.authorizeForm.accessKey}
              onInput={e => {
                this.authorizeForm.accessKey = e.target.value
                this.update()
              }}
              placeholder={'accessKey'}
              shadow
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <my-input
              color={'primary'}
              value={this.authorizeForm.secretKey}
              onInput={e => {
                this.authorizeForm.secretKey = e.target.value
                this.update()
              }}
              placeholder={'secretKey'}
              type={'password'}
              shadow
            />
          </div>
          <div>
            <my-btn color={'primary'} onClick={this.authorize} shadow>
              {this.authorizeTips}
            </my-btn>
          </div>
          <div style={{ display: 'flex' }}>
            <p style={{ flex: 1 }}>采集坐标：{this.currentAmount}</p>
            <p style={{ flex: 1 }}>采集异常数：{this.errorAmount}</p>
          </div>
          <div>
            <my-btn color={'primary'} onClick={this.collectTag} shadow>
              采集标签
            </my-btn>
            <my-btn
              color={'primary'}
              onClick={(this.loading = false)}
              shadow
              style={{ marginLeft: '10px' }}
            >
              停止
            </my-btn>
          </div>
        </div>
      )
    } else {
      resultDiv = (
        <div>
          <div style={{ marginBottom: '15px' }}>
            <my-input
              color={'primary'}
              value={this.tagValue}
              onInput={e => {
                this.tagValue = e.target.value
                this.update()
              }}
              shadow
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <my-input
              color={'primary'}
              value={this.pageTotal}
              onInput={e => {
                this.pageTotal = e.target.value
                this.update()
              }}
              shadow
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <my-btn color={'primary'} onClick={this.addTag} shadow>
              批量添加标签
            </my-btn>
            <my-btn
              color={'primary'}
              onClick={this.removeTag}
              shadow
              style={{ marginLeft: '10px' }}
            >
              批量移除标签
            </my-btn>
          </div>
        </div>
      )
    }

    return (
      <div>
        <div style={{ marginBottom: '15px' }}>
          <my-btn
            color={'primary'}
            onClick={_ => {
              this.type = !this.type
              this.update()
            }}
            shadow
            style={{ marginTop: '15px' }}
          >
            切换面板
          </my-btn>
        </div>
        {resultDiv}
      </div>
    )
  }
})
