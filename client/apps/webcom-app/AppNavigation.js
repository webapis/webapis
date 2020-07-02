import { h } from 'preact';
import {useEffect,useState} from 'preact/hooks'
import { NavItem } from 'controls/navigation/NavItem';
import { AuthDrawerContent } from 'features/authentication/ui-components/AuthDrawerContent';
import  HangoutDrawerContent  from 'features/hangouts/ui-components/nav/HangoutDrawerContent';
import { HangoutTopMenu } from 'features/hangouts/ui-components/nav/HangoutTopMenu';
import { useAuthContext } from 'features/authentication/state/auth-context';
import { recoverLocalAuthState } from 'features/authentication/state/actions';
import Drawer from 'controls/navigation/Drawer';
import { AppBar } from 'controls/navigation/AppBar';
import { Menu } from 'controls/navigation/Menu';
import {AppRoutes} from './AppRoutes'


export  function AppNavigation() {
  const [drawerIsOpen,setDrawerState]=useState(false)

  
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
  function toggleDrawer(){

      setDrawerState(prev=>!prev)
  }

  return (
      <div style={{display:'flex',width:'100%',height:'100%'}}>
        {drawerIsOpen &&  <Drawer  style={{position:'absolute'}} toggleDrawer={toggleDrawer}>

              <AuthDrawerContent  toggleDrawer={toggleDrawer} />
              <HangoutDrawerContent  toggleDrawer={toggleDrawer} />
          </Drawer> }
          <div style={{flex:1}} >
          <AppBar >
              <Menu onClick={toggleDrawer} />
              <NavItem style={{ flex: 5 }}>WEB COM</NavItem>
             <HangoutTopMenu />
          </AppBar>
         
          <AppRoutes/>
      
          </div>
      </div>
  )
}