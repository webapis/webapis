import { useReducer, useEffect } from 'preact/hooks';

const initState = {
  users: [],
  loading: false,
  error: null,
};
const actionTypes = {
  FETCH_USERS_STARTED: 'FETCH_USERS_STARTED',
  FETCH_USERS_SUCCESS: 'FETCH_USERS_SUCCESS',
  FETCH_USERS_FAILED: 'FETCH_USERS_FAILED',
};

async function fetchUsers({ dispatch, filter }) {
  try {
    dispatch({ type: actionTypes.FETCH_USERS_STARTED });
    const response = await fetch(`/users/find?filter=${filter}`);
    const { users } = await response.json();
    
    dispatch({ type: actionTypes.FETCH_USERS_SUCCESS, users });
  } catch (error) {
    dispatch({ type: actionTypes.FETCH_USERS_FAILED, error });
  }
}

function usersReducer(state, action) {
  switch (action.type) {
    case actionTypes.FETCH_USERS_STARTED:
      return { ...state, loading: true };
    case actionTypes.FETCH_USERS_SUCCESS:
      const nextState = {
        ...state,
        users: action.users.map((user) => {
          return { ...user, state: 'invite' };
        }),
      };
      
      return nextState;
    case actionTypes.FETCH_USERS_FAILED:
      return { ...state, error: action.error };
    default:
      return state;
  }
}

export function useUsers({ filter }) {
  const [state, dispatch] = useReducer(usersReducer, initState);

  useEffect(() => {
    if (filter && filter.length > 3) {
      fetchUsers({ dispatch, filter });
    }
  }, [filter]);

  return { state };
}
