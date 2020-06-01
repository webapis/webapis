import { h } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { useHangoutContext } from './HangoutsProvider'
import { selectHangout,searchHangouts } from './actions'
import { actionTypes } from './actionTypes'
import { messageToServer, messageCategories } from './messageTypes'

export function useHangouts() {
    const [state, dispatch] = useHangoutContext()
   

    const { hangout, hangouts, socket,search } = state

    function onSelect(e) {
        const username=e.target.id
        debugger;
        selectHangout({ dispatch,username })
    }
    function onInvite() {
        socket.send(JSON.stringify({ ...hangout, type: messageToServer.OFFER }))
        dispatch({ type: actionTypes.OFFER_STARTED, hangout })
    }
    function onAccept() {
        socket.send(JSON.stringify({ ...hangout, type: messageToServer.ACCEPT }))
        dispatch({ type: actionTypes.ACCEPT_STARTED, hangout })
    }
    function onBlock() {
        socket.send(JSON.stringify({ ...hangout, type: messageToServer.BlOCK }))
        dispatch({ type: actionTypes.BLOCK_STARTED, hangout })
    }
    function onUnblock() {
        socket.send(JSON.stringify({ ...hangout, type: messageToServer.UNBLOCK }))
        dispatch({ type: actionTypes.UNBLOCK_STARTED, hangout })
    }
    function onDecline() {
        socket.send(JSON.stringify({ ...hangout, type: messageToServer.DECLINE }))
        dispatch({ type: actionTypes.DECLINE_STARTED, hangout })
    }

    function onMessage() {
        socket.send(JSON.stringify({ ...hangout, type: messageToServer.MESSAGE }))
        dispatch({ type: actionTypes.MESSAGE_STARTED, hangout })
    }

    function onSearch(e){
       
        searchHangouts({search:e.target.value,dispatch})
    }
    return {onSearch,search, onMessage, onInvite, onAccept, onBlock, onUnblock, onSelect, onDecline, hangout, hangouts }
}
