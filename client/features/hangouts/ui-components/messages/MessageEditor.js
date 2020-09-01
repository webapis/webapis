import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
const html = htm.bind(h);

//TODO HG disable sent text button when text message input

export default function MessageEditor({
  loading,
  messageText,
  onMessageText,
  onMessage,
  hangout,
}) {
  return html`
    <div>
      <div class="input-group mb-3">
        <input
          disabled=${hangout && hangout.state === "BLOCKED"}
          type="text"
          class="form-control"
          aria-label="Recipient's username"
          aria-describedby="button-addon2"
          onChange=${onMessageText}
          data-testid="message-input"
          value=${messageText}
        />
        <div class="input-group-append">
          <button
            class="btn btn-primary"
            type="button"
            loading=${loading}
            disabled=${hangout && hangout.state === "BLOCKED"}
            id="MESSAGE"
            onClick=${onMessage}
            data-testid="send-btn"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  `;
}
