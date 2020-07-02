import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { useHangoutContext } from './HangoutsProvider';
import { useAuthContext } from 'features/authentication/state/auth-context';
import { useAppRoute } from 'components/app-route';
import { savePendingHangout } from './actions/delivering-actions/savePendingHangout';
import {

  selectUnread,
  

  changeMessageText,
} from './actions';
import { sendOfflineHangouts } from './actions/delivering-actions/sendOfflineHangouts';
import {removeHangoutFromUnread} from './actions/recieving-actions/removeHangoutFromUnread'
import {actionTypes} from './actionTypes';


export function useHangouts() {
  const { onAppRoute } = useAppRoute();
  const authContext = useAuthContext();
  const  username  = authContext.state.user &&authContext.state.user.username;
  const [state, dispatch] = useHangoutContext();
  const {
    hangout,
    hangouts,
    search,
    users,
    messageText,
    messages,
    readyState,
  
    unreadhangouts,
  } = state;

  useEffect(() => {
    if ( readyState === 1 && username) {
      sendOfflineHangouts({ name: username, dispatch });
    }
  }, [readyState, username]);

  function onRemoveUnread(e){
    const id =e.currentTarget.id
    const hangout = hangouts.find((g) => g.username === id);
   
    removeHangoutFromUnread({name:username,dispatch,hangout})
  }
  function onNavigation(e){
    e.stopPropagation()
   // const id =e.target.id
    const id =e.currentTarget.id
   
    onAppRoute({ featureRoute: `/${id}`, route: '/hangouts' });
  }
  
  function onSelectHangout(e) {
    const username = e.target.id;
    const hangout = hangouts.find((g) => g.username === username)
    dispatch({type:actionTypes.SELECTED_HANGOUT, hangout })
  }
  function onSelectUnread(e) {
    const username = e.target.id;
    
 
    const hangout = hangouts.find((g) => g.username === username);
    selectUnread({ dispatch, hangout });
    onAppRoute({ featureRoute: `/${hangout.state}`, route: '/hangouts' });
  }

  function onSearchInput(e) {
    dispatch({type:actionTypes.SEARCH_INPUT_CHANGE, search: e.target.value });
  }

  function onFetchHangouts(){

    dispatch({type:actionTypes.FETCH_HANGOUT_STARTED})
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

    let online = true;
    let isBlocker =false
    
  //  if (readyState === 1) {
      
      if(hangout.state ==='BLOCKER'){
       
        isBlocker=true
      }
      const pendingHangout= {
        username: hangout.username,
        email,
        message,
        command,
        timestamp,
      }
      dispatch({type:actionTypes.SENDING_HANGOUT_STARTED, pendingHangout})
    // } else {
    //   online = false;
    // }
   
 
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
    state,
    onNavigation,
    onSelectUnread,
    onMessageText,
    messageText,
    onSearchInput,
    onFetchHangouts,
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
