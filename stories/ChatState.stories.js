import { h } from 'preact';

export default {
  title: 'ChatState',
};

//inviter
export const PendingInvitee = () => <div>Pending</div>;

PendingInvitee.story = {
  name: 'INVITEE',
};

//invitee
export const Invited = () => <div>Invited</div>;

Invited.story = {
  name: 'INVITED',
};

export const Accepted = () => <div>Accepted</div>;

Accepted.story = {
  name: 'ACCEPTED',
};

export const BlockedInvitee = () => <div>BlockedInvitee</div>;

BlockedInvitee.story = {
  name: 'BLOCKED_INVITEE',
};
export const BlockedInviter = () => <div>BlockedInviter</div>;

BlockedInviter.story = {
  name: 'BLOCKED_INVITER',
};

export const DeclinedInviter = () => <div>DeclinedInviter</div>;

DeclinedInviter.story = {
  name: 'DECLINED_INVITER',
};
export const DeclinedInvitee = () => <div>DeclinedInvitee</div>;

DeclinedInvitee.story = {
  name: 'DECLINED_INVITEE',
};

export const NotDefined = () => <div>UNDEFIEND</div>;

NotDefined.story = {
  name: 'UNDEFINED',
};
