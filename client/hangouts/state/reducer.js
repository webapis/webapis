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
        case actionTypes.HANGOUT_CHANGED_ITS_STATE:
        case actionTypes.ACKNOWLEDGEMENT_RECIEVED:
            return { ...state, hangouts: state.hangouts.map(g => { if (g.username === action.hangout.username) { return action.hangout } else return g }) }
        case actionTypes.OFFERER_RECIEVED:
            return { ...state, hangouts: [...state.hangouts, action.hangout] }
        default:
            return state
    }
}