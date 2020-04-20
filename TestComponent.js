import { h } from 'preact';
import { AppProvider, useAppContext } from './app-context';

function Counter() {
  const { state, increment } = useAppContext();

  return <button onClick={increment}>{state.count}</button>;
}

function CountDisplay() {
  const { state } = useAppContext();
  return <div>The current counter {state.count}</div>;
}
export default function TestComponent() {
  return (
    <div>
      This is test component.
      <Counter />
      <CountDisplay />
    </div>
  );
}
