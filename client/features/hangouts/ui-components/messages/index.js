import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import {
  useRef,
  useEffect,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import Message from "./Message";
import MessageEditor from "./MessageEditor";
import { BlockerMessage } from "./BlockerMessage";
import { BlockedMessage } from "./BlockedMessage";
import { useMediaQuery } from "components/layout/useMediaQuery";
const html = htm.bind(h);
const styles = {
  messageContainer: {
    // width: '100%',
    boxSizing: "border-box",
    padding: 3,
    //  backgroundColor: 'orange',
    flex: 3,
    overflowY: "auto",
    overflowX: "hidden",
  },
};
export default function Messages({
  messages,
  onMessage,
  onMessageText,
  messageText,
  username,
  hangout,
  onNavigation,
  loading,
}) {
  const scrollerRef = useRef(null);
  const { device } = useMediaQuery();

  useEffect(() => {
    if (messages) {
      scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
    }
  }, [messages]);

  function onSend(e) {
    onMessage(e);
    scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
  }
  return html`
    <div
      style=${{
        boxSizing: "border-box",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        class="messages-wrapper"
        style=${{
          ...styles.messageContainer,
          flex: device === "phone" ? 4 : 2,
        }}
        ref=${scrollerRef}
      >
        ${messages &&
        messages.length > 0 &&
        floatMessages &&
        floatMessages.length > 0 &&
        floatMessages({ messages: sortMessages({ messages }), username }).map(
          (m) => html`<div style=${{ display: "flex" }}>
            ${!m.type && html` <${Message} message=${m} />`}
            ${m.type &&
            m.type === "blocker" &&
            html`<${BlockerMessage} message=${m} />`}
            ${m.type &&
            m.type === "blocked" &&
            html` <${BlockedMessage}
              message=${m}
              onNavigation=${onNavigation}
            />`}
          </div> `
        )}
      </div>
      <${MessageEditor}
        loading=${loading}
        hangout=${hangout}
        onMessage=${onSend}
        messageText=${messageText}
        onMessageText=${onMessageText}
      />
    </div>
  `;
}
function floatMessages({ messages, username }) {
  if (messages && messages.length > 0 && username) {
    return messages.map((msg) => {
      if (msg.username === username) {
        return { ...msg, float: "right", username: "me" };
      } else {
        return { ...msg, float: "left" };
      }
    });
  } else {
    return [];
  }
}
function sortMessages({ messages }) {
  if (messages) {
    return messages.sort((a, b) => b.timestamp - a.timestamp);
  } else {
    return [];
  }
}
