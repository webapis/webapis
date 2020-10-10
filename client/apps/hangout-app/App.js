import { h, createContext } from "preact";
import { useContext, useMemo, useReducer, useEffect } from "preact/hooks";
import htm from "htm.module";
import HangoutClient from "./HangoutClient";

const html = htm.bind(h);
const demoUser = {
  username: "demouser",
  email: "demouser@gmail.com",
  browserId: "BID1234567890",
};
const beroUser = {
  username: "berouser",
  email: "berouser@gmail.com",
  browserId: "BID1234567890",
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
  `;
}
