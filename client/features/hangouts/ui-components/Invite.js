import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";

import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import PersonAdd from "icons/PersonAdd";
import TextInput from "controls/text-input/index";
import { Center } from "components/layout/Center";
import Layout from "./Layout";
import Button from "controls/button/index";
const style = {
  layout: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
};
//

const html = htm.bind(h);
export default function Invite({
  hangout,
  onInvite,
  onMessageText,
  messageText,
  loading,
}) {
  return html`
    <${Layout} style=${style.layout} id="invite-ui">
      <${Center}>
        <${PersonAdd} color="green" />
      <//>
      <${Center}>
        Start Conversation with <b>${hangout && hangout.email}</b>
      <//>
      <${TextInput}
        id="messageTextInput"
        onChange=${onMessageText}
        value=${messageText}
        data-testid="messageTextInput"
        disabled=${loading}
      />
      <div class="d-flex justify-content-center">
        <${Button}
          disables=${messageText === ""}
          loading=${loading}
          id="INVITE"
          onClick=${onInvite}
          data-testid="oninvite-btn"
          title="Send Invite"
          bg="primary"
        />
      </div>
    <//>
  `;
}
