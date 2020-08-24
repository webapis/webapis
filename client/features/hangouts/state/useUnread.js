import {
  useEffect,
  useState,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js";
import { actionTypes } from "./actionTypes";
import {
  updateUnread,
  updateHangout,
  removeUnreads,
} from "./local-storage/common";
export default function useUnread({ state, dispatch, onAppRoute, username }) {
  const [reducedUnreads, setReducedUnreads] = useState([]);
  const { unreadhangouts } = state;

  useEffect(() => {
    if (unreadhangouts && unreadhangouts.length > 0) {
      onReduce({ unreadhangouts });
    }
  }, [unreadhangouts]);

  function onUnreadSelect({ hangout }) {
    debugger;
    dispatch({ type: actionTypes.SELECTED_HANGOUT, hangout });

    onAppRoute({ featureRoute: `/${hangout.state}`, route: "/hangouts" });
    removeUnreads({ hangout, dispatch, name: username, state: "ACCEPTER" });
    removeUnreads({ hangout, dispatch, name: username, state: "INVITER" });
  }

  function onUnreadRemove() {}

  function onReduce({ unreadhangouts }) {
    let reduced = unreadhangouts.reduce((acc, curr, index) => {
      console.log("index", index);
      console.log("acc", acc);
      console.log("curr", curr);
      if (index === 0) {
        return [{ ...curr, messageCounter: 1 }];
      } else if (index > 0) {
        //check for existens
        //  same user exists
        if (acc.some((obj) => obj.username === curr.username)) {
          const prevState = acc.find((a) => a.username === curr.username);
          acc.splice(
            acc.findIndex((a) => a.username === curr.username),
            1,
            { ...curr, messageCounter: prevState.messageCounter + 1 }
          );
        } else {
          //fist time
          acc.push({ ...curr, messageCounter: 1 });
        }

        return acc;
      }
    }, []);
    setReducedUnreads(reduced);
    console.log("reduced", reduced);
  }

  return { unreadhangouts, onUnreadSelect, onUnreadRemove, reducedUnreads };
}
