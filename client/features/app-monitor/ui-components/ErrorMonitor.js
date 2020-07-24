import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import {
  useEffect,
  useState,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis@cbdf6161bd8ca09a385d62c8c697bd1cd87bb184/hooks.cdn.js";
import { useMonitor } from "../state/MonitorProvider";
const html = htm.bind(h);

export default function ErrorMonitor(props) {
  const { socketUrl } = props;
  const { fetchErrors, state, clietErrorRecieved } = useMonitor();
  const [socket, setSocket] = useState();
  const { errors } = state;
  useEffect(() => {
    debugger;
    setSocket(new WebSocket(`${socketUrl}/monitor`));
  }, []);

  useEffect(() => {
    if (socket) {
      debugger;
      socket.onmessage = (e) => {
        const { message, stack } = JSON.parse(e.data);
        debugger;
        clietErrorRecieved({ error: { message, stack } });
        debugger;
        console.log("messages");
      };
      socket.onopen = () => {
        console.log("con open");
      };
      socket.onclose = () => {
        console.log("con closed");
        setSocket(null);
      };
      socket.onerror = (error) => {
        console.log("monitor socket error");
      };
    }
  }, [socket]);

  useEffect(() => {
    fetchErrors();
  }, []);
  if (errors && errors.length > 0) {
    return errors.map((e) => {
      return html`<div>${e.message}: ${e.stack}</div>`;
    });
  }
  return html` <div>No error logs</div>`;
}
