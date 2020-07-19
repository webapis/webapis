import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
const style = {
  width: 15,
  height: 15,

  border: "white 2px solid",
};
export function OnlineStatus({ readyState }) {
  if (readyState === 1) {
    return <IsOnline />;
  } else if (readyState === 0) {
    return <Connecting />;
  } else if (readyState === 2) {
    return <Closing />;
  }
  return <IsOffline />;
}

export function IsOnline() {
  return (
    <div
      style={{ ...style, backgroundColor: "green" }}
      data-testid="online"
    ></div>
  );
}

export function IsOffline() {
  return (
    <div
      style={{ ...style, backgroundColor: "red" }}
      data-testid="offline"
    ></div>
  );
}

export function Connecting() {
  return (
    <div
      style={{ ...style, backgroundColor: "orange" }}
      data-testid="connecting"
    ></div>
  );
}

export function Closing() {
  return (
    <div
      style={{ ...style, backgroundColor: "pink" }}
      data-testid="closing"
    ></div>
  );
}
