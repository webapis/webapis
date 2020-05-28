import { h } from 'preact';
import { Suspense, lazy } from 'preact/compat';
import { useEffect } from 'preact/hooks';
import { Route, useRouteContext } from '../route/router';
import { useAppContext } from '../app-context/app-context';
import { useWebSocket } from './wsocket/useWebSocket';
import {useHangouts} from './state/useHangouts'
const Hangouts = lazy(() => import('./Hangouts'));
const Block = lazy(() => import('./views/Block'));
const Blocked = lazy(() => import('./views/Blocked'));
const Chat = lazy(() => import('./views/Chat'));
const Configure = lazy(() => import('./views/Configure'));
const Invite = lazy(() => import('./views/Invite'));
const Invitee = lazy(() => import('./views/Invitee'));
const Inviter = lazy(() => import('./views/Inviter'));

export default function PeerToPeerMobile() {
  const {hangout}=useHangouts()
  const [route, setRoute] = useRouteContext();
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
  } = useWebSocket();
  useEffect(() => {
    if (hangout) {
      setRoute(`/${hangout.state}`);
    }
  }, [hangout]);

  function onSetting() {
    setRoute('/cofigure');
  }
  return (
    <div style={{ height: '85vh' }}>
      <Route path="/hangouts">
        <Suspense fallback={<div>loading...</div>}>
          <Hangouts />
        </Suspense>
      </Route>

      <Route path="/block">
        <Suspense fallback={<div>loading...</div>}>
          <Block hangout={hangout} onBlock={onBlock} setRoute={setRoute} />
        </Suspense>
      </Route>
      <Route path="/blocked">
        <Suspense fallback={<div>loading...</div>}>
          <Blocked
            hangout={hangout}
            onUnblock={onUnblock}
            setRoute={setRoute}
          />
        </Suspense>
      </Route>
      <Route path="/accepted">
        <Suspense fallback={<div>loading...</div>}>
          <Chat
            hangout={hangout}
            onSetting={onSetting}
            onChange={onChange}
            message={message}
            sendMessage={sendMessage}
          />
        </Suspense>
      </Route>
      <Route path="/cofigure">
        <Suspense fallback={<div>loading...</div>}>
          <Configure hangout={hangout} setRoute={setRoute} />
        </Suspense>
      </Route>
      <Route path="/invite">
        <Suspense fallback={<div>loading...</div>}>
          <Invite
            hangout={hangout}
            onInvite={onInvite}
            setRoute={setRoute}
            onChange={onChange}
            message={message}
          />
        </Suspense>
      </Route>
      <Route path="/invitee">
        <Suspense fallback={<div>loading...</div>}>
          <Invitee hangout={hangout} />
        </Suspense>
      </Route>
      <Route path="/inviter">
        <Suspense fallback={<div>loading...</div>}>
          <Inviter
            accept_inv_img={accept_inv_img}
            hangout={hangout}
            onAccept={onAccept}
            onDecline={onDecline}
            setRoute={setRoute}
          />
        </Suspense>
      </Route>
    </div>
  );
}
