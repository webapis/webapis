import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import { useEffect } from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js";
import { loadHangouts } from "../state/local-storage/common";
import Layout from "./Layout";
const html = htm.bind(h);

export function Hangouts({
  hangouts,
  search,
  guestEmail, //InviteGuest
  invitationSuccess, //InviteGuest
  userNotFound, //InviteGuest
  searching, //SeachComponent
  invitingGuest, // Invite Guest
  inviteGuest, // Invite Guest
  messageForGuest, // InviteGuest
  searchComplete, //SearchComponent
  onSearchInput,
  onSearch,
  onInviteGuest,
  onSendInviteGuest,
  onMessageFoGuestInput,
  onGuestEmailChange,
  isValidGuestEmail,
  onGuestEmailInputFocus,
  onSearchSelect,
  error,
}) {
  return html`
    <${Layout} desc="Contact List">
      <div class="h-100 p-2">
        <${SeachComponent}
          onSearchInput=${onSearchInput}
          onSearch=${onSearch}
          placeholder="Enter username or email"
          btnTitle="Search"
          search=${search}
          searching=${searching}
          searchComplete=${searchComplete}
        />
        ${
          userNotFound &&
          html`
            <${InviteGuest}
              onGuestEmailChange=${onGuestEmailChange}
              onSendInviteGuest=${onSendInviteGuest}
              onMessageFoGuestInput=${onMessageFoGuestInput}
              onInviteGuest=${onInviteGuest}
              guestEmail=${guestEmail}
              invitationSuccess=${invitationSuccess}
              userNotFound=${userNotFound}
              invitingGuest=${invitingGuest}
              inviteGuest=${inviteGuest}
              messageForGuest=${messageForGuest}
              error=${error}
              isValidGuestEmail=${isValidGuestEmail}
              onGuestEmailInputFocus=${onGuestEmailInputFocus}
            />
          `
        }

        <div class="list-group">
          ${
            hangouts &&
            hangouts.map((h) => {
              return html`
                <div>
                  <a
                    id=${h.username}
                    onClick=${onSearchSelect}
                    data-testid=${h.username}
                    href="#"
                    class="list-group-item list-group-item-action mb-1 border rounded-pill border-success p-0 pl-4"
                  >
                    <div class="p-0 m-0">${h.username}</div>
                    <i class="p-0 m-0" style="font-size:0.6em">${h.email}</i>
                  </a>
                </div>
              `;
            })
          }
        </div>
      <//>
    </${Layout}>
  `;
}

function SeachComponent({
  placeholder,
  btnTitle,
  search,
  searching,
  searchComplete,
  onSearchInput,
  onSearch,
}) {
  return html`
    <div class="input-group mb-3">
      <input
        onChange=${onSearchInput}
        data-testid="user-search-input"
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
          onClick=${onSearch}
          disabled=${search === ""}
          data-testid="user-search-button"
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
  onInviteGuest,
  onGuestEmailChange,
  onSendInviteGuest,
  onMessageFoGuestInput,
  error,
  isValidGuestEmail,
  onGuestEmailInputFocus,
}) {
  return html`
    <div>
      <div data-testid="invite-guest">
        ${userNotFound &&
        html`
          <div class="alert alert-warning" role="alert">
            ${guestusername} is not found.
            <button
              onClick=${onInviteGuest}
              data-testid="invite-as-guest-btn"
              class="btn btn-link"
            >
              Invite as a guest.
            </button>
          </div>
        `}
        ${invitationSuccess &&
        html`
          <div class="alert alert-success" role="alert">
            Guest invitation sent to ${guestusername} successfuly.
            <button class="btn btn-outline-success small">
              ok
            </button>
          </div>
        `}
        ${error &&
        html`
          <div class="alert alert-danger" role="alert">
            ${error && error.message}
          </div>
        `}
      </div>
      ${inviteGuest &&
      html`
        <textarea
          onChange=${onMessageFoGuestInput}
          disabled=${invitingGuest}
          value=${messageForGuest}
          class="form-control"
          id="exampleFormControlTextarea1"
          rows="2"
        ></textarea>
        <div class="input-group mb-3 mt-1">
          <input
            onFocus=${onGuestEmailInputFocus}
            onChange=${onGuestEmailChange}
            data-testid="guest-email"
            disabled=${invitingGuest}
            type="email"
            class="form-control ${isValidGuestEmail &&
            "is-valid"} ${!isValidGuestEmail &&
            isValidGuestEmail !== undefined &&
            "is-invalid"}"
            placeholder="Enter guest's email"
            value=${guestEmail}
          />
          <div class="input-group-append">
            <button
              data-testid="invite"
              onClick=${onSendInviteGuest}
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
          ${!isValidGuestEmail &&
          html`<small
            id="emailHelp"
            class=" ${!isValidGuestEmail && "invalid-feedback"}"
            data-testid="message-${name}"
          >
            Invalid Email format.
          </small>`}
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
      class="bi bi-x"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        d="M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z"
      />
      <path
        fill-rule="evenodd"
        d="M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z"
      />
    </svg>
  `;
}

export default function HangoutContainer({ state, funcs }) {
  const { name } = state;
  useEffect(() => {
    loadHangouts({ ...state, name });
  }, []);

  return html`<${Hangouts} ...${state} ...${funcs} /> `;
}
