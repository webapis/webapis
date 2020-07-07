import { h } from 'preact'
import { AppRoute } from 'components/app-route';
import { OnlineStatus } from 'icons/onlineStatus';
import { IconsDemo } from './IconsDemo'
import AuthDemoRoutes from './authentication/route'
import ComponentsRoutes from './components/route'
import HangoutRoutes from './hangout/route'

// const hangouts = [
//   { username: 'userone' },
//   { username: 'usertwo' },
//   { username: 'userthree' },
// ];
// const hangout = {
//   username: 'testuser',
//   email: 'test@gmail.com',
//   message: { text: `Let's chat on Hangout!`, timestamp: 1590820782921 },
// };
// const message = {
//   username: 'breno',
//   text: `Let's Chat on Hangout!`,
//   timestamp: 1591331767836,
// };
// //

export default function StorybookRoutes() {
  return (
    <div style={{ height: '85vh'}}>
      <AppRoute path="/online">
        <div>
          <OnlineStatus online />
          <OnlineStatus />
        </div>
      </AppRoute>
  
    

      <AppRoute path="/icons">
        <IconsDemo />
      </AppRoute>
      <AuthDemoRoutes/>
      <ComponentsRoutes/>
      <HangoutRoutes/>
    </div>

  )
}