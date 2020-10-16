import {
  validateEmailConstraint,
  validatePasswordConstraint,
  validateUserNameConstraint,
} from "../../features/authentication/validation/constraintValidators";
import { pubsub } from "../pubsub.js";
import loadBrowserId from "./loadBrowserId";
function createTemplate({ shadowRoot }) {
  const template = document.createElement("template");

  template.innerHTML = `<link rel="stylesheet" href="libs/bootstrap.css" />

    <script src="libs/jquery.slim.min.js"></script>
    <div class="row justify-content-center">
      <div class="card" style="width: 20rem;">
        <div class="card-body">
          <h5 class="card-title">Sign up</h5>
          <div class="form-group">
            <input
              id="username"
              class="form-control"
              type="text"
              placeholder="Enter username"
            />
            <div id="username-msg" class="invalid-feedback">
              Error Message
            </div>
          </div>
          <div class="form-group">
            <input
              id="email"
              class="form-control"
              type="email"
              placeholder="Enter email"
            />
            <div id="email-msg" class="invalid-feedback">
              Error Message
            </div>
          </div>
          <div class="form-group">
            <input
              id="password"
              class="form-control"
              type="password"
              placeholder="Enter password"
            />
            <div
              id="password-msg"
              class="invalid-feedback"
              data-testid="message"
            >
              Error Message
            </div>
          </div>
          <button id="signup-btn" class="btn btn-outline-success">
            Sign up
          </button>
        </div>
      </div>
    </div>`;
  shadowRoot.appendChild(template.content.cloneNode(true));
}
class SignUp extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    createTemplate({ shadowRoot: this.shadowRoot });
    let usernameInput = this.shadowRoot.querySelector("#username");
    let usernameMsg = this.shadowRoot.querySelector("#username-msg");
    let emailInput = this.shadowRoot.querySelector("#email");
    let emailMsg = this.shadowRoot.querySelector("#email-msg");
    let passwordInput = this.shadowRoot.querySelector("#password");
    let passwordMsg = this.shadowRoot.querySelector("#password-msg");
    let signupBtn = this.shadowRoot.querySelector("#signup-btn");

    //---signup click
    signupBtn.addEventListener("click", () => {
      const username = usernameInput.value;
      const email = emailInput.value;
      const password = passwordInput.value;
      const browserId = loadBrowserId();
      if (
        validateUserNameConstraint({ username }).isValid &&
        validateEmailConstraint({ email }).isValid &&
        validatePasswordConstraint({ password }).isValid
      ) {
        pubsub.publish("signup", { username, email, password, browserId });
      } else {
        this.usernameValidation({ username, usernameInput, usernameMsg });
        this.emailValidation({ email, emailInput, emailMsg });
        this.passwordValidation({ password, passwordInput, passwordMsg });
      }
    });
    //---client validation
    usernameInput.addEventListener("focus", () => {
      usernameInput.classList.remove("is-valid");
      usernameInput.classList.remove("is-invalid");
    });
    usernameInput.addEventListener("blur", (e) => {
      const { value } = e.target;
      this.usernameValidation({ username: value, usernameInput, usernameMsg });
    });
    emailInput.addEventListener("focus", () => {
      emailInput.classList.remove("is-valid");
      emailInput.classList.remove("is-invalid");
    });
    emailInput.addEventListener("blur", (e) => {
      const { value } = e.target;
      this.emailValidation({ email: value, emailInput, emailMsg });
    });
    passwordInput.addEventListener("focus", () => {
      passwordInput.classList.remove("is-valid");
      passwordInput.classList.remove("is-invalid");
    });
    passwordInput.addEventListener("blur", (e) => {
      const { value } = e.target;
      this.passwordValidation({ password: value, passwordInput, passwordMsg });
    });
    //---server validation

    pubsub.subscribe("server_signup_validation_error", (data) => {
      data.forEach((validation) => {
        const { name, message } = validation;
        if (name === "username") {
          usernameInput.classList.add("is-invalid");
          usernameMsg.textContent = message;
        } else if (name === "email") {
          emailInput.classList.add("is-invalid");
          emailMsg.textContent = message;
        } else if (name === "password") {
          passwordInput.classList.add("is-invalid");
          passwordMsg.textContent = message;
        }
      });
    });
    pubsub.subscribe("route", (data) => {
      const { route } = data;

      if (route === "signup") {
        createTemplate({ shadowRoot: this.shadowRoot });
      } else {
        let template = this.shadowRoot.querySelector("template");
        const rootNode = this.shadowRoot.getRootNode();
        this.shadowRoot.innerHTML = "";
      }
    });
  } //connectedCallback

  usernameValidation({ username, usernameInput, usernameMsg }) {
    const { isValid, message } = validateUserNameConstraint({
      username,
    });

    if (isValid) {
      usernameInput.classList.add("is-valid");
    } else {
      usernameInput.classList.add("is-invalid");

      usernameMsg.textContent = message;
    }
  }
  emailValidation({ email, emailInput, emailMsg }) {
    const { isValid, message } = validateEmailConstraint({ email });
    if (isValid) {
      emailInput.classList.add("is-valid");
    } else {
      emailInput.classList.add("is-invalid");

      emailMsg.textContent = message;
    }
  }
  passwordValidation({ password, passwordInput, passwordMsg }) {
    const { isValid, message } = validatePasswordConstraint({
      password,
    });
    if (isValid) {
      passwordInput.classList.add("is-valid");
    } else {
      passwordInput.classList.add("is-invalid");

      passwordMsg.textContent = message;
    }
  }
}

window.customElements.define("sign-up", SignUp);
