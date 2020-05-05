import { h } from 'preact';
export function Position({ children }) {
  return (
    <div style={{ position: 'absolute', bottom: 0, right: 0 }}>{children}</div>
  );
}
