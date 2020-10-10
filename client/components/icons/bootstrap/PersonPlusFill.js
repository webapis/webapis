import { h } from "preact";
import htm from "htm.module";
const html = htm.bind(h);
export default function PersonPlusFill(props) {
  const { width, height, color } = props;
  return html`
    <svg
      width=${width}
      height=${height}
      viewBox="0 0 16 16"
      className="bi bi-person-plus-fill"
      fill=${color}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm7.5-3a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"
      />
      <path
        fill-rule="evenodd"
        d="M13 7.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0v-2z"
      />
    </svg>
  `;
}
