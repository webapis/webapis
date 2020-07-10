import { h } from "preact";
import { AppRoute } from "components/app-route";
import Block from "features/hangouts/ui-components/Block";
import Blocked from "features/hangouts/ui-components/Blocked";
import Configure from "features/hangouts/ui-components/Configure";
import Hangchat from "features/hangouts/ui-components/Hangchat";
import Hangout from "features/hangouts/ui-components/Hangout";
import Invite from "features/hangouts/ui-components/Invite";
import Invitee from "features/hangouts/ui-components/Invitee";
import Inviter from "features/hangouts/ui-components/Inviter";
import UnreadHangouts from "features/hangouts/ui-components/UnreadHangouts";
import Message from "features/hangouts/ui-components/messages/Message";
import HangoutFilter from "features/hangouts/ui-components/HangoutFilter";
import HangoutSearch from "features/hangouts/ui-components/HangoutSearch";
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
    <AppRoute path="/block">
      <Block hangouts={hangouts} />
    </AppRoute>,
    <AppRoute path="/blocked">
      <Blocked hangouts={hangouts} />
    </AppRoute>,
    <AppRoute path="/configure">
      <Configure hangouts={hangouts} />
    </AppRoute>,
    <AppRoute path="/hangchat">
      <Hangchat hangout={hangout} messages={messages} username="demo" />
    </AppRoute>,
    <AppRoute path="/hangout">
      <Hangout hangouts={hangouts} />
    </AppRoute>,
    <AppRoute path="/invite">
      <Invite hangouts={hangouts} />
    </AppRoute>,
    <AppRoute path="/inviter">
      <Inviter hangouts={hangouts} />
    </AppRoute>,
    <AppRoute path="/invitee">
      <Invitee hangouts={hangouts} />
    </AppRoute>,
    <AppRoute path="/unreadhangouts">
      <UnreadHangouts unreadhangouts={hangouts} />
    </AppRoute>,
    <AppRoute path="/message">
      <div style={{ padding: 20, backgroundColor: "#eeeeeee" }}>
        <Message message={message} username={hangout.username} />
      </div>
    </AppRoute>,
    <AppRoute path="/messages">
      <Hangchat hangout={hangout} messages={messages} username="demo" />
    </AppRoute>,
    <AppRoute path="/search">
      <HangoutSearch />
    </AppRoute>,
    <AppRoute path="/filter">
      <HangoutFilter />
    </AppRoute>,
  ];
}
