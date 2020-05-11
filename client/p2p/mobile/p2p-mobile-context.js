import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import {
  useContactsContext
} from '../../contacts/contact-context';
import { useMediaQuery } from '../../layout/useMediaQuery';
import { useRouteContext } from '../../route/router';
export function PeerToPeerMobileContext({ children }) {

  const [state, dispatch] = useContactsContext();
  const [route, setRoute] = useRouteContext();
  const { width } = useMediaQuery();
  const { contact } = state;
  useEffect(() => {
    if (width < 800) {
      if (contact && contact.room) {
        debugger;
        setRoute('/p2p-chat');
      } else if (contact && !contact.room) {
        setRoute('/invitation');
      } else {
        setRoute('/contacts');
      }
    }
  }, [contact]);



  return children;
}
