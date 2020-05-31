import { actionTypes } from './actionTypes'
export const initState = {
    hangouts: [],
    hangout: null,
    socket: null,
    messages: []
}

export function reducer(state, action) {
    switch (action.type) {
        case actionTypes.SET_SOCKET:
            return { ...state, socket: action.socket }
        case actionTypes.SELECTED_HANGOUT:
            return { ...state, hangout: state.hangouts.find(g => g.username === action.username) }
        case actionTypes.ACCEPTER_RECIEVED:
        case actionTypes.BLOCKER_RECIEVED:
        case actionTypes.DECLINER_RECIEVED:
        case actionTypes.MESSANGER_RECIVED:
        case actionTypes.UNBLOCKER_RECIEVED:
        case actionTypes.OFFERER_RECIEVED:
        case actionTypes.ACCEPT_STARTED:
        case actionTypes.ACCEPT_SUCCESS:
        case actionTypes.ACCEPT_FAILED:
        case actionTypes.OFFER_STARTED:
        case actionTypes.OFFER_SUCCESS:
        case actionTypes.OFFER_FAILED:
        case actionTypes.BLOCK_STARTED:
        case actionTypes.BLOCK_SUCCESS:
        case actionTypes.BLOCK_FAILED:
        case actionTypes.UNBLOCK_STARTED:
        case actionTypes.UNBLOCK_SUCCESS:
        case actionTypes.UNBLOCK_FAILED:
        case actionTypes.DECLINE_STARTED:
        case actionTypes.DECLINE_SUCCESS:
        case actionTypes.DECLINE_FAILED:
        case actionTypes.MESSAGE_SUCCESS:
        case actionTypes.MESSAGE_SUCCESS:
        case actionTypes.MESSAGE_FAILED:
        default:
            return state
    }
}