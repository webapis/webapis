import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";

export function MenuWhite({ onClick, id }) {
  return (
    <svg
      data-testid={id}
      onClick={onClick}
      className="menu-white"
      viewBox="0 0 24 24"
      fill="white"
      width="24px"
      height="24px"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
    </svg>
  );
}
