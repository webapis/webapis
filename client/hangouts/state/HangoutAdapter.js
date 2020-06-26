import { h } from 'preact'
import { ParseServer } from './parse/ParseServer'
import { WebSocketContainer } from './websocket/WebSocketContainer'



export function HangoutAdapter(props) {
    if (PREACT_APP_BACK === 'PREACT_APP_PARSE') {
        return <ParseServer {...props} />
    }
    else if (PREACT_APP_BACK === 'PREACT_APP_NODEJS') {
        return <WebSocketContainer {...props} />
    }

    else return null;
}