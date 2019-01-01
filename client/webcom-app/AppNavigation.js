import { h } from 'preact';
import {useEffect} from 'preact/hooks'
import { Suspense, lazy } from 'preact/compat';
import { NavItem } from '../nav/NavItem';
import { DrawerContent } from '../components/DrawerContent';
import { AuthDrawerContent } from '../auth/AuthDrawerContent';
import { HangoutDrawerContent } from '../hangouts/nav/HangoutDrawerContent';
import { HangoutTopMenu } from '../hangouts/nav/HangoutTopMenu';
import { useAuthContext } from '../auth/auth-context';
import { recoverLocalAuthState } from '../auth/actions';
import Drawer from '../nav/Drawer';
import { AppBar } from '../nav/AppBar';
import { Menu } from '../nav/Menu';
export function AppNavigation() {
    const { dispatch } = useAuthContext();


    useEffect(() => {
        if (localStorage.getItem('webcom')) {
          recoverLocalAuthState({
            dispatch,
            user: JSON.parse(localStorage.getItem('webcom')),
          });
        }
      }, []);
  return (
    <div>
      <AppBar>
        <Menu />
        <NavItem style={{ flex: 5 }}>WEB COM</NavItem>
        <HangoutTopMenu />
      </AppBar>
      <Drawer>
        <AuthDrawerContent />
        <HangoutDrawerContent />
      </Drawer>
    </div>
  );
}
