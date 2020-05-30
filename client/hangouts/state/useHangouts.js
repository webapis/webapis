import { h } from 'preact'
import { useEffect } from 'preact/hooks'
import { useHangoutContext } from './HangoutsProvider'
import { selectHangout } from './actions'
import { actionTypes } from './actionTypes'

export function useHangout() {
    const [state, dispatch] = useHangoutContext()
    const { hangout, hangouts, socket } = state

    useEffect(() => {
        if (socket) {
            socket.onmessage = (message) => {
                const msg = JSON.parse(message.data)
                switch (msg.state) {
                    case 'ACCEPTED':
                        dispatch({ type: actionTypes.HANGOUT_STATE_CHANGED, hangout: msg })
                    case 'INVITED':
                        dispatch({ type: actionTypes.HANGOUT_STATE_CHANGED, hangout: msg })
                    case 'DECLINED':
                        dispatch({ type: actionTypes.HANGOUT_STATE_CHANGED, hangout: msg })
                    case 'BLOCKED':
                        dispatch({ type: actionTypes.HANGOUT_STATE_CHANGED, hangout: msg })
                    case 'UNBLOCKED':
                        dispatch({ type: actionTypes.HANGOUT_STATE_CHANGED, hangout: { ...msg, state: 'ACCEPTED' } })
                    default:
                        throw new Error('hangout state not defined')
                }
            }
        }
    }, [socket])

    function onSelectHangout({ username }) {
        selectHangout({ dispatch, username })
    }
    function onInvite() {
        socket.send(JSON.stringify({ ...hangout, state: 'INVITE' }))
    }
    function onAccept() {
        socket.send(JSON.stringify({ ...hangout, state: 'ACCEPT' }))
    }
    function onBlock() {
        socket.send(JSON.stringify({ ...hangout, state: 'BLOCK' }))
    }
    function onUnblock() {
        socket.send(JSON.stringify({ ...hangout, state: 'UNBLOCK' }))
    }
    function onDecline() {
        socket.send(JSON.stringify({ ...hangout, state: 'DECLINE' }))
    }
    return { onInvite, onAccept, onBlock, onUnblock, onSelectHangout, onDecline, hangout, hangouts }
}
