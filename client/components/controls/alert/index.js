import { h } from "preact";
import htm from "htm.module";

const html = htm.bind(h);
export default function Alert(props) {
  const { alert, message } = props;
  return html`
    <div class="alert alert-${alert}" role="alert" data-testid="alert">
      ${message}
      <button
        type="button"
        class="close"
        data-dismiss="alert"
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  `;
}
