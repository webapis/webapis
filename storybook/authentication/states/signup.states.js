import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import Signup from "../../../client/features/authentication/ui-components/Signup";
const html = htm.bind(h);
const validationSuccess = {
  username: { isValid: true, message: "." },
  password: { isValid: true, message: "." },
  email: { isValid: true, message: "." },
};
const validationError = {
  username: { isValid: false, message: "Username is not valid" },
  password: { isValid: false, message: "Pasword is not valid" },
  email: { isValid: false, message: "Email is not valid" },
};
export default function SignupStates() {
  return html`
    <div class="container">
      <div class="row">
        <span class="col-md-12">
          <h5 class="text-center">Signup Validation Success</h5>
          <${Signup}
            username="testuser"
            email="test@gmail.com"
            password="123456789"
            validation=${validationSuccess}
          />
        </span>
      </div>
      <div class="row">
        <span class="col-md-12">
          <h5 class="text-center">Signup Validation Error</h5>
          <${Signup}
            username="testuser"
            email="test@gmail.com"
            password="123456789"
            validation=${validationError}
          />
        </span>
      </div>

      <div class="row">
        <span class="col-md-12">
          <h5 class="text-center">Signing up</h5>
          <${Signup}
            username="testuser"
            email="test@gmail.com"
            password="123456789"
            validation=${validationSuccess}
            loading
          />
        </span>
      </div>
      <div class="row">
        <span class="col-md-12">
          <h5 class="text-center">Signing Sever error</h5>
          <${Signup}
            username="testuser"
            email="test@gmail.com"
            password="123456789"
            validation=${validationSuccess}
            error=${{ message: "Server is unavailable" }}
          />
        </span>
      </div>
    </div>
  `;
}
