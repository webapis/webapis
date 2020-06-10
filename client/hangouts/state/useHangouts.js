import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { useHangoutContext } from './HangoutsProvider';
import { useAuthContext } from '../../auth/auth-context';
import { updateLocalHangouts } from './updateLocalHangouts';
import {
  selectHangout,
  searchHangouts,
  filterHangouts,
  fetchHangout,
  selectUser,
  changeMessageText,
  startClientCommand,
  saveMessage,
} from './actions';

import { useMessageRouter } from './useMessageRouter';

export function useHangouts() {
  const authContext = useAuthContext();
  const { username } = authContext.state;
  const [state, dispatch] = useHangoutContext();
  const {
    hangout,
    hangouts,
    search,
    users,
    messageText,
    messages,
    message,
    readyState,
    socket
  } = state;
  const handleMessageRouter = useMessageRouter({ dispatch, message, username });

  function onSelectHangout(e) {
    const username = e.target.id;
    selectHangout({ dispatch, username });
  }

  function onSelectUser(e) {
    const uname = e.target.id;
    const user = users.find((u) => u.username === uname);
    selectUser({ dispatch, user, username });
  }

  function onSearch(e) {
    searchHangouts({ search: e.target.value, dispatch });
  }

  function onStartSearch(e) {
    if (hangouts && hangouts.length > 0) {
      filterHangouts({ dispatch });
    }
    fetchHangout({ dispatch, search, username });
  }
  function onMessageText(e) {
    const text = e.target.value;
    changeMessageText({ dispatch, text });
  }
  function onHangout(e) {
    const command = e.target.id;
    const { username, email } = hangout;
    let message = null;
    if (messageText) {
      saveMessage({
        dispatch,
        message: {
          target: username,
          username: authContext.state.username,
          text: messageText,
          timestamp: Date.now(),
        },
      });
    }
    const updatedHangout = {
      username,
      email,
      message,
    };
    socket.send(JSON.stringify({ ...updatedHangout, command }));
    updateLocalHangouts({ hangout, username, devivered: 'pending' });
  }
  return {
    onMessageText,
    messageText,
    onStartSearch,
    onSearch,
    search,
    onSelectHangout,
    onSelectUser,
    hangout,
    hangouts,
    users,
    username,
    messages,
    onHangout,
    readyState
  };
}
