import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { useContactsContext } from '../contacts/contact-context';
import { useMediaQuery } from '../layout/useMediaQuery';
import { useRouteContext } from '../route/router';
export function PeerToPeerMobileContext({ children }) {
  const [state, dispatch] = useContactsContext();
  const [route, setRoute] = useRouteContext();
  const { width } = useMediaQuery();
  const { contact } = state;
  useEffect(() => {
    if (width < 800) {
   
      if (contact && contact.room) {
     
        setRoute('/p2p-chat');
      } else {
        setRoute('/invitation');
      }
    }
  }, [contact]);

  return children;
}
