import { h } from 'preact';
import { List, ListItem } from '../layout/NavList';
import { useUserName } from '../auth/useUserName';
import { useRootRouteContext } from '../route/root-router';
import {useAppRoute} from '../app-context/app-context'
import {actionTypes} from '../app-context/actionTypes'
export function OtherContent() {
  const [rootRoute, setRootRoute] = useRootRouteContext();
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
      setRootRoute('/auth');
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
