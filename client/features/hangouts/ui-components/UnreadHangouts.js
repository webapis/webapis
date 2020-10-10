import { h } from "preact";
import htm from "htm.module";
import Layout from "./Layout";
const html = htm.bind(h);
export default function UnreadHangouts({ unreadhangouts, onUnreadSelect }) {
  return html`
    <${Layout} desc="Unread Messages">
      <ul data-testid="unread-ui" class="list-group m-2">
        ${unreadhangouts.length > 0 &&
        unreadhangouts.map((u) => {
          return html`
            <li
              id=${u.target}
              data-testid=${u.target}
              onClick=${() => onUnreadSelect({ hangout: u })}
              class="list-group-item d-flex justify-content-between align-items-center list-group-item-action"
            >
              ${u.target}, messages:
              <span class="badge badge-primary">${u.messageCounter}</span>
            </li>
          `;
        })}
      </ul>
    <//>
  `;
}
