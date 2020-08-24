import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import ForgotPassword from "../../../client/features/authentication/ui-components/ForgotPassword";
const html = htm.bind(h);
const validationSuccess = { email: { isValid: true, message: "." } };
const validationError = {
  email: { isValid: false, message: "Invalid email format" },
};
export default function ForfotPasswordState() {
  return html`
    <div class="container">
      <div class="row">
        <span class="col-md-12">
          <h5 class="text-center">ForgotPassword Validation Success</h5>

          <${ForgotPassword}
            email="test@gmail.com"
            validation=${validationSuccess}
          />
        </span>
      </div>
      <div class="row">
        <span class="col-md-12">
          <h5 class="text-center">ForgotPassword Validation Error</h5>

          <${ForgotPassword}}
            email="testgmail.com"
            validation=${validationError}
          />
        </span>
      </div>
      <div class="row">
        <span class="col-md-12">
          <h5 class="text-center">Request Password Change in progress</h5>

          <${ForgotPassword}
            email="test@gmail.com"
            validation=${validationSuccess}
            loading
          />
        </span>
      </div>

      <div class="row">
        <span class="col-md-12">
          <h5 class="text-center">Server error</h5>

          <${ForgotPassword}
            email="test@gmail.com"
            validation=${validationSuccess}
            error=${{ message: "Server is unavailable" }}
          />
        </span>
      </div>
    </div>
  `;
}
