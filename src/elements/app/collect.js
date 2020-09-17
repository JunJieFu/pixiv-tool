import { define, WeElement } from 'omi'
import { myService, pixivService } from '../../assets/script/service'
import 'omim/tab'
import 'omim/text-field'
import $ from 'jquery'
import heightenUtil from '../../assets/script/util/heighten'

define('pixiv-collect', class extends WeElement {
  static css = [require('./_index.less')]
  type = true
  errorAmount = 0
  currentAmount = 0
  loading = false
  $insertStartPageIndex = null
  $insertEndPageIndex = null
  $interval = null
  collectTag = async () => {
    let tagTaskList = await myService.listTagTask()
    const interval =
      this.$interval.shadowRoot.getElementById('my-text-field').value * 1
    this.loading = true
    for (let tagTask of tagTaskList.data) {
      try {
        if (!this.loading) {
          return
        }
        let html = await pixivService.collect(tagTask.pixivId)
        let object = this.getPixivObject(html)
        await myService.save(object)
        this.currentAmount++
      } catch (e) {
        this.errorAmount++
      } finally {
        await heightenUtil.sleep(interval * 1000)
        this.update()
      }
    }
  }

  /**
   *
   * @param html
   * @returns {{pixivId: *, name: *, tagString: *, userName: *, userId: *}}
   */
  getPixivObject(html) {
    let sourceObject = JSON.parse(
      $(html)
        .filter((index, item) => item.id === 'meta-preload-data')
        .attr('content')
    )
    let picture = null

    picture = sourceObject.illust[Object.keys(sourceObject.illust)[0]]
    if (!picture) {
      throw new Error('picture为空?')
    } else {
      return {
        pixivId: picture.id,
        name: picture.title,
        userName: picture.userName,
        userId: picture.userId,
        tagString: picture.tags.tags
          .map(item => {
            if (item.translation && item.translation.en) {
              return item.translation.en
            }
            return item.tag
          })
          .join('|')
      }
    }
  }

  insert = async () => {
    const startPageIndex =
      this.$insertStartPageIndex.shadowRoot.getElementById('my-text-field')
        .value * 1
    const endPageIndex =
      this.$insertEndPageIndex.shadowRoot.getElementById('my-text-field')
        .value * 1
    const interval =
      this.$interval.shadowRoot.getElementById('my-text-field').value * 1
    if (
      !isNaN(startPageIndex) &&
      !isNaN(endPageIndex) &&
      startPageIndex <= endPageIndex
    ) {
      for (let i = startPageIndex; i <= endPageIndex; i++) {
        const result = await pixivService.listBookmarks(i)
        await myService.insert(result.body)
        await heightenUtil.sleep(interval * 1000)
      }
    }
  }

  render = () => {
    return (
      <div>
        <p>
          <m-text-field
            label="间隔时间"
            outlined
            value={5}
            ref={e => (this.$interval = e)}
          />
        </p>
        <hr />
        <p>采集坐标：{this.currentAmount}</p>
        <p>采集异常数：{this.errorAmount}</p>
        <p>
          <m-button ripple dense raised onClick={this.collectTag}>
            采集标签
          </m-button>
          <m-button
            ripple
            dense
            raised
            onClick={() => (this.loading = false)}
            style="margin-left:10px"
          >
            停止
          </m-button>
        </p>
        <hr />
        <p>
          <m-text-field
            label="开始页数"
            outlined
            ref={e => (this.$insertStartPageIndex = e)}
          />
          <m-text-field
            style="margin-left:10px"
            label="结束页数"
            outlined
            ref={e => (this.$insertEndPageIndex = e)}
          />
        </p>
        <p>
          <m-button ripple dense raised onClick={this.insert}>
            采集收藏
          </m-button>
        </p>
      </div>
    )
  }
})
