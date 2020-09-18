import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import {
  lazy,
  Suspense,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/preact.combat.cdn.js";
import { useEffect } from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import { useAppRoute } from "components/app-route/index";
import { useHangouts } from "./state/useHangouts";
//import useWebRTC from "../webrtc/state/useWebRTC";
import useUnread from "./state/useUnread";
const Block = lazy(() => import("./ui-components/Block"));
const Blocked = lazy(() => import("./ui-components/Blocked"));
const Configure = lazy(() => import("./ui-components/Configure"));
const Hangchat = lazy(() => import("./ui-components/Hangchat"));
const Invite = lazy(() => import("./ui-components/Invite"));
const Invitee = lazy(() => import("./ui-components/Invitee"));
const InviterContainer = lazy(() => import("./ui-components/Inviter"));
const HangoutsContainer = lazy(() => import("./ui-components/Hangouts"));
//const Declined = lazy(() => import("./ui-components/Declined"));
const UnreadHangouts = lazy(() => import("./ui-components/UnreadHangouts"));
const VideoCall = lazy(() => import("./ui-components/VideoCall"));
const html = htm.bind(h);
export default function HangoutsFeatureRoutes(props) {
  const {
    onAppRoute,
    state: { featureRoute },
  } = useAppRoute();
  const { user } = props;
  const { state, funcs } = useHangouts({ user });
  const { hangout } = state;
  const { onUnreadSelect, onUnreadRemove, reducedUnreads } = useUnread({
    user,
    ...state,
    onAppRoute,
  });

  useEffect(() => {
    if (featureRoute) {
    }
  }, [featureRoute]);

  switch (featureRoute) {
    case "/videocall":
      return html` <${Suspense} fallback=${Loading}>
        <${VideoCall} hangout=${hangout} ...${webrtcState} ...${webrtcFuns} />
      <//>`;
    case "/bckui":
      return html` <${Suspense} fallback=${Loading}>
        <${Block} hangout=${hangout} ...${hangout} ...${funcs} />
      <//>`;
    case "/UNBLOCK":
    case "/UNDECLINE":
      return html`
        <${Suspense} fallback=${Loading}>
          <${Blocked} ...${state} ...${funcs} ...${hangout} />
        <//>
      `;
    // case "/DECLINED":
    // case "/DECLINE":
    //   return html`
    //     <${Suspense} fallback=${Loading}>
    //       <${Declined} ...${state} ...${funcs} ...${hangout} />
    //     <//>
    //   `;
    case "/configure":
      return html` <${Suspense} fallback=${Loading}>
        <${Configure} ...${state} ...${funcs} ...${hangout} />
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
    case "/INVITED":
    case "/INVITER":
    case "/HANGCHAT":
    case "/DECLINE":
    case "/DECLINED":
      return html` <${Suspense} fallback=${Loading}>
        <${Hangchat} ...${state} ...${funcs} ...${hangout} user=${user} />
      <//>`;
    case "/INVITEE":
      return html` <${Suspense} fallback=${Loading}>
        <${Invite} ...${state} ...${funcs} ...${hangout} />
      <//>`;
    // case "/INVITED":
    // case "/INVITE":
    // case "/DECLINER":
    //   return html` <${Suspense} fallback=${Loading}>
    //     <${Invitee} ...${state} ...${funcs} ...${hangout} />
    //   <//>`;
    // case "/INVITER":
    //   return html` <${Suspense} fallback=${Loading}>
    //     <${InviterContainer} state=${state} funcs=${funcs} hangout=${hangout} />
    //   <//>`;
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
        <${HangoutsContainer} state=${state} funcs=${funcs} />
      <//>`;

    default:
      return null;
  }
}

function Loading() {
  return html` <div data-testid="loading">Loading</div>`;
}
