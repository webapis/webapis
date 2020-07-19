import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import GearIcon from "icons/bootstrap/GearIcon";
const styles = {
  root: {
    backgroundColor: "#eeeeee",
    height: "100%",
    position: "relative",
  },
};
export default function Layout({ children, style, id, hangout, onNavigation }) {
  return (
    <div data-testid={id} style={{ ...styles.root, ...style }}>
      {children}
    </div>
  );
}
