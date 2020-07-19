import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
const html = htm.bind(h);
const TextInput = (props) => {
  const { label, name, type, isValid, message } = props;
  return html`<div class="form-group p-0">
    <label for=${name}>${label}</label>
    <input
      type=${type}
      id=${name}
      aria-describedby=${name}
      class="form-control ${isValid && "is-valid"} ${!isValid &&
      isValid !== undefined &&
      "is-invalid"}"
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
/*
export default function TextInput(props) {
  const { label, name, type, isValid, message } = props;
  return (
    <div className="form-group p-0">
      <label for={name}>{label}</label>
      <input
        type={type}
        className={`form-control ${isValid && "is-valid"} ${
          !isValid && isValid !== undefined && "is-invalid"
        }`}
        id={name}
        aria-describedby={name}
        {...props}
      />
      {!isValid && (
        <small
          id="emailHelp"
          className={`${!isValid && "invalid-feedback"}`}
          data-testid={`message-${name}`}
        >
          {message}
        </small>
      )}
    </div>
  );
}

*/
