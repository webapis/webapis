import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import { useMediaQuery } from "../../../components/layout/useMediaQuery";
const html = htm.bind(h);
export default function Navigation({
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

    <nav class="nav">
      <a class="nav-link" data-testid="socket-connection">
        ${socketConnected
          ? html`<span class="badge badge-success">online</span>`
          : html`<span class="badge badge-danger">offline</span>`}
      </a>
      <a
        id="hangout"
        data-testid="hangouts-btn"
        onClick=${onHangoutNavigation}
        class="nav-link"
        href="#"
      >
        <${PeopleIcon} />
      </a>
      <a
        id="videocall"
        data-testid="videocall-btn"
        onClick=${onHangoutNavigation}
        class="nav-link"
        href="#"
      >
        <${CameraIcon} />
      </a>
      <a
        id="unread"
        data-testid="unread-link"
        onClick=${onHangoutNavigation}
        class="nav-link"
        href="#"
        style="position:relative;"
      >
        <${MessageAlert} />
        <span
          data-testid="message-count"
          class="badge badge-success"
          style="position:absolute; font-size:0.6em;"
          >${messageCounter}</span
        >
      </a>

      ${device === "phone" &&
      html`
        <a
          id="configure"
          data-testid="configure-btn"
          onClick=${onHangoutNavigation}
          class="nav-link"
          href="#"
        >
          <${GearIcon} />
        </a>
      `}
    </nav>

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
        ${authed &&
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
        ${authed &&
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
        ${!authed &&
        html`<button
          id="signup"
          data-testid="signup-link"
          onClick=${onAuthNavigation}
          class="btn  my-2 my-sm-0 btn-sm btn-outline-success mr-1"
          type="submit"
        >
          Signup
        </button> `}
        ${!authed &&
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

function MessageAlert() {
  return html`
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      class="bi bi-envelope"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383l-4.758 2.855L15 11.114v-5.73zm-.034 6.878L9.271 8.82 8 9.583 6.728 8.82l-5.694 3.44A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.739zM1 11.114l4.758-2.876L1 5.383v5.73z"
      />
      0
    </svg>
  `;
}

function GearIcon() {
  return html`<svg
    width="1em"
    height="1em"
    viewBox="0 0 16 16"
    class="bi bi-gear"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      d="M8.837 1.626c-.246-.835-1.428-.835-1.674 0l-.094.319A1.873 1.873 0 0 1 4.377 3.06l-.292-.16c-.764-.415-1.6.42-1.184 1.185l.159.292a1.873 1.873 0 0 1-1.115 2.692l-.319.094c-.835.246-.835 1.428 0 1.674l.319.094a1.873 1.873 0 0 1 1.115 2.693l-.16.291c-.415.764.42 1.6 1.185 1.184l.292-.159a1.873 1.873 0 0 1 2.692 1.116l.094.318c.246.835 1.428.835 1.674 0l.094-.319a1.873 1.873 0 0 1 2.693-1.115l.291.16c.764.415 1.6-.42 1.184-1.185l-.159-.291a1.873 1.873 0 0 1 1.116-2.693l.318-.094c.835-.246.835-1.428 0-1.674l-.319-.094a1.873 1.873 0 0 1-1.115-2.692l.16-.292c.415-.764-.42-1.6-1.185-1.184l-.291.159A1.873 1.873 0 0 1 8.93 1.945l-.094-.319zm-2.633-.283c.527-1.79 3.065-1.79 3.592 0l.094.319a.873.873 0 0 0 1.255.52l.292-.16c1.64-.892 3.434.901 2.54 2.541l-.159.292a.873.873 0 0 0 .52 1.255l.319.094c1.79.527 1.79 3.065 0 3.592l-.319.094a.873.873 0 0 0-.52 1.255l.16.292c.893 1.64-.902 3.434-2.541 2.54l-.292-.159a.873.873 0 0 0-1.255.52l-.094.319c-.527 1.79-3.065 1.79-3.592 0l-.094-.319a.873.873 0 0 0-1.255-.52l-.292.16c-1.64.893-3.433-.902-2.54-2.541l.159-.292a.873.873 0 0 0-.52-1.255l-.319-.094c-1.79-.527-1.79-3.065 0-3.592l.319-.094a.873.873 0 0 0 .52-1.255l-.16-.292c-.892-1.64.902-3.433 2.541-2.54l.292.159a.873.873 0 0 0 1.255-.52l.094-.319z"
    />
    <path
      fill-rule="evenodd"
      d="M8 5.754a2.246 2.246 0 1 0 0 4.492 2.246 2.246 0 0 0 0-4.492zM4.754 8a3.246 3.246 0 1 1 6.492 0 3.246 3.246 0 0 1-6.492 0z"
    />
  </svg> `;
}

export function PeopleIcon(props) {
  return html`
    <svg
      ...${props}
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      class="bi bi-people-fill"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        ...${props}
        fill-rule="evenodd"
        d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"
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

function CameraIcon() {
  return html`
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      class="bi bi-camera-video"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2V5zm11.5 5.175l3.5 1.556V4.269l-3.5 1.556v4.35zM2 4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H2z"
      />
    </svg>
  `;
}
