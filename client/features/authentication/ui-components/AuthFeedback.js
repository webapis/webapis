import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import { useAuthContext } from "features/authentication";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";

const html = htm.bind(h);
export default function AuthFeedback({ message, children }) {
  const { state } = useAuthContext();

  return html`
    <div
      style=${{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: 300,
        fontSize: 16,
      }}
      data-testid="auth-feedback"
    >
      <div>${state.authFeedback}</div>

      <div>${children}</div>
    </div>
  `;
}

export function LoginLink() {
  return html`
    <div>
      <a href=${api_url}>Login</a>
    </div>
  `;
}
