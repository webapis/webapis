export const acknowledgmentTypes = {
    INVITED: 'INVITED',
    ACCEPTED: 'ACCEPTED',
    BLOCKED: 'BLOCKED',
    UNBLOCKED: 'UNBLOCKED',
    DECLINED: 'DECLINED',
    MESSAGED: 'MESSAGED'
}


export const messagesFromServer = {
    BLOCKER: 'BLOCKER',
    HANGCHAT: 'HANGCHAT',
    UNBLOCKER: 'UNBLOCKER',
    INVITER: 'INVITER',
    DECLINER: 'DECLINER',
    MESSANGER: 'MESSANGER'

}

export const messageToServer = {
    HANGCHAT: 'HANGCHAT',
    DECLINE: 'DECLINE',
    INVITE: 'INVITE',
    BlOCK: 'BlOCK',
    UNBLOCK: 'UNBLOCK',
    MESSAGE: 'MESSAGE'

}
// server side message
export const messageCategories={
    ACKNOWLEDGEMENT:'ACKNOWLEDGEMENT',
    PEER:'PEER'
}