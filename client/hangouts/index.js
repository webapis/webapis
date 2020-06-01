import { h } from 'preact'
import Mobile from './mobile'
import { HangoutsProvider } from './state/HangoutsProvider'
import { RouteProvider, useRouteContext } from '../route/router';
export default function () {
    return <HangoutsProvider socketUrl="ws://localhost:3000/hangouts">
         <RouteProvider initialRoute="/hangouts">
         <Mobile />

         </RouteProvider>
    
    </HangoutsProvider>

}