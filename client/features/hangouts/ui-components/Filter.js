import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import { useEffect } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/hooks.module.js";
import List, { ListItem } from "controls/list";

import PersonPlusFill from "icons/bootstrap/PersonPlusFill";
export default function Filter({
  onLoadHangout,
  filter,
  filterResult = [],
  onFilterSelect,
  onFilterInput,
  onNavigation,
}) {
  useEffect(() => {
    onLoadHangout();
  }, []);
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <input
        className="form-control"
        value={filter}
        onChange={onFilterInput}
        data-testid="filter-input"
      />
      <div>
        <List>
          {filterResult.length > 0 &&
            filterResult.map((f) => {
              return (
                <ListItem
                  id={f.username}
                  data-testid={f.username}
                  onClick={onFilterSelect}
                >
                  {f.username}
                </ListItem>
              );
            })}
        </List>
      </div>
      {filterResult.length === 0 && (
        <div className="row align-items-center" style={{ flex: 1 }}>
          <div className="col-2  mx-auto">
            <button
              data-testid="search"
              id="search"
              onClick={onNavigation}
              className="btn btn-outline-secondary"
            >
              <PersonPlusFill width="2em" height="2em" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
