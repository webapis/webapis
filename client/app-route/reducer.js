import { actionTypes } from './actionTypes'

export function reducer(state, action) {
    switch (action.type) {
        case actionTypes.APP_ROUTE_CHANGED:
            return { ...state, route: action.route,featureRoute: action.featureRoute }
        default:
            return state;
    }
}