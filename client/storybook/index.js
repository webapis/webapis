import { h, render } from 'preact';
import { AppRouteProvider, AppRoute } from '../app-route/AppRouteProvider';
import Navigation from './Navigation';
import Hangout from '../hangouts/Hangout';
import Block from '../hangouts/state-ui/Block';
import Blocked from '../hangouts/state-ui/Blocked';
import Configure from '../hangouts/state-ui/Configure';
import Invite from '../hangouts/state-ui/Invite';
import Invitee from '../hangouts/state-ui/Invitee';
import Inviter from '../hangouts/state-ui/Inviter';
import Hangchat from '../hangouts/state-ui/Hangchat';
import { Message } from '../hangouts/ui/Message';
import { Messages } from '../hangouts/ui/Messages';
import { MessageEditor } from '../hangouts/ui/MessageEditor';
import { OnlineStatus } from '../layout/icons/onlineStatus';
import { ThemeProvider } from '../theme/theme-context';
import { List, ListItem } from '../layout/NavList';
import { DrawerContent } from './DrawerContent';
import { messages } from './fakeMessages';
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
render(
  <ThemeProvider
    initState={{
      primary: {
        background: '#6200EE',
        color: '#ffffff',
        fontFamily: 'Roboto, Helvetica, "Arial"',
      },
    }}
  >
    <AppRouteProvider initState={{ featureRoute: '/', route: '/message' }}>
      <Navigation drawerContent={<DrawerContent />}>
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
      </Navigation>
    </AppRouteProvider>
  </ThemeProvider>,
  document.body
);
