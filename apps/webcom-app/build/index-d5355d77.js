import { M, u as useAuthContext, p, l, h, a as h$1, _ as _extends, w, b as useWSocketContext, c as useRouteContext, R as Route, d as M$1, O, e as RouteProvider } from './index-b06e1a84.js';

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
  hangout,
  dispatch
}) {
  const {
    username
  } = hangout;
  const key = `${username}-messages`;
  const messages = JSON.parse(localStorage.getItem(key));

  if (messages) {
    localStorage.setItem(key, JSON.stringify([...messages, message]));
  } else {
    localStorage.setItem(key, JSON.stringify([message]));
  }

  dispatch({
    type: actionTypes.SAVED_MESSAGE_LOCALLY,
    message
  });
}

const HangoutContext = M();
function useHangoutContext() {
  const context = w(HangoutContext);

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
  const [state, dispatch] = p(reducer, initState);
  const {
    hangout
  } = state;
  l(() => {
    if (username) {
      loadHangouts({
        username,
        dispatch
      });
    }
  }, [username]);
  l(() => {
    if (hangout) {
      loadMessages({
        dispatch,
        hangout
      });
    }
  }, [hangout]);
  const value = h(() => [state, dispatch], [state]);
  return h$1(HangoutContext.Provider, _extends({
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

function useSocket({
  dispatch,
  username
}) {
  const socketContext = useWSocketContext();
  const {
    socket
  } = socketContext;
  l(() => {
    if (socket) {
      socket.onmessage = message => {
        const hangout = JSON.parse(message.data);
        debugger;
        handleHangoutState({
          hangout,
          username,
          dispatch
        });
      };

      socket.onclose = () => {
      };

      socket.onerror = error => {
      };

      socket.onopen = () => {
      };
    }
  }, [socket]);
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
      updatedState = hangouts.map(g => {
        if (g.username === target) {
          return hangout;
        } else return g;
      });
      localStorage.setItem(key, JSON.stringify(updatedState));
      debugger;
      dispatch({
        type: actionTypes.HANGOUT_STATE_CHANGED,
        hangout
      });
      break;

    case hangoutStates.ACCEPTED:
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

//is sent by client
const clientCommands = {
  INVITE: 'INVITE',
  ACCEPT: 'ACCEPT',
  DECLINE: 'DECLINE',
  BLOCK: 'BLOCK',
  UNBLOCK: 'UNBLOCK',
  MESSAGE: 'MESSAGE'
};

function useHangouts() {
  const socketContext = useWSocketContext();
  const {
    socket
  } = socketContext;
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
    const updatedHangout = {
      username,
      email,
      message: {
        text: messageText,
        timestamp: Date.now()
      }
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
    socket.send(JSON.stringify({ ...hangout,
      command: clientCommands.MESSAGE
    }));
    startClientCommand({
      dispatch
    });
    saveMessage({
      dispatch,
      hangout: { ...hangout,
        message
      }
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
    changeMessageText({
      dispatch,
      text: e.target.value
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

const Hangouts = O(() => import('./Hangout-0ce531cb.js'));
const Block = O(() => import('./Block-6e39e98e.js'));
const Blocked = O(() => import('./Blocked-fbdb5451.js'));
const Configure = O(() => import('./Configure-536ebcbb.js'));
const Hangchat = O(() => import('./Hangchat-b887284d.js'));
const Invite = O(() => import('./Invite-a2d63e6c.js'));
const Invitee = O(() => import('./Invitee-90f5a459.js'));
const Inviter = O(() => import('./Inviter-16c0d2b2.js'));
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
  l(() => {
    if (hangout) {
      setRoute(`/${hangout.state}`);
    }
  }, [hangout]);
  return h$1("div", {
    style: {
      height: '85vh'
    }
  }, h$1(Route, {
    path: "/hangouts"
  }, h$1(M$1, {
    fallback: h$1("div", null, "Loading...")
  }, h$1(Hangouts, {
    users: users,
    search: search,
    hangouts: hangouts,
    onSelectHangout: onSelectHangout,
    onSelectUser: onSelectUser,
    onSearch: onSearch,
    onStartSearch: onStartSearch
  }))), h$1(Route, {
    path: "/BLOCK"
  }, h$1(M$1, {
    fallback: h$1("div", null, "Loading...")
  }, h$1(Block, {
    hangout: hangout,
    onBlock: onBlock
  }))), h$1(Route, {
    path: "/BLOCKED"
  }, h$1(M$1, {
    fallback: h$1("div", null, "Loading...")
  }, h$1(Blocked, {
    hangout: hangout,
    onUnblock: onUnblock
  }))), h$1(Route, {
    path: "/configure"
  }, h$1(M$1, {
    fallback: h$1("div", null, "Loading...")
  }, h$1(Configure, {
    hangout: hangout
  }))), h$1(Route, {
    path: "/ACCEPTED"
  }, h$1(M$1, {
    fallback: h$1("div", null, "Loading...")
  }, h$1(Hangchat, {
    onMessageText: onMessageText,
    onMessage: onMessage,
    messages: messages,
    username: username
  }))), h$1(Route, {
    path: "/ACCEPTER"
  }, h$1(M$1, {
    fallback: h$1("div", null, "Loading...")
  }, h$1(Hangchat, {
    onMessageText: onMessageText,
    onMessage: onMessage,
    messages: messages,
    username: username
  }))), h$1(Route, {
    path: "/INVITE"
  }, h$1(M$1, {
    fallback: h$1("div", null, "Loading...")
  }, h$1(Invite, {
    hangout: hangout,
    onInvite: onInvite,
    onMessageText: onMessageText,
    messageText: messageText
  }))), h$1(Route, {
    path: "/INVITED"
  }, h$1(M$1, {
    fallback: h$1("div", null, "Loading...")
  }, h$1(Invitee, {
    hangout: hangout
  }))), h$1(Route, {
    path: "/INVITER"
  }, h$1(M$1, {
    fallback: h$1("div", null, "Loading...")
  }, h$1(Inviter, {
    hangout: hangout,
    onAccept: onAccept
  }))));
}

function index () {
  return h$1(HangoutsProvider, null, h$1(RouteProvider, {
    initialRoute: "/hangouts"
  }, h$1(Mobile, null)));
}

export default index;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtZDUzNTVkNzcuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25UeXBlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9yZWR1Y2VyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL2FjdGlvbnMuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvSGFuZ291dHNQcm92aWRlci5qcyIsIi4uLy4uLy4uL3NlcnZlci9oYW5nb3V0cy9oYW5nb3V0U3RhdGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL3VzZVNvY2tldC5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9jbGllbnRDb21tYW5kcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS91c2VIYW5nb3V0cy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9tb2JpbGUuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IGFjdGlvblR5cGVzID0ge1xuICAgIE1FU1NBR0VfVEVYVF9DSEFOR0VEOidNRVNTQUdFX1RFWFRfQ0hBTkdFRCcsXG4gICAgTE9BRF9IQU5HT1VUUzogJ0xPQURfSEFOR09VVFMnLFxuICAgIExPQURFRF9NRVNTQUdFUzogJ0xPQURFRF9NRVNTQUdFUycsXG4gICAgU0FWRURfTUVTU0FHRV9MT0NBTExZOidTQVZFRF9NRVNTQUdFX0xPQ0FMTFknLFxuICAgIFNFQVJDSEVEX0hBTkdPVVQ6ICdTRUFSQ0hFRF9IQU5HT1VUJyxcbiAgICBTRUxFQ1RFRF9IQU5HT1VUOiAnU0VMRUNURURfSEFOR09VVCcsXG4gICAgU0VMRUNURURfVVNFUjonU0VMRUNURURfVVNFUicsXG4gICAgRklMVEVSX0hBTkdPVVRTOidGSUxURVJfSEFOR09VVFMnLFxuXG4gICAgRkVUQ0hfSEFOR09VVF9TVEFSVEVEOiAnRkVUQ0hfSEFOR09VVF9TVEFSVEVEJyxcbiAgICBGRVRDSF9IQU5HT1VUX1NVQ0NFU1M6ICdGRVRDSF9IQU5HT1VUX1NVQ0NFU1MnLFxuICAgIEZFVENIX0hBTkdPVVRfRkFJTEVEOiAnRkVUQ0hfSEFOR09VVF9GQUlMRUQnLFxuICAgIEZFVENIX0hBTkdPVVRfTk9UX0ZPVU5EOiAnRkVUQ0hfSEFOR09VVF9OT1RfRk9VTkQnLFxuXG5cbiAgICBGRVRDSF9VU0VSX1NUQVJURUQ6ICdGRVRDSF9VU0VSX1NUQVJURUQnLFxuICAgIEZFVENIX1VTRVJfU1VDQ0VTUzogJ0ZFVENIX1VTRVJfU1VDQ0VTUycsXG4gICAgRkVUQ0hfVVNFUl9GQUlMRUQ6ICdGRVRDSF9VU0VSX0ZBSUxFRCcsXG5cbiAgICBPTkxJTkVfU1RBVEVfQ0hBTkdFRDogJ09OTElORV9TVEFURV9DSEFOR0VEJyxcblxuICAgIEhBTkdPVVRfU1RBVEVfQ0hBTkdFRDogJ0hBTkdPVVRfU1RBVEVfQ0hBTkdFRCcsXG4gICAgTkVXX0hBTkdPVVRfUkVDSUVWRUQ6J05FV19IQU5HT1VUX1JFQ0lFVkVEJyxcbiAgICBDTElFTlRfQ09NTUFORF9TVEFSVEVEOidDTElFTlRfQ09NTUFORF9TVEFSVEVEJyxcbiAgICBDTElFTlRfQ09NTUFORF9TVUNDRVNTOidDTElFTlRfQ09NTUFORF9TVUNDRVNTJyxcbiAgICBDTElFTlRfQ09NTUFORF9GQUlMRUQ6J0NMSUVOVF9DT01NQU5EX0ZBSUxFRCdcbn0iLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4vYWN0aW9uVHlwZXMnO1xuZXhwb3J0IGNvbnN0IGluaXRTdGF0ZSA9IHtcbiAgaGFuZ291dHM6IFtdLFxuICBoYW5nb3V0OiBudWxsLFxuICBtZXNzYWdlczogbnVsbCxcbiAgc2VhcmNoOiAnJyxcbiAgdXNlcjogW10sXG4gIGxvYWRpbmc6IGZhbHNlLFxuICBlcnJvcjogbnVsbCxcbiAgbWVzc2FnZVRleHQ6ICcnLFxuICBvbmxpbmU6IGZhbHNlLFxufTtcbmV4cG9ydCBmdW5jdGlvbiByZWR1Y2VyKHN0YXRlLCBhY3Rpb24pIHtcbiAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0FWRURfTUVTU0FHRV9MT0NBTExZOlxuICAgICAgaWYgKHN0YXRlLm1lc3NhZ2VzKSB7XG4gICAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBtZXNzYWdlczogWy4uLnN0YXRlLm1lc3NhZ2VzLCBhY3Rpb24ubWVzc2FnZV0gfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBtZXNzYWdlczogW2FjdGlvbi5tZXNzYWdlXSB9O1xuICAgICAgfVxuXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0FERURfTUVTU0FHRVM6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbWVzc2FnZXM6IGFjdGlvbi5tZXNzYWdlcyB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuTUVTU0FHRV9URVhUX0NIQU5HRUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbWVzc2FnZVRleHQ6IGFjdGlvbi50ZXh0IH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9VU0VSX0ZBSUxFRDpcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfRkFJTEVEOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBlcnJvcjogYWN0aW9uLmVycm9yIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9VU0VSX1NUQVJURUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogdHJ1ZSB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuRkVUQ0hfVVNFUl9TVUNDRVNTOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgICAgICB1c2VyczogYWN0aW9uLnVzZXJzLFxuICAgICAgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfU1RBUlRFRDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiB0cnVlIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NVQ0NFU1M6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGhhbmdvdXRzOiBhY3Rpb24uaGFuZ291dHMgfTtcblxuICAgIGNhc2UgYWN0aW9uVHlwZXMuSEFOR09VVF9OT1RfRk9VTkQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZJTFRFUl9IQU5HT1VUUzpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBoYW5nb3V0czogc3RhdGUuaGFuZ291dHMuZmlsdGVyKChnKSA9PlxuICAgICAgICAgIGcudXNlcm5hbWUuaW5jbHVkZXMoc3RhdGUuc2VhcmNoKVxuICAgICAgICApLFxuICAgICAgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNFQVJDSEVEX0hBTkdPVVQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgc2VhcmNoOiBhY3Rpb24uc2VhcmNoIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0FEX0hBTkdPVVRTOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGhhbmdvdXRzOiBhY3Rpb24uaGFuZ291dHMgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNFTEVDVEVEX1VTRVI6XG4gICAgICBpZiAoc3RhdGUuaGFuZ291dHMpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgICBoYW5nb3V0czogWy4uLnN0YXRlLmhhbmdvdXRzLCBhY3Rpb24uaGFuZ291dF0sXG4gICAgICAgICAgaGFuZ291dDogYWN0aW9uLmhhbmdvdXQsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgaGFuZ291dHM6IFthY3Rpb24uaGFuZ291dF0sXG4gICAgICAgIGhhbmdvdXQ6IGFjdGlvbi5oYW5nb3V0LFxuICAgICAgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNFTEVDVEVEX0hBTkdPVVQ6XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgaGFuZ291dDogc3RhdGUuaGFuZ291dHMuZmluZCgoZykgPT4gZy51c2VybmFtZSA9PT0gYWN0aW9uLnVzZXJuYW1lKSxcbiAgICAgIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5IQU5HT1VUX1NUQVRFX0NIQU5HRUQ6XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgaGFuZ291dDogYWN0aW9uLmhhbmdvdXQsXG4gICAgICAgIGhhbmdvdXRzOiBzdGF0ZS5oYW5nb3V0cy5tYXAoKGcpID0+IHtcbiAgICAgICAgICBpZiAoZy51c2VybmFtZSA9PT0gYWN0aW9uLmhhbmdvdXQudXNlcm5hbWUpIHtcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24uaGFuZ291dDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGc7XG4gICAgICAgICAgfVxuICAgICAgICB9KSxcbiAgICAgIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5ORVdfSEFOR09VVF9SRUNJRVZFRDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBoYW5nb3V0czogWy4uLnN0YXRlLmhhbmdvdXRzLCBhY3Rpb24uaGFuZ291dF0gfTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHN0YXRlO1xuICB9XG59XG4iLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4vYWN0aW9uVHlwZXMnO1xuXG4vL3JldHJpZXZlcyBoYW5nb3V0cyBmcm9tIGxvY2FsU3RvcmFnZVxuZXhwb3J0IGZ1bmN0aW9uIGxvYWRIYW5nb3V0cyh7IHVzZXJuYW1lLCBkaXNwYXRjaCB9KSB7XG4gIGNvbnN0IGhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShgJHt1c2VybmFtZX0taGFuZ291dHNgKSk7XG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTE9BRF9IQU5HT1VUUywgaGFuZ291dHMgfSk7XG59XG4vL3NlbGVjdCBoYW5nb3V0IGZyb20gTGlzdFxuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdEhhbmdvdXQoeyBkaXNwYXRjaCwgdXNlcm5hbWUgfSkge1xuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFTEVDVEVEX0hBTkdPVVQsIHVzZXJuYW1lIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0VXNlcih7IGRpc3BhdGNoLCB1c2VyLCB1c2VybmFtZSB9KSB7XG4gIC8vIHNhdmUgc2VsZWN0ZWQgdXNlciB0byBoYW5nb3V0c1xuICBjb25zdCBoYW5nb3V0ID0geyAuLi51c2VyLCBzdGF0ZTogJ0lOVklURScgfTtcbiAgY29uc3QgaGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGAke3VzZXJuYW1lfS1oYW5nb3V0c2ApKTtcblxuICBpZiAoaGFuZ291dHMpIHtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcbiAgICAgIGAke3VzZXJuYW1lfS1oYW5nb3V0c2AsXG4gICAgICBKU09OLnN0cmluZ2lmeShbLi4uaGFuZ291dHMsIGhhbmdvdXRdKVxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oYCR7dXNlcm5hbWV9LWhhbmdvdXRzYCwgSlNPTi5zdHJpbmdpZnkoW2hhbmdvdXRdKSk7XG4gIH1cblxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFTEVDVEVEX1VTRVIsIGhhbmdvdXQgfSk7XG59XG4vL3NlYXJjaCBmb3IgaGFuZ291dCBieSB0eXBpbmcgaW50byBUZXh0SW5wdXRcbmV4cG9ydCBmdW5jdGlvbiBzZWFyY2hIYW5nb3V0cyh7IHNlYXJjaCwgZGlzcGF0Y2ggfSkge1xuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFQVJDSEVEX0hBTkdPVVQsIHNlYXJjaCB9KTtcbn1cbi8vZmlsdGVyIGhhbmdvdXQgYWZ0ZXIgc2VhcmNoIHN0YXRlIGNoYW5nZVxuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlckhhbmdvdXRzKHsgZGlzcGF0Y2ggfSkge1xuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZJTFRFUl9IQU5HT1VUUyB9KTtcbn1cblxuLy9mZXRjaCBoYW5nb3V0IGZyb20gc2VydmVyIGlmIG5vdCBmb3VuZCBpbiBsb2NhbCBoYW5nb3V0c1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoSGFuZ291dCh7IHNlYXJjaCwgZGlzcGF0Y2gsIHVzZXJuYW1lIH0pIHtcbiAgdHJ5IHtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfU1RBUlRFRCB9KTtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxuICAgICAgYC9oYW5nb3V0cy9maW5kP3NlYXJjaD0ke3NlYXJjaH0mdXNlcm5hbWU9JHt1c2VybmFtZX1gXG4gICAgKTtcbiAgICBpZiAocmVzcG9uc2Uub2spIHtcbiAgICAgIGNvbnN0IHsgaGFuZ291dHMgfSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgIGlmIChoYW5nb3V0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9TVUNDRVNTLCBoYW5nb3V0cyB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9OT1RfRk9VTkQgfSk7XG4gICAgICAgIC8vIGZldGNoIHVzZXIgZnJvbSBzZXJ2ZXIgaW4gaGFuZ291dCBpcyBuZXd1c2VyXG4gICAgICAgIGZldGNoVXNlcih7IHNlYXJjaCwgZGlzcGF0Y2ggfSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9OT1RfRk9VTkQgfSk7XG4gICAgICAvLyBmZXRjaCB1c2VyIGZyb20gc2VydmVyIGluIGhhbmdvdXQgaXMgbmV3dXNlclxuICAgICAgZmV0Y2hVc2VyKHsgc2VhcmNoLCBkaXNwYXRjaCB9KTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc3QgZXJyID0gZXJyb3I7XG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX0ZBSUxFRCwgZXJyb3IgfSk7XG4gIH1cbn1cbi8vIGZldGNoIHVzZXIgZnJvbSBzZXJ2ZXIgaW4gaGFuZ291dCBpcyBuZXd1c2VyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hVc2VyKHsgc2VhcmNoLCBkaXNwYXRjaCB9KSB7XG4gIHRyeSB7XG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9VU0VSX1NUQVJURUQgfSk7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL3VzZXJzL2ZpbmQ/c2VhcmNoPSR7c2VhcmNofWApO1xuICAgIGNvbnN0IHsgdXNlcnMgfSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcblxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfVVNFUl9TVUNDRVNTLCB1c2VycyB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX1VTRVJfRkFJTEVELCBlcnJvciB9KTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY2hhbmdlTWVzc2FnZVRleHQoeyB0ZXh0LCBkaXNwYXRjaCB9KSB7XG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTUVTU0FHRV9URVhUX0NIQU5HRUQsIHRleHQgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdGFydENsaWVudENvbW1hbmQoeyBkaXNwYXRjaCB9KSB7XG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQ0xJRU5UX0NPTU1BTkRfU1RBUlRFRCB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxvYWRNZXNzYWdlcyh7IGhhbmdvdXQsIGRpc3BhdGNoIH0pIHtcbiAgY29uc3QgeyB1c2VybmFtZSB9ID0gaGFuZ291dDtcbiAgY29uc3Qga2V5ID0gYCR7dXNlcm5hbWV9LW1lc3NhZ2VzYDtcbiAgY29uc3QgbWVzc2FnZXMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSkpO1xuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkxPQURFRF9NRVNTQUdFUywgbWVzc2FnZXMgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzYXZlTWVzc2FnZSh7IGhhbmdvdXQsIGRpc3BhdGNoIH0pIHtcbiAgY29uc3QgeyB1c2VybmFtZSB9ID0gaGFuZ291dDtcbiAgY29uc3Qga2V5ID0gYCR7dXNlcm5hbWV9LW1lc3NhZ2VzYDtcbiAgY29uc3QgbWVzc2FnZXMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSkpO1xuICBpZiAobWVzc2FnZXMpIHtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KFsuLi5tZXNzYWdlcywgbWVzc2FnZV0pKTtcbiAgfSBlbHNlIHtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KFttZXNzYWdlXSkpO1xuICB9XG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0FWRURfTUVTU0FHRV9MT0NBTExZLCBtZXNzYWdlIH0pO1xufVxuIiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQge1xuICB1c2VDb250ZXh0LFxuICB1c2VTdGF0ZSxcbiAgdXNlTWVtbyxcbiAgdXNlUmVkdWNlcixcbiAgdXNlRWZmZWN0LFxufSBmcm9tICdwcmVhY3QvaG9va3MnO1xuaW1wb3J0IHsgcmVkdWNlciwgaW5pdFN0YXRlIH0gZnJvbSAnLi9yZWR1Y2VyJztcblxuaW1wb3J0IHtcbiAgbG9hZEhhbmdvdXRzLFxuICBmaWx0ZXJIYW5nb3V0cyxcbiAgZmV0Y2hIYW5nb3V0LFxuICBsb2FkTWVzc2FnZXMsXG59IGZyb20gJy4vYWN0aW9ucyc7XG5pbXBvcnQgeyB1c2VBdXRoQ29udGV4dCB9IGZyb20gJy4uLy4uL2F1dGgvYXV0aC1jb250ZXh0JztcbmNvbnN0IEhhbmdvdXRDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xuZXhwb3J0IGZ1bmN0aW9uIHVzZUhhbmdvdXRDb250ZXh0KCkge1xuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChIYW5nb3V0Q29udGV4dCk7XG4gIGlmICghY29udGV4dCkge1xuICAgIHRocm93IG5ldyBFcnJvcigndXNlSGFuZ291dENvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggSGFuZ291dHNQcm92aWRlcicpO1xuICB9XG5cbiAgcmV0dXJuIGNvbnRleHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBIYW5nb3V0c1Byb3ZpZGVyKHByb3BzKSB7XG4gIGNvbnN0IGF1dGhDb250ZXh0ID0gdXNlQXV0aENvbnRleHQoKTtcbiAgY29uc3QgeyB1c2VybmFtZSB9ID0gYXV0aENvbnRleHQuc3RhdGU7XG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlUmVkdWNlcihyZWR1Y2VyLCBpbml0U3RhdGUpO1xuICBjb25zdCB7IGhhbmdvdXQgfSA9IHN0YXRlO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKHVzZXJuYW1lKSB7XG4gICAgICBsb2FkSGFuZ291dHMoeyB1c2VybmFtZSwgZGlzcGF0Y2ggfSk7XG4gICAgfVxuICB9LCBbdXNlcm5hbWVdKTtcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoaGFuZ291dCkge1xuICAgICAgbG9hZE1lc3NhZ2VzKHsgZGlzcGF0Y2gsIGhhbmdvdXQgfSk7XG4gICAgfVxuICB9LCBbaGFuZ291dF0pO1xuXG4gIGNvbnN0IHZhbHVlID0gdXNlTWVtbygoKSA9PiBbc3RhdGUsIGRpc3BhdGNoXSwgW3N0YXRlXSk7XG4gIHJldHVybiA8SGFuZ291dENvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlfSB7Li4ucHJvcHN9IC8+O1xufVxuIiwiXG4gIGV4cG9ydCBjb25zdCBoYW5nb3V0U3RhdGVzID0ge1xuICAgIElOVklURVI6ICdJTlZJVEVSJyxcbiAgICBBQ0NFUFRFUjogJ0FDQ0VQVEVSJyxcbiAgICBERUNMSU5FUjogJ0RFQ0xJTkVSJyxcbiAgICBCTE9DS0VSOiAnQkxPQ0tFUicsXG4gICAgVU5CTE9DS0VSOiAnVU5CTE9DS0VSJyxcbiAgICBNRVNTQU5HRVI6ICdNRVNTQU5HRVInLFxuICAgLy8gYWNrbm93bGVnZW1lbnRcbiAgICBJTlZJVEVEOiAnSU5WSVRFRCcsXG4gICAgQUNDRVBURUQ6ICdBQ0NFUFRFRCcsXG4gICAgREVDTElORUQ6ICdERUNMSU5FRCcsXG4gICAgQkxPQ0tFRDogJ0JMT0NLRUQnLFxuICAgIFVOQkxPQ0tFRDogJ1VOQkxPQ0tFRCcsXG4gICAgTUVTU0FHRUQ6ICdNRVNTQUdFRCcsXG4gIH07IiwiaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcbmltcG9ydCB7IHVzZVdTb2NrZXRDb250ZXh0IH0gZnJvbSAnLi4vLi4vd3NvY2tldC9XU29ja2V0UHJvdmlkZXInO1xuaW1wb3J0IHsgaGFuZ291dFN0YXRlcyB9IGZyb20gJy4uLy4uLy4uL3NlcnZlci9oYW5nb3V0cy9oYW5nb3V0U3RhdGVzJ1xuaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuL2FjdGlvblR5cGVzJ1xuZXhwb3J0IGZ1bmN0aW9uIHVzZVNvY2tldCh7IGRpc3BhdGNoLCB1c2VybmFtZSB9KSB7XG4gIGNvbnN0IHNvY2tldENvbnRleHQgPSB1c2VXU29ja2V0Q29udGV4dCgpO1xuICBjb25zdCB7IHNvY2tldCB9ID0gc29ja2V0Q29udGV4dFxuXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoc29ja2V0KSB7XG4gICAgICBzb2NrZXQub25tZXNzYWdlID0gKG1lc3NhZ2UpID0+IHtcbiAgICAgICAgY29uc3QgaGFuZ291dCA9IEpTT04ucGFyc2UobWVzc2FnZS5kYXRhKTtcbiAgICAgICAgZGVidWdnZXI7XG4gICAgICAgIGhhbmRsZUhhbmdvdXRTdGF0ZSh7IGhhbmdvdXQsIHVzZXJuYW1lLCBkaXNwYXRjaCB9KVxuICAgICAgfTtcbiAgICAgIHNvY2tldC5vbmNsb3NlID0gKCkgPT4ge1xuICAgICAgICA7XG4gICAgICB9O1xuICAgICAgc29ja2V0Lm9uZXJyb3IgPSAoZXJyb3IpID0+IHtcbiAgICAgICAgO1xuICAgICAgfTtcbiAgICAgIHNvY2tldC5vbm9wZW4gPSAoKSA9PiB7XG4gICAgICAgIDtcbiAgICAgIH07XG4gICAgfVxuICB9LCBbc29ja2V0XSk7XG5cbiAgcmV0dXJuIG51bGw7XG5cbn1cblxuZnVuY3Rpb24gaGFuZGxlSGFuZ291dFN0YXRlKHsgaGFuZ291dCwgdXNlcm5hbWUsIGRpc3BhdGNoIH0pIHtcbiAgY29uc3Qga2V5ID0gYCR7dXNlcm5hbWV9LWhhbmdvdXRzYFxuICBkZWJ1Z2dlcjtcbiAgY29uc3QgdGFyZ2V0ID0gaGFuZ291dC51c2VybmFtZVxuICBjb25zdCBoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KSlcbiAgZGVidWdnZXI7XG4gIGxldCB1cGRhdGVkU3RhdGUgPSBudWxsO1xuICBzd2l0Y2ggKGhhbmdvdXQuc3RhdGUpIHtcbiBcbiAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuQUNDRVBURVI6XG4gICAgY2FzZSBoYW5nb3V0U3RhdGVzLkJMT0NLRUQ6XG4gICAgY2FzZSBoYW5nb3V0U3RhdGVzLkJMT0NLRVI6XG4gICAgY2FzZSBoYW5nb3V0U3RhdGVzLkRFQ0xJTkVEOlxuICAgIGNhc2UgaGFuZ291dFN0YXRlcy5ERUNMSU5FUjpcbiAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuTUVTU0FHRUQ6XG4gICAgY2FzZSBoYW5nb3V0U3RhdGVzLk1FU1NBTkdFUjpcbiAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuVU5CTE9DS0VEOlxuICAgIGNhc2UgaGFuZ291dFN0YXRlcy5VTkJMT0NLRVI6XG4gICAgY2FzZSBoYW5nb3V0U3RhdGVzLklOVklURUQ6XG4gICAgICB1cGRhdGVkU3RhdGUgPSBoYW5nb3V0cy5tYXAoZyA9PiB7IGlmIChnLnVzZXJuYW1lID09PSB0YXJnZXQpIHsgcmV0dXJuIGhhbmdvdXQgfSBlbHNlIHJldHVybiBnIH0pXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KCB1cGRhdGVkU3RhdGUpKVxuICAgICAgZGVidWdnZXI7XG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkhBTkdPVVRfU1RBVEVfQ0hBTkdFRCwgaGFuZ291dCB9KVxuICAgICAgYnJlYWs7XG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuQUNDRVBURUQ6XG4gICAgY2FzZSBoYW5nb3V0U3RhdGVzLklOVklURVI6XG4gICAgICBpZiAoaGFuZ291dHMpIHtcbiAgICAgICAgZGVidWdnZXJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LEpTT04uc3RyaW5naWZ5KGhhbmdvdXRzLnB1c2goaGFuZ291dCkpKVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGRlYnVnZ2VyO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KFtoYW5nb3V0XSkpXG4gICAgICB9XG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLk5FV19IQU5HT1VUX1JFQ0lFVkVELCBoYW5nb3V0IH0pXG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaGFuZ291dFN0YXRlIG5vdCBkZWZpbmVkXCIpXG4gIH1cblxufVxuXG5cblxuXG5cblxuIiwiXG4vL2lzIHNlbnQgYnkgY2xpZW50XG5leHBvcnQgY29uc3QgY2xpZW50Q29tbWFuZHMgPSB7XG4gIElOVklURTogJ0lOVklURScsXG4gIEFDQ0VQVDogJ0FDQ0VQVCcsXG4gIERFQ0xJTkU6ICdERUNMSU5FJyxcbiAgQkxPQ0s6ICdCTE9DSycsXG4gIFVOQkxPQ0s6ICdVTkJMT0NLJyxcbiAgTUVTU0FHRTogJ01FU1NBR0UnLFxufTtcblxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyB1c2VIYW5nb3V0Q29udGV4dCB9IGZyb20gJy4vSGFuZ291dHNQcm92aWRlcic7XG5pbXBvcnQgeyB1c2VBdXRoQ29udGV4dCB9IGZyb20gJy4uLy4uL2F1dGgvYXV0aC1jb250ZXh0JztcbmltcG9ydCB7IHVzZVdTb2NrZXRDb250ZXh0IH0gZnJvbSAnLi4vLi4vd3NvY2tldC9XU29ja2V0UHJvdmlkZXInO1xuaW1wb3J0IHtcbiAgc2VsZWN0SGFuZ291dCxcbiAgc2VhcmNoSGFuZ291dHMsXG4gIGZpbHRlckhhbmdvdXRzLFxuICBmZXRjaEhhbmdvdXQsXG4gIHNlbGVjdFVzZXIsXG4gIGNoYW5nZU1lc3NhZ2VUZXh0LFxuICBzdGFydENsaWVudENvbW1hbmQsXG4gIHNhdmVNZXNzYWdlLFxufSBmcm9tICcuL2FjdGlvbnMnO1xuaW1wb3J0IHsgdXNlU29ja2V0IH0gZnJvbSAnLi91c2VTb2NrZXQnO1xuaW1wb3J0IHsgY2xpZW50Q29tbWFuZHMgfSBmcm9tICcuL2NsaWVudENvbW1hbmRzJztcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUhhbmdvdXRzKCkge1xuICBjb25zdCBzb2NrZXRDb250ZXh0ID0gdXNlV1NvY2tldENvbnRleHQoKTtcbiAgY29uc3QgeyBzb2NrZXQgfSA9IHNvY2tldENvbnRleHQ7XG4gIGNvbnN0IGF1dGhDb250ZXh0ID0gdXNlQXV0aENvbnRleHQoKTtcbiAgY29uc3QgeyB1c2VybmFtZSB9ID0gYXV0aENvbnRleHQuc3RhdGU7XG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlSGFuZ291dENvbnRleHQoKTtcbiAgY29uc3QgeyBoYW5nb3V0LCBoYW5nb3V0cywgc2VhcmNoLCB1c2VycywgbWVzc2FnZVRleHQsIG1lc3NhZ2VzIH0gPSBzdGF0ZTtcbiAgY29uc3QgaGFuZGxlU29ja2V0ID0gdXNlU29ja2V0KHsgZGlzcGF0Y2gsIGhhbmdvdXQsIHVzZXJuYW1lIH0pO1xuICBmdW5jdGlvbiBvblNlbGVjdEhhbmdvdXQoZSkge1xuICAgIGNvbnN0IHVzZXJuYW1lID0gZS50YXJnZXQuaWQ7XG4gICAgc2VsZWN0SGFuZ291dCh7IGRpc3BhdGNoLCB1c2VybmFtZSB9KTtcbiAgfVxuICBmdW5jdGlvbiBvblNlbGVjdFVzZXIoZSkge1xuICAgIGNvbnN0IHVuYW1lID0gZS50YXJnZXQuaWQ7XG4gICAgY29uc3QgdXNlciA9IHVzZXJzLmZpbmQoKHUpID0+IHUudXNlcm5hbWUgPT09IHVuYW1lKTtcbiAgICBzZWxlY3RVc2VyKHsgZGlzcGF0Y2gsIHVzZXIsIHVzZXJuYW1lIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gb25JbnZpdGUoKSB7XG4gICAgY29uc3QgeyB1c2VybmFtZSwgZW1haWwgfSA9IGhhbmdvdXQ7XG4gICAgY29uc3QgdXBkYXRlZEhhbmdvdXQgPSB7XG4gICAgICB1c2VybmFtZSxcbiAgICAgIGVtYWlsLFxuICAgICAgbWVzc2FnZTogeyB0ZXh0OiBtZXNzYWdlVGV4dCwgdGltZXN0YW1wOiBEYXRlLm5vdygpIH0sXG4gICAgfTtcbiAgICBzb2NrZXQuc2VuZChcbiAgICAgIEpTT04uc3RyaW5naWZ5KHsgLi4udXBkYXRlZEhhbmdvdXQsIGNvbW1hbmQ6IGNsaWVudENvbW1hbmRzLklOVklURSB9KVxuICAgICk7XG4gICAgc3RhcnRDbGllbnRDb21tYW5kKHsgZGlzcGF0Y2ggfSk7XG4gIH1cbiAgZnVuY3Rpb24gb25BY2NlcHQoKSB7XG4gICAgY29uc3QgeyB1c2VybmFtZSwgZW1haWwgfSA9IGhhbmdvdXQ7XG4gICAgZGVidWdnZXI7XG4gICAgc29ja2V0LnNlbmQoXG4gICAgICBKU09OLnN0cmluZ2lmeSh7IHVzZXJuYW1lLCBlbWFpbCwgY29tbWFuZDogY2xpZW50Q29tbWFuZHMuQUNDRVBUIH0pXG4gICAgKTtcbiAgICBzdGFydENsaWVudENvbW1hbmQoeyBkaXNwYXRjaCB9KTtcbiAgfVxuICBmdW5jdGlvbiBvbkJsb2NrKCkge1xuICAgIHNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHsgLi4uaGFuZ291dCwgY29tbWFuZDogY2xpZW50Q29tbWFuZHMuQkxPQ0sgfSkpO1xuICAgIHN0YXJ0Q2xpZW50Q29tbWFuZCh7IGRpc3BhdGNoIH0pO1xuICB9XG4gIGZ1bmN0aW9uIG9uVW5ibG9jaygpIHtcbiAgICBzb2NrZXQuc2VuZChcbiAgICAgIEpTT04uc3RyaW5naWZ5KHsgLi4uaGFuZ291dCwgY29tbWFuZDogY2xpZW50Q29tbWFuZHMuVU5CTE9DSyB9KVxuICAgICk7XG4gICAgc3RhcnRDbGllbnRDb21tYW5kKHsgZGlzcGF0Y2ggfSk7XG4gIH1cbiAgZnVuY3Rpb24gb25EZWNsaW5lKCkge1xuICAgIHNvY2tldC5zZW5kKFxuICAgICAgSlNPTi5zdHJpbmdpZnkoeyAuLi5oYW5nb3V0LCBjb21tYW5kOiBjbGllbnRDb21tYW5kcy5ERUNMSU5FIH0pXG4gICAgKTtcbiAgICBzdGFydENsaWVudENvbW1hbmQoeyBkaXNwYXRjaCB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uTWVzc2FnZSgpIHtcbiAgICBzb2NrZXQuc2VuZChcbiAgICAgIEpTT04uc3RyaW5naWZ5KHsgLi4uaGFuZ291dCwgY29tbWFuZDogY2xpZW50Q29tbWFuZHMuTUVTU0FHRSB9KVxuICAgICk7XG4gICAgc3RhcnRDbGllbnRDb21tYW5kKHsgZGlzcGF0Y2ggfSk7XG4gICAgc2F2ZU1lc3NhZ2UoeyBkaXNwYXRjaCwgaGFuZ291dDogeyAuLi5oYW5nb3V0LCBtZXNzYWdlIH0gfSk7XG4gIH1cblxuICBmdW5jdGlvbiBvblNlYXJjaChlKSB7XG4gICAgc2VhcmNoSGFuZ291dHMoeyBzZWFyY2g6IGUudGFyZ2V0LnZhbHVlLCBkaXNwYXRjaCB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uU3RhcnRTZWFyY2goZSkge1xuICAgIGlmIChoYW5nb3V0cyAmJiBoYW5nb3V0cy5sZW5ndGggPiAwKSB7XG4gICAgICBmaWx0ZXJIYW5nb3V0cyh7IGRpc3BhdGNoIH0pO1xuICAgIH1cbiAgICBmZXRjaEhhbmdvdXQoeyBkaXNwYXRjaCwgc2VhcmNoLCB1c2VybmFtZSB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uTWVzc2FnZVRleHQoZSkge1xuICAgIGNoYW5nZU1lc3NhZ2VUZXh0KHsgZGlzcGF0Y2gsIHRleHQ6IGUudGFyZ2V0LnZhbHVlIH0pO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBvbk1lc3NhZ2VUZXh0LFxuICAgIG1lc3NhZ2VUZXh0LFxuICAgIG9uU3RhcnRTZWFyY2gsXG4gICAgb25TZWFyY2gsXG4gICAgc2VhcmNoLFxuICAgIG9uTWVzc2FnZSxcbiAgICBvbkludml0ZSxcbiAgICBvbkFjY2VwdCxcbiAgICBvbkJsb2NrLFxuICAgIG9uVW5ibG9jayxcbiAgICBvblNlbGVjdEhhbmdvdXQsXG4gICAgb25TZWxlY3RVc2VyLFxuICAgIG9uRGVjbGluZSxcbiAgICBoYW5nb3V0LFxuICAgIGhhbmdvdXRzLFxuICAgIHVzZXJzLFxuICAgIHVzZXJuYW1lLFxuICAgIG1lc3NhZ2VzLFxuICB9O1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xuaW1wb3J0IHsgbGF6eSwgU3VzcGVuc2UgfSBmcm9tICdwcmVhY3QvY29tcGF0JztcbmltcG9ydCB7IFJvdXRlLCB1c2VSb3V0ZUNvbnRleHQgfSBmcm9tICcuLi9yb3V0ZS9yb3V0ZXInO1xuXG5pbXBvcnQgeyB1c2VIYW5nb3V0cyB9IGZyb20gJy4vc3RhdGUvdXNlSGFuZ291dHMnO1xuY29uc3QgSGFuZ291dHMgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9IYW5nb3V0JykpO1xuY29uc3QgQmxvY2sgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9zdGF0ZS11aS9CbG9jaycpKTtcbmNvbnN0IEJsb2NrZWQgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9zdGF0ZS11aS9CbG9ja2VkJykpO1xuY29uc3QgQ29uZmlndXJlID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vc3RhdGUtdWkvQ29uZmlndXJlJykpO1xuY29uc3QgSGFuZ2NoYXQgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9zdGF0ZS11aS9IYW5nY2hhdCcpKTtcbmNvbnN0IEludml0ZSA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL3N0YXRlLXVpL0ludml0ZScpKTtcbmNvbnN0IEludml0ZWUgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9zdGF0ZS11aS9JbnZpdGVlJykpO1xuY29uc3QgSW52aXRlciA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL3N0YXRlLXVpL0ludml0ZXInKSk7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE1vYmlsZSgpIHtcbiAgY29uc3QgW3JvdXRlLCBzZXRSb3V0ZV0gPSB1c2VSb3V0ZUNvbnRleHQoKTtcbiAgY29uc3Qge1xuICAgIGhhbmdvdXQsXG4gICAgaGFuZ291dHMsXG4gICAgb25BY2NlcHQsXG4gICAgb25CbG9jayxcbiAgICBvbkludml0ZSxcbiAgICBvblNlbGVjdEhhbmdvdXQsXG4gICAgb25TZWxlY3RVc2VyLFxuICAgIG9uVW5ibG9jayxcbiAgICBvblNlYXJjaCxcbiAgICB1c2VycyxcbiAgICBzZWFyY2gsXG4gICAgb25TdGFydFNlYXJjaCxcbiAgICBvbk1lc3NhZ2VUZXh0LFxuICAgIG9uTWVzc2FnZSxcbiAgICBtZXNzYWdlVGV4dCxcbiAgICB1c2VybmFtZSxcbiAgICBtZXNzYWdlc1xuICB9ID0gdXNlSGFuZ291dHMoKTtcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoaGFuZ291dCkge1xuICAgICAgc2V0Um91dGUoYC8ke2hhbmdvdXQuc3RhdGV9YCk7XG4gICAgfVxuICB9LCBbaGFuZ291dF0pO1xuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3sgaGVpZ2h0OiAnODV2aCcgfX0+XG4gICAgICA8Um91dGUgcGF0aD1cIi9oYW5nb3V0c1wiPlxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+TG9hZGluZy4uLjwvZGl2Pn0+XG4gICAgICAgICAgPEhhbmdvdXRzXG4gICAgICAgICAgICB1c2Vycz17dXNlcnN9XG4gICAgICAgICAgICBzZWFyY2g9e3NlYXJjaH1cbiAgICAgICAgICAgIGhhbmdvdXRzPXtoYW5nb3V0c31cbiAgICAgICAgICAgIG9uU2VsZWN0SGFuZ291dD17b25TZWxlY3RIYW5nb3V0fVxuICAgICAgICAgICAgb25TZWxlY3RVc2VyPXtvblNlbGVjdFVzZXJ9XG4gICAgICAgICAgICBvblNlYXJjaD17b25TZWFyY2h9XG4gICAgICAgICAgICBvblN0YXJ0U2VhcmNoPXtvblN0YXJ0U2VhcmNofVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvU3VzcGVuc2U+XG4gICAgICA8L1JvdXRlPlxuICAgICAgPFJvdXRlIHBhdGg9XCIvQkxPQ0tcIj5cbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxuICAgICAgICAgIDxCbG9jayBoYW5nb3V0PXtoYW5nb3V0fSBvbkJsb2NrPXtvbkJsb2NrfSAvPlxuICAgICAgICA8L1N1c3BlbnNlPlxuICAgICAgPC9Sb3V0ZT5cbiAgICAgIDxSb3V0ZSBwYXRoPVwiL0JMT0NLRURcIj5cbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxuICAgICAgICAgIDxCbG9ja2VkIGhhbmdvdXQ9e2hhbmdvdXR9IG9uVW5ibG9jaz17b25VbmJsb2NrfSAvPlxuICAgICAgICA8L1N1c3BlbnNlPlxuICAgICAgPC9Sb3V0ZT5cbiAgICAgIDxSb3V0ZSBwYXRoPVwiL2NvbmZpZ3VyZVwiPlxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+TG9hZGluZy4uLjwvZGl2Pn0+XG4gICAgICAgICAgPENvbmZpZ3VyZSBoYW5nb3V0PXtoYW5nb3V0fSAvPlxuICAgICAgICA8L1N1c3BlbnNlPlxuICAgICAgPC9Sb3V0ZT5cbiAgICAgIDxSb3V0ZSBwYXRoPVwiL0FDQ0VQVEVEXCI+XG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cbiAgICAgICAgICA8SGFuZ2NoYXRcbiAgICAgICAgICAgIG9uTWVzc2FnZVRleHQ9e29uTWVzc2FnZVRleHR9XG4gICAgICAgICAgICBvbk1lc3NhZ2U9e29uTWVzc2FnZX1cbiAgICAgICAgICAgIG1lc3NhZ2VzPXttZXNzYWdlc31cbiAgICAgICAgICAgIHVzZXJuYW1lPXt1c2VybmFtZX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L1N1c3BlbnNlPlxuICAgICAgPC9Sb3V0ZT5cbiAgICAgIDxSb3V0ZSBwYXRoPVwiL0FDQ0VQVEVSXCI+XG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cbiAgICAgICAgICA8SGFuZ2NoYXRcbiAgICAgICAgICAgIG9uTWVzc2FnZVRleHQ9e29uTWVzc2FnZVRleHR9XG4gICAgICAgICAgICBvbk1lc3NhZ2U9e29uTWVzc2FnZX1cbiAgICAgICAgICAgIG1lc3NhZ2VzPXttZXNzYWdlc31cbiAgICAgICAgICAgIHVzZXJuYW1lPXt1c2VybmFtZX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L1N1c3BlbnNlPlxuICAgICAgPC9Sb3V0ZT5cbiAgICAgIDxSb3V0ZSBwYXRoPVwiL0lOVklURVwiPlxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+TG9hZGluZy4uLjwvZGl2Pn0+XG4gICAgICAgICAgPEludml0ZVxuICAgICAgICAgICAgaGFuZ291dD17aGFuZ291dH1cbiAgICAgICAgICAgIG9uSW52aXRlPXtvbkludml0ZX1cbiAgICAgICAgICAgIG9uTWVzc2FnZVRleHQ9e29uTWVzc2FnZVRleHR9XG4gICAgICAgICAgICBtZXNzYWdlVGV4dD17bWVzc2FnZVRleHR9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9TdXNwZW5zZT5cbiAgICAgIDwvUm91dGU+XG4gICAgICA8Um91dGUgcGF0aD1cIi9JTlZJVEVEXCI+XG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cbiAgICAgICAgICA8SW52aXRlZSBoYW5nb3V0PXtoYW5nb3V0fSAvPlxuICAgICAgICA8L1N1c3BlbnNlPlxuICAgICAgPC9Sb3V0ZT5cbiAgICAgIDxSb3V0ZSBwYXRoPVwiL0lOVklURVJcIj5cbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxuICAgICAgICAgIDxJbnZpdGVyIGhhbmdvdXQ9e2hhbmdvdXR9IG9uQWNjZXB0PXtvbkFjY2VwdH0gLz5cbiAgICAgICAgPC9TdXNwZW5zZT5cbiAgICAgIDwvUm91dGU+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IE1vYmlsZSBmcm9tICcuL21vYmlsZSc7XHJcbmltcG9ydCB7IEhhbmdvdXRzUHJvdmlkZXIgfSBmcm9tICcuL3N0YXRlL0hhbmdvdXRzUHJvdmlkZXInO1xyXG5pbXBvcnQgeyBSb3V0ZVByb3ZpZGVyLCB1c2VSb3V0ZUNvbnRleHQgfSBmcm9tICcuLi9yb3V0ZS9yb3V0ZXInO1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxIYW5nb3V0c1Byb3ZpZGVyPlxyXG4gICAgICA8Um91dGVQcm92aWRlciBpbml0aWFsUm91dGU9XCIvaGFuZ291dHNcIj5cclxuICAgICAgICA8TW9iaWxlIC8+XHJcbiAgICAgIDwvUm91dGVQcm92aWRlcj5cclxuICAgIDwvSGFuZ291dHNQcm92aWRlcj5cclxuICApO1xyXG59XHJcbiJdLCJuYW1lcyI6WyJhY3Rpb25UeXBlcyIsIk1FU1NBR0VfVEVYVF9DSEFOR0VEIiwiTE9BRF9IQU5HT1VUUyIsIkxPQURFRF9NRVNTQUdFUyIsIlNBVkVEX01FU1NBR0VfTE9DQUxMWSIsIlNFQVJDSEVEX0hBTkdPVVQiLCJTRUxFQ1RFRF9IQU5HT1VUIiwiU0VMRUNURURfVVNFUiIsIkZJTFRFUl9IQU5HT1VUUyIsIkZFVENIX0hBTkdPVVRfU1RBUlRFRCIsIkZFVENIX0hBTkdPVVRfU1VDQ0VTUyIsIkZFVENIX0hBTkdPVVRfRkFJTEVEIiwiRkVUQ0hfSEFOR09VVF9OT1RfRk9VTkQiLCJGRVRDSF9VU0VSX1NUQVJURUQiLCJGRVRDSF9VU0VSX1NVQ0NFU1MiLCJGRVRDSF9VU0VSX0ZBSUxFRCIsIk9OTElORV9TVEFURV9DSEFOR0VEIiwiSEFOR09VVF9TVEFURV9DSEFOR0VEIiwiTkVXX0hBTkdPVVRfUkVDSUVWRUQiLCJDTElFTlRfQ09NTUFORF9TVEFSVEVEIiwiQ0xJRU5UX0NPTU1BTkRfU1VDQ0VTUyIsIkNMSUVOVF9DT01NQU5EX0ZBSUxFRCIsImluaXRTdGF0ZSIsImhhbmdvdXRzIiwiaGFuZ291dCIsIm1lc3NhZ2VzIiwic2VhcmNoIiwidXNlciIsImxvYWRpbmciLCJlcnJvciIsIm1lc3NhZ2VUZXh0Iiwib25saW5lIiwicmVkdWNlciIsInN0YXRlIiwiYWN0aW9uIiwidHlwZSIsIm1lc3NhZ2UiLCJ0ZXh0IiwidXNlcnMiLCJIQU5HT1VUX05PVF9GT1VORCIsImZpbHRlciIsImciLCJ1c2VybmFtZSIsImluY2x1ZGVzIiwiZmluZCIsIm1hcCIsImxvYWRIYW5nb3V0cyIsImRpc3BhdGNoIiwiSlNPTiIsInBhcnNlIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsInNlbGVjdEhhbmdvdXQiLCJzZWxlY3RVc2VyIiwic2V0SXRlbSIsInN0cmluZ2lmeSIsInNlYXJjaEhhbmdvdXRzIiwiZmlsdGVySGFuZ291dHMiLCJmZXRjaEhhbmdvdXQiLCJyZXNwb25zZSIsImZldGNoIiwib2siLCJqc29uIiwibGVuZ3RoIiwiZmV0Y2hVc2VyIiwiY2hhbmdlTWVzc2FnZVRleHQiLCJzdGFydENsaWVudENvbW1hbmQiLCJsb2FkTWVzc2FnZXMiLCJrZXkiLCJzYXZlTWVzc2FnZSIsIkhhbmdvdXRDb250ZXh0IiwiY3JlYXRlQ29udGV4dCIsInVzZUhhbmdvdXRDb250ZXh0IiwiY29udGV4dCIsInVzZUNvbnRleHQiLCJFcnJvciIsIkhhbmdvdXRzUHJvdmlkZXIiLCJwcm9wcyIsImF1dGhDb250ZXh0IiwidXNlQXV0aENvbnRleHQiLCJ1c2VSZWR1Y2VyIiwidXNlRWZmZWN0IiwidmFsdWUiLCJ1c2VNZW1vIiwiaCIsImhhbmdvdXRTdGF0ZXMiLCJJTlZJVEVSIiwiQUNDRVBURVIiLCJERUNMSU5FUiIsIkJMT0NLRVIiLCJVTkJMT0NLRVIiLCJNRVNTQU5HRVIiLCJJTlZJVEVEIiwiQUNDRVBURUQiLCJERUNMSU5FRCIsIkJMT0NLRUQiLCJVTkJMT0NLRUQiLCJNRVNTQUdFRCIsInVzZVNvY2tldCIsInNvY2tldENvbnRleHQiLCJ1c2VXU29ja2V0Q29udGV4dCIsInNvY2tldCIsIm9ubWVzc2FnZSIsImRhdGEiLCJoYW5kbGVIYW5nb3V0U3RhdGUiLCJvbmNsb3NlIiwib25lcnJvciIsIm9ub3BlbiIsInRhcmdldCIsInVwZGF0ZWRTdGF0ZSIsInB1c2giLCJjbGllbnRDb21tYW5kcyIsIklOVklURSIsIkFDQ0VQVCIsIkRFQ0xJTkUiLCJCTE9DSyIsIlVOQkxPQ0siLCJNRVNTQUdFIiwidXNlSGFuZ291dHMiLCJoYW5kbGVTb2NrZXQiLCJvblNlbGVjdEhhbmdvdXQiLCJlIiwiaWQiLCJvblNlbGVjdFVzZXIiLCJ1bmFtZSIsInUiLCJvbkludml0ZSIsImVtYWlsIiwidXBkYXRlZEhhbmdvdXQiLCJ0aW1lc3RhbXAiLCJEYXRlIiwibm93Iiwic2VuZCIsImNvbW1hbmQiLCJvbkFjY2VwdCIsIm9uQmxvY2siLCJvblVuYmxvY2siLCJvbkRlY2xpbmUiLCJvbk1lc3NhZ2UiLCJvblNlYXJjaCIsIm9uU3RhcnRTZWFyY2giLCJvbk1lc3NhZ2VUZXh0IiwiSGFuZ291dHMiLCJsYXp5IiwiQmxvY2siLCJCbG9ja2VkIiwiQ29uZmlndXJlIiwiSGFuZ2NoYXQiLCJJbnZpdGUiLCJJbnZpdGVlIiwiSW52aXRlciIsIk1vYmlsZSIsInJvdXRlIiwic2V0Um91dGUiLCJ1c2VSb3V0ZUNvbnRleHQiLCJoZWlnaHQiLCJTdXNwZW5zZSJdLCJtYXBwaW5ncyI6Ijs7QUFBTyxNQUFNQSxXQUFXLEdBQUc7QUFDdkJDLEVBQUFBLG9CQUFvQixFQUFDLHNCQURFO0FBRXZCQyxFQUFBQSxhQUFhLEVBQUUsZUFGUTtBQUd2QkMsRUFBQUEsZUFBZSxFQUFFLGlCQUhNO0FBSXZCQyxFQUFBQSxxQkFBcUIsRUFBQyx1QkFKQztBQUt2QkMsRUFBQUEsZ0JBQWdCLEVBQUUsa0JBTEs7QUFNdkJDLEVBQUFBLGdCQUFnQixFQUFFLGtCQU5LO0FBT3ZCQyxFQUFBQSxhQUFhLEVBQUMsZUFQUztBQVF2QkMsRUFBQUEsZUFBZSxFQUFDLGlCQVJPO0FBVXZCQyxFQUFBQSxxQkFBcUIsRUFBRSx1QkFWQTtBQVd2QkMsRUFBQUEscUJBQXFCLEVBQUUsdUJBWEE7QUFZdkJDLEVBQUFBLG9CQUFvQixFQUFFLHNCQVpDO0FBYXZCQyxFQUFBQSx1QkFBdUIsRUFBRSx5QkFiRjtBQWdCdkJDLEVBQUFBLGtCQUFrQixFQUFFLG9CQWhCRztBQWlCdkJDLEVBQUFBLGtCQUFrQixFQUFFLG9CQWpCRztBQWtCdkJDLEVBQUFBLGlCQUFpQixFQUFFLG1CQWxCSTtBQW9CdkJDLEVBQUFBLG9CQUFvQixFQUFFLHNCQXBCQztBQXNCdkJDLEVBQUFBLHFCQUFxQixFQUFFLHVCQXRCQTtBQXVCdkJDLEVBQUFBLG9CQUFvQixFQUFDLHNCQXZCRTtBQXdCdkJDLEVBQUFBLHNCQUFzQixFQUFDLHdCQXhCQTtBQXlCdkJDLEVBQUFBLHNCQUFzQixFQUFDLHdCQXpCQTtBQTBCdkJDLEVBQUFBLHFCQUFxQixFQUFDO0FBMUJDLENBQXBCOztBQ0NB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
