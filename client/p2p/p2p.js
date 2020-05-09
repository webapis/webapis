import { h } from 'preact';
import { Suspense, lazy } from 'preact/compat';
import { useMediaQuery } from '../layout/useMediaQuery';

const PeerToPeerDesktop = lazy(() => import('./p2p-desktop'));
const PeerToPeerMobile = lazy(() => import('./p2p-mobile'));

export default function PeerToPeer() {
  const { width } = useMediaQuery();

  if (width > 0 && width < 800) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <PeerToPeerMobile />
      </Suspense>
    );
  }
  if (width > 800) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <PeerToPeerDesktop />
      </Suspense>
    );
  }
}
