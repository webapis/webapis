import { useEffect, useState } from 'preact/hooks';
import { useAuthContext } from './auth-context';
export function useUserName() {
  const [userName, setUsername] = useState(null);
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState('');
  const { state,dispatch } = useAuthContext();
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
    if (state.token) {
      const { username, email, token } =state;
      // const { username, token, email } = JSON.parse(
      //   window.localStorage.getItem('webcom')
      // );
      setUsername(username);
      setToken(token);
      setEmail(email);
    }
  }, [state]);

  return { userName, token, email };
}
