import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { lazy, Suspense } from 'preact/compat';
import { Route, useRouteContext } from '../route/router';

import { useHangouts } from './state/useHangouts';
const Hangouts = lazy(() => import('./Hangout'));
const Block = lazy(() => import('./state-ui/Block'));
const Blocked = lazy(() => import('./state-ui/Blocked'));
const Configure = lazy(() => import('./state-ui/Configure'));
const Hangchat = lazy(() => import('./state-ui/Hangchat'));
const Invite = lazy(() => import('./state-ui/Invite'));
const Invitee = lazy(() => import('./state-ui/Invitee'));
const Inviter = lazy(() => import('./state-ui/Inviter'));
const UnReadHangouts =lazy(() => import('./UnReadHangouts'));
export default function Mobile() {
  const [route, setRoute] = useRouteContext();
  const {
    hangout,
    hangouts,
    onHangout,
    onSelectHangout,
    onSelectUser,
    onSearch,
    users,
    search,
    onStartSearch,
    onMessageText,
    messageText,
    username,
    messages
  } = useHangouts();
  useEffect(() => {
    if (hangout) {
      setRoute(`/${hangout.state}`);
    }
  }, [hangout]);
  return (
    <div style={{ height: '85vh' }}>
      <Route path="/hangouts">
        <Suspense fallback={<div>Loading...</div>}>
          <Hangouts
            users={users}
            search={search}
            hangouts={hangouts}
            onSelectHangout={onSelectHangout}
            onSelectUser={onSelectUser}
            onSearch={onSearch}
            onStartSearch={onStartSearch}
          />
        </Suspense>
      </Route>
      <Route path="/BLOCK">
        <Suspense fallback={<div>Loading...</div>}>
          <Block hangout={hangout} onBlock={onHangout} />
        </Suspense>
      </Route>
      <Route path="/BLOCKED">
        <Suspense fallback={<div>Loading...</div>}>
          <Blocked hangout={hangout} onUnblock={onHangout} />
        </Suspense>
      </Route>
      <Route path="/configure">
        <Suspense fallback={<div>Loading...</div>}>
          <Configure hangout={hangout} />
        </Suspense>
      </Route>
      <Route paths={["/ACCEPTED","/ACCEPTER","/MESSANGER","/MESSAGED"]}>
        <Suspense fallback={<div>Loading...</div>}>
          <Hangchat
            onMessageText={onMessageText}
            onMessage={onHangout}
            messages={messages}
            username={username}
          />
        </Suspense>
      </Route>
    
      <Route path="/INVITE">
        <Suspense fallback={<div>Loading...</div>}>
          <Invite
            hangout={hangout}
            onInvite={onHangout}
            onMessageText={onMessageText}
            messageText={messageText}
          />
        </Suspense>
      </Route>
      <Route path="/INVITED">
        <Suspense fallback={<div>Loading...</div>}>
          <Invitee hangout={hangout} />
        </Suspense>
      </Route>
      <Route path="/INVITER">
        <Suspense fallback={<div>Loading...</div>}>
          <Inviter hangout={hangout} onAccept={onHangout} />
        </Suspense>
      </Route>
      <Route path="/UNREAD">
        <Suspense fallback={<div>Loading...</div>}>
          <UnReadHangouts  />
        </Suspense>
      </Route>
    </div>
  );
}
