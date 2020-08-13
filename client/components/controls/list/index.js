import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
const html = htm.bind(h);

export default function List(props) {
  return html` <div class="list-group" ...${props} />`;
}

function ListItem(props) {
  return html`<button
    type="button"
    class="list-group-item list-group-item-action"
    ...${props}
  />`;
}

export { ListItem };
