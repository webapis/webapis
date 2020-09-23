import { actionTypes } from "./actionTypes";
export const initState = {
  appRoute: "/",
  featureRoute: "/",
};
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
