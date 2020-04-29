import { h } from 'preact';
import { useAppContext } from '../app-context';
export default function AuthFeedback({ message }) {
  const { auth } = useAppContext();
  const { state } = auth;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height:300,
        fontSize:16
      }}
      data-testid='auth-feedback'
    >
      <div>{state.authFeedback}</div>
    </div>
  );
}
