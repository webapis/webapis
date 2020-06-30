import { h } from 'preact'
import {useState}from 'preact/hooks'
import Drawer from '../nav/Drawer';
import { AppBar } from '../nav/AppBar';
import { Menu } from '../nav/Menu';
import { NavItem } from '../nav/NavItem';
import StorybookRoutes from './StorybookRoutes'
import StorybookDrawerContent from './StorybookDrawerContent'
import {useMediaQuery} from '../layout/useMediaQuery'
export default function StorybookNavigation() {
    const [drawerIsOpen,setDrawerState]=useState(false)

    const {device}=useMediaQuery()
    function toggleDrawer(){

        setDrawerState(prev=>!prev)
    }

    return (
        <div style={{display:'flex',position:'fixed',width:'100%'}}>
          {drawerIsOpen &&  <Drawer  style={{position:'absolute'}} toggleDrawer={toggleDrawer}>
                <StorybookDrawerContent drawerIsOpen={drawerIsOpen} toggleDrawer={toggleDrawer} />  
            </Drawer> }
            <div style={{flex:1}} >
            <AppBar >
                <Menu onClick={toggleDrawer} />
                <NavItem style={{ flex: 5 }}>Storybook</NavItem>
            </AppBar>
        
            <StorybookRoutes/>
         
            </div>
        </div>
    )
}