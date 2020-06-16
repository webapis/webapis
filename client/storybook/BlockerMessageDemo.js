import {h} from 'preact'
import {BlockerMessage} from '../hangouts/message-ui/BlockerMessage'

const message ={text:'You can not send message because you are blocked',
timestamp:12323,
username:'demo'
}
export function BlockerMessageDemo(){
    return <BlockerMessage message={message}/>
}