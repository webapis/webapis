import { h, createContext } from "preact";
import { useContext, useMemo, useReducer, useEffect } from "preact/hooks";
import { reducer, initState } from "./reducer";
import { useMessage } from "./useMessage";

import { loadHangouts, loadMessages } from "./actions";
import { useUserName } from "features/authentication/state/useUserName";
import { updateReadHangouts } from "./actions/recieving-actions/updateReadHangouts";

const HangoutContext = createContext();
export function useHangoutContext() {
  const context = useContext(HangoutContext);
  if (!context) {
    throw new Error("useHangoutContext must be used with HangoutsProvider");
  }

  return context;
}

export default function HangoutsProvider(props) {
  const { username, token } = useUserName();

  const [state, dispatch] = useReducer(reducer, initState);
  const { hangout, message } = state;
  const handleMessage = useMessage({
    message,
    username,
    dispatch,
    focusedHangout: hangout,
  });

  const value = useMemo(() => [state, dispatch], [state]);
  return <HangoutContext.Provider value={value} {...props} />;
}
