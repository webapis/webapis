import { h } from "preact";
import { lazy, Suspense } from "preact/compat";
import { FeatureRoute, useAppRoute } from "components/app-route";

import { useHangouts } from "./state/useHangouts";
import useSearch from "./state/useSearch";
import useFilter from "./state/useFilter";
import useUnread from "./state/useUnread";
const Block = lazy(() => import("./ui-components/Block"));
const Blocked = lazy(() => import("./ui-components/Blocked"));
const Configure = lazy(() => import("./ui-components/Configure"));
const Hangchat = lazy(() => import("./ui-components/Hangchat"));
const Invite = lazy(() => import("./ui-components/Invite"));
const Invitee = lazy(() => import("./ui-components/Invitee"));
const Inviter = lazy(() => import("./ui-components/Inviter"));
const Search = lazy(() => import("./ui-components/Search"));
const Filter = lazy(() => import("./ui-components/Filter"));
const UnreadHangouts = lazy(() => import("./ui-components/UnreadHangouts"));
export default function HangoutsFeatureRoutes(props) {
  const { onAppRoute } = useAppRoute();
  const {
    state,
    hangout,
    onInvite,
    onAccept,
    onDecline,
    onBlock,
    onUnblock,
    onMessage,
    onMessageText,
    messageText,
    username,
    messages,
    dispatch,
    onNavigation,
  } = useHangouts();
  const {
    search,
    onSearchInput,
    searchResult,
    onSearch,
    onSearchSelect,
  } = useSearch({ state, dispatch, onAppRoute });
  const {
    filter,
    filterResult,
    onFilterSelect,
    onFilterInput,
    onLoadHangout,
  } = useFilter({
    dispatch,
    state,
    onAppRoute,
    username,
  });
  const { unreadhangouts, onUnreadSelect, onUnreadRemove } = useUnread({
    state,
    dispatch,
    onAppRoute,
  });
  const { loading } = state;
  return [
    <FeatureRoute path="/bckui">
      <Suspense fallback={<Loading />}>
        <Block hangout={hangout} onBlock={onBlock} />
      </Suspense>
    </FeatureRoute>,
    <FeatureRoute paths={["/UNBLOCK", "/DECLINED"]}>
      <Suspense fallback={<Loading />}>
        <Blocked hangout={hangout} onUnblock={onUnblock} />
      </Suspense>
    </FeatureRoute>,
    <FeatureRoute path="/configure">
      <Suspense fallback={<Loading />}>
        <Configure hangout={hangout} onNavigation={onNavigation} />
      </Suspense>
    </FeatureRoute>,
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
          onMessage={onMessage}
          messages={messages}
          username={username}
          messageText={messageText}
          dispatch={dispatch}
        />
      </Suspense>
    </FeatureRoute>,

    <FeatureRoute path="/INVITE">
      <Suspense fallback={<Loading />}>
        <Invite
          loading={loading}
          hangout={hangout}
          onInvite={onInvite}
          onMessageText={onMessageText}
          messageText={messageText}
        />
      </Suspense>
    </FeatureRoute>,
    <FeatureRoute paths={["/INVITED", "/DECLINER"]}>
      <Suspense fallback={<Loading />}>
        <Invitee hangout={hangout} loading={loading} />
      </Suspense>
    </FeatureRoute>,
    <FeatureRoute path="/INVITER">
      <Suspense fallback={<Loading />}>
        <Inviter
          loading={loading}
          hangout={hangout}
          onAccept={onAccept}
          onDecline={onDecline}
        />
      </Suspense>
    </FeatureRoute>,
    <FeatureRoute path="/unread">
      <Suspense fallback={<Loading />}>
        <UnreadHangouts
          unreadhangouts={unreadhangouts}
          onUnreadSelect={onUnreadSelect}
          onUnreadRemove={onUnreadRemove}
        />
      </Suspense>
    </FeatureRoute>,
    <FeatureRoute path="/search">
      <Suspense fallback={<Loading />}>
        <Search
          onSearchSelect={onSearchSelect}
          searchResult={searchResult}
          onSearch={onSearch}
          onSearchInput={onSearchInput}
          search={search}
        />
      </Suspense>
    </FeatureRoute>,
    <FeatureRoute path="/filter">
      <Suspense fallback={<Loading />}>
        <Filter
          onLoadHangout={onLoadHangout}
          onNavigation={onNavigation}
          filter={filter}
          onFilterInput={onFilterInput}
          filterResult={filterResult}
          onFilterSelect={onFilterSelect}
        />
      </Suspense>
    </FeatureRoute>,
  ];
}

function Loading() {
  return <div data-testid="loading">Loading</div>;
}
