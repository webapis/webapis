import { h } from 'preact'
import { lazy, Suspense } from 'preact/compat'
import { RouteProvider, Route } from '../route/router'
import { useHangout } from './state/useHangouts'
const Hangouts = lazy(() => import('./Hangout'))
const Block = lazy(() => import('./state-ui/Block'))
const Blocked = lazy(() => import('./state-ui/Blocked'))
const Configure = lazy(() => import('./state-ui/Configure'))
const Hangchat = lazy(() => import('./state-ui/Hangchat'))
const Invite = lazy(() => import('./state-ui/Invite'))
const Invitee = lazy(() => import('./state-ui/Invitee'))
const Inviter = lazy(() => import('./state-ui/Inviter'))

export default function Mobile() {
    const { hangout, hangouts,onAccept,onBlock,onInvite,onSelectHangout,onUnblock } = useHangout()
    return (<RouteProvider initialRoute="/hangouts">
        <Route path="/hangouts">
            <Suspense fallback={<div>Loading...</div>}>
                <Hangouts hangouts={hangouts} onSelect={onSelectHangout} />
            </Suspense>
        </Route>
        <Route path="/block">
            <Suspense fallback={<div>Loading...</div>}>
                <Block hangout={hangout} onBlock={onBlock}/>
            </Suspense>
        </Route>
        <Route path="/blocked">
            <Suspense fallback={<div>Loading...</div>}>
                <Blocked hangout={hangout} onUnblock={onUnblock}/>
            </Suspense>
        </Route>
        <Route path="/configure">
            <Suspense fallback={<div>Loading...</div>}>
                <Configure hangout={hangout} />
            </Suspense>
        </Route>
        <Route path="/hangchat">
            <Suspense fallback={<div>Loading...</div>}>
                <Hangchat />
            </Suspense>
        </Route>
        <Route path="/Invite">
            <Suspense fallback={<div>Loading...</div>}>
                <Invite hangout={hangout} onInvite={onInvite}/>
            </Suspense>
        </Route>
        <Route path="/Invitee">
            <Suspense fallback={<div>Loading...</div>}>
                <Invitee hangout={hangout}  />
            </Suspense>
        </Route>
        <Route path="/Inviter">
            <Suspense fallback={<div>Loading...</div>}>
                <Inviter hangout={hangout} onAccept={onAccept}  />
            </Suspense>
        </Route>
    </RouteProvider>
    )
}