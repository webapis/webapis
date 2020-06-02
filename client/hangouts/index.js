import { h } from 'preact';
import Mobile from './mobile';
import { HangoutsProvider } from './state/HangoutsProvider';
import { RouteProvider, useRouteContext } from '../route/router';
export default function () {
  return (
    <HangoutsProvider>
      <RouteProvider initialRoute="/hangouts">
        <Mobile />
      </RouteProvider>
    </HangoutsProvider>
  );
}
