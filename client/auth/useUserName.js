import { useEffect, useState } from 'preact/hooks';
import { useAuthContext } from './auth-context';
export function useUserName() {
  const [userName, setUsername] = useState(null);
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState('');
  const [objectId, setObjectId] = useState(null);
  const { state } = useAuthContext();
  useEffect(() => {
  
    if (window.localStorage.getItem('webcom')) {

      const { username, token, email,objectId } = JSON.parse(
        window.localStorage.getItem('webcom')
      );
      setUsername(username);
      setToken(token);
      setEmail(email);
      setObjectId(objectId)
    }
  }, []);

  useEffect(() => {
    if (state.user && state.user.token) {
  
      const { username, email, token,objectId } =state.user;
  
      setUsername(username);
      setToken(token);
      setEmail(email);
      setObjectId(objectId)
    }
  }, [state.user]);

  return { username: userName, token, email };
}
