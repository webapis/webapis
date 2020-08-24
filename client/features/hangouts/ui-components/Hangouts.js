import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import List, { ListItem } from "controls/list/index";
const html = htm.bind(h);
import Filter from "./Filter";
import Search from "./Search";

export default function Hangouts({
  hangouts,
  onNavigation,
  state,
  dispatch,
  onAppRoute,
  username,
}) {
  return html`
    <div class="container">
      <div class=" row justify-content-center">
        <div class="col-md-8 col-lg-6">
          <div class="card">
            <div class="card-header">
              Contact List
            </div>
            <div class="card-body">
              <${SeachComponent}
                placeholder="Enter username"
                btnTitle="Search"
              />
              <${FilterInput} placeholder="Enter username" />
              <div class="list-group">
                ${hangouts.map((h) => {
                  return html`
                    <a href="#" class="list-group-item list-group-item-action">
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

/*
 <${List}>
      ${hangouts &&
      hangouts.length > 0 &&
      hangouts.map((u) => {
        return html`
          <${ListItem}
            id=${u.username}
            onClick=${onSearchSelect}
            data-testid=${u.username}
          >
            ${u.username}
          <//>
        `;
      })}
    <//>

*/

function SeachComponent({ placeholder, btnTitle }) {
  return html`
    <div class="input-group mb-3">
      <input
        type="text"
        class="form-control"
        placeholder=${placeholder}
        aria-label="Recipient's username"
        aria-describedby="button-addon2"
      />
      <div class="input-group-append">
        <button
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

function FilterInput() {
  return html`
    <div class="form-group">
      <input
        placeholder="Enter username for filtering"
        type="email"
        class="form-control"
        id="filter-input"
        aria-describedby="emailHelp"
      />
    </div>
  `;
}
