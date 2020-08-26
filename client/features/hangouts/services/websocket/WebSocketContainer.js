import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import {
  useEffect,
  useState,
  useReducer,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import { useHangouts } from "../../state/useHangouts";
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
  const { dispatch: hangoutDispatch, state: hangoutState } = useHangouts();
  const {
    searchHangouts,
    search,
    pendingHangout,
    fetchHangouts,
    invitingGuest,
    guestEmail,
  } = hangoutState;
  const { browserId, authStarted, user } = authState;

  function onSocket() {
    const sock = new WebSocket(
      `${socketUrl}/hangouts/?username=${
        user && user.username
      }&browserId=${browserId}`
    );
    dispatch({ type: socketActionTypes.SOCKET_INITIALIZED, socket: sock });
  }
  useEffect(() => {
    if (authStarted) {
      dispatch({ type: socketActionTypes.INITIAL_STATE });
    }
  }, [authStarted]);
  useEffect(() => {
    // user authenticated
    if (user && browserId && socket === null) {
      onSocket();
    }
    //user unauthenticated
    if (user === null && socket !== null) {
      socket.close();
      dispatch({ type: socketActionTypes.INITIAL_STATE });
    }
  }, [user, socket, browserId]);

  useEffect(() => {
    if (socket && user) {
      socket.onmessage = (serverMessage) => {
        const msg = JSON.parse(serverMessage.data);
        hangoutDispatch({
          type: actionTypes.SERVER_MESSAGE_RECIEVED,
          message: msg,
        });
      };
      socket.onopen = () => {
        dispatch({
          type: socketActionTypes.SOCKET_CONNECTION_CHANGED,
          connected: true,
        });
        hangoutDispatch({
          type: actionTypes.SOCKET_CONNECTION_STATE_CHANGED,
          connected: true,
        });
      };
      socket.onclose = () => {
        dispatch({
          type: socketActionTypes.SOCKET_CONNECTION_CHANGED,
          connected: false,
        });
        hangoutDispatch({
          type: actionTypes.SOCKET_CONNECTION_STATE_CHANGED,
          connected: false,
        });
      };
      socket.onerror = (error) => {
        const err = error.message;
        //
        hangoutDispatch({ type: actionTypes.SOCKET_ERROR, error });
      };
    }
  }, [socket, user]);

  useEffect(() => {
    if (searchHangouts) {
      //2.

      actions.searchHangouts({
        dispatch: hangoutDispatch,
        search,
        username: user && user.username,
      });
    }
  }, [searchHangouts]);

  useEffect(() => {
    if (pendingHangout && socket && socket.readyState === 1) {
      sendPendingHangout();
    }
  }, [pendingHangout, socket]);

  useEffect(() => {
    if (fetchHangouts && user && user.username) {
      actions.findHangouts({
        dispatch: hangoutDispatch,
        username: user.username,
      });
    }
  }, [fetchHangouts, user]);

  useEffect(() => {
    if (invitingGuest && user) {
      debugger;
      actions.InviteAsGuest({ guestEmail, dispatch: hangoutDispatch });
    }
  }, [invitingGuest, user]);
  function sendPendingHangout() {
    socket.send(JSON.stringify({ ...pendingHangout, browserId }));
  }
  return html`${children}`;
}
