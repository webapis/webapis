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

export default function Mobile() {
  const [route, setRoute] = useRouteContext();
  const {
    hangout,
    hangouts,
    onAccept,
    onBlock,
    onInvite,
    onSelectHangout,
    onSelectUser,
    onUnblock,
    onSearch,
    users,
    search,
    onStartSearch,
    onMessageText,
    messageText
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
          <Block hangout={hangout} onBlock={onBlock} />
        </Suspense>
      </Route>
      <Route path="/BLOCKED">
        <Suspense fallback={<div>Loading...</div>}>
          <Blocked hangout={hangout} onUnblock={onUnblock} />
        </Suspense>
      </Route>
      <Route path="/configure">
        <Suspense fallback={<div>Loading...</div>}>
          <Configure hangout={hangout} />
        </Suspense>
      </Route>
      <Route path="/HANGCHAT">
        <Suspense fallback={<div>Loading...</div>}>
          <Hangchat />
        </Suspense>
      </Route>
      <Route path="/INVITE">
        <Suspense fallback={<div>Loading...</div>}>
          <Invite hangout={hangout} onInvite={onInvite} onMessageText={onMessageText} messageText={messageText}/>
        </Suspense>
      </Route>
      <Route path="/INVITEE">
        <Suspense fallback={<div>Loading...</div>}>
          <Invitee hangout={hangout} />
        </Suspense>
      </Route>
      <Route path="/INVITER">
        <Suspense fallback={<div>Loading...</div>}>
          <Inviter hangout={hangout} onAccept={onAccept} />
        </Suspense>
      </Route>
    </div>
  );
}
