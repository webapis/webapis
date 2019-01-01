import { h } from 'preact';
export function Avatar({ children, style }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', ...style }}>
      {children}
    </div>
  );
}
