import { useEffect, useReducer, useState } from 'preact/hooks';
import { fetchHangouts, getLocalContacts } from './actions';
import { useHangoutsContext } from './HangoutsProvider';
export function useHangouts({ filter, username }) {
  const [state, dispatch] = useHangoutsContext();
  useEffect(() => {
    if (localStorage.getItem(`hangouts-${username}`)) {
      const storage = JSON.parse(localStorage.getItem(`hangouts-${username}`));
      getLocalContacts({ dispatch, contacts: storage.contacts });
    } else {
      fetchHangouts({ dispatch, username });
    }
  }, []);

  useEffect(() => {
    if (filter && filter.length > 3) {
      findContact({ dispatch, filter });
    }
  }, [filter]);

  function updateContactState({ username, state }) {
    dispatch({ type: actionTypes.CONTACT_STATE_CHANGED, username, state });
  }

  return { state, updateContactState };
}
