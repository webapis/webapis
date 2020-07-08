import { h } from "preact";
import GearIcon from 'icons/bootstrap/GearIcon'
const styles = {
  root: {
    backgroundColor: "#eeeeee",
    height: "100%",
    position: 'relative'
  },
};
export default function Layout({ children, style, id, hangout, onNavigation }) {
  return (
    <div data-testid={id} style={{ ...styles.root, ...style }}>
 
      {children}
    </div>
  );
}
