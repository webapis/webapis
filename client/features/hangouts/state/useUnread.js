import { useEffect, useState } from "preact/hooks";
import { actionTypes } from "./actionTypes";
import {
  updateUnread,
  updateHangout,
  removeUnreads,
  removeTargetUnreads,
  updateRecievedMessages,
  updateRecievedReadMessages,
} from "./local-storage/common";
export default function useUnread({
  unreadhangouts,
  dispatch,
  onAppRoute,
  user,
  appRoute,
}) {
  const [reducedUnreads, setReducedUnreads] = useState([]);

  useEffect(() => {
    if (unreadhangouts && unreadhangouts.length > 0) {
      onReduce({ unreadhangouts });
    }
  }, [unreadhangouts]);

  function onUnreadSelect({ hangout }) {
    dispatch({ type: actionTypes.SELECTED_HANGOUT, hangout });

    onAppRoute({ featureRoute: `/${hangout.state}`, appRoute });
    // updateRecievedReadMessages({
    //   hangout,
    //   username: user && user.username,
    //   dispatch,
    // });
    removeTargetUnreads({ dispatch, username: user && user.username, hangout });
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
