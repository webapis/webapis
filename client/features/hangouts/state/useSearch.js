import { useEffect } from "preact/hooks";
import { actionTypes } from "./actionTypes";

export default function useSearch({ state, dispatch, onAppRoute }) {
  const { search, hangouts } = state;
  useEffect(() => {}, []);
  function onSearchInput(e) {
    dispatch({ type: actionTypes.SEARCH_INPUT_CHANGE, search: e.target.value });
  }

  function onSearch() {
    dispatch({ type: actionTypes.SEARCH_HANGOUT_STARTED });
  }

  function onSearchSelect(e) {
    const { id } = e.target;

    const hangout = hangouts.find((s) => s.username === id);
    dispatch({ type: actionTypes.SELECTED_HANGOUT, hangout });
    setTimeout(function () {
      onAppRoute({ featureRoute: `/${hangout.state}`, route: "/hangouts" });
    }, 200);
  }

  return {
    onSearch,
    onSearchInput,
    onSearchSelect,
    search,
  };
}
