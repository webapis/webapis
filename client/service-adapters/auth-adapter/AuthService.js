import {
  h,
  render,
} from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";

import NodeJsAuthService from "../../features/authentication/services/nodejs/NodejsAuthService";
import AuthProvider from "../../features/authentication/state/AuthProvider";
const html = htm.bind(h);
export default function AuthService(props) {
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

  // switch (AUTH) {
  //   case AUTH=== "NODEJS":
  //     return html`<${NodeJsAuthService}
  //       >${({ signup, login, changepassword, requestpasswordchange }) => {
  //         return html`<${AuthProvider}
  //           signup${signup}
  //           login=${login}
  //           changepassword=${changepassword}
  //           requestpasswordchange=${requestpasswordchange}
  //         />`;
  //       }}
  //     <//>`;
  //   default:
  //     return null;
  // }
}

/*
html`<${AuthProvider}
    ...${props}
      signup${signup}
      login=${login}
      changepassword=${changepassword}
      requestpasswordchange=${requestpasswordchange}
    />`;
*/

/*
html`<${NodeJsAuthService}
  >${({ signup, login, changepassword, requestpasswordchange }) => {
    return html `<div>${children}</div>`
  }}
<//>`
*/
