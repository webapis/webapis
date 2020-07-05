import {h} from 'preact'
import List,{ListItem } from 'controls/list';
import {useAppRoute} from 'components/app-route'
export default function AuthDemoDrawer(){
    const {onAppRoute}=useAppRoute()

    function handleRoute(e) {
      const { id } = e.target;
      onAppRoute({featureRoute:'/',route:`/${id}`})
     
  
    }
    return (
        <div style={{padding:3}}>
    
        <List>
          <ListItem id="button" onClick={handleRoute}>
            Button
          </ListItem>
      
          </List>
          </div>

    )
}