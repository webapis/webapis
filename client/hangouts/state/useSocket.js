import { useEffect } from 'preact/hooks';
import { actionTypes } from './actionTypes';
import { messageToHangout, messageToNewHangout } from './messageConverter';
import { useHangoutContext } from './HangoutsProvider';
import { messagesFromServer, messageCategories } from './messageTypes';
import { useWSocketContext } from '../../wsocket/WSocketProvider';
export function useSocket() {
  const [state, dispatch] = useHangoutContext();
  const {hangout}=state
  const socketContext = useWSocketContext();
const {socket}=socketContext
  useEffect(() => {
    if (socket) {
      socket.onmessage = (message) => {
        debugger
        const msg = JSON.parse(message.data);
        debugger;
        switch (msg.category) {
          case messageCategories.ACKNOWLEDGEMENT:
            debugger;
            handleAckhowledgements({ dispatch, msg, hangout });
          case messageCategories.PEER:
            handlePeerMessages({ dispatch, msg, hangout });
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
  }, [socket]);

  return null;
}

function handleAckhowledgements({ dispatch, msg, hangout }) {
  debugger;
  let updatedHangout = messageToHangout({ hangout, message: msg });
  dispatch({
    type: actionTypes.ACKNOWLEDGEMENT_RECIEVED,
    hangout: updatedHangout,
  });
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
  const hangouts = localStorage.getItem(key);
  const updated = hangouts.map((g) => {
    if (g.username === hangout.username) {
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
