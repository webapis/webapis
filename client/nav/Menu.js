import { h } from 'preact';
import { useNavigation } from './NavProvider';
import { MenuWhite } from './icons/MenuWhite';
export function Menu() {
  const { drawerOpen, toggleDrawer } = useNavigation();

  return <MenuWhite onClick={toggleDrawer} id="menu" />;
}
