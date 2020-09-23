import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import { useMediaQuery } from "../../components/layout/useMediaQuery";
const html = htm.bind(h);
export default function AppNavigation({
  user,
  username,
  authed,
  onAuthNavigation,
  onHangoutNavigation,
  messageCounter = 0,
  socketConnected,
}) {
  const { device } = useMediaQuery();
  return html`<nav class="navbar  navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand" href="#">
      <${BrandIcon} />
    </a>

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
        ${user &&
        html`
          <button
            id="profile"
            data-testid="profile-link"
            onClick=${onAuthNavigation}
            class="btn  my-2 my-sm-0 btn-sm btn-outline-success mr-1"
            type="submit"
          >
            ${username}, signed in
          </button>
        `}
        ${user &&
        html`
          <button
            id="signout"
            data-testid="signout-link"
            onClick=${onAuthNavigation}
            class="btn  my-2 my-sm-0 btn-sm btn-outline-success mr-1"
            type="submit"
          >
            <${SignoutIcon} />
          </button>
        `}
        ${!user &&
        html`<button
          id="signup"
          data-testid="signup-link"
          onClick=${onAuthNavigation}
          class="btn  my-2 my-sm-0 btn-sm btn-outline-success mr-1"
          type="submit"
        >
          Signup
        </button> `}
        ${!user &&
        html`
          <button
            id="login"
            data-testid="login-link"
            onClick=${onAuthNavigation}
            class="btn  my-2 my-sm-0 btn-sm btn-outline-success"
            type="submit"
          >
            Login
          </button>
        `}
      </form>
    </div>
  </nav>`;
}

function BrandIcon() {
  return html`
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
}

function SignoutIcon() {
  return html`
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
}
