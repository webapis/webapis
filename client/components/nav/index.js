import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import { useAppRoute } from "components/app-route";

export default function Nav(props) {
  const { children, horizontalAlignment } = props;

  return (
    <ul
      className={`nav ${horizontalAlignment && horizontalAlignment}`}
      {...props}
    >
      {children}
    </ul>
  );
}
