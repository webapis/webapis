import { h } from 'preact';
import { Accept } from '../client/chat/Accept';
import { Block } from '../client/chat/Block';
import { Blocked } from '../client/chat/Blocked';
import { Chat } from '../client/chat/Chat';
import { Configure } from '../client/chat/Configure';
import { Invite } from '../client/chat/Invite';
import { Invitee } from '../client/chat/Invitee';
import { Inviter } from '../client/chat/Inviter';
export default {
  title: 'ChatStateView',
};
//inviter
export const AcceptInvitation = () => <Accept />;

AcceptInvitation.story = {
  name: 'Accept',
};

export const BlockInvitation = () => <Block />;

BlockInvitation.story = {
  name: 'Block',
};

export const BlockedInvitation = () => <Blocked />;

BlockedInvitation.story = {
  name: 'Blocked',
};

export const ChatView = () => <Chat />;

ChatView.story = {
  name: 'Chat',
};

export const ConfigureView = () => <Configure />;

ConfigureView.story = {
  name: 'Configure',
};

export const InviteView = () => <Invite />;

InviteView.story = {
  name: 'Invite',
};

export const InviteeView = () => <Invitee />;

InviteeView.story = {
  name: 'Invitee',
};

export const InviterView = () => <Inviter />;

InviterView.story = {
  name: 'Inviter',
};
