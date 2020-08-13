import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import GearIcon from "icons/bootstrap/GearIcon";
const styles = {
  root: {
    backgroundColor: "#eeeeee",
    height: "100%",
    position: "relative",
  },
};
const html = htm.bind(h);
export default function Layout({ children, style, id }) {
  return html`
    <div data-testid=${id} style=${{ ...styles.root, ...style }}>
      ${children}
    </div>
  `;
}
