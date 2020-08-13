import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
const html = htm.bind(h);
import Login from "features/authentication/ui-components/Login";
const validationSuccess = {
  emailorusername: { isValid: true, message: "." },
  password: { isValid: true, message: "." },
};
const validationError = {
  emailorusername: { isValid: false, message: "invalid credentials" },
  password: { isValid: false, message: "invalid credentials" },
};
export default function LoginStates() {
  return html`
    <div class="container">
      <div class="row">
        <span class="col-md-12">
          <h5 class="text-center">Login Validation Success</h5>

          <${Login}
            emailorusername="testuser"
            password="123456789"
            validation=${validationSuccess}
          />
        </span>
      </div>
      <div class="row">
        <span class="col-md-12">
          <h5 class="text-center">Login Validation Error</h5>

          <${Login}
            emailorusername="testuser"
            password="123456789"
            validation=${validationError}
          />
        </span>
      </div>
      <div class="row">
        <span class="col-md-12">
          <h5 class="text-center">Logging in</h5>
          <${Login}
            emailorusername="testuser"
            password="123456789"
            validation=${validationSuccess}
            loading
          />
        </span>
      </div>
      <div class="row">
        <span class="col-md-12">
          <h5 class="text-center">Logging Server error</h5>
          <${Login}
            emailorusername="testuser"
            password="123456789"
            validation=${validationSuccess}
            error=${{ message: "Server is unavailable" }}
          />
        </span>
      </div>
    </div>
  `;
}
