import { pubsub } from "../../webcomponents/pubsub";
import "../../webcomponents/authentication/auth-navigation";
function createTemplate({ shadowRoot }) {
  const template = document.createElement("template");

  template.innerHTML = `   <link rel="stylesheet" href="libs/bootstrap.css" />

  <script src="libs/jquery.slim.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossorigin="anonymous"></script>
  <script src="libs/bootstrap.js"></script>
    <nav class="navbar  navbar-expand-lg navbar-light bg-light">
      <a class="navbar-brand" href="#"> </a>

      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#webcom"
        aria-controls="webcom"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="webcom">
        <ul class="navbar-nav mr-auto"></ul>
        <form class="form-inline my-2 my-lg-0">
          <auth-navigation></auth-navigation>
        </form>
      </div>
    </nav>`;
  shadowRoot.appendChild(template.content.cloneNode(true));

  shadowRoot
    .querySelector(".navbar-brand")
    .appendChild(brandIcon.content.cloneNode(true));
  // shadowRoot
  //   .querySelector("#signout-btn")
  //   .appendChild(signoutIcon.content.cloneNode(true));
}
const brandIcon = document.createElement("template");
brandIcon.innerHTML = `
    <svg
      width="1.5em"
      height="1.5em"
      viewBox="0 0 16 16"
      class="bi bi-chat-text"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="green"
        fill-rule="evenodd"
        d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z"
      />
      <path
        fill="green"
        fill-rule="evenodd"
        d="M4 5.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8zm0 2.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5z"
      />
    </svg>
  `;

const signoutIcon = document.createElement("template");

class AppNavigation extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    createTemplate({ shadowRoot: this.shadowRoot });
    let signinBtn = this.shadowRoot.querySelector("#signin-btn");
    let signupBtn = this.shadowRoot.querySelector("#signup-btn");
    let signoutBtn = this.shadowRoot.querySelector("#signout-btn");
    const shadowRoot = this.shadowRoot;
    signinBtn.addEventListener("click", (e) => {
      e.preventDefault();
      pubsub.publish("route", { route: "signin" });
    });
    signupBtn.addEventListener("click", (e) => {
      e.preventDefault();

      pubsub.publish("route", { route: "signup" });
    });

    signoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      pubsub.publish("route", { route: "signout" });
      this._signout({ shadowRoot });
    });

    // pubsub.subscribe("auth_success", (data) => {
    //  // this._auth(data);
    // });

    this._initialload({ shadowRoot });
  } // connectCallback

  _signout({ shadowRoot }) {
    shadowRoot.querySelector("#signup-btn").setAttribute("hidden", false);
    shadowRoot.querySelector("#signin-btn").setAttribute("hidden", false);
    window.localStorage.removeItem("webcom");
  }
  _auth(data) {
    const { token, username, email } = data;
    window.localStorage.setItem(
      "webcom",
      JSON.stringify({
        token,
        username,
        email,
      })
    );
    shadowRoot.querySelector(
      "#profile-btn"
    ).textContent = `${username}, signed in`;
    shadowRoot.querySelector("#signup-btn").classList.add("hide");
    shadowRoot.querySelector("#signin-btn").setAttribute("hidden", true);
    shadowRoot.querySelector("#profile-btn").setAttribute("hidden", false);
    shadowRoot.querySelector("#signout-btn").setAttribute("hidden", false);
  }
  _initialload({ shadowRoot }) {
    if (window.localStorage.getItem("webcom")) {
      debugger;
      const { token, username, email } = JSON.parse(
        window.localStorage.getItem("webcom")
      );
      debugger;
      pubsub.publish("local_auth", { token, email, username });
      shadowRoot.querySelector(
        "#profile-btn"
      ).textContent = `${username}, signed in`;
      shadowRoot.querySelector("#signup-btn").setAttribute("hidden", true);
      shadowRoot.querySelector("#signin-btn").setAttribute("hidden", true);
    } else {
      shadowRoot.querySelector("#profile-btn").setAttribute("hidden", true);
      shadowRoot.querySelector("#signout-btn").setAttribute("hidden", true);
    }
  }
} //class
customElements.define("app-navigation", AppNavigation);
