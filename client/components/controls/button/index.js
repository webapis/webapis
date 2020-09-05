import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";

import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";

const html = htm.bind(h);
export default function Button(props) {
  const { title, bg = "light", outline, size, loading = false, block } = props;
  return html`
    <button
      class="${bg && !outline && `btn btn-${bg}`} ${outline &&
      `btn btn-outline-${bg}`} ${size && `btn btn-${size}`}"
      ...${props}
      disabled=${loading}
    >
      ${loading &&
      html`<span
        class="spinner-border spinner-border-sm"
        role="status"
        aria-hidden="true"
        data-testid="spinner"
      ></span>`}
      ${loading ? "wait..." : title}
    </button>
  `;
}
