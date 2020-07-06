import { useEffect, useState } from 'preact/hooks';
import { useAuthContext } from './AuthProvider';
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
  debugger;
      const { username, email, token,objectId } =state.user;
  
      setUsername(username);
      setToken(token);
      setEmail(email);
      setObjectId(objectId)
    }
  }, [state.user]);

useEffect(()=>{
  if(state && state.user===null){
    setUsername(null);
    setToken(null);
    setEmail(null);
    setObjectId(null)
  }
},[state])
  return { username: userName, token, email };
}
