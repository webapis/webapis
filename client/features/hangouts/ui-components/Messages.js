import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import {
  useEffect,
  useState,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import MessageEditor from "./messages/MessageEditor";
const html = htm.bind(h);
export function Messages({ children }) {
  return html` <div class="container-fluid">
    <div class="d-none d-sm-block">
      <div
        class="row justify-content-center bg-success overflow-auto"
        style="height:60vh"
      >
        <div class="col bg-light py-1">
          ${children}
        </div>
      </div>
    </div>
    <div class="d-block d-sm-none">
      <div
        class="row justify-content-center bg-success overflow-auto"
        style="height:67vh"
      >
        <div class="col bg-light pb-1">
          ${children}
        </div>
      </div>
    </div>
  </div>`;
}

export function Message({ float, text, timelog, username, state }) {
  if (float === "right")
    return html`<div
      data-testid="right-message-wrapper"
      class="row justify-content-end mb-2"
    >
      <div
        class="float-right  align-self-end text-muted px-1 font-italic"
        style="font-size: 0.7rem;"
      >
        <div data-testid="time">${timelog}</div>
        <div data-testid="message-state">${state}</div>
      </div>
      <div
        data-testid="message"
        class="float-right bg-info p-1 rounded"
        style="max-width:70%; font-size: 0.8rem;"
      >
        ${text}
      </div>
    </div>`;
  return html`<div
    data-testid="left-message-wrapper"
    class="row justify-content-start mb-2"
  >
    <div
      class="float-left bg-warning p-1 rounded row no-gutters"
      style="max-width:75%;"
    >
      <div class="col-2 rounded row no-gutters">
        <div class="col  d-flex justify-content-center ">
          <div
            class="bg-success align-self-center d-flex justify-content-center align-items-center rounded-circle"
            style="width:30px;height:30px;font-size: 0.8rem;"
          >
            M
          </div>
        </div>
      </div>
      <div class="col-10" style="font-size: 0.8rem;" data-testid="message">
        ${text}
      </div>
    </div>
    <div
      class="float-left  align-self-end text-muted font-italic px-1"
      style="font-size: 0.7rem;"
    >
      <div data-testid="message-sender">${username}</div>
      <div data-testid="time">${timelog}</div>
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

function MessageContainer({ message }) {
  const { timestamp } = message;
  const { timelog } = useMessageTimeLog({ timestamp });

  return html`<${Message} ...${message} timelog=${timelog} />`;
}

function MessageListContainer({ messages, name }) {
  const { transformedMessages } = useTransformMessages({ messages, name });

  return html`<${Messages}
    >${transformedMessages &&
    transformedMessages.map((msg) => {
      return html` <${MessageContainer} message=${msg} /> `;
    })}<//
  >`;
}

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
    return () => {
      // emptyHangout();
      debugger;
    };
  }, []);
  return html`
    <div class="row justify-content-center">
      <div class="col-sm-5">
        <${MessageListContainer} messages=${messages} name=${username} />
        <${MessageEditor}
          loading=${loading}
          messageText=${messageText}
          onMessageText=${onMessageText}
          onMessage=${onMessage}
          hangout=${hangout}
        />
      </div>
    </div>
  `;
}

function useTransformMessages({ messages, name }) {
  const [transformedMessages, setTransformedMessages] = useState(messages);

  useEffect(() => {
    if (messages) {
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
