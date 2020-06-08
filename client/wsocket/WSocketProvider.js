import { h, createContext } from 'preact';
import {
  useContext,
  useState,
  useEffect,
  useReducer,
  useMemo,
} from 'preact/hooks';
import { reducer, initState } from './reducer';
import { actionTypes } from './actionTypes';
import { useAuthContext } from '../auth/auth-context';
const WSocketContext = createContext();

export function useWSocketContext() {
  const context = useContext(WSocketContext);
  if (!context) {
    throw new Error('useWSocketContext must be used with WSocketProvider');
  }
  return context;
}

export function WSocketProvider(props) {
  const authContext = useAuthContext();
  const { username } = authContext.state;
  const { url } = props;
  const [state, dispatch] = useReducer(reducer, initState);
  const { socket } = state;
  useEffect(() => {
    if (username) {
      const sock = new WebSocket(`${url}/?username=${username}`);
      sock.onmessage=(message)=>{
        const msg =JSON.parse(message.data)
        debugger;
      }
      sock.onopen = () => {
        dispatch({ type: actionTypes.OPEN });
      };
      sock.onclose = () => {
        dispatch({ type: actionTypes.CLOSED });
      };
      sock.onerror = (error) => {
        dispatch({ type: actionTypes.SOCKET_ERROR, error });
      };
      dispatch({ type: actionTypes.SOCKET_READY, socket: sock });
    }
  }, [username]);
  useEffect(() => {
    if (socket) {
      if (socket.readyState === 0) {
        dispatch({ type: actionTypes.CONNECTING });
      } else {
        if (socket.readyState === 2) {
          dispatch({ type: actionTypes.CLOSING });
        }
      }
    }
  }, [socket]);
  const value = useMemo(() => [state, dispatch], [state]);
  return <WSocketContext.Provider value={value} {...props} />;
}
