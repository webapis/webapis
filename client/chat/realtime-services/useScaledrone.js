import { useState, useEffect } from 'preact/hooks';
export function useScaledrone({ channelid }) {
  const [drone, setDrone] = useState(null);
  const [connectionState, setConnectionState] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (drone) {
      const room = drone.subscribe('invitations');
      room.on('open', (error) => {
        if (error) {
          setError(error);
        }
        setConnectionState('open');
        // Connected to room
      });

      room.on('message', (message) => {
        // Received a message sent to the room
        setMessage(message.data);
      });

      drone.on('close', (event) => {
        setConnectionState('closed');
      });
      drone.on('error', (error) => {
        setError(error);
      });
    }
  }, [drone]);

  function connect() {
    setDrone(new Scaledrone(channelid));
  }

  function subscribe() {
    setRoom();
  }

  return { drone, connect, subscribe, error, message, connectionState };
}
