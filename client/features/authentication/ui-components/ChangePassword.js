import { h } from "preact";
import TextInput from "controls/text-input/index";
import Button from "controls/button/index";
import Alert from "controls/alert/index";
import htm from "htm.module";

const html = htm.bind(h);
export default function ChangePassword(props) {
  const {
    password,
    confirm,
    validation,
    onChange,
    onPasswordChange,
    loading,
    error,
  } = props;

  // useEffect(() => {
  //   let url = new URL(window.location.href);
  //   var urltoken = url.searchParams.get('token');

  //   if (urltoken) {
  //     dispatch(actions.getTokenFromUrl({ token: urltoken }));
  //   }
  // }, []);

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
        label="Password"
        value=${password}
        type="password"
        id="password"
        name="password"
        onChange=${onChange}
        isValid=${validation && validation["password"].isValid}
        message=${validation && validation["password"].message}
      />
      <${TextInput}
        label="Confirm"
        value=${confirm}
        type="password"
        id="confirm"
        name="confirm"
        onChange=${onChange}
        isValid=${validation && validation["confirm"].isValid}
        message=${validation && validation["confirm"].message}
      />
      <${Button}
        type="button"
        loading=${loading}
        data-testid="change-pass-btn"
        onClick=${onPasswordChange}
        title="Change"
        bg="primary"
      />
    </div>
  `;
}
