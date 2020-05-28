import { h, createContext } from 'preact';
import {useEffect} from 'preact/hooks'
import { useContext, useReducer, useMemo } from 'preact/hooks';
import {reducer} from './state/reducer'
import { actionTypes } from './actionTypes';
const HangoutsContext = createContext();

function useHangoutsContext() {
  const context = useContext(HangoutsContext);

  if (!context) {

    throw new Error('useHangoutsContext must be used with HangoutsProvider');
  }
  return context;
}

function HangoutsProvider(props) {
  const {username}=props
  const [state, dispatch] = useReducer(reducer, { contact: null });

  useEffect(() => {
    if (localStorage.getItem(`hangouts-${username}`)) {
      const storage = JSON.parse(localStorage.getItem(`hangouts-${username}`));
      dispatch({type:actionTypes.GOT_LOCAL_HANGOUTS,hangouts:storage.hangouts});
    } else {
      fetchHangouts({ dispatch, username });
    }
  }, []);
 
  const value = useMemo(() => [state, dispatch], [state]);
  return <HangoutsContext.Provider value={value} {...props} />;
}

export { useHangoutsContext, HangoutsProvider };
