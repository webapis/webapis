import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
export default function Chat() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    setSocket(new WebSocket('wss://localhost:3000/chat'));
  }, []);

  useEffect(() => {
    if (socket) {
      socket.onopen = () => {
        console.log('connection open');
      };

      socket.onmessage = (data) => {
        console.log('message', data);
      };
    }
  }, [socket]);
  function handleConnection() {
    debugger;
    socket.send('hello');
  }

  return (
    <div>
      <button onClick={handleConnection}>send</button>
      Chat View
    </div>
  );
}
