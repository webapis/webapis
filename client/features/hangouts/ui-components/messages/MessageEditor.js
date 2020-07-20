import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
const html = htm.bind(h);
import TextInput from "controls/text-input/index";
import Button from "controls/button/index";
const styles = {
  root: {
    display: "flex",
    alignItems: "center",
    // position:'fixed',
    width: "100%",
    // bottom:10,
    // right:10,
  },
  input: {
    //margin:0
    padding: 5,
    marginLeft: 8,
    marginRight: 8,
    marginTop: 8,
    marginBottom: 8,
    boxSizing: "border-box",
    flex: 1,
    width: "100%",
  },
};
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
          disabledc=${hangout && hangout.state === "BLOCKED"}
          type="text"
          class="form-control"
          aria-label="Recipient's username"
          aria-describedby="button-addon2"
          onChangec=${onMessageText}
          data-testid="message-input"
          valuec=${messageText}
        />
        <div class="input-group-append">
          <button
            class="btn btn-outline-secondary"
            type="button"
            loadingc=${loading}
            disabledc=${hangout && hangout.state === "BLOCKED"}
            id="MESSAGE"
            onClickc=${onMessage}
            data-testid="send-btn"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  `;
}
