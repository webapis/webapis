/** @jsx h */
import { h } from 'preact';
import { ContactState } from '../client/contacts/ContactState';
export default {
  title: 'Contacts',
};

const inviteeContact = { username: 'dragos', state: 'invitee' };
export const PendingInviter = () => <ContactState contact={inviteeContact} />;
//inviter
PendingInviter.story = {
  name: 'INVITEE',
};

const inviterContact = { username: 'dragos', state: 'inviter' };
export const Inviter = () => <ContactState contact={inviterContact} />;

//invitee
Inviter.story = {
  name: 'INVITER',
};
const acceptedContact = {
  username: 'dragos',
  state: 'accepted',
  lastMessage: { text: 'hello', datetime: 'Now' },
};
export const Accepted = () => <ContactState contact={acceptedContact} />;

Accepted.story = {
  name: 'ACCEPTED',
};

const blockedContact = {
  username: 'dragos',
  email: 'dragons@gmail.com',
  state: 'blocked',
  lastMessage: { text: 'hello', datetime: 'Now' },
};

export const Blocked = () => <ContactState contact={blockedContact} />;

Blocked.story = {
  name: 'BLOCKED',
};
const blockerContact = {
  username: 'dragos',
  email: 'dragons@gmail.com',
  state: 'blocker',
  lastMessage: { text: 'hello', datetime: 'Now' },
};
export const Blocker = () => <ContactState contact={blockerContact} />;
Blocker.story = {
  name: 'BLOCKER',
};

const declinedContact = {
  username: 'dragos',
  email: 'dragons@gmail.com',
  state: 'declined',
};

export const Declined = () => <ContactState contact={declinedContact} />;

Declined.story = {
  name: 'DECLINED',
};
const declinerContact = {
  username: 'dragos',
  email: 'dragons@gmail.com',
  state: 'decliner',
};
export const Decliner = () => <ContactState contact={declinerContact} />;

Decliner.story = {
  name: 'DECLINER',
};
const nullContact = {
  username: 'dragos',
  email: 'dragons@gmail.com',
  state: null,
};
export const NotDefined = () => <ContactState contact={nullContact} />;

NotDefined.story = {
  name: 'UNDEFINED',
};
//Contact state ACCEPTED,PENDING,BLOCKED,DECLINED,UNDEFINED
