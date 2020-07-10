import { h } from "preact";
import { useState } from "preact/hooks";
import HangoutFilter from "./Filter";
import HangoutSearch from "./Search";

export default function Hangout({
  hangouts,
  onSearchInput,
  onSearch,
  onSelectHangout,
  search,
}) {
  const [state, setState] = useState("filter");
  return (
    <div style={{ height: "100%" }}>
      {state === "filter" && <HangoutFilter />}
      {state === "search" && <HangoutFilter />}
    </div>
  );
}
