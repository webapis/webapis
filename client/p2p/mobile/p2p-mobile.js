import { h } from 'preact';
import { Suspense, lazy } from 'preact/compat';
import { useEffect } from 'preact/hooks';
import { useRouteContext } from '../../route/router';
import { useMediaQuery } from '../../layout/useMediaQuery';
import { Route } from '../../route/router';
import { PeerToPeerMobileContext } from './p2p-mobile-context';
import { PeerToPeerInvitationMobile } from './p2p-invitation-mobile';
import Messaging from '../../messaging/Messaging';
import { useContactsContext } from '../../contacts/contact-context';
const Contacts = lazy(() => import('../../contacts/Contacts'));
const PeerToPeerChat = lazy(() => import('./p2p-chat-mobile'));

export default function PeerToPeerMobile() {
  const [state, dispatch] = useContactsContext();
  const [route, setRoute] = useRouteContext();
  const { contact } = state;
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
          <PeerToPeerInvitationMobile invitation={contact} />
        </Suspense>
      </Route>
      <Route path='/messaging'>
        <Suspense fallback={<div>loading...</div>}>
          <Messaging />
        </Suspense>
      </Route>
      <Route path='/p2p-chat'>
        <Suspense fallback={<div>loading...</div>}>
          <PeerToPeerChat chat={contact} />
        </Suspense>
      </Route>
    </PeerToPeerMobileContext>
  );
}
