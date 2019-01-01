import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";

import { Message, useMessageTimeLog } from "../ui-components/Hangchat";
import Button from "controls/button/index";
import Layout from "./Layout";
const html = htm.bind(h);
export function Inviter(props) {
  const { pendingHangout, onUserClientCommand, target } = props;
  return html`
    <${Layout} target=${target} desc="Invitation from ">
      <div
        data-testid="inviter-ui"
        class="d-flex flex-column justify-content-between"
        style="height:100%"
      >
        <${Message} ...${props} />

        <div class="btn-group d-flex" role="group">
          <${Button}
            id="DECLINE"
            onClick=${onUserClientCommand}
            data-testid="decline-btn"
            loading=${pendingHangout && pendingHangout.command === "DECLINE"}
            title="Decline"
            block
            bg="danger"
            outline
          />

          <${Button}
            id="ACCEPT"
            onClick=${onUserClientCommand}
            data-testid="accept-btn"
            loading=${pendingHangout && pendingHangout.command === "ACCEPT"}
            title="Accept"
            bg="success"
            block
          />
        </div>
      </div>
    <//>
  `;
}

export default function InviterContainer({ state, funcs, hangout }) {
  const { target, message } = hangout;
  const { timestamp, text, state: messageState } = message;
  const { timelog } = useMessageTimeLog({ timestamp });
  return html`
    <${Inviter}
      ...${state}
      ...${funcs}
      timestamp=${timestamp}
      timelog=${timelog}
      text=${text}
      state=${messageState}
      target=${target}
    />
  `;
}
