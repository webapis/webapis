import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import Navigation from "../../client/apps/webcom-app/Navigation";
const html = htm.bind(h);
const message = {
  text: "You can not send message because you are blocked",
  timestamp: 12323,
  username: "demo",
};
export default function NavigationState() {
  return html`
    <div>
      <h5>User not authenticated</h5>
      <${Navigation} authed=${false} username="demouser" name="berouser" />
      <h5>User is authenticated</h5>
      <${Navigation}
        authed=${true}
        username="demouser"
        name="berouser"
        messageCounter=${1}
      />
    </div>
  `;
}
