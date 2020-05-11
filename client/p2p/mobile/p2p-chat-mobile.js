import { h } from 'preact';
import { Paper } from '../../layout/Paper';
export default function PeerToPeerChatMobile({ chat }) {
  return (
    <div data-testid='p2p-chat-mobile' style={{ flex: 1 }}>
      <div>Chat</div>
      {chat && chat.username}
      PeerToPeerChat.Mobile
    </div>
  );
}
