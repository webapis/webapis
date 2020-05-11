import { h } from 'preact';
import { Suspense, lazy } from 'preact/compat';
import { useMediaQuery } from '../layout/useMediaQuery';
import { P2PDesktopProvider } from './desktop/p2p-desktop-context';
import { RouteProvider, Route } from '../route/router';

const PeerToPeerDesktop = lazy(() => import('./desktop/p2p-desktop'));
const PeerToPeerMobile = lazy(() => import('./mobile/p2p-mobile'));

export default function PeerToPeer() {
  const { width } = useMediaQuery();

  if (width > 0 && width < 800) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <RouteProvider initialRoute='/contacts'>
          <PeerToPeerMobile />
        </RouteProvider>
      </Suspense>
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
