import {
  validateEmailOrUsername,
  validateEmptyString,
} from "../../features/authentication/validation/constraintValidators";

function createTemplate({ onClick, shadowRoot, onChange, isValid = true }) {
  const template = document.createElement("template");

  template.innerHTML = `<link
      rel="stylesheet "
      href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
      integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z"
      crossorigin="anonymous"
    />
    <div class="row justify-content-center">
      <div class="card" style="width: 20rem;">
        <div class="card-body">
          <h5 class="card-title">Login</h5>
          <div class="form-group">
            <input
              id="emailorusername"
              class="form-control"
              type="text"
              placeholder="Enter email, or username"
            />
            <div id="emailorusername-msg" class="invalid-feedback">
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
          <button id="login-btn" class="btn btn-outline-success">Login</button>
          <button class="btn btn-link">Forgot Password!</button>
        </div>
      </div>
    </div>`;
  shadowRoot.appendChild(template.content.cloneNode(true));
}

class SignIn extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    createTemplate({ shadowRoot: this.shadowRoot });
    const emailorusername = this.shadowRoot.querySelector("#emailorusername");
    const passwordInput = this.shadowRoot.querySelector("#password");
    //emailorusername validation
    emailorusername.addEventListener("blur", (e) => {
      const { value } = e.target;
      this.updateEmailOrUsernameValidation({ value, emailorusername });
    });
    emailorusername.addEventListener("focus", (e) => {
      emailorusername.classList.remove("is-valid");
      emailorusername.classList.remove("is-invalid");
    });

    //passwordvalidation

    passwordInput.addEventListener("blur", (e) => {
      const { value } = e.target;

      this.updatePasswordValidation({ value, passwordInput });
    });

    passwordInput.addEventListener("focus", (e) => {
      passwordInput.classList.remove("is-valid");
      passwordInput.classList.remove("is-invalid");
    });
    const loginBtn = this.shadowRoot.querySelector("#login-btn");

    loginBtn.addEventListener("click", (e) => {
      let emailorusernameValue = emailorusername.value;
      let passwordValue = passwordInput.value;
      if (
        validateEmailOrUsername({ value: emailorusernameValue }).isValid &&
        validateEmptyString({ value: passwordValue })
      ) {
        this.dispatchEvent(
          new CustomEvent("login", {
            detail: {
              emailorusername: emailorusernameValue,
              password: passwordValue,
              browserId: loadBrowserId(),
            },
            bubbles: true,
          })
        );
      } else {
        this.updatePasswordValidation({ value: passwordValue, passwordInput });
        this.updateEmailOrUsernameValidation({
          value: emailorusernameValue,
          emailorusername,
        });
      }
    });
    this.addEventListener(
      "server",
      (e) => {
        debugger;
        console.log("server", e);
      },
      true
    );
  } //connectedCallback

  updateEmailOrUsernameValidation({ value, emailorusername }) {
    const { isValid, message } = validateEmailOrUsername({ value });
    if (isValid) {
      emailorusername.classList.add("is-valid");
    } else {
      emailorusername.classList.add("is-invalid");
      let emailorusernamemsg = this.shadowRoot.querySelector(
        "#emailorusername-msg"
      );
      emailorusernamemsg.textContent = message;
    }
  }
  updatePasswordValidation({ value, passwordInput }) {
    const { isValid, message } = validateEmptyString({ value });
    if (isValid) {
      passwordInput.classList.add("is-valid");
    } else {
      passwordInput.classList.add("is-invalid");
      let passwordmsg = this.shadowRoot.querySelector("#password-msg");
      passwordmsg.textContent = message;
    }
  }
}

window.customElements.define("sign-in", SignIn);

export function loadBrowserId() {
  if (localStorage.getItem("browserId")) {
    return localStorage.getItem("browserId");
  } else {
    let browserId = `BID${Date.now()}`;
    localStorage.setItem("browserId", browserId);
    return browserId;
  }
}
