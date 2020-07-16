import actionTypes from "./actionTypes";
export const initState = {
  selectedId: 0,
};
export default function reducer(state, action) {
  switch (action.type) {
    case actionTypes.ACCORDION_SELECTED:
      const nextState = { ...state, selectedId: action.selectedId };

      return nextState;
    default:
      return state;
  }
}
