import { useEffect, useState } from 'preact/hooks';
import { useAppContext } from '../app-context';
export function useUserName() {
  const [userName, setUsername] = useState(null);
  const { auth } = useAppContext();
  useEffect(() => {
    if (window.localStorage.getItem('webcom')) {
      const { username } = JSON.parse(window.localStorage.getItem('webcom'));
      setUsername(username);
    }
  }, []);

  useEffect(() => {
    if (auth.state.token) {
      const { username } = JSON.parse(window.localStorage.getItem('webcom'));
      setUsername(username);
    }
  }, [auth.state]);

  return { userName };
}
