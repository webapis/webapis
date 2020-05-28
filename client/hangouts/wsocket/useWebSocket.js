import { useWebSocketContext } from './WebSocketProvider';
import { useState } from 'preact/hooks';
import { status } from '../state/status';
import { actionTypes } from '../state/useHangouts';
export function useWebSocket({ target, dispatch }) {
  const [message, setMessage] = useState('');
  const { socket } = useWebSocketContext();
  function onInvite() {
    dispatch({
      type: actionTypes.CONTACT_STATE_CHANGED,
      username: target,
      state: status.INVITEE,
    });
    let hangouts = {
      message,
      state: status.INVITEE,
      username: target,
    };

    socket.send(JSON.stringify(hangouts));
  }

  function onAccept() {
    dispatch({
      type: actionTypes.CONTACT_STATE_CHANGED,
      username: target,
      state: status.CHAT,
    });
    let hangouts = {
      message,
      state: status.CHAT,
      username: target,
    };
    socket.send(JSON.stringify(hangouts));
  }

  function onDecline() {
    dispatch({
      type: actionTypes.CONTACT_STATE_CHANGED,
      username: target,
      state: status.DECLINED,
    });
    let hangouts = { state: status.DECLINED, username: target };
    socket.send(JSON.stringify(hangouts));
  }

  function onBlock() {
    dispatch({
      type: actionTypes.CONTACT_STATE_CHANGED,
      username: target,
      state: status.BLOCKED,
    });
    let hangouts = { state: status.BLOCKED, username: target };
    socket.send(JSON.stringify(hangouts));
  }

  function onUnblock() {
    dispatch({
      type: actionTypes.CONTACT_STATE_CHANGED,
      username: target,
      state: status.CHAT,
    });
    let hangouts = { state: status.CHAT, username: target };
    socket.send(JSON.stringify(hangouts));
  }

  function onChange(e) {
    const { value } = e.target;
    setMessage(value);
  }

  function sendMessage() {
    try {
      let hangouts = {
        type: contactStatus.MESSAGE,
        username: target,
        message,
      };
      debugger;
      socket.send(JSON.stringify(hangouts));
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
