import { classNames, WeElement, tag, h } from "omi";
import * as css from "./_index.less";

interface MyRippleProps {
  scale: number;
  x: string;
  y: string;
  centerX: string;
  centerY: string;
  color: string;
  size: string;
}

@tag("my-ripple")
export default class extends WeElement<MyRippleProps> {
  static css = css;
  scale: number;
  x: string;
  y: string;
  show = false;
  opacity = 0;

  install = () => {
    const computed = window.getComputedStyle(this.parentElement);
    if (computed && computed.position === "static") {
      this.parentElement.style.position = "relative";
      this.parentElement.dataset.previousPosition = "static";
    }
    this.scale = this.props.scale;
    this.x = this.props.x;
    this.y = this.props.y;
    this.show = true;
    this.dataset.activated = String(performance.now());
  };

  installed = () => {
    requestAnimationFrame(() => {
      this.opacity = 0.25;
      this.scale = 1;
      this.x = this.props.centerX;
      this.y = this.props.centerY;
      this.update();
    });
  };

  hide() {
    const diff = performance.now() - Number(this.dataset.activated);
    const delay = Math.max(250 - diff, 0);
    setTimeout(() => {
      this.show = false;
      this.opacity = 0;
      this.update();
      setTimeout(() => {
        this.parentElement && this.parentElement.removeChild(this);
        if (this.parentElement && this.parentElement.dataset.previousPosition) {
          this.parentElement.style.position = this.parentElement.dataset.previousPosition;
          delete this.parentElement.dataset.previousPosition;
        }
      }, 300);
    }, delay);
  }

  render() {
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
            width: this.props.size,
            height: this.props.size,
            opacity: this.opacity,
            color: this.props.color,
          }}
        />
      </span>
    );
  }
}
