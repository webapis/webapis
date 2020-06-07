import { M, u as useAuthContext, m, p, s, h, _ as _extends, T, a as useWSocketContext, b as useRouteContext, R as Route, U, L, c as RouteProvider } from './index-9c9eda07.js';

const actionTypes = {
  MESSAGE_TEXT_CHANGED: 'MESSAGE_TEXT_CHANGED',
  LOAD_HANGOUTS: 'LOAD_HANGOUTS',
  LOADED_MESSAGES: 'LOADED_MESSAGES',
  SAVED_MESSAGE_LOCALLY: 'SAVED_MESSAGE_LOCALLY',
  SEARCHED_HANGOUT: 'SEARCHED_HANGOUT',
  SELECTED_HANGOUT: 'SELECTED_HANGOUT',
  SELECTED_USER: 'SELECTED_USER',
  FILTER_HANGOUTS: 'FILTER_HANGOUTS',
  FETCH_HANGOUT_STARTED: 'FETCH_HANGOUT_STARTED',
  FETCH_HANGOUT_SUCCESS: 'FETCH_HANGOUT_SUCCESS',
  FETCH_HANGOUT_FAILED: 'FETCH_HANGOUT_FAILED',
  FETCH_HANGOUT_NOT_FOUND: 'FETCH_HANGOUT_NOT_FOUND',
  FETCH_USER_STARTED: 'FETCH_USER_STARTED',
  FETCH_USER_SUCCESS: 'FETCH_USER_SUCCESS',
  FETCH_USER_FAILED: 'FETCH_USER_FAILED',
  ONLINE_STATE_CHANGED: 'ONLINE_STATE_CHANGED',
  HANGOUT_STATE_CHANGED: 'HANGOUT_STATE_CHANGED',
  NEW_HANGOUT_RECIEVED: 'NEW_HANGOUT_RECIEVED',
  CLIENT_COMMAND_STARTED: 'CLIENT_COMMAND_STARTED',
  CLIENT_COMMAND_SUCCESS: 'CLIENT_COMMAND_SUCCESS',
  CLIENT_COMMAND_FAILED: 'CLIENT_COMMAND_FAILED'
};

const initState = {
  hangouts: [],
  hangout: null,
  messages: null,
  search: '',
  user: [],
  loading: false,
  error: null,
  messageText: '',
  online: false
};
function reducer(state, action) {
  switch (action.type) {
    case actionTypes.SAVED_MESSAGE_LOCALLY:
      if (state.messages) {
        return { ...state,
          messages: [...state.messages, action.message]
        };
      } else {
        return { ...state,
          messages: [action.message]
        };
      }

    case actionTypes.LOADED_MESSAGES:
      return { ...state,
        messages: action.messages
      };

    case actionTypes.MESSAGE_TEXT_CHANGED:
      return { ...state,
        messageText: action.text
      };

    case actionTypes.FETCH_USER_FAILED:
    case actionTypes.FETCH_HANGOUT_FAILED:
      return { ...state,
        loading: false,
        error: action.error
      };

    case actionTypes.FETCH_USER_STARTED:
      return { ...state,
        loading: true
      };

    case actionTypes.FETCH_USER_SUCCESS:
      return { ...state,
        loading: false,
        users: action.users
      };

    case actionTypes.FETCH_HANGOUT_STARTED:
      return { ...state,
        loading: true
      };

    case actionTypes.FETCH_HANGOUT_SUCCESS:
      return { ...state,
        loading: false,
        hangouts: action.hangouts
      };

    case actionTypes.HANGOUT_NOT_FOUND:
      return { ...state,
        loading: false
      };

    case actionTypes.FILTER_HANGOUTS:
      return { ...state,
        hangouts: state.hangouts.filter(g => g.username.includes(state.search))
      };

    case actionTypes.SEARCHED_HANGOUT:
      return { ...state,
        search: action.search
      };

    case actionTypes.LOAD_HANGOUTS:
      return { ...state,
        hangouts: action.hangouts
      };

    case actionTypes.SELECTED_USER:
      if (state.hangouts) {
        return { ...state,
          hangouts: [...state.hangouts, action.hangout],
          hangout: action.hangout
        };
      }

      return { ...state,
        hangouts: [action.hangout],
        hangout: action.hangout
      };

    case actionTypes.SELECTED_HANGOUT:
      return { ...state,
        hangout: state.hangouts.find(g => g.username === action.username)
      };

    case actionTypes.HANGOUT_STATE_CHANGED:
      return { ...state,
        hangout: action.hangout,
        hangouts: state.hangouts.map(g => {
          if (g.username === action.hangout.username) {
            return action.hangout;
          } else {
            return g;
          }
        })
      };

    case actionTypes.NEW_HANGOUT_RECIEVED:
      return { ...state,
        hangouts: [...state.hangouts, action.hangout]
      };

    default:
      return state;
  }
}

function loadHangouts({
  username,
  dispatch
}) {
  const hangouts = JSON.parse(localStorage.getItem(`${username}-hangouts`));
  dispatch({
    type: actionTypes.LOAD_HANGOUTS,
    hangouts
  });
} //select hangout from List

function selectHangout({
  dispatch,
  username
}) {
  dispatch({
    type: actionTypes.SELECTED_HANGOUT,
    username
  });
}
function selectUser({
  dispatch,
  user,
  username
}) {
  // save selected user to hangouts
  const hangout = { ...user,
    state: 'INVITE'
  };
  const hangouts = JSON.parse(localStorage.getItem(`${username}-hangouts`));

  if (hangouts) {
    localStorage.setItem(`${username}-hangouts`, JSON.stringify([...hangouts, hangout]));
  } else {
    localStorage.setItem(`${username}-hangouts`, JSON.stringify([hangout]));
  }

  dispatch({
    type: actionTypes.SELECTED_USER,
    hangout
  });
} //search for hangout by typing into TextInput

function searchHangouts({
  search,
  dispatch
}) {
  dispatch({
    type: actionTypes.SEARCHED_HANGOUT,
    search
  });
} //filter hangout after search state change

function filterHangouts({
  dispatch
}) {
  dispatch({
    type: actionTypes.FILTER_HANGOUTS
  });
} //fetch hangout from server if not found in local hangouts

async function fetchHangout({
  search,
  dispatch,
  username
}) {
  try {
    dispatch({
      type: actionTypes.FETCH_HANGOUT_STARTED
    });
    const response = await fetch(`/hangouts/find?search=${search}&username=${username}`);

    if (response.ok) {
      const {
        hangouts
      } = await response.json();

      if (hangouts.length > 0) {
        dispatch({
          type: actionTypes.FETCH_HANGOUT_SUCCESS,
          hangouts
        });
      } else {
        dispatch({
          type: actionTypes.FETCH_HANGOUT_NOT_FOUND
        }); // fetch user from server in hangout is newuser

        fetchUser({
          search,
          dispatch
        });
      }
    } else {
      dispatch({
        type: actionTypes.FETCH_HANGOUT_NOT_FOUND
      }); // fetch user from server in hangout is newuser

      fetchUser({
        search,
        dispatch
      });
    }
  } catch (error) {
    dispatch({
      type: actionTypes.FETCH_HANGOUT_FAILED,
      error
    });
  }
} // fetch user from server in hangout is newuser

async function fetchUser({
  search,
  dispatch
}) {
  try {
    dispatch({
      type: actionTypes.FETCH_USER_STARTED
    });
    const response = await fetch(`/users/find?search=${search}`);
    const {
      users
    } = await response.json();
    dispatch({
      type: actionTypes.FETCH_USER_SUCCESS,
      users
    });
  } catch (error) {
    dispatch({
      type: actionTypes.FETCH_USER_FAILED,
      error
    });
  }
}
function changeMessageText({
  text,
  dispatch
}) {
  dispatch({
    type: actionTypes.MESSAGE_TEXT_CHANGED,
    text
  });
}
function startClientCommand({
  dispatch
}) {
  dispatch({
    type: actionTypes.CLIENT_COMMAND_STARTED
  });
}
function loadMessages({
  hangout,
  dispatch
}) {
  const {
    username
  } = hangout;
  const key = `${username}-messages`;
  const messages = JSON.parse(localStorage.getItem(key));
  dispatch({
    type: actionTypes.LOADED_MESSAGES,
    messages
  });
}
function saveMessage({
  dispatch,
  message,
  username,
  target
}) {
  const key = `${target}-messages`;
  const messages = JSON.parse(localStorage.getItem(key));

  if (messages) {
    localStorage.setItem(key, JSON.stringify([...messages, { ...message,
      username
    }]));
  } else {
    localStorage.setItem(key, JSON.stringify([{ ...message,
      username
    }]));
  }

  dispatch({
    type: actionTypes.SAVED_MESSAGE_LOCALLY,
    message
  });
}

