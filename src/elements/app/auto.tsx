import { h, tag, WeElement } from 'omi'
import './component/auto_favorite'
import './component/auto_detail'

@tag('pixiv-auto')
export default class extends WeElement {

  render = () => {
    return (
      <div>
        <auto-favorite/>
        <hr/>
        <auto-detail/>
      </div>
    )
  }
}
