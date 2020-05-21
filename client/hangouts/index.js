import { h } from 'preact';
import { Suspense, lazy } from 'preact/compat';
import { useMediaQuery } from '../layout/useMediaQuery';
import { RouteProvider } from '../route/router';
import { WebSocketProvider } from './WebSocketProvider';
import { ContactsProvider } from './contacts/contact-context';
const HangoutDesktop = lazy(() => import('./desktop'));
const HangoutMobile = lazy(() => import('./mobile'));

export default function Hangout() {
  const { width } = useMediaQuery();

  if (width > 0 && width < 800) {
    return (
      <ContactsProvider>
        <WebSocketProvider url='ws://localhost:3000/hangouts'>
          <RouteProvider initialRoute='/contacts'>
            <Suspense fallback={<div>Loading...</div>}>
              <HangoutMobile />
            </Suspense>
          </RouteProvider>
        </WebSocketProvider>
      </ContactsProvider>
    );
  }
  if (width > 800) {
    return (
      <ContactsProvider>
        <WebSocketProvider url='ws://localhost:3000/hangouts'>
          <Suspense fallback={<div>Loading...</div>}>
            <HangoutDesktop />
          </Suspense>
        </WebSocketProvider>
      </ContactsProvider>
    );
  }
}
