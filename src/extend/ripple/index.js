import { extend, classNames, define, WeElement, render } from "omi"

const calculate = (e, el) => {
  const offset = el.getBoundingClientRect()
  const target = e
  const localX = target.clientX - offset.left
  const localY = target.clientY - offset.top

  let radius = 0
  let scale = 0.3
  radius = Math.sqrt(el.clientWidth ** 2 + el.clientHeight ** 2) / 2

  const centerX = `${(el.clientWidth - radius * 2) / 2}px`
  const centerY = `${(el.clientHeight - radius * 2) / 2}px`

  const x = `${localX - radius}px`
  const y = `${localY - radius}px`

  return { radius, scale, x, y, centerX, centerY }
}

extend("ripple", (el, path, scope) => {
  let ripple

  function showRipple(e) {
    const { radius, scale, x, y, centerX, centerY } = calculate(e, el)
    ripple = render(<my-ripple scale={scale} size={radius * 2} x={x} y={y} centerX={centerX} centerY={centerY}/>, el)
  }

  function hideRipple(e) {
    if (ripple) {
      ripple.hide()
    }
  }

  el.addEventListener("mousedown", showRipple)
  el.addEventListener("mouseup", hideRipple)
  el.addEventListener("mouseleave", hideRipple)
})


define("my-ripple", class extends WeElement {
  static css = [require("./_index.less")]
  scale
  x
  y
  show = false
  opacity = 0
  install = () => {
    this.scale = this.props.scale
    this.x = this.props.x
    this.y = this.props.y
    this.show = true
  }

  installed = () => {
    requestAnimationFrame(() => {
      this.opacity = .25
      this.scale = 1
      this.x = this.props.centerX
      this.y = this.props.centerY
      this.update()
    })
  }

  hide() {
    requestAnimationFrame(() => {
      this.show = false
      this.opacity = 0
      this.update()
      setTimeout(() => {
        this.parentNode && this.parentNode.removeChild(this)
      }, 250)
    })
  }

  render(props) {
    return (
      <span class={`v-ripple__container`}>
        <span
          class={classNames({ [`v-ripple__animation`]: true }, { [`v-ripple__animation--in`]: this.show }, { [`v-ripple__animation--out`]: !this.show })}
          style={{
            transform: `translate(${this.x}, ${this.y}) scale3d(${this.scale},${this.scale},${this.scale})`,
            width: props.size,
            height: props.size,
            opacity: this.opacity
          }}/>
      </span>
    )
  }
})
