import { h } from 'preact';

import '../css/style.css';
export function MenuWhite({ onClick,device }) {


  function handleOnClick() {
    console.log('dev',device)
    switch (device) {
      case 'phone':
        onClick('/phone');
        break;
      case 'tablet':
        onClick('/tablet');
        break;
      case 'laptop':
        onClick('/laptop');
        break;
      case 'desktop':
        onClick('/desktop');
        break;
      default:
       null;
    }
  }

  return (
    <svg
      onClick={handleOnClick}
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
