import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";

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
