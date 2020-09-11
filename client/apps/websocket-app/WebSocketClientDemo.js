import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import {
  useEffect,
  useState,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import useWebSocket from "../../features/websocket/useWebSocket";
import WebSocketClient from "../../features/websocket/demo-ui/WebSocketClient";
const html = htm.bind(h);
export default function WebSocketClientDemo({ username }) {
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const { message, connectionState, sendMessage } = useWebSocket();

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
    const msg = {
      type: "test-websocket",
      target: "berouser",
      data: { text: messageText },
    };

    sendMessage(msg);
  }
  return html`
    <${WebSocketClient}
      connectionState=${connectionState}
      username=${username}
      messages=${messages}
      message=${messageText}
      onChange=${onChange}
      onClick=${handleSendMessage}
    />
  `;
}
