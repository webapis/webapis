import { h } from "preact";
export function Center({ children, style }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        textAlign: "center",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
