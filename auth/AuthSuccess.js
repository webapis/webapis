import {h} from 'preact';
import useAuth from './useAuth';
export default function AuthSuccess() {
  const { state } = useAuth();
  if (state.email !== '')
    return <div data-testid="welcome">Welcome, {state.email}</div>;
  return (
    <div data-testid="welcome">
      <h3>
       Welcome, {state.emailorusername}
      </h3>
    </div>
  );
}
