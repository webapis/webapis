import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import {
  lazy,
  Suspense,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/preact.combat.cdn.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import { FeatureRoute, useAppRoute } from "components/app-route/index";
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
const Declined = lazy(() => import("./ui-components/Declined"));
const UnreadHangouts = lazy(() => import("./ui-components/UnreadHangouts"));
const html = htm.bind(h);
export default function HangoutsFeatureRoutes(props) {
  const { onAppRoute, routeState } = useAppRoute();
  const { featureRoute } = routeState;
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
  const {
    unreadhangouts,
    onUnreadSelect,
    onUnreadRemove,
    reducedUnreads,
  } = useUnread({
    state,
    dispatch,
    onAppRoute,
    username,
  });
  const { loading } = state;
  switch (featureRoute) {
    case "/bckui":
      return html` <${Suspense} fallback=${Loading}>
        <${Block} hangout=${hangout} onBlock=${onBlock} />
      <//>`;
    case "/UNBLOCK":
      return html`
        <${Suspense} fallback=${Loading}>
          <${Blocked} hangout=${hangout} onUnblock=${onUnblock} />
        <//>
      `;
    case "/DECLINED":
      return html`
        <${Suspense} fallback=${Loading}>
          <${Declined} hangout=${hangout} />
        <//>
      `;
    case "/configure":
      return html` <${Suspense} fallback=${Loading}>
        <${Configure} hangout=${hangout} onNavigation=${onNavigation} />
      <//>`;
    case "/ACCEPTED":
    case "/ACCEPTER":
    case "/MESSANGER":
    case "/MESSAGED":
    case "/BLOCKER":
    case "/BLOCKED":
    case "/UNBLOCKED":
    case "/UNBLOCKER":
    case "/READ":
    case "/READER":
      return html` <${Suspense} fallback=${Loading}>
        <${Hangchat}
          loading=${loading}
          onNavigation=${onNavigation}
          hangout=${hangout}
          onMessageText=${onMessageText}
          onMessage=${onMessage}
          messages=${messages}
          username=${username}
          messageText=${messageText}
          dispatch=${dispatch}
        />
      <//>`;
    case "/INVITE":
      return html` <${Suspense} fallback=${Loading}>
        <${Invite}
          loading=${loading}
          hangout=${hangout}
          onInvite=${onInvite}
          onMessageText=${onMessageText}
          messageText=${messageText}
        />
      <//>`;
    case "/INVITED":
    case "/DECLINER":
      return html` <${Suspense} fallback=${Loading}>
        <${Invitee} hangout=${hangout} loading=${loading} />
      <//>`;
    case "/INVITER":
      return html` <${Suspense} fallback=${Loading}>
        <${Inviter}
          state=${state}
          hangout=${hangout}
          onAccept=${onAccept}
          onDecline=${onDecline}
        />
      <//>`;
    case "/unread":
      return html` <${Suspense} fallback=${Loading}>
        <${UnreadHangouts}
          unreadhangouts=${reducedUnreads}
          onUnreadSelect=${onUnreadSelect}
          onUnreadRemove=${onUnreadRemove}
        />
      <//>`;

    case "/search":
      return html` <${Suspense} fallback=${Loading}>
        <${Search}
          onSearchSelect=${onSearchSelect}
          searchResult=${searchResult}
          onSearch=${onSearch}
          onSearchInput=${onSearchInput}
          search=${search}
        />
      <//>`;
    case "/filter":
      return html` <${Suspense} fallback=${Loading}>
        <${Filter}
          onLoadHangout=${onLoadHangout}
          onNavigation=${onNavigation}
          filter=${filter}
          onFilterInput=${onFilterInput}
          filterResult=${filterResult}
          onFilterSelect=${onFilterSelect}
        />
      <//>`;
    default:
      return null;
  }
}

function Loading() {
  return html` <div data-testid="loading">Loading</div>`;
}
