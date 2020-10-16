import {
  validateEmailOrUsername,
  validateEmptyString,
} from "../../features/authentication/validation/constraintValidators";
import loadBrowserId from "./loadBrowserId";
import { pubsub } from "../pubsub.js";

const template = document.createElement("template");

template.innerHTML = `
 <link rel="stylesheet" href="libs/bootstrap.css" />
  <script src="libs/jquery.slim.min.js"></script>
  <div class="row justify-content-center">
    <div class="card" style="width: 20rem;">
      <div class="card-body">
        <h5 class="card-title">Sign in</h5>
        <div class="form-group">
          <input
            part="abc"
            id="emailorusername"
            data-testid="emailorusername"
            class="form-control"
            type="text"
            placeholder="Enter email, or username"
          />
          <div id="emailorusername-msg" data-testid="message-emailorusername" class="invalid-feedback">
            Error Message
          </div>
        </div>
        <div class="form-group">
          <input
            id="password"
            data-testid="password"
            class="form-control"
            type="password"
            placeholder="Enter password"
          />
          <div id="password-msg" data-testid="message-password" class="invalid-feedback" data-testid="message">
            Error Message
          </div>
        </div>
        <button id="signin-btn" data-testid="signin-btn" class="btn btn-outline-success">
          Sign in
        </button>
        <button class="btn btn-link">Forgot Password!</button>
      </div>
    </div>
  </div>`;
//shadowRoot.appendChild(template.content.cloneNode(true));

const node = document.importNode(template.content, true); //????
class SignIn extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    if (ENV === "dev") {
      this.loadUi(this);
      this.registerEvents(this);
      this.subscribeToOutsideEvents(this);
    } else {
      const shadowRoot = this.attachShadow({ mode: "open" });
      this.loadUi(shadowRoot);
      this.registerEvents(shadowRoot);
      this.subscribeToOutsideEvents(shadowRoot);
    }
  } //connectedCallback
  loadUi(self) {
    self.appendChild(node);
  }
  registerEvents(self) {
    let {
      emailorusernameInput,
      passwordInput,
      signBtn,
      passwordMsg,
      emailorusernameMsg,
    } = this.getTags(self);

    emailorusernameInput.addEventListener("blur", (e) => {
      const { value } = e.target;
      this.updateEmailOrUsernameValidation({
        value,
        emailorusernameInput,
        emailorusernameMsg,
      });
    });
    passwordInput.addEventListener("blur", (e) => {
      const { value } = e.target;
      this.updatePasswordValidation({ value, passwordInput, passwordMsg });
    });
    emailorusernameInput.addEventListener("focus", () => {});
    passwordInput.addEventListener("focus", () => {});

    signBtn.addEventListener("click", () => {
      let {
        emailorusernameInput,
        passwordInput,
        signBtn,
        passwordMsg,
      } = this.getTags(self);
      const emailorusername = emailorusernameInput.value;
      const password = passwordInput.value;
      const browserId = loadBrowserId();
      if (
        validateEmailOrUsername({ value: emailorusername }).isValid &&
        validateEmptyString({ value: password }).isValid
      ) {
        pubsub.publish("signin", { emailorusername, password, browserId });
      } else {
        this.updateEmailOrUsernameValidation({
          value: emailorusername,
          emailorusernameInput,
          emailorusernameMsg,
        });
        this.updatePasswordValidation({
          value: password,
          passwordInput,
          passwordMsg,
        });
      }
    });
  }
  getTags(self) {
    return {
      emailorusernameMsg: self.querySelector("#emailorusername-msg"),
      passwordMsg: self.querySelector("#password-msg"),
      emailorusernameInput: self.querySelector("#emailorusername"),
      passwordInput: self.querySelector("#password"),
      signBtn: self.querySelector("#signin-btn"),
    };
  }
  updateEmailOrUsernameValidation({
    value,
    emailorusernameInput,
    emailorusernameMsg,
  }) {
    const { isValid, message } = validateEmailOrUsername({ value });
    if (isValid) {
      emailorusernameInput.classList.add("is-valid");
    } else {
      emailorusernameInput.classList.add("is-invalid");

      emailorusernameMsg.textContent = message;
    }
  }
  updatePasswordValidation({ value, passwordInput, passwordMsg }) {
    const { isValid, message } = validateEmptyString({ value });
    if (isValid) {
      passwordInput.classList.add("is-valid");
    } else {
      passwordInput.classList.add("is-invalid");

      passwordMsg.textContent = message;
    }
  }
  subscribeToOutsideEvents(self) {
    pubsub.subscribe("server_signin_validation_error", (data) => {
      let {
        emailorusernameInput,
        emailorusernameMsg,
        passwordInput,
        passwordMsg,
      } = this.getTags(self);
      data.forEach((validation) => {
        const { name, message } = validation;
        if (name === "emailorusername") {
          emailorusernameInput.classList.add("is-invalid");
          emailorusernameMsg.textContent = message;
        } else if (name === "password") {
          passwordInput.classList.add("is-invalid");
          passwordMsg.textContent = message;
        }
      });
    });
  }
} // end class

