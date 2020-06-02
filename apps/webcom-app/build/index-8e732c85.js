import { M, u as useAuthContext, m, p, s, h, _ as _extends, T, a as useWSocketContext, b as useRouteContext, R as Route, U, L, c as RouteProvider } from './index-e0915968.js';

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
  OFFER_STARTED: 'OFFER_STARTED',
  OFFER_SUCCESS: 'OFFER_SUCCESS',
  OFFER_FAILED: 'OFFER_FAILED',
  ACCEPT_STARTED: 'ACCEPT_STARTED',
  ACCEPT_SUCCESS: 'ACCEPT_SUCCESS',
  ACCEPT_FAILED: 'ACCEPT_FAILED',
  BLOCK_STARTED: 'BLOCK_STARTED',
  BLOCK_SUCCESS: 'BLOCK_SUCCESS',
  BLOCK_FAILED: 'BLOCK_FAILED',
  UNBLOCK_STARTED: 'UNBLOCK_STARTED',
  UNBLOCK_SUCCESS: 'UNBLOCK_SUCCESS',
  UNBLOCK_FAILED: 'UNBLOCK_FAILED',
  MESSAGE_STARTED: 'MESSAGE_STARTED',
  MESSAGE_SUCCESS: 'MESSAGE_SUCCESS',
  MESSAGE_FAILED: 'MESSAGE_FAILED',
  DECLINE_STARTED: 'DECLINE_STARTED',
  DECLINE_SUCCESS: 'DECLINE_SUCCESS',
  DECLINE_FAILED: 'DECLINE_FAILED',
  HANGOUT_CHANGED_ITS_STATE: 'HANGOUT_CHANGED_ITS_STATE',
  OFFERER_RECIEVED: 'OFFERER_RECIEVED',
  ACKNOWLEDGEMENT_RECIEVED: 'ACKNOWLEDGEMENT_RECIEVED'
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
    case actionTypes.OFFER_STARTED:
      return { ...state,
        loading: true
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

    case actionTypes.HANGOUT_CHANGED_ITS_STATE:
    case actionTypes.ACKNOWLEDGEMENT_RECIEVED:
      return { ...state,
        hangouts: state.hangouts.map(g => {
          if (g.username === action.hangout.username) {
            return action.hangout;
          } else return g;
        })
      };

    case actionTypes.OFFERER_RECIEVED:
      return { ...state,
        hangouts: [...state.hangouts, action.hangout]
      };

    default:
      return state;
  }
}

const messagesFromServer = {
  BLOCKER: 'BLOCKER',
  ACCEPTER: 'ACCEPTER',
  UNBLOCKER: 'UNBLOCKER',
  INVITER: 'INVITER',
  DECLINER: 'DECLINER',
  MESSANGER: 'MESSANGER'
};
const messageToServer = {
  ACCEPT: 'ACCEPT',
  DECLINE: 'DECLINE',
  INVITE: 'INVITE',
  BlOCK: 'BlOCK',
  UNBLOCK: 'UNBLOCK',
  MESSAGE: 'MESSAGE'
}; // server side message

