import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import TextInput from "controls/text-input/index";
import Button from "controls/button/index";
import Alert from "controls/alert/index";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";

const html = htm.bind(h);
export default function RequestPassChange(props) {
  const {
    email,
    validation,
    onRequestPasswordChange,
    loading,
    onChange,
    error,
  } = props;

  return html`
    <div
      class="col-md-4 border mx-auto rounded"
      style=${{ margin: 15, padding: 16 }}
    >
      ${loading &&
      html`
        <div class="progress" style="height: 5px;">
          <div
            class="progress-bar progress-bar-striped progress-bar-animated"
            role="progressbar"
            aria-valuenow="100"
            aria-valuemin="0"
            aria-valuemax="100"
            style="width: 100%"
          ></div>
        </div>
      `}
      ${error && html` <${Alert} alert="danger" message=${error.message} />`}
      <${TextInput}
        label="Email"
        value=${email}
        name="email"
        onChange=${onChange}
        type="email"
        id="email"
        isValid=${validation && validation["email"].isValid}
        message=${validation && validation["email"].message}
      />
      <${Button}
        type="button"
        onClick=${onRequestPasswordChange}
        data-testid="requestpasschange-btn"
        title="Request password change"
        loading=${loading}
        bg="primary"
      />
    </div>
  `;
}
