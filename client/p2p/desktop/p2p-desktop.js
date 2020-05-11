import { h } from 'preact';
import Contacts from '../../contacts/Contacts';
import { PeerToPeerInvitationDesktop } from '../desktop/p2p-invitation-desktop';
import PeerToPeerChatDesktop from '../desktop/p2p-chat-desktop';
import {
  useP2PDesktopContext
} from './p2p-desktop-context';
export default function PeerToPeerDesktop() {
  const [state, dispatch] = useP2PDesktopContext();
  const { invitations, chats } = state;
  return (
    <div
      data-testid='p2p-desktop'
      style={{ display: 'flex', justifyContent: 'space-between' }}
    >
      <div style={{ flex: 1 }}>
        <Contacts />
      </div>
      <div
        data-testid='chat-views'
        style={{ flex: 3, display: 'flex', justifyContent: 'flex-end' }}
      >
        {chats.length > 0 &&
          chats.map((chat) => {
            debugger;
            return <PeerToPeerChatDesktop chat={chat} />;
          })}
      </div>
      <div
        data-testid='invitation-views'
        style={{ flex: 3, display: 'flex', justifyContent: 'flex-end' }}
      >
        {invitations.length > 0 &&
          invitations.map((invitation) => {
            debugger;
            return <PeerToPeerInvitationDesktop invitation={invitation} />;
          })}
      </div>
    </div>
  );
}
