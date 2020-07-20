import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import {
  useState,
  useEffect,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis@cbdf6161bd8ca09a385d62c8c697bd1cd87bb184/hooks.cdn.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import { useMediaQuery } from "components/layout/useMediaQuery";
const html = htm.bind(h);
//import './css/style.css';
const style = {
  root: {
    borderColor: "#eeeeee",
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 5,
    padding: 3,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: 35,
    backgroundColor: "white",
  },
  username: { marginRight: 8 },
  log: {
    display: "flex",
    color: "#737373",
    fontSize: 10,
  },
  message: {},
};
//
export default function Message(props) {
  const { message } = props;
  const { float, username, timestamp } = message;
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const { device } = useMediaQuery();
  function convertMS(ms) {
    var d, h, m, s;
    s = Math.floor(ms / 1000);
    m = Math.floor(s / 60);
    s = s % 60;
    h = Math.floor(m / 60);
    m = m % 60;
    d = Math.floor(h / 24);
    h = h % 24;
    setDays(d);
    setHours(h);
    setMinutes(m);
    setSeconds(s);
  }

  useEffect(() => {
    if (timestamp) {
      setTimeout(() => {
        convertMS(Date.now() - timestamp);
      }, 0);
      setInterval(() => {
        convertMS(Date.now() - timestamp);
      }, 60000);
    }
  }, [timestamp]);

  return html`
    <div style=${{ width: "100%", marginBottom: 3 }}>
      <div style=${{ ...style.root, float }}>
        <div
          data-testid="message"
          style=${style.message}
          class=${`message-font-${device}-size`}
        >
          ${message && message.text}
        </div>
        <div style=${style.log}>
          <div style=${style.username}>${username && username}:</div>
          <div>
            ${minutes === 0 && html` <div>Now</div>`}
            ${hours === 0 &&
            minutes > 0 &&
            html` <div>{minutes} minutes ago</div>`}
            ${hours > 0 &&
            days === 0 &&
            html` <div>{hours} hours {minutes} minutes ago</div>`}
            ${days <= 10 && days > 1 && html` <div>{days} days ago</div>`}
          </div>
        </div>
      </div>
    </div>
  `;
}
