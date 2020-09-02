import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import {
  useEffect,
  useState,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import Layout from "./Layout";
import MessageEditor from "./messages/MessageEditor";
const html = htm.bind(h);
export function Messages({ messages, name }) {
  const { transformedMessages } = useTransformMessages({ messages, name });
  return html` <div class="bg-light container-fluid pb-5">
    ${transformedMessages &&
    transformedMessages.map((msg) => {
      return html` <${Message} ...${msg} /> `;
    })}
  </div>`;
}

export function Message({ float, text, username, state, timestamp }) {
  const { timelog } = useMessageTimeLog({ timestamp });
  if (float === "right")
    return html`<div
      data-testid="right-message-wrapper"
      class="row justify-content-end mb-2"
    >
      <div
        class="float-right text-muted px-1 font-italic"
        style="font-size: 0.6rem;width:60px;"
      >
        <div class="text-right" data-testid="time">${timelog}</div>
        <div class="text-right" data-testid="message-state">${state}</div>
      </div>
      <div
        data-testid="message"
        class="float-right bg-info p-1 rounded"
        style="max-width:70%; font-size: 0.8rem;"
      >
        ${text}rtrt
      </div>
    </div>`;
  return html`<div
    data-testid="left-message-wrapper"
    class="no-gutters rounded  p-1 mb-2 d-flex"
    style="max-width:75%;"
  >
    <div class="d-flex">
      <div
        class="rounded-circle text-center bg-info"
        style="width:40px;height:40px;line-height:2;"
      >
        M
      </div>
    </div>
    <div
      data-testid="message"
      class="ml-1 p-1 bg-warning rounded"
      style="font-size: 0.8rem;"
    >
      ${text}rtrtrrtrt
    </div>
    <div class=" font-italic text-muted pl-1" style="font-size: 0.6rem;">
      <div data-testid="message-sender">${username}</div>
      <div data-testid="time" style="width:60px;">${timelog}</div>
      <div data-testid="message-state">${state}</div>
    </div>
  </div>`;
}

export function BlockingMessage() {
  return html` <div class="text-danger text-right" style="font-size: 0.8rem;">
    Blocking Message
  </div>`;
}

function useMessageTimeLog({ timestamp }) {
  const [timelog, setTimeLog] = useState("");
  function convertMS(ms) {
    var d, h, m, s;
    s = Math.floor(ms / 1000);
    m = Math.floor(s / 60);
    s = s % 60;
    h = Math.floor(m / 60);
    m = m % 60;
    d = Math.floor(h / 24);
    h = h % 24;
    if (d === 0 && h === 0 && m === 0) {
      setTimeLog("Now");
    } else if (d === 0 && h === 0 && m > 0) {
      setTimeLog(m + "minutes ago");
    } else if (d === 0 && h > 0) {
      console.log(h + "hours ago");
      setTimeLog(h + "hours ago");
    } else if (d > 0) {
      console.log(d + "days ago");
      setTimeLog(d + "days ago");
    } else if (d === 7) {
      setTimeLog("1 week ago");
    } else if (d >= 8) {
      setTimeLog(new Date(timestamp));
    }
  }

  useEffect(() => {
    if (timestamp) {
      convertMS(Date.now() - timestamp);
      setInterval(() => {
        convertMS(Date.now() - timestamp);
      }, 60000);
    }
  }, [timestamp]);

  return { timelog };
}

export default function Hangchat({
  loading,
  messages = [],
  onMessageText,
  messageText,
  username,
  hangout,
  onUserClientCommand,
}) {
  return html`
    <${Layout}>
      <${Messages} messages=${messages} name=${username} />
      <div class="w-100" style="position:absolute; bottom:0;">
        <${MessageEditor}
          loading=${loading}
          messageText=${messageText}
          onMessageText=${onMessageText}
          onMessage=${onUserClientCommand}
          hangout=${hangout}
        />
      </div>
    <//>
  `;
}

function useTransformMessages({ messages, name }) {
  const [transformedMessages, setTransformedMessages] = useState(messages);

  useEffect(() => {
    if (messages) {
      debugger;
      setTransformedMessages(
        sortMessages({ messages: floatMessages({ messages, username: name }) })
      );
    }
  }, [messages]);

  return { transformedMessages };
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
    return messages.sort((a, b) => a.timestamp - b.timestamp);
  } else {
    return [];
  }
}
