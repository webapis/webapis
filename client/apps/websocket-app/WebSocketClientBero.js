import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import {
  useEffect,
  useState,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import useWebSocket from "../../features/websocket/useWebSocket";
import WebSocketClient from "../../features/websocket/demo-ui/WebSocketClient";

export default function WebSocketClientBero() {
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const {
    state: { message },
    sendMessage,
  } = useWebSocket();

  function onChange() {
    setMessageText(e.target.value);
  }

  return html`
    <${WebSocketClient}
      messages=${messages}
      message=${messageText}
      onChange=${onChange}
      onClick=${sendMessage}
    />
  `;
}
