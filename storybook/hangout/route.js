import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import { AppRoute } from "../../client/components/app-route/index";
import Block from "../../client/features/hangouts/ui-components/Block";
import Blocked from "../../client/features/hangouts/ui-components/Blocked";
import Configure from "../../client/features/hangouts/ui-components/Configure";
import Invite from "../../client/features/hangouts/ui-components/Invite";
import Invitee from "../../client/features/hangouts/ui-components/Invitee";
import Inviter from "../../client/features/hangouts/ui-components/Inviter";
import UnreadHangouts from "../../client/features/hangouts/ui-components/UnreadHangouts";
import Message from "../../client/features/hangouts/ui-components/messages/Message";

import HangoutsUiStates from "./hangouts.ui.state";
import HangChatUiState from "./hangchat.ui.state";
const html = htm.bind(h);
const hangouts = [
  { username: "userone" },
  { username: "usertwo" },
  { username: "userthree" },
];
const hangout = {
  username: "testuser",
  email: "test@gmail.com",
  message: { text: `Let's chat on Hangout!`, timestamp: 1590820782921 },
};
const message = {
  username: "breno",
  text: `Let's Chat on Hangout!`,
  timestamp: 1591331767836,
};
//
import { messages } from "./fakeMessages";
export default function HangoutRoutes() {
  return [
    html`
      <${AppRoute} path="/block">
        <${Block} hangouts=${hangouts} username="demouser" />
      <//>
      <${AppRoute} path="/blocked">
        <${Blocked} hangouts=${hangouts} />
      <//>
      <${AppRoute} path="/configure">
        <${Configure} hangout=${{ username: "demouser" }} />
      <//>

      <${AppRoute} path="/invite">
        <${Invite} hangouts=${hangouts} />
      <//>
      <${AppRoute} path="/inviter">
        <${Inviter} hangouts=${hangouts} />
      <//>
      <${AppRoute} path="/invitee">
        <${Invitee} hangouts=${hangouts} />
      <//>
      <${AppRoute} path="/unreadhangouts">
        <${UnreadHangouts} unreadhangouts=${hangouts} />
      <//>
      <${AppRoute} path="/message">
        <div style=${{ padding: 20, backgroundColor: "#eeeeeee" }}>
          <${Message} message="{message}" username=${hangout.username} />
        </div>
      <//>

      <${AppRoute} path="/hangouts">
        <${HangoutsUiStates} />
      <//>
      <${AppRoute} path="/hangchat">
        <${HangChatUiState} />
      <//>
    `,
  ];
}
