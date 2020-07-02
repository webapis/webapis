import { h } from 'preact';
import List, { ListItem } from 'controls/list';
import { useUserName } from 'features/authentication/state/useUserName';
import {useAppRoute} from 'components/app-route'
import {actionTypes} from 'components/app-route/actionTypes'
import {useMediaQuery} from 'components/layout/useMediaQuery'
export default function HangoutDrawerContent({toggleDrawer}) {
const {device}=useMediaQuery()
const {onAppRoute} =useAppRoute()

  const { username } = useUserName();

  function handleRoute(e) {
    e.preventDefault();
    const { id } = e.target;
    if (username) {

      onAppRoute({type:actionTypes.APP_ROUTE_CHANGED, featureRoute:'/hangouts',route:'/hangouts'})
    
    } else {

      onAppRoute({type:actionTypes.APP_ROUTE_CHANGED, featureRoute:'/login',route:'/auth'})
    }

    if(device==='phone'){
      toggleDrawer()
    }
  }
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <List>
        <ListItem onClick={handleRoute} data-testid='hangouts'>
          Hangout
        </ListItem>
 
      </List>
    </div>
  );
}
