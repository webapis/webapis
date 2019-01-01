import { h } from 'preact';

export function Grid(props) {
  const { children, start, end } = props;
  return (
    <div style={{ display: 'grid' }}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div style={{ gridColumn: `${start} / span ${end}` }}>{children}</div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}
