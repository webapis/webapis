import { actionTypes } from './actionTypes'

export function reducer(state, action) {
    switch (action.type) {
        case actionTypes.APP_ROUTE_CHANGED:
            return { ...state, route: action.route,featureRoute: action.featureRoute }
        case actionTypes.FEATURE_ROUTE_CHANGED:
            return { ...state, featureRoute: action.featureRoute,route:action.route }
        default:
            return state;
    }
}