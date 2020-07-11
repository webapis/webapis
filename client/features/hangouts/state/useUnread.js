import { actionTypes } from "./actionTypes";
export default function useUnread({ state, dispatch, onAppRoute }) {
  const { unreadhangouts } = state;

  function onUnreadSelect({ hangout }) {
    debugger;
    dispatch({ type: actionTypes.SELECTED_HANGOUT, hangout });
    onAppRoute({ featureRoute: `/${hangout.state}`, route: "/hangouts" });
  }

  function onUnreadRemove() {}

  return { unreadhangouts, onUnreadSelect, onUnreadRemove };
}
