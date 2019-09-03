import { define, WeElement, classNames, extractClass } from 'omi'

function extract(from, props) {
  const to = {}
  props.forEach(prop => {
    if (from[prop] !== undefined) {
      to[prop] = from[prop]
    }
  })
  return to
}

define('my-input', class extends WeElement {
  static css = [require('./_index.less')]
  value
  install() {
    this.value = this.props.value
  }

  render(props) {
    const classList = classNames(
      { [`${props.color || 'default'}-color`]: true },
      { small: !!props.small },
      { big: !!props.big },
      { block: !!props.block },
      { disabled: !!props.disabled },
      { shadow: !!props.shadow },
      { textarea: !!props.textarea },
      { type: props.type === 'textarea' },
      'input'
    )
    const inputProps = extract(props, [
      'type',
      'title',
      'disabled',
      'placeholder',
      'readonly'
    ])

    return (
      <label class={classList}>
        <input
          value={this.value}
          class={`input-inner`}
          {...inputProps}
          onInput={event => {
            this.value = event.target.value
          }}
        />
      </label>
    )
  }
})
