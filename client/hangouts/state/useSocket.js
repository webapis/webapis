import { useEffect } from 'preact/hooks';
import { actionTypes } from './actionTypes';
import { updateAcknowledgement, messageToNewHangout } from './messageConverter';
import { messagesFromServer, messageCategories } from './messageTypes';
import { useWSocketContext } from '../../wsocket/WSocketProvider';

export function useSocket({dispatch,hangout,username}) {
  const socketContext = useWSocketContext();
const {socket}=socketContext


  useEffect(() => {
    if (socket && hangout) {
      socket.onmessage = (message) => {
        debugger
        const msg = JSON.parse(message.data);
        debugger;
        switch (msg.category) {
          case messageCategories.ACKNOWLEDGEMENT:
            debugger;
            handleAckhowledgements({ dispatch, acknowledgement:msg, hangout, username });
            break;
          case messageCategories.PEER:
            handlePeerMessages({ dispatch, msg, hangout });
            break;
          default:
            throw new Error('Message cateory is not defined');
        }
      };
      socket.onclose = () => {
        debugger;
      };
      socket.onerror = (error) => {
        debugger;
      };
      socket.onopen = () => {
        debugger;
      };
    }
  }, [socket, hangout]);

  return null;
}

function handleAckhowledgements({ dispatch, acknowledgement, hangout,username }) {
  debugger;
  let updatedHangout = updateAcknowledgement({ hangout,acknowledgement });
  debugger;
  dispatch({
    type: actionTypes.ACKNOWLEDGEMENT_RECIEVED,
    hangout: updatedHangout,
  });
  debugger;
  updateHangoutStateInLocalStorage(`${username}-hangouts`, updatedHangout);
}

function handlePeerMessages({ dispatch, msg, hangout }) {
  let updatedHangout = messageToHangout({ hangout, message: msg });
  let newHangout = messageToNewHangout(msg);
  switch (msg.type) {
    case messagesFromServer.BLOCKER:
    case messagesFromServer.DECLINER:
    case messagesFromServer.MESSANGER:
    case messagesFromServer.UNBLOCKER:
    case messagesFromServer.ACCEPTER:
      dispatch({
        type: actionTypes.HANGOUT_CHANGED_ITS_STATE,
        hangout: updatedHangout,
      });
      updateHangoutStateInLocalStorage(`${username}-hangouts`, updatedHangout);
    case messagesFromServer.INVITER:
      dispatch({
        type: actionTypes.HANGOUT_CHANGED_ITS_STATE,
        hangout: newHangout,
      });
      addNewHangoutToLocalStorage(`${username}-hangouts`, updatedHangout);
    default:
      throw new Error('Message type for messagesFromServer is not defined');
  }
}

function updateHangoutStateInLocalStorage(key, hangout) {
  debugger
  const hangouts =JSON.parse( localStorage.getItem(key));
  const updated = hangouts.map((g) => {
    if (g.username === hangout.username) {
      debugger
      return hangout;
    } else {
      return g;
    }
  });
  localStorage.setItem(key, JSON.stringify(updated));
}

function addNewHangoutToLocalStorage(key, hangout) {
  const hangouts = localStorage.getItem(key);
  const inserted = hangouts.push(hangout);
  localStorage.setItem(key, JSON.stringify(inserted));
}
