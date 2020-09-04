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
const InviterContainer = lazy(() => import("./ui-components/Inviter"));
const HangoutsContainer = lazy(() => import("./ui-components/Hangouts"));
const Declined = lazy(() => import("./ui-components/Declined"));
const UnreadHangouts = lazy(() => import("./ui-components/UnreadHangouts"));
const html = htm.bind(h);
export default function HangoutsFeatureRoutes(props) {
  const { onAppRoute, routeState } = useAppRoute();
  const { featureRoute } = routeState;
  const { state, funcs } = useHangouts();
  const { hangout } = state;
  const { onUnreadSelect, onUnreadRemove, reducedUnreads } = useUnread({
    ...state,
    onAppRoute,
  });

  switch (featureRoute) {
    case "/bckui":
      return html` <${Suspense} fallback=${Loading}>
        <div class="fixed-bottom">
          <${Block} hangout=${hangout} ...${hangout} ...${funcs} />
        </div>
      <//>`;
    case "/UNBLOCK":
      return html`
        <${Suspense} fallback=${Loading}>
          <div class="fixed-bottom">
            <${Blocked} ...${state} ...${funcs} ...${hangout} />
          </div>
        <//>
      `;
    case "/DECLINED":
    case "/DECLINE":
      return html`
        <${Suspense} fallback=${Loading}>
          <div class="fixed-bottom">
            <${Declined} ...${state} ...${funcs} ...${hangout} />
          </div>
        <//>
      `;
    case "/configure":
      return html` <${Suspense} fallback=${Loading}>
        <div class="fixed-bottom">
          <${Configure} ...${state} ...${funcs} ...${hangout} />
        </div>
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
        <div class="fixed-bottom">
          <${Hangchat} ...${state} ...${funcs} ...${hangout} />
        </div>
      <//>`;
    case "/INVITEE":
      return html` <${Suspense} fallback=${Loading}>
        <div class="fixed-bottom">
          <${Invite} ...${state} ...${funcs} ...${hangout} />
        </div>
      <//>`;
    case "/INVITED":
    case "/INVITE":
    case "/DECLINER":
      return html` <${Suspense} fallback=${Loading}>
        <div class="fixed-bottom">
          <${Invitee} ...${state} ...${funcs} ...${hangout} />
        </div>
      <//>`;
    case "/INVITER":
      return html` <${Suspense} fallback=${Loading}>
        <div class="fixed-bottom">
          <${InviterContainer}
            state=${state}
            funcs=${funcs}
            hangout=${hangout}
          />
        </div>
      <//>`;
    case "/unread":
      return html` <${Suspense} fallback=${Loading}>
        <div class="fixed-bottom">
          <${UnreadHangouts}
            unreadhangouts=${reducedUnreads}
            onUnreadSelect=${onUnreadSelect}
            onUnreadRemove=${onUnreadRemove}
          />
        </div>
      <//>`;

    case "/hangout":
      return html` <${Suspense} fallback=${Loading}>
        <div class="fixed-bottom">
          <${HangoutsContainer} state=${state} funcs=${funcs} />
        </div>
      <//>`;

    default:
      return null;
  }
}

function Loading() {
  return html` <div data-testid="loading">Loading</div>`;
}
