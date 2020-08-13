import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import ParseAuthService from "../services/parse/ParseAuthService";
import NodeAuthSerice from "../services/nodejs/NodeAuthService";
const html = htm.bind(h);
export default function AuthAdapter(props) {
  if (PREACT_APP_BACK === "PREACT_APP_PARSE") {
    return html` <${ParseAuthService} ...${props} />`;
  } else if (PREACT_APP_BACK === "PREACT_APP_NODEJS") {
    return html` <${NodeAuthSerice} ...${props} />`;
  }

  return null;
}
