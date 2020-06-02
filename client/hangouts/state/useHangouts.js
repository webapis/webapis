import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { useHangoutContext } from './HangoutsProvider';
import { useAuthContext } from '../../auth/auth-context';
import {
  selectHangout,
  searchHangouts,
  filterHangouts,
  fetchHangout,
  selectUser,
  changeMessageText,
} from './actions';
import { actionTypes } from './actionTypes';
import { messageToServer, messageCategories } from './messageTypes';

export function useHangouts() {
  const authContext = useAuthContext();
  const { username } = authContext.state;
  const [state, dispatch] = useHangoutContext();

  const { hangout, hangouts, socket, search, users, messageText } = state;

  function onSelectHangout(e) {
    const username = e.target.id;
    debugger;
    selectHangout({ dispatch, username });
  }
  function onSelectUser(e) {
    const uname = e.target.id;
    const user = users.find((u) => u.username === uname);
    selectUser({ dispatch, user, username });
  }
  function onInvite() {
    const updatedHangout = {
      ...hangout,
      message: { text: messageText, timestamp:  Date.now() },
    };
    debugger;
    socket.send(
      JSON.stringify({ ...updatedHangout, type: messageToServer.OFFER })
    );
    dispatch({ type: actionTypes.OFFER_STARTED });
  }
  function onAccept() {
    socket.send(JSON.stringify({ ...hangout, type: messageToServer.ACCEPT }));
    dispatch({ type: actionTypes.ACCEPT_STARTED, hangout });
  }
  function onBlock() {
    socket.send(JSON.stringify({ ...hangout, type: messageToServer.BlOCK }));
    dispatch({ type: actionTypes.BLOCK_STARTED, hangout });
  }
  function onUnblock() {
    socket.send(JSON.stringify({ ...hangout, type: messageToServer.UNBLOCK }));
    dispatch({ type: actionTypes.UNBLOCK_STARTED, hangout });
  }
  function onDecline() {
    socket.send(JSON.stringify({ ...hangout, type: messageToServer.DECLINE }));
    dispatch({ type: actionTypes.DECLINE_STARTED, hangout });
  }

  function onMessage() {
    socket.send(JSON.stringify({ ...hangout, type: messageToServer.MESSAGE }));
    dispatch({ type: actionTypes.MESSAGE_STARTED, hangout });
  }

  function onSearch(e) {
    searchHangouts({ search: e.target.value, dispatch });
  }

  function onStartSearch(e) {
    if (hangouts && hangouts.length > 0) {
      filterHangouts({ dispatch });
    }
    fetchHangout({ dispatch, search });
  }

  function onMessageText(e) {
    changeMessageText({ dispatch, text: e.target.value });
  }
  return {
    onMessageText,
    messageText,
    onStartSearch,
    onSearch,
    search,
    onMessage,
    onInvite,
    onAccept,
    onBlock,
    onUnblock,
    onSelectHangout,
    onSelectUser,
    onDecline,
    hangout,
    hangouts,
    users,
  };
}

function updateLocalHangout({ hangout, username }) {
  const localHangouts = JSON.parse(
    localStorage.getItem(`${username}-hangouts`)
  );
  const updatedHangouts = localHangouts.map((lh) => {
    if (lh.username === hangout.username) {
      return hangout;
    } else {
      return lh;
    }
  });
}
