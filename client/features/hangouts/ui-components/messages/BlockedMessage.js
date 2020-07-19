import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
const style = {
  color: "red",
  float: "right",
  width: "100%",
  fontSize: 16,
  textAlign: "end",
};
export function BlockedMessage({ message, onNavigation }) {
  function handleNavigation(e) {
    e.preventDefault();
    onNavigation(e);
  }

  return (
    <div style={style} data-testid="blocked-message">
      {message.text}
      <a
        id="UNBLOCK"
        data-testid="seemore-btn"
        href="/"
        onClick={handleNavigation}
      >
        see more
      </a>
    </div>
  );
}
