import { h } from 'preact';
import { List, ListItem } from '../layout/NavList';
import { useUserName } from '../auth/useUserName';
import {useAppRoute} from '../app-route/AppRouteProvider'
import {actionTypes} from '../app-route/actionTypes'
export function OtherContent() {

const {onAppRoute} =useAppRoute()

  const { userName } = useUserName();

  function handleRoute(e) {
    e.preventDefault();
    const { id } = e.target;
    if (userName) {
     debugger;
    //  setRootRoute(`/${id}`);
      onAppRoute({type:actionTypes.APP_ROUTE_CHANGED, featureRoute:'/hangouts',route:'/hangouts'})
    } else {

      onAppRoute({type:actionTypes.APP_ROUTE_CHANGED, featureRoute:'/login',route:'/auth'})
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
        <ListItem onClick={handleRoute} id='chat'>
          Chat
        </ListItem>
        <ListItem>Item Two</ListItem>

        <ListItem onClick={handleRoute} id='hangouts'>
          Hangout
        </ListItem>
        <ListItem onClick={handleRoute} id='group'>
          Group
        </ListItem>
      </List>
    </div>
  );
}
