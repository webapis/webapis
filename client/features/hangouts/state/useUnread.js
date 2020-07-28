import { actionTypes } from "./actionTypes";
import {
  updateUnread,
  updateRecievedMessage,
  updateHangout,
} from "./local-storage/common";
export default function useUnread({ state, dispatch, onAppRoute, username }) {
  const { unreadhangouts } = state;

  function onUnreadSelect({ hangout }) {
    dispatch({ type: actionTypes.SELECTED_HANGOUT, hangout });
    updateRecievedMessage({
      hangout,
      name: username,
      dispatch,
      dState: "read",
    });
    onAppRoute({ featureRoute: `/${hangout.state}`, route: "/hangouts" });
  }

  function onUnreadRemove() {}

  return { unreadhangouts, onUnreadSelect, onUnreadRemove };
}
