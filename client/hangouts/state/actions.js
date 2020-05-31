import { actionTypes } from './actionTypes'
import { messagesFromServer } from './messageTypes'
export function initWSocket({ url, dispatch }) {

    dispatch({ type: actionTypes.SET_SOCKET, socket: new WebSocket(url) })
}

export function selectHangout({ dispatch, hangout }) {
    dispatch({ type: actionTypes.SELECTED_HANGOUT, hangout })
}