const HangoutContext = M();
function useHangoutContext() {
  const context = T(HangoutContext);

  if (!context) {
    throw new Error('useHangoutContext must be used with HangoutsProvider');
  }

  return context;
}
function HangoutsProvider(props) {
  const authContext = useAuthContext();
  const {
    username
  } = authContext.state;
  const [state, dispatch] = m(reducer, initState);
  const {
    hangout
  } = state;
  p(() => {
    if (username) {
      loadHangouts({
        username,
        dispatch
      });
    }
  }, [username]);
  p(() => {
    if (hangout) {
      //from local storage
      loadMessages({
        dispatch,
        hangout
      }); //save hangout to localStorage

      const key = `${username}-hangouts`;
      const hangouts = JSON.parse(localStorage.getItem(key));

      if (!hangouts) {
        localStorage.setItem(key, JSON.stringify([hangout]));
      } else {
        const hangoutExist = hangouts.find(g => g.username === hangout.username);

        if (hangoutExist) {
          const updated = hangouts.map(g => {
            if (g.username === hangout.username) {
              return hangout;
            } else {
              return g;
            }
          });
          localStorage.setItem(key, JSON.stringify(updated));
        } else {
          localStorage.setItem(key, JSON.stringify([hangout]));
        }
      }
    }
  }, [hangout]);
  const value = s(() => [state, dispatch], [state]);
  return h(HangoutContext.Provider, _extends({
    value: value
  }, props));
}

const hangoutStates = {
  INVITER: 'INVITER',
  ACCEPTER: 'ACCEPTER',
  DECLINER: 'DECLINER',
  BLOCKER: 'BLOCKER',
  UNBLOCKER: 'UNBLOCKER',
  MESSANGER: 'MESSANGER',
  // acknowlegement
  INVITED: 'INVITED',
  ACCEPTED: 'ACCEPTED',
  DECLINED: 'DECLINED',
  BLOCKED: 'BLOCKED',
  UNBLOCKED: 'UNBLOCKED',
  MESSAGED: 'MESSAGED'
};

//is sent by client
const clientCommands = {
  INVITE: 'INVITE',
  ACCEPT: 'ACCEPT',
  DECLINE: 'DECLINE',
  BLOCK: 'BLOCK',
  UNBLOCK: 'UNBLOCK',
  MESSAGE: 'MESSAGE',
  ONLINE: 'ONLINE'
};

function useSocket({
  dispatch,
  username
}) {
  const socketContext = useWSocketContext();
  const {
    socket
  } = socketContext[0];
  p(() => {
    if (socket && username) {
      socket.onmessage = message => {
        const hangout = JSON.parse(message.data);
        debugger;
        handleHangoutState({
          hangout,
          username,
          dispatch
        });
      };

      socket.onclose = () => {};

      socket.onerror = error => {};

      socket.onopen = () => {
        debugger;
      };
    }
  }, [socket, username]);
  return null;
}

function handleHangoutState({
  hangout,
  username,
  dispatch
}) {
  const key = `${username}-hangouts`;
  debugger;
  const target = hangout.username;
  const hangouts = JSON.parse(localStorage.getItem(key));
  debugger;
  let updatedState = null;

  switch (hangout.state) {
    case hangoutStates.ACCEPTER:
    case hangoutStates.BLOCKED:
    case hangoutStates.BLOCKER:
    case hangoutStates.DECLINED:
    case hangoutStates.DECLINER:
    case hangoutStates.MESSAGED:
    case hangoutStates.MESSANGER:
    case hangoutStates.UNBLOCKED:
    case hangoutStates.UNBLOCKER:
    case hangoutStates.INVITED:
    case hangoutStates.ACCEPTED:
      updatedState = hangouts.map(g => {
        if (g.username === target) {
          return hangout;
        } else return g;
      });
      localStorage.setItem(key, JSON.stringify(updatedState));
      dispatch({
        type: actionTypes.HANGOUT_STATE_CHANGED,
        hangout
      });
      break;

    case hangoutStates.INVITER:
      if (hangouts) {
        debugger;
        localStorage.setItem(key, JSON.stringify(hangouts.push(hangout)));
      } else {
        debugger;
        localStorage.setItem(key, JSON.stringify([hangout]));
      }

      dispatch({
        type: actionTypes.NEW_HANGOUT_RECIEVED,
        hangout
      });
      break;

    default:
      throw new Error("hangoutState not defined");
  }
}

function useHangouts() {
  const socketContext = useWSocketContext();
  const {
    socket
  } = socketContext[0];
  const authContext = useAuthContext();
  const {
    username
  } = authContext.state;
  const [state, dispatch] = useHangoutContext();
  const {
    hangout,
    hangouts,
    search,
    users,
    messageText,
    messages
  } = state;
  const handleSocket = useSocket({
    dispatch,
    hangout,
    username
  });

  function onSelectHangout(e) {
    const username = e.target.id;
    selectHangout({
      dispatch,
      username
    });
  }

  function onSelectUser(e) {
    const uname = e.target.id;
    const user = users.find(u => u.username === uname);
    selectUser({
      dispatch,
      user,
      username
    });
  }

  function onInvite() {
    const {
      username,
      email
    } = hangout;
    const message = {
      text: messageText,
      timestamp: Date.now()
    };
    const updatedHangout = {
      username,
      email,
      message
    };
    socket.send(JSON.stringify({ ...updatedHangout,
      command: clientCommands.INVITE
    }));
    startClientCommand({
      dispatch
    });
  }

  function onAccept() {
    const {
      username,
      email
    } = hangout;
    debugger;
    socket.send(JSON.stringify({
      username,
      email,
      command: clientCommands.ACCEPT
    }));
    startClientCommand({
      dispatch
    });
  }

  function onBlock() {
    socket.send(JSON.stringify({ ...hangout,
      command: clientCommands.BLOCK
    }));
    startClientCommand({
      dispatch
    });
  }

  function onUnblock() {
    socket.send(JSON.stringify({ ...hangout,
      command: clientCommands.UNBLOCK
    }));
    startClientCommand({
      dispatch
    });
  }

  function onDecline() {
    socket.send(JSON.stringify({ ...hangout,
      command: clientCommands.DECLINE
    }));
    startClientCommand({
      dispatch
    });
  }

  function onMessage() {
    const {
      username,
      email
    } = hangout;
    const message = {
      text: messageText,
      timestamp: Date.now()
    };
    const updatedHangout = {
      username,
      email,
      message
    };
    socket.send(JSON.stringify({ ...updatedHangout,
      command: clientCommands.MESSAGE
    }));
    startClientCommand({
      dispatch
    });
    saveMessage({
      dispatch,
      hangout,
      message,
      target: username,
      username: authContext.state.username
    });
  }

  function onSearch(e) {
    searchHangouts({
      search: e.target.value,
      dispatch
    });
  }

  function onStartSearch(e) {
    if (hangouts && hangouts.length > 0) {
      filterHangouts({
        dispatch
      });
    }

    fetchHangout({
      dispatch,
      search,
      username
    });
  }

  function onMessageText(e) {
    const text = e.target.value;
    changeMessageText({
      dispatch,
      text
    });
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
    messages
  };
}

const Hangouts = L(() => import('./Hangout-f1a62073.js'));
const Block = L(() => import('./Block-9414f0b6.js'));
const Blocked = L(() => import('./Blocked-fbe09472.js'));
const Configure = L(() => import('./Configure-3155cedb.js'));
const Hangchat = L(() => import('./Hangchat-3c493bb9.js'));
const Invite = L(() => import('./Invite-f7fdc073.js'));
const Invitee = L(() => import('./Invitee-111a72a8.js'));
const Inviter = L(() => import('./Inviter-a3e8cca5.js'));
function Mobile() {
  const [route, setRoute] = useRouteContext();
  const {
    hangout,
    hangouts,
    onAccept,
    onBlock,
    onInvite,
    onSelectHangout,
    onSelectUser,
    onUnblock,
    onSearch,
    users,
    search,
    onStartSearch,
    onMessageText,
    onMessage,
    messageText,
    username,
    messages
  } = useHangouts();
  p(() => {
    if (hangout) {
      setRoute(`/${hangout.state}`);
    }
  }, [hangout]);
  return h("div", {
    style: {
      height: '85vh'
    }
  }, h(Route, {
    path: "/hangouts"
  }, h(U, {
    fallback: h("div", null, "Loading...")
  }, h(Hangouts, {
    users: users,
    search: search,
    hangouts: hangouts,
    onSelectHangout: onSelectHangout,
    onSelectUser: onSelectUser,
    onSearch: onSearch,
    onStartSearch: onStartSearch
  }))), h(Route, {
    path: "/BLOCK"
  }, h(U, {
    fallback: h("div", null, "Loading...")
  }, h(Block, {
    hangout: hangout,
    onBlock: onBlock
  }))), h(Route, {
    path: "/BLOCKED"
  }, h(U, {
    fallback: h("div", null, "Loading...")
  }, h(Blocked, {
    hangout: hangout,
    onUnblock: onUnblock
  }))), h(Route, {
    path: "/configure"
  }, h(U, {
    fallback: h("div", null, "Loading...")
  }, h(Configure, {
    hangout: hangout
  }))), h(Route, {
    paths: ["/ACCEPTED", "/ACCEPTER", "/MESSANGER", "/MESSAGED"]
  }, h(U, {
    fallback: h("div", null, "Loading...")
  }, h(Hangchat, {
    onMessageText: onMessageText,
    onMessage: onMessage,
    messages: messages,
    username: username
  }))), h(Route, {
    path: "/INVITE"
  }, h(U, {
    fallback: h("div", null, "Loading...")
  }, h(Invite, {
    hangout: hangout,
    onInvite: onInvite,
    onMessageText: onMessageText,
    messageText: messageText
  }))), h(Route, {
    path: "/INVITED"
  }, h(U, {
    fallback: h("div", null, "Loading...")
  }, h(Invitee, {
    hangout: hangout
  }))), h(Route, {
    path: "/INVITER"
  }, h(U, {
    fallback: h("div", null, "Loading...")
  }, h(Inviter, {
    hangout: hangout,
    onAccept: onAccept
  }))));
}

