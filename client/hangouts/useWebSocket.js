import { useWebSocketContext } from './WebSocketProvider';
import { useState } from 'preact/hooks';
import { status } from './contacts/status';
import { actionTypes } from './contacts/useContacts';
export function useWebSocket({ username, target, dispatch }) {
  const [message, setMessage] = useState('');
  const { socket } = useWebSocketContext();
  function onInvite() {
    dispatch({
      type: actionTypes.CONTACT_STATE_CHANGED,
      username: target,
      state: status.INVITEE,
    });
    let msg = {
      message,
      type: status.INVITEE,
      target,
    };

    socket.send(JSON.stringify(msg));
  }

  function onAccept() {
    dispatch({
      type: actionTypes.CONTACT_STATE_CHANGED,
      username: target,
      state: status.CHAT,
    });
    let msg = {
      message,
      type: status.CHAT,
      target,
    };
    socket.send({ message: JSON.stringify(msg) });
  }

  function onDecline() {
    dispatch({
      type: actionTypes.CONTACT_STATE_CHANGED,
      username: target,
      state: status.DECLINED,
    });
    let msg = { type: status.DECLINED, target };
    socket.send({ message: JSON.stringify(msg) });
  }

  function onBlock() {
    dispatch({
      type: actionTypes.CONTACT_STATE_CHANGED,
      username: target,
      state: status.BLOCKED,
    });
    let msg = { type: status.BLOCKED, target };
    socket.send({ message: JSON.stringify(msg) });
  }

  function onUnblock() {
    dispatch({
      type: actionTypes.CONTACT_STATE_CHANGED,
      username: target,
      state: status.CHAT,
    });
    let msg = { type: status.CHAT, target };
    socket.send({ message: JSON.stringify(msg) });
  }

  function onChange(e) {
    const { value } = e.target;
    setMessage(value);
  }

  function sendMessage() {
    try {
      let msg = {
        type: contactStatus.MESSAGE,
        target,
        message,
      };
      let strMgs = JSON.stringify(msg);
      debugger;
      socket.send(JSON.stringify(strMgs));
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
