import { useWSocketContext } from './wsocket-context';
import { useState } from 'preact/hooks';
export const messageType = {
  INVITE: 'INVITE',
  ACCEPT: 'ACCEPT',
  DECLINE: 'DECLINE',
  BLOCK: 'BLOCK',
  UNBLOCK: 'UNBLOCK',
  MESSAGE: 'MESSAGE',
};

export function useWsocketChat({ username, target }) {
  const [message, setMessage] = useState('');
  const { socket } = useWSocketContext();
  function onInvite() {
    let msg = {
      message,
      type: messageType.INVITE,
      username,
      target,
      path: 'chat',
    };
  
    socket.send(JSON.stringify(msg));
  }

  function onAccept() {
    let msg = {
      message,
      type: messageType.ACCEPT,
      username,
      target,
      path: 'chat',
    };
    socket.send({ message: JSON.stringify(msg) });
  }

  function onDecline() {
    let msg = { type: messageType.DECLINE, username, target, path: 'chat' };
    socket.send({ message: JSON.stringify(msg) });
  }

  function onBlock() {
    let msg = { type: messageType.BLOCK, username, target, path: 'chat' };
    socket.send({ message: JSON.stringify(msg) });
  }

  function onUnblock() {
    let msg = { type: messageType.UNBLOCK, username, target, path: 'chat' };
    socket.send({ message: JSON.stringify(msg) });
  }

  function onChange(e) {
    const { value } = e.target;
    setMessage(value);
  }

  function sendMessage() {
    try {
      let msg = {
        type: messageType.MESSAGE,
        username,
        target,
        message,
        path: 'chat',
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
