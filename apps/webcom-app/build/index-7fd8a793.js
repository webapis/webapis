import { M, u as useAuthContext, p, l, h, a as h$1, _ as _extends, w, b as useWSocketContext, c as useRouteContext, R as Route, d as M$1, O, e as RouteProvider } from './index-bdb5940f.js';

const actionTypes = {
  MESSAGE_TEXT_CHANGED: 'MESSAGE_TEXT_CHANGED',
  LOAD_HANGOUTS: 'LOAD_HANGOUTS',
  LOAD_MESSAGES: 'LOAD_MESSAGES',
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
  messages: [],
  search: '',
  user: [],
  loading: false,
  error: null,
  messageText: '',
  online: false
};
function reducer(state, action) {
  switch (action.type) {
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
    ;

    if (response.ok) {
      ;
      const {
        hangouts
      } = await response.json();
      ;

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
  l(() => {
    if (username) {
      loadHangouts({
        username,
        dispatch
      });
    }
  }, [username]);
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
    messageText
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

const Hangouts = O(() => import('./Hangout-112a5240.js'));
const Block = O(() => import('./Block-14d56486.js'));
const Blocked = O(() => import('./Blocked-7b33d217.js'));
const Configure = O(() => import('./Configure-efe6a2dc.js'));
const Hangchat = O(() => import('./Hangchat-9fc9e1b4.js'));
const Invite = O(() => import('./Invite-9d13861b.js'));
const Invitee = O(() => import('./Invitee-c492ea08.js'));
const Inviter = O(() => import('./Inviter-c8f504bf.js'));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtN2ZkOGE3OTMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25UeXBlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9yZWR1Y2VyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL2FjdGlvbnMuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvSGFuZ291dHNQcm92aWRlci5qcyIsIi4uLy4uLy4uL3NlcnZlci9oYW5nb3V0cy9oYW5nb3V0U3RhdGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL3VzZVNvY2tldC5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9jbGllbnRDb21tYW5kcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS91c2VIYW5nb3V0cy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9tb2JpbGUuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IGFjdGlvblR5cGVzID0ge1xuICAgIE1FU1NBR0VfVEVYVF9DSEFOR0VEOidNRVNTQUdFX1RFWFRfQ0hBTkdFRCcsXG4gICAgTE9BRF9IQU5HT1VUUzogJ0xPQURfSEFOR09VVFMnLFxuICAgIExPQURfTUVTU0FHRVM6ICdMT0FEX01FU1NBR0VTJyxcbiAgICBTRUFSQ0hFRF9IQU5HT1VUOiAnU0VBUkNIRURfSEFOR09VVCcsXG4gICAgU0VMRUNURURfSEFOR09VVDogJ1NFTEVDVEVEX0hBTkdPVVQnLFxuICAgIFNFTEVDVEVEX1VTRVI6J1NFTEVDVEVEX1VTRVInLFxuICAgIEZJTFRFUl9IQU5HT1VUUzonRklMVEVSX0hBTkdPVVRTJyxcblxuICAgIEZFVENIX0hBTkdPVVRfU1RBUlRFRDogJ0ZFVENIX0hBTkdPVVRfU1RBUlRFRCcsXG4gICAgRkVUQ0hfSEFOR09VVF9TVUNDRVNTOiAnRkVUQ0hfSEFOR09VVF9TVUNDRVNTJyxcbiAgICBGRVRDSF9IQU5HT1VUX0ZBSUxFRDogJ0ZFVENIX0hBTkdPVVRfRkFJTEVEJyxcbiAgICBGRVRDSF9IQU5HT1VUX05PVF9GT1VORDogJ0ZFVENIX0hBTkdPVVRfTk9UX0ZPVU5EJyxcblxuXG4gICAgRkVUQ0hfVVNFUl9TVEFSVEVEOiAnRkVUQ0hfVVNFUl9TVEFSVEVEJyxcbiAgICBGRVRDSF9VU0VSX1NVQ0NFU1M6ICdGRVRDSF9VU0VSX1NVQ0NFU1MnLFxuICAgIEZFVENIX1VTRVJfRkFJTEVEOiAnRkVUQ0hfVVNFUl9GQUlMRUQnLFxuXG4gICAgT05MSU5FX1NUQVRFX0NIQU5HRUQ6ICdPTkxJTkVfU1RBVEVfQ0hBTkdFRCcsXG5cbiAgICBIQU5HT1VUX1NUQVRFX0NIQU5HRUQ6ICdIQU5HT1VUX1NUQVRFX0NIQU5HRUQnLFxuICAgIE5FV19IQU5HT1VUX1JFQ0lFVkVEOidORVdfSEFOR09VVF9SRUNJRVZFRCcsXG4gICAgQ0xJRU5UX0NPTU1BTkRfU1RBUlRFRDonQ0xJRU5UX0NPTU1BTkRfU1RBUlRFRCcsXG4gICAgQ0xJRU5UX0NPTU1BTkRfU1VDQ0VTUzonQ0xJRU5UX0NPTU1BTkRfU1VDQ0VTUycsXG4gICAgQ0xJRU5UX0NPTU1BTkRfRkFJTEVEOidDTElFTlRfQ09NTUFORF9GQUlMRUQnXG59IiwiaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuL2FjdGlvblR5cGVzJztcbmV4cG9ydCBjb25zdCBpbml0U3RhdGUgPSB7XG4gIGhhbmdvdXRzOiBbXSxcbiAgaGFuZ291dDogbnVsbCxcblxuICBtZXNzYWdlczogW10sXG4gIHNlYXJjaDogJycsXG4gIHVzZXI6IFtdLFxuICBsb2FkaW5nOiBmYWxzZSxcbiAgZXJyb3I6IG51bGwsXG4gIG1lc3NhZ2VUZXh0OiAnJyxcbiAgb25saW5lOiBmYWxzZVxufTtcbmV4cG9ydCBmdW5jdGlvbiByZWR1Y2VyKHN0YXRlLCBhY3Rpb24pIHtcbiAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuTUVTU0FHRV9URVhUX0NIQU5HRUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbWVzc2FnZVRleHQ6IGFjdGlvbi50ZXh0IH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9VU0VSX0ZBSUxFRDpcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfRkFJTEVEOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBlcnJvcjogYWN0aW9uLmVycm9yIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9VU0VSX1NUQVJURUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogdHJ1ZSB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuRkVUQ0hfVVNFUl9TVUNDRVNTOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgICAgICB1c2VyczogYWN0aW9uLnVzZXJzLFxuICAgICAgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfU1RBUlRFRDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiB0cnVlIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NVQ0NFU1M6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGhhbmdvdXRzOiBhY3Rpb24uaGFuZ291dHMgfTtcblxuICAgIGNhc2UgYWN0aW9uVHlwZXMuSEFOR09VVF9OT1RfRk9VTkQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZJTFRFUl9IQU5HT1VUUzpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBoYW5nb3V0czogc3RhdGUuaGFuZ291dHMuZmlsdGVyKChnKSA9PlxuICAgICAgICAgIGcudXNlcm5hbWUuaW5jbHVkZXMoc3RhdGUuc2VhcmNoKVxuICAgICAgICApLFxuICAgICAgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNFQVJDSEVEX0hBTkdPVVQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgc2VhcmNoOiBhY3Rpb24uc2VhcmNoIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0FEX0hBTkdPVVRTOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGhhbmdvdXRzOiBhY3Rpb24uaGFuZ291dHMgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNFTEVDVEVEX1VTRVI6XG4gICAgICBpZiAoc3RhdGUuaGFuZ291dHMpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgICBoYW5nb3V0czogWy4uLnN0YXRlLmhhbmdvdXRzLCBhY3Rpb24uaGFuZ291dF0sXG4gICAgICAgICAgaGFuZ291dDogYWN0aW9uLmhhbmdvdXQsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgaGFuZ291dHM6IFthY3Rpb24uaGFuZ291dF0sXG4gICAgICAgIGhhbmdvdXQ6IGFjdGlvbi5oYW5nb3V0LFxuICAgICAgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNFTEVDVEVEX0hBTkdPVVQ6XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgaGFuZ291dDogc3RhdGUuaGFuZ291dHMuZmluZCgoZykgPT4gZy51c2VybmFtZSA9PT0gYWN0aW9uLnVzZXJuYW1lKSxcbiAgICAgIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5IQU5HT1VUX1NUQVRFX0NIQU5HRUQ6XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5zdGF0ZSxoYW5nb3V0OmFjdGlvbi5oYW5nb3V0LCBoYW5nb3V0czogc3RhdGUuaGFuZ291dHMubWFwKGcgPT4ge1xuICAgICAgICAgIGlmIChnLnVzZXJuYW1lID09PSBhY3Rpb24uaGFuZ291dC51c2VybmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5oYW5nb3V0XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGdcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5ORVdfSEFOR09VVF9SRUNJRVZFRDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBoYW5nb3V0czogWy4uLnN0YXRlLmhhbmdvdXRzLGFjdGlvbi5oYW5nb3V0XSB9XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuL2FjdGlvblR5cGVzJztcblxuLy9yZXRyaWV2ZXMgaGFuZ291dHMgZnJvbSBsb2NhbFN0b3JhZ2VcbmV4cG9ydCBmdW5jdGlvbiBsb2FkSGFuZ291dHMoeyB1c2VybmFtZSwgZGlzcGF0Y2ggfSkge1xuICBjb25zdCBoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oYCR7dXNlcm5hbWV9LWhhbmdvdXRzYCkpO1xuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkxPQURfSEFOR09VVFMsIGhhbmdvdXRzIH0pO1xufVxuLy9zZWxlY3QgaGFuZ291dCBmcm9tIExpc3RcbmV4cG9ydCBmdW5jdGlvbiBzZWxlY3RIYW5nb3V0KHsgZGlzcGF0Y2gsIHVzZXJuYW1lIH0pIHtcblxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFTEVDVEVEX0hBTkdPVVQsIHVzZXJuYW1lIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0VXNlcih7IGRpc3BhdGNoLCB1c2VyLCB1c2VybmFtZSB9KSB7XG4gIC8vIHNhdmUgc2VsZWN0ZWQgdXNlciB0byBoYW5nb3V0c1xuICBjb25zdCBoYW5nb3V0ID0geyAuLi51c2VyLCBzdGF0ZTogJ0lOVklURScgfTtcbiAgY29uc3QgaGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGAke3VzZXJuYW1lfS1oYW5nb3V0c2ApKTtcblxuICBpZiAoaGFuZ291dHMpIHtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcbiAgICAgIGAke3VzZXJuYW1lfS1oYW5nb3V0c2AsXG4gICAgICBKU09OLnN0cmluZ2lmeShbLi4uaGFuZ291dHMsIGhhbmdvdXRdKVxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oYCR7dXNlcm5hbWV9LWhhbmdvdXRzYCwgSlNPTi5zdHJpbmdpZnkoW2hhbmdvdXRdKSk7XG4gIH1cblxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFTEVDVEVEX1VTRVIsIGhhbmdvdXQgfSk7XG59XG4vL3NlYXJjaCBmb3IgaGFuZ291dCBieSB0eXBpbmcgaW50byBUZXh0SW5wdXRcbmV4cG9ydCBmdW5jdGlvbiBzZWFyY2hIYW5nb3V0cyh7IHNlYXJjaCwgZGlzcGF0Y2ggfSkge1xuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFQVJDSEVEX0hBTkdPVVQsIHNlYXJjaCB9KTtcbn1cbi8vZmlsdGVyIGhhbmdvdXQgYWZ0ZXIgc2VhcmNoIHN0YXRlIGNoYW5nZVxuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlckhhbmdvdXRzKHsgZGlzcGF0Y2ggfSkge1xuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZJTFRFUl9IQU5HT1VUUyB9KTtcbn1cblxuLy9mZXRjaCBoYW5nb3V0IGZyb20gc2VydmVyIGlmIG5vdCBmb3VuZCBpbiBsb2NhbCBoYW5nb3V0c1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoSGFuZ291dCh7IHNlYXJjaCwgZGlzcGF0Y2gsdXNlcm5hbWUgfSkge1xuICA7XG4gIHRyeSB7XG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NUQVJURUQgfSk7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL2hhbmdvdXRzL2ZpbmQ/c2VhcmNoPSR7c2VhcmNofSZ1c2VybmFtZT0ke3VzZXJuYW1lfWApO1xuICAgIDtcbiAgICBpZiAocmVzcG9uc2Uub2spIHtcbiAgICAgIDtcbiAgICAgIGNvbnN0IHsgaGFuZ291dHMgfSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgIDtcbiAgICAgIGlmIChoYW5nb3V0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9TVUNDRVNTLCBoYW5nb3V0cyB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9OT1RfRk9VTkQgfSk7XG4gICAgICAgIC8vIGZldGNoIHVzZXIgZnJvbSBzZXJ2ZXIgaW4gaGFuZ291dCBpcyBuZXd1c2VyXG4gICAgICAgIGZldGNoVXNlcih7IHNlYXJjaCwgZGlzcGF0Y2ggfSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9OT1RfRk9VTkQgfSk7XG4gICAgICAvLyBmZXRjaCB1c2VyIGZyb20gc2VydmVyIGluIGhhbmdvdXQgaXMgbmV3dXNlclxuICAgICAgZmV0Y2hVc2VyKHsgc2VhcmNoLCBkaXNwYXRjaCB9KTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc3QgZXJyID0gZXJyb3I7XG4gICAgO1xuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9GQUlMRUQsIGVycm9yIH0pO1xuICB9XG59XG4vLyBmZXRjaCB1c2VyIGZyb20gc2VydmVyIGluIGhhbmdvdXQgaXMgbmV3dXNlclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoVXNlcih7IHNlYXJjaCwgZGlzcGF0Y2ggfSkge1xuICB0cnkge1xuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfVVNFUl9TVEFSVEVEIH0pO1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYC91c2Vycy9maW5kP3NlYXJjaD0ke3NlYXJjaH1gKTtcbiAgICBjb25zdCB7IHVzZXJzIH0gPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG5cbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX1VTRVJfU1VDQ0VTUywgdXNlcnMgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9VU0VSX0ZBSUxFRCwgZXJyb3IgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNoYW5nZU1lc3NhZ2VUZXh0KHsgdGV4dCwgZGlzcGF0Y2ggfSkge1xuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLk1FU1NBR0VfVEVYVF9DSEFOR0VELCB0ZXh0IH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3RhcnRDbGllbnRDb21tYW5kKHtkaXNwYXRjaH0pe1xuZGlzcGF0Y2goe3R5cGU6YWN0aW9uVHlwZXMuQ0xJRU5UX0NPTU1BTkRfU1RBUlRFRH0pXG59IiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQge1xuICB1c2VDb250ZXh0LFxuICB1c2VTdGF0ZSxcbiAgdXNlTWVtbyxcbiAgdXNlUmVkdWNlcixcbiAgdXNlRWZmZWN0LFxufSBmcm9tICdwcmVhY3QvaG9va3MnO1xuaW1wb3J0IHsgcmVkdWNlciwgaW5pdFN0YXRlIH0gZnJvbSAnLi9yZWR1Y2VyJztcblxuaW1wb3J0IHsgbG9hZEhhbmdvdXRzLCBmaWx0ZXJIYW5nb3V0cyxmZXRjaEhhbmdvdXQgfSBmcm9tICcuL2FjdGlvbnMnO1xuaW1wb3J0IHsgdXNlQXV0aENvbnRleHQgfSBmcm9tICcuLi8uLi9hdXRoL2F1dGgtY29udGV4dCc7XG5jb25zdCBIYW5nb3V0Q29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcbmV4cG9ydCBmdW5jdGlvbiB1c2VIYW5nb3V0Q29udGV4dCgpIHtcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoSGFuZ291dENvbnRleHQpO1xuICBpZiAoIWNvbnRleHQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZUhhbmdvdXRDb250ZXh0IG11c3QgYmUgdXNlZCB3aXRoIEhhbmdvdXRzUHJvdmlkZXInKTtcbiAgfVxuXG4gIHJldHVybiBjb250ZXh0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gSGFuZ291dHNQcm92aWRlcihwcm9wcykge1xuICBjb25zdCBhdXRoQ29udGV4dCA9IHVzZUF1dGhDb250ZXh0KCk7XG4gIGNvbnN0IHsgdXNlcm5hbWUgfSA9IGF1dGhDb250ZXh0LnN0YXRlO1xuICBjb25zdCBbc3RhdGUsIGRpc3BhdGNoXSA9IHVzZVJlZHVjZXIocmVkdWNlciwgaW5pdFN0YXRlKTtcbiAgY29uc3QgeyBoYW5nb3V0IH0gPSBzdGF0ZTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICh1c2VybmFtZSkge1xuICAgICAgbG9hZEhhbmdvdXRzKHsgdXNlcm5hbWUsIGRpc3BhdGNoIH0pO1xuICAgIH1cbiAgfSwgW3VzZXJuYW1lXSk7XG5cblxuXG4gIGNvbnN0IHZhbHVlID0gdXNlTWVtbygoKSA9PiBbc3RhdGUsIGRpc3BhdGNoXSwgW3N0YXRlXSk7XG4gIHJldHVybiA8SGFuZ291dENvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlfSB7Li4ucHJvcHN9IC8+O1xufVxuIiwiXG4gIGV4cG9ydCBjb25zdCBoYW5nb3V0U3RhdGVzID0ge1xuICAgIElOVklURVI6ICdJTlZJVEVSJyxcbiAgICBBQ0NFUFRFUjogJ0FDQ0VQVEVSJyxcbiAgICBERUNMSU5FUjogJ0RFQ0xJTkVSJyxcbiAgICBCTE9DS0VSOiAnQkxPQ0tFUicsXG4gICAgVU5CTE9DS0VSOiAnVU5CTE9DS0VSJyxcbiAgICBNRVNTQU5HRVI6ICdNRVNTQU5HRVInLFxuICAgLy8gYWNrbm93bGVnZW1lbnRcbiAgICBJTlZJVEVEOiAnSU5WSVRFRCcsXG4gICAgQUNDRVBURUQ6ICdBQ0NFUFRFRCcsXG4gICAgREVDTElORUQ6ICdERUNMSU5FRCcsXG4gICAgQkxPQ0tFRDogJ0JMT0NLRUQnLFxuICAgIFVOQkxPQ0tFRDogJ1VOQkxPQ0tFRCcsXG4gICAgTUVTU0FHRUQ6ICdNRVNTQUdFRCcsXG4gIH07IiwiaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcbmltcG9ydCB7IHVzZVdTb2NrZXRDb250ZXh0IH0gZnJvbSAnLi4vLi4vd3NvY2tldC9XU29ja2V0UHJvdmlkZXInO1xuaW1wb3J0IHsgaGFuZ291dFN0YXRlcyB9IGZyb20gJy4uLy4uLy4uL3NlcnZlci9oYW5nb3V0cy9oYW5nb3V0U3RhdGVzJ1xuaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuL2FjdGlvblR5cGVzJ1xuZXhwb3J0IGZ1bmN0aW9uIHVzZVNvY2tldCh7IGRpc3BhdGNoLCB1c2VybmFtZSB9KSB7XG4gIGNvbnN0IHNvY2tldENvbnRleHQgPSB1c2VXU29ja2V0Q29udGV4dCgpO1xuICBjb25zdCB7IHNvY2tldCB9ID0gc29ja2V0Q29udGV4dFxuXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoc29ja2V0KSB7XG4gICAgICBzb2NrZXQub25tZXNzYWdlID0gKG1lc3NhZ2UpID0+IHtcbiAgICAgICAgY29uc3QgaGFuZ291dCA9IEpTT04ucGFyc2UobWVzc2FnZS5kYXRhKTtcbiAgICAgICAgZGVidWdnZXI7XG4gICAgICAgIGhhbmRsZUhhbmdvdXRTdGF0ZSh7IGhhbmdvdXQsIHVzZXJuYW1lLCBkaXNwYXRjaCB9KVxuICAgICAgfTtcbiAgICAgIHNvY2tldC5vbmNsb3NlID0gKCkgPT4ge1xuICAgICAgICA7XG4gICAgICB9O1xuICAgICAgc29ja2V0Lm9uZXJyb3IgPSAoZXJyb3IpID0+IHtcbiAgICAgICAgO1xuICAgICAgfTtcbiAgICAgIHNvY2tldC5vbm9wZW4gPSAoKSA9PiB7XG4gICAgICAgIDtcbiAgICAgIH07XG4gICAgfVxuICB9LCBbc29ja2V0XSk7XG5cbiAgcmV0dXJuIG51bGw7XG5cbn1cblxuZnVuY3Rpb24gaGFuZGxlSGFuZ291dFN0YXRlKHsgaGFuZ291dCwgdXNlcm5hbWUsIGRpc3BhdGNoIH0pIHtcbiAgY29uc3Qga2V5ID0gYCR7dXNlcm5hbWV9LWhhbmdvdXRzYFxuICBkZWJ1Z2dlcjtcbiAgY29uc3QgdGFyZ2V0ID0gaGFuZ291dC51c2VybmFtZVxuICBjb25zdCBoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KSlcbiAgZGVidWdnZXI7XG4gIGxldCB1cGRhdGVkU3RhdGUgPSBudWxsO1xuICBzd2l0Y2ggKGhhbmdvdXQuc3RhdGUpIHtcbiBcbiAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuQUNDRVBURVI6XG4gICAgY2FzZSBoYW5nb3V0U3RhdGVzLkJMT0NLRUQ6XG4gICAgY2FzZSBoYW5nb3V0U3RhdGVzLkJMT0NLRVI6XG4gICAgY2FzZSBoYW5nb3V0U3RhdGVzLkRFQ0xJTkVEOlxuICAgIGNhc2UgaGFuZ291dFN0YXRlcy5ERUNMSU5FUjpcbiAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuTUVTU0FHRUQ6XG4gICAgY2FzZSBoYW5nb3V0U3RhdGVzLk1FU1NBTkdFUjpcbiAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuVU5CTE9DS0VEOlxuICAgIGNhc2UgaGFuZ291dFN0YXRlcy5VTkJMT0NLRVI6XG4gICAgY2FzZSBoYW5nb3V0U3RhdGVzLklOVklURUQ6XG4gICAgICB1cGRhdGVkU3RhdGUgPSBoYW5nb3V0cy5tYXAoZyA9PiB7IGlmIChnLnVzZXJuYW1lID09PSB0YXJnZXQpIHsgcmV0dXJuIGhhbmdvdXQgfSBlbHNlIHJldHVybiBnIH0pXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KCB1cGRhdGVkU3RhdGUpKVxuICAgICAgZGVidWdnZXI7XG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkhBTkdPVVRfU1RBVEVfQ0hBTkdFRCwgaGFuZ291dCB9KVxuICAgICAgYnJlYWs7XG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuQUNDRVBURUQ6XG4gICAgY2FzZSBoYW5nb3V0U3RhdGVzLklOVklURVI6XG4gICAgICBpZiAoaGFuZ291dHMpIHtcbiAgICAgICAgZGVidWdnZXJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LEpTT04uc3RyaW5naWZ5KGhhbmdvdXRzLnB1c2goaGFuZ291dCkpKVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGRlYnVnZ2VyO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KFtoYW5nb3V0XSkpXG4gICAgICB9XG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLk5FV19IQU5HT1VUX1JFQ0lFVkVELCBoYW5nb3V0IH0pXG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaGFuZ291dFN0YXRlIG5vdCBkZWZpbmVkXCIpXG4gIH1cblxufVxuXG5cblxuXG5cblxuIiwiXG4vL2lzIHNlbnQgYnkgY2xpZW50XG5leHBvcnQgY29uc3QgY2xpZW50Q29tbWFuZHMgPSB7XG4gIElOVklURTogJ0lOVklURScsXG4gIEFDQ0VQVDogJ0FDQ0VQVCcsXG4gIERFQ0xJTkU6ICdERUNMSU5FJyxcbiAgQkxPQ0s6ICdCTE9DSycsXG4gIFVOQkxPQ0s6ICdVTkJMT0NLJyxcbiAgTUVTU0FHRTogJ01FU1NBR0UnLFxufTtcblxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyB1c2VIYW5nb3V0Q29udGV4dCB9IGZyb20gJy4vSGFuZ291dHNQcm92aWRlcic7XG5pbXBvcnQgeyB1c2VBdXRoQ29udGV4dCB9IGZyb20gJy4uLy4uL2F1dGgvYXV0aC1jb250ZXh0JztcbmltcG9ydCB7IHVzZVdTb2NrZXRDb250ZXh0IH0gZnJvbSAnLi4vLi4vd3NvY2tldC9XU29ja2V0UHJvdmlkZXInO1xuaW1wb3J0IHtcbiAgc2VsZWN0SGFuZ291dCxcbiAgc2VhcmNoSGFuZ291dHMsXG4gIGZpbHRlckhhbmdvdXRzLFxuICBmZXRjaEhhbmdvdXQsXG4gIHNlbGVjdFVzZXIsXG4gIGNoYW5nZU1lc3NhZ2VUZXh0LFxuICBzdGFydENsaWVudENvbW1hbmQsXG59IGZyb20gJy4vYWN0aW9ucyc7XG5pbXBvcnQgeyB1c2VTb2NrZXQgfSBmcm9tICcuL3VzZVNvY2tldCc7XG5pbXBvcnQgeyBjbGllbnRDb21tYW5kcyB9IGZyb20gJy4vY2xpZW50Q29tbWFuZHMnO1xuXG5leHBvcnQgZnVuY3Rpb24gdXNlSGFuZ291dHMoKSB7XG4gIGNvbnN0IHNvY2tldENvbnRleHQgPSB1c2VXU29ja2V0Q29udGV4dCgpO1xuICBjb25zdCB7IHNvY2tldCB9ID0gc29ja2V0Q29udGV4dDtcbiAgY29uc3QgYXV0aENvbnRleHQgPSB1c2VBdXRoQ29udGV4dCgpO1xuICBjb25zdCB7IHVzZXJuYW1lIH0gPSBhdXRoQ29udGV4dC5zdGF0ZTtcbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSB1c2VIYW5nb3V0Q29udGV4dCgpO1xuICBjb25zdCB7IGhhbmdvdXQsIGhhbmdvdXRzLCBzZWFyY2gsIHVzZXJzLCBtZXNzYWdlVGV4dCB9ID0gc3RhdGU7XG4gIGNvbnN0IGhhbmRsZVNvY2tldCA9IHVzZVNvY2tldCh7IGRpc3BhdGNoLCBoYW5nb3V0LCB1c2VybmFtZSB9KTtcbiAgZnVuY3Rpb24gb25TZWxlY3RIYW5nb3V0KGUpIHtcbiAgICBjb25zdCB1c2VybmFtZSA9IGUudGFyZ2V0LmlkO1xuICAgIHNlbGVjdEhhbmdvdXQoeyBkaXNwYXRjaCwgdXNlcm5hbWUgfSk7XG4gIH1cbiAgZnVuY3Rpb24gb25TZWxlY3RVc2VyKGUpIHtcbiAgICBjb25zdCB1bmFtZSA9IGUudGFyZ2V0LmlkO1xuICAgIGNvbnN0IHVzZXIgPSB1c2Vycy5maW5kKCh1KSA9PiB1LnVzZXJuYW1lID09PSB1bmFtZSk7XG4gICAgc2VsZWN0VXNlcih7IGRpc3BhdGNoLCB1c2VyLCB1c2VybmFtZSB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uSW52aXRlKCkge1xuICAgIGNvbnN0IHsgdXNlcm5hbWUsIGVtYWlsIH0gPSBoYW5nb3V0O1xuICAgIGNvbnN0IHVwZGF0ZWRIYW5nb3V0ID0ge1xuICAgICAgdXNlcm5hbWUsXG4gICAgICBlbWFpbCxcbiAgICAgIG1lc3NhZ2U6IHsgdGV4dDogbWVzc2FnZVRleHQsIHRpbWVzdGFtcDogRGF0ZS5ub3coKSB9LFxuICAgIH07XG4gICAgc29ja2V0LnNlbmQoXG4gICAgICBKU09OLnN0cmluZ2lmeSh7IC4uLnVwZGF0ZWRIYW5nb3V0LCBjb21tYW5kOiBjbGllbnRDb21tYW5kcy5JTlZJVEUgfSlcbiAgICApO1xuICAgIHN0YXJ0Q2xpZW50Q29tbWFuZCh7IGRpc3BhdGNoIH0pO1xuICB9XG4gIGZ1bmN0aW9uIG9uQWNjZXB0KCkge1xuICAgIGNvbnN0IHsgdXNlcm5hbWUsIGVtYWlsIH0gPSBoYW5nb3V0O1xuICAgIGRlYnVnZ2VyO1xuICAgIHNvY2tldC5zZW5kKFxuICAgICAgSlNPTi5zdHJpbmdpZnkoeyB1c2VybmFtZSwgZW1haWwsIGNvbW1hbmQ6IGNsaWVudENvbW1hbmRzLkFDQ0VQVCB9KVxuICAgICk7XG4gICAgc3RhcnRDbGllbnRDb21tYW5kKHsgZGlzcGF0Y2ggfSk7XG4gIH1cbiAgZnVuY3Rpb24gb25CbG9jaygpIHtcbiAgICBzb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7IC4uLmhhbmdvdXQsIGNvbW1hbmQ6IGNsaWVudENvbW1hbmRzLkJMT0NLIH0pKTtcbiAgICBzdGFydENsaWVudENvbW1hbmQoeyBkaXNwYXRjaCB9KTtcbiAgfVxuICBmdW5jdGlvbiBvblVuYmxvY2soKSB7XG4gICAgc29ja2V0LnNlbmQoXG4gICAgICBKU09OLnN0cmluZ2lmeSh7IC4uLmhhbmdvdXQsIGNvbW1hbmQ6IGNsaWVudENvbW1hbmRzLlVOQkxPQ0sgfSlcbiAgICApO1xuICAgIHN0YXJ0Q2xpZW50Q29tbWFuZCh7IGRpc3BhdGNoIH0pO1xuICB9XG4gIGZ1bmN0aW9uIG9uRGVjbGluZSgpIHtcbiAgICBzb2NrZXQuc2VuZChcbiAgICAgIEpTT04uc3RyaW5naWZ5KHsgLi4uaGFuZ291dCwgY29tbWFuZDogY2xpZW50Q29tbWFuZHMuREVDTElORSB9KVxuICAgICk7XG4gICAgc3RhcnRDbGllbnRDb21tYW5kKHsgZGlzcGF0Y2ggfSk7XG4gIH1cblxuICBmdW5jdGlvbiBvbk1lc3NhZ2UoKSB7XG4gICAgc29ja2V0LnNlbmQoXG4gICAgICBKU09OLnN0cmluZ2lmeSh7IC4uLmhhbmdvdXQsIGNvbW1hbmQ6IGNsaWVudENvbW1hbmRzLk1FU1NBR0UgfSlcbiAgICApO1xuICAgIHN0YXJ0Q2xpZW50Q29tbWFuZCh7IGRpc3BhdGNoIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gb25TZWFyY2goZSkge1xuICAgIHNlYXJjaEhhbmdvdXRzKHsgc2VhcmNoOiBlLnRhcmdldC52YWx1ZSwgZGlzcGF0Y2ggfSk7XG4gIH1cblxuICBmdW5jdGlvbiBvblN0YXJ0U2VhcmNoKGUpIHtcbiAgICBpZiAoaGFuZ291dHMgJiYgaGFuZ291dHMubGVuZ3RoID4gMCkge1xuICAgICAgZmlsdGVySGFuZ291dHMoeyBkaXNwYXRjaCB9KTtcbiAgICB9XG4gICAgZmV0Y2hIYW5nb3V0KHsgZGlzcGF0Y2gsIHNlYXJjaCwgdXNlcm5hbWUgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBvbk1lc3NhZ2VUZXh0KGUpIHtcbiAgICBjaGFuZ2VNZXNzYWdlVGV4dCh7IGRpc3BhdGNoLCB0ZXh0OiBlLnRhcmdldC52YWx1ZSB9KTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgb25NZXNzYWdlVGV4dCxcbiAgICBtZXNzYWdlVGV4dCxcbiAgICBvblN0YXJ0U2VhcmNoLFxuICAgIG9uU2VhcmNoLFxuICAgIHNlYXJjaCxcbiAgICBvbk1lc3NhZ2UsXG4gICAgb25JbnZpdGUsXG4gICAgb25BY2NlcHQsXG4gICAgb25CbG9jayxcbiAgICBvblVuYmxvY2ssXG4gICAgb25TZWxlY3RIYW5nb3V0LFxuICAgIG9uU2VsZWN0VXNlcixcbiAgICBvbkRlY2xpbmUsXG4gICAgaGFuZ291dCxcbiAgICBoYW5nb3V0cyxcbiAgICB1c2VycyxcbiAgICB1c2VybmFtZSxcbiAgICBtZXNzYWdlcyxcbiAgfTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcbmltcG9ydCB7IGxhenksIFN1c3BlbnNlIH0gZnJvbSAncHJlYWN0L2NvbXBhdCc7XG5pbXBvcnQgeyBSb3V0ZSwgdXNlUm91dGVDb250ZXh0IH0gZnJvbSAnLi4vcm91dGUvcm91dGVyJztcblxuaW1wb3J0IHsgdXNlSGFuZ291dHMgfSBmcm9tICcuL3N0YXRlL3VzZUhhbmdvdXRzJztcbmNvbnN0IEhhbmdvdXRzID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vSGFuZ291dCcpKTtcbmNvbnN0IEJsb2NrID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vc3RhdGUtdWkvQmxvY2snKSk7XG5jb25zdCBCbG9ja2VkID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vc3RhdGUtdWkvQmxvY2tlZCcpKTtcbmNvbnN0IENvbmZpZ3VyZSA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL3N0YXRlLXVpL0NvbmZpZ3VyZScpKTtcbmNvbnN0IEhhbmdjaGF0ID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vc3RhdGUtdWkvSGFuZ2NoYXQnKSk7XG5jb25zdCBJbnZpdGUgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9zdGF0ZS11aS9JbnZpdGUnKSk7XG5jb25zdCBJbnZpdGVlID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vc3RhdGUtdWkvSW52aXRlZScpKTtcbmNvbnN0IEludml0ZXIgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9zdGF0ZS11aS9JbnZpdGVyJykpO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBNb2JpbGUoKSB7XG4gIGNvbnN0IFtyb3V0ZSwgc2V0Um91dGVdID0gdXNlUm91dGVDb250ZXh0KCk7XG5cbiAgY29uc3Qge1xuICAgIGhhbmdvdXQsXG4gICAgaGFuZ291dHMsXG4gICAgb25BY2NlcHQsXG4gICAgb25CbG9jayxcbiAgICBvbkludml0ZSxcbiAgICBvblNlbGVjdEhhbmdvdXQsXG4gICAgb25TZWxlY3RVc2VyLFxuICAgIG9uVW5ibG9jayxcbiAgICBvblNlYXJjaCxcbiAgICB1c2VycyxcbiAgICBzZWFyY2gsXG4gICAgb25TdGFydFNlYXJjaCxcbiAgICBvbk1lc3NhZ2VUZXh0LFxuICAgIG1lc3NhZ2VUZXh0LFxuICAgIHVzZXJuYW1lLFxuICAgIG1lc3NhZ2VzXG4gIH0gPSB1c2VIYW5nb3V0cygpO1xuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChoYW5nb3V0KSB7XG4gICAgICBzZXRSb3V0ZShgLyR7aGFuZ291dC5zdGF0ZX1gKTtcbiAgICB9XG4gIH0sIFtoYW5nb3V0XSk7XG4gIHJldHVybiAoXG4gICAgPGRpdiBzdHlsZT17eyBoZWlnaHQ6ICc4NXZoJyB9fT5cbiAgICAgIDxSb3V0ZSBwYXRoPVwiL2hhbmdvdXRzXCI+XG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cbiAgICAgICAgICA8SGFuZ291dHNcbiAgICAgICAgICAgIHVzZXJzPXt1c2Vyc31cbiAgICAgICAgICAgIHNlYXJjaD17c2VhcmNofVxuICAgICAgICAgICAgaGFuZ291dHM9e2hhbmdvdXRzfVxuICAgICAgICAgICAgb25TZWxlY3RIYW5nb3V0PXtvblNlbGVjdEhhbmdvdXR9XG4gICAgICAgICAgICBvblNlbGVjdFVzZXI9e29uU2VsZWN0VXNlcn1cbiAgICAgICAgICAgIG9uU2VhcmNoPXtvblNlYXJjaH1cbiAgICAgICAgICAgIG9uU3RhcnRTZWFyY2g9e29uU3RhcnRTZWFyY2h9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9TdXNwZW5zZT5cbiAgICAgIDwvUm91dGU+XG4gICAgICA8Um91dGUgcGF0aD1cIi9CTE9DS1wiPlxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+TG9hZGluZy4uLjwvZGl2Pn0+XG4gICAgICAgICAgPEJsb2NrIGhhbmdvdXQ9e2hhbmdvdXR9IG9uQmxvY2s9e29uQmxvY2t9IC8+XG4gICAgICAgIDwvU3VzcGVuc2U+XG4gICAgICA8L1JvdXRlPlxuICAgICAgPFJvdXRlIHBhdGg9XCIvQkxPQ0tFRFwiPlxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+TG9hZGluZy4uLjwvZGl2Pn0+XG4gICAgICAgICAgPEJsb2NrZWQgaGFuZ291dD17aGFuZ291dH0gb25VbmJsb2NrPXtvblVuYmxvY2t9IC8+XG4gICAgICAgIDwvU3VzcGVuc2U+XG4gICAgICA8L1JvdXRlPlxuICAgICAgPFJvdXRlIHBhdGg9XCIvY29uZmlndXJlXCI+XG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cbiAgICAgICAgICA8Q29uZmlndXJlIGhhbmdvdXQ9e2hhbmdvdXR9IC8+XG4gICAgICAgIDwvU3VzcGVuc2U+XG4gICAgICA8L1JvdXRlPlxuICAgICAgPFJvdXRlIHBhdGg9XCIvQUNDRVBURURcIj5cbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxuICAgICAgICAgIDxIYW5nY2hhdFxuICAgICAgICAgICAgb25NZXNzYWdlVGV4dD17b25NZXNzYWdlVGV4dH1cbiAgICAgICAgICAgIG9uTWVzc2FnZT17b25NZXNzYWdlfVxuICAgICAgICAgICAgbWVzc2FnZXM9e21lc3NhZ2VzfVxuICAgICAgICAgICAgdXNlcm5hbWU9e3VzZXJuYW1lfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvU3VzcGVuc2U+XG4gICAgICA8L1JvdXRlPlxuICAgICAgPFJvdXRlIHBhdGg9XCIvQUNDRVBURVJcIj5cbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxuICAgICAgICAgIDxIYW5nY2hhdFxuICAgICAgICAgICAgb25NZXNzYWdlVGV4dD17b25NZXNzYWdlVGV4dH1cbiAgICAgICAgICAgIG9uTWVzc2FnZT17b25NZXNzYWdlfVxuICAgICAgICAgICAgbWVzc2FnZXM9e21lc3NhZ2VzfVxuICAgICAgICAgICAgdXNlcm5hbWU9e3VzZXJuYW1lfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvU3VzcGVuc2U+XG4gICAgICA8L1JvdXRlPlxuICAgICAgPFJvdXRlIHBhdGg9XCIvSU5WSVRFXCI+XG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cbiAgICAgICAgICA8SW52aXRlXG4gICAgICAgICAgICBoYW5nb3V0PXtoYW5nb3V0fVxuICAgICAgICAgICAgb25JbnZpdGU9e29uSW52aXRlfVxuICAgICAgICAgICAgb25NZXNzYWdlVGV4dD17b25NZXNzYWdlVGV4dH1cbiAgICAgICAgICAgIG1lc3NhZ2VUZXh0PXttZXNzYWdlVGV4dH1cbiAgICAgICAgICAvPlxuICAgICAgICA8L1N1c3BlbnNlPlxuICAgICAgPC9Sb3V0ZT5cbiAgICAgIDxSb3V0ZSBwYXRoPVwiL0lOVklURURcIj5cbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxuICAgICAgICAgIDxJbnZpdGVlIGhhbmdvdXQ9e2hhbmdvdXR9IC8+XG4gICAgICAgIDwvU3VzcGVuc2U+XG4gICAgICA8L1JvdXRlPlxuICAgICAgPFJvdXRlIHBhdGg9XCIvSU5WSVRFUlwiPlxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+TG9hZGluZy4uLjwvZGl2Pn0+XG4gICAgICAgICAgPEludml0ZXIgaGFuZ291dD17aGFuZ291dH0gb25BY2NlcHQ9e29uQWNjZXB0fSAvPlxuICAgICAgICA8L1N1c3BlbnNlPlxuICAgICAgPC9Sb3V0ZT5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgTW9iaWxlIGZyb20gJy4vbW9iaWxlJztcclxuaW1wb3J0IHsgSGFuZ291dHNQcm92aWRlciB9IGZyb20gJy4vc3RhdGUvSGFuZ291dHNQcm92aWRlcic7XHJcbmltcG9ydCB7IFJvdXRlUHJvdmlkZXIsIHVzZVJvdXRlQ29udGV4dCB9IGZyb20gJy4uL3JvdXRlL3JvdXRlcic7XHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gKFxyXG4gICAgPEhhbmdvdXRzUHJvdmlkZXI+XHJcbiAgICAgIDxSb3V0ZVByb3ZpZGVyIGluaXRpYWxSb3V0ZT1cIi9oYW5nb3V0c1wiPlxyXG4gICAgICAgIDxNb2JpbGUgLz5cclxuICAgICAgPC9Sb3V0ZVByb3ZpZGVyPlxyXG4gICAgPC9IYW5nb3V0c1Byb3ZpZGVyPlxyXG4gICk7XHJcbn1cclxuIl0sIm5hbWVzIjpbImFjdGlvblR5cGVzIiwiTUVTU0FHRV9URVhUX0NIQU5HRUQiLCJMT0FEX0hBTkdPVVRTIiwiTE9BRF9NRVNTQUdFUyIsIlNFQVJDSEVEX0hBTkdPVVQiLCJTRUxFQ1RFRF9IQU5HT1VUIiwiU0VMRUNURURfVVNFUiIsIkZJTFRFUl9IQU5HT1VUUyIsIkZFVENIX0hBTkdPVVRfU1RBUlRFRCIsIkZFVENIX0hBTkdPVVRfU1VDQ0VTUyIsIkZFVENIX0hBTkdPVVRfRkFJTEVEIiwiRkVUQ0hfSEFOR09VVF9OT1RfRk9VTkQiLCJGRVRDSF9VU0VSX1NUQVJURUQiLCJGRVRDSF9VU0VSX1NVQ0NFU1MiLCJGRVRDSF9VU0VSX0ZBSUxFRCIsIk9OTElORV9TVEFURV9DSEFOR0VEIiwiSEFOR09VVF9TVEFURV9DSEFOR0VEIiwiTkVXX0hBTkdPVVRfUkVDSUVWRUQiLCJDTElFTlRfQ09NTUFORF9TVEFSVEVEIiwiQ0xJRU5UX0NPTU1BTkRfU1VDQ0VTUyIsIkNMSUVOVF9DT01NQU5EX0ZBSUxFRCIsImluaXRTdGF0ZSIsImhhbmdvdXRzIiwiaGFuZ291dCIsIm1lc3NhZ2VzIiwic2VhcmNoIiwidXNlciIsImxvYWRpbmciLCJlcnJvciIsIm1lc3NhZ2VUZXh0Iiwib25saW5lIiwicmVkdWNlciIsInN0YXRlIiwiYWN0aW9uIiwidHlwZSIsInRleHQiLCJ1c2VycyIsIkhBTkdPVVRfTk9UX0ZPVU5EIiwiZmlsdGVyIiwiZyIsInVzZXJuYW1lIiwiaW5jbHVkZXMiLCJmaW5kIiwibWFwIiwibG9hZEhhbmdvdXRzIiwiZGlzcGF0Y2giLCJKU09OIiwicGFyc2UiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwic2VsZWN0SGFuZ291dCIsInNlbGVjdFVzZXIiLCJzZXRJdGVtIiwic3RyaW5naWZ5Iiwic2VhcmNoSGFuZ291dHMiLCJmaWx0ZXJIYW5nb3V0cyIsImZldGNoSGFuZ291dCIsInJlc3BvbnNlIiwiZmV0Y2giLCJvayIsImpzb24iLCJsZW5ndGgiLCJmZXRjaFVzZXIiLCJjaGFuZ2VNZXNzYWdlVGV4dCIsInN0YXJ0Q2xpZW50Q29tbWFuZCIsIkhhbmdvdXRDb250ZXh0IiwiY3JlYXRlQ29udGV4dCIsInVzZUhhbmdvdXRDb250ZXh0IiwiY29udGV4dCIsInVzZUNvbnRleHQiLCJFcnJvciIsIkhhbmdvdXRzUHJvdmlkZXIiLCJwcm9wcyIsImF1dGhDb250ZXh0IiwidXNlQXV0aENvbnRleHQiLCJ1c2VSZWR1Y2VyIiwidXNlRWZmZWN0IiwidmFsdWUiLCJ1c2VNZW1vIiwiaCIsImhhbmdvdXRTdGF0ZXMiLCJJTlZJVEVSIiwiQUNDRVBURVIiLCJERUNMSU5FUiIsIkJMT0NLRVIiLCJVTkJMT0NLRVIiLCJNRVNTQU5HRVIiLCJJTlZJVEVEIiwiQUNDRVBURUQiLCJERUNMSU5FRCIsIkJMT0NLRUQiLCJVTkJMT0NLRUQiLCJNRVNTQUdFRCIsInVzZVNvY2tldCIsInNvY2tldENvbnRleHQiLCJ1c2VXU29ja2V0Q29udGV4dCIsInNvY2tldCIsIm9ubWVzc2FnZSIsIm1lc3NhZ2UiLCJkYXRhIiwiaGFuZGxlSGFuZ291dFN0YXRlIiwib25jbG9zZSIsIm9uZXJyb3IiLCJvbm9wZW4iLCJrZXkiLCJ0YXJnZXQiLCJ1cGRhdGVkU3RhdGUiLCJwdXNoIiwiY2xpZW50Q29tbWFuZHMiLCJJTlZJVEUiLCJBQ0NFUFQiLCJERUNMSU5FIiwiQkxPQ0siLCJVTkJMT0NLIiwiTUVTU0FHRSIsInVzZUhhbmdvdXRzIiwiaGFuZGxlU29ja2V0Iiwib25TZWxlY3RIYW5nb3V0IiwiZSIsImlkIiwib25TZWxlY3RVc2VyIiwidW5hbWUiLCJ1Iiwib25JbnZpdGUiLCJlbWFpbCIsInVwZGF0ZWRIYW5nb3V0IiwidGltZXN0YW1wIiwiRGF0ZSIsIm5vdyIsInNlbmQiLCJjb21tYW5kIiwib25BY2NlcHQiLCJvbkJsb2NrIiwib25VbmJsb2NrIiwib25EZWNsaW5lIiwib25NZXNzYWdlIiwib25TZWFyY2giLCJvblN0YXJ0U2VhcmNoIiwib25NZXNzYWdlVGV4dCIsIkhhbmdvdXRzIiwibGF6eSIsIkJsb2NrIiwiQmxvY2tlZCIsIkNvbmZpZ3VyZSIsIkhhbmdjaGF0IiwiSW52aXRlIiwiSW52aXRlZSIsIkludml0ZXIiLCJNb2JpbGUiLCJyb3V0ZSIsInNldFJvdXRlIiwidXNlUm91dGVDb250ZXh0IiwiaGVpZ2h0IiwiU3VzcGVuc2UiXSwibWFwcGluZ3MiOiI7O0FBQU8sTUFBTUEsV0FBVyxHQUFHO0FBQ3ZCQyxFQUFBQSxvQkFBb0IsRUFBQyxzQkFERTtBQUV2QkMsRUFBQUEsYUFBYSxFQUFFLGVBRlE7QUFHdkJDLEVBQUFBLGFBQWEsRUFBRSxlQUhRO0FBSXZCQyxFQUFBQSxnQkFBZ0IsRUFBRSxrQkFKSztBQUt2QkMsRUFBQUEsZ0JBQWdCLEVBQUUsa0JBTEs7QUFNdkJDLEVBQUFBLGFBQWEsRUFBQyxlQU5TO0FBT3ZCQyxFQUFBQSxlQUFlLEVBQUMsaUJBUE87QUFTdkJDLEVBQUFBLHFCQUFxQixFQUFFLHVC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
