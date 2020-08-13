import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import { MenuWhite } from "./icons/MenuWhite";
export function Menu({ onClick }) {
  return <MenuWhite onClick={onClick} id="menu" />;
}
