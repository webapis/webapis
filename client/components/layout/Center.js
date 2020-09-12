import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
const html = htm.bind(h);
export function Center({ children, style }) {
  return html`
    <div
      style=${{
        display: "flex",
        justifyContent: "center",
        textAlign: "center",
        ...style,
      }}
    >
      ${children}
    </div>
  `;
}