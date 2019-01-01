import { actionTypes } from "./actionTypes";

export function reducer(state, action) {
  switch (action.type) {
    case actionTypes.APP_ROUTE_CHANGED:
      return {
        ...state,
        appRoute: action.appRoute,
        featureRoute: action.featureRoute,
      };
    default:
      return state;
  }
}
