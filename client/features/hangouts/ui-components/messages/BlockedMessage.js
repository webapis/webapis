import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
const html = htm.bind(h);
const style = {
  color: "red",
  float: "right",
  width: "100%",
  fontSize: 16,
  textAlign: "end",
};
export function BlockedMessage({ message, onNavigation }) {
  function handleNavigation(e) {
    e.preventDefault();
    onNavigation(e);
  }

  return html`
    <div style=${style} data-testid="blocked-message">
      ${message.text}
      <a
        id="UNBLOCK"
        data-testid="seemore-btn"
        href="/"
        onClick=${handleNavigation}
      >
        see more
      </a>
    </div>
  `;
}
