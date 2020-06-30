import { h } from 'preact';
import List, { ListItem } from '../../components/list/index';
import { useUserName } from '../../auth/useUserName';
import {useAppRoute} from '../../app-route/AppRouteProvider'
import {actionTypes} from '../../app-route/actionTypes'
export default function HangoutDrawerContent() {

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
