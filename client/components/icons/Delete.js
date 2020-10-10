import { h } from "preact";
import htm from "htm.module";
const html = htm.bind(h);
export function Delete({
  height = 24,
  width = 24,
  color = "black",
  fill = "none",
}) {
  return html`
    <svg height=${height} viewBox="0 0 24 24" width=${width}>
      <path
        fill=${color}
        d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
      />
      <path d="M0 0h24v24H0z" fill=${fill} />
    </svg>
  `;
}
