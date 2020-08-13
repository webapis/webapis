import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import messageIcon from "./message.png";
const style = {
  count: {
    width: 30,
    height: 30,
    backgroundColor: "green",
    color: "white",
    textAlign: "center",
    borderRadius: 15,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};
export function Message({ count = 0 }) {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div>message:</div>
      <div style={style.count} data-testid="message-count">
        {count}
      </div>
    </div>
  );
}
