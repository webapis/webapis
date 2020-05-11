import { h } from 'preact';
import { Suspense, lazy } from 'preact/compat';
import { useMediaQuery } from '../layout/useMediaQuery';
import { P2PDesktopProvider } from '../p2p/p2p-desktop-context';
import { RouteProvider, Route } from '../route/router';
import { ContactsProvider } from '../contacts/contact-context';
const PeerToPeerDesktop = lazy(() => import('./p2p-desktop'));
const PeerToPeerMobile = lazy(() => import('./p2p-mobile'));

export default function PeerToPeer() {
  const { width } = useMediaQuery();

  if (width > 0 && width < 800) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <ContactsProvider>
          <RouteProvider initialRoute='/contacts'>
            <PeerToPeerMobile />
          </RouteProvider>
        </ContactsProvider>
      </Suspense>
    );
  }
  if (width > 800) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <ContactsProvider>
          <P2PDesktopProvider>
            <PeerToPeerDesktop />
          </P2PDesktopProvider>
        </ContactsProvider>
      </Suspense>
    );
  }
}
