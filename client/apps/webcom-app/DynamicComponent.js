import { h } from "preact";
import htm from "htm.module";
import {
  useContext,
  useMemo,
  useReducer,
  useEffect,
  useState,
} from "preact/hooks";
const html = htm.bind(h);

export default function DynamicComponent({ url }) {
  const [Component, setComponent] = useState(null);

  useEffect(() => {
    import("./Hangout").then((module) => {
      debugger;
      setComponent(module.default);
    });
  }, [url]);

  return html` <div>
    HangoutRoute ${Component ? Component : "Loading..."}
  </div>`;
}
