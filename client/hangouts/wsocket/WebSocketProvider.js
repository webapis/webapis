import { h, createContext } from 'preact';
import { useContext, useState, useEffect } from 'preact/hooks';
import { useAuthContext } from '../../auth/auth-context';
const WebSocketContext = createContext();

export function useWebSocketContext() {
  const context = useContext(WebSocketContext);

  if (!context) {
    throw new Error('useWebSocketContext must be used with WebsocketProvider');
  }
  const { socket, error, message } = context;

  return { socket, error, message };
}
//
export function WebSocketProvider(props) {
  const authContext = useAuthContext();
  const { username } = authContext.state;
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    const { url } = props;
    if (username) {
      setSocket(new WebSocket(`${url}/?username=${username}`));
    }
  }, [username]);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (message) => {
        console.log('message recieved', message.data, 'username:', username);
        setMessage(JSON.parse(message.data));
      };
      //
      socket.onerror = (error) => {
        setError(error);
      };
    }
  }, [socket]);

  return (
    <WebSocketContext.Provider value={{ socket, message, error }} {...props} />
  );
}
