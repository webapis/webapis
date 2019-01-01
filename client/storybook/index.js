import { h, render } from 'preact';
import { RouteProvider, Route } from '../route/router';
import Navigation from './Navigation';

import Hangout from '../hangouts/Hangout';
import { Block } from '../hangouts/state-ui/Block';
import { Blocked } from '../hangouts/state-ui/Blocked';
import { Configure } from '../hangouts/state-ui/Configure';
import { Invite } from '../hangouts/state-ui/Invite';
import { Invitee } from '../hangouts/state-ui/Invitee';
import { Inviter } from '../hangouts/state-ui/Inviter';
import { Hangchat } from '../hangouts/state-ui/Hangchat';
import { Message } from '../hangouts/ui/Message';

import { ThemeProvider } from '../theme/theme-context';
import { List, ListItem } from '../layout/NavList';
import { DrawerContent } from './DrawerContent';

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
  text: `Let's Chat on Hangout!`,
  timestamp: 1590820782921,
};
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
    <RouteProvider initialRoute="/blocked">
      <Navigation drawerContent={<DrawerContent />}>
        <Route path="/hangouts">
          <Hangout hangouts={hangouts} />
        </Route>
        <Route path="/block">
          <Block hangout={hangout} />
        </Route>
        <Route path="/blocked">
          <Blocked hangout={hangout} />
        </Route>
        <Route path="/configure">
          <Configure hangout={hangout} />
        </Route>
        <Route path="/invite">
          <Invite hangout={hangout} />
        </Route>
        <Route path="/invitee">
          <Invitee hangout={hangout} />
        </Route>
        <Route path="/inviter">
          <Inviter hangout={hangout} />
        </Route>
        <Route path="/hangchat">
          <Hangchat hangout={hangout} />
        </Route>
        <Route path="/message">
          <div style={{ padding: 20, backgroundColor: '#eeeeeee' }}>
            <Message message={message} username={hangout.username} />
          </div>
        </Route>
      </Navigation>
    </RouteProvider>
  </ThemeProvider>,
  document.body
);
