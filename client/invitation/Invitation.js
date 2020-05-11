import { h } from 'preact';

export default function Invitation() {
  return <div data-testid='chat-invitation'>,Invitation</div>;
}

export function InvitationDesktop({ invitation }) {
  return (
    <div data-testid='chat-invitation-mobile'>
      {invitation.username},Invitation
    </div>
  );
}
