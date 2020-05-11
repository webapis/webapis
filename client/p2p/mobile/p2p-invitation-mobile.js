import { h } from 'preact';
import Invitation from '../../invitation/Invitation';
export function PeerToPeerInvitationMobile({ invitation }) {
  return (
    <div data-testid='p2p-invitation-mobile'>
      <Invitation invitation={invitation} />
    </div>
  );
}
