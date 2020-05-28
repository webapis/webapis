import { useEffect } from 'preact/hooks';
import {actionTypes} from './actionTypes'
import { useHangoutsContext } from './HangoutsProvider';
export function useHangouts() {
  const [state, dispatch] = useHangoutsContext();
  const {hangout,filter}=state

  useEffect(() => {
    if (filter && filter.length > 3) {
      findContact({ dispatch, filter });
    }
  }, [filter]);

  function updateHangsoutState({ username, state }) {
    dispatch({ type: actionTypes.CONTACT_STATE_CHANGED, username, state });
  }

   function selectHangout({ dispatch, hangout }) {
    dispatch({ type: actionTypes.SELECT_HANGOUT, hangout });
  }

   function removeHangout({ dispatch }) {
    dispatch({ type: actionTypes.REMOVE_HANGOUT });
  }
function setFilter ({filter}){
  dispatch({type:actionTypes.FILTER_SET,filter})
}

  return { state,hangout, updateHangsoutState,selectHangout,removeHangout,setFilter };
}
