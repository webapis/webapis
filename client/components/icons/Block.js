import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
const html = htm.bind(h);
export function Block({
  height = 24,
  width = 24,
  fill = "none",
  color = "black",
  onClick,
  id,
}) {
  return html`
    <svg
      height=${height}
      viewBox="0 0 24 24"
      width=${width}
      onClick=${onClick}
      id=${id}
    >
      <path d="M0 0h24v24H0z" fill=${fill} id=${id} />
      <path
        id=${id}
        fill=${color}
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z"
      />
    </svg>
  `;
}