window.customElements.define("sign-in", SignIn);

// export function loadBrowserId() {
//   if (localStorage.getItem("browserId")) {
//     return localStorage.getItem("browserId");
//   } else {
//     let browserId = `BID${Date.now()}`;
//     localStorage.setItem("browserId", browserId);
//     return browserId;
//   }
// }

/*
import {
  validateEmailOrUsername,
  validateEmptyString,
} from "../../features/authentication/validation/constraintValidators";
import loadBrowserId from "./loadBrowserId";
import { pubsub } from "../pubsub.js";
function createTemplate({ shadowRoot }) {
  const template = document.createElement("template");

  template.innerHTML = ` <link rel="stylesheet" href="libs/bootstrap.css" />

    <script src="libs/jquery.slim.min.js"></script>
    <div class="row justify-content-center">
      <div class="card" style="width: 20rem;">
        <div class="card-body">
          <h5 class="card-title">Sign in</h5>
          <div class="form-group">
            <input
              part="abc"
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
          <button id="sign-btn" class="btn btn-outline-success">
            Sign in
          </button>
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


    pubsub.subscribe("server_signin_validation_error", (data) => {
      data.forEach((validation) => {
        const { name, message } = validation;
        if (name === "emailorusername") {
          emailorusername.classList.add("is-invalid");
          let emailorusernamemsg = this.shadowRoot.querySelector(
            "#emailorusername-msg"
          );
          emailorusernamemsg.textContent = message;
        } else if (name === "password") {
          passwordInput.classList.add("is-invalid");
          let passwordmsg = this.shadowRoot.querySelector("#password-msg");
          passwordmsg.textContent = message;
        }

        
      });

      console.log("server_auth_error event recieved", data);
    });

    pubsub.subscribe("route", (data) => {
      const { route } = data;

      if (route === "signin") {
        
       createTemplate({ shadowRoot: this.shadowRoot });
      } else {
        
        let template = this.shadowRoot.querySelector("template");
        const rootNode = this.shadowRoot.getRootNode();
        this.shadowRoot.innerHTML='';
      }
    });
  } //connectedCallback


//--ADD EVENT LISTENERS
  addEventListeners (){
    const emailorusername = this.shadowRoot.querySelector("#emailorusername");
    const passwordInput = this.shadowRoot.querySelector("#password");
    const signinBtn = this.shadowRoot.querySelector("#signin-btn");


  }
}// end class

window.customElements.define("sign-in", SignIn);

// export function loadBrowserId() {
//   if (localStorage.getItem("browserId")) {
//     return localStorage.getItem("browserId");
//   } else {
//     let browserId = `BID${Date.now()}`;
//     localStorage.setItem("browserId", browserId);
//     return browserId;
//   }
// }

*/
