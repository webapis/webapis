import { h } from "preact";
import { useEffect, useState, useReducer } from "preact/hooks";
import htm from "htm.module";
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
