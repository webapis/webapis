import { h, createContext } from 'preact';
import {
  useContext,
  useState,
  useMemo,
  useReducer,
  useEffect,
} from 'preact/hooks';
import { reducer, initState } from './reducer';
import { loadHangouts, filterHangouts,fetchHangout } from './actions';
import { useAuthContext } from '../../auth/auth-context';
const HangoutContext = createContext();
export function useHangoutContext() {
  const context = useContext(HangoutContext);
  if (!context) {
    throw new Error('useHangoutContext must be used with HangoutsProvider');
  }

  return context;
}

export function HangoutsProvider(props) {
  const authContext = useAuthContext();
  const { username } = authContext.state;
  const [state, dispatch] = useReducer(reducer, initState);
  const { hangout } = state;


  useEffect(() => {
    if (username) {
      loadHangouts({ username, dispatch });
    }
  }, [username]);



  const value = useMemo(() => [state, dispatch], [state]);
  return <HangoutContext.Provider value={value} {...props} />;
}
