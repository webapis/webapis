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
import GuestHangchatUiState from "./guesthangchat.ui.state";
import VideoCallUiState from "./videocall.ui.state";
import NavigationState from "./navigation.state";
const html = htm.bind(h);
const hangouts = [
  { username: "userone" },
  { username: "usertwo" },
  { username: "userthree" },
];

export default function HangoutRoutes() {
  return [
    html`
      <${AppRoute} path="/guest">
        <${GuestHangchatUiState}
          username="demouser"
          email="demouser@gmail.com"
        />
      <//>
      <${AppRoute} path="/block">
        <${Block} username="demouser" email="demouser@gmail.com" />
      <//>
      <${AppRoute} path="/blocked">
        <${Blocked} username="demouser" email="demouser@gmail.com" />
      <//>
      <${AppRoute} path="/configure">
        <${Configure} username="demouser" email="demouser@gmail.com" />
      <//>

      <${AppRoute} path="/invite">
        <${Invite} username="demouser" email="demouser@gmail.com" />
      <//>
      <${AppRoute} path="/declined">
        <${Declined} username="demouser" email="demouser@gmail.com" />
      <//>
      <${AppRoute} path="/inviter">
        <${Inviter}
          text="let's chat"
          username="demouser"
          state="unread"
          timelog="Now"
        />
      <//>
      <${AppRoute} path="/invitee">
        <${Invitee} username="demouser" email="demouser@gmail.com" />
      <//>
      <${AppRoute} path="/unreadhangouts">
        <${UnreadHangouts} unreadhangouts=${hangouts} />
      <//>
      <${AppRoute} path="/hangouts">
        <${HangoutsUiStates} />
      <//>
      <${AppRoute} path="/hangchat">
        <${HangChatUiState} />
      <//>
      <${AppRoute} path="/navigation">
        <${NavigationState} />
      <//>
    `,
  ];
}
