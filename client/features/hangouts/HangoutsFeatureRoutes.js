import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import {
  lazy,
  Suspense,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/preact.combat.cdn.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import { useAppRoute } from "components/app-route/index";
import { useHangouts } from "./state/useHangouts";
import useUnread from "./state/useUnread";
const Block = lazy(() => import("./ui-components/Block"));
const Blocked = lazy(() => import("./ui-components/Blocked"));
const Configure = lazy(() => import("./ui-components/Configure"));
const Hangchat = lazy(() => import("./ui-components/Hangchat"));
const Invite = lazy(() => import("./ui-components/Invite"));
const Invitee = lazy(() => import("./ui-components/Invitee"));
const Inviter = lazy(() => import("./ui-components/Inviter"));
const Search = lazy(() => import("./ui-components/Search"));
const Hangouts = lazy(() => import("./ui-components/Hangouts"));
const Declined = lazy(() => import("./ui-components/Declined"));
const UnreadHangouts = lazy(() => import("./ui-components/UnreadHangouts"));
const html = htm.bind(h);
export default function HangoutsFeatureRoutes(props) {
  const { onAppRoute, routeState } = useAppRoute();
  const { featureRoute } = routeState;
  const {
    state,
    hangouts,
    hangout,
    onUserClientCommand,
    onMessageText,
    messageText,
    username,
    messages,
    dispatch,
    onNavigation,
    emptyHangout,
    onSearchInput,
    onSearch,
    onInviteGuest,
    onMessageFoGuestInput,
    onGuestEmailChange,
    onSendInviteGuest,
    onGuestEmailInputFocus,
    onSearchSelect,
  } = useHangouts();

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
        <${Block} hangout=${hangout} onBlock=${onUserClientCommand} />
      <//>`;
    case "/UNBLOCK":
      return html`
        <${Suspense} fallback=${Loading}>
          <${Blocked}
            hangout=${hangout}
            onUnblock=${onUserClientCommand}
            username=${username}
          />
        <//>
      `;
    case "/DECLINED":
    case "/DECLINE":
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
    case "/ACCEPT":
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
          onMessage=${onUserClientCommand}
          messages=${messages}
          username=${username}
          messageText=${messageText}
          dispatch=${dispatch}
          emptyHangout=${emptyHangout}
        />
      <//>`;
    case "/INVITEE":
      return html` <${Suspense} fallback=${Loading}>
        <${Invite}
          loading=${loading}
          hangout=${hangout}
          onInvite=${onUserClientCommand}
          onMessageText=${onMessageText}
          messageText=${messageText}
        />
      <//>`;
    case "/INVITED":
    case "/INVITE":
    case "/DECLINER":
      return html` <${Suspense} fallback=${Loading}>
        <${Invitee} hangout=${hangout} loading=${loading} />
      <//>`;
    case "/INVITER":
      return html` <${Suspense} fallback=${Loading}>
        <${Inviter}
          state=${state}
          hangout=${hangout}
          onAccept=${onUserClientCommand}
          onDecline=${onUserClientCommand}
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

    case "/hangout":
      return html` <${Suspense} fallback=${Loading}>
        <${Hangouts}
          onGuestEmailChange=${onGuestEmailChange}
          onSendInviteGuest=${onSendInviteGuest}
          onMessageFoGuestInput=${onMessageFoGuestInput}
          onInviteGuest=${onInviteGuest}
          onSearchInput=${onSearchInput}
          onSearch=${onSearch}
          dispatch=${dispatch}
          onGuestEmailInputFocus=${onGuestEmailInputFocus}
          onSearchSelect=${onSearchSelect}
          ...${state}
          onAppRoute=${onAppRoute}
        />
      <//>`;

    default:
      return null;
  }
}

function Loading() {
  return html` <div data-testid="loading">Loading</div>`;
}
