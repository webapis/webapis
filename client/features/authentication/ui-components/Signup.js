import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";

const html = htm.bind(h);
import Button from "controls/button/index";
import TextInput from "controls/text-input/index";
import Alert from "controls/alert/index";
export default function Signup(props) {
  const {
    username,
    password,
    email,
    loading,
    onSignup,
    onChange,
    validation,
    onBlur,
    onFocus,
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
      ${error && html`<${Alert} alert="danger" message=${error.message} />`}
      <${TextInput}
        onBlur=${onBlur}
        onFocus=${onFocus}
        label="Username"
        value=${username}
        onChange=${onChange}
        type="text"
        data-testid="username"
        name="username"
        isValid=${validation && validation["username"].isValid}
        message=${validation && validation["username"].message}
      />
      <${TextInput}
        onBlur=${onBlur}
        onFocus=${onFocus}
        label="Email"
        onChange=${onChange}
        value=${email}
        type="email"
        data-testid="email"
        name="email"
        isValid=${validation && validation["email"].isValid}
        message=${validation && validation["email"].message}
      />
      <${TextInput}
        onBlur=${onBlur}
        onFocus=${onFocus}
        label="Password"
        onChange=${onChange}
        value=${password}
        type="password"
        data-testid="password"
        name="password"
        isValid=${validation && validation["password"].isValid}
        message=${validation && validation["password"].message}
      />
      <${Button}
        type="button"
        onClick=${onSignup}
        id="signup-btn"
        data-testid="signup-btn"
        loading=${loading}
        title="Signup"
        bg="primary"
      />
    </div>
  `;
}
