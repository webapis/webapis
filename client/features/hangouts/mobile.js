import { h } from 'preact';
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
export default function Mobile(props) {
  const {fetchHangout}=props
  const {
    state,
    hangout,
    hangouts,
    onHangout,
    onSelectHangout,
    onSelectUser,
    onSearch,

    search,
    onSearchInput,
    onFetchHangouts,
    onMessageText,
    messageText,
    username,
    messages,
    dispatch,
    unreadhangouts,
    onNavigation,
    onSelectUnread,
    onRemoveUnread
  } = useHangouts({fetchHangout});
const {loading}=state
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
            onSearchInput={onSearchInput}
            onFetchHangouts={onFetchHangouts}
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
          loading={loading}
          onNavigation={onNavigation}
            hangout={hangout}
            onMessageText={onMessageText}
            onMessage={onHangout}
            messages={messages}
            username={username}
            messageText={messageText}
            dispatch={dispatch}
          />
        </Suspense>
      </FeatureRoute>

      <FeatureRoute path="/INVITE">
        <Suspense fallback={<div>Loading...</div>}>
          <Invite
          loading={loading}
            hangout={hangout}
            onInvite={onHangout}
            onMessageText={onMessageText}
            messageText={messageText}
          />
        </Suspense>
      </FeatureRoute>
      <FeatureRoute paths={['/INVITED', '/DECLINER']}>
        <Suspense fallback={<div>Loading...</div>}>
          <Invitee hangout={hangout} loading={loading}/>
        </Suspense>
      </FeatureRoute>
      <FeatureRoute path="/INVITER">
        <Suspense fallback={<div>Loading...</div>}>
          <Inviter
          loading={loading}
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
            onRemoveUnread={onRemoveUnread}
          />
        </Suspense>
      </FeatureRoute>
    </div>
  );
}
