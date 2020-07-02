import { h } from 'preact';
export default function PersonAddIcon({
  height = 24,
  width = 24,
  color = 'black',
  fill = 'white',
  style,
}) {
  return (
    <svg height={height} viewBox='0 0 24 24' width={width} style={style}>
      <path d='M0 0h24v24H0z' fill={fill} />
      <path
        fill={color}
        d='M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'
      />
    </svg>
  );
}