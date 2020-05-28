import { h } from 'preact';
import { ListItem } from '../layout/NavList';
import { Avatar } from '../layout/Avatar';
import { AccountCircle } from '../layout/icons/AccountCircle';
import { Block } from '../layout/icons/Block';
export function HangoutsState({ contact, onClick }) {
  return (
    <ListItem onClick={onClick}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          position: 'relative',
        }}
      >
        <Avatar style={{ minWidth: 60 }}>
          {contact.state === 'blocked' ? (
            <Block color='red' height='40' />
          ) : (
            <AccountCircle height='40' />
          )}
        </Avatar>
        <div style={{ flex: 10 }}>
          <div>{contact.username}</div>
          {contact.state === 'invitee' && (
            <div style={{ color: '#737373' }}>Pending invitation</div>
          )}
          {contact.state === 'inviter' && (
            <div style={{ color: '#737373' }}>Invited you</div>
          )}
          {contact.state === 'chat' && (
            <div style={{ color: '#737373', display: 'flex' }}>
              <div>You:{contact.lastMessage.text}</div>
              <div>{contact.lastMessage.datetime}</div>
            </div>
          )}
          {contact.state === 'blocked' && (
            <div style={{ color: '#737373' }}>
              <div>{contact.email}</div>
            </div>
          )}

          {contact.state === 'blocker' && (
            <div style={{ color: '#737373', display: 'flex' }}>
              <div>You:{contact.lastMessage.text}</div>
              <div>{contact.lastMessage.datetime}</div>
            </div>
          )}

          {contact.state === 'declined' && (
            <div style={{ color: '#737373' }}>
              <div>{contact.email}</div>
              <div>Declined</div>
            </div>
          )}
          {contact.state === 'decliner' && (
            <div style={{ color: '#737373' }}>
              <div style={{ color: '#737373' }}>Pending invitation</div>
            </div>
          )}
          {contact.state === null && (
            <div style={{ color: '#737373', display: 'flex' }}>
              <div>{contact.email}</div>
              <a href=''>Invite</a>
            </div>
          )}
        </div>
      </div>
    </ListItem>
  );
}
