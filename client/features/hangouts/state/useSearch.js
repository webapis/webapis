import { actionTypes } from "./actionTypes";
export default function useSearch({ state, dispatch, onAppRoute }) {
  const { search, searchResult } = state;

  function onSearchSelect(e) {
    const { id } = e.target;

    const hangout = searchResult.find((s) => s.username === id);
    dispatch({ type: actionTypes.SELECTED_HANGOUT, hangout });
    onAppRoute({ featureRoute: `/${hangout.state}`, route: "/hangouts" });
  }
  function onSearchInput(e) {
    dispatch({ type: actionTypes.SEARCH_INPUT_CHANGE, search: e.target.value });
  }

  function onSearch() {
    dispatch({ type: actionTypes.SEARCH_HANGOUT_STARTED });
  }

  return { onSearch, onSearchInput, onSearchSelect, search, searchResult };
}
