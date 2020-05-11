import { h } from 'preact';

export function PeerToPeerInvitationMobile({ invitation }) {
  return (
    <div data-testid='p2p-invitation-mobile'>
      {invitation && invitation.username}, Invitation
    </div>
  );
}
