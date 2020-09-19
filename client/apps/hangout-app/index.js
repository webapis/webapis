import "https://cdn.jsdelivr.net/npm/whatwg-fetch@3.2.0/fetch.js";
import {
  h,
  render,
} from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import HangoutClient from "./HangoutClient";
import HangoutServer from "./HangoutServer";
import RtcMsgService from "../../service-adapters/rtc-msg-adapter/RtcMsgService";
const html = htm.bind(h);
const demoAuthState = {
  user: { username: "demouser" },
  browserId: "1234567890",
};
const beroAuthState = {
  user: { username: "berouser" },
  browserId: "1234567890",
};
render(
  html`
    <${RtcMsgService}
      >${({ sendMessage, message, connectionState }) => {
        return html` <div class="row">
          <div class="col" data-testid="democlient">
            <${HangoutClient}
              authState=${demoAuthState}
              message=${message}
              sendMessage=${sendMessage}
            />
          </div>
          <div class="col" data-testid="beroclient">
            <${HangoutClient}
              authState=${beroAuthState}
              message=${message}
              sendMessage=${sendMessage}
            />
          </div>
        </div>`;
      }}
    <//>
  `,
  document.body
);
