import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import { useState } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/hooks.module.js";
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
