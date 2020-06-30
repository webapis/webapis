import { h } from 'preact';
import {useEffect,useState} from 'preact/hooks'
import { NavItem } from '../nav/NavItem';
import { AuthDrawerContent } from '../auth/AuthDrawerContent';
import  HangoutDrawerContent  from '../hangouts/nav/HangoutDrawerContent';
import { HangoutTopMenu } from '../hangouts/nav/HangoutTopMenu';
import { useAuthContext } from '../auth/auth-context';
import { recoverLocalAuthState } from '../auth/actions';
import Drawer from '../nav/Drawer';
import { AppBar } from '../nav/AppBar';
import { Menu } from '../nav/Menu';
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