import { h } from "preact";
import { useState } from "preact/hooks";
import { drawer } from "./style";
import { useMediaQuery } from "components/layout/useMediaQuery";

export default function Drawer(props) {
  const [pinned, setPinned] = useState(false);
  const { width, height, orientation, device } = useMediaQuery();
  const { open, onClick, children, style } = props;
  return (
    <div
      style={{ ...drawer, position: device === "phone" ? "fixed" : "relative" }}
      className={`drawer-${device}-width`}
    >
      <div>{children}</div>
    </div>
  );
  return null;
}
