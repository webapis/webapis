import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { lazy, Suspense } from 'preact/compat';
import { FeatureRoute } from '../app-route/AppRouteProvider';

import { useHangouts } from './state/useHangouts';
const Hangouts = lazy(() => import('./Hangout'));
const Block = lazy(() => import('./state-ui/Block'));
const Blocked = lazy(() => import('./state-ui/Blocked'));
const Configure = lazy(() => import('./state-ui/Configure'));
const Hangchat = lazy(() => import('./state-ui/Hangchat'));
const Invite = lazy(() => import('./state-ui/Invite'));
const Invitee = lazy(() => import('./state-ui/Invitee'));
const Inviter = lazy(() => import('./state-ui/Inviter'));
const UnreadHangouts = lazy(() => import('./UnreadHangouts'));
export default function Mobile() {
  const {
    hangout,
    hangouts,
    onHangout,
    onSelectHangout,
    onSelectUser,
    onSearch,
    users,
    search,
    onStartSearch,
    onMessageText,
    messageText,
    username,
    messages,
    dispatch,
    unreadhangouts,
    onNavigation,
    onSelectUnread,
  } = useHangouts();

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <FeatureRoute path="/hangouts">
        <Suspense fallback={<div>Loading...</div>}>
          <Hangouts
            dispatch={dispatch}
            username={username}
            search={search}
            hangouts={hangouts}
            onSelectHangout={onSelectHangout}
            onSelectUser={onSelectUser}
            onSearch={onSearch}
            onStartSearch={onStartSearch}
          />
        </Suspense>
      </FeatureRoute>
      <FeatureRoute path="/bckui">
        <Suspense fallback={<div>Loading...</div>}>
          <Block hangout={hangout} onBlock={onHangout} />
        </Suspense>
      </FeatureRoute>
      <FeatureRoute paths={['/UNBLOCK', '/DECLINED']}>
        <Suspense fallback={<div>Loading...</div>}>
          <Blocked hangout={hangout} onUnblock={onHangout} />
        </Suspense>
      </FeatureRoute>
      <FeatureRoute path="/configure">
        <Suspense fallback={<div>Loading...</div>}>
          <Configure hangout={hangout} onNavigation={onNavigation} />
        </Suspense>
      </FeatureRoute>
      <FeatureRoute
        paths={['/ACCEPTED', '/ACCEPTER', '/MESSANGER', '/MESSAGED','/BLOCKER','/BLOCKED','/UNBLOCKED','/UNBLOCKER']}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <Hangchat
          onNavigation={onNavigation}
            hangout={hangout}
            onMessageText={onMessageText}
            onMessage={onHangout}
            messages={messages}
            username={username}
            messageText={messageText}
          />
        </Suspense>
      </FeatureRoute>

      <FeatureRoute path="/INVITE">
        <Suspense fallback={<div>Loading...</div>}>
          <Invite
            hangout={hangout}
            onInvite={onHangout}
            onMessageText={onMessageText}
            messageText={messageText}
          />
        </Suspense>
      </FeatureRoute>
      <FeatureRoute paths={['/INVITED', '/DECLINER']}>
        <Suspense fallback={<div>Loading...</div>}>
          <Invitee hangout={hangout} />
        </Suspense>
      </FeatureRoute>
      <FeatureRoute path="/INVITER">
        <Suspense fallback={<div>Loading...</div>}>
          <Inviter
            hangout={hangout}
            onAccept={onHangout}
            onDecline={onHangout}
          />
        </Suspense>
      </FeatureRoute>
      <FeatureRoute path="/UNREAD">
        <Suspense fallback={<div>Loading...</div>}>
          <UnreadHangouts
            unreadhangouts={unreadhangouts}
            onSelectUnread={onSelectUnread}
          />
        </Suspense>
      </FeatureRoute>
    </div>
  );
}
