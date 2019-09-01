import { define, WeElement, classNames } from 'omi'

define('my-input', class extends WeElement {
  static css = [require('./_index.less')]
  value = 123

  render(props) {
    const classList = classNames(
      { [`${props.color || 'default'}-color`]: true },
      { small: !!props.small },
      { big: !!props.big },
      { block: !!props.block },
      { disabled: !!props.disabled },
      { textarea: !!props.textarea },
      { type: props.type === 'textarea' },
      'input'
    )
    return (
      <label class={classList}>
        <input
          value={props.value}
          class={`input-inner`}
          type={props.type}
          title={props.title}
          disabled={!!props.disabled}
          placeholder={props.placeholder}
          readonly={!!props.readonly}
          onInput={event => {
            this.props.value = event.target.value
          }}
        />
      </label>
    )
  }
})
