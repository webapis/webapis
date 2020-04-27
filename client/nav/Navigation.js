import { h } from 'preact';
import { Suspense, lazy } from 'preact/compat';
import { useState, useEffect, useReducer } from 'preact/hooks';
import { useThemeContext } from '../theme/theme-context';
import './css/style.css';
import { MenuWhite } from './icons/MenuWhite';
import { AppShell } from '../layout/AppShell';
import { AppBar } from '../layout/AppBar';
import { useMediaQuery } from '../layout/useMediaQuery';
const PhoneDrawer = lazy(() => import('./PhoneDrawer'));
const TabletDrawer = lazy(() => import('./TabletDrawer'));
const LaptopDrawer = lazy(() => import('./LapTopDrawer'));
const DesktopDrawer = lazy(() => import('./DesktopDrawer'));

export default function Navigation(props) {
  const [route, setRoute] = useState('');
  const { width, height, orientation, device } = useMediaQuery();
  const [open, setOpen] = useState(false);
  const { children, drawerContent } = props;

  const theme = useThemeContext();

  function toggleDrawer(to) {
    setRoute(to);
    setOpen((prev) => !prev);
  }

  return (
    <AppShell>
      {route === '/phone' && open ? (
        <Suspense fallback={<div>Loading...</div>}>
          <PhoneDrawer onClick={toggleDrawer}>{drawerContent}</PhoneDrawer>
        </Suspense>
      ) : null}
      {route === '/tablet' && open ? (
        <Suspense fallback={<div>Loading...</div>}>
          <TabletDrawer onClick={toggleDrawer}>{drawerContent}</TabletDrawer>
        </Suspense>
      ) : null}
      {route === '/laptop' && open ? (
        <Suspense fallback={<div>loading...</div>}>
          <LaptopDrawer onClick={toggleDrawer}>{drawerContent}</LaptopDrawer>
        </Suspense>
      ) : null}
      {route === '/desktop' && open ? (
        <Suspense fallback={<div>Loading...</div>}>
          <DesktopDrawer onClick={toggleDrawer}>{drawerContent}</DesktopDrawer>{' '}
        </Suspense>
      ) : null}
      <AppBar>
        <MenuWhite onClick={toggleDrawer} device={device} id="menu" />
        {children}
      </AppBar>
    </AppShell>
  );
}

export function NavItem(props) {
  const { children } = props;
  return <div className='nav-item'>{children}</div>;
}
