import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
export function Position({ children }) {
  return (
    <div style={{ position: "absolute", bottom: 0, right: 0 }}>{children}</div>
  );
}
