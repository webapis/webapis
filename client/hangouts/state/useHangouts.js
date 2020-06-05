import { h } from 'preact';
import { useHangoutContext } from './HangoutsProvider';
import { useAuthContext } from '../../auth/auth-context';
import { useWSocketContext } from '../../wsocket/WSocketProvider';
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
  const { socket } = socketContext;
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

  function onInvite() {
    const { username, email } = hangout;
    const updatedHangout = {
      username,
      email,
      message: { text: messageText, timestamp: Date.now() },
    };
    socket.send(
      JSON.stringify({ ...updatedHangout, command: clientCommands.INVITE })
    );
    startClientCommand({ dispatch });
  }
  function onAccept() {
    const { username, email } = hangout;
    debugger;
    socket.send(
      JSON.stringify({ username, email, command: clientCommands.ACCEPT })
    );
    startClientCommand({ dispatch });
  }
  function onBlock() {
    socket.send(JSON.stringify({ ...hangout, command: clientCommands.BLOCK }));
    startClientCommand({ dispatch });
  }
  function onUnblock() {
    socket.send(
      JSON.stringify({ ...hangout, command: clientCommands.UNBLOCK })
    );
    startClientCommand({ dispatch });
  }
  function onDecline() {
    socket.send(
      JSON.stringify({ ...hangout, command: clientCommands.DECLINE })
    );
    startClientCommand({ dispatch });
  }

  function onMessage() {
    socket.send(
      JSON.stringify({ ...hangout, command: clientCommands.MESSAGE })
    );
    startClientCommand({ dispatch });
    saveMessage({ dispatch, hangout: { ...hangout, message } });
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
    changeMessageText({ dispatch, text: e.target.value });
  }

  return {
    onMessageText,
    messageText,
    onStartSearch,
    onSearch,
    search,
    onMessage,
    onInvite,
    onAccept,
    onBlock,
    onUnblock,
    onSelectHangout,
    onSelectUser,
    onDecline,
    hangout,
    hangouts,
    users,
    username,
    messages,
  };
}
