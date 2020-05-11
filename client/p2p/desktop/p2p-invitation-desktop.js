import { h } from 'preact';

export function PeerToPeerInvitationDesktop({ invitation }) {
  return (
    <div data-testid='p2p-invitation-desktop'>
      {invitation && invitation.username}, Invitation desktop
    </div>
  );
}
