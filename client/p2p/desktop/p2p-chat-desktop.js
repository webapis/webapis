import { h } from 'preact';

export default function PeerToPeerChatDesktop({ chat }) {
  return (
    <div data-testid='p2p-chat-desktop' style={{ flex: 1 }}>
      <div>Chat</div>
      {chat && chat.username}
      PeerToPeerChat Desktop
    </div>
  );
}
