import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";

import { Message, Messages } from "../ui-components/Messages";
import { useMessageTimeLog } from "../ui-components/Messages";
import Button from "controls/button/index";

const html = htm.bind(h);
export function Inviter(props) {
  const { pendingHangout, onUserClientCommand } = props;
  return html`
    <div class="row justify-content-center" id="inviter-ui">
      <div class="col-sm-5 bg-light">
        <${Messages}>
          <${Message} ...${props} />
        <//>

        <div class="row">
          <div class="col">
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
          </div>

          <div class="col mb-1">
            <${Button}
              id="ACCEPT"
              onClick=${onUserClientCommand}
              data-testid="accept-btn"
              loading=${pendingHangout && pendingHangout.command === "ACCEPT"}
              title="Accept"
              bg="primary"
              block
            />
          </div>
        </div>
      </div>
    </div>
  `;
}

export default function InviterContainer({ state, funcs }) {
  const { hangout } = state;
  const { message, username } = hangout;
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
      username=${username}
    />
  `;
}
