import { useEffect } from 'preact/hooks'
import { actionTypes } from './actionTypes'
import { acknowledgmentTypes, messagesFromServer, messageCategories } from './messageTypes'
export function useSocket({ socket, dispatch }) {

    useEffect(() => {

        if (socket) {
            socket.onmessage = (message) => {
                const msg = JSON.parse(message.data)
                switch (msg.category) {
                    case messageCategories.ACKNOWLEDGEMENT:
                        handleAckhowledgements({ dispatch, msg })
                    case messageCategories.PEER:
                        handlePeerMessages({ dispatch, msg })
                    default:
                        throw new Error('Message cateory is not defined')
                }
            }
            socket.onclose = () => {

            }

            socket.onerror = (error) => {

            }
        }

    }, [socket])

}


function handleAckhowledgements({ dispatch, msg }) {
    switch (msg.type) {
        case acknowledgmentTypes.ACCEPTED:
            dispatch({ type: actionTypes.ACCEPT_SUCCESS, msg })
        case acknowledgmentTypes.BLOCKED:
            dispatch({ type: actionTypes.BLOCK_SUCCESS, msg })
        case acknowledgmentTypes.DECLINED:
            dispatch({ type: actionTypes.DECLINE_SUCCESS, msg })
        case acknowledgmentTypes.MESSAGED:
            dispatch({ type: actionTypes.MESSAGE_SUCCESS, msg })
        case acknowledgmentTypes.OFFERED:
            dispatch({ type: actionTypes.OFFER_SUCCESS, msg })
        case acknowledgmentTypes.UNBLOCKED:
            dispatch({ type: actionTypes.UNBLOCK_SUCCESS, msg })
        default:
            throw new Error('Message type for acknowledgmentTypes is not defined')
    }
}

function handlePeerMessages({ dispatch, msg }) {
    switch (msg.type) {
        case messagesFromServer.BLOCKER:
            dispatch({ type: actionTypes.BLOCKER_RECIEVED, msg })
        case messagesFromServer.DECLINER:
            dispatch({ type: actionTypes.DECLINER_RECIEVED, msg })
        case messagesFromServer.MESSANGER:
            dispatch({ type: actionTypes.MESSANGER_RECIVED, msg })
        case messagesFromServer.OFFERER:
            dispatch({ type: actionTypes.OFFERER_RECIEVED, msg })
        case messagesFromServer.UNBLOCKER:
            dispatch({ type: actionTypes.UNBLOCKER_RECIEVED, msg })
        case messagesFromServer.ACCEPTER:
            dispatch({ type: actionTypes.ACCEPTER_RECIEVED, msg })
        default:
            throw new Error('Message type for messagesFromServer is not defined')
    }

}