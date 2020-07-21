import {
  h,
  createContext,
} from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import {
  useContext,
  useMemo,
  useReducer,
  useEffect,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis@cbdf6161bd8ca09a385d62c8c697bd1cd87bb184/hooks.cdn.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import { reducer, initState } from "./reducer";
import { useMessage } from "./useMessage";
import { useUserName } from "features/authentication/state/useUserName";
import { actionTypes } from "./actionTypes";
import { clientCommands } from "./clientCommands";
import { loadMessages } from "./local-storage/common";
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
  const { username, token } = useUserName();

  const [state, dispatch] = useReducer(reducer, initState);
  const { hangout, message } = state;
  const handleMessage = useMessage({
    message,
    username,
    dispatch,
    focusedHangout: hangout,
  });

  useEffect(() => {
    if (hangout) {
      switch (hangout.state) {
        case "ACCEPTER":
        case "DECLINER":
        case "BLOCKER":
        case "MESSANGER":
        case "UNBLOCKER":
          dispatch({
            type: actionTypes.SENDING_HANGOUT_STARTED,
            pendingHangout: { ...hangout, command: clientCommands.READ },
          });
          break;
        case "INVITE":
          dispatch({
            type: actionTypes.MESSAGE_TEXT_CHANGED,
            text: `Let's chat, ${hangout.username}!`,
          });
          break;
        default:
          break;
      }

      // load messages from local storage
      loadMessages({ hangout, name: username, dispatch });
    }
  }, [hangout]);

  useEffect(() => {
    if (!username) {
      dispatch({ type: actionTypes.SET_HANGOUT_TO_INIT_STATE });
    }
  }, [username]);
  useEffect(() => {
    const unreadhangoutKey = `${username}-unread-hangouts`;
    const unreadhangouts = JSON.parse(localStorage.getItem(unreadhangoutKey));
    if (unreadhangouts && unreadhangouts.length > 0) {
      dispatch({ type: actionTypes.UNREAD_HANGOUTS_UPDATED, unreadhangouts });
    }
    const hangoutKey = `${username}-hangouts`;
    const hangouts = JSON.parse(localStorage.getItem(hangoutKey));

    if (!hangouts) {
      dispatch({ type: actionTypes.FETCH_HANGOUTS_STARTED });
    }
  }, []);

  const value = useMemo(() => [state, dispatch], [state]);
  return html`<${HangoutContext.Provider} value=${value} ...${props} />`;
}
