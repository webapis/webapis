import { h } from 'preact';
import { Suspense, lazy } from 'preact/compat';
import { useEffect } from 'preact/hooks';
import { useRouteContext } from '../route/router';
import { useRootRouteContext,RootRoute } from '../route/root-router';
import { useMediaQuery } from '../layout/useMediaQuery';
import { Route } from '../route/router';
import { PeerToPeerMobileContext } from '../p2p/p2p-mobile-context';

import Invitation from '../invitation/Invitation';
import Messaging from '../messaging/Messaging';

const Contacts = lazy(() => import('../contacts/Contacts'));
const PeerToPeerChat = lazy(() => import('../p2p/p2p-chat'));
const PeerToPeer = lazy(() => import('./p2p'));
export default function PeerToPeerMobile() {
  const [route, setRoute] = useRouteContext();
  const [rootRoute, setRootRoute] = useRootRouteContext();
  const { width } = useMediaQuery();

  useEffect(() => {
    if (width < 800) {
      setRoute('/contacts');
    }
  }, []);
  return (
    <PeerToPeerMobileContext>
      <Route path='/contacts'>
        <Suspense fallback={<div>loading...</div>}>
          <Contacts />
        </Suspense>
      </Route>

      <Route path='/invitation'>
        <Suspense fallback={<div>loading...</div>}>
          <Invitation />
        </Suspense>
      </Route>
      <Route path='/messaging'>
        <Suspense fallback={<div>loading...</div>}>
          <Messaging />
        </Suspense>
      </Route>
      <Route path='/p2p-chat'>
        <Suspense fallback={<div>loading...</div>}>
          <PeerToPeerChat />
        </Suspense>
      </Route>
    
    </PeerToPeerMobileContext>
  );
}
