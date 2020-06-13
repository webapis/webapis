import { actionTypes } from './actionTypes'
export function changeAppRoute({ dispatch, route }) {
    dispatch({ type: actionTypes.FEATURE_ROUTE_CHANGED, appRoute })
}

export function changeFeatureRoute({ dispatch, featureRoute }) {
    dispatch({ type: actionTypes.FEATURE_ROUTE_CHANGED, featureRoute })
}