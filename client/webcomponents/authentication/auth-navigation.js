import { pubsub } from "../pubsub";

const template = document.createElement("template");

template.innerHTML = `
<button
            id="profile-nav-btn"
            data-testid="profile-link"
            class="btn  my-2 my-sm-0 btn-sm btn-outline-success mr-1"
            type="button"
          >
            
          </button>

          <button
            id="signout-btn"
            data-testid="signout-link"
            class="btn  my-2 my-sm-0 btn-sm btn-outline-success mr-1"
            type="button"
          ></button>
          <button
            id="signup-nav-btn"
            data-testid="signup-link"
            class="btn  my-2 my-sm-0 btn-sm btn-outline-success mr-1"
            type="button"
          >
            Sign up
          </button>

          <button
            id="signin-nav-btn"
            data-testid="login-link"
            class="btn  my-2 my-sm-0 btn-sm btn-outline-success"
            type="button"
          >
            Sign in
          </button>
 `;

//shadowRoot.appendChild(template.content.cloneNode(true));
const signoutIcon = document.createElement("template");
signoutIcon.innerHTML = `
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      class="bi bi-box-arrow-right"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"
      />
      <path
        fill-rule="evenodd"
        d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"
      />
    </svg>
  `;
const node = document.importNode(template.content, true); //????
class AuthNavigation extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    if (ENV === "dev") {
      this.loadUi(this);
      //this.registerEvents(this);
      this.subscribeToOutsideEvents(this);
    } else {
      const shadowRoot = this.attachShadow({ mode: "open" });
      this.loadUi(shadowRoot);
      // this.registerEvents(shadowRoot);
      this.subscribeToOutsideEvents(shadowRoot);
    }
  } //connectedCallback
  getTags(self) {
    return {
      signinNavBtn: self.querySelector("#signin-nav-btn"),
      signupNavBtn: self.querySelector("#signup-nav-btn"),
      signoutBtn: self.querySelector("#signout-btn"),
      profileNavBtn: self.querySelector("#profile-nav-btn"),
    };
  }

  loadUi(self) {
    self.appendChild(node);
    self
      .querySelector("#signout-btn")
      .appendChild(signoutIcon.content.cloneNode(true));
  }

  subscribeToOutsideEvents(self) {
    pubsub.subscribe("auth_success", (data) => {
      this.authedUiState({ self, data });
    });
  }
  authedUiState({ self, data }) {
    const { username } = data;
    const {
      signinNavBtn,
      signoutBtn,
      signupNavBtn,
      profileNavBtn,
    } = this.getTags(self);
    signinNavBtn.classList.add("invisible");
    signupNavBtn.classList.add("invisible");
    profileNavBtn.classList.add("visible");
    profileNavBtn.textContent = `${username}, signed in`;
    debugger;
  }
  anonymousUiState(self) {
    const {
      signinNavBtn,
      signoutBtn,
      signupNavBtn,
      profileNavBtn,
    } = this.getTags(self);
    profileNavBtn.classList.add("invisible");
    signinNavBtn.classList.remove("invisible");
    signupNavBtn.classList.remove("invisible");
  }
  setInitialAuthState() {}
}
customElements.define("auth-navigation", AuthNavigation);
