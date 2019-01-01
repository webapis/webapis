import "https://cdn.jsdelivr.net/npm/whatwg-fetch@3.2.0/fetch.js";
import {
  h,
  render,
} from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import { App } from "./App";
//import { RootProviders } from "./RootProviders";
import ServiceAdapter from "../../service-adapters/ServiceAdapter";
//Parse.liveQueryServerURL = `https://${ip}:1337/parse`
//Parse.serverURL = 'https://parseapi.back4app.com/'
//Parse.liveQueryServerURL = `wss://webapis.back4app.io`//
const html = htm.bind(h);
render(
  html` <${ServiceAdapter}
    >${({ user, setRtcUrl, connectionState }) => {
      return html` <${App}
        connectionState=${connectionState}
        user=${user}
        setRtcUrl=${setRtcUrl}
      />`;
    }}
  <//>`,

  document.body
);
