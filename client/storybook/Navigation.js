import { h } from 'preact';
import { Suspense, lazy } from 'preact/compat';
import { useState } from 'preact/hooks';
import { useThemeContext } from '../theme/theme-context';
//import './css/style.css';
import { MenuWhite } from '../nav/icons/MenuWhite';
import { AppShell } from '../layout/AppShell';
import { AppBar } from '../layout/AppBar';
import { useMediaQuery } from '../layout/useMediaQuery';
import DesktopDrawer from '../nav/DesktopDrawer';

export default function Navigation(props) {
  const [route, setRoute] = useState('');
  const [open, setOpen] = useState(false);
  const { children, drawerContent } = props;

  const theme = useThemeContext();
  function toggleDrawer(to) {
    debugger;
    setRoute(to);
    setOpen((prev) => !prev);
  }
  return (
    <div>
      <h1 style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
        Storybook
      </h1>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>{drawerContent}</div>
        <div style={{ flex: 10 }}>{children}</div>
      </div>
    </div>
  );
}

export function NavItem(props) {
  const { children } = props;
  return <div className="nav-item">{children}</div>;
}
