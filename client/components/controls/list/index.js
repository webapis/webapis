import { h } from "preact";
import htm from "htm.module";
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
