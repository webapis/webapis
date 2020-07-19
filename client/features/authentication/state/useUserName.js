import {
  useEffect,
  useState,
} from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/hooks.module.js";
import { useAuthContext } from "./AuthProvider";
import actionTypes from "./actionTypes";
export function useUserName() {
  const [userName, setUsername] = useState(null);
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState("");
  const [objectId, setObjectId] = useState(null);
  const { state, dispatch } = useAuthContext();
  useEffect(() => {
    if (window.localStorage.getItem("webcom")) {
      const { username, token, email, objectId } = JSON.parse(
        window.localStorage.getItem("webcom")
      );
      setUsername(username);
      setToken(token);
      setEmail(email);
      setObjectId(objectId);
      dispatch({
        type: actionTypes.RECOVER_LOCAL_AUTH_STATE,
        user: { username, token, email, objectId },
      });
    }
  }, []);

  useEffect(() => {
    if (state.user && state.user.token) {
      const { username, email, token, objectId } = state.user;

      setUsername(username);
      setToken(token);
      setEmail(email);
      setObjectId(objectId);
    }
  }, [state.user]);

  useEffect(() => {
    if (state && state.user === null) {
      setUsername(null);
      setToken(null);
      setEmail(null);
      setObjectId(null);
    }
  }, [state]);

  return { username: userName, token, email };
}
