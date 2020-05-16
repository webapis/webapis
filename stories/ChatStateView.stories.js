import { h } from 'preact';
import { Inviter } from '../client/chat/Inviter';
import { Block } from '../client/chat/Block';
import { Blocked } from '../client/chat/Blocked';
import { Chat } from '../client/chat/Chat';
import { Configure } from '../client/chat/Configure';
import { Invite } from '../client/chat/Invite';
import { Invitee } from '../client/chat/Invitee';
import accept_inv_img from '../client/app-context/img/accept_invitation.png';
import messages from './fake-data/messages';
export default {
  title: 'ChatStateView',
};
//inviter
export const AcceptInvitation = () => (
  <div style={{ height: '80vh' }}>
    <Inviter
      accept_inv_img={accept_inv_img}
      username={'dragos'}
      message={{ text: "Let's chat on Webcom!", datetime: 'Now' }}
    />
  </div>
);

AcceptInvitation.story = {
  name: 'Inviter',
};

export const BlockInvitation = () => (
  <div style={{ height: '80vh' }}>
    <Block username='dragos' />
  </div>
);

BlockInvitation.story = {
  name: 'Block',
};

export const BlockedInvitation = () => (
  <div style={{ height: '80vh' }}>
    <Blocked username='dragos' />
  </div>
);

BlockedInvitation.story = {
  name: 'Blocked',
};

export const ChatView = () => (
  <div style={{ height: '80vh' }}>
    <Chat messages={messages} />
  </div>
);

ChatView.story = {
  name: 'Chat',
};

export const ConfigureView = () => (
  <div style={{ height: '80vh' }}>
    <Configure />
  </div>
);

ConfigureView.story = {
  name: 'Configure',
};

export const InviteView = () => (
  <div style={{ height: '80vh' }}>
    <Invite email={'deros@gmail.com'} />
  </div>
);

InviteView.story = {
  name: 'Invite',
};

export const InviteeView = () => (
  <div style={{ height: '80vh' }}>
    <Invitee email={'dragos@gmail.com'} />
  </div>
);

InviteeView.story = {
  name: 'Invitee',
};
