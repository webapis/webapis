import { h } from 'preact';
import {useEffect} from 'preact/hooks'
import { NavItem } from '../nav/NavItem';
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
         
       const user =JSON.parse(localStorage.getItem('webcom'))
    
          recoverLocalAuthState({
            dispatch,
            user
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
