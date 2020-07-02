import { h, createContext } from 'preact';
import {
  useContext,
  useMemo,
  useReducer,
  useEffect,
} from 'preact/hooks';
import { reducer, initState } from './reducer';
import {useMessage} from './useMessage'

import {
  loadHangouts,
  loadMessages, 
} from './actions';
import {useUserName} from 'features/authentication/state/useUserName'
import { updateReadHangouts } from './actions/recieving-actions/updateReadHangouts';

const HangoutContext = createContext();
export function useHangoutContext() {
  const context = useContext(HangoutContext);
  if (!context) {
    throw new Error('useHangoutContext must be used with HangoutsProvider');
  }

  return context;
}

export function HangoutsProvider(props) {
 const {username,token}=useUserName()

  const [state, dispatch] = useReducer(reducer, initState);
  const { hangout,message } = state;
  const handleMessage =useMessage({message,username,dispatch,focusedHangout:hangout})
  useEffect(() => {
    if (username) {
      loadHangouts({ username, dispatch });
    }
  }, [username]);
  useEffect(() => {
    if (username && token) {
     
      loadHangouts({ username, dispatch });
    }
  }, []);
  useEffect(() => {
    if (hangout && username) {
  
      //from local storage
      loadMessages({ dispatch, hangout, username });

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
      if (!hangout.read) {
     
     
        updateReadHangouts({ dispatch, hangout, name: username });
      }
    }
  }, [hangout, username]);

  const value = useMemo(() => [state, dispatch], [state]);
  return <HangoutContext.Provider value={value} {...props} />;
}
