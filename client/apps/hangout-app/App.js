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

const html = htm.bind(h);
const demoUser = {
  username: "demouser",
  email: "demouser@gmail.com",
  browserId: "1234567890",
};
const beroUser = {
  username: "berouser",
  email: "berouser@gmail.com",
  browserId: "1234567890",
};

export default function App(props) {
  return html`
    <div class="row">
      <div class="col" data-testid="democlient">
        <${HangoutClient} user=${demoUser} />
      </div>
      <div class="col" data-testid="beroclient">
        <${HangoutClient} user=${beroUser} />
      </div>
    </div>

    ;
  `;
}
