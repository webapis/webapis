import { l, M, u as useAuthContext, p, h, a as h$1, _ as _extends, w, b as useRouteContext, R as Route, c as M$1, O, d as RouteProvider } from './index-01cb6a33.js';

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
      debugger;
      dispatch({
        type: actionTypes.FETCH_HANGOUT_SUCCESS,
        hangouts
      });
    } else {
      debugger;
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
      filterHangouts({
        dispatch
      });
    }

    if (search && (!hangouts || hangouts && hangouts.length === 0)) {
      fetchHangout({
        dispatch,
        search
      });
    }
  }, [state.search, state.hangouts]);
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

const Hangouts = O(() => import('./Hangout-da1bdb69.js'));
const Block = O(() => import('./Block-e15a77e1.js'));
const Blocked = O(() => import('./Blocked-d3928d97.js'));
const Configure = O(() => import('./Configure-651d57db.js'));
const Hangchat = O(() => import('./Hangchat-4b55d665.js'));
const Invite = O(() => import('./Invite-817d5fac.js'));
const Invitee = O(() => import('./Invitee-a9a21a1a.js'));
const Inviter = O(() => import('./Inviter-8d152fd3.js'));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtMzg1MmU5MjAuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25UeXBlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9yZWR1Y2VyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL21lc3NhZ2VUeXBlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25zLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL21lc3NhZ2VDb252ZXJ0ZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvdXNlU29ja2V0LmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL0hhbmdvdXRzUHJvdmlkZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvdXNlSGFuZ291dHMuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvbW9iaWxlLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBhY3Rpb25UeXBlcyA9IHtcbiAgICBcbiAgICBTRVRfU09DS0VUOiAnU0VUX1NPQ0tFVCcsXG4gICAgTE9BRF9IQU5HT1VUUzogJ0xPQURfSEFOR09VVFMnLFxuICAgIExPQURfTUVTU0FHRVM6ICdMT0FEX01FU1NBR0VTJyxcbiAgICBTRUFSQ0hFRF9IQU5HT1VUOiAnU0VBUkNIRURfSEFOR09VVCcsXG4gICAgU0VMRUNURURfSEFOR09VVDogJ1NFTEVDVEVEX0hBTkdPVVQnLFxuICAgIFxuICAgIEZJTFRFUl9IQU5HT1VUUzonRklMVEVSX0hBTkdPVVRTJyxcblxuICAgIEZFVENIX0hBTkdPVVRfU1RBUlRFRDogJ0ZFVENIX0hBTkdPVVRfU1RBUlRFRCcsXG4gICAgRkVUQ0hfSEFOR09VVF9TVUNDRVNTOiAnRkVUQ0hfSEFOR09VVF9TVUNDRVNTJyxcbiAgICBGRVRDSF9IQU5HT1VUX0ZBSUxFRDogJ0ZFVENIX0hBTkdPVVRfRkFJTEVEJyxcbiAgICBGRVRDSF9IQU5HT1VUX05PVF9GT1VORDogJ0ZFVENIX0hBTkdPVVRfTk9UX0ZPVU5EJyxcblxuXG4gICAgRkVUQ0hfVVNFUl9TVEFSVEVEOiAnRkVUQ0hfVVNFUl9TVEFSVEVEJyxcbiAgICBGRVRDSF9VU0VSX1NVQ0NFU1M6ICdGRVRDSF9VU0VSX1NVQ0NFU1MnLFxuICAgIEZFVENIX1VTRVJfRkFJTEVEOiAnRkVUQ0hfVVNFUl9GQUlMRUQnLFxuXG5cbiAgICBPTkxJTkVfU1RBVEVfQ0hBTkdFRDogJ09OTElORV9TVEFURV9DSEFOR0VEJyxcblxuXG4gICAgT0ZGRVJfU1RBUlRFRDogJ09GRkVSX1NUQVJURUQnLFxuICAgIE9GRkVSX1NVQ0NFU1M6ICdPRkZFUl9TVUNDRVNTJyxcbiAgICBPRkZFUl9GQUlMRUQ6ICdPRkZFUl9GQUlMRUQnLFxuXG4gICAgQUNDRVBUX1NUQVJURUQ6ICdBQ0NFUFRfU1RBUlRFRCcsXG4gICAgQUNDRVBUX1NVQ0NFU1M6ICdBQ0NFUFRfU1VDQ0VTUycsXG4gICAgQUNDRVBUX0ZBSUxFRDogJ0FDQ0VQVF9GQUlMRUQnLFxuXG4gICAgQkxPQ0tfU1RBUlRFRDogJ0JMT0NLX1NUQVJURUQnLFxuICAgIEJMT0NLX1NVQ0NFU1M6ICdCTE9DS19TVUNDRVNTJyxcbiAgICBCTE9DS19GQUlMRUQ6ICdCTE9DS19GQUlMRUQnLFxuXG4gICAgVU5CTE9DS19TVEFSVEVEOiAnVU5CTE9DS19TVEFSVEVEJyxcbiAgICBVTkJMT0NLX1NVQ0NFU1M6ICdVTkJMT0NLX1NVQ0NFU1MnLFxuICAgIFVOQkxPQ0tfRkFJTEVEOiAnVU5CTE9DS19GQUlMRUQnLFxuXG4gICAgTUVTU0FHRV9TVEFSVEVEOiAnTUVTU0FHRV9TVEFSVEVEJyxcbiAgICBNRVNTQUdFX1NVQ0NFU1M6ICdNRVNTQUdFX1NVQ0NFU1MnLFxuICAgIE1FU1NBR0VfRkFJTEVEOiAnTUVTU0FHRV9GQUlMRUQnLFxuXG4gICAgREVDTElORV9TVEFSVEVEOidERUNMSU5FX1NUQVJURUQnLFxuICAgIERFQ0xJTkVfU1VDQ0VTUzonREVDTElORV9TVUNDRVNTJyxcbiAgICBERUNMSU5FX0ZBSUxFRDonREVDTElORV9GQUlMRUQnLFxuXG4gICAgSEFOR09VVF9DSEFOR0VEX0lUU19TVEFURTogJ0hBTkdPVVRfQ0hBTkdFRF9JVFNfU1RBVEUnLFxuICAgIE9GRkVSRVJfUkVDSUVWRUQ6ICdPRkZFUkVSX1JFQ0lFVkVEJyxcbiAgICBBQ0tOT1dMRURHRU1FTlRfUkVDSUVWRUQ6J0FDS05PV0xFREdFTUVOVF9SRUNJRVZFRCdcbn0iLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4vYWN0aW9uVHlwZXMnO1xuZXhwb3J0IGNvbnN0IGluaXRTdGF0ZSA9IHtcbiAgaGFuZ291dHM6IFtdLFxuICBoYW5nb3V0OiBudWxsLFxuICBzb2NrZXQ6IG51bGwsXG4gIG1lc3NhZ2VzOiBbXSxcbiAgc2VhcmNoOiAnJyxcbiAgdXNlcjogW10sXG4gIGxvYWRpbmc6IGZhbHNlLFxuICBlcnJvcjogbnVsbCxcbn07XG5leHBvcnQgZnVuY3Rpb24gcmVkdWNlcihzdGF0ZSwgYWN0aW9uKSB7XG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX1VTRVJfRkFJTEVEOlxuICAgIGNhc2UgYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9GQUlMRUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGVycm9yOiBhY3Rpb24uZXJyb3IgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX1VTRVJfU1RBUlRFRDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiB0cnVlIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9VU0VSX1NVQ0NFU1M6XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgbG9hZGluZzogZmFsc2UsXG4gICAgICAgIHVzZXJzOiBhY3Rpb24udXNlcnMubWFwKCh1KSA9PiAodVtzdGF0ZV0gPSAnSU5WSVRFJykpLFxuICAgICAgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfU1RBUlRFRDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiB0cnVlIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NVQ0NFU1M6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGhhbmdvdXRzOiBhY3Rpb24uaGFuZ291dHMgfTtcblxuICAgIGNhc2UgYWN0aW9uVHlwZXMuSEFOR09VVF9OT1RfRk9VTkQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZJTFRFUl9IQU5HT1VUUzpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBoYW5nb3V0czogc3RhdGUuaGFuZ291dHMuZmlsdGVyKChnKSA9PiBnLnVzZXJuYW1lLmluY2x1ZGVzKHN0YXRlLnNlYXJjaCkpLFxuICAgICAgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNFQVJDSEVEX0hBTkdPVVQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgc2VhcmNoOiBhY3Rpb24uc2VhcmNoIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0FEX0hBTkdPVVRTOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGhhbmdvdXRzOiBhY3Rpb24uaGFuZ291dHMgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNFVF9TT0NLRVQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgc29ja2V0OiBhY3Rpb24uc29ja2V0IH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TRUxFQ1RFRF9IQU5HT1VUOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIGhhbmdvdXQ6IHN0YXRlLmhhbmdvdXRzLmZpbmQoKGcpID0+IGcudXNlcm5hbWUgPT09IGFjdGlvbi51c2VybmFtZSksXG4gICAgICB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuSEFOR09VVF9DSEFOR0VEX0lUU19TVEFURTpcbiAgICBjYXNlIGFjdGlvblR5cGVzLkFDS05PV0xFREdFTUVOVF9SRUNJRVZFRDpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBoYW5nb3V0czogc3RhdGUuaGFuZ291dHMubWFwKChnKSA9PiB7XG4gICAgICAgICAgaWYgKGcudXNlcm5hbWUgPT09IGFjdGlvbi5oYW5nb3V0LnVzZXJuYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLmhhbmdvdXQ7XG4gICAgICAgICAgfSBlbHNlIHJldHVybiBnO1xuICAgICAgICB9KSxcbiAgICAgIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5PRkZFUkVSX1JFQ0lFVkVEOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGhhbmdvdXRzOiBbLi4uc3RhdGUuaGFuZ291dHMsIGFjdGlvbi5oYW5nb3V0XSB9O1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gc3RhdGU7XG4gIH1cbn1cbiIsImV4cG9ydCBjb25zdCBhY2tub3dsZWRnbWVudFR5cGVzID0ge1xuICAgIE9GRkVSRUQ6ICdPRkZFUkVEJyxcbiAgICBBQ0NFUFRFRDogJ0FDQ0VQVEVEJyxcbiAgICBCTE9DS0VEOiAnQkxPQ0tFRCcsXG4gICAgVU5CTE9DS0VEOiAnVU5CTE9DS0VEJyxcbiAgICBERUNMSU5FRDogJ0RFQ0xJTkVEJyxcbiAgICBNRVNTQUdFRDogJ01FU1NBR0VEJ1xufVxuXG5cbmV4cG9ydCBjb25zdCBtZXNzYWdlc0Zyb21TZXJ2ZXIgPSB7XG4gICAgQkxPQ0tFUjogJ0JMT0NLRVInLFxuICAgIEFDQ0VQVEVSOiAnQUNDRVBURVInLFxuICAgIFVOQkxPQ0tFUjogJ1VOQkxPQ0tFUicsXG4gICAgT0ZGRVJFUjogJ09GRkVSRVInLFxuICAgIERFQ0xJTkVSOiAnREVDTElORVInLFxuICAgIE1FU1NBTkdFUjogJ01FU1NBTkdFUidcblxufVxuXG5leHBvcnQgY29uc3QgbWVzc2FnZVRvU2VydmVyID0ge1xuICAgIEFDQ0VQVDogJ0FDQ0VQVCcsXG4gICAgREVDTElORTogJ0RFQ0xJTkUnLFxuICAgIE9GRkVSOiAnT0ZGRVInLFxuICAgIEJsT0NLOiAnQmxPQ0snLFxuICAgIFVOQkxPQ0s6ICdVTkJMT0NLJyxcbiAgICBNRVNTQUdFOiAnTUVTU0FHRSdcblxufVxuLy8gc2VydmVyIHNpZGUgbWVzc2FnZVxuZXhwb3J0IGNvbnN0IG1lc3NhZ2VDYXRlZ29yaWVzPXtcbiAgICBBQ0tOT1dMRURHRU1FTlQ6J0FDS05PV0xFREdFTUVOVCcsXG4gICAgUEVFUjonUEVFUidcbn0iLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4vYWN0aW9uVHlwZXMnO1xuaW1wb3J0IHsgbWVzc2FnZXNGcm9tU2VydmVyIH0gZnJvbSAnLi9tZXNzYWdlVHlwZXMnO1xuXG4vL3JldHJpZXZlcyBoYW5nb3V0cyBmcm9tIGxvY2FsU3RvcmFnZVxuZXhwb3J0IGZ1bmN0aW9uIGxvYWRIYW5nb3V0cyh7IHVzZXJuYW1lLCBkaXNwYXRjaCB9KSB7XG4gIGNvbnN0IGhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShgJHt1c2VybmFtZX0taGFuZ291dHNgKSk7XG5cbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5MT0FEX0hBTkdPVVRTLCBoYW5nb3V0cyB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdEhhbmdvdXQoeyBkaXNwYXRjaCwgdXNlcm5hbWUgfSkge1xuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFTEVDVEVEX0hBTkdPVVQsIHVzZXJuYW1lIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2VhcmNoSGFuZ291dHMoeyBzZWFyY2gsIGRpc3BhdGNoIH0pIHtcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TRUFSQ0hFRF9IQU5HT1VULCBzZWFyY2ggfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0V1NvY2tldCh7IHVybCwgZGlzcGF0Y2ggfSkge1xuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFVF9TT0NLRVQsIHNvY2tldDogbmV3IFdlYlNvY2tldCh1cmwpIH0pO1xufVxuXG5cblxuXG5cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJIYW5nb3V0cyh7IGRpc3BhdGNoIH0pIHtcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GSUxURVJfSEFOR09VVFMgfSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaEhhbmdvdXQoeyBzZWFyY2gsIGRpc3BhdGNoIH0pIHtcbiAgICBkZWJ1Z2dlclxuICB0cnkge1xuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9TVEFSVEVEIH0pO1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYC9oYW5nb3V0cy9maW5kP3NlYXJjaD0ke3NlYXJjaH1gKTtcbiAgIFxuICAgIGNvbnN0IHsgaGFuZ291dHMgfSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcblxuICAgIGlmIChoYW5nb3V0cy5sZW5ndGggPiAwKSB7XG4gICAgICBkZWJ1Z2dlclxuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NVQ0NFU1MsIGhhbmdvdXRzIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWJ1Z2dlcjtcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9OT1RfRk9VTkQgfSk7XG4gICAgICBmZXRjaFVzZXIoeyB1c2VybmFtZSwgZGlzcGF0Y2ggfSk7XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnN0IGVycj1lcnJvclxuICAgIGRlYnVnZ2VyO1xuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9GQUlMRUQsIGVycm9yIH0pO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaFVzZXIoeyB1c2VybmFtZSwgZGlzcGF0Y2ggfSkge1xuICB0cnkge1xuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfVVNFUl9TVEFSVEVEIH0pO1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYC91c2Vycy9maW5kP3VzZXJuYW1lPSR7dXNlcm5hbWV9YCk7XG4gICAgY29uc3QgeyB1c2VycyB9ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfVVNFUl9TVUNDRVNTLCB1c2VycyB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX1VTRVJfRkFJTEVELCBlcnJvciB9KTtcbiAgfVxufVxuXG5cbiIsImV4cG9ydCBmdW5jdGlvbiBoYW5nb3V0VG9NZXNzYWdlKHsgaGFuZ291dCwgdHlwZSB9KSB7XG4gXG4gICAgcmV0dXJueyB1c2VybmFtZTogaGFuZ291dC51c2VybmFtZSwgdHlwZSwgbWVzc2FnZTogaGFuZ291dC5tZXNzYWdlIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1lc3NhZ2VUb0hhbmdvdXQoeyBtZXNzYWdlLCBoYW5nb3V0IH0pIHtcbiAgXG4gICAgcmV0dXJuIHsgLi4uaGFuZ291dCwgc3RhdGU6IG1lc3NhZ2UudHlwZSwgbWVzc2FnZTogbWVzc2FnZSB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtZXNzYWdlVG9OZXdIYW5nb3V0KG1zZykge1xuICAgIGNvbnN0IHsgdXNlcm5hbWUsIGVtYWlsLCB0eXBlLCBtZXNzYWdlIH0gPSBtc2dcbiAgICBjb25zdCBoYW5nb3V0ID0geyB1c2VybmFtZSwgc3RhdGU6IHR5cGUsIGVtYWlsLCBtZXNzYWdlIH1cbiAgICByZXR1cm4gaGFuZ291dFxufSIsImltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcydcbmltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi9hY3Rpb25UeXBlcydcbmltcG9ydCB7IG1lc3NhZ2VUb0hhbmdvdXQsIG1lc3NhZ2VUb05ld0hhbmdvdXQgfSBmcm9tICcuL21lc3NhZ2VDb252ZXJ0ZXInXG5pbXBvcnQgeyBtZXNzYWdlc0Zyb21TZXJ2ZXIsIG1lc3NhZ2VDYXRlZ29yaWVzIH0gZnJvbSAnLi9tZXNzYWdlVHlwZXMnXG5leHBvcnQgZnVuY3Rpb24gdXNlU29ja2V0KHsgc29ja2V0LCBkaXNwYXRjaCwgaGFuZ291dCB9KSB7XG5cbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBpZiAoc29ja2V0KSB7XG4gICAgICAgICAgICBzb2NrZXQub25tZXNzYWdlID0gKG1lc3NhZ2UpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBtc2cgPSBKU09OLnBhcnNlKG1lc3NhZ2UuZGF0YSlcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKG1zZy5jYXRlZ29yeSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIG1lc3NhZ2VDYXRlZ29yaWVzLkFDS05PV0xFREdFTUVOVDpcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZUFja2hvd2xlZGdlbWVudHMoeyBkaXNwYXRjaCwgbXNnLGhhbmdvdXQgfSlcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBtZXNzYWdlQ2F0ZWdvcmllcy5QRUVSOlxuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlUGVlck1lc3NhZ2VzKHsgZGlzcGF0Y2gsIG1zZywgaGFuZ291dCB9KVxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNZXNzYWdlIGNhdGVvcnkgaXMgbm90IGRlZmluZWQnKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNvY2tldC5vbmNsb3NlID0gKCkgPT4ge1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc29ja2V0Lm9uZXJyb3IgPSAoZXJyb3IpID0+IHtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sIFtzb2NrZXRdKVxuXG4gICAgcmV0dXJuIG51bGxcbn1cblxuXG5mdW5jdGlvbiBoYW5kbGVBY2tob3dsZWRnZW1lbnRzKHsgZGlzcGF0Y2gsIG1zZyxoYW5nb3V0IH0pIHtcbiAgICBsZXQgdXBkYXRlZEhhbmdvdXQgPSBtZXNzYWdlVG9IYW5nb3V0KHsgaGFuZ291dCwgbWVzc2FnZTogbXNnIH0pXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5BQ0tOT1dMRURHRU1FTlRfUkVDSUVWRUQsIGhhbmdvdXQ6IHVwZGF0ZWRIYW5nb3V0IH0pXG4gICAgdXBkYXRlSGFuZ291dFN0YXRlSW5Mb2NhbFN0b3JhZ2UoYCR7dXNlcm5hbWV9LWhhbmdvdXRzYCwgdXBkYXRlZEhhbmdvdXQpXG59XG5cbmZ1bmN0aW9uIGhhbmRsZVBlZXJNZXNzYWdlcyh7IGRpc3BhdGNoLCBtc2csIGhhbmdvdXQgfSkge1xuICAgIGxldCB1cGRhdGVkSGFuZ291dCA9IG1lc3NhZ2VUb0hhbmdvdXQoeyBoYW5nb3V0LCBtZXNzYWdlOiBtc2cgfSlcbiAgICBsZXQgbmV3SGFuZ291dCA9bWVzc2FnZVRvTmV3SGFuZ291dChtc2cpXG4gICAgc3dpdGNoIChtc2cudHlwZSkge1xuICAgICAgICBjYXNlIG1lc3NhZ2VzRnJvbVNlcnZlci5CTE9DS0VSOlxuICAgICAgICBjYXNlIG1lc3NhZ2VzRnJvbVNlcnZlci5ERUNMSU5FUjpcbiAgICAgICAgY2FzZSBtZXNzYWdlc0Zyb21TZXJ2ZXIuTUVTU0FOR0VSOlxuICAgICAgICBjYXNlIG1lc3NhZ2VzRnJvbVNlcnZlci5VTkJMT0NLRVI6XG4gICAgICAgIGNhc2UgbWVzc2FnZXNGcm9tU2VydmVyLkFDQ0VQVEVSOlxuICAgICAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5IQU5HT1VUX0NIQU5HRURfSVRTX1NUQVRFLCBoYW5nb3V0OnVwZGF0ZWRIYW5nb3V0IH0pXG4gICAgICAgICAgICB1cGRhdGVIYW5nb3V0U3RhdGVJbkxvY2FsU3RvcmFnZShgJHt1c2VybmFtZX0taGFuZ291dHNgLCB1cGRhdGVkSGFuZ291dClcbiAgICAgICAgICAgIGNhc2UgbWVzc2FnZXNGcm9tU2VydmVyLk9GRkVSRVI6XG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5IQU5HT1VUX0NIQU5HRURfSVRTX1NUQVRFLCBoYW5nb3V0Om5ld0hhbmdvdXQgfSlcbiAgICAgICAgICAgICAgICBhZGROZXdIYW5nb3V0VG9Mb2NhbFN0b3JhZ2UoYCR7dXNlcm5hbWV9LWhhbmdvdXRzYCwgdXBkYXRlZEhhbmdvdXQpXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ01lc3NhZ2UgdHlwZSBmb3IgbWVzc2FnZXNGcm9tU2VydmVyIGlzIG5vdCBkZWZpbmVkJylcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUhhbmdvdXRTdGF0ZUluTG9jYWxTdG9yYWdlKGtleSwgaGFuZ291dCkge1xuICAgIGNvbnN0IGhhbmdvdXRzID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KTtcbiAgICBjb25zdCB1cGRhdGVkID0gaGFuZ291dHMubWFwKChnKSA9PiB7XG4gICAgICAgIGlmIChnLnVzZXJuYW1lID09PSBoYW5nb3V0LnVzZXJuYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gaGFuZ291dFxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGdcbiAgICAgICAgfVxuICAgIH0pXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeSh1cGRhdGVkKSlcbn1cblxuZnVuY3Rpb24gYWRkTmV3SGFuZ291dFRvTG9jYWxTdG9yYWdlKGtleSwgaGFuZ291dCkge1xuICAgIGNvbnN0IGhhbmdvdXRzID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KTtcbiAgICBjb25zdCBpbnNlcnRlZCA9IGhhbmdvdXRzLnB1c2goaGFuZ291dClcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KGluc2VydGVkKSlcblxufSIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHtcbiAgdXNlQ29udGV4dCxcbiAgdXNlU3RhdGUsXG4gIHVzZU1lbW8sXG4gIHVzZVJlZHVjZXIsXG4gIHVzZUVmZmVjdCxcbn0gZnJvbSAncHJlYWN0L2hvb2tzJztcbmltcG9ydCB7IHJlZHVjZXIsIGluaXRTdGF0ZSB9IGZyb20gJy4vcmVkdWNlcic7XG5pbXBvcnQgeyBpbml0V1NvY2tldCwgbG9hZEhhbmdvdXRzLCBmaWx0ZXJIYW5nb3V0cyxmZXRjaEhhbmdvdXQgfSBmcm9tICcuL2FjdGlvbnMnO1xuaW1wb3J0IHsgdXNlU29ja2V0IH0gZnJvbSAnLi91c2VTb2NrZXQnO1xuaW1wb3J0IHsgdXNlQXV0aENvbnRleHQgfSBmcm9tICcuLi8uLi9hdXRoL2F1dGgtY29udGV4dCc7XG5jb25zdCBIYW5nb3V0Q29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUhhbmdvdXRDb250ZXh0KCkge1xuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChIYW5nb3V0Q29udGV4dCk7XG4gIGlmICghY29udGV4dCkge1xuICAgIHRocm93IG5ldyBFcnJvcigndXNlSGFuZ291dENvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggSGFuZ291dHNQcm92aWRlcicpO1xuICB9XG5cbiAgcmV0dXJuIGNvbnRleHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBIYW5nb3V0c1Byb3ZpZGVyKHByb3BzKSB7XG4gIGNvbnN0IGF1dGhDb250ZXh0ID0gdXNlQXV0aENvbnRleHQoKTtcbiAgY29uc3QgeyB1c2VybmFtZSB9ID0gYXV0aENvbnRleHQuc3RhdGU7XG4gIGNvbnN0IHsgc29ja2V0VXJsIH0gPSBwcm9wcztcbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSB1c2VSZWR1Y2VyKHJlZHVjZXIsIGluaXRTdGF0ZSk7XG4gIGNvbnN0IHsgc29ja2V0LCBoYW5nb3V0LCBoYW5nb3V0cywgc2VhcmNoIH0gPSBzdGF0ZTtcbiAgY29uc3Qgc29ja2V0aGFuZGxlciA9IHVzZVNvY2tldCh7IGRpc3BhdGNoLCBzb2NrZXQsIGhhbmdvdXQgfSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAodXNlcm5hbWUpIHtcbiAgICAgIFxuICAgICAgaW5pdFdTb2NrZXQoeyB1cmw6IHNvY2tldFVybCwgZGlzcGF0Y2ggfSk7XG4gICAgICBsb2FkSGFuZ291dHMoeyB1c2VybmFtZSwgZGlzcGF0Y2ggfSk7XG4gICAgfVxuICB9LCBbdXNlcm5hbWVdKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIFxuICAgIGlmIChzZWFyY2ggJiYgaGFuZ291dHMgJiYgaGFuZ291dHMubGVuZ3RoID4gMCkge1xuICAgICBcbiAgICAgIGZpbHRlckhhbmdvdXRzKHsgZGlzcGF0Y2ggfSk7XG4gICAgfVxuICAgIGlmIChzZWFyY2ggJiYgKCFoYW5nb3V0cyB8fCAoaGFuZ291dHMgJiYgaGFuZ291dHMubGVuZ3RoPT09MCkpKSB7XG4gICAgIFxuICAgICAgZmV0Y2hIYW5nb3V0KHsgZGlzcGF0Y2gsc2VhcmNoIH0pO1xuICAgIH1cbiAgfSwgW3N0YXRlLnNlYXJjaCwgc3RhdGUuaGFuZ291dHNdKTtcblxuICBjb25zdCB2YWx1ZSA9IHVzZU1lbW8oKCkgPT4gW3N0YXRlLCBkaXNwYXRjaF0sIFtzdGF0ZV0pO1xuICByZXR1cm4gPEhhbmdvdXRDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt2YWx1ZX0gey4uLnByb3BzfSAvPjtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnXG5pbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncHJlYWN0L2hvb2tzJ1xuaW1wb3J0IHsgdXNlSGFuZ291dENvbnRleHQgfSBmcm9tICcuL0hhbmdvdXRzUHJvdmlkZXInXG5pbXBvcnQgeyBzZWxlY3RIYW5nb3V0LHNlYXJjaEhhbmdvdXRzIH0gZnJvbSAnLi9hY3Rpb25zJ1xuaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuL2FjdGlvblR5cGVzJ1xuaW1wb3J0IHsgbWVzc2FnZVRvU2VydmVyLCBtZXNzYWdlQ2F0ZWdvcmllcyB9IGZyb20gJy4vbWVzc2FnZVR5cGVzJ1xuXG5leHBvcnQgZnVuY3Rpb24gdXNlSGFuZ291dHMoKSB7XG4gICAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSB1c2VIYW5nb3V0Q29udGV4dCgpXG4gICBcblxuICAgIGNvbnN0IHsgaGFuZ291dCwgaGFuZ291dHMsIHNvY2tldCxzZWFyY2ggfSA9IHN0YXRlXG5cbiAgICBmdW5jdGlvbiBvblNlbGVjdChlKSB7XG4gICAgICAgIGNvbnN0IHVzZXJuYW1lPWUudGFyZ2V0LmlkXG4gICAgICAgIGRlYnVnZ2VyO1xuICAgICAgICBzZWxlY3RIYW5nb3V0KHsgZGlzcGF0Y2gsdXNlcm5hbWUgfSlcbiAgICB9XG4gICAgZnVuY3Rpb24gb25JbnZpdGUoKSB7XG4gICAgICAgIHNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHsgLi4uaGFuZ291dCwgdHlwZTogbWVzc2FnZVRvU2VydmVyLk9GRkVSIH0pKVxuICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLk9GRkVSX1NUQVJURUQsIGhhbmdvdXQgfSlcbiAgICB9XG4gICAgZnVuY3Rpb24gb25BY2NlcHQoKSB7XG4gICAgICAgIHNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHsgLi4uaGFuZ291dCwgdHlwZTogbWVzc2FnZVRvU2VydmVyLkFDQ0VQVCB9KSlcbiAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5BQ0NFUFRfU1RBUlRFRCwgaGFuZ291dCB9KVxuICAgIH1cbiAgICBmdW5jdGlvbiBvbkJsb2NrKCkge1xuICAgICAgICBzb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7IC4uLmhhbmdvdXQsIHR5cGU6IG1lc3NhZ2VUb1NlcnZlci5CbE9DSyB9KSlcbiAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5CTE9DS19TVEFSVEVELCBoYW5nb3V0IH0pXG4gICAgfVxuICAgIGZ1bmN0aW9uIG9uVW5ibG9jaygpIHtcbiAgICAgICAgc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoeyAuLi5oYW5nb3V0LCB0eXBlOiBtZXNzYWdlVG9TZXJ2ZXIuVU5CTE9DSyB9KSlcbiAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5VTkJMT0NLX1NUQVJURUQsIGhhbmdvdXQgfSlcbiAgICB9XG4gICAgZnVuY3Rpb24gb25EZWNsaW5lKCkge1xuICAgICAgICBzb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7IC4uLmhhbmdvdXQsIHR5cGU6IG1lc3NhZ2VUb1NlcnZlci5ERUNMSU5FIH0pKVxuICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkRFQ0xJTkVfU1RBUlRFRCwgaGFuZ291dCB9KVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9uTWVzc2FnZSgpIHtcbiAgICAgICAgc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoeyAuLi5oYW5nb3V0LCB0eXBlOiBtZXNzYWdlVG9TZXJ2ZXIuTUVTU0FHRSB9KSlcbiAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5NRVNTQUdFX1NUQVJURUQsIGhhbmdvdXQgfSlcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvblNlYXJjaChlKXtcbiAgICAgICBcbiAgICAgICAgc2VhcmNoSGFuZ291dHMoe3NlYXJjaDplLnRhcmdldC52YWx1ZSxkaXNwYXRjaH0pXG4gICAgfVxuICAgIHJldHVybiB7b25TZWFyY2gsc2VhcmNoLCBvbk1lc3NhZ2UsIG9uSW52aXRlLCBvbkFjY2VwdCwgb25CbG9jaywgb25VbmJsb2NrLCBvblNlbGVjdCwgb25EZWNsaW5lLCBoYW5nb3V0LCBoYW5nb3V0cyB9XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XG5pbXBvcnQgeyBsYXp5LCBTdXNwZW5zZSB9IGZyb20gJ3ByZWFjdC9jb21wYXQnO1xuaW1wb3J0IHsgUm91dGUsIHVzZVJvdXRlQ29udGV4dCB9IGZyb20gJy4uL3JvdXRlL3JvdXRlcic7XG5pbXBvcnQgeyB1c2VIYW5nb3V0cyB9IGZyb20gJy4vc3RhdGUvdXNlSGFuZ291dHMnO1xuY29uc3QgSGFuZ291dHMgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9IYW5nb3V0JykpO1xuY29uc3QgQmxvY2sgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9zdGF0ZS11aS9CbG9jaycpKTtcbmNvbnN0IEJsb2NrZWQgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9zdGF0ZS11aS9CbG9ja2VkJykpO1xuY29uc3QgQ29uZmlndXJlID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vc3RhdGUtdWkvQ29uZmlndXJlJykpO1xuY29uc3QgSGFuZ2NoYXQgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9zdGF0ZS11aS9IYW5nY2hhdCcpKTtcbmNvbnN0IEludml0ZSA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL3N0YXRlLXVpL0ludml0ZScpKTtcbmNvbnN0IEludml0ZWUgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9zdGF0ZS11aS9JbnZpdGVlJykpO1xuY29uc3QgSW52aXRlciA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL3N0YXRlLXVpL0ludml0ZXInKSk7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE1vYmlsZSgpIHtcbiAgY29uc3QgW3JvdXRlLCBzZXRSb3V0ZV0gPSB1c2VSb3V0ZUNvbnRleHQoKTtcbiAgY29uc3Qge1xuICAgIGhhbmdvdXQsXG4gICAgaGFuZ291dHMsXG4gICAgb25BY2NlcHQsXG4gICAgb25CbG9jayxcbiAgICBvbkludml0ZSxcbiAgICBvblNlbGVjdCxcbiAgICBvblVuYmxvY2ssXG4gICAgb25TZWFyY2gsXG4gICAgc2VhcmNoXG4gIH0gPSB1c2VIYW5nb3V0cygpO1xuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChoYW5nb3V0KSB7XG4gICAgICBkZWJ1Z2dlcjtcbiAgICAgIHNldFJvdXRlKGAvJHtoYW5nb3V0LnN0YXRlfWApO1xuICAgIH1cbiAgfSwgW2hhbmdvdXRdKTtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodDogJzg1dmgnIH19PlxuICAgICAgPFJvdXRlIHBhdGg9XCIvaGFuZ291dHNcIj5cbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxuICAgICAgICAgIDxIYW5nb3V0cyBzZWFyY2g9e3NlYXJjaH0gaGFuZ291dHM9e2hhbmdvdXRzfSBvblNlbGVjdD17b25TZWxlY3R9b25TZWFyY2g9e29uU2VhcmNofSAvPlxuICAgICAgICA8L1N1c3BlbnNlPlxuICAgICAgPC9Sb3V0ZT5cbiAgICAgIDxSb3V0ZSBwYXRoPVwiL0JMT0NLXCI+XG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cbiAgICAgICAgICA8QmxvY2sgaGFuZ291dD17aGFuZ291dH0gb25CbG9jaz17b25CbG9ja30gLz5cbiAgICAgICAgPC9TdXNwZW5zZT5cbiAgICAgIDwvUm91dGU+XG4gICAgICA8Um91dGUgcGF0aD1cIi9CTE9DS0VEXCI+XG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cbiAgICAgICAgICA8QmxvY2tlZCBoYW5nb3V0PXtoYW5nb3V0fSBvblVuYmxvY2s9e29uVW5ibG9ja30gLz5cbiAgICAgICAgPC9TdXNwZW5zZT5cbiAgICAgIDwvUm91dGU+XG4gICAgICA8Um91dGUgcGF0aD1cIi9jb25maWd1cmVcIj5cbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxuICAgICAgICAgIDxDb25maWd1cmUgaGFuZ291dD17aGFuZ291dH0gLz5cbiAgICAgICAgPC9TdXNwZW5zZT5cbiAgICAgIDwvUm91dGU+XG4gICAgICA8Um91dGUgcGF0aD1cIi9IQU5HQ0hBVFwiPlxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+TG9hZGluZy4uLjwvZGl2Pn0+XG4gICAgICAgICAgPEhhbmdjaGF0IC8+XG4gICAgICAgIDwvU3VzcGVuc2U+XG4gICAgICA8L1JvdXRlPlxuICAgICAgPFJvdXRlIHBhdGg9XCIvSU5WSVRFXCI+XG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cbiAgICAgICAgICA8SW52aXRlIGhhbmdvdXQ9e2hhbmdvdXR9IG9uSW52aXRlPXtvbkludml0ZX0gLz5cbiAgICAgICAgPC9TdXNwZW5zZT5cbiAgICAgIDwvUm91dGU+XG4gICAgICA8Um91dGUgcGF0aD1cIi9JTlZJVEVFXCI+XG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cbiAgICAgICAgICA8SW52aXRlZSBoYW5nb3V0PXtoYW5nb3V0fSAvPlxuICAgICAgICA8L1N1c3BlbnNlPlxuICAgICAgPC9Sb3V0ZT5cbiAgICAgIDxSb3V0ZSBwYXRoPVwiL0lOVklURVJcIj5cbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxuICAgICAgICAgIDxJbnZpdGVyIGhhbmdvdXQ9e2hhbmdvdXR9IG9uQWNjZXB0PXtvbkFjY2VwdH0gLz5cbiAgICAgICAgPC9TdXNwZW5zZT5cbiAgICAgIDwvUm91dGU+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0J1xyXG5pbXBvcnQgTW9iaWxlIGZyb20gJy4vbW9iaWxlJ1xyXG5pbXBvcnQgeyBIYW5nb3V0c1Byb3ZpZGVyIH0gZnJvbSAnLi9zdGF0ZS9IYW5nb3V0c1Byb3ZpZGVyJ1xyXG5pbXBvcnQgeyBSb3V0ZVByb3ZpZGVyLCB1c2VSb3V0ZUNvbnRleHQgfSBmcm9tICcuLi9yb3V0ZS9yb3V0ZXInO1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gPEhhbmdvdXRzUHJvdmlkZXIgc29ja2V0VXJsPVwid3M6Ly9sb2NhbGhvc3Q6MzAwMC9oYW5nb3V0c1wiPlxyXG4gICAgICAgICA8Um91dGVQcm92aWRlciBpbml0aWFsUm91dGU9XCIvaGFuZ291dHNcIj5cclxuICAgICAgICAgPE1vYmlsZSAvPlxyXG5cclxuICAgICAgICAgPC9Sb3V0ZVByb3ZpZGVyPlxyXG4gICAgXHJcbiAgICA8L0hhbmdvdXRzUHJvdmlkZXI+XHJcblxyXG59Il0sIm5hbWVzIjpbImFjdGlvblR5cGVzIiwiU0VUX1NPQ0tFVCIsIkxPQURfSEFOR09VVFMiLCJMT0FEX01FU1NBR0VTIiwiU0VBUkNIRURfSEFOR09VVCIsIlNFTEVDVEVEX0hBTkdPVVQiLCJGSUxURVJfSEFOR09VVFMiLCJGRVRDSF9IQU5HT1VUX1NUQVJURUQiLCJGRVRDSF9IQU5HT1VUX1NVQ0NFU1MiLCJGRVRDSF9IQU5HT1VUX0ZBSUxFRCIsIkZFVENIX0hBTkdPVVRfTk9UX0ZPVU5EIiwiRkVUQ0hfVVNFUl9TVEFSVEVEIiwiRkVUQ0hfVVNFUl9TVUNDRVNTIiwiRkVUQ0hfVVNFUl9GQUlMRUQiLCJPTkxJTkVfU1RBVEVfQ0hBTkdFRCIsIk9GRkVSX1NUQVJURUQiLCJPRkZFUl9TVUNDRVNTIiwiT0ZGRVJfRkFJTEVEIiwiQUNDRVBUX1NUQVJURUQiLCJBQ0NFUFRfU1VDQ0VTUyIsIkFDQ0VQVF9GQUlMRUQiLCJCTE9DS19TVEFSVEVEIiwiQkxPQ0tfU1VDQ0VTUyIsIkJMT0NLX0ZBSUxFRCIsIlVOQkxPQ0tfU1RBUlRFRCIsIlVOQkxPQ0tfU1VDQ0VTUyIsIlVOQkxPQ0tfRkFJTEVEIiwiTUVTU0FHRV9TVEFSVEVEIiwiTUVTU0FHRV9TVUNDRVNTIiwiTUVTU0FHRV9GQUlMRUQiLCJERUNMSU5FX1NUQVJURUQiLCJERUNMSU5FX1NVQ0NFU1MiLCJERUNMSU5FX0ZBSUxFRCIsIkhBTkdPVVRfQ0hBTkdFRF9JVFNfU1RBVEUiLCJPRkZFUkVSX1JFQ0lFVkVEIiwiQUNLTk9XTEVER0VNRU5UX1JFQ0lFVkVEIiwiaW5pdFN0YXRlIiwiaGFuZ291dHMiLCJoYW5nb3V0Iiwic29ja2V0IiwibWVzc2FnZXMiLCJzZWFyY2giLCJ1c2VyIiwibG9hZGluZyIsImVycm9yIiwicmVkdWNlciIsInN0YXRlIiwiYWN0aW9uIiwidHlwZSIsInVzZXJzIiwibWFwIiwidSIsIkhBTkdPVVRfTk9UX0ZPVU5EIiwiZmlsdGVyIiwiZyIsInVzZXJuYW1lIiwiaW5jbHVkZXMiLCJmaW5kIiwibWVzc2FnZXNGcm9tU2VydmVyIiwiQkxPQ0tFUiIsIkFDQ0VQVEVSIiwiVU5CTE9DS0VSIiwiT0ZGRVJFUiIsIkRFQ0xJTkVSIiwiTUVTU0FOR0VSIiwibWVzc2FnZVRvU2VydmVyIiwiQUNDRVBUIiwiREVDTElORSIsIk9GRkVSIiwiQmxPQ0siLCJVTkJMT0NLIiwiTUVTU0FHRSIsIm1lc3NhZ2VDYXRlZ29yaWVzIiwiQUNLTk9XTEVER0VNRU5UIiwiUEVFUiIsImxvYWRIYW5nb3V0cyIsImRpc3BhdGNoIiwiSlNPTiIsInBhcnNlIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsInNlbGVjdEhhbmdvdXQiLCJzZWFyY2hIYW5nb3V0cyIsImluaXRXU29ja2V0IiwidXJsIiwiV2ViU29ja2V0IiwiZmlsdGVySGFuZ291dHMiLCJmZXRjaEhhbmdvdXQiLCJyZXNwb25zZSIsImZldGNoIiwianNvbiIsImxlbmd0aCIsImZldGNoVXNlciIsIm1lc3NhZ2VUb0hhbmdvdXQiLCJtZXNzYWdlIiwibWVzc2FnZVRvTmV3SGFuZ291dCIsIm1zZyIsImVtYWlsIiwidXNlU29ja2V0IiwidXNlRWZmZWN0Iiwib25tZXNzYWdlIiwiZGF0YSIsImNhdGVnb3J5IiwiaGFuZGxlQWNraG93bGVkZ2VtZW50cyIsImhhbmRsZVBlZXJNZXNzYWdlcyIsIkVycm9yIiwib25jbG9zZSIsIm9uZXJyb3IiLCJ1cGRhdGVkSGFuZ291dCIsInVwZGF0ZUhhbmdvdXRTdGF0ZUluTG9jYWxTdG9yYWdlIiwibmV3SGFuZ291dCIsImFkZE5ld0hhbmdvdXRUb0xvY2FsU3RvcmFnZSIsImtleSIsInVwZGF0ZWQiLCJzZXRJdGVtIiwic3RyaW5naWZ5IiwiaW5zZXJ0ZWQiLCJwdXNoIiwiSGFuZ291dENvbnRleHQiLCJjcmVhdGVDb250ZXh0IiwidXNlSGFuZ291dENvbnRleHQiLCJjb250ZXh0IiwidXNlQ29udGV4dCIsIkhhbmdvdXRzUHJvdmlkZXIiLCJwcm9wcyIsImF1dGhDb250ZXh0IiwidXNlQXV0aENvbnRleHQiLCJzb2NrZXRVcmwiLCJ1c2VSZWR1Y2VyIiwic29ja2V0aGFuZGxlciIsInZhbHVlIiwidXNlTWVtbyIsImgiLCJ1c2VIYW5nb3V0cyIsIm9uU2VsZWN0IiwiZSIsInRhcmdldCIsImlkIiwib25JbnZpdGUiLCJzZW5kIiwib25BY2NlcHQiLCJvbkJsb2NrIiwib25VbmJsb2NrIiwib25EZWNsaW5lIiwib25NZXNzYWdlIiwib25TZWFyY2giLCJIYW5nb3V0cyIsImxhenkiLCJCbG9jayIsIkJsb2NrZWQiLCJDb25maWd1cmUiLCJIYW5nY2hhdCIsIkludml0ZSIsIkludml0ZWUiLCJJbnZpdGVyIiwiTW9iaWxlIiwicm91dGUiLCJzZXRSb3V0ZSIsInVzZVJvdXRlQ29udGV4dCIsImhlaWdodCIsIlN1c3BlbnNlIl0sIm1hcHBpbmdzIjoiOztBQUFPLE1BQU1BLFdBQVcsR0FBRztBQUV2QkMsRUFBQUEsVUFBVSxFQUFFLFlBRlc7QUFHdkJDLEVBQUFBLGFBQWEsRUFBRSxlQUhRO0FBSXZCQyxFQUFBQSxhQUFhLEVBQUUsZUFKUTtBQUt2QkMsRUFBQUEsZ0JBQWdCLEVBQUUsa0JBTEs7QUFNdkJDLEVBQUFBLGdC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
