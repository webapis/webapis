import { h } from 'preact';
import { Suspense, lazy } from 'preact/compat';
import { useMediaQuery } from '../layout/useMediaQuery';
import { P2PDesktopProvider } from './desktop/p2p-desktop-context';
import { Route, RouteProvider } from '../route/router';
const PeerToPeerDesktop = lazy(() => import('./desktop/p2p-desktop'));
const PeerToPeerMobile = lazy(() => import('./mobile/p2p-mobile-route'));

export default function PeerToPeer() {
  const { width } = useMediaQuery();

  if (width > 0 && width < 800) {
 
    return (
      <RouteProvider initialRoute='/contacts'>
        <Suspense fallback={<div>Loading...</div>}>
          <PeerToPeerMobile />
        </Suspense>
      </RouteProvider>
    );
  }
  if (width > 800) {

    return (
      <Suspense fallback={<div>Loading...</div>}>
        <P2PDesktopProvider>
          <PeerToPeerDesktop />
        </P2PDesktopProvider>
      </Suspense>
    );
  }
}
