import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import Layout from "./Layout";
const html = htm.bind(h);
export default function UnreadHangouts({ unreadhangouts, onUnreadSelect }) {
  return html`
    <${Layout} desc="Unread Messages">
      <ul class="list-group m-2">
        ${unreadhangouts.length > 0 &&
        unreadhangouts.map((u) => {
          return html`
            <li
              id=${u.username}
              data-testid=${u.username}
              onClick=${() => onUnreadSelect({ hangout: u })}
              class="list-group-item d-flex justify-content-between align-items-center list-group-item-action"
            >
              ${u.username}, messages:
              <span class="badge badge-primary">${u.messageCounter}</span>
            </li>
          `;
        })}
      </ul>
    <//>
  `;
}
