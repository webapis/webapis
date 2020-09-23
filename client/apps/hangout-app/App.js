import {
  h,
  createContext,
} from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import {
  useContext,
  useMemo,
  useReducer,
  useEffect,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import HangoutClient from "./HangoutClient";
import { RtcMockServerProvider } from "./RtcMockServer";
const html = htm.bind(h);
const demoAuthState = {
  user: {
    username: "demouser",
    email: "demouser@gmail.com",
    browserId: "1234567890",
  },
  browsers: [{ browserId: "1234567890" }],
};
const beroAuthState = {
  user: {
    username: "berouser",
    email: "berouser@gmail.com",
    browserId: "1234567890",
  },
  browsers: [{ browserId: "1234567890" }],
};

export default function App(props) {
  useEffect(() => {}, []);
  return html`
    <${RtcMockServerProvider}
      >${({ sendMessage, message, connectionState, setRtcUrl }) => {
        return html`
          <div class="row">
            <div class="col" data-testid="democlient">
              <${HangoutClient}
                connectionState=${connectionState}
                authState=${demoAuthState}
                message=${message}
                sendMessage=${sendMessage}
                setRtcUrl=${setRtcUrl}
              />
            </div>
            <div class="col" data-testid="beroclient">
              <${HangoutClient}
                connectionState=${connectionState}
                authState=${beroAuthState}
                message=${message}
                sendMessage=${sendMessage}
                setRtcUrl=${setRtcUrl}
              />
            </div>
          </div>
        `;
      }}<//
    >
    ;
  `;
}
