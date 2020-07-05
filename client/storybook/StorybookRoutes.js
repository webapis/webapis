import { h } from 'preact'
import { AppRoute } from 'components/app-route';
import Hangout from 'features/hangouts/ui-components/Hangout';
import Block from 'features/hangouts/ui-components/Block';
import Blocked from 'features/hangouts/ui-components/Blocked';
import Configure from 'features/hangouts/ui-components/Configure';
import Invite from 'features/hangouts/ui-components/Invite';
import Invitee from 'features/hangouts/ui-components/Invitee';
import Inviter from 'features/hangouts/ui-components/Inviter';
import Hangchat from 'features/hangouts/ui-components/Hangchat';
import { Message } from 'features/hangouts/ui-components/messages/Message';
import { OnlineStatus } from 'icons/onlineStatus';
import { IconsDemo } from './IconsDemo'
import { messages } from './fakeMessages';
import { UnreadDemo } from './UreadDemo'
import { BlockerMessageDemo } from './BlockerMessageDemo'
import AuthDemoRoutes from './authentication/route'
import ComponentsRoutes from './components/route'
const hangouts = [
  { username: 'userone' },
  { username: 'usertwo' },
  { username: 'userthree' },
];
const hangout = {
  username: 'testuser',
  email: 'test@gmail.com',
  message: { text: `Let's chat on Hangout!`, timestamp: 1590820782921 },
};
const message = {
  username: 'breno',
  text: `Let's Chat on Hangout!`,
  timestamp: 1591331767836,
};
//

export default function StorybookRoutes() {
  return (
    <div style={{ height: '100vh'}}>
      <AppRoute path="/hangouts">
        <Hangout hangouts={hangouts} />
      </AppRoute>
      <AppRoute path="/block">
        <Block hangout={hangout} />
      </AppRoute>
      <AppRoute path="/blocked">
        <Blocked hangout={hangout} />
      </AppRoute>
      <AppRoute path="/configure">
        <Configure hangout={hangout} />
      </AppRoute>
      <AppRoute path="/invite">
        <Invite hangout={hangout} />
      </AppRoute>
      <AppRoute path="/invitee">
        <Invitee hangout={hangout} />
      </AppRoute>
      <AppRoute path="/inviter">
        <Inviter hangout={hangout} />
      </AppRoute>
      <AppRoute path="/hangchat">
        <Hangchat hangout={hangout} messages={messages} username="demo" />
      </AppRoute>
      <AppRoute path="/message">
        <div style={{ padding: 20, backgroundColor: '#eeeeeee' }}>
          <Message message={message} username={hangout.username} />
        </div>
      </AppRoute>
      <AppRoute path="/online">
        <div>
          <OnlineStatus online />
          <OnlineStatus />
        </div>
      </AppRoute>
      <AppRoute path="/messages">
        <Hangchat hangout={hangout} messages={messages} username="demo" />
      </AppRoute>
      <AppRoute path="/unread">
        <UnreadDemo />
      </AppRoute>
      <AppRoute path="/blocker-message">
        <BlockerMessageDemo />
      </AppRoute>

      <AppRoute path="/icons">
        <IconsDemo />
      </AppRoute>
      <AuthDemoRoutes/>
      <ComponentsRoutes/>
    </div>

  )
}