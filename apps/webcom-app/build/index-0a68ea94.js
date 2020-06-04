import { M, u as useAuthContext, m, p, s, h, _ as _extends, T, a as useWSocketContext, b as useRouteContext, R as Route, U, L, c as RouteProvider } from './index-d2307a3a.js';

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
  p(() => {
    if (username) {
      loadHangouts({
        username,
        dispatch
      });
    }
  }, [username]);
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

function useSocket({
  dispatch,
  username
}) {
  const socketContext = useWSocketContext();
  const {
    socket
  } = socketContext;
  p(() => {
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
    users
  };
}

const Hangouts = L(() => import('./Hangout-38f7ab30.js'));
const Block = L(() => import('./Block-51c73d6c.js'));
const Blocked = L(() => import('./Blocked-17615de0.js'));
const Configure = L(() => import('./Configure-008a7629.js'));
const Hangchat = L(() => import('./Hangchat-efbba952.js'));
const Invite = L(() => import('./Invite-821baa7f.js'));
const Invitee = L(() => import('./Invitee-eb4ff2ec.js'));
const Inviter = L(() => import('./Inviter-20a37ce1.js'));
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
    messageText
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
    path: "/ACCEPTED"
  }, h(U, {
    fallback: h("div", null, "Loading...")
  }, h(Hangchat, null))), h(Route, {
    path: "/ACCEPTER"
  }, h(U, {
    fallback: h("div", null, "Loading...")
  }, h(Hangchat, null))), h(Route, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtMGE2OGVhOTQuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25UeXBlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9yZWR1Y2VyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL2FjdGlvbnMuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvSGFuZ291dHNQcm92aWRlci5qcyIsIi4uLy4uLy4uL3NlcnZlci9oYW5nb3V0cy9oYW5nb3V0U3RhdGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL3VzZVNvY2tldC5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9jbGllbnRDb21tYW5kcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS91c2VIYW5nb3V0cy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9tb2JpbGUuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IGFjdGlvblR5cGVzID0ge1xyXG4gICAgTUVTU0FHRV9URVhUX0NIQU5HRUQ6J01FU1NBR0VfVEVYVF9DSEFOR0VEJyxcclxuICAgIExPQURfSEFOR09VVFM6ICdMT0FEX0hBTkdPVVRTJyxcclxuICAgIExPQURfTUVTU0FHRVM6ICdMT0FEX01FU1NBR0VTJyxcclxuICAgIFNFQVJDSEVEX0hBTkdPVVQ6ICdTRUFSQ0hFRF9IQU5HT1VUJyxcclxuICAgIFNFTEVDVEVEX0hBTkdPVVQ6ICdTRUxFQ1RFRF9IQU5HT1VUJyxcclxuICAgIFNFTEVDVEVEX1VTRVI6J1NFTEVDVEVEX1VTRVInLFxyXG4gICAgRklMVEVSX0hBTkdPVVRTOidGSUxURVJfSEFOR09VVFMnLFxyXG5cclxuICAgIEZFVENIX0hBTkdPVVRfU1RBUlRFRDogJ0ZFVENIX0hBTkdPVVRfU1RBUlRFRCcsXHJcbiAgICBGRVRDSF9IQU5HT1VUX1NVQ0NFU1M6ICdGRVRDSF9IQU5HT1VUX1NVQ0NFU1MnLFxyXG4gICAgRkVUQ0hfSEFOR09VVF9GQUlMRUQ6ICdGRVRDSF9IQU5HT1VUX0ZBSUxFRCcsXHJcbiAgICBGRVRDSF9IQU5HT1VUX05PVF9GT1VORDogJ0ZFVENIX0hBTkdPVVRfTk9UX0ZPVU5EJyxcclxuXHJcblxyXG4gICAgRkVUQ0hfVVNFUl9TVEFSVEVEOiAnRkVUQ0hfVVNFUl9TVEFSVEVEJyxcclxuICAgIEZFVENIX1VTRVJfU1VDQ0VTUzogJ0ZFVENIX1VTRVJfU1VDQ0VTUycsXHJcbiAgICBGRVRDSF9VU0VSX0ZBSUxFRDogJ0ZFVENIX1VTRVJfRkFJTEVEJyxcclxuXHJcbiAgICBPTkxJTkVfU1RBVEVfQ0hBTkdFRDogJ09OTElORV9TVEFURV9DSEFOR0VEJyxcclxuXHJcbiAgICBIQU5HT1VUX1NUQVRFX0NIQU5HRUQ6ICdIQU5HT1VUX1NUQVRFX0NIQU5HRUQnLFxyXG4gICAgTkVXX0hBTkdPVVRfUkVDSUVWRUQ6J05FV19IQU5HT1VUX1JFQ0lFVkVEJyxcclxuICAgIENMSUVOVF9DT01NQU5EX1NUQVJURUQ6J0NMSUVOVF9DT01NQU5EX1NUQVJURUQnLFxyXG4gICAgQ0xJRU5UX0NPTU1BTkRfU1VDQ0VTUzonQ0xJRU5UX0NPTU1BTkRfU1VDQ0VTUycsXHJcbiAgICBDTElFTlRfQ09NTUFORF9GQUlMRUQ6J0NMSUVOVF9DT01NQU5EX0ZBSUxFRCdcclxufSIsImltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi9hY3Rpb25UeXBlcyc7XHJcbmV4cG9ydCBjb25zdCBpbml0U3RhdGUgPSB7XHJcbiAgaGFuZ291dHM6IFtdLFxyXG4gIGhhbmdvdXQ6IG51bGwsXHJcblxyXG4gIG1lc3NhZ2VzOiBbXSxcclxuICBzZWFyY2g6ICcnLFxyXG4gIHVzZXI6IFtdLFxyXG4gIGxvYWRpbmc6IGZhbHNlLFxyXG4gIGVycm9yOiBudWxsLFxyXG4gIG1lc3NhZ2VUZXh0OiAnJyxcclxuICBvbmxpbmU6IGZhbHNlXHJcbn07XHJcbmV4cG9ydCBmdW5jdGlvbiByZWR1Y2VyKHN0YXRlLCBhY3Rpb24pIHtcclxuICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLk1FU1NBR0VfVEVYVF9DSEFOR0VEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbWVzc2FnZVRleHQ6IGFjdGlvbi50ZXh0IH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX1VTRVJfRkFJTEVEOlxyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX0ZBSUxFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBlcnJvcjogYWN0aW9uLmVycm9yIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX1VTRVJfU1RBUlRFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IHRydWUgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuRkVUQ0hfVVNFUl9TVUNDRVNTOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIGxvYWRpbmc6IGZhbHNlLFxyXG4gICAgICAgIHVzZXJzOiBhY3Rpb24udXNlcnMsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfU1RBUlRFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IHRydWUgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9TVUNDRVNTOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGhhbmdvdXRzOiBhY3Rpb24uaGFuZ291dHMgfTtcclxuXHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkhBTkdPVVRfTk9UX0ZPVU5EOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuRklMVEVSX0hBTkdPVVRTOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIGhhbmdvdXRzOiBzdGF0ZS5oYW5nb3V0cy5maWx0ZXIoKGcpID0+XHJcbiAgICAgICAgICBnLnVzZXJuYW1lLmluY2x1ZGVzKHN0YXRlLnNlYXJjaClcclxuICAgICAgICApLFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TRUFSQ0hFRF9IQU5HT1VUOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgc2VhcmNoOiBhY3Rpb24uc2VhcmNoIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkxPQURfSEFOR09VVFM6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBoYW5nb3V0czogYWN0aW9uLmhhbmdvdXRzIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNFTEVDVEVEX1VTRVI6XHJcbiAgICAgIGlmIChzdGF0ZS5oYW5nb3V0cykge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICAgIGhhbmdvdXRzOiBbLi4uc3RhdGUuaGFuZ291dHMsIGFjdGlvbi5oYW5nb3V0XSxcclxuICAgICAgICAgIGhhbmdvdXQ6IGFjdGlvbi5oYW5nb3V0LFxyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICBoYW5nb3V0czogW2FjdGlvbi5oYW5nb3V0XSxcclxuICAgICAgICBoYW5nb3V0OiBhY3Rpb24uaGFuZ291dCxcclxuICAgICAgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0VMRUNURURfSEFOR09VVDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICBoYW5nb3V0OiBzdGF0ZS5oYW5nb3V0cy5maW5kKChnKSA9PiBnLnVzZXJuYW1lID09PSBhY3Rpb24udXNlcm5hbWUpLFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5IQU5HT1VUX1NUQVRFX0NIQU5HRUQ6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsaGFuZ291dDphY3Rpb24uaGFuZ291dCwgaGFuZ291dHM6IHN0YXRlLmhhbmdvdXRzLm1hcChnID0+IHtcclxuICAgICAgICAgIGlmIChnLnVzZXJuYW1lID09PSBhY3Rpb24uaGFuZ291dC51c2VybmFtZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLmhhbmdvdXRcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gZ1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuTkVXX0hBTkdPVVRfUkVDSUVWRUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBoYW5nb3V0czogWy4uLnN0YXRlLmhhbmdvdXRzLGFjdGlvbi5oYW5nb3V0XSB9XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICByZXR1cm4gc3RhdGU7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi9hY3Rpb25UeXBlcyc7XHJcblxyXG4vL3JldHJpZXZlcyBoYW5nb3V0cyBmcm9tIGxvY2FsU3RvcmFnZVxyXG5leHBvcnQgZnVuY3Rpb24gbG9hZEhhbmdvdXRzKHsgdXNlcm5hbWUsIGRpc3BhdGNoIH0pIHtcclxuICBjb25zdCBoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oYCR7dXNlcm5hbWV9LWhhbmdvdXRzYCkpO1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTE9BRF9IQU5HT1VUUywgaGFuZ291dHMgfSk7XHJcbn1cclxuLy9zZWxlY3QgaGFuZ291dCBmcm9tIExpc3RcclxuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdEhhbmdvdXQoeyBkaXNwYXRjaCwgdXNlcm5hbWUgfSkge1xyXG5cclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFTEVDVEVEX0hBTkdPVVQsIHVzZXJuYW1lIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0VXNlcih7IGRpc3BhdGNoLCB1c2VyLCB1c2VybmFtZSB9KSB7XHJcbiAgLy8gc2F2ZSBzZWxlY3RlZCB1c2VyIHRvIGhhbmdvdXRzXHJcbiAgY29uc3QgaGFuZ291dCA9IHsgLi4udXNlciwgc3RhdGU6ICdJTlZJVEUnIH07XHJcbiAgY29uc3QgaGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGAke3VzZXJuYW1lfS1oYW5nb3V0c2ApKTtcclxuXHJcbiAgaWYgKGhhbmdvdXRzKSB7XHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcclxuICAgICAgYCR7dXNlcm5hbWV9LWhhbmdvdXRzYCxcclxuICAgICAgSlNPTi5zdHJpbmdpZnkoWy4uLmhhbmdvdXRzLCBoYW5nb3V0XSlcclxuICAgICk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGAke3VzZXJuYW1lfS1oYW5nb3V0c2AsIEpTT04uc3RyaW5naWZ5KFtoYW5nb3V0XSkpO1xyXG4gIH1cclxuXHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TRUxFQ1RFRF9VU0VSLCBoYW5nb3V0IH0pO1xyXG59XHJcbi8vc2VhcmNoIGZvciBoYW5nb3V0IGJ5IHR5cGluZyBpbnRvIFRleHRJbnB1dFxyXG5leHBvcnQgZnVuY3Rpb24gc2VhcmNoSGFuZ291dHMoeyBzZWFyY2gsIGRpc3BhdGNoIH0pIHtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFQVJDSEVEX0hBTkdPVVQsIHNlYXJjaCB9KTtcclxufVxyXG4vL2ZpbHRlciBoYW5nb3V0IGFmdGVyIHNlYXJjaCBzdGF0ZSBjaGFuZ2VcclxuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlckhhbmdvdXRzKHsgZGlzcGF0Y2ggfSkge1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRklMVEVSX0hBTkdPVVRTIH0pO1xyXG59XHJcblxyXG4vL2ZldGNoIGhhbmdvdXQgZnJvbSBzZXJ2ZXIgaWYgbm90IGZvdW5kIGluIGxvY2FsIGhhbmdvdXRzXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaEhhbmdvdXQoeyBzZWFyY2gsIGRpc3BhdGNoLHVzZXJuYW1lIH0pIHtcclxuICA7XHJcbiAgdHJ5IHtcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9TVEFSVEVEIH0pO1xyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL2hhbmdvdXRzL2ZpbmQ/c2VhcmNoPSR7c2VhcmNofSZ1c2VybmFtZT0ke3VzZXJuYW1lfWApO1xyXG4gICAgO1xyXG4gICAgaWYgKHJlc3BvbnNlLm9rKSB7XHJcbiAgICAgIDtcclxuICAgICAgY29uc3QgeyBoYW5nb3V0cyB9ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICA7XHJcbiAgICAgIGlmIChoYW5nb3V0cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NVQ0NFU1MsIGhhbmdvdXRzIH0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9OT1RfRk9VTkQgfSk7XHJcbiAgICAgICAgLy8gZmV0Y2ggdXNlciBmcm9tIHNlcnZlciBpbiBoYW5nb3V0IGlzIG5ld3VzZXJcclxuICAgICAgICBmZXRjaFVzZXIoeyBzZWFyY2gsIGRpc3BhdGNoIH0pO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfTk9UX0ZPVU5EIH0pO1xyXG4gICAgICAvLyBmZXRjaCB1c2VyIGZyb20gc2VydmVyIGluIGhhbmdvdXQgaXMgbmV3dXNlclxyXG4gICAgICBmZXRjaFVzZXIoeyBzZWFyY2gsIGRpc3BhdGNoIH0pO1xyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zdCBlcnIgPSBlcnJvcjtcclxuICAgIDtcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9GQUlMRUQsIGVycm9yIH0pO1xyXG4gIH1cclxufVxyXG4vLyBmZXRjaCB1c2VyIGZyb20gc2VydmVyIGluIGhhbmdvdXQgaXMgbmV3dXNlclxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hVc2VyKHsgc2VhcmNoLCBkaXNwYXRjaCB9KSB7XHJcbiAgdHJ5IHtcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfVVNFUl9TVEFSVEVEIH0pO1xyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL3VzZXJzL2ZpbmQ/c2VhcmNoPSR7c2VhcmNofWApO1xyXG4gICAgY29uc3QgeyB1c2VycyB9ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfVVNFUl9TVUNDRVNTLCB1c2VycyB9KTtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9VU0VSX0ZBSUxFRCwgZXJyb3IgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY2hhbmdlTWVzc2FnZVRleHQoeyB0ZXh0LCBkaXNwYXRjaCB9KSB7XHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5NRVNTQUdFX1RFWFRfQ0hBTkdFRCwgdGV4dCB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHN0YXJ0Q2xpZW50Q29tbWFuZCh7ZGlzcGF0Y2h9KXtcclxuZGlzcGF0Y2goe3R5cGU6YWN0aW9uVHlwZXMuQ0xJRU5UX0NPTU1BTkRfU1RBUlRFRH0pXHJcbn0iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHtcclxuICB1c2VDb250ZXh0LFxyXG4gIHVzZVN0YXRlLFxyXG4gIHVzZU1lbW8sXHJcbiAgdXNlUmVkdWNlcixcclxuICB1c2VFZmZlY3QsXHJcbn0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgcmVkdWNlciwgaW5pdFN0YXRlIH0gZnJvbSAnLi9yZWR1Y2VyJztcclxuXHJcbmltcG9ydCB7IGxvYWRIYW5nb3V0cywgZmlsdGVySGFuZ291dHMsZmV0Y2hIYW5nb3V0IH0gZnJvbSAnLi9hY3Rpb25zJztcclxuaW1wb3J0IHsgdXNlQXV0aENvbnRleHQgfSBmcm9tICcuLi8uLi9hdXRoL2F1dGgtY29udGV4dCc7XHJcbmNvbnN0IEhhbmdvdXRDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xyXG5leHBvcnQgZnVuY3Rpb24gdXNlSGFuZ291dENvbnRleHQoKSB7XHJcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoSGFuZ291dENvbnRleHQpO1xyXG4gIGlmICghY29udGV4dCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VIYW5nb3V0Q29udGV4dCBtdXN0IGJlIHVzZWQgd2l0aCBIYW5nb3V0c1Byb3ZpZGVyJyk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gY29udGV4dDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEhhbmdvdXRzUHJvdmlkZXIocHJvcHMpIHtcclxuICBjb25zdCBhdXRoQ29udGV4dCA9IHVzZUF1dGhDb250ZXh0KCk7XHJcbiAgY29uc3QgeyB1c2VybmFtZSB9ID0gYXV0aENvbnRleHQuc3RhdGU7XHJcbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSB1c2VSZWR1Y2VyKHJlZHVjZXIsIGluaXRTdGF0ZSk7XHJcbiAgY29uc3QgeyBoYW5nb3V0IH0gPSBzdGF0ZTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmICh1c2VybmFtZSkge1xyXG4gICAgICBsb2FkSGFuZ291dHMoeyB1c2VybmFtZSwgZGlzcGF0Y2ggfSk7XHJcbiAgICB9XHJcbiAgfSwgW3VzZXJuYW1lXSk7XHJcblxyXG5cclxuXHJcbiAgY29uc3QgdmFsdWUgPSB1c2VNZW1vKCgpID0+IFtzdGF0ZSwgZGlzcGF0Y2hdLCBbc3RhdGVdKTtcclxuICByZXR1cm4gPEhhbmdvdXRDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt2YWx1ZX0gey4uLnByb3BzfSAvPjtcclxufVxyXG4iLCJcclxuICBleHBvcnQgY29uc3QgaGFuZ291dFN0YXRlcyA9IHtcclxuICAgIElOVklURVI6ICdJTlZJVEVSJyxcclxuICAgIEFDQ0VQVEVSOiAnQUNDRVBURVInLFxyXG4gICAgREVDTElORVI6ICdERUNMSU5FUicsXHJcbiAgICBCTE9DS0VSOiAnQkxPQ0tFUicsXHJcbiAgICBVTkJMT0NLRVI6ICdVTkJMT0NLRVInLFxyXG4gICAgTUVTU0FOR0VSOiAnTUVTU0FOR0VSJyxcclxuICAgLy8gYWNrbm93bGVnZW1lbnRcclxuICAgIElOVklURUQ6ICdJTlZJVEVEJyxcclxuICAgIEFDQ0VQVEVEOiAnQUNDRVBURUQnLFxyXG4gICAgREVDTElORUQ6ICdERUNMSU5FRCcsXHJcbiAgICBCTE9DS0VEOiAnQkxPQ0tFRCcsXHJcbiAgICBVTkJMT0NLRUQ6ICdVTkJMT0NLRUQnLFxyXG4gICAgTUVTU0FHRUQ6ICdNRVNTQUdFRCcsXHJcbiAgfTsiLCJpbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgeyB1c2VXU29ja2V0Q29udGV4dCB9IGZyb20gJy4uLy4uL3dzb2NrZXQvV1NvY2tldFByb3ZpZGVyJztcclxuaW1wb3J0IHsgaGFuZ291dFN0YXRlcyB9IGZyb20gJy4uLy4uLy4uL3NlcnZlci9oYW5nb3V0cy9oYW5nb3V0U3RhdGVzJ1xyXG5pbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4vYWN0aW9uVHlwZXMnXHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VTb2NrZXQoeyBkaXNwYXRjaCwgdXNlcm5hbWUgfSkge1xyXG4gIGNvbnN0IHNvY2tldENvbnRleHQgPSB1c2VXU29ja2V0Q29udGV4dCgpO1xyXG4gIGNvbnN0IHsgc29ja2V0IH0gPSBzb2NrZXRDb250ZXh0XHJcblxyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKHNvY2tldCkge1xyXG4gICAgICBzb2NrZXQub25tZXNzYWdlID0gKG1lc3NhZ2UpID0+IHtcclxuICAgICAgICBjb25zdCBoYW5nb3V0ID0gSlNPTi5wYXJzZShtZXNzYWdlLmRhdGEpO1xyXG4gICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgIGhhbmRsZUhhbmdvdXRTdGF0ZSh7IGhhbmdvdXQsIHVzZXJuYW1lLCBkaXNwYXRjaCB9KVxyXG4gICAgICB9O1xyXG4gICAgICBzb2NrZXQub25jbG9zZSA9ICgpID0+IHtcclxuICAgICAgICA7XHJcbiAgICAgIH07XHJcbiAgICAgIHNvY2tldC5vbmVycm9yID0gKGVycm9yKSA9PiB7XHJcbiAgICAgICAgO1xyXG4gICAgICB9O1xyXG4gICAgICBzb2NrZXQub25vcGVuID0gKCkgPT4ge1xyXG4gICAgICAgIDtcclxuICAgICAgfTtcclxuICAgIH1cclxuICB9LCBbc29ja2V0XSk7XHJcblxyXG4gIHJldHVybiBudWxsO1xyXG5cclxufVxyXG5cclxuZnVuY3Rpb24gaGFuZGxlSGFuZ291dFN0YXRlKHsgaGFuZ291dCwgdXNlcm5hbWUsIGRpc3BhdGNoIH0pIHtcclxuICBjb25zdCBrZXkgPSBgJHt1c2VybmFtZX0taGFuZ291dHNgXHJcbiAgZGVidWdnZXI7XHJcbiAgY29uc3QgdGFyZ2V0ID0gaGFuZ291dC51c2VybmFtZVxyXG4gIGNvbnN0IGhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpKVxyXG4gIGRlYnVnZ2VyO1xyXG4gIGxldCB1cGRhdGVkU3RhdGUgPSBudWxsO1xyXG4gIHN3aXRjaCAoaGFuZ291dC5zdGF0ZSkge1xyXG4gXHJcbiAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuQUNDRVBURVI6XHJcbiAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuQkxPQ0tFRDpcclxuICAgIGNhc2UgaGFuZ291dFN0YXRlcy5CTE9DS0VSOlxyXG4gICAgY2FzZSBoYW5nb3V0U3RhdGVzLkRFQ0xJTkVEOlxyXG4gICAgY2FzZSBoYW5nb3V0U3RhdGVzLkRFQ0xJTkVSOlxyXG4gICAgY2FzZSBoYW5nb3V0U3RhdGVzLk1FU1NBR0VEOlxyXG4gICAgY2FzZSBoYW5nb3V0U3RhdGVzLk1FU1NBTkdFUjpcclxuICAgIGNhc2UgaGFuZ291dFN0YXRlcy5VTkJMT0NLRUQ6XHJcbiAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuVU5CTE9DS0VSOlxyXG4gICAgY2FzZSBoYW5nb3V0U3RhdGVzLklOVklURUQ6XHJcbiAgICAgIHVwZGF0ZWRTdGF0ZSA9IGhhbmdvdXRzLm1hcChnID0+IHsgaWYgKGcudXNlcm5hbWUgPT09IHRhcmdldCkgeyByZXR1cm4gaGFuZ291dCB9IGVsc2UgcmV0dXJuIGcgfSlcclxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeSggdXBkYXRlZFN0YXRlKSlcclxuICAgICAgZGVidWdnZXI7XHJcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuSEFOR09VVF9TVEFURV9DSEFOR0VELCBoYW5nb3V0IH0pXHJcbiAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuQUNDRVBURUQ6XHJcbiAgICBjYXNlIGhhbmdvdXRTdGF0ZXMuSU5WSVRFUjpcclxuICAgICAgaWYgKGhhbmdvdXRzKSB7XHJcbiAgICAgICAgZGVidWdnZXJcclxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksSlNPTi5zdHJpbmdpZnkoaGFuZ291dHMucHVzaChoYW5nb3V0KSkpXHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeShbaGFuZ291dF0pKVxyXG4gICAgICB9XHJcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTkVXX0hBTkdPVVRfUkVDSUVWRUQsIGhhbmdvdXQgfSlcclxuICAgICAgYnJlYWs7XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJoYW5nb3V0U3RhdGUgbm90IGRlZmluZWRcIilcclxuICB9XHJcblxyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiIsIlxyXG4vL2lzIHNlbnQgYnkgY2xpZW50XHJcbmV4cG9ydCBjb25zdCBjbGllbnRDb21tYW5kcyA9IHtcclxuICBJTlZJVEU6ICdJTlZJVEUnLFxyXG4gIEFDQ0VQVDogJ0FDQ0VQVCcsXHJcbiAgREVDTElORTogJ0RFQ0xJTkUnLFxyXG4gIEJMT0NLOiAnQkxPQ0snLFxyXG4gIFVOQkxPQ0s6ICdVTkJMT0NLJyxcclxuICBNRVNTQUdFOiAnTUVTU0FHRScsXHJcbn07XHJcblxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlSGFuZ291dENvbnRleHQgfSBmcm9tICcuL0hhbmdvdXRzUHJvdmlkZXInO1xyXG5pbXBvcnQgeyB1c2VBdXRoQ29udGV4dCB9IGZyb20gJy4uLy4uL2F1dGgvYXV0aC1jb250ZXh0JztcclxuaW1wb3J0IHsgdXNlV1NvY2tldENvbnRleHQgfSBmcm9tICcuLi8uLi93c29ja2V0L1dTb2NrZXRQcm92aWRlcic7XHJcbmltcG9ydCB7XHJcbiAgc2VsZWN0SGFuZ291dCxcclxuICBzZWFyY2hIYW5nb3V0cyxcclxuICBmaWx0ZXJIYW5nb3V0cyxcclxuICBmZXRjaEhhbmdvdXQsXHJcbiAgc2VsZWN0VXNlcixcclxuICBjaGFuZ2VNZXNzYWdlVGV4dCxcclxuICBzdGFydENsaWVudENvbW1hbmRcclxufSBmcm9tICcuL2FjdGlvbnMnO1xyXG5pbXBvcnQgeyB1c2VTb2NrZXQgfSBmcm9tICcuL3VzZVNvY2tldCc7XHJcbmltcG9ydCB7IGNsaWVudENvbW1hbmRzIH0gZnJvbSAnLi9jbGllbnRDb21tYW5kcyc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXNlSGFuZ291dHMoKSB7XHJcbiAgY29uc3Qgc29ja2V0Q29udGV4dCA9IHVzZVdTb2NrZXRDb250ZXh0KCk7XHJcbiAgY29uc3QgeyBzb2NrZXQgfSA9IHNvY2tldENvbnRleHQ7XHJcbiAgY29uc3QgYXV0aENvbnRleHQgPSB1c2VBdXRoQ29udGV4dCgpO1xyXG4gIGNvbnN0IHsgdXNlcm5hbWUgfSA9IGF1dGhDb250ZXh0LnN0YXRlO1xyXG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlSGFuZ291dENvbnRleHQoKTtcclxuXHJcbiAgY29uc3QgeyBoYW5nb3V0LCBoYW5nb3V0cywgc2VhcmNoLCB1c2VycywgbWVzc2FnZVRleHQgfSA9IHN0YXRlO1xyXG4gIGNvbnN0IGhhbmRsZVNvY2tldCA9IHVzZVNvY2tldCh7IGRpc3BhdGNoLCBoYW5nb3V0LCB1c2VybmFtZSB9KTtcclxuICBmdW5jdGlvbiBvblNlbGVjdEhhbmdvdXQoZSkge1xyXG4gICAgY29uc3QgdXNlcm5hbWUgPSBlLnRhcmdldC5pZDtcclxuXHJcbiAgICBzZWxlY3RIYW5nb3V0KHsgZGlzcGF0Y2gsIHVzZXJuYW1lIH0pO1xyXG4gIH1cclxuICBmdW5jdGlvbiBvblNlbGVjdFVzZXIoZSkge1xyXG4gICAgY29uc3QgdW5hbWUgPSBlLnRhcmdldC5pZDtcclxuICAgIGNvbnN0IHVzZXIgPSB1c2Vycy5maW5kKCh1KSA9PiB1LnVzZXJuYW1lID09PSB1bmFtZSk7XHJcbiAgICBzZWxlY3RVc2VyKHsgZGlzcGF0Y2gsIHVzZXIsIHVzZXJuYW1lIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gb25JbnZpdGUoKSB7XHJcbiAgICBjb25zdCB7IHVzZXJuYW1lLCBlbWFpbCB9ID0gaGFuZ291dDtcclxuICAgIGNvbnN0IHVwZGF0ZWRIYW5nb3V0ID0ge1xyXG4gICAgICB1c2VybmFtZSxcclxuICAgICAgZW1haWwsXHJcbiAgICAgIG1lc3NhZ2U6IHsgdGV4dDogbWVzc2FnZVRleHQsIHRpbWVzdGFtcDogRGF0ZS5ub3coKSB9LFxyXG4gICAgfTtcclxuICAgIHNvY2tldC5zZW5kKFxyXG4gICAgICBKU09OLnN0cmluZ2lmeSh7IC4uLnVwZGF0ZWRIYW5nb3V0LCBjb21tYW5kOiBjbGllbnRDb21tYW5kcy5JTlZJVEUgfSlcclxuICAgICk7XHJcbiAgICBzdGFydENsaWVudENvbW1hbmQoeyBkaXNwYXRjaCB9KVxyXG4gIH1cclxuICBmdW5jdGlvbiBvbkFjY2VwdCgpIHtcclxuICAgIGNvbnN0IHsgdXNlcm5hbWUsIGVtYWlsIH0gPSBoYW5nb3V0O1xyXG4gICAgZGVidWdnZXI7XHJcbiAgICBzb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7IHVzZXJuYW1lLCBlbWFpbCwgY29tbWFuZDogY2xpZW50Q29tbWFuZHMuQUNDRVBUIH0pKTtcclxuICAgIHN0YXJ0Q2xpZW50Q29tbWFuZCh7IGRpc3BhdGNoIH0pXHJcbiAgfVxyXG4gIGZ1bmN0aW9uIG9uQmxvY2soKSB7XHJcbiAgICBzb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7IC4uLmhhbmdvdXQsIGNvbW1hbmQ6IGNsaWVudENvbW1hbmRzLkJMT0NLIH0pKTtcclxuICAgIHN0YXJ0Q2xpZW50Q29tbWFuZCh7IGRpc3BhdGNoIH0pXHJcbiAgfVxyXG4gIGZ1bmN0aW9uIG9uVW5ibG9jaygpIHtcclxuICAgIHNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHsgLi4uaGFuZ291dCwgY29tbWFuZDogY2xpZW50Q29tbWFuZHMuVU5CTE9DSyB9KSk7XHJcbiAgICBzdGFydENsaWVudENvbW1hbmQoeyBkaXNwYXRjaCB9KVxyXG4gIH1cclxuICBmdW5jdGlvbiBvbkRlY2xpbmUoKSB7XHJcbiAgICBzb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7IC4uLmhhbmdvdXQsIGNvbW1hbmQ6IGNsaWVudENvbW1hbmRzLkRFQ0xJTkUgfSkpO1xyXG4gICAgc3RhcnRDbGllbnRDb21tYW5kKHsgZGlzcGF0Y2ggfSlcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIG9uTWVzc2FnZSgpIHtcclxuICAgIHNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHsgLi4uaGFuZ291dCwgY29tbWFuZDogY2xpZW50Q29tbWFuZHMuTUVTU0FHRSB9KSk7XHJcbiAgICBzdGFydENsaWVudENvbW1hbmQoeyBkaXNwYXRjaCB9KVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gb25TZWFyY2goZSkge1xyXG4gICAgc2VhcmNoSGFuZ291dHMoeyBzZWFyY2g6IGUudGFyZ2V0LnZhbHVlLCBkaXNwYXRjaCB9KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIG9uU3RhcnRTZWFyY2goZSkge1xyXG4gICAgaWYgKGhhbmdvdXRzICYmIGhhbmdvdXRzLmxlbmd0aCA+IDApIHtcclxuICAgICAgZmlsdGVySGFuZ291dHMoeyBkaXNwYXRjaCB9KTtcclxuICAgIH1cclxuICAgIGZldGNoSGFuZ291dCh7IGRpc3BhdGNoLCBzZWFyY2gsIHVzZXJuYW1lIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gb25NZXNzYWdlVGV4dChlKSB7XHJcbiAgICBjaGFuZ2VNZXNzYWdlVGV4dCh7IGRpc3BhdGNoLCB0ZXh0OiBlLnRhcmdldC52YWx1ZSB9KTtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBvbk1lc3NhZ2VUZXh0LFxyXG4gICAgbWVzc2FnZVRleHQsXHJcbiAgICBvblN0YXJ0U2VhcmNoLFxyXG4gICAgb25TZWFyY2gsXHJcbiAgICBzZWFyY2gsXHJcbiAgICBvbk1lc3NhZ2UsXHJcbiAgICBvbkludml0ZSxcclxuICAgIG9uQWNjZXB0LFxyXG4gICAgb25CbG9jayxcclxuICAgIG9uVW5ibG9jayxcclxuICAgIG9uU2VsZWN0SGFuZ291dCxcclxuICAgIG9uU2VsZWN0VXNlcixcclxuICAgIG9uRGVjbGluZSxcclxuICAgIGhhbmdvdXQsXHJcbiAgICBoYW5nb3V0cyxcclxuICAgIHVzZXJzLFxyXG4gIH07XHJcbn1cclxuXHJcblxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgbGF6eSwgU3VzcGVuc2UgfSBmcm9tICdwcmVhY3QvY29tcGF0JztcclxuaW1wb3J0IHsgUm91dGUsIHVzZVJvdXRlQ29udGV4dCB9IGZyb20gJy4uL3JvdXRlL3JvdXRlcic7XHJcbmltcG9ydCB7IHVzZUhhbmdvdXRzIH0gZnJvbSAnLi9zdGF0ZS91c2VIYW5nb3V0cyc7XHJcbmNvbnN0IEhhbmdvdXRzID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vSGFuZ291dCcpKTtcclxuY29uc3QgQmxvY2sgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9zdGF0ZS11aS9CbG9jaycpKTtcclxuY29uc3QgQmxvY2tlZCA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL3N0YXRlLXVpL0Jsb2NrZWQnKSk7XHJcbmNvbnN0IENvbmZpZ3VyZSA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL3N0YXRlLXVpL0NvbmZpZ3VyZScpKTtcclxuY29uc3QgSGFuZ2NoYXQgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9zdGF0ZS11aS9IYW5nY2hhdCcpKTtcclxuY29uc3QgSW52aXRlID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vc3RhdGUtdWkvSW52aXRlJykpO1xyXG5jb25zdCBJbnZpdGVlID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vc3RhdGUtdWkvSW52aXRlZScpKTtcclxuY29uc3QgSW52aXRlciA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL3N0YXRlLXVpL0ludml0ZXInKSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBNb2JpbGUoKSB7XHJcbiAgY29uc3QgW3JvdXRlLCBzZXRSb3V0ZV0gPSB1c2VSb3V0ZUNvbnRleHQoKTtcclxuXHJcbiAgY29uc3Qge1xyXG4gICAgaGFuZ291dCxcclxuICAgIGhhbmdvdXRzLFxyXG4gICAgb25BY2NlcHQsXHJcbiAgICBvbkJsb2NrLFxyXG4gICAgb25JbnZpdGUsXHJcbiAgICBvblNlbGVjdEhhbmdvdXQsXHJcbiAgICBvblNlbGVjdFVzZXIsXHJcbiAgICBvblVuYmxvY2ssXHJcbiAgICBvblNlYXJjaCxcclxuICAgIHVzZXJzLFxyXG4gICAgc2VhcmNoLFxyXG4gICAgb25TdGFydFNlYXJjaCxcclxuICAgIG9uTWVzc2FnZVRleHQsXHJcbiAgICBtZXNzYWdlVGV4dFxyXG4gIH0gPSB1c2VIYW5nb3V0cygpO1xyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAoaGFuZ291dCkge1xyXG5cclxuICAgICAgc2V0Um91dGUoYC8ke2hhbmdvdXQuc3RhdGV9YCk7XHJcbiAgICB9XHJcbiAgfSwgW2hhbmdvdXRdKTtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17eyBoZWlnaHQ6ICc4NXZoJyB9fT5cclxuICAgICAgPFJvdXRlIHBhdGg9XCIvaGFuZ291dHNcIj5cclxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+TG9hZGluZy4uLjwvZGl2Pn0+XHJcbiAgICAgICAgICA8SGFuZ291dHNcclxuICAgICAgICAgICAgdXNlcnM9e3VzZXJzfVxyXG4gICAgICAgICAgICBzZWFyY2g9e3NlYXJjaH1cclxuICAgICAgICAgICAgaGFuZ291dHM9e2hhbmdvdXRzfVxyXG4gICAgICAgICAgICBvblNlbGVjdEhhbmdvdXQ9e29uU2VsZWN0SGFuZ291dH1cclxuICAgICAgICAgICAgb25TZWxlY3RVc2VyPXtvblNlbGVjdFVzZXJ9XHJcbiAgICAgICAgICAgIG9uU2VhcmNoPXtvblNlYXJjaH1cclxuICAgICAgICAgICAgb25TdGFydFNlYXJjaD17b25TdGFydFNlYXJjaH1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9Sb3V0ZT5cclxuICAgICAgPFJvdXRlIHBhdGg9XCIvQkxPQ0tcIj5cclxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+TG9hZGluZy4uLjwvZGl2Pn0+XHJcbiAgICAgICAgICA8QmxvY2sgaGFuZ291dD17aGFuZ291dH0gb25CbG9jaz17b25CbG9ja30gLz5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICA8L1JvdXRlPlxyXG4gICAgICA8Um91dGUgcGF0aD1cIi9CTE9DS0VEXCI+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPEJsb2NrZWQgaGFuZ291dD17aGFuZ291dH0gb25VbmJsb2NrPXtvblVuYmxvY2t9IC8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9Sb3V0ZT5cclxuICAgICAgPFJvdXRlIHBhdGg9XCIvY29uZmlndXJlXCI+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPENvbmZpZ3VyZSBoYW5nb3V0PXtoYW5nb3V0fSAvPlxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgIDwvUm91dGU+XHJcbiAgICAgIDxSb3V0ZSBwYXRoPVwiL0FDQ0VQVEVEXCI+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPEhhbmdjaGF0IC8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9Sb3V0ZT5cclxuICAgICAgPFJvdXRlIHBhdGg9XCIvQUNDRVBURVJcIj5cclxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+TG9hZGluZy4uLjwvZGl2Pn0+XHJcbiAgICAgICAgICA8SGFuZ2NoYXQgLz5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICA8L1JvdXRlPlxyXG4gICAgICA8Um91dGUgcGF0aD1cIi9JTlZJVEVcIj5cclxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+TG9hZGluZy4uLjwvZGl2Pn0+XHJcbiAgICAgICAgICA8SW52aXRlIGhhbmdvdXQ9e2hhbmdvdXR9IG9uSW52aXRlPXtvbkludml0ZX0gb25NZXNzYWdlVGV4dD17b25NZXNzYWdlVGV4dH0gbWVzc2FnZVRleHQ9e21lc3NhZ2VUZXh0fS8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9Sb3V0ZT5cclxuICAgICAgPFJvdXRlIHBhdGg9XCIvSU5WSVRFRFwiPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxJbnZpdGVlIGhhbmdvdXQ9e2hhbmdvdXR9IC8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9Sb3V0ZT5cclxuICAgICAgPFJvdXRlIHBhdGg9XCIvSU5WSVRFUlwiPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxJbnZpdGVyIGhhbmdvdXQ9e2hhbmdvdXR9IG9uQWNjZXB0PXtvbkFjY2VwdH0gLz5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICA8L1JvdXRlPlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IE1vYmlsZSBmcm9tICcuL21vYmlsZSc7XHJcbmltcG9ydCB7IEhhbmdvdXRzUHJvdmlkZXIgfSBmcm9tICcuL3N0YXRlL0hhbmdvdXRzUHJvdmlkZXInO1xyXG5pbXBvcnQgeyBSb3V0ZVByb3ZpZGVyLCB1c2VSb3V0ZUNvbnRleHQgfSBmcm9tICcuLi9yb3V0ZS9yb3V0ZXInO1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxIYW5nb3V0c1Byb3ZpZGVyPlxyXG4gICAgICA8Um91dGVQcm92aWRlciBpbml0aWFsUm91dGU9XCIvaGFuZ291dHNcIj5cclxuICAgICAgICA8TW9iaWxlIC8+XHJcbiAgICAgIDwvUm91dGVQcm92aWRlcj5cclxuICAgIDwvSGFuZ291dHNQcm92aWRlcj5cclxuICApO1xyXG59XHJcbiJdLCJuYW1lcyI6WyJhY3Rpb25UeXBlcyIsIk1FU1NBR0VfVEVYVF9DSEFOR0VEIiwiTE9BRF9IQU5HT1VUUyIsIkxPQURfTUVTU0FHRVMiLCJTRUFSQ0hFRF9IQU5HT1VUIiwiU0VMRUNURURfSEFOR09VVCIsIlNFTEVDVEVEX1VTRVIiLCJGSUxURVJfSEFOR09VVFMiLCJGRVRDSF9IQU5HT1VUX1NUQVJURUQiLCJGRVRDSF9IQU5HT1VUX1NVQ0NFU1MiLCJGRVRDSF9IQU5HT1VUX0ZBSUxFRCIsIkZFVENIX0hBTkdPVVRfTk9UX0ZPVU5EIiwiRkVUQ0hfVVNFUl9TVEFSVEVEIiwiRkVUQ0hfVVNFUl9TVUNDRVNTIiwiRkVUQ0hfVVNFUl9GQUlMRUQiLCJPTkxJTkVfU1RBVEVfQ0hBTkdFRCIsIkhBTkdPVVRfU1RBVEVfQ0hBTkdFRCIsIk5FV19IQU5HT1VUX1JFQ0lFVkVEIiwiQ0xJRU5UX0NPTU1BTkRfU1RBUlRFRCIsIkNMSUVOVF9DT01NQU5EX1NVQ0NFU1MiLCJDTElFTlRfQ09NTUFORF9GQUlMRUQiLCJpbml0U3RhdGUiLCJoYW5nb3V0cyIsImhhbmdvdXQiLCJtZXNzYWdlcyIsInNlYXJjaCIsInVzZXIiLCJsb2FkaW5nIiwiZXJyb3IiLCJtZXNzYWdlVGV4dCIsIm9ubGluZSIsInJlZHVjZXIiLCJzdGF0ZSIsImFjdGlvbiIsInR5cGUiLCJ0ZXh0IiwidXNlcnMiLCJIQU5HT1VUX05PVF9GT1VORCIsImZpbHRlciIsImciLCJ1c2VybmFtZSIsImluY2x1ZGVzIiwiZmluZCIsIm1hcCIsImxvYWRIYW5nb3V0cyIsImRpc3BhdGNoIiwiSlNPTiIsInBhcnNlIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsInNlbGVjdEhhbmdvdXQiLCJzZWxlY3RVc2VyIiwic2V0SXRlbSIsInN0cmluZ2lmeSIsInNlYXJjaEhhbmdvdXRzIiwiZmlsdGVySGFuZ291dHMiLCJmZXRjaEhhbmdvdXQiLCJyZXNwb25zZSIsImZldGNoIiwib2siLCJqc29uIiwibGVuZ3RoIiwiZmV0Y2hVc2VyIiwiY2hhbmdlTWVzc2FnZVRleHQiLCJzdGFydENsaWVudENvbW1hbmQiLCJIYW5nb3V0Q29udGV4dCIsImNyZWF0ZUNvbnRleHQiLCJ1c2VIYW5nb3V0Q29udGV4dCIsImNvbnRleHQiLCJ1c2VDb250ZXh0IiwiRXJyb3IiLCJIYW5nb3V0c1Byb3ZpZGVyIiwicHJvcHMiLCJhdXRoQ29udGV4dCIsInVzZUF1dGhDb250ZXh0IiwidXNlUmVkdWNlciIsInVzZUVmZmVjdCIsInZhbHVlIiwidXNlTWVtbyIsImhhbmdvdXRTdGF0ZXMiLCJJTlZJVEVSIiwiQUNDRVBURVIiLCJERUNMSU5FUiIsIkJMT0NLRVIiLCJVTkJMT0NLRVIiLCJNRVNTQU5HRVIiLCJJTlZJVEVEIiwiQUNDRVBURUQiLCJERUNMSU5FRCIsIkJMT0NLRUQiLCJVTkJMT0NLRUQiLCJNRVNTQUdFRCIsInVzZVNvY2tldCIsInNvY2tldENvbnRleHQiLCJ1c2VXU29ja2V0Q29udGV4dCIsInNvY2tldCIsIm9ubWVzc2FnZSIsIm1lc3NhZ2UiLCJkYXRhIiwiaGFuZGxlSGFuZ291dFN0YXRlIiwib25jbG9zZSIsIm9uZXJyb3IiLCJvbm9wZW4iLCJrZXkiLCJ0YXJnZXQiLCJ1cGRhdGVkU3RhdGUiLCJwdXNoIiwiY2xpZW50Q29tbWFuZHMiLCJJTlZJVEUiLCJBQ0NFUFQiLCJERUNMSU5FIiwiQkxPQ0siLCJVTkJMT0NLIiwiTUVTU0FHRSIsInVzZUhhbmdvdXRzIiwiaGFuZGxlU29ja2V0Iiwib25TZWxlY3RIYW5nb3V0IiwiZSIsImlkIiwib25TZWxlY3RVc2VyIiwidW5hbWUiLCJ1Iiwib25JbnZpdGUiLCJlbWFpbCIsInVwZGF0ZWRIYW5nb3V0IiwidGltZXN0YW1wIiwiRGF0ZSIsIm5vdyIsInNlbmQiLCJjb21tYW5kIiwib25BY2NlcHQiLCJvbkJsb2NrIiwib25VbmJsb2NrIiwib25EZWNsaW5lIiwib25NZXNzYWdlIiwib25TZWFyY2giLCJvblN0YXJ0U2VhcmNoIiwib25NZXNzYWdlVGV4dCIsIkhhbmdvdXRzIiwibGF6eSIsIkJsb2NrIiwiQmxvY2tlZCIsIkNvbmZpZ3VyZSIsIkhhbmdjaGF0IiwiSW52aXRlIiwiSW52aXRlZSIsIkludml0ZXIiLCJNb2JpbGUiLCJyb3V0ZSIsInNldFJvdXRlIiwidXNlUm91dGVDb250ZXh0IiwiaGVpZ2h0IiwiU3VzcGVuc2UiXSwibWFwcGluZ3MiOiI7O0FBQU8sTUFBTUEsV0FBVyxHQUFHO0FBQ3ZCQyxFQUFBQSxvQkFBb0IsRUFBQyxzQkFERTtBQUV2QkMsRUFBQUEsYUFBYSxFQUFFLGVBRlE7QUFHdkJDLEVBQUFBLGFBQWEsRUFBRSxlQUhRO0FBSXZCQyxFQUFBQSxnQkFBZ0IsRUFBRSxrQkFKSztBQUt2QkMsRUFBQUEsZ0JBQWdCLEVBQUUsa0JBTEs7QUFNdkJDLEVBQUFBLGFBQWEsRUFBQyxlQU5TO0FBT3ZCQyxFQUFBQSxlQUFlLEVBQUMsaUJBUE87QUFTdkJDLEVBQUFBLHFCQUFxQixFQUFFLHVCQVRBO0FBVXZCQyxFQUFBQSxxQkFBcUIsRUFBRSx1QkFWQTtBQVd2QkMsRUFBQUEsb0JBQW9CLEVBQUUsc0JBWEM7QUFZdkJDLEVBQUFBLHVCQUF1QixFQUFFLHlCQVpGO0FBZXZCQyxFQUFBQSxrQkFBa0IsRUFBRSxvQkFmRztBQWdCdkJDLEVBQUFBLGtCQUFrQixFQUFFLG9CQWhCRztBQWlCdkJDLEVBQUFBLGlCQUFpQixFQUFFLG1CQWpCSTtBQW1CdkJDLEVBQUFBLG9CQUFvQixFQUFFLHNCQW5CQztBQXFCdkJDLEVBQUFBLHFCQUFxQixFQUFFLHVCQXJCQTtBQXNCdkJDLEVBQUFBLG9CQUFvQixFQUFDLHNCQXRCRTtBQXVCdkJDLEVBQUFBLHNC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
