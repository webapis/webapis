import { h, createContext } from 'preact';
import {
  useContext,
  useState,
  useMemo,
  useReducer,
  useEffect,
} from 'preact/hooks';
import { reducer, initState } from './reducer';

import {
  loadHangouts,
  filterHangouts,
  fetchHangout,
  loadMessages,
} from './actions';
import {useSocketMessage}from './useSocketMessage'
import { useAuthContext } from '../../auth/auth-context';
import { useWebSocket } from './useWebSocket';
const HangoutContext = createContext();
export function useHangoutContext() {
  const context = useContext(HangoutContext);
  if (!context) {
    throw new Error('useHangoutContext must be used with HangoutsProvider');
  }

  return context;
}

export function HangoutsProvider(props) {
  const { socketUrl } = props;
  const authContext = useAuthContext();
  const { username } = authContext.state;
  const [state, dispatch] = useReducer(reducer, initState);
  const { hangout,socketMessage } = state;
  const websocketHandler = useWebSocket({ username, dispatch, socketUrl });
  const handleUseSocketMessage =useSocketMessage({username,dispatch,socketMessage,   focusedHangout: hangout})
  useEffect(() => {
    if (username) {
      loadHangouts({ username, dispatch });
    }
  }, [username]);
  useEffect(() => {
    if (hangout && username) {
      //from local storage
      loadMessages({ dispatch, hangout,username });

      //save hangout to localStorage
      const key = `${username}-hangouts`;
      const hangouts = JSON.parse(localStorage.getItem(key));
      if (!hangouts) {
        localStorage.setItem(key, JSON.stringify([hangout]));
      } else {
        const hangoutExist = hangouts.find(
          (g) => g.username === hangout.username
        );
        if (hangoutExist) {
          const updated = hangouts.map((g) => {
            if (g.username === hangout.username) {
              return hangout;
            } else {
              return g;
            }
          });
          localStorage.setItem(key, JSON.stringify(updated));
        } else {
          localStorage.setItem(key, JSON.stringify([hangout]));
        }
      }
    }
  }, [hangout,username]);
useEffect(()=>{
  if(!hangout){
    const hang =hangout
    debugger;
  }

},[hangout])
  const value = useMemo(() => [state, dispatch], [state]);
  return <HangoutContext.Provider value={value} {...props} />;
}
