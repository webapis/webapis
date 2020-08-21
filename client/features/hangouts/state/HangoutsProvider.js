import {
  h,
  createContext,
} from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import {
  useContext,
  useMemo,
  useReducer,
  useEffect,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import { reducer, initState } from "./reducer";
import { useMessage } from "./useMessage";
import { useAuth } from "features/authentication/state/useAuth";
import { actionTypes } from "./actionTypes";
import { clientCommands } from "./clientCommands";
import {
  loadMessages,
  removeUnreads,
  updateRecievedMessages,
  updateRecievedMessage,
} from "./local-storage/common";
const html = htm.bind(h);
const HangoutContext = createContext();
export function useHangoutContext() {
  const context = useContext(HangoutContext);
  if (!context) {
    throw new Error("useHangoutContext must be used with HangoutsProvider");
  }

  return context;
}

export default function HangoutsProvider(props) {
  const { state: authState } = useAuth();
  const { user } = authState;
  const [state, dispatch] = useReducer(reducer, initState);
  const { hangout, message } = state;
  //TODO HG onmessage sound effect
  const handleMessage = useMessage({
    message,
    username: user && user.username,
    dispatch,
    focusedHangout: hangout,
  });

  function onRead() {
    updateRecievedMessages({
      hangout,
      name: user && user.username,
      dispatch,
      dState: "read",
    });
    dispatch({
      type: actionTypes.SENDING_HANGOUT_STARTED,
      pendingHangout: { ...hangout, command: clientCommands.READING },
    });
  }

  useEffect(() => {
    if (hangout) {
      switch (hangout.state) {
        // case "ACCEPTER":
        // case "INVITER":
        // case "DECLINER":
        // case "BLOCKER":
        case "MESSANGER":
          //case "UNBLOCKER":
          // case "READER":
          onRead();
          break;
        case "INVITEE":
          dispatch({
            type: actionTypes.MESSAGE_TEXT_CHANGED,
            text: `Let's chat, ${hangout.username}!`,
          });
          break;
        default:
          break;
      }

      // load messages from local storage
      loadMessages({ hangout, name: user && user.username, dispatch });

      removeUnreads({ dispatch, name: user && user.username });
    }
  }, [hangout]);

  // useEffect(() => {
  //   if (!username) {
  //     dispatch({ type: actionTypes.SET_HANGOUT_TO_INIT_STATE });
  //   }
  // }, [username]);
  useEffect(() => {
    const unreadhangoutKey = `${user && user.username}-unread-hangouts`;
    const unreadhangouts = JSON.parse(localStorage.getItem(unreadhangoutKey));
    if (unreadhangouts && unreadhangouts.length > 0) {
      dispatch({ type: actionTypes.UNREAD_HANGOUTS_UPDATED, unreadhangouts });
    }
    const hangoutKey = `${user && user.username}-hangouts`;
    const hangouts = JSON.parse(localStorage.getItem(hangoutKey));

    if (
      !hangouts &&
      user &&
      user.username &&
      user &&
      user.username.length > 0
    ) {
      dispatch({ type: actionTypes.FETCH_HANGOUTS_STARTED });
    }
  }, [user]);

  const value = useMemo(() => [state, dispatch], [state]);
  return html`<${HangoutContext.Provider} value=${value} ...${props} />`;
}
