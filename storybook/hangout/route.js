import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import { AppRoute } from "../../client/components/app-route/index";
import Block from "../../client/features/hangouts/ui-components/Block";
import Blocked from "../../client/features/hangouts/ui-components/Blocked";
import Configure from "../../client/features/hangouts/ui-components/Configure";
import Invite from "../../client/features/hangouts/ui-components/Invite";
import Invitee from "../../client/features/hangouts/ui-components/Invitee";
import Declined from "../../client/features/hangouts/ui-components/Declined";
import { Inviter } from "../../client/features/hangouts/ui-components/Inviter";
import UnreadHangouts from "../../client/features/hangouts/ui-components/UnreadHangouts";

import HangoutsUiStates from "./hangouts.ui.state";
import HangChatUiState from "./hangchat.ui.state";
const html = htm.bind(h);
const hangouts = [
  { username: "userone" },
  { username: "usertwo" },
  { username: "userthree" },
];

import { messages } from "./fakeMessages";
export default function HangoutRoutes() {
  return [
    html`
      <${AppRoute} path="/block">
        <div class="fixed-bottom">
          <${Block} username="demouser" email="demouser@gmail.com" />
        </div>
      <//>
      <${AppRoute} path="/blocked">
        <div class="fixed-bottom">
          <${Blocked} username="demouser" email="demouser@gmail.com" />
        </div>
      <//>
      <${AppRoute} path="/configure">
        <div class="fixed-bottom">
          <${Configure} username="demouser" email="demouser@gmail.com" />
        </div>
      <//>

      <${AppRoute} path="/invite">
        <div class="fixed-bottom">
          <${Invite} username="demouser" email="demouser@gmail.com" />
        </div>
      <//>
      <${AppRoute} path="/declined">
        <div class="fixed-bottom">
          <${Declined} username="demouser" email="demouser@gmail.com" />
        </div>
      <//>
      <${AppRoute} path="/inviter">
        <div class="fixed-bottom">
          <${Inviter}
            text="let's chat"
            username="demouser"
            state="unread"
            timelog="Now"
          />
        </div>
      <//>
      <${AppRoute} path="/invitee">
        <div class="fixed-bottom">
          <${Invitee} username="demouser" email="demouser@gmail.com" />
        </div>
      <//>
      <${AppRoute} path="/unreadhangouts">
        <div class="fixed-bottom">
          <${UnreadHangouts} unreadhangouts=${hangouts} />
        </div>
      <//>
      <${AppRoute} path="/hangouts">
        <${HangoutsUiStates} />
      <//>
      <${AppRoute} path="/hangchat">
        <div class="fixed-bottom">
          <${HangChatUiState} />
        </div>
      <//>
    `,
  ];
}
