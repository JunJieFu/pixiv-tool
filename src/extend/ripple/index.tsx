import { extend, render, h } from "omi";
import "./main";
type ShowRippleEvent = TouchEvent | MouseEvent;

function calculate(e: ShowRippleEvent, el: HTMLElement) {
  const offset = el.getBoundingClientRect();

  const target = e instanceof TouchEvent ? e.touches[e.touches.length - 1] : e;
  const localX = target.clientX - offset.left;
  const localY = target.clientY - offset.top;

  let scale = 0.3;
  let radius = Math.sqrt(el.clientWidth ** 2 + el.clientHeight ** 2) / 2;

  const centerX = `${(el.clientWidth - radius * 2) / 2}px`;
  const centerY = `${(el.clientHeight - radius * 2) / 2}px`;

  const x = `${localX - radius}px`;
  const y = `${localY - radius}px`;

  return { radius, scale, x, y, centerX, centerY };
}

extend("ripple", (el, path: Boolean | string) => {
  let color: string;
  if (path instanceof Boolean) {
    color = "currentColor";
  } else {
    color = path;
  }
  let ripple: any;

  function showRipple(e: ShowRippleEvent) {
    const { radius, scale, x, y, centerX, centerY } = calculate(e, el);
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
    );
  }
  function hideRipple(e: Event) {
    if (ripple) {
      ripple.hide();
      ripple = undefined;
    }
  }
  el.addEventListener("touchstart", showRipple, { passive: true });
  el.addEventListener("touchend", hideRipple, { passive: true });
  el.addEventListener("touchcancel", hideRipple);
  el.addEventListener("mousedown", showRipple);
  el.addEventListener("mouseup", hideRipple);
  el.addEventListener("mouseleave", hideRipple);
  el.addEventListener("dragstart", hideRipple, { passive: true });
});
