import { h } from 'preact';
import {useEffect} from 'preact/hooks'
import Mobile from './mobile';
import { RouteProvider } from '../route/router';
import {useAppContext} from '../app-context/app-context'
export default function () {
  const [state,dispatch]=useAppContext()
  const {hangoutInitialRoute}=state

  return (

      <RouteProvider initialRoute={hangoutInitialRoute}>
        <Mobile />
      </RouteProvider>

  );
}
