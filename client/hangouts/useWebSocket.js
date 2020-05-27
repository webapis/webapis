import { useWebSocketContext } from './WebSocketProvider';
import { useState } from 'preact/hooks';
import { status } from './contacts/status';
import { actionTypes } from './contacts/useContacts';
export function useWebSocket({target, dispatch }) {
  const [message, setMessage] = useState('');
  const { socket } = useWebSocketContext();
  function onInvite() {
    dispatch({
      type: actionTypes.CONTACT_STATE_CHANGED,
      username: target,
      state: status.INVITEE,
    });
    let contact = {
      message,
      state: status.INVITEE,
      username: target,
    };

    socket.send(JSON.stringify(contact));
  }

  function onAccept() {
    dispatch({
      type: actionTypes.CONTACT_STATE_CHANGED,
      username: target,
      state: status.CHAT,
    });
    let contact = {
      message,
      state: status.CHAT,
      username: target,
    };
    socket.send(JSON.stringify(contact));
  }

  function onDecline() {
    dispatch({
      type: actionTypes.CONTACT_STATE_CHANGED,
      username: target,
      state: status.DECLINED,
    });
    let contact = { state: status.DECLINED,   username: target };
    socket.send(JSON.stringify(contact));
  }

  function onBlock() {
    dispatch({
      type: actionTypes.CONTACT_STATE_CHANGED,
      username: target,
      state: status.BLOCKED,
    });
    let contact = { state: status.BLOCKED,  username: target };
    socket.send(JSON.stringify(contact));
  }

  function onUnblock() {
    dispatch({
      type: actionTypes.CONTACT_STATE_CHANGED,
      username: target,
      state: status.CHAT,
    });
    let contact = { state: status.CHAT,   username: target };
    socket.send(JSON.stringify(contact) );
  }

  function onChange(e) {
    const { value } = e.target;
    setMessage(value);
  }

  function sendMessage() {
    try {
      let contact = {
        type: contactStatus.MESSAGE,
        username: target,
        message,
      };
      debugger;
      socket.send(JSON.stringify(contact));
    } catch (error) {
      const err = error;
      debugger;
    }
  }
  return {
    onInvite,
    onAccept,
    onDecline,
    onBlock,
    onUnblock,
    onChange,
    message,
    sendMessage,
  };
}