const messageCategories = {
  ACKNOWLEDGEMENT: 'ACKNOWLEDGEMENT',
  PEER: 'PEER'
};

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
  dispatch
}) {
  try {
    dispatch({
      type: actionTypes.FETCH_HANGOUT_STARTED
    });
    const response = await fetch(`/hangouts/find?search=${search}`);

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

  function onSelectHangout(e) {
    const username = e.target.id;
    debugger;
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
    debugger;
    socket.send(JSON.stringify({ ...updatedHangout,
      type: messageToServer.INVITE
    }));
    dispatch({
      type: actionTypes.OFFER_STARTED
    });
  }

  function onAccept() {
    socket.send(JSON.stringify({ ...hangout,
      type: messageToServer.ACCEPT
    }));
    dispatch({
      type: actionTypes.ACCEPT_STARTED,
      hangout
    });
  }

  function onBlock() {
    socket.send(JSON.stringify({ ...hangout,
      type: messageToServer.BlOCK
    }));
    dispatch({
      type: actionTypes.BLOCK_STARTED,
      hangout
    });
  }

  function onUnblock() {
    socket.send(JSON.stringify({ ...hangout,
      type: messageToServer.UNBLOCK
    }));
    dispatch({
      type: actionTypes.UNBLOCK_STARTED,
      hangout
    });
  }

  function onDecline() {
    socket.send(JSON.stringify({ ...hangout,
      type: messageToServer.DECLINE
    }));
    dispatch({
      type: actionTypes.DECLINE_STARTED,
      hangout
    });
  }

  function onMessage() {
    socket.send(JSON.stringify({ ...hangout,
      type: messageToServer.MESSAGE
    }));
    dispatch({
      type: actionTypes.MESSAGE_STARTED,
      hangout
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
      search
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

function messageToHangout({
  message,
  hangout
}) {
  return { ...hangout,
    state: message.type,
    message: message
  };
}
function messageToNewHangout(msg) {
  const {
    username,
    email,
    type,
    message
  } = msg;
  const hangout = {
    username,
    state: type,
    email,
    message
  };
  return hangout;
}

function useSocket() {
  const [state, dispatch] = useHangoutContext();
  const {
    hangout
  } = state;
  const socketContext = useWSocketContext();
  const {
    socket
  } = socketContext;
  p(() => {
    if (socket) {
      socket.onmessage = message => {
        debugger;
        const msg = JSON.parse(message.data);
        debugger;

        switch (msg.category) {
          case messageCategories.ACKNOWLEDGEMENT:
            debugger;
            handleAckhowledgements({
              dispatch,
              msg,
              hangout
            });

          case messageCategories.PEER:
            handlePeerMessages({
              dispatch,
              msg,
              hangout
            });

          default:
            throw new Error('Message cateory is not defined');
        }
      };

      socket.onclose = () => {
        debugger;
      };

      socket.onerror = error => {
        debugger;
      };

      socket.onopen = () => {
        debugger;
      };
    }
  }, [socket]);
  return null;
}

function handleAckhowledgements({
  dispatch,
  msg,
  hangout
}) {
  debugger;
  let updatedHangout = messageToHangout({
    hangout,
    message: msg
  });
  dispatch({
    type: actionTypes.ACKNOWLEDGEMENT_RECIEVED,
    hangout: updatedHangout
  });
  updateHangoutStateInLocalStorage(`${username}-hangouts`, updatedHangout);
}

function handlePeerMessages({
  dispatch,
  msg,
  hangout
}) {
  let updatedHangout = messageToHangout({
    hangout,
    message: msg
  });
  let newHangout = messageToNewHangout(msg);

  switch (msg.type) {
    case messagesFromServer.BLOCKER:
    case messagesFromServer.DECLINER:
    case messagesFromServer.MESSANGER:
    case messagesFromServer.UNBLOCKER:
    case messagesFromServer.ACCEPTER:
      dispatch({
        type: actionTypes.HANGOUT_CHANGED_ITS_STATE,
        hangout: updatedHangout
      });
      updateHangoutStateInLocalStorage(`${username}-hangouts`, updatedHangout);

    case messagesFromServer.INVITER:
      dispatch({
        type: actionTypes.HANGOUT_CHANGED_ITS_STATE,
        hangout: newHangout
      });
      addNewHangoutToLocalStorage(`${username}-hangouts`, updatedHangout);

    default:
      throw new Error('Message type for messagesFromServer is not defined');
  }
}

function updateHangoutStateInLocalStorage(key, hangout) {
  const hangouts = localStorage.getItem(key);
  const updated = hangouts.map(g => {
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

const Hangouts = L(() => import('./Hangout-b09aa07d.js'));
const Block = L(() => import('./Block-fc364212.js'));
const Blocked = L(() => import('./Blocked-4933d99b.js'));
const Configure = L(() => import('./Configure-3f300daf.js'));
const Hangchat = L(() => import('./Hangchat-504901da.js'));
const Invite = L(() => import('./Invite-017927ef.js'));
const Invitee = L(() => import('./Invitee-6cf357b8.js'));
const Inviter = L(() => import('./Inviter-2d0bc5f5.js'));
function Mobile() {
  const [route, setRoute] = useRouteContext();
  const sockethandler = useSocket();
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
    path: "/HANGCHAT"
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
    path: "/INVITEE"
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtOGU3MzJjODUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25UeXBlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9yZWR1Y2VyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL21lc3NhZ2VUeXBlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25zLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL0hhbmdvdXRzUHJvdmlkZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvdXNlSGFuZ291dHMuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvbWVzc2FnZUNvbnZlcnRlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS91c2VTb2NrZXQuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvbW9iaWxlLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBhY3Rpb25UeXBlcyA9IHtcclxuICAgIE1FU1NBR0VfVEVYVF9DSEFOR0VEOidNRVNTQUdFX1RFWFRfQ0hBTkdFRCcsXHJcbiAgICBMT0FEX0hBTkdPVVRTOiAnTE9BRF9IQU5HT1VUUycsXHJcbiAgICBMT0FEX01FU1NBR0VTOiAnTE9BRF9NRVNTQUdFUycsXHJcbiAgICBTRUFSQ0hFRF9IQU5HT1VUOiAnU0VBUkNIRURfSEFOR09VVCcsXHJcbiAgICBTRUxFQ1RFRF9IQU5HT1VUOiAnU0VMRUNURURfSEFOR09VVCcsXHJcbiAgICBTRUxFQ1RFRF9VU0VSOidTRUxFQ1RFRF9VU0VSJyxcclxuICAgIEZJTFRFUl9IQU5HT1VUUzonRklMVEVSX0hBTkdPVVRTJyxcclxuXHJcbiAgICBGRVRDSF9IQU5HT1VUX1NUQVJURUQ6ICdGRVRDSF9IQU5HT1VUX1NUQVJURUQnLFxyXG4gICAgRkVUQ0hfSEFOR09VVF9TVUNDRVNTOiAnRkVUQ0hfSEFOR09VVF9TVUNDRVNTJyxcclxuICAgIEZFVENIX0hBTkdPVVRfRkFJTEVEOiAnRkVUQ0hfSEFOR09VVF9GQUlMRUQnLFxyXG4gICAgRkVUQ0hfSEFOR09VVF9OT1RfRk9VTkQ6ICdGRVRDSF9IQU5HT1VUX05PVF9GT1VORCcsXHJcblxyXG5cclxuICAgIEZFVENIX1VTRVJfU1RBUlRFRDogJ0ZFVENIX1VTRVJfU1RBUlRFRCcsXHJcbiAgICBGRVRDSF9VU0VSX1NVQ0NFU1M6ICdGRVRDSF9VU0VSX1NVQ0NFU1MnLFxyXG4gICAgRkVUQ0hfVVNFUl9GQUlMRUQ6ICdGRVRDSF9VU0VSX0ZBSUxFRCcsXHJcblxyXG5cclxuICAgIE9OTElORV9TVEFURV9DSEFOR0VEOiAnT05MSU5FX1NUQVRFX0NIQU5HRUQnLFxyXG5cclxuXHJcbiAgICBPRkZFUl9TVEFSVEVEOiAnT0ZGRVJfU1RBUlRFRCcsXHJcbiAgICBPRkZFUl9TVUNDRVNTOiAnT0ZGRVJfU1VDQ0VTUycsXHJcbiAgICBPRkZFUl9GQUlMRUQ6ICdPRkZFUl9GQUlMRUQnLFxyXG5cclxuICAgIEFDQ0VQVF9TVEFSVEVEOiAnQUNDRVBUX1NUQVJURUQnLFxyXG4gICAgQUNDRVBUX1NVQ0NFU1M6ICdBQ0NFUFRfU1VDQ0VTUycsXHJcbiAgICBBQ0NFUFRfRkFJTEVEOiAnQUNDRVBUX0ZBSUxFRCcsXHJcblxyXG4gICAgQkxPQ0tfU1RBUlRFRDogJ0JMT0NLX1NUQVJURUQnLFxyXG4gICAgQkxPQ0tfU1VDQ0VTUzogJ0JMT0NLX1NVQ0NFU1MnLFxyXG4gICAgQkxPQ0tfRkFJTEVEOiAnQkxPQ0tfRkFJTEVEJyxcclxuXHJcbiAgICBVTkJMT0NLX1NUQVJURUQ6ICdVTkJMT0NLX1NUQVJURUQnLFxyXG4gICAgVU5CTE9DS19TVUNDRVNTOiAnVU5CTE9DS19TVUNDRVNTJyxcclxuICAgIFVOQkxPQ0tfRkFJTEVEOiAnVU5CTE9DS19GQUlMRUQnLFxyXG5cclxuICAgIE1FU1NBR0VfU1RBUlRFRDogJ01FU1NBR0VfU1RBUlRFRCcsXHJcbiAgICBNRVNTQUdFX1NVQ0NFU1M6ICdNRVNTQUdFX1NVQ0NFU1MnLFxyXG4gICAgTUVTU0FHRV9GQUlMRUQ6ICdNRVNTQUdFX0ZBSUxFRCcsXHJcblxyXG4gICAgREVDTElORV9TVEFSVEVEOidERUNMSU5FX1NUQVJURUQnLFxyXG4gICAgREVDTElORV9TVUNDRVNTOidERUNMSU5FX1NVQ0NFU1MnLFxyXG4gICAgREVDTElORV9GQUlMRUQ6J0RFQ0xJTkVfRkFJTEVEJyxcclxuXHJcbiAgICBIQU5HT1VUX0NIQU5HRURfSVRTX1NUQVRFOiAnSEFOR09VVF9DSEFOR0VEX0lUU19TVEFURScsXHJcbiAgICBPRkZFUkVSX1JFQ0lFVkVEOiAnT0ZGRVJFUl9SRUNJRVZFRCcsXHJcbiAgICBBQ0tOT1dMRURHRU1FTlRfUkVDSUVWRUQ6J0FDS05PV0xFREdFTUVOVF9SRUNJRVZFRCdcclxufSIsImltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi9hY3Rpb25UeXBlcyc7XHJcbmV4cG9ydCBjb25zdCBpbml0U3RhdGUgPSB7XHJcbiAgaGFuZ291dHM6IFtdLFxyXG4gIGhhbmdvdXQ6IG51bGwsXHJcblxyXG4gIG1lc3NhZ2VzOiBbXSxcclxuICBzZWFyY2g6ICcnLFxyXG4gIHVzZXI6IFtdLFxyXG4gIGxvYWRpbmc6IGZhbHNlLFxyXG4gIGVycm9yOiBudWxsLFxyXG4gIG1lc3NhZ2VUZXh0OiAnJyxcclxuICBvbmxpbmU6ZmFsc2VcclxufTtcclxuZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZXIoc3RhdGUsIGFjdGlvbikge1xyXG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuT0ZGRVJfU1RBUlRFRDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgIGxvYWRpbmc6dHJ1ZVxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5NRVNTQUdFX1RFWFRfQ0hBTkdFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIG1lc3NhZ2VUZXh0OiBhY3Rpb24udGV4dCB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9VU0VSX0ZBSUxFRDpcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9GQUlMRUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiBmYWxzZSwgZXJyb3I6IGFjdGlvbi5lcnJvciB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9VU0VSX1NUQVJURUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiB0cnVlIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX1VTRVJfU1VDQ0VTUzpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICBsb2FkaW5nOiBmYWxzZSxcclxuICAgICAgICB1c2VyczogYWN0aW9uLnVzZXJzLFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NUQVJURUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiB0cnVlIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfU1VDQ0VTUzpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBoYW5nb3V0czogYWN0aW9uLmhhbmdvdXRzIH07XHJcblxyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5IQU5HT1VUX05PVF9GT1VORDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZJTFRFUl9IQU5HT1VUUzpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICBoYW5nb3V0czogc3RhdGUuaGFuZ291dHMuZmlsdGVyKChnKSA9PlxyXG4gICAgICAgICAgZy51c2VybmFtZS5pbmNsdWRlcyhzdGF0ZS5zZWFyY2gpXHJcbiAgICAgICAgKSxcclxuICAgICAgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0VBUkNIRURfSEFOR09VVDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHNlYXJjaDogYWN0aW9uLnNlYXJjaCB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0FEX0hBTkdPVVRTOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgaGFuZ291dHM6IGFjdGlvbi5oYW5nb3V0cyB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TRUxFQ1RFRF9VU0VSOlxyXG4gICAgICBpZiAoc3RhdGUuaGFuZ291dHMpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgICBoYW5nb3V0czogWy4uLnN0YXRlLmhhbmdvdXRzLCBhY3Rpb24uaGFuZ291dF0sXHJcbiAgICAgICAgICBoYW5nb3V0OiBhY3Rpb24uaGFuZ291dCxcclxuICAgICAgICB9O1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgaGFuZ291dHM6IFthY3Rpb24uaGFuZ291dF0sXHJcbiAgICAgICAgaGFuZ291dDogYWN0aW9uLmhhbmdvdXQsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNFTEVDVEVEX0hBTkdPVVQ6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgaGFuZ291dDogc3RhdGUuaGFuZ291dHMuZmluZCgoZykgPT4gZy51c2VybmFtZSA9PT0gYWN0aW9uLnVzZXJuYW1lKSxcclxuICAgICAgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuSEFOR09VVF9DSEFOR0VEX0lUU19TVEFURTpcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuQUNLTk9XTEVER0VNRU5UX1JFQ0lFVkVEOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIGhhbmdvdXRzOiBzdGF0ZS5oYW5nb3V0cy5tYXAoKGcpID0+IHtcclxuICAgICAgICAgIGlmIChnLnVzZXJuYW1lID09PSBhY3Rpb24uaGFuZ291dC51c2VybmFtZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLmhhbmdvdXQ7XHJcbiAgICAgICAgICB9IGVsc2UgcmV0dXJuIGc7XHJcbiAgICAgICAgfSksXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLk9GRkVSRVJfUkVDSUVWRUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBoYW5nb3V0czogWy4uLnN0YXRlLmhhbmdvdXRzLCBhY3Rpb24uaGFuZ291dF0gfTtcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHJldHVybiBzdGF0ZTtcclxuICB9XHJcbn1cclxuIiwiZXhwb3J0IGNvbnN0IGFja25vd2xlZGdtZW50VHlwZXMgPSB7XHJcbiAgICBJTlZJVEVEOiAnSU5WSVRFRCcsXHJcbiAgICBBQ0NFUFRFRDogJ0FDQ0VQVEVEJyxcclxuICAgIEJMT0NLRUQ6ICdCTE9DS0VEJyxcclxuICAgIFVOQkxPQ0tFRDogJ1VOQkxPQ0tFRCcsXHJcbiAgICBERUNMSU5FRDogJ0RFQ0xJTkVEJyxcclxuICAgIE1FU1NBR0VEOiAnTUVTU0FHRUQnXHJcbn1cclxuXHJcblxyXG5leHBvcnQgY29uc3QgbWVzc2FnZXNGcm9tU2VydmVyID0ge1xyXG4gICAgQkxPQ0tFUjogJ0JMT0NLRVInLFxyXG4gICAgQUNDRVBURVI6ICdBQ0NFUFRFUicsXHJcbiAgICBVTkJMT0NLRVI6ICdVTkJMT0NLRVInLFxyXG4gICAgSU5WSVRFUjogJ0lOVklURVInLFxyXG4gICAgREVDTElORVI6ICdERUNMSU5FUicsXHJcbiAgICBNRVNTQU5HRVI6ICdNRVNTQU5HRVInXHJcblxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgbWVzc2FnZVRvU2VydmVyID0ge1xyXG4gICAgQUNDRVBUOiAnQUNDRVBUJyxcclxuICAgIERFQ0xJTkU6ICdERUNMSU5FJyxcclxuICAgIElOVklURTogJ0lOVklURScsXHJcbiAgICBCbE9DSzogJ0JsT0NLJyxcclxuICAgIFVOQkxPQ0s6ICdVTkJMT0NLJyxcclxuICAgIE1FU1NBR0U6ICdNRVNTQUdFJ1xyXG5cclxufVxyXG4vLyBzZXJ2ZXIgc2lkZSBtZXNzYWdlXHJcbmV4cG9ydCBjb25zdCBtZXNzYWdlQ2F0ZWdvcmllcz17XHJcbiAgICBBQ0tOT1dMRURHRU1FTlQ6J0FDS05PV0xFREdFTUVOVCcsXHJcbiAgICBQRUVSOidQRUVSJ1xyXG59IiwiaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuL2FjdGlvblR5cGVzJztcclxuaW1wb3J0IHsgbWVzc2FnZXNGcm9tU2VydmVyIH0gZnJvbSAnLi9tZXNzYWdlVHlwZXMnO1xyXG5cclxuLy9yZXRyaWV2ZXMgaGFuZ291dHMgZnJvbSBsb2NhbFN0b3JhZ2VcclxuZXhwb3J0IGZ1bmN0aW9uIGxvYWRIYW5nb3V0cyh7IHVzZXJuYW1lLCBkaXNwYXRjaCB9KSB7XHJcbiAgY29uc3QgaGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGAke3VzZXJuYW1lfS1oYW5nb3V0c2ApKTtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkxPQURfSEFOR09VVFMsIGhhbmdvdXRzIH0pO1xyXG59XHJcbi8vc2VsZWN0IGhhbmdvdXQgZnJvbSBMaXN0XHJcbmV4cG9ydCBmdW5jdGlvbiBzZWxlY3RIYW5nb3V0KHsgZGlzcGF0Y2gsIHVzZXJuYW1lIH0pIHtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFTEVDVEVEX0hBTkdPVVQsIHVzZXJuYW1lIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0VXNlcih7ZGlzcGF0Y2gsIHVzZXIsdXNlcm5hbWV9KXtcclxuICAvLyBzYXZlIHNlbGVjdGVkIHVzZXIgdG8gaGFuZ291dHNcclxuICBjb25zdCBoYW5nb3V0ID0gey4uLnVzZXIsIHN0YXRlOidJTlZJVEUnfVxyXG4gIGNvbnN0IGhhbmdvdXRzID1KU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGAke3VzZXJuYW1lfS1oYW5nb3V0c2ApKVxyXG4gXHJcbiAgaWYoaGFuZ291dHMpe1xyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oYCR7dXNlcm5hbWV9LWhhbmdvdXRzYCwgSlNPTi5zdHJpbmdpZnkoWy4uLmhhbmdvdXRzLGhhbmdvdXRdKSlcclxuICB9XHJcbiAgZWxzZXtcclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGAke3VzZXJuYW1lfS1oYW5nb3V0c2AsIEpTT04uc3RyaW5naWZ5KFtoYW5nb3V0XSkpXHJcbiAgfVxyXG5cclxuICBkaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5TRUxFQ1RFRF9VU0VSLGhhbmdvdXR9KVxyXG59XHJcbi8vc2VhcmNoIGZvciBoYW5nb3V0IGJ5IHR5cGluZyBpbnRvIFRleHRJbnB1dFxyXG5leHBvcnQgZnVuY3Rpb24gc2VhcmNoSGFuZ291dHMoeyBzZWFyY2gsIGRpc3BhdGNoIH0pIHtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFQVJDSEVEX0hBTkdPVVQsIHNlYXJjaCB9KTtcclxufVxyXG4vL2ZpbHRlciBoYW5nb3V0IGFmdGVyIHNlYXJjaCBzdGF0ZSBjaGFuZ2VcclxuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlckhhbmdvdXRzKHsgZGlzcGF0Y2ggfSkge1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRklMVEVSX0hBTkdPVVRTIH0pO1xyXG59XHJcblxyXG4vL2ZldGNoIGhhbmdvdXQgZnJvbSBzZXJ2ZXIgaWYgbm90IGZvdW5kIGluIGxvY2FsIGhhbmdvdXRzXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaEhhbmdvdXQoeyBzZWFyY2gsIGRpc3BhdGNoIH0pIHtcclxuICBcclxuICB0cnkge1xyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NUQVJURUQgfSk7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAvaGFuZ291dHMvZmluZD9zZWFyY2g9JHtzZWFyY2h9YCk7XHJcblxyXG4gICBpZihyZXNwb25zZS5vayl7XHJcbiAgICBjb25zdCB7IGhhbmdvdXRzIH0gPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcblxyXG4gICAgaWYgKGhhbmdvdXRzLmxlbmd0aCA+IDApIHtcclxuXHJcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9TVUNDRVNTLCBoYW5nb3V0cyB9KTtcclxuICAgIH0gIGVsc2V7XHJcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9OT1RfRk9VTkQgfSk7XHJcbiAgICAgIC8vIGZldGNoIHVzZXIgZnJvbSBzZXJ2ZXIgaW4gaGFuZ291dCBpcyBuZXd1c2VyXHJcbiAgICAgIGZldGNoVXNlcih7IHNlYXJjaCwgZGlzcGF0Y2ggfSk7XHJcbiAgICAgfVxyXG5cclxuICAgfVxyXG4gICBlbHNle1xyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX05PVF9GT1VORCB9KTtcclxuICAgIC8vIGZldGNoIHVzZXIgZnJvbSBzZXJ2ZXIgaW4gaGFuZ291dCBpcyBuZXd1c2VyXHJcbiAgICBmZXRjaFVzZXIoeyBzZWFyY2gsIGRpc3BhdGNoIH0pO1xyXG4gICB9XHJcblxyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcblxyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX0ZBSUxFRCwgZXJyb3IgfSk7XHJcbiAgfVxyXG59XHJcbiAgLy8gZmV0Y2ggdXNlciBmcm9tIHNlcnZlciBpbiBoYW5nb3V0IGlzIG5ld3VzZXJcclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoVXNlcih7IHNlYXJjaCwgZGlzcGF0Y2ggfSkge1xyXG5cclxuICB0cnkge1xyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9VU0VSX1NUQVJURUQgfSk7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAvdXNlcnMvZmluZD9zZWFyY2g9JHtzZWFyY2h9YCk7XHJcbiAgICBjb25zdCB7IHVzZXJzIH0gPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcblxyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9VU0VSX1NVQ0NFU1MsIHVzZXJzIH0pO1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX1VTRVJfRkFJTEVELCBlcnJvciB9KTtcclxuICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjaGFuZ2VNZXNzYWdlVGV4dCh7dGV4dCxkaXNwYXRjaH0pe1xyXG5kaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5NRVNTQUdFX1RFWFRfQ0hBTkdFRCx0ZXh0fSlcclxuXHJcbn1cclxuXHJcblxyXG4iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHtcclxuICB1c2VDb250ZXh0LFxyXG4gIHVzZVN0YXRlLFxyXG4gIHVzZU1lbW8sXHJcbiAgdXNlUmVkdWNlcixcclxuICB1c2VFZmZlY3QsXHJcbn0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgcmVkdWNlciwgaW5pdFN0YXRlIH0gZnJvbSAnLi9yZWR1Y2VyJztcclxuaW1wb3J0IHsgbG9hZEhhbmdvdXRzLCBmaWx0ZXJIYW5nb3V0cyxmZXRjaEhhbmdvdXQgfSBmcm9tICcuL2FjdGlvbnMnO1xyXG5pbXBvcnQgeyB1c2VBdXRoQ29udGV4dCB9IGZyb20gJy4uLy4uL2F1dGgvYXV0aC1jb250ZXh0JztcclxuY29uc3QgSGFuZ291dENvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VIYW5nb3V0Q29udGV4dCgpIHtcclxuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChIYW5nb3V0Q29udGV4dCk7XHJcbiAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZUhhbmdvdXRDb250ZXh0IG11c3QgYmUgdXNlZCB3aXRoIEhhbmdvdXRzUHJvdmlkZXInKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBjb250ZXh0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gSGFuZ291dHNQcm92aWRlcihwcm9wcykge1xyXG4gIGNvbnN0IGF1dGhDb250ZXh0ID0gdXNlQXV0aENvbnRleHQoKTtcclxuICBjb25zdCB7IHVzZXJuYW1lIH0gPSBhdXRoQ29udGV4dC5zdGF0ZTtcclxuICBjb25zdCBbc3RhdGUsIGRpc3BhdGNoXSA9IHVzZVJlZHVjZXIocmVkdWNlciwgaW5pdFN0YXRlKTtcclxuICBjb25zdCB7IGhhbmdvdXQgfSA9IHN0YXRlO1xyXG5cclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmICh1c2VybmFtZSkge1xyXG4gICAgICBsb2FkSGFuZ291dHMoeyB1c2VybmFtZSwgZGlzcGF0Y2ggfSk7XHJcbiAgICB9XHJcbiAgfSwgW3VzZXJuYW1lXSk7XHJcblxyXG5cclxuXHJcbiAgY29uc3QgdmFsdWUgPSB1c2VNZW1vKCgpID0+IFtzdGF0ZSwgZGlzcGF0Y2hdLCBbc3RhdGVdKTtcclxuICByZXR1cm4gPEhhbmdvdXRDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt2YWx1ZX0gey4uLnByb3BzfSAvPjtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7IHVzZUhhbmdvdXRDb250ZXh0IH0gZnJvbSAnLi9IYW5nb3V0c1Byb3ZpZGVyJztcclxuaW1wb3J0IHsgdXNlQXV0aENvbnRleHQgfSBmcm9tICcuLi8uLi9hdXRoL2F1dGgtY29udGV4dCc7XHJcbmltcG9ydCB7dXNlV1NvY2tldENvbnRleHR9IGZyb20gJy4uLy4uL3dzb2NrZXQvV1NvY2tldFByb3ZpZGVyJ1xyXG5pbXBvcnQge1xyXG4gIHNlbGVjdEhhbmdvdXQsXHJcbiAgc2VhcmNoSGFuZ291dHMsXHJcbiAgZmlsdGVySGFuZ291dHMsXHJcbiAgZmV0Y2hIYW5nb3V0LFxyXG4gIHNlbGVjdFVzZXIsXHJcbiAgY2hhbmdlTWVzc2FnZVRleHQsXHJcbn0gZnJvbSAnLi9hY3Rpb25zJztcclxuaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuL2FjdGlvblR5cGVzJztcclxuaW1wb3J0IHsgbWVzc2FnZVRvU2VydmVyLCBtZXNzYWdlQ2F0ZWdvcmllcyB9IGZyb20gJy4vbWVzc2FnZVR5cGVzJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VIYW5nb3V0cygpIHtcclxuICBjb25zdCBzb2NrZXRDb250ZXh0ID11c2VXU29ja2V0Q29udGV4dCgpXHJcbiAgY29uc3Qge3NvY2tldH09c29ja2V0Q29udGV4dFxyXG4gIGNvbnN0IGF1dGhDb250ZXh0ID0gdXNlQXV0aENvbnRleHQoKTtcclxuICBjb25zdCB7IHVzZXJuYW1lIH0gPSBhdXRoQ29udGV4dC5zdGF0ZTtcclxuICBjb25zdCBbc3RhdGUsIGRpc3BhdGNoXSA9IHVzZUhhbmdvdXRDb250ZXh0KCk7XHJcblxyXG4gIGNvbnN0IHsgaGFuZ291dCwgaGFuZ291dHMsIHNlYXJjaCwgdXNlcnMsIG1lc3NhZ2VUZXh0IH0gPSBzdGF0ZTtcclxuXHJcbiAgZnVuY3Rpb24gb25TZWxlY3RIYW5nb3V0KGUpIHtcclxuICAgIGNvbnN0IHVzZXJuYW1lID0gZS50YXJnZXQuaWQ7XHJcbiAgICBkZWJ1Z2dlcjtcclxuICAgIHNlbGVjdEhhbmdvdXQoeyBkaXNwYXRjaCwgdXNlcm5hbWUgfSk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIG9uU2VsZWN0VXNlcihlKSB7XHJcbiAgICBjb25zdCB1bmFtZSA9IGUudGFyZ2V0LmlkO1xyXG4gICAgY29uc3QgdXNlciA9IHVzZXJzLmZpbmQoKHUpID0+IHUudXNlcm5hbWUgPT09IHVuYW1lKTtcclxuICAgIHNlbGVjdFVzZXIoeyBkaXNwYXRjaCwgdXNlciwgdXNlcm5hbWUgfSk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIG9uSW52aXRlKCkge1xyXG4gICAgY29uc3Qge3VzZXJuYW1lLGVtYWlsfT1oYW5nb3V0XHJcbiAgICBjb25zdCB1cGRhdGVkSGFuZ291dCA9IHt1c2VybmFtZSxlbWFpbCxcclxuICAgICAgbWVzc2FnZTogeyB0ZXh0OiBtZXNzYWdlVGV4dCwgdGltZXN0YW1wOiAgRGF0ZS5ub3coKSB9LFxyXG4gICAgfTtcclxuICAgIGRlYnVnZ2VyO1xyXG4gICAgc29ja2V0LnNlbmQoXHJcbiAgICAgIEpTT04uc3RyaW5naWZ5KHsgLi4udXBkYXRlZEhhbmdvdXQsIHR5cGU6IG1lc3NhZ2VUb1NlcnZlci5JTlZJVEUgfSlcclxuICAgICk7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLk9GRkVSX1NUQVJURUQgfSk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIG9uQWNjZXB0KCkge1xyXG4gICAgc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoeyAuLi5oYW5nb3V0LCB0eXBlOiBtZXNzYWdlVG9TZXJ2ZXIuQUNDRVBUIH0pKTtcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQUNDRVBUX1NUQVJURUQsIGhhbmdvdXQgfSk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIG9uQmxvY2soKSB7XHJcbiAgICBzb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7IC4uLmhhbmdvdXQsIHR5cGU6IG1lc3NhZ2VUb1NlcnZlci5CbE9DSyB9KSk7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkJMT0NLX1NUQVJURUQsIGhhbmdvdXQgfSk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIG9uVW5ibG9jaygpIHtcclxuICAgIHNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHsgLi4uaGFuZ291dCwgdHlwZTogbWVzc2FnZVRvU2VydmVyLlVOQkxPQ0sgfSkpO1xyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5VTkJMT0NLX1NUQVJURUQsIGhhbmdvdXQgfSk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIG9uRGVjbGluZSgpIHtcclxuICAgIHNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHsgLi4uaGFuZ291dCwgdHlwZTogbWVzc2FnZVRvU2VydmVyLkRFQ0xJTkUgfSkpO1xyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5ERUNMSU5FX1NUQVJURUQsIGhhbmdvdXQgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBvbk1lc3NhZ2UoKSB7XHJcbiAgICBzb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7IC4uLmhhbmdvdXQsIHR5cGU6IG1lc3NhZ2VUb1NlcnZlci5NRVNTQUdFIH0pKTtcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTUVTU0FHRV9TVEFSVEVELCBoYW5nb3V0IH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gb25TZWFyY2goZSkge1xyXG4gICAgc2VhcmNoSGFuZ291dHMoeyBzZWFyY2g6IGUudGFyZ2V0LnZhbHVlLCBkaXNwYXRjaCB9KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIG9uU3RhcnRTZWFyY2goZSkge1xyXG4gICAgaWYgKGhhbmdvdXRzICYmIGhhbmdvdXRzLmxlbmd0aCA+IDApIHtcclxuICAgICAgZmlsdGVySGFuZ291dHMoeyBkaXNwYXRjaCB9KTtcclxuICAgIH1cclxuICAgIGZldGNoSGFuZ291dCh7IGRpc3BhdGNoLCBzZWFyY2ggfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBvbk1lc3NhZ2VUZXh0KGUpIHtcclxuICAgIGNoYW5nZU1lc3NhZ2VUZXh0KHsgZGlzcGF0Y2gsIHRleHQ6IGUudGFyZ2V0LnZhbHVlIH0pO1xyXG4gIH1cclxuICByZXR1cm4ge1xyXG4gICAgb25NZXNzYWdlVGV4dCxcclxuICAgIG1lc3NhZ2VUZXh0LFxyXG4gICAgb25TdGFydFNlYXJjaCxcclxuICAgIG9uU2VhcmNoLFxyXG4gICAgc2VhcmNoLFxyXG4gICAgb25NZXNzYWdlLFxyXG4gICAgb25JbnZpdGUsXHJcbiAgICBvbkFjY2VwdCxcclxuICAgIG9uQmxvY2ssXHJcbiAgICBvblVuYmxvY2ssXHJcbiAgICBvblNlbGVjdEhhbmdvdXQsXHJcbiAgICBvblNlbGVjdFVzZXIsXHJcbiAgICBvbkRlY2xpbmUsXHJcbiAgICBoYW5nb3V0LFxyXG4gICAgaGFuZ291dHMsXHJcbiAgICB1c2VycyxcclxuICB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVMb2NhbEhhbmdvdXQoeyBoYW5nb3V0LCB1c2VybmFtZSB9KSB7XHJcbiAgY29uc3QgbG9jYWxIYW5nb3V0cyA9IEpTT04ucGFyc2UoXHJcbiAgICBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShgJHt1c2VybmFtZX0taGFuZ291dHNgKVxyXG4gICk7XHJcbiAgY29uc3QgdXBkYXRlZEhhbmdvdXRzID0gbG9jYWxIYW5nb3V0cy5tYXAoKGxoKSA9PiB7XHJcbiAgICBpZiAobGgudXNlcm5hbWUgPT09IGhhbmdvdXQudXNlcm5hbWUpIHtcclxuICAgICAgcmV0dXJuIGhhbmdvdXQ7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gbGg7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn1cclxuIiwiZXhwb3J0IGZ1bmN0aW9uIGhhbmdvdXRUb01lc3NhZ2UoeyBoYW5nb3V0LCB0eXBlIH0pIHtcclxuIFxyXG4gICAgcmV0dXJueyB1c2VybmFtZTogaGFuZ291dC51c2VybmFtZSwgdHlwZSwgbWVzc2FnZTogaGFuZ291dC5tZXNzYWdlIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG1lc3NhZ2VUb0hhbmdvdXQoeyBtZXNzYWdlLCBoYW5nb3V0IH0pIHtcclxuICBcclxuICAgIHJldHVybiB7IC4uLmhhbmdvdXQsIHN0YXRlOiBtZXNzYWdlLnR5cGUsIG1lc3NhZ2U6IG1lc3NhZ2UgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWVzc2FnZVRvTmV3SGFuZ291dChtc2cpIHtcclxuICAgIGNvbnN0IHsgdXNlcm5hbWUsIGVtYWlsLCB0eXBlLCBtZXNzYWdlIH0gPSBtc2dcclxuICAgIGNvbnN0IGhhbmdvdXQgPSB7IHVzZXJuYW1lLCBzdGF0ZTogdHlwZSwgZW1haWwsIG1lc3NhZ2UgfVxyXG4gICAgcmV0dXJuIGhhbmdvdXRcclxufSIsImltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi9hY3Rpb25UeXBlcyc7XHJcbmltcG9ydCB7IG1lc3NhZ2VUb0hhbmdvdXQsIG1lc3NhZ2VUb05ld0hhbmdvdXQgfSBmcm9tICcuL21lc3NhZ2VDb252ZXJ0ZXInO1xyXG5pbXBvcnQgeyB1c2VIYW5nb3V0Q29udGV4dCB9IGZyb20gJy4vSGFuZ291dHNQcm92aWRlcic7XHJcbmltcG9ydCB7IG1lc3NhZ2VzRnJvbVNlcnZlciwgbWVzc2FnZUNhdGVnb3JpZXMgfSBmcm9tICcuL21lc3NhZ2VUeXBlcyc7XHJcbmltcG9ydCB7IHVzZVdTb2NrZXRDb250ZXh0IH0gZnJvbSAnLi4vLi4vd3NvY2tldC9XU29ja2V0UHJvdmlkZXInO1xyXG5leHBvcnQgZnVuY3Rpb24gdXNlU29ja2V0KCkge1xyXG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlSGFuZ291dENvbnRleHQoKTtcclxuICBjb25zdCB7aGFuZ291dH09c3RhdGVcclxuICBjb25zdCBzb2NrZXRDb250ZXh0ID0gdXNlV1NvY2tldENvbnRleHQoKTtcclxuY29uc3Qge3NvY2tldH09c29ja2V0Q29udGV4dFxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAoc29ja2V0KSB7XHJcbiAgICAgIHNvY2tldC5vbm1lc3NhZ2UgPSAobWVzc2FnZSkgPT4ge1xyXG4gICAgICAgIGRlYnVnZ2VyXHJcbiAgICAgICAgY29uc3QgbXNnID0gSlNPTi5wYXJzZShtZXNzYWdlLmRhdGEpO1xyXG4gICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgIHN3aXRjaCAobXNnLmNhdGVnb3J5KSB7XHJcbiAgICAgICAgICBjYXNlIG1lc3NhZ2VDYXRlZ29yaWVzLkFDS05PV0xFREdFTUVOVDpcclxuICAgICAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgICAgIGhhbmRsZUFja2hvd2xlZGdlbWVudHMoeyBkaXNwYXRjaCwgbXNnLCBoYW5nb3V0IH0pO1xyXG4gICAgICAgICAgY2FzZSBtZXNzYWdlQ2F0ZWdvcmllcy5QRUVSOlxyXG4gICAgICAgICAgICBoYW5kbGVQZWVyTWVzc2FnZXMoeyBkaXNwYXRjaCwgbXNnLCBoYW5nb3V0IH0pO1xyXG4gICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNZXNzYWdlIGNhdGVvcnkgaXMgbm90IGRlZmluZWQnKTtcclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcbiAgICAgIHNvY2tldC5vbmNsb3NlID0gKCkgPT4ge1xyXG4gICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICB9O1xyXG4gICAgICBzb2NrZXQub25lcnJvciA9IChlcnJvcikgPT4ge1xyXG4gICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICB9O1xyXG4gICAgICBzb2NrZXQub25vcGVuID0gKCkgPT4ge1xyXG4gICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gIH0sIFtzb2NrZXRdKTtcclxuXHJcbiAgcmV0dXJuIG51bGw7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhhbmRsZUFja2hvd2xlZGdlbWVudHMoeyBkaXNwYXRjaCwgbXNnLCBoYW5nb3V0IH0pIHtcclxuICBkZWJ1Z2dlcjtcclxuICBsZXQgdXBkYXRlZEhhbmdvdXQgPSBtZXNzYWdlVG9IYW5nb3V0KHsgaGFuZ291dCwgbWVzc2FnZTogbXNnIH0pO1xyXG4gIGRpc3BhdGNoKHtcclxuICAgIHR5cGU6IGFjdGlvblR5cGVzLkFDS05PV0xFREdFTUVOVF9SRUNJRVZFRCxcclxuICAgIGhhbmdvdXQ6IHVwZGF0ZWRIYW5nb3V0LFxyXG4gIH0pO1xyXG4gIHVwZGF0ZUhhbmdvdXRTdGF0ZUluTG9jYWxTdG9yYWdlKGAke3VzZXJuYW1lfS1oYW5nb3V0c2AsIHVwZGF0ZWRIYW5nb3V0KTtcclxufVxyXG5cclxuZnVuY3Rpb24gaGFuZGxlUGVlck1lc3NhZ2VzKHsgZGlzcGF0Y2gsIG1zZywgaGFuZ291dCB9KSB7XHJcbiAgbGV0IHVwZGF0ZWRIYW5nb3V0ID0gbWVzc2FnZVRvSGFuZ291dCh7IGhhbmdvdXQsIG1lc3NhZ2U6IG1zZyB9KTtcclxuICBsZXQgbmV3SGFuZ291dCA9IG1lc3NhZ2VUb05ld0hhbmdvdXQobXNnKTtcclxuICBzd2l0Y2ggKG1zZy50eXBlKSB7XHJcbiAgICBjYXNlIG1lc3NhZ2VzRnJvbVNlcnZlci5CTE9DS0VSOlxyXG4gICAgY2FzZSBtZXNzYWdlc0Zyb21TZXJ2ZXIuREVDTElORVI6XHJcbiAgICBjYXNlIG1lc3NhZ2VzRnJvbVNlcnZlci5NRVNTQU5HRVI6XHJcbiAgICBjYXNlIG1lc3NhZ2VzRnJvbVNlcnZlci5VTkJMT0NLRVI6XHJcbiAgICBjYXNlIG1lc3NhZ2VzRnJvbVNlcnZlci5BQ0NFUFRFUjpcclxuICAgICAgZGlzcGF0Y2goe1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLkhBTkdPVVRfQ0hBTkdFRF9JVFNfU1RBVEUsXHJcbiAgICAgICAgaGFuZ291dDogdXBkYXRlZEhhbmdvdXQsXHJcbiAgICAgIH0pO1xyXG4gICAgICB1cGRhdGVIYW5nb3V0U3RhdGVJbkxvY2FsU3RvcmFnZShgJHt1c2VybmFtZX0taGFuZ291dHNgLCB1cGRhdGVkSGFuZ291dCk7XHJcbiAgICBjYXNlIG1lc3NhZ2VzRnJvbVNlcnZlci5JTlZJVEVSOlxyXG4gICAgICBkaXNwYXRjaCh7XHJcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuSEFOR09VVF9DSEFOR0VEX0lUU19TVEFURSxcclxuICAgICAgICBoYW5nb3V0OiBuZXdIYW5nb3V0LFxyXG4gICAgICB9KTtcclxuICAgICAgYWRkTmV3SGFuZ291dFRvTG9jYWxTdG9yYWdlKGAke3VzZXJuYW1lfS1oYW5nb3V0c2AsIHVwZGF0ZWRIYW5nb3V0KTtcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignTWVzc2FnZSB0eXBlIGZvciBtZXNzYWdlc0Zyb21TZXJ2ZXIgaXMgbm90IGRlZmluZWQnKTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZUhhbmdvdXRTdGF0ZUluTG9jYWxTdG9yYWdlKGtleSwgaGFuZ291dCkge1xyXG4gIGNvbnN0IGhhbmdvdXRzID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KTtcclxuICBjb25zdCB1cGRhdGVkID0gaGFuZ291dHMubWFwKChnKSA9PiB7XHJcbiAgICBpZiAoZy51c2VybmFtZSA9PT0gaGFuZ291dC51c2VybmFtZSkge1xyXG4gICAgICByZXR1cm4gaGFuZ291dDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBnO1xyXG4gICAgfVxyXG4gIH0pO1xyXG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkodXBkYXRlZCkpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBhZGROZXdIYW5nb3V0VG9Mb2NhbFN0b3JhZ2Uoa2V5LCBoYW5nb3V0KSB7XHJcbiAgY29uc3QgaGFuZ291dHMgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpO1xyXG4gIGNvbnN0IGluc2VydGVkID0gaGFuZ291dHMucHVzaChoYW5nb3V0KTtcclxuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KGluc2VydGVkKSk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7IGxhenksIFN1c3BlbnNlIH0gZnJvbSAncHJlYWN0L2NvbXBhdCc7XHJcbmltcG9ydCB7IFJvdXRlLCB1c2VSb3V0ZUNvbnRleHQgfSBmcm9tICcuLi9yb3V0ZS9yb3V0ZXInO1xyXG5pbXBvcnQgeyB1c2VIYW5nb3V0cyB9IGZyb20gJy4vc3RhdGUvdXNlSGFuZ291dHMnO1xyXG5pbXBvcnQge3VzZVNvY2tldH0gZnJvbSAnLi9zdGF0ZS91c2VTb2NrZXQnXHJcbmNvbnN0IEhhbmdvdXRzID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vSGFuZ291dCcpKTtcclxuY29uc3QgQmxvY2sgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9zdGF0ZS11aS9CbG9jaycpKTtcclxuY29uc3QgQmxvY2tlZCA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL3N0YXRlLXVpL0Jsb2NrZWQnKSk7XHJcbmNvbnN0IENvbmZpZ3VyZSA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL3N0YXRlLXVpL0NvbmZpZ3VyZScpKTtcclxuY29uc3QgSGFuZ2NoYXQgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9zdGF0ZS11aS9IYW5nY2hhdCcpKTtcclxuY29uc3QgSW52aXRlID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vc3RhdGUtdWkvSW52aXRlJykpO1xyXG5jb25zdCBJbnZpdGVlID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vc3RhdGUtdWkvSW52aXRlZScpKTtcclxuY29uc3QgSW52aXRlciA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL3N0YXRlLXVpL0ludml0ZXInKSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBNb2JpbGUoKSB7XHJcbiAgY29uc3QgW3JvdXRlLCBzZXRSb3V0ZV0gPSB1c2VSb3V0ZUNvbnRleHQoKTtcclxuICBjb25zdCBzb2NrZXRoYW5kbGVyID11c2VTb2NrZXQoKVxyXG4gIGNvbnN0IHtcclxuICAgIGhhbmdvdXQsXHJcbiAgICBoYW5nb3V0cyxcclxuICAgIG9uQWNjZXB0LFxyXG4gICAgb25CbG9jayxcclxuICAgIG9uSW52aXRlLFxyXG4gICAgb25TZWxlY3RIYW5nb3V0LFxyXG4gICAgb25TZWxlY3RVc2VyLFxyXG4gICAgb25VbmJsb2NrLFxyXG4gICAgb25TZWFyY2gsXHJcbiAgICB1c2VycyxcclxuICAgIHNlYXJjaCxcclxuICAgIG9uU3RhcnRTZWFyY2gsXHJcbiAgICBvbk1lc3NhZ2VUZXh0LFxyXG4gICAgbWVzc2FnZVRleHRcclxuICB9ID0gdXNlSGFuZ291dHMoKTtcclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKGhhbmdvdXQpIHtcclxuICAgICAgXHJcbiAgICAgIHNldFJvdXRlKGAvJHtoYW5nb3V0LnN0YXRlfWApO1xyXG4gICAgfVxyXG4gIH0sIFtoYW5nb3V0XSk7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3sgaGVpZ2h0OiAnODV2aCcgfX0+XHJcbiAgICAgIDxSb3V0ZSBwYXRoPVwiL2hhbmdvdXRzXCI+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPEhhbmdvdXRzXHJcbiAgICAgICAgICAgIHVzZXJzPXt1c2Vyc31cclxuICAgICAgICAgICAgc2VhcmNoPXtzZWFyY2h9XHJcbiAgICAgICAgICAgIGhhbmdvdXRzPXtoYW5nb3V0c31cclxuICAgICAgICAgICAgb25TZWxlY3RIYW5nb3V0PXtvblNlbGVjdEhhbmdvdXR9XHJcbiAgICAgICAgICAgIG9uU2VsZWN0VXNlcj17b25TZWxlY3RVc2VyfVxyXG4gICAgICAgICAgICBvblNlYXJjaD17b25TZWFyY2h9XHJcbiAgICAgICAgICAgIG9uU3RhcnRTZWFyY2g9e29uU3RhcnRTZWFyY2h9XHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgIDwvUm91dGU+XHJcbiAgICAgIDxSb3V0ZSBwYXRoPVwiL0JMT0NLXCI+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPEJsb2NrIGhhbmdvdXQ9e2hhbmdvdXR9IG9uQmxvY2s9e29uQmxvY2t9IC8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9Sb3V0ZT5cclxuICAgICAgPFJvdXRlIHBhdGg9XCIvQkxPQ0tFRFwiPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxCbG9ja2VkIGhhbmdvdXQ9e2hhbmdvdXR9IG9uVW5ibG9jaz17b25VbmJsb2NrfSAvPlxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgIDwvUm91dGU+XHJcbiAgICAgIDxSb3V0ZSBwYXRoPVwiL2NvbmZpZ3VyZVwiPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxDb25maWd1cmUgaGFuZ291dD17aGFuZ291dH0gLz5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICA8L1JvdXRlPlxyXG4gICAgICA8Um91dGUgcGF0aD1cIi9IQU5HQ0hBVFwiPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxIYW5nY2hhdCAvPlxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgIDwvUm91dGU+XHJcbiAgICAgIDxSb3V0ZSBwYXRoPVwiL0lOVklURVwiPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxJbnZpdGUgaGFuZ291dD17aGFuZ291dH0gb25JbnZpdGU9e29uSW52aXRlfSBvbk1lc3NhZ2VUZXh0PXtvbk1lc3NhZ2VUZXh0fSBtZXNzYWdlVGV4dD17bWVzc2FnZVRleHR9Lz5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICA8L1JvdXRlPlxyXG4gICAgICA8Um91dGUgcGF0aD1cIi9JTlZJVEVFXCI+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPEludml0ZWUgaGFuZ291dD17aGFuZ291dH0gLz5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICA8L1JvdXRlPlxyXG4gICAgICA8Um91dGUgcGF0aD1cIi9JTlZJVEVSXCI+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPEludml0ZXIgaGFuZ291dD17aGFuZ291dH0gb25BY2NlcHQ9e29uQWNjZXB0fSAvPlxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgIDwvUm91dGU+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgTW9iaWxlIGZyb20gJy4vbW9iaWxlJztcclxuaW1wb3J0IHsgSGFuZ291dHNQcm92aWRlciB9IGZyb20gJy4vc3RhdGUvSGFuZ291dHNQcm92aWRlcic7XHJcbmltcG9ydCB7IFJvdXRlUHJvdmlkZXIsIHVzZVJvdXRlQ29udGV4dCB9IGZyb20gJy4uL3JvdXRlL3JvdXRlcic7XHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gKFxyXG4gICAgPEhhbmdvdXRzUHJvdmlkZXI+XHJcbiAgICAgIDxSb3V0ZVByb3ZpZGVyIGluaXRpYWxSb3V0ZT1cIi9oYW5nb3V0c1wiPlxyXG4gICAgICAgIDxNb2JpbGUgLz5cclxuICAgICAgPC9Sb3V0ZVByb3ZpZGVyPlxyXG4gICAgPC9IYW5nb3V0c1Byb3ZpZGVyPlxyXG4gICk7XHJcbn1cclxuIl0sIm5hbWVzIjpbImFjdGlvblR5cGVzIiwiTUVTU0FHRV9URVhUX0NIQU5HRUQiLCJMT0FEX0hBTkdPVVRTIiwiTE9BRF9NRVNTQUdFUyIsIlNFQVJDSEVEX0hBTkdPVVQiLCJTRUxFQ1RFRF9IQU5HT1VUIiwiU0VMRUNURURfVVNFUiIsIkZJTFRFUl9IQU5HT1VUUyIsIkZFVENIX0hBTkdPVVRfU1RBUlRFRCIsIkZFVENIX0hBTkdPVVRfU1VDQ0VTUyIsIkZFVENIX0hBTkdPVVRfRkFJTEVEIiwiRkVUQ0hfSEFOR09VVF9OT1RfRk9VTkQiLCJGRVRDSF9VU0VSX1NUQVJURUQiLCJGRVRDSF9VU0VSX1NVQ0NFU1MiLCJGRVRDSF9VU0VSX0ZBSUxFRCIsIk9OTElORV9TVEFURV9DSEFOR0VEIiwiT0ZGRVJfU1RBUlRFRCIsIk9GRkVSX1NVQ0NFU1MiLCJPRkZFUl9GQUlMRUQiLCJBQ0NFUFRfU1RBUlRFRCIsIkFDQ0VQVF9TVUNDRVNTIiwiQUNDRVBUX0ZBSUxFRCIsIkJMT0NLX1NUQVJURUQiLCJCTE9DS19TVUNDRVNTIiwiQkxPQ0tfRkFJTEVEIiwiVU5CTE9DS19TVEFSVEVEIiwiVU5CTE9DS19TVUNDRVNTIiwiVU5CTE9DS19GQUlMRUQiLCJNRVNTQUdFX1NUQVJURUQiLCJNRVNTQUdFX1NVQ0NFU1MiLCJNRVNTQUdFX0ZBSUxFRCIsIkRFQ0xJTkVfU1RBUlRFRCIsIkRFQ0xJTkVfU1VDQ0VTUyIsIkRFQ0xJTkVfRkFJTEVEIiwiSEFOR09VVF9DSEFOR0VEX0lUU19TVEFURSIsIk9GRkVSRVJfUkVDSUVWRUQiLCJBQ0tOT1dMRURHRU1FTlRfUkVDSUVWRUQiLCJpbml0U3RhdGUiLCJoYW5nb3V0cyIsImhhbmdvdXQiLCJtZXNzYWdlcyIsInNlYXJjaCIsInVzZXIiLCJsb2FkaW5nIiwiZXJyb3IiLCJtZXNzYWdlVGV4dCIsIm9ubGluZSIsInJlZHVjZXIiLCJzdGF0ZSIsImFjdGlvbiIsInR5cGUiLCJ0ZXh0IiwidXNlcnMiLCJIQU5HT1VUX05PVF9GT1VORCIsImZpbHRlciIsImciLCJ1c2VybmFtZSIsImluY2x1ZGVzIiwiZmluZCIsIm1hcCIsIm1lc3NhZ2VzRnJvbVNlcnZlciIsIkJMT0NLRVIiLCJBQ0NFUFRFUiIsIlVOQkxPQ0tFUiIsIklOVklURVIiLCJERUNMSU5FUiIsIk1FU1NBTkdFUiIsIm1lc3NhZ2VUb1NlcnZlciIsIkFDQ0VQVCIsIkRFQ0xJTkUiLCJJTlZJVEUiLCJCbE9DSyIsIlVOQkxPQ0siLCJNRVNTQUdFIiwibWVzc2FnZUNhdGVnb3JpZXMiLCJBQ0tOT1dMRURHRU1FTlQiLCJQRUVSIiwibG9hZEhhbmdvdXRzIiwiZGlzcGF0Y2giLCJKU09OIiwicGFyc2UiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwic2VsZWN0SGFuZ291dCIsInNlbGVjdFVzZXIiLCJzZXRJdGVtIiwic3RyaW5naWZ5Iiwic2VhcmNoSGFuZ291dHMiLCJmaWx0ZXJIYW5nb3V0cyIsImZldGNoSGFuZ291dCIsInJlc3BvbnNlIiwiZmV0Y2giLCJvayIsImpzb24iLCJsZW5ndGgiLCJmZXRjaFVzZXIiLCJjaGFuZ2VNZXNzYWdlVGV4dCIsIkhhbmdvdXRDb250ZXh0IiwiY3JlYXRlQ29udGV4dCIsInVzZUhhbmdvdXRDb250ZXh0IiwiY29udGV4dCIsInVzZUNvbnRleHQiLCJFcnJvciIsIkhhbmdvdXRzUHJvdmlkZXIiLCJwcm9wcyIsImF1dGhDb250ZXh0IiwidXNlQXV0aENvbnRleHQiLCJ1c2VSZWR1Y2VyIiwidXNlRWZmZWN0IiwidmFsdWUiLCJ1c2VNZW1vIiwidXNlSGFuZ291dHMiLCJzb2NrZXRDb250ZXh0IiwidXNlV1NvY2tldENvbnRleHQiLCJzb2NrZXQiLCJvblNlbGVjdEhhbmdvdXQiLCJlIiwidGFyZ2V0IiwiaWQiLCJvblNlbGVjdFVzZXIiLCJ1bmFtZSIsInUiLCJvbkludml0ZSIsImVtYWlsIiwidXBkYXRlZEhhbmdvdXQiLCJtZXNzYWdlIiwidGltZXN0YW1wIiwiRGF0ZSIsIm5vdyIsInNlbmQiLCJvbkFjY2VwdCIsIm9uQmxvY2siLCJvblVuYmxvY2siLCJvbkRlY2xpbmUiLCJvbk1lc3NhZ2UiLCJvblNlYXJjaCIsIm9uU3RhcnRTZWFyY2giLCJvbk1lc3NhZ2VUZXh0IiwibWVzc2FnZVRvSGFuZ291dCIsIm1lc3NhZ2VUb05ld0hhbmdvdXQiLCJtc2ciLCJ1c2VTb2NrZXQiLCJvbm1lc3NhZ2UiLCJkYXRhIiwiY2F0ZWdvcnkiLCJoYW5kbGVBY2tob3dsZWRnZW1lbnRzIiwiaGFuZGxlUGVlck1lc3NhZ2VzIiwib25jbG9zZSIsIm9uZXJyb3IiLCJvbm9wZW4iLCJ1cGRhdGVIYW5nb3V0U3RhdGVJbkxvY2FsU3RvcmFnZSIsIm5ld0hhbmdvdXQiLCJhZGROZXdIYW5nb3V0VG9Mb2NhbFN0b3JhZ2UiLCJrZXkiLCJ1cGRhdGVkIiwiaW5zZXJ0ZWQiLCJwdXNoIiwiSGFuZ291dHMiLCJsYXp5IiwiQmxvY2siLCJCbG9ja2VkIiwiQ29uZmlndXJlIiwiSGFuZ2NoYXQiLCJJbnZpdGUiLCJJbnZpdGVlIiwiSW52aXRlciIsIk1vYmlsZSIsInJvdXRlIiwic2V0Um91dGUiLCJ1c2VSb3V0ZUNvbnRleHQiLCJzb2NrZXRoYW5kbGVyIiwiaGVpZ2h0IiwiU3VzcGVuc2UiXSwibWFwcGluZ3MiOiI7O0FBQU8sTUFBTUEsV0FBVyxHQUFHO0FBQ3ZCQyxFQUFBQSxvQkFBb0IsRUFBQyxzQkFERTtBQUV2QkMsRUFBQUEsYUFBYSxFQUFFLGVBRlE7QUFHdkJDLEVBQUFBLGFBQWEsRUFBRSxlQUhRO0FBSXZCQyxFQUFBQSxnQkFBZ0IsRUFBRSxrQkFKSztBQUt2QkMsRUFBQUEsZ0JBQWdCLEVBQUUsa0JBTEs7QUFNdkJDLEVBQUFBLGFBQWEsRUFBQyxlQU5TO0FBT3ZCQyxFQUFBQSxlQUFlLEVBQUMsaUJBUE87QUFTdkJDLEVBQUFBLHFCQUFxQixFQUFFLHVCQVRBO0FBVXZCQyxFQUFBQSxxQkFBcUIsRUFBRSx1QkFWQTtBQVd2QkMsRUFBQUEsb0JBQW9CLEVBQUUsc0JBWEM7QUFZdkJDLEVBQUFBLHVCQUF1QixFQUFFLHlCQVpGO0FBZXZCQyxFQUFBQSxrQkFBa0IsRUFBRSxvQkFmRztBQWdCdkJDLEVBQUFBLGtCQUFrQixFQUFFLG9C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
