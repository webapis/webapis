import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import { useEffect } from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js";
import Messages from "./messages/index";
import Layout from "./Layout";

const html = htm.bind(h);

export default function Hangchat({
  loading,
  messages = [],
  onMessageText,
  onMessage,
  messageText,
  username,
  hangout,
  onNavigation,
  emptyHangout,
}) {
  useEffect(() => {
    if (hangout) {
      document.title = hangout.username;
    }
  }, [hangout]);
  useEffect(() => {
    return () => {
      // emptyHangout();
      debugger;
    };
  }, []);
  return html`
    <${Layout} id="hangchat-ui" onNavigation=${onNavigation}>
      <${Messages}
        loading=${loading}
        onNavigation=${onNavigation}
        hangout=${hangout}
        messages=${messages}
        onMessage=${onMessage}
        onMessageText=${onMessageText}
        messageText=${messageText}
        username=${username}
      />
    <//>
  `;
}
