import { actionTypes } from '../../actionTypes';
export function saveAckHangout({name,dispatch,hangout}){
    const {username}=hangout
    const hangoutKey = `${name}-hangouts`;

    const hangouts = JSON.parse(localStorage.getItem(hangoutKey));
    const hangoutIndex = hangouts.findIndex((g) => g.username === username);
    const updatedHangouts = null;
      updatedHangouts = hangouts.splice(hangoutIndex, 1, {
        ...hangout,
        delivered: true,
      });
    localStorage.setItem(hangoutKey, JSON.stringify(updatedHangouts));
    dispatch({ type: actionTypes.HANGOUTS_UPDATED, hangouts: updatedHangouts });
}