import { useWebSocketContext } from './WebSocketProvider';
import { useState } from 'preact/hooks';
import { status } from '../state/status';
import { useHangouts } from '../state/useHangouts';
export function useWebSocket({ target }) {
  const [message, setMessage] = useState('');
  const {updateHangsoutState}=useHangouts()
  const { socket } = useWebSocketContext();
  function onInvite() {
    updateHangsoutState({state:status.INVITEE,username})
    let hangouts = {
      message,
      state: status.INVITEE,
      username: target,
    };
    socket.send(JSON.stringify(hangouts));
  }

  function onAccept() {
    updateHangsoutState({state:status.CHAT,username})
    let hangouts = {
      message,
      state: status.CHAT,
      username: target,
    };
    socket.send(JSON.stringify(hangouts));
  }

  function onDecline() {
    updateHangsoutState({state:status.DECLINED,username})
    let hangouts = { state: status.DECLINED, username: target };
    socket.send(JSON.stringify(hangouts));
  }

  function onBlock() {
    updateHangsoutState({state:status.BLOCKED,username})
    let hangouts = { state: status.BLOCKED, username: target };
    socket.send(JSON.stringify(hangouts));
  }

  function onUnblock() {
    updateHangsoutState({state:status.CHAT,username})
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
