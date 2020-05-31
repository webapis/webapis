export const acknowledgmentTypes = {
    OFFERED: 'OFFERED',
    ACCEPTED: 'ACCEPTED',
    BLOCKED: 'BLOCKED',
    UNBLOCKED: 'UNBLOCKED',
    DECLINED: 'DECLINED',
    MESSAGED: 'MESSAGED'
}


export const messagesFromServer = {
    BLOCKER: 'BLOCKER',
    ACCEPTER: 'ACCEPTER',
    UNBLOCKER: 'UNBLOCKER',
    OFFERER: 'OFFERER',
    DECLINER: 'DECLINER',
    MESSANGER: 'MESSANGER'

}

export const messageToServer = {
    ACCEPT: 'ACCEPT',
    DECLINE: 'DECLINE',
    OFFER: 'OFFER',
    BlOCK: 'BlOCK',
    UNBLOCK: 'UNBLOCK',
    MESSAGE: 'MESSAGE'

}
// server side message
export const messageCategories={
    ACKNOWLEDGEMENT:'ACKNOWLEDGEMENT',
    PEER:'PEER'
}