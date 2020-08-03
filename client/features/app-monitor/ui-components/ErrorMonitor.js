import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import {
  useEffect,
  useState,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js";
import { useMonitor } from "../state/MonitorProvider";
const html = htm.bind(h);
//TODO EM delete,filter,sort errors
export default function ErrorMonitor(props) {
  const { socketUrl } = props;
  const { fetchErrors, state, clietErrorRecieved } = useMonitor();
  const [socket, setSocket] = useState();
  const { errors } = state;
  useEffect(() => {
    setSocket(new WebSocket(`${socketUrl}/monitor`));

    return () => {
      let closedSound = new Audio("/Shutter-sound.mp3");
      closedSound.play();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (e) => {
        var msg = new SpeechSynthesisUtterance();
        let errorSound = new Audio("/Error-sound.mp3");
        errorSound.play();
        setTimeout(() => {
          msg.text = "Error recieved";
          window.speechSynthesis.speak(msg);
        }, 500);

        const { message, stack } = JSON.parse(e.data);

        clietErrorRecieved({ error: { message, stack } });

        console.log("messages");
      };
      socket.onopen = () => {
        var msg = new SpeechSynthesisUtterance();
        let openSound = new Audio("/Interface-beep-up-sound-effect.mp3");
        openSound.play();
        setTimeout(() => {
          msg.text = "monitor connected";
          window.speechSynthesis.speak(msg);
        }, 500);

        console.log("con open");
      };
      socket.onclose = () => {
        let closedSound = new Audio("/Shutter-sound.mp3");
        closedSound.play();
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
