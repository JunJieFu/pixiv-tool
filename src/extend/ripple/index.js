import { extend, classNames, define, WeElement, render } from 'omi'

function calculate(e, el) {
  const offset = el.getBoundingClientRect()
  const target =
    e.constructor.name === 'TouchEvent' ? e.touches[e.touches.length - 1] : e
  const localX = target.clientX - offset.left
  const localY = target.clientY - offset.top

  let scale = 0.3
  let radius = Math.sqrt(el.clientWidth ** 2 + el.clientHeight ** 2) / 2

  const centerX = `${(el.clientWidth - radius * 2) / 2}px`
  const centerY = `${(el.clientHeight - radius * 2) / 2}px`

  const x = `${localX - radius}px`
  const y = `${localY - radius}px`

  return { radius, scale, x, y, centerX, centerY }
}

extend('ripple', (el, path, scope) => {
  const { color } = path
  let ripple

  function showRipple(e) {
    const { radius, scale, x, y, centerX, centerY } = calculate(e, el)
    ripple = render(
      <my-ripple
        scale={scale}
        size={radius * 2}
        x={x}
        y={y}
        centerX={centerX}
        centerY={centerY}
        color={color}
      />,
      el
    )
  }
  function hideRipple(e) {
    if (ripple) {
      ripple.hide()
      ripple = undefined
    }
  }
  el.addEventListener('touchstart', showRipple, { passive: true })
  el.addEventListener('touchend', hideRipple, { passive: true })
  el.addEventListener('touchcancel', hideRipple)
  el.addEventListener('mousedown', showRipple)
  el.addEventListener('mouseup', hideRipple)
  el.addEventListener('mouseleave', hideRipple)
  el.addEventListener('dragstart', hideRipple, { passive: true })
})

define('my-ripple', class extends WeElement {
  static css = [require('./_index.less')]
  scale
  x
  y
  show = false
  opacity = 0

  install = () => {
    const computed = window.getComputedStyle(this.parentElement)
    if (computed && computed.position === 'static') {
      this.parentElement.style.position = 'relative'
      this.parentElement.dataset.previousPosition = 'static'
    }
    this.scale = this.props.scale
    this.x = this.props.x
    this.y = this.props.y
    this.show = true
    this.dataset.activated = String(performance.now())
  }

  installed = () => {
    requestAnimationFrame(() => {
      this.opacity = 0.25
      this.scale = 1
      this.x = this.props.centerX
      this.y = this.props.centerY
      this.update()
    })
  }

  hide() {
    const diff = performance.now() - Number(this.dataset.activated)
    const delay = Math.max(250 - diff, 0)
    setTimeout(() => {
      this.show = false
      this.opacity = 0
      this.update()
      setTimeout(() => {
        this.parentElement && this.parentElement.removeChild(this)
        if (this.parentElement && this.parentElement.dataset.previousPosition) {
          this.parentElement.style.position = this.parentElement.dataset.previousPosition
          delete this.parentElement.dataset.previousPosition
        }
      }, 300)
    }, delay)
  }

  render(props) {
    return (
      <span class={`ripple-container`}>
        <span
          class={classNames(
            { [`ripple-animation`]: true },
            { [`in`]: this.show },
            { [`out`]: !this.show }
          )}
          style={{
            transform: `translate(${this.x}, ${this.y}) scale3d(${this.scale},${this.scale},${this.scale})`,
            width: props.size,
            height: props.size,
            opacity: this.opacity,
            color: props.color
          }}
        />
      </span>
    )
  }
})
