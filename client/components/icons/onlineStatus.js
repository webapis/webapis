import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
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
