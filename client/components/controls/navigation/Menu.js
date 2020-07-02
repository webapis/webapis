import { h } from 'preact';
import { MenuWhite } from './icons/MenuWhite';
export function Menu({onClick}) {


  return <MenuWhite onClick={onClick} id="menu" />;
}