function index () {
  return h(HangoutsProvider, null, h(RouteProvider, {
    initialRoute: "/hangouts"
  }, h(Mobile, null)));
}

export default index;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtOGVjOWE2ZTEuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25UeXBlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9yZWR1Y2VyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL2FjdGlvbnMuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvSGFuZ291dHNQcm92aWRlci5qcyIsIi4uLy4uLy4uL3NlcnZlci9oYW5nb3V0cy9oYW5nb3V0U3RhdGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL2NsaWVudENvbW1hbmRzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL3VzZVNvY2tldC5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS91c2VIYW5nb3V0cy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9tb2JpbGUuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IGFjdGlvblR5cGVzID0ge1xyXG4gICAgTUVTU0FHRV9URVhUX0NIQU5HRUQ6J01FU1NBR0VfVEVYVF9DSEFOR0VEJyxcclxuICAgIExPQURfSEFOR09VVFM6ICdMT0FEX0hBTkdPVVRTJyxcclxuICAgIExPQURFRF9NRVNTQUdFUzogJ0xPQURFRF9NRVNTQUdFUycsXHJcbiAgICBTQVZFRF9NRVNTQUdFX0xPQ0FMTFk6J1NBVkVEX01FU1NBR0VfTE9DQUxMWScsXHJcbiAgICBTRUFSQ0hFRF9IQU5HT1VUOiAnU0VBUkNIRURfSEFOR09VVCcsXHJcbiAgICBTRUxFQ1RFRF9IQU5HT1VUOiAnU0VMRUNURURfSEFOR09VVCcsXHJcbiAgICBTRUxFQ1RFRF9VU0VSOidTRUxFQ1RFRF9VU0VSJyxcclxuICAgIEZJTFRFUl9IQU5HT1VUUzonRklMVEVSX0hBTkdPVVRTJyxcclxuXHJcbiAgICBGRVRDSF9IQU5HT1VUX1NUQVJURUQ6ICdGRVRDSF9IQU5HT1VUX1NUQVJURUQnLFxyXG4gICAgRkVUQ0hfSEFOR09VVF9TVUNDRVNTOiAnRkVUQ0hfSEFOR09VVF9TVUNDRVNTJyxcclxuICAgIEZFVENIX0hBTkdPVVRfRkFJTEVEOiAnRkVUQ0hfSEFOR09VVF9GQUlMRUQnLFxyXG4gICAgRkVUQ0hfSEFOR09VVF9OT1RfRk9VTkQ6ICdGRVRDSF9IQU5HT1VUX05PVF9GT1VORCcsXHJcblxyXG5cclxuICAgIEZFVENIX1VTRVJfU1RBUlRFRDogJ0ZFVENIX1VTRVJfU1RBUlRFRCcsXHJcbiAgICBGRVRDSF9VU0VSX1NVQ0NFU1M6ICdGRVRDSF9VU0VSX1NVQ0NFU1MnLFxyXG4gICAgRkVUQ0hfVVNFUl9GQUlMRUQ6ICdGRVRDSF9VU0VSX0ZBSUxFRCcsXHJcblxyXG4gICAgT05MSU5FX1NUQVRFX0NIQU5HRUQ6ICdPTkxJTkVfU1RBVEVfQ0hBTkdFRCcsXHJcblxyXG4gICAgSEFOR09VVF9TVEFURV9DSEFOR0VEOiAnSEFOR09VVF9TVEFURV9DSEFOR0VEJyxcclxuICAgIE5FV19IQU5HT1VUX1JFQ0lFVkVEOidORVdfSEFOR09VVF9SRUNJRVZFRCcsXHJcbiAgICBDTElFTlRfQ09NTUFORF9TVEFSVEVEOidDTElFTlRfQ09NTUFORF9TVEFSVEVEJyxcclxuICAgIENMSUVOVF9DT01NQU5EX1NVQ0NFU1M6J0NMSUVOVF9DT01NQU5EX1NVQ0NFU1MnLFxyXG4gICAgQ0xJRU5UX0NPTU1BTkRfRkFJTEVEOidDTElFTlRfQ09NTUFORF9GQUlMRUQnXHJcbn0iLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4vYWN0aW9uVHlwZXMnO1xyXG5leHBvcnQgY29uc3QgaW5pdFN0YXRlID0ge1xyXG4gIGhhbmdvdXRzOiBbXSxcclxuICBoYW5nb3V0OiBudWxsLFxyXG4gIG1lc3NhZ2VzOiBudWxsLFxyXG4gIHNlYXJjaDogJycsXHJcbiAgdXNlcjogW10sXHJcbiAgbG9hZGluZzogZmFsc2UsXHJcbiAgZXJyb3I6IG51bGwsXHJcbiAgbWVzc2FnZVRleHQ6ICcnLFxyXG4gIG9ubGluZTogZmFsc2UsXHJcbn07XHJcbmV4cG9ydCBmdW5jdGlvbiByZWR1Y2VyKHN0YXRlLCBhY3Rpb24pIHtcclxuICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNBVkVEX01FU1NBR0VfTE9DQUxMWTpcclxuICAgICAgaWYgKHN0YXRlLm1lc3NhZ2VzKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIG1lc3NhZ2VzOiBbLi4uc3RhdGUubWVzc2FnZXMsIGFjdGlvbi5tZXNzYWdlXSB9O1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBtZXNzYWdlczogW2FjdGlvbi5tZXNzYWdlXSB9O1xyXG4gICAgICB9XHJcblxyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0FERURfTUVTU0FHRVM6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBtZXNzYWdlczogYWN0aW9uLm1lc3NhZ2VzIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLk1FU1NBR0VfVEVYVF9DSEFOR0VEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbWVzc2FnZVRleHQ6IGFjdGlvbi50ZXh0IH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX1VTRVJfRkFJTEVEOlxyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX0ZBSUxFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBlcnJvcjogYWN0aW9uLmVycm9yIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX1VTRVJfU1RBUlRFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IHRydWUgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuRkVUQ0hfVVNFUl9TVUNDRVNTOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIGxvYWRpbmc6IGZhbHNlLFxyXG4gICAgICAgIHVzZXJzOiBhY3Rpb24udXNlcnMsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfU1RBUlRFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IHRydWUgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9TVUNDRVNTOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGhhbmdvdXRzOiBhY3Rpb24uaGFuZ291dHMgfTtcclxuXHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkhBTkdPVVRfTk9UX0ZPVU5EOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuRklMVEVSX0hBTkdPVVRTOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIGhhbmdvdXRzOiBzdGF0ZS5oYW5nb3V0cy5maWx0ZXIoKGcpID0+XHJcbiAgICAgICAgICBnLnVzZXJuYW1lLmluY2x1ZGVzKHN0YXRlLnNlYXJjaClcclxuICAgICAgICApLFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TRUFSQ0hFRF9IQU5HT1VUOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgc2VhcmNoOiBhY3Rpb24uc2VhcmNoIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkxPQURfSEFOR09VVFM6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBoYW5nb3V0czogYWN0aW9uLmhhbmdvdXRzIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNFTEVDVEVEX1VTRVI6XHJcbiAgICAgIGlmIChzdGF0ZS5oYW5nb3V0cykge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICAgIGhhbmdvdXRzOiBbLi4uc3RhdGUuaGFuZ291dHMsIGFjdGlvbi5oYW5nb3V0XSxcclxuICAgICAgICAgIGhhbmdvdXQ6IGFjdGlvbi5oYW5nb3V0LFxyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICBoYW5nb3V0czogW2FjdGlvbi5oYW5nb3V0XSxcclxuICAgICAgICBoYW5nb3V0OiBhY3Rpb24uaGFuZ291dCxcclxuICAgICAgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0VMRUNURURfSEFOR09VVDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICBoYW5nb3V0OiBzdGF0ZS5oYW5nb3V0cy5maW5kKChnKSA9PiBnLnVzZXJuYW1lID09PSBhY3Rpb24udXNlcm5hbWUpLFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5IQU5HT1VUX1NUQVRFX0NIQU5HRUQ6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgaGFuZ291dDogYWN0aW9uLmhhbmdvdXQsXHJcbiAgICAgICAgaGFuZ291dHM6IHN0YXRlLmhhbmdvdXRzLm1hcCgoZykgPT4ge1xyXG4gICAgICAgICAgaWYgKGcudXNlcm5hbWUgPT09IGFjdGlvbi5oYW5nb3V0LnVzZXJuYW1lKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24uaGFuZ291dDtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBnO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pLFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5ORVdfSEFOR09VVF9SRUNJRVZFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGhhbmdvdXRzOiBbLi4uc3RhdGUuaGFuZ291dHMsIGFjdGlvbi5oYW5nb3V0XSB9O1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4vYWN0aW9uVHlwZXMnO1xyXG5cclxuLy9yZXRyaWV2ZXMgaGFuZ291dHMgZnJvbSBsb2NhbFN0b3JhZ2VcclxuZXhwb3J0IGZ1bmN0aW9uIGxvYWRIYW5nb3V0cyh7IHVzZXJuYW1lLCBkaXNwYXRjaCB9KSB7XHJcbiAgY29uc3QgaGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGAke3VzZXJuYW1lfS1oYW5nb3V0c2ApKTtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkxPQURfSEFOR09VVFMsIGhhbmdvdXRzIH0pO1xyXG59XHJcbi8vc2VsZWN0IGhhbmdvdXQgZnJvbSBMaXN0XHJcbmV4cG9ydCBmdW5jdGlvbiBzZWxlY3RIYW5nb3V0KHsgZGlzcGF0Y2gsIHVzZXJuYW1lIH0pIHtcclxuXHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TRUxFQ1RFRF9IQU5HT1VULCB1c2VybmFtZSB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdFVzZXIoeyBkaXNwYXRjaCwgdXNlciwgdXNlcm5hbWUgfSkge1xyXG4gIC8vIHNhdmUgc2VsZWN0ZWQgdXNlciB0byBoYW5nb3V0c1xyXG4gIGNvbnN0IGhhbmdvdXQgPSB7IC4uLnVzZXIsIHN0YXRlOiAnSU5WSVRFJyB9O1xyXG4gIGNvbnN0IGhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShgJHt1c2VybmFtZX0taGFuZ291dHNgKSk7XHJcblxyXG4gIGlmIChoYW5nb3V0cykge1xyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXHJcbiAgICAgIGAke3VzZXJuYW1lfS1oYW5nb3V0c2AsXHJcbiAgICAgIEpTT04uc3RyaW5naWZ5KFsuLi5oYW5nb3V0cywgaGFuZ291dF0pXHJcbiAgICApO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShgJHt1c2VybmFtZX0taGFuZ291dHNgLCBKU09OLnN0cmluZ2lmeShbaGFuZ291dF0pKTtcclxuICB9XHJcblxyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VMRUNURURfVVNFUiwgaGFuZ291dCB9KTtcclxufVxyXG4vL3NlYXJjaCBmb3IgaGFuZ291dCBieSB0eXBpbmcgaW50byBUZXh0SW5wdXRcclxuZXhwb3J0IGZ1bmN0aW9uIHNlYXJjaEhhbmdvdXRzKHsgc2VhcmNoLCBkaXNwYXRjaCB9KSB7XHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TRUFSQ0hFRF9IQU5HT1VULCBzZWFyY2ggfSk7XHJcbn1cclxuLy9maWx0ZXIgaGFuZ291dCBhZnRlciBzZWFyY2ggc3RhdGUgY2hhbmdlXHJcbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJIYW5nb3V0cyh7IGRpc3BhdGNoIH0pIHtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZJTFRFUl9IQU5HT1VUUyB9KTtcclxufVxyXG5cclxuLy9mZXRjaCBoYW5nb3V0IGZyb20gc2VydmVyIGlmIG5vdCBmb3VuZCBpbiBsb2NhbCBoYW5nb3V0c1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hIYW5nb3V0KHsgc2VhcmNoLCBkaXNwYXRjaCwgdXNlcm5hbWUgfSkge1xyXG4gIHRyeSB7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfU1RBUlRFRCB9KTtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXHJcbiAgICAgIGAvaGFuZ291dHMvZmluZD9zZWFyY2g9JHtzZWFyY2h9JnVzZXJuYW1lPSR7dXNlcm5hbWV9YFxyXG4gICAgKTtcclxuICAgIGlmIChyZXNwb25zZS5vaykge1xyXG4gICAgICBjb25zdCB7IGhhbmdvdXRzIH0gPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICAgIGlmIChoYW5nb3V0cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NVQ0NFU1MsIGhhbmdvdXRzIH0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9OT1RfRk9VTkQgfSk7XHJcbiAgICAgICAgLy8gZmV0Y2ggdXNlciBmcm9tIHNlcnZlciBpbiBoYW5nb3V0IGlzIG5ld3VzZXJcclxuICAgICAgICBmZXRjaFVzZXIoeyBzZWFyY2gsIGRpc3BhdGNoIH0pO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfTk9UX0ZPVU5EIH0pO1xyXG4gICAgICAvLyBmZXRjaCB1c2VyIGZyb20gc2VydmVyIGluIGhhbmdvdXQgaXMgbmV3dXNlclxyXG4gICAgICBmZXRjaFVzZXIoeyBzZWFyY2gsIGRpc3BhdGNoIH0pO1xyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zdCBlcnIgPSBlcnJvcjtcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9GQUlMRUQsIGVycm9yIH0pO1xyXG4gIH1cclxufVxyXG4vLyBmZXRjaCB1c2VyIGZyb20gc2VydmVyIGluIGhhbmdvdXQgaXMgbmV3dXNlclxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hVc2VyKHsgc2VhcmNoLCBkaXNwYXRjaCB9KSB7XHJcbiAgdHJ5IHtcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfVVNFUl9TVEFSVEVEIH0pO1xyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL3VzZXJzL2ZpbmQ/c2VhcmNoPSR7c2VhcmNofWApO1xyXG4gICAgY29uc3QgeyB1c2VycyB9ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfVVNFUl9TVUNDRVNTLCB1c2VycyB9KTtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9VU0VSX0ZBSUxFRCwgZXJyb3IgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY2hhbmdlTWVzc2FnZVRleHQoeyB0ZXh0LCBkaXNwYXRjaCB9KSB7XHJcbiBcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLk1FU1NBR0VfVEVYVF9DSEFOR0VELCB0ZXh0IH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc3RhcnRDbGllbnRDb21tYW5kKHsgZGlzcGF0Y2ggfSkge1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQ0xJRU5UX0NPTU1BTkRfU1RBUlRFRCB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGxvYWRNZXNzYWdlcyh7IGhhbmdvdXQsIGRpc3BhdGNoIH0pIHtcclxuICBjb25zdCB7IHVzZXJuYW1lIH0gPSBoYW5nb3V0O1xyXG4gIGNvbnN0IGtleSA9IGAke3VzZXJuYW1lfS1tZXNzYWdlc2A7XHJcbiAgY29uc3QgbWVzc2FnZXMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSkpO1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTE9BREVEX01FU1NBR0VTLCBtZXNzYWdlcyB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVNZXNzYWdlKHsgIGRpc3BhdGNoLCBtZXNzYWdlLHVzZXJuYW1lLHRhcmdldCB9KSB7XHJcbiBcclxuICBjb25zdCBrZXkgPSBgJHt0YXJnZXR9LW1lc3NhZ2VzYDtcclxuICBjb25zdCBtZXNzYWdlcyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KSk7XHJcbiAgaWYgKG1lc3NhZ2VzKSB7XHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KFsuLi5tZXNzYWdlcyx7Li4ubWVzc2FnZSx1c2VybmFtZX1dKSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkoW3suLi5tZXNzYWdlLHVzZXJuYW1lfV0pKTtcclxuICB9XHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TQVZFRF9NRVNTQUdFX0xPQ0FMTFksIG1lc3NhZ2UgfSk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7XHJcbiAgdXNlQ29udGV4dCxcclxuICB1c2VTdGF0ZSxcclxuICB1c2VNZW1vLFxyXG4gIHVzZVJlZHVjZXIsXHJcbiAgdXNlRWZmZWN0LFxyXG59IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7IHJlZHVjZXIsIGluaXRTdGF0ZSB9IGZyb20gJy4vcmVkdWNlcic7XHJcblxyXG5pbXBvcnQge1xyXG4gIGxvYWRIYW5nb3V0cyxcclxuICBmaWx0ZXJIYW5nb3V0cyxcclxuICBmZXRjaEhhbmdvdXQsXHJcbiAgbG9hZE1lc3NhZ2VzLFxyXG4gIHNhdmVNZXNzYWdlLFxyXG59IGZyb20gJy4vYWN0aW9ucyc7XHJcbmltcG9ydCB7IHVzZUF1dGhDb250ZXh0IH0gZnJvbSAnLi4vLi4vYXV0aC9hdXRoLWNvbnRleHQnO1xyXG5jb25zdCBIYW5nb3V0Q29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcclxuZXhwb3J0IGZ1bmN0aW9uIHVzZUhhbmdvdXRDb250ZXh0KCkge1xyXG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KEhhbmdvdXRDb250ZXh0KTtcclxuICBpZiAoIWNvbnRleHQpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcigndXNlSGFuZ291dENvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggSGFuZ291dHNQcm92aWRlcicpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGNvbnRleHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBIYW5nb3V0c1Byb3ZpZGVyKHByb3BzKSB7XHJcbiAgY29uc3QgYXV0aENvbnRleHQgPSB1c2VBdXRoQ29udGV4dCgpO1xyXG4gIGNvbnN0IHsgdXNlcm5hbWUgfSA9IGF1dGhDb250ZXh0LnN0YXRlO1xyXG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlUmVkdWNlcihyZWR1Y2VyLCBpbml0U3RhdGUpO1xyXG4gIGNvbnN0IHsgaGFuZ291dCB9ID0gc3RhdGU7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAodXNlcm5hbWUpIHtcclxuICAgICAgbG9hZEhhbmdvdXRzKHsgdXNlcm5hbWUsIGRpc3BhdGNoIH0pO1xyXG4gICAgfVxyXG4gIH0sIFt1c2VybmFtZV0pO1xyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAoaGFuZ291dCkge1xyXG4gICAgICAvL2Zyb20gbG9jYWwgc3RvcmFnZVxyXG4gICAgICBsb2FkTWVzc2FnZXMoeyBkaXNwYXRjaCwgaGFuZ291dCB9KTtcclxuXHJcbiAgICAgIC8vc2F2ZSBoYW5nb3V0IHRvIGxvY2FsU3RvcmFnZVxyXG4gICAgICBjb25zdCBrZXkgPSBgJHt1c2VybmFtZX0taGFuZ291dHNgO1xyXG4gICAgICBjb25zdCBoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KSk7XHJcbiAgICAgIGlmICghaGFuZ291dHMpIHtcclxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KFtoYW5nb3V0XSkpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IGhhbmdvdXRFeGlzdCA9IGhhbmdvdXRzLmZpbmQoXHJcbiAgICAgICAgICAoZykgPT4gZy51c2VybmFtZSA9PT0gaGFuZ291dC51c2VybmFtZVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgaWYgKGhhbmdvdXRFeGlzdCkge1xyXG4gICAgICAgICAgY29uc3QgdXBkYXRlZCA9IGhhbmdvdXRzLm1hcCgoZykgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZy51c2VybmFtZSA9PT0gaGFuZ291dC51c2VybmFtZSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiBoYW5nb3V0O1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHJldHVybiBnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkodXBkYXRlZCkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KFtoYW5nb3V0XSkpO1xyXG4gICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSwgW2hhbmdvdXRdKTtcclxuXHJcbiAgY29uc3QgdmFsdWUgPSB1c2VNZW1vKCgpID0+IFtzdGF0ZSwgZGlzcGF0Y2hdLCBbc3RhdGVdKTtcclxuICByZXR1cm4gPEhhbmdvdXRDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt2YWx1ZX0gey4uLnByb3BzfSAvPjtcclxufVxyXG4iLCJcclxuICBleHBvcnQgY29uc3QgaGFuZ291dFN0YXRlcyA9IHtcclxuICAgIElOVklURVI6ICdJTlZJVEVSJyxcclxuICAgIEFDQ0VQVEVSOiAnQUNDRVBURVInLFxyXG4gICAgREVDTElORVI6ICdERUNMSU5FUicsXHJcbiAgICBCTE9DS0VSOiAnQkxPQ0tFUicsXHJcbiAgICBVTkJMT0NLRVI6ICdVTkJMT0NLRVInLFxyXG4gICAgTUVTU0FOR0VSOiAnTUVTU0FOR0VSJyxcclxuICAgLy8gYWNrbm93bGVnZW1lbnRcclxuICAgIElOVklURUQ6ICdJTlZJVEVEJyxcclxuICAgIEFDQ0VQVEVEOiAnQUNDRVBURUQnLFxyXG4gICAgREVDTElORUQ6ICdERUNMSU5FRCcsXHJcbiAgICBCTE9DS0VEOiAnQkxPQ0tFRCcsXHJcbiAgICBVTkJMT0NLRUQ6ICdVTkJMT0NLRUQnLFxyXG4gICAgTUVTU0FHRUQ6ICdNRVNTQUdFRCcsXHJcbiAgfTsiLCJcclxuLy9pcyBzZW50IGJ5IGNsaWVudFxyXG5leHBvcnQgY29uc3QgY2xpZW50Q29tbWFuZHMgPSB7XHJcbiAgSU5WSVRFOiAnSU5WSVRFJyxcclxuICBBQ0NFUFQ6ICdBQ0NFUFQnLFxyXG4gIERFQ0xJTkU6ICdERUNMSU5FJyxcclxuICBCTE9DSzogJ0JMT0NLJyxcclxuICBVTkJMT0NLOiAnVU5CTE9DSycsXHJcbiAgTUVTU0FHRTogJ01FU1NBR0UnLFxyXG4gIE9OTElORTonT05MSU5FJ1xyXG59O1xyXG5cclxuIiwiaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgdXNlV1NvY2tldENvbnRleHQgfSBmcm9tICcuLi8uLi93c29ja2V0L1dTb2NrZXRQcm92aWRlcic7XHJcbmltcG9ydCB7IGhhbmdvdXRTdGF0ZXMgfSBmcm9tICcuLi8uLi8uLi9zZXJ2ZXIvaGFuZ291dHMvaGFuZ291dFN0YXRlcydcclxuaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuL2FjdGlvblR5cGVzJ1xyXG5pbXBvcnQgeyBjbGllbnRDb21tYW5kcyB9IGZyb20gJy4vY2xpZW50Q29tbWFuZHMnXHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VTb2NrZXQoeyBkaXNwYXRjaCwgdXNlcm5hbWUgfSkge1xyXG4gIGNvbnN0IHNvY2tldENvbnRleHQgPSB1c2VXU29ja2V0Q29udGV4dCgpO1xyXG4gIGNvbnN0IHsgc29ja2V0IH0gPSBzb2NrZXRDb250ZXh0WzBdXHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAoc29ja2V0ICYmIHVzZXJuYW1lKSB7XHJcbiAgICAgIHNvY2tldC5vbm1lc3NhZ2UgPSAobWVzc2FnZSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGhhbmdvdXQgPSBKU09OLnBhcnNlKG1lc3NhZ2UuZGF0YSk7XHJcbiAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgaGFuZGxlSGFuZ291dFN0YXRlKHsgaGFuZ291dCwgdXNlcm5hbWUsIGRpc3BhdGNoIH0pXHJcbiAgICAgIH07XHJcbiAgICAgIHNvY2tldC5vbmNsb3NlID0gKCkgPT4ge1xyXG5cclxuICAgICAgfTtcclxuICAgICAgc29ja2V0Lm9uZXJyb3IgPSAoZXJyb3IpID0+IHtcclxuXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBzb2NrZXQub25vcGVuID0gKCkgPT4ge1xyXG4gICAgICAgIGRlYnVnZ2VyO1xyXG5cclxuICAgICAgfTtcclxuICAgIH1cclxuICB9LCBbc29ja2V0LCB1c2VybmFtZV0pO1xyXG5cclxuICByZXR1cm4gbnVsbDtcclxuXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhhbmRsZUhhbmdvdXRTdGF0ZSh7IGhhbmdvdXQsIHVzZXJuYW1lLCBkaXNwYXRjaCB9KSB7XHJcbiAgY29uc3Qga2V5ID0gYCR7dXNlcm5hbWV9LWhhbmdvdXRzYFxyXG4gIGRlYnVnZ2VyO1xyXG4gIGNvbnN0IHRhcmdldCA9IGhhbmdvdXQudXNlcm5hbWVcclxuICBjb25zdCBoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KSlcclxuICBkZWJ1Z2dlcjtcclxuICBsZXQgdXBkYXRlZFN0YXRlID0gbnVsbDtcclxuICBzd2l0Y2ggKGhhbmdvdXQuc3RhdGUpIHtcclxuXHJcbiAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuQUNDRVBURVI6XHJcbiAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuQkxPQ0tFRDpcclxuICAgIGNhc2UgaGFuZ291dFN0YXRlcy5CTE9DS0VSOlxyXG4gICAgY2FzZSBoYW5nb3V0U3RhdGVzLkRFQ0xJTkVEOlxyXG4gICAgY2FzZSBoYW5nb3V0U3RhdGVzLkRFQ0xJTkVSOlxyXG4gICAgY2FzZSBoYW5nb3V0U3RhdGVzLk1FU1NBR0VEOlxyXG4gICAgY2FzZSBoYW5nb3V0U3RhdGVzLk1FU1NBTkdFUjpcclxuICAgIGNhc2UgaGFuZ291dFN0YXRlcy5VTkJMT0NLRUQ6XHJcbiAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuVU5CTE9DS0VSOlxyXG4gICAgY2FzZSBoYW5nb3V0U3RhdGVzLklOVklURUQ6XHJcbiAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuQUNDRVBURUQ6XHJcbiAgICAgIHVwZGF0ZWRTdGF0ZSA9IGhhbmdvdXRzLm1hcChnID0+IHsgaWYgKGcudXNlcm5hbWUgPT09IHRhcmdldCkgeyByZXR1cm4gaGFuZ291dCB9IGVsc2UgcmV0dXJuIGcgfSlcclxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeSh1cGRhdGVkU3RhdGUpKVxyXG5cclxuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5IQU5HT1VUX1NUQVRFX0NIQU5HRUQsIGhhbmdvdXQgfSlcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuSU5WSVRFUjpcclxuICAgICAgaWYgKGhhbmdvdXRzKSB7XHJcbiAgICAgICAgZGVidWdnZXJcclxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KGhhbmdvdXRzLnB1c2goaGFuZ291dCkpKVxyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkoW2hhbmdvdXRdKSlcclxuICAgICAgfVxyXG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLk5FV19IQU5HT1VUX1JFQ0lFVkVELCBoYW5nb3V0IH0pXHJcbiAgICAgIGJyZWFrO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaGFuZ291dFN0YXRlIG5vdCBkZWZpbmVkXCIpXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBvbk9ubGluZSgpIHtcclxuICAgIHNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHsgY29tbWFuZDogY2xpZW50Q29tbWFuZHMuT05MSU5FIH0pKVxyXG4gIH1cclxuXHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZUhhbmdvdXRDb250ZXh0IH0gZnJvbSAnLi9IYW5nb3V0c1Byb3ZpZGVyJztcclxuaW1wb3J0IHsgdXNlQXV0aENvbnRleHQgfSBmcm9tICcuLi8uLi9hdXRoL2F1dGgtY29udGV4dCc7XHJcbmltcG9ydCB7IHVzZVdTb2NrZXRDb250ZXh0IH0gZnJvbSAnLi4vLi4vd3NvY2tldC9XU29ja2V0UHJvdmlkZXInO1xyXG5pbXBvcnQge1xyXG4gIHNlbGVjdEhhbmdvdXQsXHJcbiAgc2VhcmNoSGFuZ291dHMsXHJcbiAgZmlsdGVySGFuZ291dHMsXHJcbiAgZmV0Y2hIYW5nb3V0LFxyXG4gIHNlbGVjdFVzZXIsXHJcbiAgY2hhbmdlTWVzc2FnZVRleHQsXHJcbiAgc3RhcnRDbGllbnRDb21tYW5kLFxyXG4gIHNhdmVNZXNzYWdlLFxyXG59IGZyb20gJy4vYWN0aW9ucyc7XHJcbmltcG9ydCB7IHVzZVNvY2tldCB9IGZyb20gJy4vdXNlU29ja2V0JztcclxuaW1wb3J0IHsgY2xpZW50Q29tbWFuZHMgfSBmcm9tICcuL2NsaWVudENvbW1hbmRzJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VIYW5nb3V0cygpIHtcclxuICBjb25zdCBzb2NrZXRDb250ZXh0ID0gdXNlV1NvY2tldENvbnRleHQoKTtcclxuICBjb25zdCB7c29ja2V0fT1zb2NrZXRDb250ZXh0WzBdXHJcbiBcclxuICBjb25zdCBhdXRoQ29udGV4dCA9IHVzZUF1dGhDb250ZXh0KCk7XHJcbiAgY29uc3QgeyB1c2VybmFtZSB9ID0gYXV0aENvbnRleHQuc3RhdGU7XHJcbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSB1c2VIYW5nb3V0Q29udGV4dCgpO1xyXG4gIGNvbnN0IHsgaGFuZ291dCwgaGFuZ291dHMsIHNlYXJjaCwgdXNlcnMsIG1lc3NhZ2VUZXh0LCBtZXNzYWdlcyB9ID0gc3RhdGU7XHJcbiAgY29uc3QgaGFuZGxlU29ja2V0ID0gdXNlU29ja2V0KHsgZGlzcGF0Y2gsIGhhbmdvdXQsIHVzZXJuYW1lIH0pO1xyXG4gIGZ1bmN0aW9uIG9uU2VsZWN0SGFuZ291dChlKSB7XHJcbiAgICBjb25zdCB1c2VybmFtZSA9IGUudGFyZ2V0LmlkO1xyXG4gICAgc2VsZWN0SGFuZ291dCh7IGRpc3BhdGNoLCB1c2VybmFtZSB9KTtcclxuICB9XHJcbiAgZnVuY3Rpb24gb25TZWxlY3RVc2VyKGUpIHtcclxuICAgIGNvbnN0IHVuYW1lID0gZS50YXJnZXQuaWQ7XHJcbiAgICBjb25zdCB1c2VyID0gdXNlcnMuZmluZCgodSkgPT4gdS51c2VybmFtZSA9PT0gdW5hbWUpO1xyXG4gICAgc2VsZWN0VXNlcih7IGRpc3BhdGNoLCB1c2VyLCB1c2VybmFtZSB9KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIG9uSW52aXRlKCkge1xyXG4gICAgY29uc3QgeyB1c2VybmFtZSwgZW1haWwgfSA9IGhhbmdvdXQ7XHJcbiAgICBjb25zdCBtZXNzYWdlID0geyB0ZXh0OiBtZXNzYWdlVGV4dCwgdGltZXN0YW1wOiBEYXRlLm5vdygpIH07XHJcbiAgICBjb25zdCB1cGRhdGVkSGFuZ291dCA9IHtcclxuICAgICAgdXNlcm5hbWUsXHJcbiAgICAgIGVtYWlsLFxyXG4gICAgICBtZXNzYWdlLFxyXG4gICAgfTtcclxuICAgIHNvY2tldC5zZW5kKFxyXG4gICAgICBKU09OLnN0cmluZ2lmeSh7IC4uLnVwZGF0ZWRIYW5nb3V0LCBjb21tYW5kOiBjbGllbnRDb21tYW5kcy5JTlZJVEUgfSlcclxuICAgICk7XHJcbiAgICBzdGFydENsaWVudENvbW1hbmQoeyBkaXNwYXRjaCB9KTtcclxuICB9XHJcbiAgZnVuY3Rpb24gb25BY2NlcHQoKSB7XHJcbiAgICBjb25zdCB7IHVzZXJuYW1lLCBlbWFpbCB9ID0gaGFuZ291dDtcclxuICAgIGRlYnVnZ2VyO1xyXG4gICAgc29ja2V0LnNlbmQoXHJcbiAgICAgIEpTT04uc3RyaW5naWZ5KHsgdXNlcm5hbWUsIGVtYWlsLCBjb21tYW5kOiBjbGllbnRDb21tYW5kcy5BQ0NFUFQgfSlcclxuICAgICk7XHJcbiAgICBzdGFydENsaWVudENvbW1hbmQoeyBkaXNwYXRjaCB9KTtcclxuICB9XHJcbiAgZnVuY3Rpb24gb25CbG9jaygpIHtcclxuICAgIHNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHsgLi4uaGFuZ291dCwgY29tbWFuZDogY2xpZW50Q29tbWFuZHMuQkxPQ0sgfSkpO1xyXG4gICAgc3RhcnRDbGllbnRDb21tYW5kKHsgZGlzcGF0Y2ggfSk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIG9uVW5ibG9jaygpIHtcclxuICAgIHNvY2tldC5zZW5kKFxyXG4gICAgICBKU09OLnN0cmluZ2lmeSh7IC4uLmhhbmdvdXQsIGNvbW1hbmQ6IGNsaWVudENvbW1hbmRzLlVOQkxPQ0sgfSlcclxuICAgICk7XHJcbiAgICBzdGFydENsaWVudENvbW1hbmQoeyBkaXNwYXRjaCB9KTtcclxuICB9XHJcbiAgZnVuY3Rpb24gb25EZWNsaW5lKCkge1xyXG4gICAgc29ja2V0LnNlbmQoXHJcbiAgICAgIEpTT04uc3RyaW5naWZ5KHsgLi4uaGFuZ291dCwgY29tbWFuZDogY2xpZW50Q29tbWFuZHMuREVDTElORSB9KVxyXG4gICAgKTtcclxuICAgIHN0YXJ0Q2xpZW50Q29tbWFuZCh7IGRpc3BhdGNoIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gb25NZXNzYWdlKCkge1xyXG4gICAgY29uc3QgeyB1c2VybmFtZSwgZW1haWwgfSA9IGhhbmdvdXQ7XHJcbiAgICBjb25zdCBtZXNzYWdlID0geyB0ZXh0OiBtZXNzYWdlVGV4dCwgdGltZXN0YW1wOiAgRGF0ZS5ub3coKSB9O1xyXG4gICAgY29uc3QgdXBkYXRlZEhhbmdvdXQgPSB7XHJcbiAgICAgIHVzZXJuYW1lLFxyXG4gICAgICBlbWFpbCxcclxuICAgICAgbWVzc2FnZSxcclxuICAgIH07XHJcbiBcclxuICAgIHNvY2tldC5zZW5kKFxyXG4gICAgICBKU09OLnN0cmluZ2lmeSh7IC4uLnVwZGF0ZWRIYW5nb3V0LCBjb21tYW5kOiBjbGllbnRDb21tYW5kcy5NRVNTQUdFIH0pXHJcbiAgICApO1xyXG4gICAgc3RhcnRDbGllbnRDb21tYW5kKHsgZGlzcGF0Y2ggfSk7XHJcbiAgICBzYXZlTWVzc2FnZSh7IGRpc3BhdGNoLCBoYW5nb3V0LCBtZXNzYWdlLCB0YXJnZXQ6dXNlcm5hbWUgLHVzZXJuYW1lOmF1dGhDb250ZXh0LnN0YXRlLnVzZXJuYW1lfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBvblNlYXJjaChlKSB7XHJcbiAgICBzZWFyY2hIYW5nb3V0cyh7IHNlYXJjaDogZS50YXJnZXQudmFsdWUsIGRpc3BhdGNoIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gb25TdGFydFNlYXJjaChlKSB7XHJcbiAgICBpZiAoaGFuZ291dHMgJiYgaGFuZ291dHMubGVuZ3RoID4gMCkge1xyXG4gICAgICBmaWx0ZXJIYW5nb3V0cyh7IGRpc3BhdGNoIH0pO1xyXG4gICAgfVxyXG4gICAgZmV0Y2hIYW5nb3V0KHsgZGlzcGF0Y2gsIHNlYXJjaCwgdXNlcm5hbWUgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBvbk1lc3NhZ2VUZXh0KGUpIHtcclxuICAgIGNvbnN0IHRleHQgPWUudGFyZ2V0LnZhbHVlXHJcblxyXG4gICAgY2hhbmdlTWVzc2FnZVRleHQoeyBkaXNwYXRjaCwgdGV4dH0pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIG9uTWVzc2FnZVRleHQsXHJcbiAgICBtZXNzYWdlVGV4dCxcclxuICAgIG9uU3RhcnRTZWFyY2gsXHJcbiAgICBvblNlYXJjaCxcclxuICAgIHNlYXJjaCxcclxuICAgIG9uTWVzc2FnZSxcclxuICAgIG9uSW52aXRlLFxyXG4gICAgb25BY2NlcHQsXHJcbiAgICBvbkJsb2NrLFxyXG4gICAgb25VbmJsb2NrLFxyXG4gICAgb25TZWxlY3RIYW5nb3V0LFxyXG4gICAgb25TZWxlY3RVc2VyLFxyXG4gICAgb25EZWNsaW5lLFxyXG4gICAgaGFuZ291dCxcclxuICAgIGhhbmdvdXRzLFxyXG4gICAgdXNlcnMsXHJcbiAgICB1c2VybmFtZSxcclxuICAgIG1lc3NhZ2VzLFxyXG4gIH07XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7IGxhenksIFN1c3BlbnNlIH0gZnJvbSAncHJlYWN0L2NvbXBhdCc7XHJcbmltcG9ydCB7IFJvdXRlLCB1c2VSb3V0ZUNvbnRleHQgfSBmcm9tICcuLi9yb3V0ZS9yb3V0ZXInO1xyXG5cclxuaW1wb3J0IHsgdXNlSGFuZ291dHMgfSBmcm9tICcuL3N0YXRlL3VzZUhhbmdvdXRzJztcclxuY29uc3QgSGFuZ291dHMgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9IYW5nb3V0JykpO1xyXG5jb25zdCBCbG9jayA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL3N0YXRlLXVpL0Jsb2NrJykpO1xyXG5jb25zdCBCbG9ja2VkID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vc3RhdGUtdWkvQmxvY2tlZCcpKTtcclxuY29uc3QgQ29uZmlndXJlID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vc3RhdGUtdWkvQ29uZmlndXJlJykpO1xyXG5jb25zdCBIYW5nY2hhdCA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL3N0YXRlLXVpL0hhbmdjaGF0JykpO1xyXG5jb25zdCBJbnZpdGUgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9zdGF0ZS11aS9JbnZpdGUnKSk7XHJcbmNvbnN0IEludml0ZWUgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9zdGF0ZS11aS9JbnZpdGVlJykpO1xyXG5jb25zdCBJbnZpdGVyID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vc3RhdGUtdWkvSW52aXRlcicpKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE1vYmlsZSgpIHtcclxuICBjb25zdCBbcm91dGUsIHNldFJvdXRlXSA9IHVzZVJvdXRlQ29udGV4dCgpO1xyXG4gIGNvbnN0IHtcclxuICAgIGhhbmdvdXQsXHJcbiAgICBoYW5nb3V0cyxcclxuICAgIG9uQWNjZXB0LFxyXG4gICAgb25CbG9jayxcclxuICAgIG9uSW52aXRlLFxyXG4gICAgb25TZWxlY3RIYW5nb3V0LFxyXG4gICAgb25TZWxlY3RVc2VyLFxyXG4gICAgb25VbmJsb2NrLFxyXG4gICAgb25TZWFyY2gsXHJcbiAgICB1c2VycyxcclxuICAgIHNlYXJjaCxcclxuICAgIG9uU3RhcnRTZWFyY2gsXHJcbiAgICBvbk1lc3NhZ2VUZXh0LFxyXG4gICAgb25NZXNzYWdlLFxyXG4gICAgbWVzc2FnZVRleHQsXHJcbiAgICB1c2VybmFtZSxcclxuICAgIG1lc3NhZ2VzXHJcbiAgfSA9IHVzZUhhbmdvdXRzKCk7XHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmIChoYW5nb3V0KSB7XHJcbiAgICAgIHNldFJvdXRlKGAvJHtoYW5nb3V0LnN0YXRlfWApO1xyXG4gICAgfVxyXG4gIH0sIFtoYW5nb3V0XSk7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3sgaGVpZ2h0OiAnODV2aCcgfX0+XHJcbiAgICAgIDxSb3V0ZSBwYXRoPVwiL2hhbmdvdXRzXCI+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPEhhbmdvdXRzXHJcbiAgICAgICAgICAgIHVzZXJzPXt1c2Vyc31cclxuICAgICAgICAgICAgc2VhcmNoPXtzZWFyY2h9XHJcbiAgICAgICAgICAgIGhhbmdvdXRzPXtoYW5nb3V0c31cclxuICAgICAgICAgICAgb25TZWxlY3RIYW5nb3V0PXtvblNlbGVjdEhhbmdvdXR9XHJcbiAgICAgICAgICAgIG9uU2VsZWN0VXNlcj17b25TZWxlY3RVc2VyfVxyXG4gICAgICAgICAgICBvblNlYXJjaD17b25TZWFyY2h9XHJcbiAgICAgICAgICAgIG9uU3RhcnRTZWFyY2g9e29uU3RhcnRTZWFyY2h9XHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgIDwvUm91dGU+XHJcbiAgICAgIDxSb3V0ZSBwYXRoPVwiL0JMT0NLXCI+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPEJsb2NrIGhhbmdvdXQ9e2hhbmdvdXR9IG9uQmxvY2s9e29uQmxvY2t9IC8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9Sb3V0ZT5cclxuICAgICAgPFJvdXRlIHBhdGg9XCIvQkxPQ0tFRFwiPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxCbG9ja2VkIGhhbmdvdXQ9e2hhbmdvdXR9IG9uVW5ibG9jaz17b25VbmJsb2NrfSAvPlxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgIDwvUm91dGU+XHJcbiAgICAgIDxSb3V0ZSBwYXRoPVwiL2NvbmZpZ3VyZVwiPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxDb25maWd1cmUgaGFuZ291dD17aGFuZ291dH0gLz5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICA8L1JvdXRlPlxyXG4gICAgICA8Um91dGUgcGF0aHM9e1tcIi9BQ0NFUFRFRFwiLFwiL0FDQ0VQVEVSXCIsXCIvTUVTU0FOR0VSXCIsXCIvTUVTU0FHRURcIl19PlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxIYW5nY2hhdFxyXG4gICAgICAgICAgICBvbk1lc3NhZ2VUZXh0PXtvbk1lc3NhZ2VUZXh0fVxyXG4gICAgICAgICAgICBvbk1lc3NhZ2U9e29uTWVzc2FnZX1cclxuICAgICAgICAgICAgbWVzc2FnZXM9e21lc3NhZ2VzfVxyXG4gICAgICAgICAgICB1c2VybmFtZT17dXNlcm5hbWV9XHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgIDwvUm91dGU+XHJcbiAgICBcclxuICAgICAgPFJvdXRlIHBhdGg9XCIvSU5WSVRFXCI+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPEludml0ZVxyXG4gICAgICAgICAgICBoYW5nb3V0PXtoYW5nb3V0fVxyXG4gICAgICAgICAgICBvbkludml0ZT17b25JbnZpdGV9XHJcbiAgICAgICAgICAgIG9uTWVzc2FnZVRleHQ9e29uTWVzc2FnZVRleHR9XHJcbiAgICAgICAgICAgIG1lc3NhZ2VUZXh0PXttZXNzYWdlVGV4dH1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9Sb3V0ZT5cclxuICAgICAgPFJvdXRlIHBhdGg9XCIvSU5WSVRFRFwiPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxJbnZpdGVlIGhhbmdvdXQ9e2hhbmdvdXR9IC8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9Sb3V0ZT5cclxuICAgICAgPFJvdXRlIHBhdGg9XCIvSU5WSVRFUlwiPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxJbnZpdGVyIGhhbmdvdXQ9e2hhbmdvdXR9IG9uQWNjZXB0PXtvbkFjY2VwdH0gLz5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICA8L1JvdXRlPlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IE1vYmlsZSBmcm9tICcuL21vYmlsZSc7XHJcbmltcG9ydCB7IEhhbmdvdXRzUHJvdmlkZXIgfSBmcm9tICcuL3N0YXRlL0hhbmdvdXRzUHJvdmlkZXInO1xyXG5pbXBvcnQgeyBSb3V0ZVByb3ZpZGVyLCB1c2VSb3V0ZUNvbnRleHQgfSBmcm9tICcuLi9yb3V0ZS9yb3V0ZXInO1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxIYW5nb3V0c1Byb3ZpZGVyPlxyXG4gICAgICA8Um91dGVQcm92aWRlciBpbml0aWFsUm91dGU9XCIvaGFuZ291dHNcIj5cclxuICAgICAgICA8TW9iaWxlIC8+XHJcbiAgICAgIDwvUm91dGVQcm92aWRlcj5cclxuICAgIDwvSGFuZ291dHNQcm92aWRlcj5cclxuICApO1xyXG59XHJcbiJdLCJuYW1lcyI6WyJhY3Rpb25UeXBlcyIsIk1FU1NBR0VfVEVYVF9DSEFOR0VEIiwiTE9BRF9IQU5HT1VUUyIsIkxPQURFRF9NRVNTQUdFUyIsIlNBVkVEX01FU1NBR0VfTE9DQUxMWSIsIlNFQVJDSEVEX0hBTkdPVVQiLCJTRUxFQ1RFRF9IQU5HT1VUIiwiU0VMRUNURURfVVNFUiIsIkZJTFRFUl9IQU5HT1VUUyIsIkZFVENIX0hBTkdPVVRfU1RBUlRFRCIsIkZFVENIX0hBTkdPVVRfU1VDQ0VTUyIsIkZFVENIX0hBTkdPVVRfRkFJTEVEIiwiRkVUQ0hfSEFOR09VVF9OT1RfRk9VTkQiLCJGRVRDSF9VU0VSX1NUQVJURUQiLCJGRVRDSF9VU0VSX1NVQ0NFU1MiLCJGRVRDSF9VU0VSX0ZBSUxFRCIsIk9OTElORV9TVEFURV9DSEFOR0VEIiwiSEFOR09VVF9TVEFURV9DSEFOR0VEIiwiTkVXX0hBTkdPVVRfUkVDSUVWRUQiLCJDTElFTlRfQ09NTUFORF9TVEFSVEVEIiwiQ0xJRU5UX0NPTU1BTkRfU1VDQ0VTUyIsIkNMSUVOVF9DT01NQU5EX0ZBSUxFRCIsImluaXRTdGF0ZSIsImhhbmdvdXRzIiwiaGFuZ291dCIsIm1lc3NhZ2VzIiwic2VhcmNoIiwidXNlciIsImxvYWRpbmciLCJlcnJvciIsIm1lc3NhZ2VUZXh0Iiwib25saW5lIiwicmVkdWNlciIsInN0YXRlIiwiYWN0aW9uIiwidHlwZSIsIm1lc3NhZ2UiLCJ0ZXh0IiwidXNlcnMiLCJIQU5HT1VUX05PVF9GT1VORCIsImZpbHRlciIsImciLCJ1c2VybmFtZSIsImluY2x1ZGVzIiwiZmluZCIsIm1hcCIsImxvYWRIYW5nb3V0cyIsImRpc3BhdGNoIiwiSlNPTiIsInBhcnNlIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsInNlbGVjdEhhbmdvdXQiLCJzZWxlY3RVc2VyIiwic2V0SXRlbSIsInN0cmluZ2lmeSIsInNlYXJjaEhhbmdvdXRzIiwiZmlsdGVySGFuZ291dHMiLCJmZXRjaEhhbmdvdXQiLCJyZXNwb25zZSIsImZldGNoIiwib2siLCJqc29uIiwibGVuZ3RoIiwiZmV0Y2hVc2VyIiwiY2hhbmdlTWVzc2FnZVRleHQiLCJzdGFydENsaWVudENvbW1hbmQiLCJsb2FkTWVzc2FnZXMiLCJrZXkiLCJzYXZlTWVzc2FnZSIsInRhcmdldCIsIkhhbmdvdXRDb250ZXh0IiwiY3JlYXRlQ29udGV4dCIsInVzZUhhbmdvdXRDb250ZXh0IiwiY29udGV4dCIsInVzZUNvbnRleHQiLCJFcnJvciIsIkhhbmdvdXRzUHJvdmlkZXIiLCJwcm9wcyIsImF1dGhDb250ZXh0IiwidXNlQXV0aENvbnRleHQiLCJ1c2VSZWR1Y2VyIiwidXNlRWZmZWN0IiwiaGFuZ291dEV4aXN0IiwidXBkYXRlZCIsInZhbHVlIiwidXNlTWVtbyIsImhhbmdvdXRTdGF0ZXMiLCJJTlZJVEVSIiwiQUNDRVBURVIiLCJERUNMSU5FUiIsIkJMT0NLRVIiLCJVTkJMT0NLRVIiLCJNRVNTQU5HRVIiLCJJTlZJVEVEIiwiQUNDRVBURUQiLCJERUNMSU5FRCIsIkJMT0NLRUQiLCJVTkJMT0NLRUQiLCJNRVNTQUdFRCIsImNsaWVudENvbW1hbmRzIiwiSU5WSVRFIiwiQUNDRVBUIiwiREVDTElORSIsIkJMT0NLIiwiVU5CTE9DSyIsIk1FU1NBR0UiLCJPTkxJTkUiLCJ1c2VTb2NrZXQiLCJzb2NrZXRDb250ZXh0IiwidXNlV1NvY2tldENvbnRleHQiLCJzb2NrZXQiLCJvbm1lc3NhZ2UiLCJkYXRhIiwiaGFuZGxlSGFuZ291dFN0YXRlIiwib25jbG9zZSIsIm9uZXJyb3IiLCJvbm9wZW4iLCJ1cGRhdGVkU3RhdGUiLCJwdXNoIiwidXNlSGFuZ291dHMiLCJoYW5kbGVTb2NrZXQiLCJvblNlbGVjdEhhbmdvdXQiLCJlIiwiaWQiLCJvblNlbGVjdFVzZXIiLCJ1bmFtZSIsInUiLCJvbkludml0ZSIsImVtYWlsIiwidGltZXN0YW1wIiwiRGF0ZSIsIm5vdyIsInVwZGF0ZWRIYW5nb3V0Iiwic2VuZCIsImNvbW1hbmQiLCJvbkFjY2VwdCIsIm9uQmxvY2siLCJvblVuYmxvY2siLCJvbkRlY2xpbmUiLCJvbk1lc3NhZ2UiLCJvblNlYXJjaCIsIm9uU3RhcnRTZWFyY2giLCJvbk1lc3NhZ2VUZXh0IiwiSGFuZ291dHMiLCJsYXp5IiwiQmxvY2siLCJCbG9ja2VkIiwiQ29uZmlndXJlIiwiSGFuZ2NoYXQiLCJJbnZpdGUiLCJJbnZpdGVlIiwiSW52aXRlciIsIk1vYmlsZSIsInJvdXRlIiwic2V0Um91dGUiLCJ1c2VSb3V0ZUNvbnRleHQiLCJoZWlnaHQiLCJTdXNwZW5zZSJdLCJtYXBwaW5ncyI6Ijs7QUFBTyxNQUFNQSxXQUFXLEdBQUc7QUFDdkJDLEVBQUFBLG9CQUFvQixFQUFDLHNCQURFO0FBRXZCQyxFQUFBQSxhQUFhLEVBQUUsZUFGUTtBQUd2QkMsRUFBQUEsZUFBZSxFQUFFLGlCQUhNO0FBSXZCQyxFQUFBQSxxQkFBcUIsRUFBQyx1QkFKQztBQUt2QkMsRUFB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
