import actionTypes from './actionTypes';
export const initState = {
  loading: false,
  invitations: [],
  error: null,
  message: 'Lest chat on Webcom',
};
export function invitationReducer(state, action) {
  switch (action.type) {
    case actionTypes.SEND_INVITATION_STARTED:
      return { ...state, loading: true };
    case actionTypes.SEND_INVITATION_SUCCESS:
      return {
        ...state,
        loading: false,
        invitations: [...state.invitations, action.invitation],
      };
    case actionTypes.SEND_INVITATION_FAILED:
      return { ...state, loading: false, error: action.error };
    case actionTypes.VALUE_CHANGED:
      return { ...state, message: action.value };
    default:
      return state;
  }
}
