import { h } from 'preact';
import { useAuthContext } from '../auth/auth-context';
export default function AuthFeedback({ message, children }) {
  const { state } = useAuthContext();


  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 300,
        fontSize: 16,
      }}
      data-testid='auth-feedback'
    >
      <div>{state.authFeedback}</div>

      <div> {children}</div>
    </div>
  );
}

export function LoginLink() {
  return (
    <div>
      <a href={`${api_url}`}>Login</a>
    </div>
  );
}
