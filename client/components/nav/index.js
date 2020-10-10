import { h } from "preact";
import htm from "htm.module";
const html = htm.bind(h);
export default function Nav(props) {
  const { children, horizontalAlignment } = props;

  return html`
    <ul class="nav ${horizontalAlignment && horizontalAlignment}" ...${props}>
      ${children}
    </ul>
  `;
}
