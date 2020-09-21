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
    const value = e.target.value;
    console.log("value", value);

    setMessageText(e.target.value);
    console.log("messageText", messageText);
  }
  useEffect(() => {
    if (message) {
      const {
        data: { text, owner },
      } = message;
      debugger;
      setMessages((prev) => [...prev, { owner, text }]);
    }
  }, [message]);

  function handleSendMessage() {
    const msg = {
      type: "test-websocket",
      data: { text: messageText, owner: username },
    };
    debugger;
    sendMessage(msg);
  }
  return html`<div>
    <div class="row">
      <div class="col">
        <div class="card">
          <div class="card-header" data-testid="connectionstate">
            WebSocket client, ${username}:${connectionState}
          </div>
          <div class="card-body">
            <ui data-testid="message-list">
              ${messages &&
              messages.map(
                (m) =>
                  html`<li data-testid="message-item">
                    ${m.owner}:${m.text}
                  </li>`
              )}
            </ui>
            <div class="input-group mb-3">
              <input
                id=${username}
                onInput=${onChange}
                type="text"
                class="form-control"
                placeholder="Enter message text"
                data-testid="message-input"
                value=${messageText}
              />
              <div class="input-group-append">
                <button
                  data-testid="send-btn"
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
