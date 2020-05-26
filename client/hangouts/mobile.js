import { h } from 'preact';
import { Suspense, lazy } from 'preact/compat';
import { useEffect } from 'preact/hooks';
import { Route, useRouteContext } from '../route/router';
import { useContactsContext } from './contacts/contact-context';
import { useAppContext } from '../app-context/app-context';
import { useAuthContext } from '../auth/auth-context';
import { useWebSocket } from './useWebSocket';
const Contacts = lazy(() => import('./contacts/Contacts'));
const Block = lazy(() => import('./views/Block'));
const Blocked = lazy(() => import('./views/Blocked'));
const Chat = lazy(() => import('./views/Chat'));
const Configure = lazy(() => import('./views/Configure'));
const Invite = lazy(() => import('./views/Invite'));
const Invitee = lazy(() => import('./views/Invitee'));
const Inviter = lazy(() => import('./views/Inviter'));

export default function PeerToPeerMobile() {
  const authContext = useAuthContext();
  const [state, dispatch] = useContactsContext();
  const [route, setRoute] = useRouteContext();
  const { contact } = state;
  const { username } = authContext.state;
  const { accept_inv_img } = useAppContext();
  const {
    onInvite,
    onAccept,
    onBlock,
    onUnblock,
    onDecline,
    onChange,
    message,
    sendMessage,
  } = useWebSocket({ username, target: contact && contact.username, dispatch });
  useEffect(() => {
    if (contact) {
      setRoute(`/${contact.state}`);
    }
  }, [contact]);

  function onSetting() {
    setRoute('/cofigure');
  }
  return (
    <div style={{ height: '85vh' }}>
      <Route path='/contacts'>
        <Suspense fallback={<div>loading...</div>}>
          <Contacts />
        </Suspense>
      </Route>

      <Route path='/block'>
        <Suspense fallback={<div>loading...</div>}>
          <Block contact={contact} onBlock={onBlock} setRoute={setRoute} />
        </Suspense>
      </Route>
      <Route path='/blocked'>
        <Suspense fallback={<div>loading...</div>}>
          <Blocked
            contact={contact}
            onUnblock={onUnblock}
            setRoute={setRoute}
          />
        </Suspense>
      </Route>
      <Route path='/accepted'>
        <Suspense fallback={<div>loading...</div>}>
          <Chat
            contact={contact}
            onSetting={onSetting}
            onChange={onChange}
            message={message}
            sendMessage={sendMessage}
          />
        </Suspense>
      </Route>
      <Route path='/cofigure'>
        <Suspense fallback={<div>loading...</div>}>
          <Configure contact={contact} setRoute={setRoute} />
        </Suspense>
      </Route>
      <Route path='/invite'>
        <Suspense fallback={<div>loading...</div>}>
          <Invite
            contact={contact}
            onInvite={onInvite}
            setRoute={setRoute}
            onChange={onChange}
            message={message}
          />
        </Suspense>
      </Route>
      <Route path='/invitee'>
        <Suspense fallback={<div>loading...</div>}>
          <Invitee contact={contact} />
        </Suspense>
      </Route>
      <Route path='/inviter'>
        <Suspense fallback={<div>loading...</div>}>
          <Inviter
            accept_inv_img={accept_inv_img}
            contact={contact}
            onAccept={onAccept}
            onDecline={onDecline}
            setRoute={setRoute}
          />
        </Suspense>
      </Route>
    </div>
  );
}
