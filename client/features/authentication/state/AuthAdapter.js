import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import ParseAuthService from "../services/parse/ParseAuthService";
import NodeAuthSerice from "../services/nodejs/NodeAuthService";
export default function AuthAdapter(props) {
  if (PREACT_APP_BACK === "PREACT_APP_PARSE") {
    return <ParseAuthService {...props} />;
  } else if (PREACT_APP_BACK === "PREACT_APP_NODEJS") {
    return <NodeAuthSerice {...props} />;
  }

  return null;
}
