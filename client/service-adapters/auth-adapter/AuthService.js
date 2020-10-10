import { h, render } from "preact";
import htm from "htm.module";

import NodeJsAuthService from "../../features/authentication/services/nodejs/NodejsAuthService";
import AuthMockService from "../../apps/auth-app/AuthMockService";
import AuthProvider from "../../features/authentication/state/AuthProvider";
const html = htm.bind(h);
export default function AuthService(props) {
  const { children, staticUser } = props;
  switch (AUTH) {
    case "MOCK":
      return html`<${AuthMockService} staticUser=${staticUser}
        >${({ signup, login, changepassword, requestpasswordchange }) => {
          return html`<${AuthProvider}
            ...${props}
            signup=${signup}
            login=${login}
            changepassword=${changepassword}
            requestpasswordchange=${requestpasswordchange}
            >${({ user }) => {
              return children({ user });
            }}
          <//>`;
        }}
      <//>`;
    case "NODEJS":
      //
      return html`<${NodeJsAuthService} staticUser=${staticUser}
        >${({ signup, login, changepassword, requestpasswordchange }) => {
          return html`<${AuthProvider}
            ...${props}
            signup=${signup}
            login=${login}
            changepassword=${changepassword}
            requestpasswordchange=${requestpasswordchange}
            >${({ user }) => {
              return children({ user });
            }}
          <//> `;
        }}
      <//>`;
    case "NONE":
      return children({ user: staticUser });
    default:
      throw "No Auth service provided";
  }
}
