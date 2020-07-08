import { hangoutStates } from './hangoutStates'
import { clientCommands } from '../../client/features/hangouts/state/clientCommands'
export function stateMapper({ command }) {
    switch (command) {
        case clientCommands.ACCEPT:
            return {
                senderState: hangoutStates.ACCEPTED,
                targetState: hangoutStates.ACCEPTER
            }
        case clientCommands.BLOCK:
            return {
                senderState: hangoutStates.BLOCKED,
                targetState: hangoutStates.BLOCKER
            }
        case clientCommands.DECLINE:
            return {
                senderState: hangoutStates.DECLINED,
                targetState: hangoutStates.DECLINER
            }
        case clientCommands.INVITE:
            return {
                senderState: hangoutStates.INVITED,
                targetState: hangoutStates.INVITER
            }
        case clientCommands.MESSAGE:
            return {
                senderState: hangoutStates.MESSAGED,
                targetState: hangoutStates.MESSANGER
            }
   
        case clientCommands.UNBLOCK:
            return {
                senderState: hangoutStates.UNBLOCKED,
                targetState: hangoutStates.UNBLOCKER
            }
        default:
            
            throw new Error('clientCommand type not specified')
    }
}