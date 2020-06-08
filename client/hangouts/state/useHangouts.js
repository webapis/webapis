import { h } from 'preact';
import { useHangoutContext } from './HangoutsProvider';
import { useAuthContext } from '../../auth/auth-context';
import { useWSocketContext } from '../../wsocket/WSocketProvider';
import { updateLocalHangouts } from './updateLocalHangouts'
import {
  selectHangout,
  searchHangouts,
  filterHangouts,
  fetchHangout,
  selectUser,
  changeMessageText,
  startClientCommand,
  saveMessage,
} from './actions';
import { useSocket } from './useSocket';
import { clientCommands } from './clientCommands';

export function useHangouts() {
  const socketContext = useWSocketContext();
  const { socket } = socketContext[0]
  const authContext = useAuthContext();
  const { username } = authContext.state;
  const [state, dispatch] = useHangoutContext();
  const { hangout, hangouts, search, users, messageText, messages } = state;
  const handleSocket = useSocket({ dispatch, hangout, username });
  function onSelectHangout(e) {
    const username = e.target.id;
    selectHangout({ dispatch, username });
  }
  function onSelectUser(e) {
    const uname = e.target.id;
    const user = users.find((u) => u.username === uname);
    selectUser({ dispatch, user, username });
  }
  function onSearch(e) {
    searchHangouts({ search: e.target.value, dispatch });
  }
  function onStartSearch(e) {
    if (hangouts && hangouts.length > 0) {
      filterHangouts({ dispatch });
    }
    fetchHangout({ dispatch, search, username });
  }
  function onMessageText(e) {
    const text = e.target.value
    changeMessageText({ dispatch, text });
  }
  function onHangout(e) {
  
    const command = e.target.id
    const { username, email } = hangout;
    let message = null
    if (messageText) {
      message = { text: messageText, timestamp: Date.now() };
      saveMessage({ dispatch, hangout, message, target: username, username: authContext.state.username });
    }
    const updatedHangout = {
      username,
      email,
      message,
    };
    socket.send(
      JSON.stringify({ ...updatedHangout, command })
    );
    updateLocalHangouts({ hangout, username, devivered: 'pending' })
  }
  return {
    onMessageText,
    messageText,
    onStartSearch,
    onSearch,
    search,
    onSelectHangout,
    onSelectUser,
    hangout,
    hangouts,
    users,
    username,
    messages,
    onHangout
  };
}
