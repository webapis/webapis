import { h } from "preact";

import htm from "htm.module";
import PersonAdd from "icons/PersonAdd";
import TextInput from "controls/text-input/index";
import Layout from "./Layout";
import Button from "controls/button/index";

//

const html = htm.bind(h);
export default function Invite({
  onUserClientCommand,
  onMessageText,
  messageText,
  loading,
  username,
  email,
}) {
  return html`
    <${Layout} id="invite-ui" username=${username} desc="Invite ">
    <div class="h-100 d-flex flex-column justify-content-around" >
    <div class="">
    <div class="d-flex justify-content-center">
      <${PersonAdd} color="green" />
      </div>
      <div class="d-flex justify-content-center">
      Start Conversation with <b>${email}</b>
      </div>
    <div class="m-3">
      <${TextInput}
        id="messageTextInput"
        onChange=${onMessageText}
        value=${messageText}
        data-testid="messageTextInput"
        disabled=${loading}
      />
      </div>
      <div class="d-flex justify-content-center">
        <${Button}
          disables=${messageText === ""}
          loading=${loading}
          id="INVITE"
          onClick=${onUserClientCommand}
          data-testid="oninvite-btn"
          title="Send Invite"
          bg="success"
        />
      <//>
      </div>
      </div>
    </${Layout}>
  `;
}
