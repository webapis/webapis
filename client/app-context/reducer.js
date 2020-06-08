import { actionTypes } from './actionTypes'
export const initState = {
    hangoutInitialRoute: '/UNREAD'
}
export function reducer(state, action) {
    switch (action.type) {
        case actionTypes.NAVIGATE_TO_HANGOUTS:
            return { ...state, hangoutInitialRoute: '/hangouts' }
        case actionTypes.NAVIGATE_TO_UNREAD_MESSAGES:
            return { ...state, hangoutInitialRoute: '/unreadmessages' }
        default:
            return state;
    }
}