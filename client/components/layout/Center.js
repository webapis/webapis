import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
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
