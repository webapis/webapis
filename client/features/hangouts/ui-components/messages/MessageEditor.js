import { h } from "preact";
import TextInput from "controls/text-input";
import Button from "controls/button";
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
  return (
    <div>
      <div className="input-group mb-3">
        <input
          disabled={hangout && hangout.state === "BLOCKED"}
          type="text"
          class="form-control"
          aria-label="Recipient's username"
          aria-describedby="button-addon2"
          onChange={onMessageText}
          data-testid="message-input"
          value={messageText}
        />
        <div className="input-group-append">
          <button
            className="btn btn-outline-secondary"
            type="button"
            loading={loading}
            disabled={hangout && hangout.state === "BLOCKED"}
            id="MESSAGE"
            onClick={onMessage}
            data-testid="send-btn"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
