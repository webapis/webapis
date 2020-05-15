/** @jsx h */
import { h } from 'preact';

export default {
  title: 'Contacts',
};

export const PendingInviter = () => <div>PendingInviter</div>;

PendingInviter.story = {
  name: 'PENDING_INVITER',
};
export const PendingInvitee = () => <div>PendingInvitee</div>;

PendingInvitee.story = {
  name: 'PENDING_INVITEE',
};

export const Accepted = () => <div>Accepted</div>;

Accepted.story = {
  name: 'ACCEPTED',
};

export const BlockedInviter = () => <div>BlockedInviter</div>;

BlockedInviter.story = {
  name: 'BLOCKED_INVITER',
};

export const BlockedInvitee = () => <div>BlockedInvitee</div>;

BlockedInvitee.story = {
  name: 'BLOCKED_INVITEE',
};

export const DeclinedInvitee = () => <div>DeclinedInvitee</div>;

DeclinedInvitee.story = {
  name: 'DECLINED_INVITEE',
};

export const DeclinedInviter = () => <div>DeclinedInviter</div>;

DeclinedInviter.story = {
  name: 'DECLINED_INVITER',
};

export const NotDefined = () => <div>UNDEFIEND</div>;

NotDefined.story = {
  name: 'UNDEFINED',
};
//Contact state ACCEPTED,PENDING,BLOCKED,DECLINED,UNDEFINED
