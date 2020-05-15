import { h, createContext } from 'preact';
import { useContext, useState, useEffect } from 'preact/hooks';

const WSocketContext = createContext();

export function useWSocketContext() {
  const context = useContext(WSocketContext);
  debugger;
  if (!context) {
    throw new Error('useWSocketContext must be used with WSocketProvider');
  }
  const { socket, error, message } = context;

  return { socket, error, message };
}
//
export function WSocketProvider(props) {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    const { url } = props;
    setSocket(new WebSocket(url));
  }, []);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (message) => {
        setMessage(JSON.parse(message));
      };

      socket.onerror = (error) => {
        setError(error);
      };
    }
  }, [socket]);

  return (
    <WSocketContext.Provider value={{ socket, message, error }} {...props} />
  );
}
