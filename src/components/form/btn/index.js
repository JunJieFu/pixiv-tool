import { classNames, define, WeElement } from 'omi'

define('my-btn', class extends WeElement {
  static css = [require('./_index.less')]
  render(props) {
    const classList = classNames(
      { [`${props.color || 'default'}-color`]: true },
      { small: !!props.small },
      { big: !!props.big },
      { icon: !!props.icon },
      { flat: !!props.flat },
      { outline: !!props.outline },
      { round: !!props.round },
      { shadow: !!props.shadow },
      { block: !!props.block },
      { disabled: !!props.disabled },
      'btn'
    )
    return (
      <button class={classList} o-ripple>
        <div class={'content'}>
          <slot />
        </div>
      </button>
    )
  }
})
