import { h } from 'preact';
import { Suspense, lazy } from 'preact/compat';
import { useEffect } from 'preact/hooks';
import { Route, useRouteContext } from '../../route/router';
import { useContactsContext } from '../../contacts/contact-context';
import { useAppContext } from '../../app-context/app-context';
const Contacts = lazy(() => import('../../contacts/Contacts'));
const Block = lazy(() => import('../../chat/Block'));
const Blocked = lazy(() => import('../../chat/Blocked'));
const Chat = lazy(() => import('../../chat/Chat'));
const Configure = lazy(() => import('../../chat/Configure'));
const Invite = lazy(() => import('../../chat/Invite'));
const Invitee = lazy(() => import('../../chat/Invitee'));
const Inviter = lazy(() => import('../../chat/Inviter'));

export default function PeerToPeerMobile() {
  const [state, dispatch] = useContactsContext();
  const [route, setRoute] = useRouteContext();
  const { contact } = state;
  const { accept_inv_img } = useAppContext();
  useEffect(() => {
    if (contact) {
    
      setRoute(`/${contact.state}`);
    }
  }, [contact]);

  function onSetting (){
    setRoute('/cofigure')
  }

  return (
    <div style={{ height: '85vh' }}>
      <Route path='/contacts'>
        <Suspense fallback={<div>loading...</div>}>
          <Contacts />
        </Suspense>
      </Route>

      <Route path='/block'>
        <Suspense fallback={<div>loading...</div>}>
          <Block contact={contact} />
        </Suspense>
      </Route>
      <Route path='/blocked'>
        <Suspense fallback={<div>loading...</div>}>
          <Blocked contact={contact} />
        </Suspense>
      </Route>
      <Route path='/chat'>
        <Suspense fallback={<div>loading...</div>}>
          <Chat contact={contact} onSetting={onSetting} />
        </Suspense>
      </Route>
      <Route path='/cofigure'>
        <Suspense fallback={<div>loading...</div>}>
          <Configure contact={contact} />
        </Suspense>
      </Route>
      <Route path='/invite'>
        <Suspense fallback={<div>loading...</div>}>
          <Invite contact={contact} />
        </Suspense>
      </Route>
      <Route path='/invitee'>
        <Suspense fallback={<div>loading...</div>}>
          <Invitee contact={contact} />
        </Suspense>
      </Route>
      <Route path='/inviter'>
        <Suspense fallback={<div>loading...</div>}>
          <Inviter accept_inv_img={accept_inv_img} contact={contact} />
        </Suspense>
      </Route>
    </div>
  );
}
