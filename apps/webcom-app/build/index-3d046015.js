import { l, M, u as useAuthContext, p, h, a as h$1, _ as _extends, w, b as useRouteContext, R as Route, c as M$1, O, d as RouteProvider } from './index-a9da7457.js';

const actionTypes = {
  SET_SOCKET: 'SET_SOCKET',
  LOAD_HANGOUTS: 'LOAD_HANGOUTS',
  LOAD_MESSAGES: 'LOAD_MESSAGES',
  SEARCHED_HANGOUT: 'SEARCHED_HANGOUT',
  SELECTED_HANGOUT: 'SELECTED_HANGOUT',
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
  socket: null,
  messages: [],
  search: '',
  user: [],
  loading: false,
  error: null
};
function reducer(state, action) {
  switch (action.type) {
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
        users: action.users.map(u => u[state] = 'INVITE')
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

    case actionTypes.SET_SOCKET:
      return { ...state,
        socket: action.socket
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
  OFFERER: 'OFFERER',
  DECLINER: 'DECLINER',
  MESSANGER: 'MESSANGER'
};
const messageToServer = {
  ACCEPT: 'ACCEPT',
  DECLINE: 'DECLINE',
  OFFER: 'OFFER',
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
}
function selectHangout({
  dispatch,
  username
}) {
  dispatch({
    type: actionTypes.SELECTED_HANGOUT,
    username
  });
}
function searchHangouts({
  search,
  dispatch
}) {
  dispatch({
    type: actionTypes.SEARCHED_HANGOUT,
    search
  });
}
function initWSocket({
  url,
  dispatch
}) {
  dispatch({
    type: actionTypes.SET_SOCKET,
    socket: new WebSocket(url)
  });
}
function filterHangouts({
  dispatch
}) {
  dispatch({
    type: actionTypes.FILTER_HANGOUTS
  });
}
async function fetchHangout({
  search,
  dispatch
}) {
  debugger;

  try {
    dispatch({
      type: actionTypes.FETCH_HANGOUT_STARTED
    });
    const response = await fetch(`/hangouts/find?search=${search}`);
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
      });
      fetchUser({
        username,
        dispatch
      });
    }
  } catch (error) {
    debugger;
    dispatch({
      type: actionTypes.FETCH_HANGOUT_FAILED,
      error
    });
  }
}
async function fetchUser({
  username,
  dispatch
}) {
  try {
    dispatch({
      type: actionTypes.FETCH_USER_STARTED
    });
    const response = await fetch(`/users/find?username=${username}`);
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

function useSocket({
  socket,
  dispatch,
  hangout
}) {
  l(() => {
    if (socket) {
      socket.onmessage = message => {
        const msg = JSON.parse(message.data);

        switch (msg.category) {
          case messageCategories.ACKNOWLEDGEMENT:
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

      socket.onclose = () => {};

      socket.onerror = error => {};
    }
  }, [socket]);
  return null;
}

function handleAckhowledgements({
  dispatch,
  msg,
  hangout
}) {
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

    case messagesFromServer.OFFERER:
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
  const {
    socketUrl
  } = props;
  const [state, dispatch] = p(reducer, initState);
  const {
    socket,
    hangout,
    hangouts,
    search
  } = state;
  const sockethandler = useSocket({
    dispatch,
    socket,
    hangout
  });
  l(() => {
    if (username) {
      initWSocket({
        url: socketUrl,
        dispatch
      });
      loadHangouts({
        username,
        dispatch
      });
    }
  }, [username]);
  l(() => {
    if (search && hangouts && hangouts.length > 0) {
      debugger;
      filterHangouts({
        dispatch
      });
    }

    if (search && (!hangouts || hangouts && hangouts.length === 0)) {
      debugger;
      fetchHangout({
        dispatch,
        search
      });
    }
  }, [state.search, state.hangouts]);
  l(() => {
  }, [search]);
  const value = h(() => [state, dispatch], [state]);
  return h$1(HangoutContext.Provider, _extends({
    value: value
  }, props));
}

function useHangouts() {
  const [state, dispatch] = useHangoutContext();
  const {
    hangout,
    hangouts,
    socket,
    search
  } = state;

  function onSelect(e) {
    const username = e.target.id;
    debugger;
    selectHangout({
      dispatch,
      username
    });
  }

  function onInvite() {
    socket.send(JSON.stringify({ ...hangout,
      type: messageToServer.OFFER
    }));
    dispatch({
      type: actionTypes.OFFER_STARTED,
      hangout
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

  return {
    onSearch,
    search,
    onMessage,
    onInvite,
    onAccept,
    onBlock,
    onUnblock,
    onSelect,
    onDecline,
    hangout,
    hangouts
  };
}

const Hangouts = O(() => import('./Hangout-56be1a95.js'));
const Block = O(() => import('./Block-f0b4828c.js'));
const Blocked = O(() => import('./Blocked-b17b5026.js'));
const Configure = O(() => import('./Configure-fb358646.js'));
const Hangchat = O(() => import('./Hangchat-4dc51ccf.js'));
const Invite = O(() => import('./Invite-ff876a1e.js'));
const Invitee = O(() => import('./Invitee-2801fecd.js'));
const Inviter = O(() => import('./Inviter-6a7cfa78.js'));
function Mobile() {
  const [route, setRoute] = useRouteContext();
  const {
    hangout,
    hangouts,
    onAccept,
    onBlock,
    onInvite,
    onSelect,
    onUnblock,
    onSearch,
    search
  } = useHangouts();
  l(() => {
    if (hangout) {
      debugger;
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
    search: search,
    hangouts: hangouts,
    onSelect: onSelect,
    onSearch: onSearch
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
    path: "/HANGCHAT"
  }, h$1(M$1, {
    fallback: h$1("div", null, "Loading...")
  }, h$1(Hangchat, null))), h$1(Route, {
    path: "/INVITE"
  }, h$1(M$1, {
    fallback: h$1("div", null, "Loading...")
  }, h$1(Invite, {
    hangout: hangout,
    onInvite: onInvite
  }))), h$1(Route, {
    path: "/INVITEE"
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
  return h$1(HangoutsProvider, {
    socketUrl: "ws://localhost:3000/hangouts"
  }, h$1(RouteProvider, {
    initialRoute: "/hangouts"
  }, h$1(Mobile, null)));
}

export default index;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtM2QwNDYwMTUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25UeXBlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9yZWR1Y2VyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL21lc3NhZ2VUeXBlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25zLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL21lc3NhZ2VDb252ZXJ0ZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvdXNlU29ja2V0LmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL0hhbmdvdXRzUHJvdmlkZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvdXNlSGFuZ291dHMuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvbW9iaWxlLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBhY3Rpb25UeXBlcyA9IHtcbiAgICBcbiAgICBTRVRfU09DS0VUOiAnU0VUX1NPQ0tFVCcsXG4gICAgTE9BRF9IQU5HT1VUUzogJ0xPQURfSEFOR09VVFMnLFxuICAgIExPQURfTUVTU0FHRVM6ICdMT0FEX01FU1NBR0VTJyxcbiAgICBTRUFSQ0hFRF9IQU5HT1VUOiAnU0VBUkNIRURfSEFOR09VVCcsXG4gICAgU0VMRUNURURfSEFOR09VVDogJ1NFTEVDVEVEX0hBTkdPVVQnLFxuICAgIFxuICAgIEZJTFRFUl9IQU5HT1VUUzonRklMVEVSX0hBTkdPVVRTJyxcblxuICAgIEZFVENIX0hBTkdPVVRfU1RBUlRFRDogJ0ZFVENIX0hBTkdPVVRfU1RBUlRFRCcsXG4gICAgRkVUQ0hfSEFOR09VVF9TVUNDRVNTOiAnRkVUQ0hfSEFOR09VVF9TVUNDRVNTJyxcbiAgICBGRVRDSF9IQU5HT1VUX0ZBSUxFRDogJ0ZFVENIX0hBTkdPVVRfRkFJTEVEJyxcbiAgICBGRVRDSF9IQU5HT1VUX05PVF9GT1VORDogJ0ZFVENIX0hBTkdPVVRfTk9UX0ZPVU5EJyxcblxuXG4gICAgRkVUQ0hfVVNFUl9TVEFSVEVEOiAnRkVUQ0hfVVNFUl9TVEFSVEVEJyxcbiAgICBGRVRDSF9VU0VSX1NVQ0NFU1M6ICdGRVRDSF9VU0VSX1NVQ0NFU1MnLFxuICAgIEZFVENIX1VTRVJfRkFJTEVEOiAnRkVUQ0hfVVNFUl9GQUlMRUQnLFxuXG5cbiAgICBPTkxJTkVfU1RBVEVfQ0hBTkdFRDogJ09OTElORV9TVEFURV9DSEFOR0VEJyxcblxuXG4gICAgT0ZGRVJfU1RBUlRFRDogJ09GRkVSX1NUQVJURUQnLFxuICAgIE9GRkVSX1NVQ0NFU1M6ICdPRkZFUl9TVUNDRVNTJyxcbiAgICBPRkZFUl9GQUlMRUQ6ICdPRkZFUl9GQUlMRUQnLFxuXG4gICAgQUNDRVBUX1NUQVJURUQ6ICdBQ0NFUFRfU1RBUlRFRCcsXG4gICAgQUNDRVBUX1NVQ0NFU1M6ICdBQ0NFUFRfU1VDQ0VTUycsXG4gICAgQUNDRVBUX0ZBSUxFRDogJ0FDQ0VQVF9GQUlMRUQnLFxuXG4gICAgQkxPQ0tfU1RBUlRFRDogJ0JMT0NLX1NUQVJURUQnLFxuICAgIEJMT0NLX1NVQ0NFU1M6ICdCTE9DS19TVUNDRVNTJyxcbiAgICBCTE9DS19GQUlMRUQ6ICdCTE9DS19GQUlMRUQnLFxuXG4gICAgVU5CTE9DS19TVEFSVEVEOiAnVU5CTE9DS19TVEFSVEVEJyxcbiAgICBVTkJMT0NLX1NVQ0NFU1M6ICdVTkJMT0NLX1NVQ0NFU1MnLFxuICAgIFVOQkxPQ0tfRkFJTEVEOiAnVU5CTE9DS19GQUlMRUQnLFxuXG4gICAgTUVTU0FHRV9TVEFSVEVEOiAnTUVTU0FHRV9TVEFSVEVEJyxcbiAgICBNRVNTQUdFX1NVQ0NFU1M6ICdNRVNTQUdFX1NVQ0NFU1MnLFxuICAgIE1FU1NBR0VfRkFJTEVEOiAnTUVTU0FHRV9GQUlMRUQnLFxuXG4gICAgREVDTElORV9TVEFSVEVEOidERUNMSU5FX1NUQVJURUQnLFxuICAgIERFQ0xJTkVfU1VDQ0VTUzonREVDTElORV9TVUNDRVNTJyxcbiAgICBERUNMSU5FX0ZBSUxFRDonREVDTElORV9GQUlMRUQnLFxuXG4gICAgSEFOR09VVF9DSEFOR0VEX0lUU19TVEFURTogJ0hBTkdPVVRfQ0hBTkdFRF9JVFNfU1RBVEUnLFxuICAgIE9GRkVSRVJfUkVDSUVWRUQ6ICdPRkZFUkVSX1JFQ0lFVkVEJyxcbiAgICBBQ0tOT1dMRURHRU1FTlRfUkVDSUVWRUQ6J0FDS05PV0xFREdFTUVOVF9SRUNJRVZFRCdcbn0iLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4vYWN0aW9uVHlwZXMnO1xuZXhwb3J0IGNvbnN0IGluaXRTdGF0ZSA9IHtcbiAgaGFuZ291dHM6IFtdLFxuICBoYW5nb3V0OiBudWxsLFxuICBzb2NrZXQ6IG51bGwsXG4gIG1lc3NhZ2VzOiBbXSxcbiAgc2VhcmNoOiAnJyxcbiAgdXNlcjogW10sXG4gIGxvYWRpbmc6IGZhbHNlLFxuICBlcnJvcjogbnVsbCxcbn07XG5leHBvcnQgZnVuY3Rpb24gcmVkdWNlcihzdGF0ZSwgYWN0aW9uKSB7XG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX1VTRVJfRkFJTEVEOlxuICAgIGNhc2UgYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9GQUlMRUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGVycm9yOiBhY3Rpb24uZXJyb3IgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX1VTRVJfU1RBUlRFRDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiB0cnVlIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9VU0VSX1NVQ0NFU1M6XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgbG9hZGluZzogZmFsc2UsXG4gICAgICAgIHVzZXJzOiBhY3Rpb24udXNlcnMubWFwKCh1KSA9PiAodVtzdGF0ZV0gPSAnSU5WSVRFJykpLFxuICAgICAgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfU1RBUlRFRDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiB0cnVlIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NVQ0NFU1M6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGhhbmdvdXRzOiBhY3Rpb24uaGFuZ291dHMgfTtcblxuICAgIGNhc2UgYWN0aW9uVHlwZXMuSEFOR09VVF9OT1RfRk9VTkQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZJTFRFUl9IQU5HT1VUUzpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBoYW5nb3V0czogc3RhdGUuaGFuZ291dHMuZmlsdGVyKChnKSA9PiBnLnVzZXJuYW1lLmluY2x1ZGVzKHN0YXRlLnNlYXJjaCkpLFxuICAgICAgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNFQVJDSEVEX0hBTkdPVVQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgc2VhcmNoOiBhY3Rpb24uc2VhcmNoIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0FEX0hBTkdPVVRTOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGhhbmdvdXRzOiBhY3Rpb24uaGFuZ291dHMgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNFVF9TT0NLRVQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgc29ja2V0OiBhY3Rpb24uc29ja2V0IH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TRUxFQ1RFRF9IQU5HT1VUOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIGhhbmdvdXQ6IHN0YXRlLmhhbmdvdXRzLmZpbmQoKGcpID0+IGcudXNlcm5hbWUgPT09IGFjdGlvbi51c2VybmFtZSksXG4gICAgICB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuSEFOR09VVF9DSEFOR0VEX0lUU19TVEFURTpcbiAgICBjYXNlIGFjdGlvblR5cGVzLkFDS05PV0xFREdFTUVOVF9SRUNJRVZFRDpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBoYW5nb3V0czogc3RhdGUuaGFuZ291dHMubWFwKChnKSA9PiB7XG4gICAgICAgICAgaWYgKGcudXNlcm5hbWUgPT09IGFjdGlvbi5oYW5nb3V0LnVzZXJuYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLmhhbmdvdXQ7XG4gICAgICAgICAgfSBlbHNlIHJldHVybiBnO1xuICAgICAgICB9KSxcbiAgICAgIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5PRkZFUkVSX1JFQ0lFVkVEOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGhhbmdvdXRzOiBbLi4uc3RhdGUuaGFuZ291dHMsIGFjdGlvbi5oYW5nb3V0XSB9O1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gc3RhdGU7XG4gIH1cbn1cbiIsImV4cG9ydCBjb25zdCBhY2tub3dsZWRnbWVudFR5cGVzID0ge1xuICAgIE9GRkVSRUQ6ICdPRkZFUkVEJyxcbiAgICBBQ0NFUFRFRDogJ0FDQ0VQVEVEJyxcbiAgICBCTE9DS0VEOiAnQkxPQ0tFRCcsXG4gICAgVU5CTE9DS0VEOiAnVU5CTE9DS0VEJyxcbiAgICBERUNMSU5FRDogJ0RFQ0xJTkVEJyxcbiAgICBNRVNTQUdFRDogJ01FU1NBR0VEJ1xufVxuXG5cbmV4cG9ydCBjb25zdCBtZXNzYWdlc0Zyb21TZXJ2ZXIgPSB7XG4gICAgQkxPQ0tFUjogJ0JMT0NLRVInLFxuICAgIEFDQ0VQVEVSOiAnQUNDRVBURVInLFxuICAgIFVOQkxPQ0tFUjogJ1VOQkxPQ0tFUicsXG4gICAgT0ZGRVJFUjogJ09GRkVSRVInLFxuICAgIERFQ0xJTkVSOiAnREVDTElORVInLFxuICAgIE1FU1NBTkdFUjogJ01FU1NBTkdFUidcblxufVxuXG5leHBvcnQgY29uc3QgbWVzc2FnZVRvU2VydmVyID0ge1xuICAgIEFDQ0VQVDogJ0FDQ0VQVCcsXG4gICAgREVDTElORTogJ0RFQ0xJTkUnLFxuICAgIE9GRkVSOiAnT0ZGRVInLFxuICAgIEJsT0NLOiAnQmxPQ0snLFxuICAgIFVOQkxPQ0s6ICdVTkJMT0NLJyxcbiAgICBNRVNTQUdFOiAnTUVTU0FHRSdcblxufVxuLy8gc2VydmVyIHNpZGUgbWVzc2FnZVxuZXhwb3J0IGNvbnN0IG1lc3NhZ2VDYXRlZ29yaWVzPXtcbiAgICBBQ0tOT1dMRURHRU1FTlQ6J0FDS05PV0xFREdFTUVOVCcsXG4gICAgUEVFUjonUEVFUidcbn0iLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4vYWN0aW9uVHlwZXMnO1xuaW1wb3J0IHsgbWVzc2FnZXNGcm9tU2VydmVyIH0gZnJvbSAnLi9tZXNzYWdlVHlwZXMnO1xuXG4vL3JldHJpZXZlcyBoYW5nb3V0cyBmcm9tIGxvY2FsU3RvcmFnZVxuZXhwb3J0IGZ1bmN0aW9uIGxvYWRIYW5nb3V0cyh7IHVzZXJuYW1lLCBkaXNwYXRjaCB9KSB7XG4gIGNvbnN0IGhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShgJHt1c2VybmFtZX0taGFuZ291dHNgKSk7XG5cbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5MT0FEX0hBTkdPVVRTLCBoYW5nb3V0cyB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdEhhbmdvdXQoeyBkaXNwYXRjaCwgdXNlcm5hbWUgfSkge1xuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFTEVDVEVEX0hBTkdPVVQsIHVzZXJuYW1lIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2VhcmNoSGFuZ291dHMoeyBzZWFyY2gsIGRpc3BhdGNoIH0pIHtcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TRUFSQ0hFRF9IQU5HT1VULCBzZWFyY2ggfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0V1NvY2tldCh7IHVybCwgZGlzcGF0Y2ggfSkge1xuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFVF9TT0NLRVQsIHNvY2tldDogbmV3IFdlYlNvY2tldCh1cmwpIH0pO1xufVxuXG5cblxuXG5cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJIYW5nb3V0cyh7IGRpc3BhdGNoIH0pIHtcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GSUxURVJfSEFOR09VVFMgfSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaEhhbmdvdXQoeyBzZWFyY2gsIGRpc3BhdGNoIH0pIHtcbiAgICBkZWJ1Z2dlclxuICB0cnkge1xuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9TVEFSVEVEIH0pO1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYC9oYW5nb3V0cy9maW5kP3NlYXJjaD0ke3NlYXJjaH1gKTtcbiAgICBjb25zdCB7IGhhbmdvdXRzIH0gPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG5cbiAgICBpZiAoaGFuZ291dHMubGVuZ3RoID4gMCkge1xuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NVQ0NFU1MsIGhhbmdvdXRzIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfTk9UX0ZPVU5EIH0pO1xuICAgICAgZmV0Y2hVc2VyKHsgdXNlcm5hbWUsIGRpc3BhdGNoIH0pO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBkZWJ1Z2dlcjtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfRkFJTEVELCBlcnJvciB9KTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hVc2VyKHsgdXNlcm5hbWUsIGRpc3BhdGNoIH0pIHtcbiAgdHJ5IHtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX1VTRVJfU1RBUlRFRCB9KTtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAvdXNlcnMvZmluZD91c2VybmFtZT0ke3VzZXJuYW1lfWApO1xuICAgIGNvbnN0IHsgdXNlcnMgfSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX1VTRVJfU1VDQ0VTUywgdXNlcnMgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9VU0VSX0ZBSUxFRCwgZXJyb3IgfSk7XG4gIH1cbn1cblxuXG4iLCJleHBvcnQgZnVuY3Rpb24gaGFuZ291dFRvTWVzc2FnZSh7IGhhbmdvdXQsIHR5cGUgfSkge1xuIFxuICAgIHJldHVybnsgdXNlcm5hbWU6IGhhbmdvdXQudXNlcm5hbWUsIHR5cGUsIG1lc3NhZ2U6IGhhbmdvdXQubWVzc2FnZSB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtZXNzYWdlVG9IYW5nb3V0KHsgbWVzc2FnZSwgaGFuZ291dCB9KSB7XG4gIFxuICAgIHJldHVybiB7IC4uLmhhbmdvdXQsIHN0YXRlOiBtZXNzYWdlLnR5cGUsIG1lc3NhZ2U6IG1lc3NhZ2UgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbWVzc2FnZVRvTmV3SGFuZ291dChtc2cpIHtcbiAgICBjb25zdCB7IHVzZXJuYW1lLCBlbWFpbCwgdHlwZSwgbWVzc2FnZSB9ID0gbXNnXG4gICAgY29uc3QgaGFuZ291dCA9IHsgdXNlcm5hbWUsIHN0YXRlOiB0eXBlLCBlbWFpbCwgbWVzc2FnZSB9XG4gICAgcmV0dXJuIGhhbmdvdXRcbn0iLCJpbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnXG5pbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4vYWN0aW9uVHlwZXMnXG5pbXBvcnQgeyBtZXNzYWdlVG9IYW5nb3V0LCBtZXNzYWdlVG9OZXdIYW5nb3V0IH0gZnJvbSAnLi9tZXNzYWdlQ29udmVydGVyJ1xuaW1wb3J0IHsgbWVzc2FnZXNGcm9tU2VydmVyLCBtZXNzYWdlQ2F0ZWdvcmllcyB9IGZyb20gJy4vbWVzc2FnZVR5cGVzJ1xuZXhwb3J0IGZ1bmN0aW9uIHVzZVNvY2tldCh7IHNvY2tldCwgZGlzcGF0Y2gsIGhhbmdvdXQgfSkge1xuXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgaWYgKHNvY2tldCkge1xuICAgICAgICAgICAgc29ja2V0Lm9ubWVzc2FnZSA9IChtZXNzYWdlKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgbXNnID0gSlNPTi5wYXJzZShtZXNzYWdlLmRhdGEpXG4gICAgICAgICAgICAgICAgc3dpdGNoIChtc2cuY2F0ZWdvcnkpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBtZXNzYWdlQ2F0ZWdvcmllcy5BQ0tOT1dMRURHRU1FTlQ6XG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVBY2tob3dsZWRnZW1lbnRzKHsgZGlzcGF0Y2gsIG1zZyxoYW5nb3V0IH0pXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgbWVzc2FnZUNhdGVnb3JpZXMuUEVFUjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZVBlZXJNZXNzYWdlcyh7IGRpc3BhdGNoLCBtc2csIGhhbmdvdXQgfSlcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTWVzc2FnZSBjYXRlb3J5IGlzIG5vdCBkZWZpbmVkJylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzb2NrZXQub25jbG9zZSA9ICgpID0+IHtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNvY2tldC5vbmVycm9yID0gKGVycm9yKSA9PiB7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LCBbc29ja2V0XSlcblxuICAgIHJldHVybiBudWxsXG59XG5cblxuZnVuY3Rpb24gaGFuZGxlQWNraG93bGVkZ2VtZW50cyh7IGRpc3BhdGNoLCBtc2csaGFuZ291dCB9KSB7XG4gICAgbGV0IHVwZGF0ZWRIYW5nb3V0ID0gbWVzc2FnZVRvSGFuZ291dCh7IGhhbmdvdXQsIG1lc3NhZ2U6IG1zZyB9KVxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQUNLTk9XTEVER0VNRU5UX1JFQ0lFVkVELCBoYW5nb3V0OiB1cGRhdGVkSGFuZ291dCB9KVxuICAgIHVwZGF0ZUhhbmdvdXRTdGF0ZUluTG9jYWxTdG9yYWdlKGAke3VzZXJuYW1lfS1oYW5nb3V0c2AsIHVwZGF0ZWRIYW5nb3V0KVxufVxuXG5mdW5jdGlvbiBoYW5kbGVQZWVyTWVzc2FnZXMoeyBkaXNwYXRjaCwgbXNnLCBoYW5nb3V0IH0pIHtcbiAgICBsZXQgdXBkYXRlZEhhbmdvdXQgPSBtZXNzYWdlVG9IYW5nb3V0KHsgaGFuZ291dCwgbWVzc2FnZTogbXNnIH0pXG4gICAgbGV0IG5ld0hhbmdvdXQgPW1lc3NhZ2VUb05ld0hhbmdvdXQobXNnKVxuICAgIHN3aXRjaCAobXNnLnR5cGUpIHtcbiAgICAgICAgY2FzZSBtZXNzYWdlc0Zyb21TZXJ2ZXIuQkxPQ0tFUjpcbiAgICAgICAgY2FzZSBtZXNzYWdlc0Zyb21TZXJ2ZXIuREVDTElORVI6XG4gICAgICAgIGNhc2UgbWVzc2FnZXNGcm9tU2VydmVyLk1FU1NBTkdFUjpcbiAgICAgICAgY2FzZSBtZXNzYWdlc0Zyb21TZXJ2ZXIuVU5CTE9DS0VSOlxuICAgICAgICBjYXNlIG1lc3NhZ2VzRnJvbVNlcnZlci5BQ0NFUFRFUjpcbiAgICAgICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuSEFOR09VVF9DSEFOR0VEX0lUU19TVEFURSwgaGFuZ291dDp1cGRhdGVkSGFuZ291dCB9KVxuICAgICAgICAgICAgdXBkYXRlSGFuZ291dFN0YXRlSW5Mb2NhbFN0b3JhZ2UoYCR7dXNlcm5hbWV9LWhhbmdvdXRzYCwgdXBkYXRlZEhhbmdvdXQpXG4gICAgICAgICAgICBjYXNlIG1lc3NhZ2VzRnJvbVNlcnZlci5PRkZFUkVSOlxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuSEFOR09VVF9DSEFOR0VEX0lUU19TVEFURSwgaGFuZ291dDpuZXdIYW5nb3V0IH0pXG4gICAgICAgICAgICAgICAgYWRkTmV3SGFuZ291dFRvTG9jYWxTdG9yYWdlKGAke3VzZXJuYW1lfS1oYW5nb3V0c2AsIHVwZGF0ZWRIYW5nb3V0KVxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNZXNzYWdlIHR5cGUgZm9yIG1lc3NhZ2VzRnJvbVNlcnZlciBpcyBub3QgZGVmaW5lZCcpXG4gICAgfVxufVxuXG5mdW5jdGlvbiB1cGRhdGVIYW5nb3V0U3RhdGVJbkxvY2FsU3RvcmFnZShrZXksIGhhbmdvdXQpIHtcbiAgICBjb25zdCBoYW5nb3V0cyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSk7XG4gICAgY29uc3QgdXBkYXRlZCA9IGhhbmdvdXRzLm1hcCgoZykgPT4ge1xuICAgICAgICBpZiAoZy51c2VybmFtZSA9PT0gaGFuZ291dC51c2VybmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuIGhhbmdvdXRcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBnXG4gICAgICAgIH1cbiAgICB9KVxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkodXBkYXRlZCkpXG59XG5cbmZ1bmN0aW9uIGFkZE5ld0hhbmdvdXRUb0xvY2FsU3RvcmFnZShrZXksIGhhbmdvdXQpIHtcbiAgICBjb25zdCBoYW5nb3V0cyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSk7XG4gICAgY29uc3QgaW5zZXJ0ZWQgPSBoYW5nb3V0cy5wdXNoKGhhbmdvdXQpXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeShpbnNlcnRlZCkpXG5cbn0iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7XG4gIHVzZUNvbnRleHQsXG4gIHVzZVN0YXRlLFxuICB1c2VNZW1vLFxuICB1c2VSZWR1Y2VyLFxuICB1c2VFZmZlY3QsXG59IGZyb20gJ3ByZWFjdC9ob29rcyc7XG5pbXBvcnQgeyByZWR1Y2VyLCBpbml0U3RhdGUgfSBmcm9tICcuL3JlZHVjZXInO1xuaW1wb3J0IHsgaW5pdFdTb2NrZXQsIGxvYWRIYW5nb3V0cywgZmlsdGVySGFuZ291dHMsZmV0Y2hIYW5nb3V0IH0gZnJvbSAnLi9hY3Rpb25zJztcbmltcG9ydCB7IHVzZVNvY2tldCB9IGZyb20gJy4vdXNlU29ja2V0JztcbmltcG9ydCB7IHVzZUF1dGhDb250ZXh0IH0gZnJvbSAnLi4vLi4vYXV0aC9hdXRoLWNvbnRleHQnO1xuY29uc3QgSGFuZ291dENvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VIYW5nb3V0Q29udGV4dCgpIHtcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoSGFuZ291dENvbnRleHQpO1xuICBpZiAoIWNvbnRleHQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZUhhbmdvdXRDb250ZXh0IG11c3QgYmUgdXNlZCB3aXRoIEhhbmdvdXRzUHJvdmlkZXInKTtcbiAgfVxuXG4gIHJldHVybiBjb250ZXh0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gSGFuZ291dHNQcm92aWRlcihwcm9wcykge1xuICBjb25zdCBhdXRoQ29udGV4dCA9IHVzZUF1dGhDb250ZXh0KCk7XG4gIGNvbnN0IHsgdXNlcm5hbWUgfSA9IGF1dGhDb250ZXh0LnN0YXRlO1xuICBjb25zdCB7IHNvY2tldFVybCB9ID0gcHJvcHM7XG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlUmVkdWNlcihyZWR1Y2VyLCBpbml0U3RhdGUpO1xuICBjb25zdCB7IHNvY2tldCwgaGFuZ291dCwgaGFuZ291dHMsIHNlYXJjaCB9ID0gc3RhdGU7XG4gIGNvbnN0IHNvY2tldGhhbmRsZXIgPSB1c2VTb2NrZXQoeyBkaXNwYXRjaCwgc29ja2V0LCBoYW5nb3V0IH0pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKHVzZXJuYW1lKSB7XG4gICAgICBcbiAgICAgIGluaXRXU29ja2V0KHsgdXJsOiBzb2NrZXRVcmwsIGRpc3BhdGNoIH0pO1xuICAgICAgbG9hZEhhbmdvdXRzKHsgdXNlcm5hbWUsIGRpc3BhdGNoIH0pO1xuICAgIH1cbiAgfSwgW3VzZXJuYW1lXSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBcbiAgICBpZiAoc2VhcmNoICYmIGhhbmdvdXRzICYmIGhhbmdvdXRzLmxlbmd0aCA+IDApIHtcbiAgICAgZGVidWdnZXI7XG4gICAgICBmaWx0ZXJIYW5nb3V0cyh7IGRpc3BhdGNoIH0pO1xuICAgIH1cbiAgICBpZiAoc2VhcmNoICYmICghaGFuZ291dHMgfHwgKGhhbmdvdXRzICYmIGhhbmdvdXRzLmxlbmd0aD09PTApKSkge1xuICAgICAgZGVidWdnZXI7XG4gICAgICBmZXRjaEhhbmdvdXQoeyBkaXNwYXRjaCxzZWFyY2ggfSk7XG4gICAgfVxuICB9LCBbc3RhdGUuc2VhcmNoLCBzdGF0ZS5oYW5nb3V0c10pO1xudXNlRWZmZWN0KCgpPT57XG4gIGlmKHNlYXJjaCl7XG4gIC8vICBkZWJ1Z2dlcjtcbiAgfVxufSxbc2VhcmNoXSlcbiAgY29uc3QgdmFsdWUgPSB1c2VNZW1vKCgpID0+IFtzdGF0ZSwgZGlzcGF0Y2hdLCBbc3RhdGVdKTtcbiAgcmV0dXJuIDxIYW5nb3V0Q29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30gLz47XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0J1xuaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3ByZWFjdC9ob29rcydcbmltcG9ydCB7IHVzZUhhbmdvdXRDb250ZXh0IH0gZnJvbSAnLi9IYW5nb3V0c1Byb3ZpZGVyJ1xuaW1wb3J0IHsgc2VsZWN0SGFuZ291dCxzZWFyY2hIYW5nb3V0cyB9IGZyb20gJy4vYWN0aW9ucydcbmltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi9hY3Rpb25UeXBlcydcbmltcG9ydCB7IG1lc3NhZ2VUb1NlcnZlciwgbWVzc2FnZUNhdGVnb3JpZXMgfSBmcm9tICcuL21lc3NhZ2VUeXBlcydcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUhhbmdvdXRzKCkge1xuICAgIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlSGFuZ291dENvbnRleHQoKVxuICAgXG5cbiAgICBjb25zdCB7IGhhbmdvdXQsIGhhbmdvdXRzLCBzb2NrZXQsc2VhcmNoIH0gPSBzdGF0ZVxuXG4gICAgZnVuY3Rpb24gb25TZWxlY3QoZSkge1xuICAgICAgICBjb25zdCB1c2VybmFtZT1lLnRhcmdldC5pZFxuICAgICAgICBkZWJ1Z2dlcjtcbiAgICAgICAgc2VsZWN0SGFuZ291dCh7IGRpc3BhdGNoLHVzZXJuYW1lIH0pXG4gICAgfVxuICAgIGZ1bmN0aW9uIG9uSW52aXRlKCkge1xuICAgICAgICBzb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7IC4uLmhhbmdvdXQsIHR5cGU6IG1lc3NhZ2VUb1NlcnZlci5PRkZFUiB9KSlcbiAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5PRkZFUl9TVEFSVEVELCBoYW5nb3V0IH0pXG4gICAgfVxuICAgIGZ1bmN0aW9uIG9uQWNjZXB0KCkge1xuICAgICAgICBzb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7IC4uLmhhbmdvdXQsIHR5cGU6IG1lc3NhZ2VUb1NlcnZlci5BQ0NFUFQgfSkpXG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQUNDRVBUX1NUQVJURUQsIGhhbmdvdXQgfSlcbiAgICB9XG4gICAgZnVuY3Rpb24gb25CbG9jaygpIHtcbiAgICAgICAgc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoeyAuLi5oYW5nb3V0LCB0eXBlOiBtZXNzYWdlVG9TZXJ2ZXIuQmxPQ0sgfSkpXG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQkxPQ0tfU1RBUlRFRCwgaGFuZ291dCB9KVxuICAgIH1cbiAgICBmdW5jdGlvbiBvblVuYmxvY2soKSB7XG4gICAgICAgIHNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHsgLi4uaGFuZ291dCwgdHlwZTogbWVzc2FnZVRvU2VydmVyLlVOQkxPQ0sgfSkpXG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuVU5CTE9DS19TVEFSVEVELCBoYW5nb3V0IH0pXG4gICAgfVxuICAgIGZ1bmN0aW9uIG9uRGVjbGluZSgpIHtcbiAgICAgICAgc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoeyAuLi5oYW5nb3V0LCB0eXBlOiBtZXNzYWdlVG9TZXJ2ZXIuREVDTElORSB9KSlcbiAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5ERUNMSU5FX1NUQVJURUQsIGhhbmdvdXQgfSlcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvbk1lc3NhZ2UoKSB7XG4gICAgICAgIHNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHsgLi4uaGFuZ291dCwgdHlwZTogbWVzc2FnZVRvU2VydmVyLk1FU1NBR0UgfSkpXG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTUVTU0FHRV9TVEFSVEVELCBoYW5nb3V0IH0pXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb25TZWFyY2goZSl7XG4gICAgICAgXG4gICAgICAgIHNlYXJjaEhhbmdvdXRzKHtzZWFyY2g6ZS50YXJnZXQudmFsdWUsZGlzcGF0Y2h9KVxuICAgIH1cbiAgICByZXR1cm4ge29uU2VhcmNoLHNlYXJjaCwgb25NZXNzYWdlLCBvbkludml0ZSwgb25BY2NlcHQsIG9uQmxvY2ssIG9uVW5ibG9jaywgb25TZWxlY3QsIG9uRGVjbGluZSwgaGFuZ291dCwgaGFuZ291dHMgfVxufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xuaW1wb3J0IHsgbGF6eSwgU3VzcGVuc2UgfSBmcm9tICdwcmVhY3QvY29tcGF0JztcbmltcG9ydCB7IFJvdXRlLCB1c2VSb3V0ZUNvbnRleHQgfSBmcm9tICcuLi9yb3V0ZS9yb3V0ZXInO1xuaW1wb3J0IHsgdXNlSGFuZ291dHMgfSBmcm9tICcuL3N0YXRlL3VzZUhhbmdvdXRzJztcbmNvbnN0IEhhbmdvdXRzID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vSGFuZ291dCcpKTtcbmNvbnN0IEJsb2NrID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vc3RhdGUtdWkvQmxvY2snKSk7XG5jb25zdCBCbG9ja2VkID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vc3RhdGUtdWkvQmxvY2tlZCcpKTtcbmNvbnN0IENvbmZpZ3VyZSA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL3N0YXRlLXVpL0NvbmZpZ3VyZScpKTtcbmNvbnN0IEhhbmdjaGF0ID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vc3RhdGUtdWkvSGFuZ2NoYXQnKSk7XG5jb25zdCBJbnZpdGUgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9zdGF0ZS11aS9JbnZpdGUnKSk7XG5jb25zdCBJbnZpdGVlID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vc3RhdGUtdWkvSW52aXRlZScpKTtcbmNvbnN0IEludml0ZXIgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9zdGF0ZS11aS9JbnZpdGVyJykpO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBNb2JpbGUoKSB7XG4gIGNvbnN0IFtyb3V0ZSwgc2V0Um91dGVdID0gdXNlUm91dGVDb250ZXh0KCk7XG4gIGNvbnN0IHtcbiAgICBoYW5nb3V0LFxuICAgIGhhbmdvdXRzLFxuICAgIG9uQWNjZXB0LFxuICAgIG9uQmxvY2ssXG4gICAgb25JbnZpdGUsXG4gICAgb25TZWxlY3QsXG4gICAgb25VbmJsb2NrLFxuICAgIG9uU2VhcmNoLFxuICAgIHNlYXJjaFxuICB9ID0gdXNlSGFuZ291dHMoKTtcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoaGFuZ291dCkge1xuICAgICAgZGVidWdnZXI7XG4gICAgICBzZXRSb3V0ZShgLyR7aGFuZ291dC5zdGF0ZX1gKTtcbiAgICB9XG4gIH0sIFtoYW5nb3V0XSk7XG4gIHJldHVybiAoXG4gICAgPGRpdiBzdHlsZT17eyBoZWlnaHQ6ICc4NXZoJyB9fT5cbiAgICAgIDxSb3V0ZSBwYXRoPVwiL2hhbmdvdXRzXCI+XG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cbiAgICAgICAgICA8SGFuZ291dHMgc2VhcmNoPXtzZWFyY2h9IGhhbmdvdXRzPXtoYW5nb3V0c30gb25TZWxlY3Q9e29uU2VsZWN0fW9uU2VhcmNoPXtvblNlYXJjaH0gLz5cbiAgICAgICAgPC9TdXNwZW5zZT5cbiAgICAgIDwvUm91dGU+XG4gICAgICA8Um91dGUgcGF0aD1cIi9CTE9DS1wiPlxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+TG9hZGluZy4uLjwvZGl2Pn0+XG4gICAgICAgICAgPEJsb2NrIGhhbmdvdXQ9e2hhbmdvdXR9IG9uQmxvY2s9e29uQmxvY2t9IC8+XG4gICAgICAgIDwvU3VzcGVuc2U+XG4gICAgICA8L1JvdXRlPlxuICAgICAgPFJvdXRlIHBhdGg9XCIvQkxPQ0tFRFwiPlxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+TG9hZGluZy4uLjwvZGl2Pn0+XG4gICAgICAgICAgPEJsb2NrZWQgaGFuZ291dD17aGFuZ291dH0gb25VbmJsb2NrPXtvblVuYmxvY2t9IC8+XG4gICAgICAgIDwvU3VzcGVuc2U+XG4gICAgICA8L1JvdXRlPlxuICAgICAgPFJvdXRlIHBhdGg9XCIvY29uZmlndXJlXCI+XG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cbiAgICAgICAgICA8Q29uZmlndXJlIGhhbmdvdXQ9e2hhbmdvdXR9IC8+XG4gICAgICAgIDwvU3VzcGVuc2U+XG4gICAgICA8L1JvdXRlPlxuICAgICAgPFJvdXRlIHBhdGg9XCIvSEFOR0NIQVRcIj5cbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxuICAgICAgICAgIDxIYW5nY2hhdCAvPlxuICAgICAgICA8L1N1c3BlbnNlPlxuICAgICAgPC9Sb3V0ZT5cbiAgICAgIDxSb3V0ZSBwYXRoPVwiL0lOVklURVwiPlxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+TG9hZGluZy4uLjwvZGl2Pn0+XG4gICAgICAgICAgPEludml0ZSBoYW5nb3V0PXtoYW5nb3V0fSBvbkludml0ZT17b25JbnZpdGV9IC8+XG4gICAgICAgIDwvU3VzcGVuc2U+XG4gICAgICA8L1JvdXRlPlxuICAgICAgPFJvdXRlIHBhdGg9XCIvSU5WSVRFRVwiPlxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+TG9hZGluZy4uLjwvZGl2Pn0+XG4gICAgICAgICAgPEludml0ZWUgaGFuZ291dD17aGFuZ291dH0gLz5cbiAgICAgICAgPC9TdXNwZW5zZT5cbiAgICAgIDwvUm91dGU+XG4gICAgICA8Um91dGUgcGF0aD1cIi9JTlZJVEVSXCI+XG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cbiAgICAgICAgICA8SW52aXRlciBoYW5nb3V0PXtoYW5nb3V0fSBvbkFjY2VwdD17b25BY2NlcHR9IC8+XG4gICAgICAgIDwvU3VzcGVuc2U+XG4gICAgICA8L1JvdXRlPlxuICAgIDwvZGl2PlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCdcclxuaW1wb3J0IE1vYmlsZSBmcm9tICcuL21vYmlsZSdcclxuaW1wb3J0IHsgSGFuZ291dHNQcm92aWRlciB9IGZyb20gJy4vc3RhdGUvSGFuZ291dHNQcm92aWRlcidcclxuaW1wb3J0IHsgUm91dGVQcm92aWRlciwgdXNlUm91dGVDb250ZXh0IH0gZnJvbSAnLi4vcm91dGUvcm91dGVyJztcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIDxIYW5nb3V0c1Byb3ZpZGVyIHNvY2tldFVybD1cIndzOi8vbG9jYWxob3N0OjMwMDAvaGFuZ291dHNcIj5cclxuICAgICAgICAgPFJvdXRlUHJvdmlkZXIgaW5pdGlhbFJvdXRlPVwiL2hhbmdvdXRzXCI+XHJcbiAgICAgICAgIDxNb2JpbGUgLz5cclxuXHJcbiAgICAgICAgIDwvUm91dGVQcm92aWRlcj5cclxuICAgIFxyXG4gICAgPC9IYW5nb3V0c1Byb3ZpZGVyPlxyXG5cclxufSJdLCJuYW1lcyI6WyJhY3Rpb25UeXBlcyIsIlNFVF9TT0NLRVQiLCJMT0FEX0hBTkdPVVRTIiwiTE9BRF9NRVNTQUdFUyIsIlNFQVJDSEVEX0hBTkdPVVQiLCJTRUxFQ1RFRF9IQU5HT1VUIiwiRklMVEVSX0hBTkdPVVRTIiwiRkVUQ0hfSEFOR09VVF9TVEFSVEVEIiwiRkVUQ0hfSEFOR09VVF9TVUNDRVNTIiwiRkVUQ0hfSEFOR09VVF9GQUlMRUQiLCJGRVRDSF9IQU5HT1VUX05PVF9GT1VORCIsIkZFVENIX1VTRVJfU1RBUlRFRCIsIkZFVENIX1VTRVJfU1VDQ0VTUyIsIkZFVENIX1VTRVJfRkFJTEVEIiwiT05MSU5FX1NUQVRFX0NIQU5HRUQiLCJPRkZFUl9TVEFSVEVEIiwiT0ZGRVJfU1VDQ0VTUyIsIk9GRkVSX0ZBSUxFRCIsIkFDQ0VQVF9TVEFSVEVEIiwiQUNDRVBUX1NVQ0NFU1MiLCJBQ0NFUFRfRkFJTEVEIiwiQkxPQ0tfU1RBUlRFRCIsIkJMT0NLX1NVQ0NFU1MiLCJCTE9DS19GQUlMRUQiLCJVTkJMT0NLX1NUQVJURUQiLCJVTkJMT0NLX1NVQ0NFU1MiLCJVTkJMT0NLX0ZBSUxFRCIsIk1FU1NBR0VfU1RBUlRFRCIsIk1FU1NBR0VfU1VDQ0VTUyIsIk1FU1NBR0VfRkFJTEVEIiwiREVDTElORV9TVEFSVEVEIiwiREVDTElORV9TVUNDRVNTIiwiREVDTElORV9GQUlMRUQiLCJIQU5HT1VUX0NIQU5HRURfSVRTX1NUQVRFIiwiT0ZGRVJFUl9SRUNJRVZFRCIsIkFDS05PV0xFREdFTUVOVF9SRUNJRVZFRCIsImluaXRTdGF0ZSIsImhhbmdvdXRzIiwiaGFuZ291dCIsInNvY2tldCIsIm1lc3NhZ2VzIiwic2VhcmNoIiwidXNlciIsImxvYWRpbmciLCJlcnJvciIsInJlZHVjZXIiLCJzdGF0ZSIsImFjdGlvbiIsInR5cGUiLCJ1c2VycyIsIm1hcCIsInUiLCJIQU5HT1VUX05PVF9GT1VORCIsImZpbHRlciIsImciLCJ1c2VybmFtZSIsImluY2x1ZGVzIiwiZmluZCIsIm1lc3NhZ2VzRnJvbVNlcnZlciIsIkJMT0NLRVIiLCJBQ0NFUFRFUiIsIlVOQkxPQ0tFUiIsIk9GRkVSRVIiLCJERUNMSU5FUiIsIk1FU1NBTkdFUiIsIm1lc3NhZ2VUb1NlcnZlciIsIkFDQ0VQVCIsIkRFQ0xJTkUiLCJPRkZFUiIsIkJsT0NLIiwiVU5CTE9DSyIsIk1FU1NBR0UiLCJtZXNzYWdlQ2F0ZWdvcmllcyIsIkFDS05PV0xFREdFTUVOVCIsIlBFRVIiLCJsb2FkSGFuZ291dHMiLCJkaXNwYXRjaCIsIkpTT04iLCJwYXJzZSIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJzZWxlY3RIYW5nb3V0Iiwic2VhcmNoSGFuZ291dHMiLCJpbml0V1NvY2tldCIsInVybCIsIldlYlNvY2tldCIsImZpbHRlckhhbmdvdXRzIiwiZmV0Y2hIYW5nb3V0IiwicmVzcG9uc2UiLCJmZXRjaCIsImpzb24iLCJsZW5ndGgiLCJmZXRjaFVzZXIiLCJtZXNzYWdlVG9IYW5nb3V0IiwibWVzc2FnZSIsIm1lc3NhZ2VUb05ld0hhbmdvdXQiLCJtc2ciLCJlbWFpbCIsInVzZVNvY2tldCIsInVzZUVmZmVjdCIsIm9ubWVzc2FnZSIsImRhdGEiLCJjYXRlZ29yeSIsImhhbmRsZUFja2hvd2xlZGdlbWVudHMiLCJoYW5kbGVQZWVyTWVzc2FnZXMiLCJFcnJvciIsIm9uY2xvc2UiLCJvbmVycm9yIiwidXBkYXRlZEhhbmdvdXQiLCJ1cGRhdGVIYW5nb3V0U3RhdGVJbkxvY2FsU3RvcmFnZSIsIm5ld0hhbmdvdXQiLCJhZGROZXdIYW5nb3V0VG9Mb2NhbFN0b3JhZ2UiLCJrZXkiLCJ1cGRhdGVkIiwic2V0SXRlbSIsInN0cmluZ2lmeSIsImluc2VydGVkIiwicHVzaCIsIkhhbmdvdXRDb250ZXh0IiwiY3JlYXRlQ29udGV4dCIsInVzZUhhbmdvdXRDb250ZXh0IiwiY29udGV4dCIsInVzZUNvbnRleHQiLCJIYW5nb3V0c1Byb3ZpZGVyIiwicHJvcHMiLCJhdXRoQ29udGV4dCIsInVzZUF1dGhDb250ZXh0Iiwic29ja2V0VXJsIiwidXNlUmVkdWNlciIsInNvY2tldGhhbmRsZXIiLCJ2YWx1ZSIsInVzZU1lbW8iLCJoIiwidXNlSGFuZ291dHMiLCJvblNlbGVjdCIsImUiLCJ0YXJnZXQiLCJpZCIsIm9uSW52aXRlIiwic2VuZCIsIm9uQWNjZXB0Iiwib25CbG9jayIsIm9uVW5ibG9jayIsIm9uRGVjbGluZSIsIm9uTWVzc2FnZSIsIm9uU2VhcmNoIiwiSGFuZ291dHMiLCJsYXp5IiwiQmxvY2siLCJCbG9ja2VkIiwiQ29uZmlndXJlIiwiSGFuZ2NoYXQiLCJJbnZpdGUiLCJJbnZpdGVlIiwiSW52aXRlciIsIk1vYmlsZSIsInJvdXRlIiwic2V0Um91dGUiLCJ1c2VSb3V0ZUNvbnRleHQiLCJoZWlnaHQiLCJTdXNwZW5zZSJdLCJtYXBwaW5ncyI6Ijs7QUFBTyxNQUFNQSxXQUFXLEdBQUc7QUFFdkJDLEVBQUFBLFVBQVUsRUFBRSxZQUZXO0FBR3ZCQyxFQUFBQSxhQUFhLEVBQUUsZUFIUTtBQUl2QkMsRUFBQUEsYUFBYSxFQUFFLGVBSlE7QUFLdkJDLEVBQUFBLGdCQUFnQixF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
