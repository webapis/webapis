import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";

import List, { ListItem } from "controls/list/index";
import PersonPlusFill from "icons/bootstrap/PersonPlusFill";
import useFilter from "../state/useFilter";
const html = htm.bind(h);
export default function Filter({
  hangouts,
  onNavigation,
  state,
  dispatch,
  onAppRoute,
  username,
}) {
  const { filter, onFilterSelect, onFilterInput } = useFilter({
    state,
    dispatch,
    onAppRoute,
    username,
  });
  return html`
    <div style=${{ height: "100%", display: "flex", flexDirection: "column" }}>
      ${hangouts &&
      hangouts.length > 0 &&
      html`
        <input
          class="form-control"
          value=${filter}
          onChange=${onFilterInput}
          data-testid="filter-input"
        />
      `}

      <div>
        <${List}>
          ${hangouts &&
          hangouts.length > 0 &&
          hangouts.map((f) => {
            return html`
              <${ListItem}
                id=${f.username}
                data-testid=${f.username}
                onClick=${onFilterSelect}
              >
                ${f.username}
              <//>
            `;
          })}
        <//>
      </div>
      ${true &&
      html`
        <div class="row align-items-center" style=${{ flex: 1 }}>
          <div class="col-2  mx-auto">
            <button
              data-testid="search"
              id="search"
              onClick=${onNavigation}
              class="btn btn-outline-secondary"
            >
              <${PersonPlusFill} width="2em" height="2em" />
            </button>
          </div>
        </div>
      `}
    </div>
  `;
}
