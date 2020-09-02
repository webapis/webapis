import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import {
  Messages,
  Message,
  BlockingMessage,
} from "../../client/features/hangouts/ui-components/Messages";
import { useEffect } from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js";
import MessageEditor from "../../client/features/hangouts/ui-components/messages/MessageEditor";
const html = htm.bind(h);

export default function HangchatUiState() {
  useEffect(() => {
    const ms = Date.now();
    setInterval(() => {
      convertMS(Date.now() - ms);
    }, 3000);
  }, []);

  function convertMS(ms) {
    var d, h, m, s;
    s = Math.floor(ms / 1000);
    m = Math.floor(s / 60);
    s = s % 60;
    h = Math.floor(m / 60);
    m = m % 60;
    d = Math.floor(h / 24);
    h = h % 24;
    console.log("second:", s, "minutes:", m);
    // days===0 && hours===0 && minutes===0 ="Now"
    // days===0 && hours===0 && minutes>0 = m + minutes ago
    // days===0 && hours >0 &&  = h + hours ago
    // days===>0  = d + days ago
    if (d === 0 && h === 0 && m === 0) {
      console.log("Now");
    } else if (d === 0 && h === 0 && m > 0) {
      console.log(m + "minutes ago");
    } else if (d === 0 && h > 0) {
      console.log(h + "hours ago");
    } else if (d > 0) {
      console.log(d + "days ago");
    }
  }
  return html` <div style="height:100%">
    <h5 class="bg-success text-white text-center">Messages</h5>
    <div class="row justify-content-center">
      <div class="col-sm-5">
        <${Messages}>
          <${Message}
            timelog="Now"
            float="right"
            text="Hello demo How are you doing today? Are you doing all right"
            username="demouser"
          />
          <${Message}
            timelog="Now"
            float="left"
            text="Hello bero. "
            username="demouser"
          />
          <${Message}
            timelog="Now"
            float="right"
            text="Hello demo How are you doing today? Are you doing all right"
            username="demouser"
          />
          <${Message}
            timelog="Now"
            float="left"
            text="Hello bero. I am allright. What about you. Are you ok? What are you planning to do tomorrow? Can you tell me that."
            username="demouser"
          />
          <${Message}
            timelog="Now"
            float="right"
            text="Hello demo How are you doing today? Are you doing all right"
            username="demouser"
          />
          <${Message}
            timelog="Now"
            float="left"
            text="Hello bero. I am allright. What about you. Are you ok? What are you planning to do tomorrow? Can you tell me that."
            username="demouser"
          />
          <${Message}
            timelog="Now"
            float="right"
            text="Hello demo How are you doing today? Are you doing all right"
            username="demouser"
          />
          <${Message}
            timelog="Now"
            float="left"
            text="Hello bero. I am allright. What about you. Are you ok? What are you planning to do tomorrow? Can you tell me that."
            username="demouser"
          />
          <${Message}
            timelog="Now"
            float="right"
            text="Hello demo How are you doing today? Are you doing all right"
            username="demouser"
          />
          <${Message}
            timelog="Now"
            float="left"
            text="Hello bero. I am allright. What about you. Are you ok? What are you planning to do tomorrow? Can you tell me that."
            username="demouser"
          />
          <${BlockingMessage} />
        <//>
        <${MessageEditor} />
      </div>
    </div>
  </div>`;
}
