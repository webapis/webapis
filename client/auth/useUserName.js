import { useEffect, useState } from 'preact/hooks';
import { useAuthContext } from './auth-context';
export function useUserName() {
  const [userName, setUsername] = useState(null);
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState('');
  const { state } = useAuthContext();
  useEffect(() => {
  
    if (window.localStorage.getItem('webcom')) {

      const { username, token, email } = JSON.parse(
        window.localStorage.getItem('webcom')
      );
      setUsername(username);
      setToken(token);
      setEmail(email);
    }
  }, []);

  useEffect(() => {
    if (state.user && state.user.token) {
  
      const { username, email, token } =state.user;
  
      setUsername(username);
      setToken(token);
      setEmail(email);
    }
  }, [state.user]);

  return { username: userName, token, email };
}
