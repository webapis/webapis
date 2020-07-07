import { h } from "preact";
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
