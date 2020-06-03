import { h, createContext } from 'preact';
import { useContext, useState, useEffect } from 'preact/hooks';

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
  const [socket, setSocket] = useState(null);
  const [online,setOnline]=useState(false)

  useEffect(() => {
    if (username) {
        const sock =new WebSocket(`${url}/?username=${username}`)

        sock.onopen=()=>{
            ;
            setOnline(true)
        }
        sock.onclose=()=>{
            ;
            setOnline(false)
        }
      setSocket(sock);
    }
  }, [username]);


  return <WSocketContext.Provider value={{ socket,online }} {...props} />;
}
