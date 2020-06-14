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

  changeMessageText,
  startClientCommand,
} from './actions';
import {sendOfflineHangouts} from './actions/delivering-actions/sendOfflineHangouts'
//import { useSocketMessage } from './useSocketMessage';

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
  // const handleMessageRouter = useSocketMessage({
  //   dispatch,
  //   socketMessage,
  //   username,
  //   focusedHangout: hangout,
  // });


  useEffect(()=>{
    if(socket && readyState===1 && username){
      sendOfflineHangouts({name:username,dispatch,socket})
    }
  },[socket,readyState,username])

  function onSelectHangout(e) {
    const username = e.target.id;
    selectHangout({ dispatch, username });
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
    const message= messageText !== ''? { text: messageText, timestamp } :null
 
    const online = true;

    if (socket && readyState === 1) {
     
      socket.send(
        JSON.stringify({
          username:hangout.username,
          email,
          message,
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
        message:  { text: messageText, timestamp,delivered:false,username },
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
    dispatch,
    hangout,
    hangouts,
    users,
    username,
    messages,
    onHangout,
    readyState,
  };
}
