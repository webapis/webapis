import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import { useState } from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js";
const html = htm.bind(h);

export default function Hangouts({
  hangouts,
  // onNavigation,
  // state,
  // dispatch,
  // onAppRoute,
  // username,
  search,
  searchResult = "",
  guestEmail, //InviteGuest
  invitationSuccess, //InviteGuest
  userNotFound, //InviteGuest
  searching, //SeachComponent
  invitingGuest, // Invite Guest
  inviteGuest, // Invite Guest
  messageForGuest, // InviteGuest
  searchComplete, //SearchComponent
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
                searching=${searching}
                searchComplete=${searchComplete}
              />
              ${searchResult === "notfound" &&
              html`
                <${InviteGuest}
                  guestEmail=${guestEmail}
                  invitationSuccess=${invitationSuccess}
                  userNotFound=${userNotFound}
                  invitingGuest=${invitingGuest}
                  inviteGuest=${inviteGuest}
                  messageForGuest=${messageForGuest}
                />
              `}

              <div class="list-group">
                ${hangouts &&
                hangouts.map((h) => {
                  return html`
                    <div>
                      <a
                        href="#"
                        class="list-group-item list-group-item-action mb-1 border rounded-pill border-success"
                      >
                        ${h.username}
                      </a>
                    </div>
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

function SeachComponent({
  placeholder,
  btnTitle,
  search,
  searching,
  searchComplete,
}) {
  return html`
    <div class="input-group mb-3">
      <input
        type="text"
        class="form-control"
        placeholder=${placeholder}
        value=${search}
      />
      <div class="input-group-append">
        ${searchComplete &&
        html`
          <button
            disabled=${search === ""}
            class="btn btn-outline-secondary"
            type="button"
            id="button-addon2"
          >
            <${BackSpace} />
          </button>
        `}

        <button
          disabled=${search === ""}
          class="btn btn-outline-secondary"
          type="button"
          id="button-addon2"
        >
          ${searching
            ? html` <span
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>`
            : html` ${btnTitle}`}
        </button>
      </div>
    </div>
  `;
}

export function InviteGuest({
  guestEmail,
  guestusername = "user",
  invitationSuccess,
  userNotFound,
  invitingGuest,
  inviteGuest,
  messageForGuest,
}) {
  const [state, setState] = useState({ invite: false });

  return html`
    <div>
      <div>
        ${userNotFound &&
        html`
          <div class="alert alert-warning" role="alert">
            ${guestusername} is not found.
            <button class="btn btn-link">
              Invite as a guest.
            </button>
          </div>
        `}
        ${invitationSuccess &&
        html`
          <div class="alert alert-success" role="alert">
            Guest invitation sent successfuly.
            <button class="btn btn-outline-success small">
              ok
            </button>
          </div>
        `}
      </div>
      ${inviteGuest &&
      html`
        <textarea
          disabled=${invitingGuest}
          value=${messageForGuest}
          class="form-control"
          id="exampleFormControlTextarea1"
          rows="2"
        ></textarea>
        <div class="input-group mb-3 mt-1">
          <input
            disabled=${invitingGuest}
            type="email"
            class="form-control"
            placeholder="Enter guest's email"
            value=${guestEmail}
          />
          <div class="input-group-append">
            <button
              disabled=${guestEmail === ""}
              class="btn btn-outline-secondary"
              type="button"
              id="button-addon2"
            >
              ${invitingGuest
                ? html` <span
                    class="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>`
                : html` Invite`}
            </button>
          </div>
        </div>
      `}
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

export function BackSpace() {
  return html`
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      class="bi bi-backspace"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        d="M6.603 2h7.08a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-7.08a1 1 0 0 1-.76-.35L1 8l4.844-5.65A1 1 0 0 1 6.603 2zm7.08-1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-7.08a2 2 0 0 1-1.519-.698L.241 8.65a1 1 0 0 1 0-1.302L5.084 1.7A2 2 0 0 1 6.603 1h7.08z"
      />
      <path
        fill-rule="evenodd"
        d="M5.83 5.146a.5.5 0 0 0 0 .708l5 5a.5.5 0 0 0 .707-.708l-5-5a.5.5 0 0 0-.708 0z"
      />
      <path
        fill-rule="evenodd"
        d="M11.537 5.146a.5.5 0 0 1 0 .708l-5 5a.5.5 0 0 1-.708-.708l5-5a.5.5 0 0 1 .707 0z"
      />
    </svg>
  `;
}
