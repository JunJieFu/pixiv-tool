import { define, WeElement } from 'omi'
import 'omim/tab'
import 'omim/text-field'
import './collect'
import './auto'

define('pixiv-tool', class extends WeElement {
  static css = [require('./_index.less')]

  activeTab = 'collect'

  updateTab = value => {
    this.activeTab = value
    this.update()
  }

  render = () => {
    return (
      <div>
        <div className={'tab'}>
          <button
            o-ripple
            onClick={event => this.updateTab('collect')}
            className={this.activeTab === 'collect' ? 'active' : null}
          >
            采集
          </button>
          <button
            o-ripple
            onClick={event => this.updateTab('auto')}
            className={this.activeTab === 'auto' ? 'active' : null}
          >
            自动
          </button>
        </div>
        <pixiv-collect
          style={{ display: this.activeTab === 'collect' ? 'block' : 'none' }}
        />
        <pixiv-auto
          style={{ display: this.activeTab === 'collect' ? 'none' : 'block' }}
        />
      </div>
    )
  }
})
