import { useWebSocketContext } from './WebSocketProvider';
import { useState } from 'preact/hooks';
import { hangoutStates } from '../state/hangoutStates';
import { useHangouts } from '../state/useHangouts';
export function useWebSocket() {
  const [message, setMessage] = useState('');
  const {updateHangsoutState, hangout}=useHangouts()
  const { socket } = useWebSocketContext();
  const {username}= hangout
  function onInvite() {
    updateHangsoutState({state:hangoutStates.INVITEE,username})
    let hangouts = {
      message,
      state: hangoutStates.INVITEE,
      username
    };
    socket.send(JSON.stringify(hangouts));
  }

  function onAccept() {
    updateHangsoutState({state:hangoutStates.CHAT,username})
    let hangouts = {
      message,
      state: hangoutStates.CHAT,
      username
    };
    socket.send(JSON.stringify(hangouts));
  }

  function onDecline() {
    updateHangsoutState({state:hangoutStates.DECLINED,username})
    let hangouts = { state: hangoutStates.DECLINED, username };
    socket.send(JSON.stringify(hangouts));
  }

  function onBlock() {
    updateHangsoutState({state:hangoutStates.BLOCKED,username})
    let hangouts = { state: hangoutStates.BLOCKED, username };
    socket.send(JSON.stringify(hangouts));
  }

  function onUnblock() {
    updateHangsoutState({state:hangoutStates.CHAT,username})
    let hangouts = { state: hangoutStates.CHAT, username };
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
        username,
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
