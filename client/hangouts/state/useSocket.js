import { useEffect } from 'preact/hooks'
import { actionTypes } from './actionTypes'
import { messageToHangout, messageToNewHangout } from './messageConverter'
import { messagesFromServer, messageCategories } from './messageTypes'
export function useSocket({ socket, dispatch, hangout }) {

    useEffect(() => {
        if (socket) {
            socket.onmessage = (message) => {
                const msg = JSON.parse(message.data)
                switch (msg.category) {
                    case messageCategories.ACKNOWLEDGEMENT:
                        handleAckhowledgements({ dispatch, msg,hangout })
                    case messageCategories.PEER:
                        handlePeerMessages({ dispatch, msg, hangout })
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


function handleAckhowledgements({ dispatch, msg,hangout }) {
    let updatedHangout = messageToHangout({ hangout, message: msg })
    dispatch({ type: actionTypes.ACKNOWLEDGEMENT_RECIEVED, hangout: updatedHangout })
    updateHangoutStateInLocalStorage(`${username}-hangouts`, updatedHangout)
}

function handlePeerMessages({ dispatch, msg, hangout }) {
    let updatedHangout = messageToHangout({ hangout, message: msg })
    let newHangout =messageToNewHangout(msg)
    switch (msg.type) {
        case messagesFromServer.BLOCKER:
        case messagesFromServer.DECLINER:
        case messagesFromServer.MESSANGER:
        case messagesFromServer.UNBLOCKER:
        case messagesFromServer.ACCEPTER:
            dispatch({ type: actionTypes.HANGOUT_CHANGED_ITS_STATE, hangout:updatedHangout })
            updateHangoutStateInLocalStorage(`${username}-hangouts`, updatedHangout)
            case messagesFromServer.OFFERER:
                dispatch({ type: actionTypes.HANGOUT_CHANGED_ITS_STATE, hangout:newHangout })
                addNewHangoutToLocalStorage(`${username}-hangouts`, updatedHangout)
        default:
            throw new Error('Message type for messagesFromServer is not defined')
    }

}


function updateHangoutStateInLocalStorage(key, hangout) {
    const hangouts = localStorage.getItem(key);
    const updated = hangouts.map((g) => {
        if (g.username === hangout.username) {
            return hangout
        }
        else {
            return g
        }
    })
    localStorage.setItem(key, JSON.stringify(updated))
}

function addNewHangoutToLocalStorage(key, hangout) {
    const hangouts = localStorage.getItem(key);
    const inserted = hangouts.push(hangout)
    localStorage.setItem(key, JSON.stringify(inserted))

}