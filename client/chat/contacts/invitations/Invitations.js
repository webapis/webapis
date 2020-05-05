import { h } from 'preact';
import { Position } from '../../../layout/Position';
import { useInvitationContext } from './invitation-context';
export default function Invitations({ id }) {
  const { state } = useInvitationContext();

  const { invitations } = state;

  return (
    <Position>
      <div data-testid={id}>
        {invitations &&
          invitations.length > 0 &&
          invitations.map((inv) => {
            debugger;
            return <Invitation invitation={inv} />;
          })}
      </div>
    </Position>
  );
}

export function Invitation({ invitation }) {
  return (
    <div data-testid={invitation.reciever}>
      Invitation,{invitation.reciever}
    </div>
  );
}
