import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import List, { ListItem } from "controls/list/index";

const html = htm.bind(h);
export default function Search({
  onSearchSelect,
  onSearchInput,
  onSearch,
  search,
  searchResult = [],
}) {
  return html`
    <div data-testid="search-ui">
      <div class="input-group mb-3">
        <input
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
        ${searchResult.length > 0 &&
        searchResult.map((u) => {
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
