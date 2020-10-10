import { h } from "preact";
import htm from "htm.module";
const html = htm.bind(h);
const TextInput = (props) => {
  const { label, name, type, isValid, message, disabled } = props;
  return html`<div class="form-group p-0">
    <label for=${name}>${label}</label>
    <input
      disabled=${disabled}
      type=${type}
      id=${name}
      aria-describedby=${name}
      class="form-control ${isValid && "is-valid"} ${!isValid &&
      isValid !== undefined &&
      "is-invalid"}"
      ...${props}
    />
    ${!isValid &&
    html`<small
      id="emailHelp"
      class=" ${!isValid && "invalid-feedback"}"
      data-testid="message-${name}"
    >
      ${message}
    </small>`}
  </div>`;
};

export default TextInput;
