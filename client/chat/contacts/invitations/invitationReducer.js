import actionTypes from './actionTypes';

export const initState = {
  error: null,
  loading: false,
  invitations: [],
};

export function invitationReducer(state, action) {
  switch (action.type) {
    case actionTypes.SEND_INVITATION_STARTED:
      return { ...state, loading: true };
    case actionTypes.SEND_INVITATION_SUCCESS:
      return { ...state, loading: false };
    case actionTypes.SEND_INVITATION_FAILED:
      return { ...state, loading: false, error: action.error };
    case actionTypes.FETCH_INVITATIONS_STARTED:
      return { ...state, loading: true };
    case actionTypes.FETCH_INVITATIONS_SUCCESS:
      return { ...state, loading: false };
    case actionTypes.FETCH_INVITATIONS_FAILED:
      return { ...state, loading: false, error: action.error };
    case actionTypes.OPEN_INVITATION:
      return {
        ...state,
        invitations: [...state.invitations, action.invitation],
      };
    case actionTypes.CLOSE_INVITATION:
      return {
        ...state,
        invitation: state.invitations.filter(
          (inv) => inv.reciever !== action.reciever
        ),
      };
    default:
      return state;
  }
}
