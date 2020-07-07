import { h } from "preact";

export function Done({
  height = 24,
  width = 24,
  fill = "none",
  color = "black",
  style,
}) {
  return (
    <svg height={height} viewBox="0 0 24 24" width={width} style={style}>
      <path d="M0 0h24v24H0z" fill={fill} />
      <path
        fill={color}
        d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"
      />
    </svg>
  );
}
