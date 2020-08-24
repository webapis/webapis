import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import ChangePassword from "../../../client/features/authentication/ui-components/ChangePassword";

const validationSuccess = {
  password: { isValid: true, message: "." },
  confirm: { isValid: true, message: "." },
};
const validationError = {
  password: { isValid: false, message: "invalid password format" },
  confirm: { isValid: false, message: "invalid password format" },
};
const html = htm.bind(h);
export default function ChangePasswordStates() {
  return html`
    <div class="container">
      <div class="row">
        <span class="col-md-12">
          <h5 class="text-center">ChangePassword Validation Success</h5>
          <${ChangePassword}
            password="123456789"
            confirm="123456789"
            validation=${validationSuccess}
          />
        </span>
      </div>
      <div class="row">
        <span class="col-md-12">
          <h5 class="text-center">ChangePassword Validation Error</h5>
          <${ChangePassword} validation=${validationError} />
        </span>
      </div>
      <div class="row">
        <span class="col-md-12">
          <h5 class="text-center">ChangePassword in progress</h5>
          <${ChangePassword}
            password="123456789"
            confirm="123456789"
            validation=${validationSuccess}
            loading
          />
        </span>
      </div>
      <div class="row">
        <span class="col-md-12">
          <h5 class="text-center">ChangePassword Server error</h5>
          <${ChangePassword}
            password="123456789"
            confirm="123456789"
            validation=${validationSuccess}
            error=${{ message: "Server is unavailable" }}
          />
        </span>
      </div>
    </div>
  `;
}
