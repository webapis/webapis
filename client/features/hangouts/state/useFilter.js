import { actionTypes } from "./actionTypes";
import { useEffect } from "preact/hooks";
import filterHangouts from "./local-storage/filterHangouts";
import { loadHangouts } from "./local-storage/common";

export default function useFilter({ state, dispatch, onAppRoute, username }) {
  const { filter, hangouts } = state;

  useEffect(() => {
    if (username) {
      //  loadHangouts({ dispatch, name: username });
    }
  }, []);

  useEffect(() => {
    if (filter.length > 0) {
      //
      filterHangouts({ filter, dispatch, name: username });
    }
  }, [filter]);

  function onFilterInput(e) {
    dispatch({
      type: actionTypes.FILTER_INPUT_CHANGED,
      filter: e.target.value,
    });
  }

  function onFilterSelect(e) {
    const { id } = e.target;

    const hangout = hangouts.find((s) => s.username === id);

    dispatch({ type: actionTypes.SELECTED_HANGOUT, hangout });
    onAppRoute({ featureRoute: `/${hangout.state}`, route: "/hangouts" });
  }

  return { filter, onFilterSelect, onFilterInput };
}
