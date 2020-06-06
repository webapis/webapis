import { M, u as useAuthContext, p, l, h, a as h$1, _ as _extends, w, b as useWSocketContext, c as useRouteContext, R as Route, d as M$1, O, e as RouteProvider } from './index-35b63066.js';

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
    socket,
    online
  } = socketContext;
  l(() => {
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

const Hangouts = O(() => import('./Hangout-6482d6e1.js'));
const Block = O(() => import('./Block-cc95897b.js'));
const Blocked = O(() => import('./Blocked-61a13a32.js'));
const Configure = O(() => import('./Configure-14a0e90d.js'));
const Hangchat = O(() => import('./Hangchat-2f41eba0.js'));
const Invite = O(() => import('./Invite-31b1e2c2.js'));
const Invitee = O(() => import('./Invitee-07159f06.js'));
const Inviter = O(() => import('./Inviter-d7c4b04f.js'));
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
    paths: ["/ACCEPTED", "/ACCEPTER", "/MESSANGER", "/MESSAGED"]
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtMDBjMjI0ZDUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25UeXBlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9yZWR1Y2VyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL2FjdGlvbnMuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvSGFuZ291dHNQcm92aWRlci5qcyIsIi4uLy4uLy4uL3NlcnZlci9oYW5nb3V0cy9oYW5nb3V0U3RhdGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL2NsaWVudENvbW1hbmRzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL3VzZVNvY2tldC5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS91c2VIYW5nb3V0cy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9tb2JpbGUuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IGFjdGlvblR5cGVzID0ge1xuICAgIE1FU1NBR0VfVEVYVF9DSEFOR0VEOidNRVNTQUdFX1RFWFRfQ0hBTkdFRCcsXG4gICAgTE9BRF9IQU5HT1VUUzogJ0xPQURfSEFOR09VVFMnLFxuICAgIExPQURFRF9NRVNTQUdFUzogJ0xPQURFRF9NRVNTQUdFUycsXG4gICAgU0FWRURfTUVTU0FHRV9MT0NBTExZOidTQVZFRF9NRVNTQUdFX0xPQ0FMTFknLFxuICAgIFNFQVJDSEVEX0hBTkdPVVQ6ICdTRUFSQ0hFRF9IQU5HT1VUJyxcbiAgICBTRUxFQ1RFRF9IQU5HT1VUOiAnU0VMRUNURURfSEFOR09VVCcsXG4gICAgU0VMRUNURURfVVNFUjonU0VMRUNURURfVVNFUicsXG4gICAgRklMVEVSX0hBTkdPVVRTOidGSUxURVJfSEFOR09VVFMnLFxuXG4gICAgRkVUQ0hfSEFOR09VVF9TVEFSVEVEOiAnRkVUQ0hfSEFOR09VVF9TVEFSVEVEJyxcbiAgICBGRVRDSF9IQU5HT1VUX1NVQ0NFU1M6ICdGRVRDSF9IQU5HT1VUX1NVQ0NFU1MnLFxuICAgIEZFVENIX0hBTkdPVVRfRkFJTEVEOiAnRkVUQ0hfSEFOR09VVF9GQUlMRUQnLFxuICAgIEZFVENIX0hBTkdPVVRfTk9UX0ZPVU5EOiAnRkVUQ0hfSEFOR09VVF9OT1RfRk9VTkQnLFxuXG5cbiAgICBGRVRDSF9VU0VSX1NUQVJURUQ6ICdGRVRDSF9VU0VSX1NUQVJURUQnLFxuICAgIEZFVENIX1VTRVJfU1VDQ0VTUzogJ0ZFVENIX1VTRVJfU1VDQ0VTUycsXG4gICAgRkVUQ0hfVVNFUl9GQUlMRUQ6ICdGRVRDSF9VU0VSX0ZBSUxFRCcsXG5cbiAgICBPTkxJTkVfU1RBVEVfQ0hBTkdFRDogJ09OTElORV9TVEFURV9DSEFOR0VEJyxcblxuICAgIEhBTkdPVVRfU1RBVEVfQ0hBTkdFRDogJ0hBTkdPVVRfU1RBVEVfQ0hBTkdFRCcsXG4gICAgTkVXX0hBTkdPVVRfUkVDSUVWRUQ6J05FV19IQU5HT1VUX1JFQ0lFVkVEJyxcbiAgICBDTElFTlRfQ09NTUFORF9TVEFSVEVEOidDTElFTlRfQ09NTUFORF9TVEFSVEVEJyxcbiAgICBDTElFTlRfQ09NTUFORF9TVUNDRVNTOidDTElFTlRfQ09NTUFORF9TVUNDRVNTJyxcbiAgICBDTElFTlRfQ09NTUFORF9GQUlMRUQ6J0NMSUVOVF9DT01NQU5EX0ZBSUxFRCdcbn0iLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4vYWN0aW9uVHlwZXMnO1xuZXhwb3J0IGNvbnN0IGluaXRTdGF0ZSA9IHtcbiAgaGFuZ291dHM6IFtdLFxuICBoYW5nb3V0OiBudWxsLFxuICBtZXNzYWdlczogbnVsbCxcbiAgc2VhcmNoOiAnJyxcbiAgdXNlcjogW10sXG4gIGxvYWRpbmc6IGZhbHNlLFxuICBlcnJvcjogbnVsbCxcbiAgbWVzc2FnZVRleHQ6ICcnLFxuICBvbmxpbmU6IGZhbHNlLFxufTtcbmV4cG9ydCBmdW5jdGlvbiByZWR1Y2VyKHN0YXRlLCBhY3Rpb24pIHtcbiAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0FWRURfTUVTU0FHRV9MT0NBTExZOlxuICAgICAgaWYgKHN0YXRlLm1lc3NhZ2VzKSB7XG4gICAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBtZXNzYWdlczogWy4uLnN0YXRlLm1lc3NhZ2VzLCBhY3Rpb24ubWVzc2FnZV0gfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBtZXNzYWdlczogW2FjdGlvbi5tZXNzYWdlXSB9O1xuICAgICAgfVxuXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0FERURfTUVTU0FHRVM6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbWVzc2FnZXM6IGFjdGlvbi5tZXNzYWdlcyB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuTUVTU0FHRV9URVhUX0NIQU5HRUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbWVzc2FnZVRleHQ6IGFjdGlvbi50ZXh0IH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9VU0VSX0ZBSUxFRDpcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfRkFJTEVEOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBlcnJvcjogYWN0aW9uLmVycm9yIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9VU0VSX1NUQVJURUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogdHJ1ZSB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuRkVUQ0hfVVNFUl9TVUNDRVNTOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgICAgICB1c2VyczogYWN0aW9uLnVzZXJzLFxuICAgICAgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfU1RBUlRFRDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiB0cnVlIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NVQ0NFU1M6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGhhbmdvdXRzOiBhY3Rpb24uaGFuZ291dHMgfTtcblxuICAgIGNhc2UgYWN0aW9uVHlwZXMuSEFOR09VVF9OT1RfRk9VTkQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZJTFRFUl9IQU5HT1VUUzpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBoYW5nb3V0czogc3RhdGUuaGFuZ291dHMuZmlsdGVyKChnKSA9PlxuICAgICAgICAgIGcudXNlcm5hbWUuaW5jbHVkZXMoc3RhdGUuc2VhcmNoKVxuICAgICAgICApLFxuICAgICAgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNFQVJDSEVEX0hBTkdPVVQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgc2VhcmNoOiBhY3Rpb24uc2VhcmNoIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0FEX0hBTkdPVVRTOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGhhbmdvdXRzOiBhY3Rpb24uaGFuZ291dHMgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNFTEVDVEVEX1VTRVI6XG4gICAgICBpZiAoc3RhdGUuaGFuZ291dHMpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgICBoYW5nb3V0czogWy4uLnN0YXRlLmhhbmdvdXRzLCBhY3Rpb24uaGFuZ291dF0sXG4gICAgICAgICAgaGFuZ291dDogYWN0aW9uLmhhbmdvdXQsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgaGFuZ291dHM6IFthY3Rpb24uaGFuZ291dF0sXG4gICAgICAgIGhhbmdvdXQ6IGFjdGlvbi5oYW5nb3V0LFxuICAgICAgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNFTEVDVEVEX0hBTkdPVVQ6XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgaGFuZ291dDogc3RhdGUuaGFuZ291dHMuZmluZCgoZykgPT4gZy51c2VybmFtZSA9PT0gYWN0aW9uLnVzZXJuYW1lKSxcbiAgICAgIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5IQU5HT1VUX1NUQVRFX0NIQU5HRUQ6XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgaGFuZ291dDogYWN0aW9uLmhhbmdvdXQsXG4gICAgICAgIGhhbmdvdXRzOiBzdGF0ZS5oYW5nb3V0cy5tYXAoKGcpID0+IHtcbiAgICAgICAgICBpZiAoZy51c2VybmFtZSA9PT0gYWN0aW9uLmhhbmdvdXQudXNlcm5hbWUpIHtcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24uaGFuZ291dDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGc7XG4gICAgICAgICAgfVxuICAgICAgICB9KSxcbiAgICAgIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5ORVdfSEFOR09VVF9SRUNJRVZFRDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBoYW5nb3V0czogWy4uLnN0YXRlLmhhbmdvdXRzLCBhY3Rpb24uaGFuZ291dF0gfTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHN0YXRlO1xuICB9XG59XG4iLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4vYWN0aW9uVHlwZXMnO1xuXG4vL3JldHJpZXZlcyBoYW5nb3V0cyBmcm9tIGxvY2FsU3RvcmFnZVxuZXhwb3J0IGZ1bmN0aW9uIGxvYWRIYW5nb3V0cyh7IHVzZXJuYW1lLCBkaXNwYXRjaCB9KSB7XG4gIGNvbnN0IGhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShgJHt1c2VybmFtZX0taGFuZ291dHNgKSk7XG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTE9BRF9IQU5HT1VUUywgaGFuZ291dHMgfSk7XG59XG4vL3NlbGVjdCBoYW5nb3V0IGZyb20gTGlzdFxuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdEhhbmdvdXQoeyBkaXNwYXRjaCwgdXNlcm5hbWUgfSkge1xuXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VMRUNURURfSEFOR09VVCwgdXNlcm5hbWUgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZWxlY3RVc2VyKHsgZGlzcGF0Y2gsIHVzZXIsIHVzZXJuYW1lIH0pIHtcbiAgLy8gc2F2ZSBzZWxlY3RlZCB1c2VyIHRvIGhhbmdvdXRzXG4gIGNvbnN0IGhhbmdvdXQgPSB7IC4uLnVzZXIsIHN0YXRlOiAnSU5WSVRFJyB9O1xuICBjb25zdCBoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oYCR7dXNlcm5hbWV9LWhhbmdvdXRzYCkpO1xuXG4gIGlmIChoYW5nb3V0cykge1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFxuICAgICAgYCR7dXNlcm5hbWV9LWhhbmdvdXRzYCxcbiAgICAgIEpTT04uc3RyaW5naWZ5KFsuLi5oYW5nb3V0cywgaGFuZ291dF0pXG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShgJHt1c2VybmFtZX0taGFuZ291dHNgLCBKU09OLnN0cmluZ2lmeShbaGFuZ291dF0pKTtcbiAgfVxuXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VMRUNURURfVVNFUiwgaGFuZ291dCB9KTtcbn1cbi8vc2VhcmNoIGZvciBoYW5nb3V0IGJ5IHR5cGluZyBpbnRvIFRleHRJbnB1dFxuZXhwb3J0IGZ1bmN0aW9uIHNlYXJjaEhhbmdvdXRzKHsgc2VhcmNoLCBkaXNwYXRjaCB9KSB7XG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VBUkNIRURfSEFOR09VVCwgc2VhcmNoIH0pO1xufVxuLy9maWx0ZXIgaGFuZ291dCBhZnRlciBzZWFyY2ggc3RhdGUgY2hhbmdlXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVySGFuZ291dHMoeyBkaXNwYXRjaCB9KSB7XG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRklMVEVSX0hBTkdPVVRTIH0pO1xufVxuXG4vL2ZldGNoIGhhbmdvdXQgZnJvbSBzZXJ2ZXIgaWYgbm90IGZvdW5kIGluIGxvY2FsIGhhbmdvdXRzXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hIYW5nb3V0KHsgc2VhcmNoLCBkaXNwYXRjaCwgdXNlcm5hbWUgfSkge1xuICB0cnkge1xuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9TVEFSVEVEIH0pO1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXG4gICAgICBgL2hhbmdvdXRzL2ZpbmQ/c2VhcmNoPSR7c2VhcmNofSZ1c2VybmFtZT0ke3VzZXJuYW1lfWBcbiAgICApO1xuICAgIGlmIChyZXNwb25zZS5vaykge1xuICAgICAgY29uc3QgeyBoYW5nb3V0cyB9ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgaWYgKGhhbmdvdXRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NVQ0NFU1MsIGhhbmdvdXRzIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX05PVF9GT1VORCB9KTtcbiAgICAgICAgLy8gZmV0Y2ggdXNlciBmcm9tIHNlcnZlciBpbiBoYW5nb3V0IGlzIG5ld3VzZXJcbiAgICAgICAgZmV0Y2hVc2VyKHsgc2VhcmNoLCBkaXNwYXRjaCB9KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX05PVF9GT1VORCB9KTtcbiAgICAgIC8vIGZldGNoIHVzZXIgZnJvbSBzZXJ2ZXIgaW4gaGFuZ291dCBpcyBuZXd1c2VyXG4gICAgICBmZXRjaFVzZXIoeyBzZWFyY2gsIGRpc3BhdGNoIH0pO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zdCBlcnIgPSBlcnJvcjtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfRkFJTEVELCBlcnJvciB9KTtcbiAgfVxufVxuLy8gZmV0Y2ggdXNlciBmcm9tIHNlcnZlciBpbiBoYW5nb3V0IGlzIG5ld3VzZXJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaFVzZXIoeyBzZWFyY2gsIGRpc3BhdGNoIH0pIHtcbiAgdHJ5IHtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX1VTRVJfU1RBUlRFRCB9KTtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAvdXNlcnMvZmluZD9zZWFyY2g9JHtzZWFyY2h9YCk7XG4gICAgY29uc3QgeyB1c2VycyB9ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9VU0VSX1NVQ0NFU1MsIHVzZXJzIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfVVNFUl9GQUlMRUQsIGVycm9yIH0pO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjaGFuZ2VNZXNzYWdlVGV4dCh7IHRleHQsIGRpc3BhdGNoIH0pIHtcbiBcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5NRVNTQUdFX1RFWFRfQ0hBTkdFRCwgdGV4dCB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0YXJ0Q2xpZW50Q29tbWFuZCh7IGRpc3BhdGNoIH0pIHtcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5DTElFTlRfQ09NTUFORF9TVEFSVEVEIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbG9hZE1lc3NhZ2VzKHsgaGFuZ291dCwgZGlzcGF0Y2ggfSkge1xuICBjb25zdCB7IHVzZXJuYW1lIH0gPSBoYW5nb3V0O1xuICBjb25zdCBrZXkgPSBgJHt1c2VybmFtZX0tbWVzc2FnZXNgO1xuICBjb25zdCBtZXNzYWdlcyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KSk7XG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTE9BREVEX01FU1NBR0VTLCBtZXNzYWdlcyB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVNZXNzYWdlKHsgIGRpc3BhdGNoLCBtZXNzYWdlLHVzZXJuYW1lLHRhcmdldCB9KSB7XG4gXG4gIGNvbnN0IGtleSA9IGAke3RhcmdldH0tbWVzc2FnZXNgO1xuICBjb25zdCBtZXNzYWdlcyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KSk7XG4gIGlmIChtZXNzYWdlcykge1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkoWy4uLm1lc3NhZ2VzLHsuLi5tZXNzYWdlLHVzZXJuYW1lfV0pKTtcbiAgfSBlbHNlIHtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KFt7Li4ubWVzc2FnZSx1c2VybmFtZX1dKSk7XG4gIH1cbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TQVZFRF9NRVNTQUdFX0xPQ0FMTFksIG1lc3NhZ2UgfSk7XG59XG4iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7XG4gIHVzZUNvbnRleHQsXG4gIHVzZVN0YXRlLFxuICB1c2VNZW1vLFxuICB1c2VSZWR1Y2VyLFxuICB1c2VFZmZlY3QsXG59IGZyb20gJ3ByZWFjdC9ob29rcyc7XG5pbXBvcnQgeyByZWR1Y2VyLCBpbml0U3RhdGUgfSBmcm9tICcuL3JlZHVjZXInO1xuXG5pbXBvcnQge1xuICBsb2FkSGFuZ291dHMsXG4gIGZpbHRlckhhbmdvdXRzLFxuICBmZXRjaEhhbmdvdXQsXG4gIGxvYWRNZXNzYWdlcyxcbiAgc2F2ZU1lc3NhZ2UsXG59IGZyb20gJy4vYWN0aW9ucyc7XG5pbXBvcnQgeyB1c2VBdXRoQ29udGV4dCB9IGZyb20gJy4uLy4uL2F1dGgvYXV0aC1jb250ZXh0JztcbmNvbnN0IEhhbmdvdXRDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xuZXhwb3J0IGZ1bmN0aW9uIHVzZUhhbmdvdXRDb250ZXh0KCkge1xuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChIYW5nb3V0Q29udGV4dCk7XG4gIGlmICghY29udGV4dCkge1xuICAgIHRocm93IG5ldyBFcnJvcigndXNlSGFuZ291dENvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggSGFuZ291dHNQcm92aWRlcicpO1xuICB9XG5cbiAgcmV0dXJuIGNvbnRleHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBIYW5nb3V0c1Byb3ZpZGVyKHByb3BzKSB7XG4gIGNvbnN0IGF1dGhDb250ZXh0ID0gdXNlQXV0aENvbnRleHQoKTtcbiAgY29uc3QgeyB1c2VybmFtZSB9ID0gYXV0aENvbnRleHQuc3RhdGU7XG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlUmVkdWNlcihyZWR1Y2VyLCBpbml0U3RhdGUpO1xuICBjb25zdCB7IGhhbmdvdXQgfSA9IHN0YXRlO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKHVzZXJuYW1lKSB7XG4gICAgICBsb2FkSGFuZ291dHMoeyB1c2VybmFtZSwgZGlzcGF0Y2ggfSk7XG4gICAgfVxuICB9LCBbdXNlcm5hbWVdKTtcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoaGFuZ291dCkge1xuICAgICAgLy9mcm9tIGxvY2FsIHN0b3JhZ2VcbiAgICAgIGxvYWRNZXNzYWdlcyh7IGRpc3BhdGNoLCBoYW5nb3V0IH0pO1xuXG4gICAgICAvL3NhdmUgaGFuZ291dCB0byBsb2NhbFN0b3JhZ2VcbiAgICAgIGNvbnN0IGtleSA9IGAke3VzZXJuYW1lfS1oYW5nb3V0c2A7XG4gICAgICBjb25zdCBoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KSk7XG4gICAgICBpZiAoIWhhbmdvdXRzKSB7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkoW2hhbmdvdXRdKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBoYW5nb3V0RXhpc3QgPSBoYW5nb3V0cy5maW5kKFxuICAgICAgICAgIChnKSA9PiBnLnVzZXJuYW1lID09PSBoYW5nb3V0LnVzZXJuYW1lXG4gICAgICAgICk7XG4gICAgICAgIGlmIChoYW5nb3V0RXhpc3QpIHtcbiAgICAgICAgICBjb25zdCB1cGRhdGVkID0gaGFuZ291dHMubWFwKChnKSA9PiB7XG4gICAgICAgICAgICBpZiAoZy51c2VybmFtZSA9PT0gaGFuZ291dC51c2VybmFtZSkge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZ291dDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiBnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkodXBkYXRlZCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkoW2hhbmdvdXRdKSk7XG4gICAgICAgXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sIFtoYW5nb3V0XSk7XG5cbiAgY29uc3QgdmFsdWUgPSB1c2VNZW1vKCgpID0+IFtzdGF0ZSwgZGlzcGF0Y2hdLCBbc3RhdGVdKTtcbiAgcmV0dXJuIDxIYW5nb3V0Q29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30gLz47XG59XG4iLCJcbiAgZXhwb3J0IGNvbnN0IGhhbmdvdXRTdGF0ZXMgPSB7XG4gICAgSU5WSVRFUjogJ0lOVklURVInLFxuICAgIEFDQ0VQVEVSOiAnQUNDRVBURVInLFxuICAgIERFQ0xJTkVSOiAnREVDTElORVInLFxuICAgIEJMT0NLRVI6ICdCTE9DS0VSJyxcbiAgICBVTkJMT0NLRVI6ICdVTkJMT0NLRVInLFxuICAgIE1FU1NBTkdFUjogJ01FU1NBTkdFUicsXG4gICAvLyBhY2tub3dsZWdlbWVudFxuICAgIElOVklURUQ6ICdJTlZJVEVEJyxcbiAgICBBQ0NFUFRFRDogJ0FDQ0VQVEVEJyxcbiAgICBERUNMSU5FRDogJ0RFQ0xJTkVEJyxcbiAgICBCTE9DS0VEOiAnQkxPQ0tFRCcsXG4gICAgVU5CTE9DS0VEOiAnVU5CTE9DS0VEJyxcbiAgICBNRVNTQUdFRDogJ01FU1NBR0VEJyxcbiAgfTsiLCJcbi8vaXMgc2VudCBieSBjbGllbnRcbmV4cG9ydCBjb25zdCBjbGllbnRDb21tYW5kcyA9IHtcbiAgSU5WSVRFOiAnSU5WSVRFJyxcbiAgQUNDRVBUOiAnQUNDRVBUJyxcbiAgREVDTElORTogJ0RFQ0xJTkUnLFxuICBCTE9DSzogJ0JMT0NLJyxcbiAgVU5CTE9DSzogJ1VOQkxPQ0snLFxuICBNRVNTQUdFOiAnTUVTU0FHRScsXG4gIE9OTElORTonT05MSU5FJ1xufTtcblxuIiwiaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcbmltcG9ydCB7IHVzZVdTb2NrZXRDb250ZXh0IH0gZnJvbSAnLi4vLi4vd3NvY2tldC9XU29ja2V0UHJvdmlkZXInO1xuaW1wb3J0IHsgaGFuZ291dFN0YXRlcyB9IGZyb20gJy4uLy4uLy4uL3NlcnZlci9oYW5nb3V0cy9oYW5nb3V0U3RhdGVzJ1xuaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuL2FjdGlvblR5cGVzJ1xuaW1wb3J0IHtjbGllbnRDb21tYW5kc30gZnJvbSAnLi9jbGllbnRDb21tYW5kcydcbmV4cG9ydCBmdW5jdGlvbiB1c2VTb2NrZXQoeyBkaXNwYXRjaCwgdXNlcm5hbWUgfSkge1xuICBjb25zdCBzb2NrZXRDb250ZXh0ID0gdXNlV1NvY2tldENvbnRleHQoKTtcbiAgY29uc3QgeyBzb2NrZXQsb25saW5lIH0gPSBzb2NrZXRDb250ZXh0XG5cblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChzb2NrZXQgJiYgdXNlcm5hbWUpIHtcbiAgICAgIHNvY2tldC5vbm1lc3NhZ2UgPSAobWVzc2FnZSkgPT4ge1xuICAgICAgICBjb25zdCBoYW5nb3V0ID0gSlNPTi5wYXJzZShtZXNzYWdlLmRhdGEpO1xuICAgICAgICBkZWJ1Z2dlcjtcbiAgICAgICAgaGFuZGxlSGFuZ291dFN0YXRlKHsgaGFuZ291dCwgdXNlcm5hbWUsIGRpc3BhdGNoIH0pXG4gICAgICB9O1xuICAgICAgc29ja2V0Lm9uY2xvc2UgPSAoKSA9PiB7XG4gICAgICAgIFxuICAgICAgfTtcbiAgICAgIHNvY2tldC5vbmVycm9yID0gKGVycm9yKSA9PiB7XG4gICAgICAgIFxuICAgICAgfTtcbiAgICAgIFxuICAgICAgc29ja2V0Lm9ub3BlbiA9ICgpID0+IHtcbiAgICAgICAgZGVidWdnZXI7XG4gICAgICAgXG4gICAgICB9O1xuICAgIH1cbiAgfSwgW3NvY2tldCx1c2VybmFtZV0pO1xuXG4gIHJldHVybiBudWxsO1xuXG59XG5cbmZ1bmN0aW9uIGhhbmRsZUhhbmdvdXRTdGF0ZSh7IGhhbmdvdXQsIHVzZXJuYW1lLCBkaXNwYXRjaCB9KSB7XG4gIGNvbnN0IGtleSA9IGAke3VzZXJuYW1lfS1oYW5nb3V0c2BcbiAgZGVidWdnZXI7XG4gIGNvbnN0IHRhcmdldCA9IGhhbmdvdXQudXNlcm5hbWVcbiAgY29uc3QgaGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSkpXG4gIGRlYnVnZ2VyO1xuICBsZXQgdXBkYXRlZFN0YXRlID0gbnVsbDtcbiAgc3dpdGNoIChoYW5nb3V0LnN0YXRlKSB7XG4gXG4gICAgY2FzZSBoYW5nb3V0U3RhdGVzLkFDQ0VQVEVSOlxuICAgIGNhc2UgaGFuZ291dFN0YXRlcy5CTE9DS0VEOlxuICAgIGNhc2UgaGFuZ291dFN0YXRlcy5CTE9DS0VSOlxuICAgIGNhc2UgaGFuZ291dFN0YXRlcy5ERUNMSU5FRDpcbiAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuREVDTElORVI6XG4gICAgY2FzZSBoYW5nb3V0U3RhdGVzLk1FU1NBR0VEOlxuICAgIGNhc2UgaGFuZ291dFN0YXRlcy5NRVNTQU5HRVI6XG4gICAgY2FzZSBoYW5nb3V0U3RhdGVzLlVOQkxPQ0tFRDpcbiAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuVU5CTE9DS0VSOlxuICAgIGNhc2UgaGFuZ291dFN0YXRlcy5JTlZJVEVEOlxuICAgICAgdXBkYXRlZFN0YXRlID0gaGFuZ291dHMubWFwKGcgPT4geyBpZiAoZy51c2VybmFtZSA9PT0gdGFyZ2V0KSB7IHJldHVybiBoYW5nb3V0IH0gZWxzZSByZXR1cm4gZyB9KVxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeSggdXBkYXRlZFN0YXRlKSlcbiAgICAgIGRlYnVnZ2VyO1xuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5IQU5HT1VUX1NUQVRFX0NIQU5HRUQsIGhhbmdvdXQgfSlcbiAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBoYW5nb3V0U3RhdGVzLkFDQ0VQVEVEOlxuICAgIGNhc2UgaGFuZ291dFN0YXRlcy5JTlZJVEVSOlxuICAgICAgaWYgKGhhbmdvdXRzKSB7XG4gICAgICAgIGRlYnVnZ2VyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSxKU09OLnN0cmluZ2lmeShoYW5nb3V0cy5wdXNoKGhhbmdvdXQpKSlcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBkZWJ1Z2dlcjtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeShbaGFuZ291dF0pKVxuICAgICAgfVxuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5ORVdfSEFOR09VVF9SRUNJRVZFRCwgaGFuZ291dCB9KVxuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcihcImhhbmdvdXRTdGF0ZSBub3QgZGVmaW5lZFwiKVxuICB9XG5cbiAgZnVuY3Rpb24gb25PbmxpbmUoKXtcbiAgICBzb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7Y29tbWFuZDpjbGllbnRDb21tYW5kcy5PTkxJTkV9KSlcbiAgfVxuXG59XG5cblxuXG5cblxuXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IHVzZUhhbmdvdXRDb250ZXh0IH0gZnJvbSAnLi9IYW5nb3V0c1Byb3ZpZGVyJztcbmltcG9ydCB7IHVzZUF1dGhDb250ZXh0IH0gZnJvbSAnLi4vLi4vYXV0aC9hdXRoLWNvbnRleHQnO1xuaW1wb3J0IHsgdXNlV1NvY2tldENvbnRleHQgfSBmcm9tICcuLi8uLi93c29ja2V0L1dTb2NrZXRQcm92aWRlcic7XG5pbXBvcnQge1xuICBzZWxlY3RIYW5nb3V0LFxuICBzZWFyY2hIYW5nb3V0cyxcbiAgZmlsdGVySGFuZ291dHMsXG4gIGZldGNoSGFuZ291dCxcbiAgc2VsZWN0VXNlcixcbiAgY2hhbmdlTWVzc2FnZVRleHQsXG4gIHN0YXJ0Q2xpZW50Q29tbWFuZCxcbiAgc2F2ZU1lc3NhZ2UsXG59IGZyb20gJy4vYWN0aW9ucyc7XG5pbXBvcnQgeyB1c2VTb2NrZXQgfSBmcm9tICcuL3VzZVNvY2tldCc7XG5pbXBvcnQgeyBjbGllbnRDb21tYW5kcyB9IGZyb20gJy4vY2xpZW50Q29tbWFuZHMnO1xuXG5leHBvcnQgZnVuY3Rpb24gdXNlSGFuZ291dHMoKSB7XG4gIGNvbnN0IHNvY2tldENvbnRleHQgPSB1c2VXU29ja2V0Q29udGV4dCgpO1xuICBjb25zdCB7IHNvY2tldCB9ID0gc29ja2V0Q29udGV4dDtcbiAgY29uc3QgYXV0aENvbnRleHQgPSB1c2VBdXRoQ29udGV4dCgpO1xuICBjb25zdCB7IHVzZXJuYW1lIH0gPSBhdXRoQ29udGV4dC5zdGF0ZTtcbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSB1c2VIYW5nb3V0Q29udGV4dCgpO1xuICBjb25zdCB7IGhhbmdvdXQsIGhhbmdvdXRzLCBzZWFyY2gsIHVzZXJzLCBtZXNzYWdlVGV4dCwgbWVzc2FnZXMgfSA9IHN0YXRlO1xuICBjb25zdCBoYW5kbGVTb2NrZXQgPSB1c2VTb2NrZXQoeyBkaXNwYXRjaCwgaGFuZ291dCwgdXNlcm5hbWUgfSk7XG4gIGZ1bmN0aW9uIG9uU2VsZWN0SGFuZ291dChlKSB7XG4gICAgY29uc3QgdXNlcm5hbWUgPSBlLnRhcmdldC5pZDtcbiAgICBzZWxlY3RIYW5nb3V0KHsgZGlzcGF0Y2gsIHVzZXJuYW1lIH0pO1xuICB9XG4gIGZ1bmN0aW9uIG9uU2VsZWN0VXNlcihlKSB7XG4gICAgY29uc3QgdW5hbWUgPSBlLnRhcmdldC5pZDtcbiAgICBjb25zdCB1c2VyID0gdXNlcnMuZmluZCgodSkgPT4gdS51c2VybmFtZSA9PT0gdW5hbWUpO1xuICAgIHNlbGVjdFVzZXIoeyBkaXNwYXRjaCwgdXNlciwgdXNlcm5hbWUgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBvbkludml0ZSgpIHtcbiAgICBjb25zdCB7IHVzZXJuYW1lLCBlbWFpbCB9ID0gaGFuZ291dDtcbiAgICBjb25zdCBtZXNzYWdlID0geyB0ZXh0OiBtZXNzYWdlVGV4dCwgdGltZXN0YW1wOiBEYXRlLm5vdygpIH07XG4gICAgY29uc3QgdXBkYXRlZEhhbmdvdXQgPSB7XG4gICAgICB1c2VybmFtZSxcbiAgICAgIGVtYWlsLFxuICAgICAgbWVzc2FnZSxcbiAgICB9O1xuICAgIHNvY2tldC5zZW5kKFxuICAgICAgSlNPTi5zdHJpbmdpZnkoeyAuLi51cGRhdGVkSGFuZ291dCwgY29tbWFuZDogY2xpZW50Q29tbWFuZHMuSU5WSVRFIH0pXG4gICAgKTtcbiAgICBzdGFydENsaWVudENvbW1hbmQoeyBkaXNwYXRjaCB9KTtcbiAgfVxuICBmdW5jdGlvbiBvbkFjY2VwdCgpIHtcbiAgICBjb25zdCB7IHVzZXJuYW1lLCBlbWFpbCB9ID0gaGFuZ291dDtcbiAgICBkZWJ1Z2dlcjtcbiAgICBzb2NrZXQuc2VuZChcbiAgICAgIEpTT04uc3RyaW5naWZ5KHsgdXNlcm5hbWUsIGVtYWlsLCBjb21tYW5kOiBjbGllbnRDb21tYW5kcy5BQ0NFUFQgfSlcbiAgICApO1xuICAgIHN0YXJ0Q2xpZW50Q29tbWFuZCh7IGRpc3BhdGNoIH0pO1xuICB9XG4gIGZ1bmN0aW9uIG9uQmxvY2soKSB7XG4gICAgc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoeyAuLi5oYW5nb3V0LCBjb21tYW5kOiBjbGllbnRDb21tYW5kcy5CTE9DSyB9KSk7XG4gICAgc3RhcnRDbGllbnRDb21tYW5kKHsgZGlzcGF0Y2ggfSk7XG4gIH1cbiAgZnVuY3Rpb24gb25VbmJsb2NrKCkge1xuICAgIHNvY2tldC5zZW5kKFxuICAgICAgSlNPTi5zdHJpbmdpZnkoeyAuLi5oYW5nb3V0LCBjb21tYW5kOiBjbGllbnRDb21tYW5kcy5VTkJMT0NLIH0pXG4gICAgKTtcbiAgICBzdGFydENsaWVudENvbW1hbmQoeyBkaXNwYXRjaCB9KTtcbiAgfVxuICBmdW5jdGlvbiBvbkRlY2xpbmUoKSB7XG4gICAgc29ja2V0LnNlbmQoXG4gICAgICBKU09OLnN0cmluZ2lmeSh7IC4uLmhhbmdvdXQsIGNvbW1hbmQ6IGNsaWVudENvbW1hbmRzLkRFQ0xJTkUgfSlcbiAgICApO1xuICAgIHN0YXJ0Q2xpZW50Q29tbWFuZCh7IGRpc3BhdGNoIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gb25NZXNzYWdlKCkge1xuICAgIGNvbnN0IHsgdXNlcm5hbWUsIGVtYWlsIH0gPSBoYW5nb3V0O1xuICAgIGNvbnN0IG1lc3NhZ2UgPSB7IHRleHQ6IG1lc3NhZ2VUZXh0LCB0aW1lc3RhbXA6ICBEYXRlLm5vdygpIH07XG4gICAgY29uc3QgdXBkYXRlZEhhbmdvdXQgPSB7XG4gICAgICB1c2VybmFtZSxcbiAgICAgIGVtYWlsLFxuICAgICAgbWVzc2FnZSxcbiAgICB9O1xuIFxuICAgIHNvY2tldC5zZW5kKFxuICAgICAgSlNPTi5zdHJpbmdpZnkoeyAuLi51cGRhdGVkSGFuZ291dCwgY29tbWFuZDogY2xpZW50Q29tbWFuZHMuTUVTU0FHRSB9KVxuICAgICk7XG4gICAgc3RhcnRDbGllbnRDb21tYW5kKHsgZGlzcGF0Y2ggfSk7XG4gICAgc2F2ZU1lc3NhZ2UoeyBkaXNwYXRjaCwgaGFuZ291dCwgbWVzc2FnZSwgdGFyZ2V0OnVzZXJuYW1lICx1c2VybmFtZTphdXRoQ29udGV4dC5zdGF0ZS51c2VybmFtZX0pO1xuICB9XG5cbiAgZnVuY3Rpb24gb25TZWFyY2goZSkge1xuICAgIHNlYXJjaEhhbmdvdXRzKHsgc2VhcmNoOiBlLnRhcmdldC52YWx1ZSwgZGlzcGF0Y2ggfSk7XG4gIH1cblxuICBmdW5jdGlvbiBvblN0YXJ0U2VhcmNoKGUpIHtcbiAgICBpZiAoaGFuZ291dHMgJiYgaGFuZ291dHMubGVuZ3RoID4gMCkge1xuICAgICAgZmlsdGVySGFuZ291dHMoeyBkaXNwYXRjaCB9KTtcbiAgICB9XG4gICAgZmV0Y2hIYW5nb3V0KHsgZGlzcGF0Y2gsIHNlYXJjaCwgdXNlcm5hbWUgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBvbk1lc3NhZ2VUZXh0KGUpIHtcbiAgICBjb25zdCB0ZXh0ID1lLnRhcmdldC52YWx1ZVxuXG4gICAgY2hhbmdlTWVzc2FnZVRleHQoeyBkaXNwYXRjaCwgdGV4dH0pO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBvbk1lc3NhZ2VUZXh0LFxuICAgIG1lc3NhZ2VUZXh0LFxuICAgIG9uU3RhcnRTZWFyY2gsXG4gICAgb25TZWFyY2gsXG4gICAgc2VhcmNoLFxuICAgIG9uTWVzc2FnZSxcbiAgICBvbkludml0ZSxcbiAgICBvbkFjY2VwdCxcbiAgICBvbkJsb2NrLFxuICAgIG9uVW5ibG9jayxcbiAgICBvblNlbGVjdEhhbmdvdXQsXG4gICAgb25TZWxlY3RVc2VyLFxuICAgIG9uRGVjbGluZSxcbiAgICBoYW5nb3V0LFxuICAgIGhhbmdvdXRzLFxuICAgIHVzZXJzLFxuICAgIHVzZXJuYW1lLFxuICAgIG1lc3NhZ2VzLFxuICB9O1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xuaW1wb3J0IHsgbGF6eSwgU3VzcGVuc2UgfSBmcm9tICdwcmVhY3QvY29tcGF0JztcbmltcG9ydCB7IFJvdXRlLCB1c2VSb3V0ZUNvbnRleHQgfSBmcm9tICcuLi9yb3V0ZS9yb3V0ZXInO1xuXG5pbXBvcnQgeyB1c2VIYW5nb3V0cyB9IGZyb20gJy4vc3RhdGUvdXNlSGFuZ291dHMnO1xuY29uc3QgSGFuZ291dHMgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9IYW5nb3V0JykpO1xuY29uc3QgQmxvY2sgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9zdGF0ZS11aS9CbG9jaycpKTtcbmNvbnN0IEJsb2NrZWQgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9zdGF0ZS11aS9CbG9ja2VkJykpO1xuY29uc3QgQ29uZmlndXJlID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vc3RhdGUtdWkvQ29uZmlndXJlJykpO1xuY29uc3QgSGFuZ2NoYXQgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9zdGF0ZS11aS9IYW5nY2hhdCcpKTtcbmNvbnN0IEludml0ZSA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL3N0YXRlLXVpL0ludml0ZScpKTtcbmNvbnN0IEludml0ZWUgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9zdGF0ZS11aS9JbnZpdGVlJykpO1xuY29uc3QgSW52aXRlciA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL3N0YXRlLXVpL0ludml0ZXInKSk7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE1vYmlsZSgpIHtcbiAgY29uc3QgW3JvdXRlLCBzZXRSb3V0ZV0gPSB1c2VSb3V0ZUNvbnRleHQoKTtcbiAgY29uc3Qge1xuICAgIGhhbmdvdXQsXG4gICAgaGFuZ291dHMsXG4gICAgb25BY2NlcHQsXG4gICAgb25CbG9jayxcbiAgICBvbkludml0ZSxcbiAgICBvblNlbGVjdEhhbmdvdXQsXG4gICAgb25TZWxlY3RVc2VyLFxuICAgIG9uVW5ibG9jayxcbiAgICBvblNlYXJjaCxcbiAgICB1c2VycyxcbiAgICBzZWFyY2gsXG4gICAgb25TdGFydFNlYXJjaCxcbiAgICBvbk1lc3NhZ2VUZXh0LFxuICAgIG9uTWVzc2FnZSxcbiAgICBtZXNzYWdlVGV4dCxcbiAgICB1c2VybmFtZSxcbiAgICBtZXNzYWdlc1xuICB9ID0gdXNlSGFuZ291dHMoKTtcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoaGFuZ291dCkge1xuICAgICAgc2V0Um91dGUoYC8ke2hhbmdvdXQuc3RhdGV9YCk7XG4gICAgfVxuICB9LCBbaGFuZ291dF0pO1xuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3sgaGVpZ2h0OiAnODV2aCcgfX0+XG4gICAgICA8Um91dGUgcGF0aD1cIi9oYW5nb3V0c1wiPlxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+TG9hZGluZy4uLjwvZGl2Pn0+XG4gICAgICAgICAgPEhhbmdvdXRzXG4gICAgICAgICAgICB1c2Vycz17dXNlcnN9XG4gICAgICAgICAgICBzZWFyY2g9e3NlYXJjaH1cbiAgICAgICAgICAgIGhhbmdvdXRzPXtoYW5nb3V0c31cbiAgICAgICAgICAgIG9uU2VsZWN0SGFuZ291dD17b25TZWxlY3RIYW5nb3V0fVxuICAgICAgICAgICAgb25TZWxlY3RVc2VyPXtvblNlbGVjdFVzZXJ9XG4gICAgICAgICAgICBvblNlYXJjaD17b25TZWFyY2h9XG4gICAgICAgICAgICBvblN0YXJ0U2VhcmNoPXtvblN0YXJ0U2VhcmNofVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvU3VzcGVuc2U+XG4gICAgICA8L1JvdXRlPlxuICAgICAgPFJvdXRlIHBhdGg9XCIvQkxPQ0tcIj5cbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxuICAgICAgICAgIDxCbG9jayBoYW5nb3V0PXtoYW5nb3V0fSBvbkJsb2NrPXtvbkJsb2NrfSAvPlxuICAgICAgICA8L1N1c3BlbnNlPlxuICAgICAgPC9Sb3V0ZT5cbiAgICAgIDxSb3V0ZSBwYXRoPVwiL0JMT0NLRURcIj5cbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxuICAgICAgICAgIDxCbG9ja2VkIGhhbmdvdXQ9e2hhbmdvdXR9IG9uVW5ibG9jaz17b25VbmJsb2NrfSAvPlxuICAgICAgICA8L1N1c3BlbnNlPlxuICAgICAgPC9Sb3V0ZT5cbiAgICAgIDxSb3V0ZSBwYXRoPVwiL2NvbmZpZ3VyZVwiPlxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+TG9hZGluZy4uLjwvZGl2Pn0+XG4gICAgICAgICAgPENvbmZpZ3VyZSBoYW5nb3V0PXtoYW5nb3V0fSAvPlxuICAgICAgICA8L1N1c3BlbnNlPlxuICAgICAgPC9Sb3V0ZT5cbiAgICAgIDxSb3V0ZSBwYXRocz17W1wiL0FDQ0VQVEVEXCIsXCIvQUNDRVBURVJcIixcIi9NRVNTQU5HRVJcIixcIi9NRVNTQUdFRFwiXX0+XG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cbiAgICAgICAgICA8SGFuZ2NoYXRcbiAgICAgICAgICAgIG9uTWVzc2FnZVRleHQ9e29uTWVzc2FnZVRleHR9XG4gICAgICAgICAgICBvbk1lc3NhZ2U9e29uTWVzc2FnZX1cbiAgICAgICAgICAgIG1lc3NhZ2VzPXttZXNzYWdlc31cbiAgICAgICAgICAgIHVzZXJuYW1lPXt1c2VybmFtZX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L1N1c3BlbnNlPlxuICAgICAgPC9Sb3V0ZT5cbiAgICBcbiAgICAgIDxSb3V0ZSBwYXRoPVwiL0lOVklURVwiPlxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+TG9hZGluZy4uLjwvZGl2Pn0+XG4gICAgICAgICAgPEludml0ZVxuICAgICAgICAgICAgaGFuZ291dD17aGFuZ291dH1cbiAgICAgICAgICAgIG9uSW52aXRlPXtvbkludml0ZX1cbiAgICAgICAgICAgIG9uTWVzc2FnZVRleHQ9e29uTWVzc2FnZVRleHR9XG4gICAgICAgICAgICBtZXNzYWdlVGV4dD17bWVzc2FnZVRleHR9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9TdXNwZW5zZT5cbiAgICAgIDwvUm91dGU+XG4gICAgICA8Um91dGUgcGF0aD1cIi9JTlZJVEVEXCI+XG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cbiAgICAgICAgICA8SW52aXRlZSBoYW5nb3V0PXtoYW5nb3V0fSAvPlxuICAgICAgICA8L1N1c3BlbnNlPlxuICAgICAgPC9Sb3V0ZT5cbiAgICAgIDxSb3V0ZSBwYXRoPVwiL0lOVklURVJcIj5cbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxuICAgICAgICAgIDxJbnZpdGVyIGhhbmdvdXQ9e2hhbmdvdXR9IG9uQWNjZXB0PXtvbkFjY2VwdH0gLz5cbiAgICAgICAgPC9TdXNwZW5zZT5cbiAgICAgIDwvUm91dGU+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IE1vYmlsZSBmcm9tICcuL21vYmlsZSc7XHJcbmltcG9ydCB7IEhhbmdvdXRzUHJvdmlkZXIgfSBmcm9tICcuL3N0YXRlL0hhbmdvdXRzUHJvdmlkZXInO1xyXG5pbXBvcnQgeyBSb3V0ZVByb3ZpZGVyLCB1c2VSb3V0ZUNvbnRleHQgfSBmcm9tICcuLi9yb3V0ZS9yb3V0ZXInO1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxIYW5nb3V0c1Byb3ZpZGVyPlxyXG4gICAgICA8Um91dGVQcm92aWRlciBpbml0aWFsUm91dGU9XCIvaGFuZ291dHNcIj5cclxuICAgICAgICA8TW9iaWxlIC8+XHJcbiAgICAgIDwvUm91dGVQcm92aWRlcj5cclxuICAgIDwvSGFuZ291dHNQcm92aWRlcj5cclxuICApO1xyXG59XHJcbiJdLCJuYW1lcyI6WyJhY3Rpb25UeXBlcyIsIk1FU1NBR0VfVEVYVF9DSEFOR0VEIiwiTE9BRF9IQU5HT1VUUyIsIkxPQURFRF9NRVNTQUdFUyIsIlNBVkVEX01FU1NBR0VfTE9DQUxMWSIsIlNFQVJDSEVEX0hBTkdPVVQiLCJTRUxFQ1RFRF9IQU5HT1VUIiwiU0VMRUNURURfVVNFUiIsIkZJTFRFUl9IQU5HT1VUUyIsIkZFVENIX0hBTkdPVVRfU1RBUlRFRCIsIkZFVENIX0hBTkdPVVRfU1VDQ0VTUyIsIkZFVENIX0hBTkdPVVRfRkFJTEVEIiwiRkVUQ0hfSEFOR09VVF9OT1RfRk9VTkQiLCJGRVRDSF9VU0VSX1NUQVJURUQiLCJGRVRDSF9VU0VSX1NVQ0NFU1MiLCJGRVRDSF9VU0VSX0ZBSUxFRCIsIk9OTElORV9TVEFURV9DSEFOR0VEIiwiSEFOR09VVF9TVEFURV9DSEFOR0VEIiwiTkVXX0hBTkdPVVRfUkVDSUVWRUQiLCJDTElFTlRfQ09NTUFORF9TVEFSVEVEIiwiQ0xJRU5UX0NPTU1BTkRfU1VDQ0VTUyIsIkNMSUVOVF9DT01NQU5EX0ZBSUxFRCIsImluaXRTdGF0ZSIsImhhbmdvdXRzIiwiaGFuZ291dCIsIm1lc3NhZ2VzIiwic2VhcmNoIiwidXNlciIsImxvYWRpbmciLCJlcnJvciIsIm1lc3NhZ2VUZXh0Iiwib25saW5lIiwicmVkdWNlciIsInN0YXRlIiwiYWN0aW9uIiwidHlwZSIsIm1lc3NhZ2UiLCJ0ZXh0IiwidXNlcnMiLCJIQU5HT1VUX05PVF9GT1VORCIsImZpbHRlciIsImciLCJ1c2VybmFtZSIsImluY2x1ZGVzIiwiZmluZCIsIm1hcCIsImxvYWRIYW5nb3V0cyIsImRpc3BhdGNoIiwiSlNPTiIsInBhcnNlIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsInNlbGVjdEhhbmdvdXQiLCJzZWxlY3RVc2VyIiwic2V0SXRlbSIsInN0cmluZ2lmeSIsInNlYXJjaEhhbmdvdXRzIiwiZmlsdGVySGFuZ291dHMiLCJmZXRjaEhhbmdvdXQiLCJyZXNwb25zZSIsImZldGNoIiwib2siLCJqc29uIiwibGVuZ3RoIiwiZmV0Y2hVc2VyIiwiY2hhbmdlTWVzc2FnZVRleHQiLCJzdGFydENsaWVudENvbW1hbmQiLCJsb2FkTWVzc2FnZXMiLCJrZXkiLCJzYXZlTWVzc2FnZSIsInRhcmdldCIsIkhhbmdvdXRDb250ZXh0IiwiY3JlYXRlQ29udGV4dCIsInVzZUhhbmdvdXRDb250ZXh0IiwiY29udGV4dCIsInVzZUNvbnRleHQiLCJFcnJvciIsIkhhbmdvdXRzUHJvdmlkZXIiLCJwcm9wcyIsImF1dGhDb250ZXh0IiwidXNlQXV0aENvbnRleHQiLCJ1c2VSZWR1Y2VyIiwidXNlRWZmZWN0IiwiaGFuZ291dEV4aXN0IiwidXBkYXRlZCIsInZhbHVlIiwidXNlTWVtbyIsImgiLCJoYW5nb3V0U3RhdGVzIiwiSU5WSVRFUiIsIkFDQ0VQVEVSIiwiREVDTElORVIiLCJCTE9DS0VSIiwiVU5CTE9DS0VSIiwiTUVTU0FOR0VSIiwiSU5WSVRFRCIsIkFDQ0VQVEVEIiwiREVDTElORUQiLCJCTE9DS0VEIiwiVU5CTE9DS0VEIiwiTUVTU0FHRUQiLCJjbGllbnRDb21tYW5kcyIsIklOVklURSIsIkFDQ0VQVCIsIkRFQ0xJTkUiLCJCTE9DSyIsIlVOQkxPQ0siLCJNRVNTQUdFIiwiT05MSU5FIiwidXNlU29ja2V0Iiwic29ja2V0Q29udGV4dCIsInVzZVdTb2NrZXRDb250ZXh0Iiwic29ja2V0Iiwib25tZXNzYWdlIiwiZGF0YSIsImhhbmRsZUhhbmdvdXRTdGF0ZSIsIm9uY2xvc2UiLCJvbmVycm9yIiwib25vcGVuIiwidXBkYXRlZFN0YXRlIiwicHVzaCIsInVzZUhhbmdvdXRzIiwiaGFuZGxlU29ja2V0Iiwib25TZWxlY3RIYW5nb3V0IiwiZSIsImlkIiwib25TZWxlY3RVc2VyIiwidW5hbWUiLCJ1Iiwib25JbnZpdGUiLCJlbWFpbCIsInRpbWVzdGFtcCIsIkRhdGUiLCJub3ciLCJ1cGRhdGVkSGFuZ291dCIsInNlbmQiLCJjb21tYW5kIiwib25BY2NlcHQiLCJvbkJsb2NrIiwib25VbmJsb2NrIiwib25EZWNsaW5lIiwib25NZXNzYWdlIiwib25TZWFyY2giLCJvblN0YXJ0U2VhcmNoIiwib25NZXNzYWdlVGV4dCIsIkhhbmdvdXRzIiwibGF6eSIsIkJsb2NrIiwiQmxvY2tlZCIsIkNvbmZpZ3VyZSIsIkhhbmdjaGF0IiwiSW52aXRlIiwiSW52aXRlZSIsIkludml0ZXIiLCJNb2JpbGUiLCJyb3V0ZSIsInNldFJvdXRlIiwidXNlUm91dGVDb250ZXh0IiwiaGVpZ2h0IiwiU3VzcGVuc2UiXSwibWFwcGluZ3MiOiI7O0FBQU8sTUFBTUEsV0FBVyxHQUFHO0FBQ3ZCQyxFQUFBQSxvQkFBb0IsRUFBQyxzQkFERTtBQUV2QkMsRUFBQUEsYUFBYSxFQUFFLGVBRlE7QUFHdkJDLEVBQUFBLGVBQWUsRUFBRSxpQkFITTtBQUl2QkMsRUFBQUEscUJBQXFCLEVBQUMsdUJBSkM7QUFLdkJDLEVBQUFBLGdCQUFnQixFQUFFLGtCQUxLO0FBTXZCQyxFQUFBQSxnQkFBZ0IsRUFBRSxrQkFOSztBQU92QkMsRUFBQUEsYUFBYSxFQUFDLGVBUFM7QUFRdkJDLEVBQUFBLGVBQWUsRUFBQyxpQkFSTztBQVV2QkMsRUFBQUEscUJBQXFCLEVBQUUsdUJBVkE7QUFXdkJDLEVBQUFBLHFCQUFxQixFQUFFLHVCQVhBO0FBWXZCQyxFQUFBQSxvQkFBb0IsRUFBRSxzQkFaQztBQWF2QkMsRUFBQUEsdUJBQXVCLEVBQUUseUJBYkY7QUFnQnZCQyxFQUFBQSxrQkFBa0IsRUFBRSxvQkFoQkc7QUFpQnZCQyxFQUFBQSxrQkFBa0IsRUFBRSxvQkFqQkc7QUFrQnZCQyxFQUFBQSxpQkFBaUIsRUFBRSxtQkFs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
