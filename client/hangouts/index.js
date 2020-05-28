import { h } from 'preact';
import { Suspense, lazy } from 'preact/compat';
import { useMediaQuery } from '../layout/useMediaQuery';
import { RouteProvider } from '../route/router';
import { WebSocketProvider } from './wsocket/WebSocketProvider';
import { HangoutsProvider } from './state/HangoutsProvider';
import { useAuthContext } from '../auth/auth-context';
const HangoutDesktop = lazy(() => import('./desktop'));
const HangoutMobile = lazy(() => import('./mobile'));

export default function Hangout() {
  const {state}= useAuthContext()
  const {username}=state
  const { width } = useMediaQuery();

  if (width > 0 && width < 800) {
    return (
      <HangoutsProvider username={username}>
        <WebSocketProvider url='ws://localhost:3000/hangouts'>
          <RouteProvider initialRoute='/hangouts'>
            <Suspense fallback={<div>Loading...</div>}>
              <HangoutMobile />
            </Suspense>
          </RouteProvider>
        </WebSocketProvider>
      </HangoutsProvider>
    );
  }
  if (width > 800) {
    return (
      <HangoutsProvider username={username}>
        <WebSocketProvider url='ws://localhost:3000/hangouts'>
          <Suspense fallback={<div>Loading...</div>}>
            <HangoutDesktop />
          </Suspense>
        </WebSocketProvider>
      </HangoutsProvider>
    );
  }
}
