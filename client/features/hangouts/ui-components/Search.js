import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import List, { ListItem } from "controls/list/index";
import useSearch from "../state/useSearch";
const html = htm.bind(h);
export default function Search({ state, dispatch, onAppRoute, hangouts }) {
  const { onSearchSelect, onSearchInput, onSearch, search } = useSearch({
    state,
    dispatch,
    onAppRoute,
  });
  return html`
    <div data-testid="search-ui">
      <div class="input-group mb-3">
        <input
          autofocus
          data-testid="search-input"
          value=${search}
          onChange=${onSearchInput}
          type="text"
          className="form-control"
          placeholder="Enter username"
          aria-label="username"
          aria-describedby="button-addon2"
        />
        <div className="input-group-append">
          <button
            data-testid="search-btn"
            onClick=${onSearch}
            className="btn btn-outline-secondary"
            type="button"
            id="button-addon2"
          >
            Search
          </button>
        </div>
      </div>
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
    </div>
  `;
}
