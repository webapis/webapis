import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { useHangoutContext } from './HangoutsProvider';
import { useAuthContext } from '../../auth/auth-context';
import { updateLocalHangouts } from './updateLocalHangouts';
import { savePendingHangout } from './actions/delivering-actions/savePendingHangout';
import {
  selectHangout,
  searchHangouts,
  filterHangouts,
  fetchHangout,
  selectUser,
  changeMessageText,
  startClientCommand,
} from './actions';
import {sendOfflineHangouts} from './actions/delivering-actions/sendOfflineHangouts'
import { useSocketMessage } from './useSocketMessage';

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
    socketMessage,
    readyState,
    socket,
  } = state;
  const handleMessageRouter = useSocketMessage({
    dispatch,
    socketMessage,
    username,
    focusedHangout: hangout,
  });


  useEffect(()=>{
    if(socket && readyState===1 && username){
      sendOfflineHangouts({name:username,dispatch,socket})
    }
  },[socket,readyState,username])

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
    const { email } = hangout;
    const timestamp = Date.now();
    const online = true;

    if (socket && readyState === 1) {
      socket.send(
        JSON.stringify({
          username,
          email,
          message: { text: messageText, timestamp },
          command,
          timestamp
        })
      );
    } else {
      online = false;
    }

    savePendingHangout({
      dispatch,
      name: username,
      hangout: {
        username: hangout.username,
        email,
        state:command,
        message: { text: messageText, timestamp,delivered:false,username },
        timestamp,
        delivered:false
      },
      online
    });
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
    readyState,
  };
}
