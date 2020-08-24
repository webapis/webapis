import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";

import List, { ListItem } from "controls/list/index";
import PersonPlusFill from "icons/bootstrap/PersonPlusFill";
import useFilter from "../state/useFilter";
import { actionTypes } from "../state/actionTypes";
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
  function onInviteNewFriend(e) {
    onNavigation(e);
    dispatch({ type: actionTypes.HANGOUTS_UPDATED, hangouts: [] });
  }
  return html`
    <div style=${{ height: "100%", display: "flex", flexDirection: "column" }}>
      <input
        class="form-control"
        value=${filter}
        onChange=${onFilterInput}
        data-testid="filter-input"
      />
    </div>
  `;
}
