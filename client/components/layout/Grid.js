import { h } from "preact";

export function Grid(props) {
  const { children, width } = props;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `auto ${width}% auto`,
      }}
    >
      <div></div>
      <div>{children}</div>
      <div></div>
    </div>
  );
}
