import {
  h,
  render,
} from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";

import NodeJsAuthService from "../../features/authentication/services/nodejs/NodejsAuthService";
import AuthMockService from "../../apps/auth-app/AuthMockService";
import AuthProvider from "../../features/authentication/state/AuthProvider";
const html = htm.bind(h);
export default function AuthService(props) {
  switch (AUTH) {
    case "MOCK":
      return html`<${AuthMockService}
        >${({ signup, login, changepassword, requestpasswordchange }) => {
          return html`<${AuthProvider}
            ...${props}
            signup=${signup}
            login=${login}
            changepassword=${changepassword}
            requestpasswordchange=${requestpasswordchange}
          />`;
        }}
      <//>`;
    case "NODEJS":
      //
      return html`<${NodeJsAuthService}
        >${({ signup, login, changepassword, requestpasswordchange }) => {
          return html`<${AuthProvider}
            ...${props}
            signup=${signup}
            login=${login}
            changepassword=${changepassword}
            requestpasswordchange=${requestpasswordchange}
          />`;
        }}
      <//>`;
    case "NONE":
      return html`<div ...${props} />`;
    default:
      throw "No Auth service provided";
  }
}
