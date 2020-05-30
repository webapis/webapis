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
        default:
            return state
    }
}