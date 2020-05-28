import { useEffect } from 'preact/hooks';
import { fetchHangouts,  } from './actions';
import {actionTypes} from './actionTypes'
import { useHangoutsContext } from './HangoutsProvider';
export function useHangouts({ filter, username }) {
  const [state, dispatch] = useHangoutsContext();


  useEffect(() => {
    
    if (filter && filter.length > 3) {
      findContact({ dispatch, filter });
    }
  }, [filter]);

  function updateHangsoutState({ username, state }) {
    dispatch({ type: actionTypes.CONTACT_STATE_CHANGED, username, state });
  }

  export function selectHangout({ dispatch, hangout }) {

    dispatch({ type: actionTypes.SELECT_HANGOUT, hangout });
  }

  export function removeHangout({ dispatch }) {
    dispatch({ type: actionTypes.REMOVE_HANGOUT });
  }

  return { state, updateHangsoutState,selectHangout,removeHangout };
}
