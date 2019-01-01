import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { useHangoutContext } from './HangoutsProvider';
import { useAuthContext } from '../../auth/auth-context';
import { useAppRoute } from '../../app-route/AppRouteProvider';
import { updateLocalHangouts } from './updateLocalHangouts';
import { savePendingHangout } from './actions/delivering-actions/savePendingHangout';
import {
  selectHangout,
  selectUnread,
  searchHangouts,
  filterHangouts,
  fetchHangout,
  changeMessageText,

  startClientCommand,
} from './actions';
import { sendOfflineHangouts } from './actions/delivering-actions/sendOfflineHangouts';
import {removeHangoutFromUnread} from './actions/recieving-actions/removeHangoutFromUnread'
import { actionTypes } from '../../app-route/actionTypes';

export function useHangouts() {
  const { onAppRoute } = useAppRoute();
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
    unreadhangouts,
  } = state;

  useEffect(() => {
    if (socket && readyState === 1 && username) {
      sendOfflineHangouts({ name: username, dispatch, socket });
    }
  }, [socket, readyState, username]);

  function onRemoveUnread(e){
    const id =e.currentTarget.id
    const hangout = hangouts.find((g) => g.username === id);
   debugger;
    removeHangoutFromUnread({name:username,dispatch,hangout})
  }
  function onNavigation(e){
    e.stopPropagation()
   // const id =e.target.id
    const id =e.currentTarget.id
   debugger;
    onAppRoute({ featureRoute: `/${id}`, route: '/hangouts' });
  }
  
  function onSelectHangout(e) {
    const username = e.target.id;
    selectHangout({ dispatch, username });
  }
  function onSelectUnread(e) {
    const username = e.target.id;
    selectUnread({ dispatch, username });
    const hangout = hangouts.find((g) => g.username === username);

    onAppRoute({ featureRoute: `/${hangout.state}`, route: '/hangouts' });
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
   
    changeMessageText({ text: '', dispatch });
    const command = e.target.id;
    const { email } = hangout;
    const timestamp = Date.now();
    const message =
      messageText !== '' ? { text: messageText, timestamp } : null;

    const online = true;
    let isBlocker =false
    if (socket && readyState === 1) {
   
      if(hangout.state ==='BLOCKER'){
       
        isBlocker=true
      }else{
       
        socket.send(
          JSON.stringify({
            username: hangout.username,
            email,
            message,
            command,
            timestamp,
          })
        );
      
      }
    
    } else {
      online = false;
    }

    savePendingHangout({
      dispatch,
      name: username,
      hangout: {
        username: hangout.username,
        email,
        state: command,
        message: { text: messageText, timestamp, delivered: false, username },
        timestamp,
        delivered: false,
        
      },
      online,
      isBlocker
    });

   


  }//end onHangout
  return {
    onNavigation,
    onSelectUnread,
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
    unreadhangouts,
    readyState,
    onRemoveUnread
  };
}
