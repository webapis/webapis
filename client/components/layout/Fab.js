import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";

const style = {
  width: 56,
  height: 56,
  backgroundColor: "yellow",
  borderRadius: "50%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

export function Fab({ children }) {
  return (
    <div>
      <div style={style}>{children}</div>
    </div>
  );
}
