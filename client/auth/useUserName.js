import { useEffect, useState } from 'preact/hooks';
import { useAppContext } from '../app-context';
export function useUserName() {
  const [userName, setUsername] = useState(null);
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState('');
  const { auth } = useAppContext();
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
    if (auth.state.token) {
      const { username, token, email } = JSON.parse(
        window.localStorage.getItem('webcom')
      );
      setUsername(username);
      setToken(token);
      setEmail(email);
    }
  }, [auth.state]);

  return { userName, token, email };
}
