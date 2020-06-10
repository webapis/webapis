import { h } from 'preact'
import { useEffect } from 'preact/hooks'
import { actionTypes } from './actionTypes'
export function useUnread({ unread, dispatch }) {

    useEffect(() => {
        if (unread) {
            dispatch({ type: actionTypes.UNREAD_RECIEVED, unread: reducerUnread() })
        }
    }, [unread])

    function reducerUnread() {
        return null
    }

    return {}
}






