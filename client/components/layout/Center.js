import { h } from "preact";
import htm from "htm.module";
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
