import { h, createContext } from 'preact';
import { useContext, useReducer, useMemo } from 'preact/hooks';
import {reducer} from './state/reducer'
const HangoutsContext = createContext();

function useHangoutsContext() {
  const context = useContext(HangoutsContext);

  if (!context) {
    throw new Error('useHangoutsContext must be used with HangoutsProvider');
  }
  return context;
}


export function selectContact({ dispatch, contact }) {

  dispatch({ type: actionTypes.SELECTED_CONTACT, contact });
}
export function removeContact({ dispatch }) {
  dispatch({ type: actionTypes.REMOVE_CONTACT });
}


function HangoutsProvider(props) {
  const [state, dispatch] = useReducer(reducer, { contact: null });
 
  const value = useMemo(() => [state, dispatch], [state]);
  return <HangoutsContext.Provider value={value} {...props} />;
}

export { useHangoutsContext, HangoutsProvider };
