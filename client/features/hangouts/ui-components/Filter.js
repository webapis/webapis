import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import { useEffect } from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js";
import List, { ListItem } from "controls/list/index";
import PersonPlusFill from "icons/bootstrap/PersonPlusFill";
const html = htm.bind(h);
export default function Filter({
  onLoadHangout,
  filter,
  filterResult = [],
  onFilterSelect,
  onFilterInput,
  onNavigation,
}) {
  useEffect(() => {
    onLoadHangout && onLoadHangout();
  }, []);
  return html`
    <div style=${{ height: "100%", display: "flex", flexDirection: "column" }}>
      <input
        class="form-control"
        value=${filter}
        onChange=${onFilterInput}
        data-testid="filter-input"
      />
      <div>
        <${List}>
          ${filterResult.length > 0 &&
          filterResult.map((f) => {
            debugger;
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
      ${filterResult.length === 0 &&
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
