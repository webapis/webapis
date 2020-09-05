import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import Layout from "./Layout";
const html = htm.bind(h);

import TextInput from "controls/text-input/index";
import Button from "controls/button/index";
import Alert from "controls/alert/index";
export default function Login(props) {
  const {
    emailorusername,
    password,
    loading,
    onLogin,
    onFocus,
    onChange,
    validation,
    onForgotPassword,
    onBlur,
    error,
  } = props;
  return html`
    <${Layout} desc="Login">
      ${loading &&
      html`<div class="progress" style="height: 5px;">
        <div
          class="progress-bar progress-bar-striped progress-bar-animated "
          role="progressbar"
          aria-valuenow="100"
          aria-valuemin="0"
          aria-valuemax="100"
          style="width: 100%"
        ></div>
      </div> `}
      ${error && html` <${Alert} alert="danger" message=${error.message} />`}
      <${TextInput}
        onFocus=${onFocus}
        onBlur=${onBlur}
        value=${emailorusername}
        onChange=${onChange}
        label="Email or username"
        name="emailorusername"
        type="text"
        id="emailorusername"
        data-testid="emailorusername"
        message=${validation && validation["emailorusername"].message}
        isValid=${validation && validation["emailorusername"].isValid}
      />

      <${TextInput}
        onFocus=${onFocus}
        onBlur=${onBlur}
        label="Password"
        value=${password}
        onChange=${onChange}
        name="password"
        type="password"
        id="password"
        data-testid="password"
        message=${validation && validation["password"].message}
        isValid=${validation && validation["password"].isValid}
      />
      <div style=${{ display: "flex", justifyContent: "space-between" }}>
        <${Button}
          type="button"
          id="login-btn"
          data-testid="login-btn"
          onClick=${onLogin}
          loading=${loading}
          title="Login"
          outline
          bg="success"
        />

        <${Button}
          onClick=${onForgotPassword}
          id="forgotpassword"
          data-testid="forgotpassword"
          outline
          bg="success"
          title="Forgot Password!"
        />
      </div>
    <//>
  `;
}

/*

*/
