import { actionTypes } from "./actionTypes";
import { useEffect } from "preact/hooks";
import filterHangouts from "./local-storage/local/filterHangouts";
import loadHangouts from "./local-storage/local/loadHangouts";
export default function useFilter({ state, dispatch, onAppRoute, username }) {
  const { filter, filterResult } = state;

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

    const hangout = filterResult.find((s) => s.username === id);
    dispatch({ type: actionTypes.SELECTED_HANGOUT, hangout });
    onAppRoute({ featureRoute: `/${hangout.state}`, route: "/hangouts" });
  }

  function onLoadHangout() {
    loadHangouts({ dispatch, name: username });
  }

  return { filter, filterResult, onFilterSelect, onFilterInput, onLoadHangout };
}
