import { h, tag, WeElement } from 'omi'
import { myService, pixivService } from 'src/assets/script/service'
import * as css from './_index.less'
import '@omim/core/text-field'
import TextField from '@omim/core/text-field'
import heightenUtil from 'src/assets/script/util/heighten'
import analysisUtil from 'src/assets/script/util/analysis'

// import { TestDetail } from 'src/assets/constant/test_detail'

@tag('pixiv-collect')
export default class extends WeElement {
  static css = css
  type = true
  errorAmount = 0
  currentAmount = 0
  loading = false
  $interval: TextField
  $pageSize: TextField
  $insertStartPageIndex: TextField
  $insertEndPageIndex: TextField

  collectTagOriginalUrl = async () => {
    const pageSize = Number(this.$pageSize.mdc.value)
    const result = await myService.pagingOriginalUrlTask(pageSize)
    const interval = Number(this.$interval.mdc.value)
    this.loading = true
    for (let tagTask of result.data.items) {
      try {
        if (!this.loading) {
          return
        }
        let html = await pixivService.collect(tagTask.pixivId)
        await myService.updateOriginalUrl(analysisUtil.getUpdateOriginalUrlDto(html))
        this.currentAmount++
      } catch (e) {
        this.errorAmount++
      } finally {
        await heightenUtil.sleep(interval * 1000)
        this.update()
      }
    }
  }


  insert = async () => {
    const startPageIndex = Number(this.$insertStartPageIndex.mdc.value)
    const endPageIndex = Number(this.$insertEndPageIndex.mdc.value)
    const interval = Number(this.$interval.mdc.value)
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
            ref={(e: TextField) => (this.$interval = e)}
          />
        </p>
        <hr/>
        <m-text-field
          label="采集条数"
          outlined
          ref={(e: TextField) => (this.$pageSize = e)}
        />
        <p>采集坐标：{this.currentAmount}</p>
        <p>采集异常数：{this.errorAmount}</p>
        <p>
          <m-button ripple dense raised onClick={this.collectTagOriginalUrl}>
            采集原始Url
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
        <hr/>


        <p>
          <m-text-field
            label="开始页数"
            outlined
            ref={(e: TextField) => (this.$insertStartPageIndex = e)}
          />
          <m-text-field
            style="margin-left:10px"
            label="结束页数"
            outlined
            ref={(e: TextField) => (this.$insertEndPageIndex = e)}
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
}
