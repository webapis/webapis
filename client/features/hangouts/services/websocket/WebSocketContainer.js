import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import {
  useEffect,
  useState,
  useReducer,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import { useHangouts } from "../../state/useHangouts";
import useSignaling from "./useSignaling";
import * as actions from "./actions";
import { actionTypes } from "../../state/actionTypes";
import socketActionTypes from "./actionTypes";
import { useAuth } from "features/authentication/index";
import reducer, { initState } from "./reducer";
import useOnlineStatus from "components/browser-api/online-status/useOnlineStatus";
const html = htm.bind(h);
export function WebSocketContainer(props) {
  const [state, dispatch] = useReducer(reducer, initState);
  const { onlineStatus } = useOnlineStatus();
  const { state: authState } = useAuth();
  const { socket, connected } = state;
  const { children, socketUrl } = props;
  const { state: hangoutState } = useHangouts();
  const {
    dispatch: hangoutDispatch,
    searchHangouts,
    search,
    pendingHangout,
    hangout,
    fetchHangouts,
    invitingGuest,
    guestEmail,
    messageForGuest,
  } = hangoutState;
  const { browserId, authStarted, user } = authState;
  const sng = useSignaling({ socket, hangout, browserId });

  useEffect(() => {
    if (authStarted) {
      dispatch({ type: socketActionTypes.INITIAL_STATE });
    }
  }, [authStarted]);
  useEffect(() => {
    // user authenticated
    if (user && browserId && socket === null) {
      //  onSocket();
    }
    //user unauthenticated
    if (user === null && socket !== null) {
      socket.close();
      dispatch({ type: socketActionTypes.INITIAL_STATE });
    }
  }, [user, socket, browserId]);

  return html`${children}`;
}
