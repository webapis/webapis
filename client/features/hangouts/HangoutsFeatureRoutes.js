import { h } from "preact";
import { lazy, Suspense } from "preact/compat";
import { FeatureRoute } from "components/app-route";

import { useHangouts } from "./state/useHangouts";
const Hangouts = lazy(() => import("./ui-components/Hangout"));
const Block = lazy(() => import("./ui-components/Block"));
const Blocked = lazy(() => import("./ui-components/Blocked"));
const Configure = lazy(() => import("./ui-components/Configure"));
const Hangchat = lazy(() => import("./ui-components/Hangchat"));
const Invite = lazy(() => import("./ui-components/Invite"));
const Invitee = lazy(() => import("./ui-components/Invitee"));
const Inviter = lazy(() => import("./ui-components/Inviter"));
const UnreadHangouts = lazy(() => import("./ui-components/UnreadHangouts"));
export default function HangoutsFeatureRoutes(props) {
  const { fetchHangout } = props;
  const {
    state,
    hangout,
    hangouts,
    onHangout,
    onSelectHangout,
    onSelectUser,
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
    onRemoveUnread,
  } = useHangouts({ fetchHangout });
  const { loading } = state;
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <FeatureRoute path="/hangout">
        <Suspense fallback={<Loading />}>
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
        <Suspense fallback={<Loading />}>
          <Block hangout={hangout} onBlock={onHangout} />
        </Suspense>
      </FeatureRoute>
      <FeatureRoute paths={["/UNBLOCK", "/DECLINED"]}>
        <Suspense fallback={<Loading />}>
          <Blocked hangout={hangout} onUnblock={onHangout} />
        </Suspense>
      </FeatureRoute>
      <FeatureRoute path="/configure">
        <Suspense fallback={<Loading />}>
          <Configure hangout={hangout} onNavigation={onNavigation} />
        </Suspense>
      </FeatureRoute>
      <FeatureRoute
        paths={[
          "/ACCEPTED",
          "/ACCEPTER",
          "/MESSANGER",
          "/MESSAGED",
          "/BLOCKER",
          "/BLOCKED",
          "/UNBLOCKED",
          "/UNBLOCKER",
        ]}
      >
        <Suspense fallback={<Loading />}>
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
        <Suspense fallback={<Loading />}>
          <Invite
            loading={loading}
            hangout={hangout}
            onInvite={onHangout}
            onMessageText={onMessageText}
            messageText={messageText}
          />
        </Suspense>
      </FeatureRoute>
      <FeatureRoute paths={["/INVITED", "/DECLINER"]}>
        <Suspense fallback={<Loading />}>
          <Invitee hangout={hangout} loading={loading} />
        </Suspense>
      </FeatureRoute>
      <FeatureRoute path="/INVITER">
        <Suspense fallback={<Loading />}>
          <Inviter
            loading={loading}
            hangout={hangout}
            onAccept={onHangout}
            onDecline={onHangout}
          />
        </Suspense>
      </FeatureRoute>
      <FeatureRoute path="/UNREAD">
        <Suspense fallback={<Loading />}>
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

function Loading() {
  return <div data-testid="loading">Loading</div>;
}
