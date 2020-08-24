import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import List, { ListItem } from "controls/list/index";
const html = htm.bind(h);
import Filter from "./Filter";
import Search from "./Search";

export default function Contacts({
  hangouts,
  onNavigation,
  state,
  dispatch,
  onAppRoute,
  username,
}) {
  return html`
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
  `;
}
