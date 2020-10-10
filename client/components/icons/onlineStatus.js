import { h } from "preact";
import htm from "htm.module";
const style = {
  width: 15,
  height: 15,

  border: "white 2px solid",
};
const html = htm.bind(h);
export function OnlineStatus({ readyState }) {
  if (readyState === 1) {
    return html` <${IsOnline} />`;
  } else if (readyState === 0) {
    return html`<${Connecting} />`;
  } else if (readyState === 2) {
    return html` <${Closing} />`;
  }
  return html`<${IsOffline} />`;
}

export function IsOnline() {
  return html`
    <div
      style=${{ ...style, backgroundColor: "green" }}
      data-testid="online"
    ></div>
  `;
}

export function IsOffline() {
  return html`
    <div
      style=${{ ...style, backgroundColor: "red" }}
      data-testid="offline"
    ></div>
  `;
}

export function Connecting() {
  return html`
    <div
      style=${{ ...style, backgroundColor: "orange" }}
      data-testid="connecting"
    ></div>
  `;
}

export function Closing() {
  return html`
    <div
      style=${{ ...style, backgroundColor: "pink" }}
      data-testid="closing"
    ></div>
  `;
}
