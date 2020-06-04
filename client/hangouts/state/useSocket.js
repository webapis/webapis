import { useEffect } from 'preact/hooks';
import { actionTypes } from './actionTypes';
import { updateAcknowledgement, messageToNewHangout } from './messageConverter';
import { messagesFromServer, messageCategories } from './messageTypes';
import { useWSocketContext } from '../../wsocket/WSocketProvider';

export function useSocket({ dispatch, username }) {
  const socketContext = useWSocketContext();
  const { socket } = socketContext


  useEffect(() => {
    if (socket) {
      socket.onmessage = (message) => {
        const hangout = JSON.parse(message.data);

      };
      socket.onclose = () => {
        ;
      };
      socket.onerror = (error) => {
        ;
      };
      socket.onopen = () => {
        ;
      };
    }
  }, [socket]);

  return null;
  
}

function hangoutHangout({hangout, username}){
//if hangout exists update localStorage
//if hangout new push to localStorage
//if hangouts empty push to localStorage
// dispatch hangout state change event
}






