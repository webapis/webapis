import { h } from 'preact'
import Mobile from './Hangout'
import { HangoutsProvider } from './state/HangoutsProvider'
export default function () {
    return <HangoutsProvider socketUrl="ws://localhost:3000/hangouts">
        <Mobile />
    </HangoutsProvider>

}