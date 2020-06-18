import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { drawer } from './style';
import { useMediaQuery } from '../layout/useMediaQuery';
import { useNavigation } from './NavProvider';
export default function Drawer(props) {
  const { width, height, orientation, device } = useMediaQuery();
  const { open, onClick, children } = props;
  const { drawerOpen, toggleDrawer } = useNavigation();

  if (drawerOpen)
    return (
      <div
        style={{ ...drawer }}
        className={`drawer-${device}-width`}
        onClick={toggleDrawer}
      >
        {children}
      </div>
    );
  return null;
}
