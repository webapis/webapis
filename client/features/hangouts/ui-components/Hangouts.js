import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
const html = htm.bind(h);

export default function Hangouts({
  hangouts,
  onNavigation,
  state,
  dispatch,
  onAppRoute,
  username,
  search,
  searchResult = "",
  guestEmail,
}) {
  return html`
    <div class="container-fluid bg-success" style="height:90vh">
      <div class=" row justify-content-center">
        <div class="col-md-8 col-lg-5 pt-3">
          <div class="card">
            <div class="card-header ">
              <${PeopleIcon} />
            </div>
            <div class="card-body">
              <${SeachComponent}
                placeholder="Enter username or email"
                btnTitle="Search"
                search=${search}
              />
              ${searchResult === "notfound" &&
              html` <${InviteGuest} email=${guestEmail} /> `}

              <div class="list-group">
                ${hangouts &&
                hangouts.map((h) => {
                  return html`
                    <a
                      href="#"
                      class="list-group-item list-group-item-action mb-1 border rounded-pill border-success"
                    >
                      ${h.username}
                    </a>
                  `;
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function SeachComponent({ placeholder, btnTitle, search }) {
  return html`
    <div class="input-group mb-3">
      <input
        type="text"
        class="form-control"
        placeholder=${placeholder}
        value=${search}
      />
      <div class="input-group-append">
        <button
          disabled=${search === ""}
          class="btn btn-outline-secondary"
          type="button"
          id="button-addon2"
        >
          ${btnTitle}
        </button>
      </div>
    </div>
  `;
}

export function PeopleIcon() {
  return html`
    <svg
      width="1.5em"
      height="1.5em"
      viewBox="0 0 16 16"
      class="bi bi-people-fill"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"
      />
    </svg>
  `;
}

export function InviteGuest({ email }) {
  return html`
    <div>
      <small id="emailHelp" class="form-text text-danger"
        >User is not registered. Invite as a guest</small
      >
      <div class="input-group mb-3">
        <input
          type="email"
          class="form-control"
          placeholder="Enter email"
          value=${email}
        />
        <div class="input-group-append">
          <button
            disabled=${email === ""}
            class="btn btn-outline-secondary"
            type="button"
            id="button-addon2"
          >
            Invite as a guest
          </button>
        </div>
      </div>
    </div>
  `;
}
