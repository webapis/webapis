import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import {
  useContext,
  useMemo,
  useReducer,
  useEffect,
  useState,
  useRef,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";

const html = htm.bind(h);

export default function WebSocketClient({
  username,
  message,
  sendMessage,
  connectionState,
  target,
}) {
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);

  function onChange(e) {
    setMessageText(e.target.value);
  }
  useEffect(() => {
    if (message) {
      debugger;
      setMessages((prev) => [
        ...prev,
        { username: message.sender, text: message.data.text },
      ]);
    }
  }, [message]);

  function handleSendMessage() {
    debugger;
    const msg = {
      type: "test-websocket",
      target,
      data: { text: messageText },
    };
    sendMessage(msg);
  }
  return html`<div>
    <div class="row">
      <div class="col">
        <div class="card">
          <div class="card-header">
            WebSocket client, ${username}:${connectionState}
          </div>
          <div class="card-body">
            <ui>
              ${messages &&
              messages.map((m) => html`<li>${m.username}:${m.text}</li>`)}
            </ui>
            <div class="input-group mb-3">
              <input
                id=${username}
                onChange=${onChange}
                type="text"
                class="form-control"
                placeholder="Enter message text"
                value=${messageText}
              />
              <div class="input-group-append">
                <button
                  onClick=${handleSendMessage}
                  class="btn btn-outline-secondary"
                  type="button"
                  id="button-addon2"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}
