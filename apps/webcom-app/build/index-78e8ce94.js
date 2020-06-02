import { l, M, u as useAuthContext, p, h, a as h$1, _ as _extends, w, b as useRouteContext, R as Route, c as M$1, O, d as RouteProvider } from './index-c5517b83.js';

const actionTypes = {
  MESSAGE_TEXT_CHANGED: 'MESSAGE_TEXT_CHANGED',
  SET_SOCKET: 'SET_SOCKET',
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
  socket: null,
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

    case actionTypes.SET_SOCKET:
      return { ...state,
        socket: action.socket
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
function initWSocket({
  url,
  dispatch,
  username
}) {
  dispatch({
    type: actionTypes.SET_SOCKET,
    socket: new WebSocket(`${url}/?username=${username}`)
  });
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
    search,
    users
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
        dispatch,
        username
      });
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

function useHangouts() {
  const authContext = useAuthContext();
  const {
    username
  } = authContext.state;
  const [state, dispatch] = useHangoutContext();
  const {
    hangout,
    hangouts,
    socket,
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
    const updatedHangout = { ...hangout,
      message: {
        text: messageText,
        timestamp: Date.now()
      }
    };
    debugger;
    socket.send(JSON.stringify({ ...updatedHangout,
      type: messageToServer.OFFER
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

const Hangouts = O(() => import('./Hangout-fcee76c6.js'));
const Block = O(() => import('./Block-f9a3340a.js'));
const Blocked = O(() => import('./Blocked-e5d4def8.js'));
const Configure = O(() => import('./Configure-ca1fe550.js'));
const Hangchat = O(() => import('./Hangchat-37a390fb.js'));
const Invite = O(() => import('./Invite-f274494a.js'));
const Invitee = O(() => import('./Invitee-2c61729c.js'));
const Inviter = O(() => import('./Inviter-55cd54ca.js'));
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
    path: "/HANGCHAT"
  }, h$1(M$1, {
    fallback: h$1("div", null, "Loading...")
  }, h$1(Hangchat, null))), h$1(Route, {
    path: "/INVITE"
  }, h$1(M$1, {
    fallback: h$1("div", null, "Loading...")
  }, h$1(Invite, {
    hangout: hangout,
    onInvite: onInvite,
    onMessageText: onMessageText,
    messageText: messageText
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtNzhlOGNlOTQuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25UeXBlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9yZWR1Y2VyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL21lc3NhZ2VUeXBlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25zLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL21lc3NhZ2VDb252ZXJ0ZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvdXNlU29ja2V0LmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL0hhbmdvdXRzUHJvdmlkZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvdXNlSGFuZ291dHMuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvbW9iaWxlLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBhY3Rpb25UeXBlcyA9IHtcbiAgICBNRVNTQUdFX1RFWFRfQ0hBTkdFRDonTUVTU0FHRV9URVhUX0NIQU5HRUQnLFxuICAgIFNFVF9TT0NLRVQ6ICdTRVRfU09DS0VUJyxcbiAgICBMT0FEX0hBTkdPVVRTOiAnTE9BRF9IQU5HT1VUUycsXG4gICAgTE9BRF9NRVNTQUdFUzogJ0xPQURfTUVTU0FHRVMnLFxuICAgIFNFQVJDSEVEX0hBTkdPVVQ6ICdTRUFSQ0hFRF9IQU5HT1VUJyxcbiAgICBTRUxFQ1RFRF9IQU5HT1VUOiAnU0VMRUNURURfSEFOR09VVCcsXG4gICAgU0VMRUNURURfVVNFUjonU0VMRUNURURfVVNFUicsXG4gICAgRklMVEVSX0hBTkdPVVRTOidGSUxURVJfSEFOR09VVFMnLFxuXG4gICAgRkVUQ0hfSEFOR09VVF9TVEFSVEVEOiAnRkVUQ0hfSEFOR09VVF9TVEFSVEVEJyxcbiAgICBGRVRDSF9IQU5HT1VUX1NVQ0NFU1M6ICdGRVRDSF9IQU5HT1VUX1NVQ0NFU1MnLFxuICAgIEZFVENIX0hBTkdPVVRfRkFJTEVEOiAnRkVUQ0hfSEFOR09VVF9GQUlMRUQnLFxuICAgIEZFVENIX0hBTkdPVVRfTk9UX0ZPVU5EOiAnRkVUQ0hfSEFOR09VVF9OT1RfRk9VTkQnLFxuXG5cbiAgICBGRVRDSF9VU0VSX1NUQVJURUQ6ICdGRVRDSF9VU0VSX1NUQVJURUQnLFxuICAgIEZFVENIX1VTRVJfU1VDQ0VTUzogJ0ZFVENIX1VTRVJfU1VDQ0VTUycsXG4gICAgRkVUQ0hfVVNFUl9GQUlMRUQ6ICdGRVRDSF9VU0VSX0ZBSUxFRCcsXG5cblxuICAgIE9OTElORV9TVEFURV9DSEFOR0VEOiAnT05MSU5FX1NUQVRFX0NIQU5HRUQnLFxuXG5cbiAgICBPRkZFUl9TVEFSVEVEOiAnT0ZGRVJfU1RBUlRFRCcsXG4gICAgT0ZGRVJfU1VDQ0VTUzogJ09GRkVSX1NVQ0NFU1MnLFxuICAgIE9GRkVSX0ZBSUxFRDogJ09GRkVSX0ZBSUxFRCcsXG5cbiAgICBBQ0NFUFRfU1RBUlRFRDogJ0FDQ0VQVF9TVEFSVEVEJyxcbiAgICBBQ0NFUFRfU1VDQ0VTUzogJ0FDQ0VQVF9TVUNDRVNTJyxcbiAgICBBQ0NFUFRfRkFJTEVEOiAnQUNDRVBUX0ZBSUxFRCcsXG5cbiAgICBCTE9DS19TVEFSVEVEOiAnQkxPQ0tfU1RBUlRFRCcsXG4gICAgQkxPQ0tfU1VDQ0VTUzogJ0JMT0NLX1NVQ0NFU1MnLFxuICAgIEJMT0NLX0ZBSUxFRDogJ0JMT0NLX0ZBSUxFRCcsXG5cbiAgICBVTkJMT0NLX1NUQVJURUQ6ICdVTkJMT0NLX1NUQVJURUQnLFxuICAgIFVOQkxPQ0tfU1VDQ0VTUzogJ1VOQkxPQ0tfU1VDQ0VTUycsXG4gICAgVU5CTE9DS19GQUlMRUQ6ICdVTkJMT0NLX0ZBSUxFRCcsXG5cbiAgICBNRVNTQUdFX1NUQVJURUQ6ICdNRVNTQUdFX1NUQVJURUQnLFxuICAgIE1FU1NBR0VfU1VDQ0VTUzogJ01FU1NBR0VfU1VDQ0VTUycsXG4gICAgTUVTU0FHRV9GQUlMRUQ6ICdNRVNTQUdFX0ZBSUxFRCcsXG5cbiAgICBERUNMSU5FX1NUQVJURUQ6J0RFQ0xJTkVfU1RBUlRFRCcsXG4gICAgREVDTElORV9TVUNDRVNTOidERUNMSU5FX1NVQ0NFU1MnLFxuICAgIERFQ0xJTkVfRkFJTEVEOidERUNMSU5FX0ZBSUxFRCcsXG5cbiAgICBIQU5HT1VUX0NIQU5HRURfSVRTX1NUQVRFOiAnSEFOR09VVF9DSEFOR0VEX0lUU19TVEFURScsXG4gICAgT0ZGRVJFUl9SRUNJRVZFRDogJ09GRkVSRVJfUkVDSUVWRUQnLFxuICAgIEFDS05PV0xFREdFTUVOVF9SRUNJRVZFRDonQUNLTk9XTEVER0VNRU5UX1JFQ0lFVkVEJ1xufSIsImltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi9hY3Rpb25UeXBlcyc7XG5leHBvcnQgY29uc3QgaW5pdFN0YXRlID0ge1xuICBoYW5nb3V0czogW10sXG4gIGhhbmdvdXQ6IG51bGwsXG4gIHNvY2tldDogbnVsbCxcbiAgbWVzc2FnZXM6IFtdLFxuICBzZWFyY2g6ICcnLFxuICB1c2VyOiBbXSxcbiAgbG9hZGluZzogZmFsc2UsXG4gIGVycm9yOiBudWxsLFxuICBtZXNzYWdlVGV4dDogJycsXG4gIG9ubGluZTpmYWxzZVxufTtcbmV4cG9ydCBmdW5jdGlvbiByZWR1Y2VyKHN0YXRlLCBhY3Rpb24pIHtcbiAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuT0ZGRVJfU1RBUlRFRDpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgIGxvYWRpbmc6dHJ1ZVxuICAgICAgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLk1FU1NBR0VfVEVYVF9DSEFOR0VEOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIG1lc3NhZ2VUZXh0OiBhY3Rpb24udGV4dCB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuRkVUQ0hfVVNFUl9GQUlMRUQ6XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX0ZBSUxFRDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiBmYWxzZSwgZXJyb3I6IGFjdGlvbi5lcnJvciB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuRkVUQ0hfVVNFUl9TVEFSVEVEOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IHRydWUgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX1VTRVJfU1VDQ0VTUzpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgdXNlcnM6IGFjdGlvbi51c2VycyxcbiAgICAgIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NUQVJURUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogdHJ1ZSB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9TVUNDRVNTOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBoYW5nb3V0czogYWN0aW9uLmhhbmdvdXRzIH07XG5cbiAgICBjYXNlIGFjdGlvblR5cGVzLkhBTkdPVVRfTk9UX0ZPVU5EOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GSUxURVJfSEFOR09VVFM6XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgaGFuZ291dHM6IHN0YXRlLmhhbmdvdXRzLmZpbHRlcigoZykgPT5cbiAgICAgICAgICBnLnVzZXJuYW1lLmluY2x1ZGVzKHN0YXRlLnNlYXJjaClcbiAgICAgICAgKSxcbiAgICAgIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TRUFSQ0hFRF9IQU5HT1VUOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHNlYXJjaDogYWN0aW9uLnNlYXJjaCB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuTE9BRF9IQU5HT1VUUzpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBoYW5nb3V0czogYWN0aW9uLmhhbmdvdXRzIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TRVRfU09DS0VUOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHNvY2tldDogYWN0aW9uLnNvY2tldCB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0VMRUNURURfVVNFUjpcbiAgICAgIGlmIChzdGF0ZS5oYW5nb3V0cykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLnN0YXRlLFxuICAgICAgICAgIGhhbmdvdXRzOiBbLi4uc3RhdGUuaGFuZ291dHMsIGFjdGlvbi5oYW5nb3V0XSxcbiAgICAgICAgICBoYW5nb3V0OiBhY3Rpb24uaGFuZ291dCxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBoYW5nb3V0czogW2FjdGlvbi5oYW5nb3V0XSxcbiAgICAgICAgaGFuZ291dDogYWN0aW9uLmhhbmdvdXQsXG4gICAgICB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0VMRUNURURfSEFOR09VVDpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBoYW5nb3V0OiBzdGF0ZS5oYW5nb3V0cy5maW5kKChnKSA9PiBnLnVzZXJuYW1lID09PSBhY3Rpb24udXNlcm5hbWUpLFxuICAgICAgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkhBTkdPVVRfQ0hBTkdFRF9JVFNfU1RBVEU6XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5BQ0tOT1dMRURHRU1FTlRfUkVDSUVWRUQ6XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgaGFuZ291dHM6IHN0YXRlLmhhbmdvdXRzLm1hcCgoZykgPT4ge1xuICAgICAgICAgIGlmIChnLnVzZXJuYW1lID09PSBhY3Rpb24uaGFuZ291dC51c2VybmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5oYW5nb3V0O1xuICAgICAgICAgIH0gZWxzZSByZXR1cm4gZztcbiAgICAgICAgfSksXG4gICAgICB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuT0ZGRVJFUl9SRUNJRVZFRDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBoYW5nb3V0czogWy4uLnN0YXRlLmhhbmdvdXRzLCBhY3Rpb24uaGFuZ291dF0gfTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHN0YXRlO1xuICB9XG59XG4iLCJleHBvcnQgY29uc3QgYWNrbm93bGVkZ21lbnRUeXBlcyA9IHtcbiAgICBPRkZFUkVEOiAnT0ZGRVJFRCcsXG4gICAgQUNDRVBURUQ6ICdBQ0NFUFRFRCcsXG4gICAgQkxPQ0tFRDogJ0JMT0NLRUQnLFxuICAgIFVOQkxPQ0tFRDogJ1VOQkxPQ0tFRCcsXG4gICAgREVDTElORUQ6ICdERUNMSU5FRCcsXG4gICAgTUVTU0FHRUQ6ICdNRVNTQUdFRCdcbn1cblxuXG5leHBvcnQgY29uc3QgbWVzc2FnZXNGcm9tU2VydmVyID0ge1xuICAgIEJMT0NLRVI6ICdCTE9DS0VSJyxcbiAgICBBQ0NFUFRFUjogJ0FDQ0VQVEVSJyxcbiAgICBVTkJMT0NLRVI6ICdVTkJMT0NLRVInLFxuICAgIE9GRkVSRVI6ICdPRkZFUkVSJyxcbiAgICBERUNMSU5FUjogJ0RFQ0xJTkVSJyxcbiAgICBNRVNTQU5HRVI6ICdNRVNTQU5HRVInXG5cbn1cblxuZXhwb3J0IGNvbnN0IG1lc3NhZ2VUb1NlcnZlciA9IHtcbiAgICBBQ0NFUFQ6ICdBQ0NFUFQnLFxuICAgIERFQ0xJTkU6ICdERUNMSU5FJyxcbiAgICBPRkZFUjogJ09GRkVSJyxcbiAgICBCbE9DSzogJ0JsT0NLJyxcbiAgICBVTkJMT0NLOiAnVU5CTE9DSycsXG4gICAgTUVTU0FHRTogJ01FU1NBR0UnXG5cbn1cbi8vIHNlcnZlciBzaWRlIG1lc3NhZ2VcbmV4cG9ydCBjb25zdCBtZXNzYWdlQ2F0ZWdvcmllcz17XG4gICAgQUNLTk9XTEVER0VNRU5UOidBQ0tOT1dMRURHRU1FTlQnLFxuICAgIFBFRVI6J1BFRVInXG59IiwiaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuL2FjdGlvblR5cGVzJztcbmltcG9ydCB7IG1lc3NhZ2VzRnJvbVNlcnZlciB9IGZyb20gJy4vbWVzc2FnZVR5cGVzJztcblxuLy9yZXRyaWV2ZXMgaGFuZ291dHMgZnJvbSBsb2NhbFN0b3JhZ2VcbmV4cG9ydCBmdW5jdGlvbiBsb2FkSGFuZ291dHMoeyB1c2VybmFtZSwgZGlzcGF0Y2ggfSkge1xuICBjb25zdCBoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oYCR7dXNlcm5hbWV9LWhhbmdvdXRzYCkpO1xuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkxPQURfSEFOR09VVFMsIGhhbmdvdXRzIH0pO1xufVxuLy9zZWxlY3QgaGFuZ291dCBmcm9tIExpc3RcbmV4cG9ydCBmdW5jdGlvbiBzZWxlY3RIYW5nb3V0KHsgZGlzcGF0Y2gsIHVzZXJuYW1lIH0pIHtcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TRUxFQ1RFRF9IQU5HT1VULCB1c2VybmFtZSB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdFVzZXIoe2Rpc3BhdGNoLCB1c2VyLHVzZXJuYW1lfSl7XG4gIC8vIHNhdmUgc2VsZWN0ZWQgdXNlciB0byBoYW5nb3V0c1xuICBjb25zdCBoYW5nb3V0ID0gey4uLnVzZXIsIHN0YXRlOidJTlZJVEUnfVxuICBjb25zdCBoYW5nb3V0cyA9SlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShgJHt1c2VybmFtZX0taGFuZ291dHNgKSlcbiBcbiAgaWYoaGFuZ291dHMpe1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGAke3VzZXJuYW1lfS1oYW5nb3V0c2AsIEpTT04uc3RyaW5naWZ5KFsuLi5oYW5nb3V0cyxoYW5nb3V0XSkpXG4gIH1cbiAgZWxzZXtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShgJHt1c2VybmFtZX0taGFuZ291dHNgLCBKU09OLnN0cmluZ2lmeShbaGFuZ291dF0pKVxuICB9XG5cbiAgZGlzcGF0Y2goe3R5cGU6YWN0aW9uVHlwZXMuU0VMRUNURURfVVNFUixoYW5nb3V0fSlcbn1cbi8vc2VhcmNoIGZvciBoYW5nb3V0IGJ5IHR5cGluZyBpbnRvIFRleHRJbnB1dFxuZXhwb3J0IGZ1bmN0aW9uIHNlYXJjaEhhbmdvdXRzKHsgc2VhcmNoLCBkaXNwYXRjaCB9KSB7XG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VBUkNIRURfSEFOR09VVCwgc2VhcmNoIH0pO1xufVxuLy9maWx0ZXIgaGFuZ291dCBhZnRlciBzZWFyY2ggc3RhdGUgY2hhbmdlXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVySGFuZ291dHMoeyBkaXNwYXRjaCB9KSB7XG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRklMVEVSX0hBTkdPVVRTIH0pO1xufVxuXG4vL2ZldGNoIGhhbmdvdXQgZnJvbSBzZXJ2ZXIgaWYgbm90IGZvdW5kIGluIGxvY2FsIGhhbmdvdXRzXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hIYW5nb3V0KHsgc2VhcmNoLCBkaXNwYXRjaCB9KSB7XG4gIFxuICB0cnkge1xuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9TVEFSVEVEIH0pO1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYC9oYW5nb3V0cy9maW5kP3NlYXJjaD0ke3NlYXJjaH1gKTtcblxuICAgaWYocmVzcG9uc2Uub2spe1xuICAgIGNvbnN0IHsgaGFuZ291dHMgfSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcblxuICAgIGlmIChoYW5nb3V0cy5sZW5ndGggPiAwKSB7XG5cbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9TVUNDRVNTLCBoYW5nb3V0cyB9KTtcbiAgICB9ICBlbHNle1xuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX05PVF9GT1VORCB9KTtcbiAgICAgIC8vIGZldGNoIHVzZXIgZnJvbSBzZXJ2ZXIgaW4gaGFuZ291dCBpcyBuZXd1c2VyXG4gICAgICBmZXRjaFVzZXIoeyBzZWFyY2gsIGRpc3BhdGNoIH0pO1xuICAgICB9XG5cbiAgIH1cbiAgIGVsc2V7XG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX05PVF9GT1VORCB9KTtcbiAgICAvLyBmZXRjaCB1c2VyIGZyb20gc2VydmVyIGluIGhhbmdvdXQgaXMgbmV3dXNlclxuICAgIGZldGNoVXNlcih7IHNlYXJjaCwgZGlzcGF0Y2ggfSk7XG4gICB9XG5cbiAgfSBjYXRjaCAoZXJyb3IpIHtcblxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9GQUlMRUQsIGVycm9yIH0pO1xuICB9XG59XG4gIC8vIGZldGNoIHVzZXIgZnJvbSBzZXJ2ZXIgaW4gaGFuZ291dCBpcyBuZXd1c2VyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hVc2VyKHsgc2VhcmNoLCBkaXNwYXRjaCB9KSB7XG5cbiAgdHJ5IHtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX1VTRVJfU1RBUlRFRCB9KTtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAvdXNlcnMvZmluZD9zZWFyY2g9JHtzZWFyY2h9YCk7XG4gICAgY29uc3QgeyB1c2VycyB9ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9VU0VSX1NVQ0NFU1MsIHVzZXJzIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfVVNFUl9GQUlMRUQsIGVycm9yIH0pO1xuICB9XG59XG5cblxuXG5cbmV4cG9ydCBmdW5jdGlvbiBjaGFuZ2VNZXNzYWdlVGV4dCh7dGV4dCxkaXNwYXRjaH0pe1xuZGlzcGF0Y2goe3R5cGU6YWN0aW9uVHlwZXMuTUVTU0FHRV9URVhUX0NIQU5HRUQsdGV4dH0pXG5cbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gaW5pdFdTb2NrZXQoeyB1cmwsIGRpc3BhdGNoLHVzZXJuYW1lIH0pIHtcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TRVRfU09DS0VULCBzb2NrZXQ6IG5ldyBXZWJTb2NrZXQoYCR7dXJsfS8/dXNlcm5hbWU9JHt1c2VybmFtZX1gKSB9KTtcbn0iLCJleHBvcnQgZnVuY3Rpb24gaGFuZ291dFRvTWVzc2FnZSh7IGhhbmdvdXQsIHR5cGUgfSkge1xuIFxuICAgIHJldHVybnsgdXNlcm5hbWU6IGhhbmdvdXQudXNlcm5hbWUsIHR5cGUsIG1lc3NhZ2U6IGhhbmdvdXQubWVzc2FnZSB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtZXNzYWdlVG9IYW5nb3V0KHsgbWVzc2FnZSwgaGFuZ291dCB9KSB7XG4gIFxuICAgIHJldHVybiB7IC4uLmhhbmdvdXQsIHN0YXRlOiBtZXNzYWdlLnR5cGUsIG1lc3NhZ2U6IG1lc3NhZ2UgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbWVzc2FnZVRvTmV3SGFuZ291dChtc2cpIHtcbiAgICBjb25zdCB7IHVzZXJuYW1lLCBlbWFpbCwgdHlwZSwgbWVzc2FnZSB9ID0gbXNnXG4gICAgY29uc3QgaGFuZ291dCA9IHsgdXNlcm5hbWUsIHN0YXRlOiB0eXBlLCBlbWFpbCwgbWVzc2FnZSB9XG4gICAgcmV0dXJuIGhhbmdvdXRcbn0iLCJpbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnXG5pbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4vYWN0aW9uVHlwZXMnXG5pbXBvcnQgeyBtZXNzYWdlVG9IYW5nb3V0LCBtZXNzYWdlVG9OZXdIYW5nb3V0IH0gZnJvbSAnLi9tZXNzYWdlQ29udmVydGVyJ1xuaW1wb3J0IHsgbWVzc2FnZXNGcm9tU2VydmVyLCBtZXNzYWdlQ2F0ZWdvcmllcyB9IGZyb20gJy4vbWVzc2FnZVR5cGVzJ1xuZXhwb3J0IGZ1bmN0aW9uIHVzZVNvY2tldCh7IHNvY2tldCwgZGlzcGF0Y2gsIGhhbmdvdXQgfSkge1xuXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgaWYgKHNvY2tldCkge1xuICAgICAgICAgICAgc29ja2V0Lm9ubWVzc2FnZSA9IChtZXNzYWdlKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgbXNnID0gSlNPTi5wYXJzZShtZXNzYWdlLmRhdGEpXG4gICAgICAgICAgICAgICAgc3dpdGNoIChtc2cuY2F0ZWdvcnkpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBtZXNzYWdlQ2F0ZWdvcmllcy5BQ0tOT1dMRURHRU1FTlQ6XG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVBY2tob3dsZWRnZW1lbnRzKHsgZGlzcGF0Y2gsIG1zZyxoYW5nb3V0IH0pXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgbWVzc2FnZUNhdGVnb3JpZXMuUEVFUjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZVBlZXJNZXNzYWdlcyh7IGRpc3BhdGNoLCBtc2csIGhhbmdvdXQgfSlcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTWVzc2FnZSBjYXRlb3J5IGlzIG5vdCBkZWZpbmVkJylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzb2NrZXQub25jbG9zZSA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBkZWJ1Z2dlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNvY2tldC5vbmVycm9yID0gKGVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgZGVidWdnZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzb2NrZXQub25vcGVuID0oKT0+e1xuICAgICAgICAgICAgICAgIGRlYnVnZ2VyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgIH1cbiAgICB9LCBbc29ja2V0XSlcblxuICAgIHJldHVybiBudWxsXG59XG5cblxuZnVuY3Rpb24gaGFuZGxlQWNraG93bGVkZ2VtZW50cyh7IGRpc3BhdGNoLCBtc2csaGFuZ291dCB9KSB7XG4gICAgbGV0IHVwZGF0ZWRIYW5nb3V0ID0gbWVzc2FnZVRvSGFuZ291dCh7IGhhbmdvdXQsIG1lc3NhZ2U6IG1zZyB9KVxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQUNLTk9XTEVER0VNRU5UX1JFQ0lFVkVELCBoYW5nb3V0OiB1cGRhdGVkSGFuZ291dCB9KVxuICAgIHVwZGF0ZUhhbmdvdXRTdGF0ZUluTG9jYWxTdG9yYWdlKGAke3VzZXJuYW1lfS1oYW5nb3V0c2AsIHVwZGF0ZWRIYW5nb3V0KVxufVxuXG5mdW5jdGlvbiBoYW5kbGVQZWVyTWVzc2FnZXMoeyBkaXNwYXRjaCwgbXNnLCBoYW5nb3V0IH0pIHtcbiAgICBsZXQgdXBkYXRlZEhhbmdvdXQgPSBtZXNzYWdlVG9IYW5nb3V0KHsgaGFuZ291dCwgbWVzc2FnZTogbXNnIH0pXG4gICAgbGV0IG5ld0hhbmdvdXQgPW1lc3NhZ2VUb05ld0hhbmdvdXQobXNnKVxuICAgIHN3aXRjaCAobXNnLnR5cGUpIHtcbiAgICAgICAgY2FzZSBtZXNzYWdlc0Zyb21TZXJ2ZXIuQkxPQ0tFUjpcbiAgICAgICAgY2FzZSBtZXNzYWdlc0Zyb21TZXJ2ZXIuREVDTElORVI6XG4gICAgICAgIGNhc2UgbWVzc2FnZXNGcm9tU2VydmVyLk1FU1NBTkdFUjpcbiAgICAgICAgY2FzZSBtZXNzYWdlc0Zyb21TZXJ2ZXIuVU5CTE9DS0VSOlxuICAgICAgICBjYXNlIG1lc3NhZ2VzRnJvbVNlcnZlci5BQ0NFUFRFUjpcbiAgICAgICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuSEFOR09VVF9DSEFOR0VEX0lUU19TVEFURSwgaGFuZ291dDp1cGRhdGVkSGFuZ291dCB9KVxuICAgICAgICAgICAgdXBkYXRlSGFuZ291dFN0YXRlSW5Mb2NhbFN0b3JhZ2UoYCR7dXNlcm5hbWV9LWhhbmdvdXRzYCwgdXBkYXRlZEhhbmdvdXQpXG4gICAgICAgICAgICBjYXNlIG1lc3NhZ2VzRnJvbVNlcnZlci5PRkZFUkVSOlxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuSEFOR09VVF9DSEFOR0VEX0lUU19TVEFURSwgaGFuZ291dDpuZXdIYW5nb3V0IH0pXG4gICAgICAgICAgICAgICAgYWRkTmV3SGFuZ291dFRvTG9jYWxTdG9yYWdlKGAke3VzZXJuYW1lfS1oYW5nb3V0c2AsIHVwZGF0ZWRIYW5nb3V0KVxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNZXNzYWdlIHR5cGUgZm9yIG1lc3NhZ2VzRnJvbVNlcnZlciBpcyBub3QgZGVmaW5lZCcpXG4gICAgfVxufVxuXG5mdW5jdGlvbiB1cGRhdGVIYW5nb3V0U3RhdGVJbkxvY2FsU3RvcmFnZShrZXksIGhhbmdvdXQpIHtcbiAgICBjb25zdCBoYW5nb3V0cyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSk7XG4gICAgY29uc3QgdXBkYXRlZCA9IGhhbmdvdXRzLm1hcCgoZykgPT4ge1xuICAgICAgICBpZiAoZy51c2VybmFtZSA9PT0gaGFuZ291dC51c2VybmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuIGhhbmdvdXRcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBnXG4gICAgICAgIH1cbiAgICB9KVxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkodXBkYXRlZCkpXG59XG5cbmZ1bmN0aW9uIGFkZE5ld0hhbmdvdXRUb0xvY2FsU3RvcmFnZShrZXksIGhhbmdvdXQpIHtcbiAgICBjb25zdCBoYW5nb3V0cyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSk7XG4gICAgY29uc3QgaW5zZXJ0ZWQgPSBoYW5nb3V0cy5wdXNoKGhhbmdvdXQpXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeShpbnNlcnRlZCkpXG5cbn0iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7XG4gIHVzZUNvbnRleHQsXG4gIHVzZVN0YXRlLFxuICB1c2VNZW1vLFxuICB1c2VSZWR1Y2VyLFxuICB1c2VFZmZlY3QsXG59IGZyb20gJ3ByZWFjdC9ob29rcyc7XG5pbXBvcnQgeyByZWR1Y2VyLCBpbml0U3RhdGUgfSBmcm9tICcuL3JlZHVjZXInO1xuaW1wb3J0IHsgaW5pdFdTb2NrZXQsIGxvYWRIYW5nb3V0cywgZmlsdGVySGFuZ291dHMsZmV0Y2hIYW5nb3V0IH0gZnJvbSAnLi9hY3Rpb25zJztcbmltcG9ydCB7IHVzZVNvY2tldCB9IGZyb20gJy4vdXNlU29ja2V0JztcbmltcG9ydCB7IHVzZUF1dGhDb250ZXh0IH0gZnJvbSAnLi4vLi4vYXV0aC9hdXRoLWNvbnRleHQnO1xuY29uc3QgSGFuZ291dENvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VIYW5nb3V0Q29udGV4dCgpIHtcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoSGFuZ291dENvbnRleHQpO1xuICBpZiAoIWNvbnRleHQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZUhhbmdvdXRDb250ZXh0IG11c3QgYmUgdXNlZCB3aXRoIEhhbmdvdXRzUHJvdmlkZXInKTtcbiAgfVxuXG4gIHJldHVybiBjb250ZXh0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gSGFuZ291dHNQcm92aWRlcihwcm9wcykge1xuICBjb25zdCBhdXRoQ29udGV4dCA9IHVzZUF1dGhDb250ZXh0KCk7XG4gIGNvbnN0IHsgdXNlcm5hbWUgfSA9IGF1dGhDb250ZXh0LnN0YXRlO1xuICBjb25zdCB7IHNvY2tldFVybCB9ID0gcHJvcHM7XG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlUmVkdWNlcihyZWR1Y2VyLCBpbml0U3RhdGUpO1xuICBjb25zdCB7IHNvY2tldCwgaGFuZ291dCwgaGFuZ291dHMsIHNlYXJjaCx1c2VycyB9ID0gc3RhdGU7XG4gIGNvbnN0IHNvY2tldGhhbmRsZXIgPSB1c2VTb2NrZXQoeyBkaXNwYXRjaCwgc29ja2V0LCBoYW5nb3V0IH0pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKHVzZXJuYW1lKSB7XG4gICAgICBcbiAgICAgIGluaXRXU29ja2V0KHsgdXJsOiBzb2NrZXRVcmwsIGRpc3BhdGNoLCB1c2VybmFtZSB9KTtcbiAgICAgIGxvYWRIYW5nb3V0cyh7IHVzZXJuYW1lLCBkaXNwYXRjaCB9KTtcbiAgICB9XG4gIH0sIFt1c2VybmFtZV0pO1xuXG5cblxuICBjb25zdCB2YWx1ZSA9IHVzZU1lbW8oKCkgPT4gW3N0YXRlLCBkaXNwYXRjaF0sIFtzdGF0ZV0pO1xuICByZXR1cm4gPEhhbmdvdXRDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt2YWx1ZX0gey4uLnByb3BzfSAvPjtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XG5pbXBvcnQgeyB1c2VIYW5nb3V0Q29udGV4dCB9IGZyb20gJy4vSGFuZ291dHNQcm92aWRlcic7XG5pbXBvcnQgeyB1c2VBdXRoQ29udGV4dCB9IGZyb20gJy4uLy4uL2F1dGgvYXV0aC1jb250ZXh0JztcbmltcG9ydCB7XG4gIHNlbGVjdEhhbmdvdXQsXG4gIHNlYXJjaEhhbmdvdXRzLFxuICBmaWx0ZXJIYW5nb3V0cyxcbiAgZmV0Y2hIYW5nb3V0LFxuICBzZWxlY3RVc2VyLFxuICBjaGFuZ2VNZXNzYWdlVGV4dCxcbn0gZnJvbSAnLi9hY3Rpb25zJztcbmltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi9hY3Rpb25UeXBlcyc7XG5pbXBvcnQgeyBtZXNzYWdlVG9TZXJ2ZXIsIG1lc3NhZ2VDYXRlZ29yaWVzIH0gZnJvbSAnLi9tZXNzYWdlVHlwZXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gdXNlSGFuZ291dHMoKSB7XG4gIGNvbnN0IGF1dGhDb250ZXh0ID0gdXNlQXV0aENvbnRleHQoKTtcbiAgY29uc3QgeyB1c2VybmFtZSB9ID0gYXV0aENvbnRleHQuc3RhdGU7XG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlSGFuZ291dENvbnRleHQoKTtcblxuICBjb25zdCB7IGhhbmdvdXQsIGhhbmdvdXRzLCBzb2NrZXQsIHNlYXJjaCwgdXNlcnMsIG1lc3NhZ2VUZXh0IH0gPSBzdGF0ZTtcblxuICBmdW5jdGlvbiBvblNlbGVjdEhhbmdvdXQoZSkge1xuICAgIGNvbnN0IHVzZXJuYW1lID0gZS50YXJnZXQuaWQ7XG4gICAgZGVidWdnZXI7XG4gICAgc2VsZWN0SGFuZ291dCh7IGRpc3BhdGNoLCB1c2VybmFtZSB9KTtcbiAgfVxuICBmdW5jdGlvbiBvblNlbGVjdFVzZXIoZSkge1xuICAgIGNvbnN0IHVuYW1lID0gZS50YXJnZXQuaWQ7XG4gICAgY29uc3QgdXNlciA9IHVzZXJzLmZpbmQoKHUpID0+IHUudXNlcm5hbWUgPT09IHVuYW1lKTtcbiAgICBzZWxlY3RVc2VyKHsgZGlzcGF0Y2gsIHVzZXIsIHVzZXJuYW1lIH0pO1xuICB9XG4gIGZ1bmN0aW9uIG9uSW52aXRlKCkge1xuICAgIGNvbnN0IHVwZGF0ZWRIYW5nb3V0ID0ge1xuICAgICAgLi4uaGFuZ291dCxcbiAgICAgIG1lc3NhZ2U6IHsgdGV4dDogbWVzc2FnZVRleHQsIHRpbWVzdGFtcDogIERhdGUubm93KCkgfSxcbiAgICB9O1xuICAgIGRlYnVnZ2VyO1xuICAgIHNvY2tldC5zZW5kKFxuICAgICAgSlNPTi5zdHJpbmdpZnkoeyAuLi51cGRhdGVkSGFuZ291dCwgdHlwZTogbWVzc2FnZVRvU2VydmVyLk9GRkVSIH0pXG4gICAgKTtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLk9GRkVSX1NUQVJURUQgfSk7XG4gIH1cbiAgZnVuY3Rpb24gb25BY2NlcHQoKSB7XG4gICAgc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoeyAuLi5oYW5nb3V0LCB0eXBlOiBtZXNzYWdlVG9TZXJ2ZXIuQUNDRVBUIH0pKTtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkFDQ0VQVF9TVEFSVEVELCBoYW5nb3V0IH0pO1xuICB9XG4gIGZ1bmN0aW9uIG9uQmxvY2soKSB7XG4gICAgc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoeyAuLi5oYW5nb3V0LCB0eXBlOiBtZXNzYWdlVG9TZXJ2ZXIuQmxPQ0sgfSkpO1xuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQkxPQ0tfU1RBUlRFRCwgaGFuZ291dCB9KTtcbiAgfVxuICBmdW5jdGlvbiBvblVuYmxvY2soKSB7XG4gICAgc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoeyAuLi5oYW5nb3V0LCB0eXBlOiBtZXNzYWdlVG9TZXJ2ZXIuVU5CTE9DSyB9KSk7XG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5VTkJMT0NLX1NUQVJURUQsIGhhbmdvdXQgfSk7XG4gIH1cbiAgZnVuY3Rpb24gb25EZWNsaW5lKCkge1xuICAgIHNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHsgLi4uaGFuZ291dCwgdHlwZTogbWVzc2FnZVRvU2VydmVyLkRFQ0xJTkUgfSkpO1xuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuREVDTElORV9TVEFSVEVELCBoYW5nb3V0IH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gb25NZXNzYWdlKCkge1xuICAgIHNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHsgLi4uaGFuZ291dCwgdHlwZTogbWVzc2FnZVRvU2VydmVyLk1FU1NBR0UgfSkpO1xuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTUVTU0FHRV9TVEFSVEVELCBoYW5nb3V0IH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gb25TZWFyY2goZSkge1xuICAgIHNlYXJjaEhhbmdvdXRzKHsgc2VhcmNoOiBlLnRhcmdldC52YWx1ZSwgZGlzcGF0Y2ggfSk7XG4gIH1cblxuICBmdW5jdGlvbiBvblN0YXJ0U2VhcmNoKGUpIHtcbiAgICBpZiAoaGFuZ291dHMgJiYgaGFuZ291dHMubGVuZ3RoID4gMCkge1xuICAgICAgZmlsdGVySGFuZ291dHMoeyBkaXNwYXRjaCB9KTtcbiAgICB9XG4gICAgZmV0Y2hIYW5nb3V0KHsgZGlzcGF0Y2gsIHNlYXJjaCB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uTWVzc2FnZVRleHQoZSkge1xuICAgIGNoYW5nZU1lc3NhZ2VUZXh0KHsgZGlzcGF0Y2gsIHRleHQ6IGUudGFyZ2V0LnZhbHVlIH0pO1xuICB9XG4gIHJldHVybiB7XG4gICAgb25NZXNzYWdlVGV4dCxcbiAgICBtZXNzYWdlVGV4dCxcbiAgICBvblN0YXJ0U2VhcmNoLFxuICAgIG9uU2VhcmNoLFxuICAgIHNlYXJjaCxcbiAgICBvbk1lc3NhZ2UsXG4gICAgb25JbnZpdGUsXG4gICAgb25BY2NlcHQsXG4gICAgb25CbG9jayxcbiAgICBvblVuYmxvY2ssXG4gICAgb25TZWxlY3RIYW5nb3V0LFxuICAgIG9uU2VsZWN0VXNlcixcbiAgICBvbkRlY2xpbmUsXG4gICAgaGFuZ291dCxcbiAgICBoYW5nb3V0cyxcbiAgICB1c2VycyxcbiAgfTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlTG9jYWxIYW5nb3V0KHsgaGFuZ291dCwgdXNlcm5hbWUgfSkge1xuICBjb25zdCBsb2NhbEhhbmdvdXRzID0gSlNPTi5wYXJzZShcbiAgICBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShgJHt1c2VybmFtZX0taGFuZ291dHNgKVxuICApO1xuICBjb25zdCB1cGRhdGVkSGFuZ291dHMgPSBsb2NhbEhhbmdvdXRzLm1hcCgobGgpID0+IHtcbiAgICBpZiAobGgudXNlcm5hbWUgPT09IGhhbmdvdXQudXNlcm5hbWUpIHtcbiAgICAgIHJldHVybiBoYW5nb3V0O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbGg7XG4gICAgfVxuICB9KTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcbmltcG9ydCB7IGxhenksIFN1c3BlbnNlIH0gZnJvbSAncHJlYWN0L2NvbXBhdCc7XG5pbXBvcnQgeyBSb3V0ZSwgdXNlUm91dGVDb250ZXh0IH0gZnJvbSAnLi4vcm91dGUvcm91dGVyJztcbmltcG9ydCB7IHVzZUhhbmdvdXRzIH0gZnJvbSAnLi9zdGF0ZS91c2VIYW5nb3V0cyc7XG5jb25zdCBIYW5nb3V0cyA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL0hhbmdvdXQnKSk7XG5jb25zdCBCbG9jayA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL3N0YXRlLXVpL0Jsb2NrJykpO1xuY29uc3QgQmxvY2tlZCA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL3N0YXRlLXVpL0Jsb2NrZWQnKSk7XG5jb25zdCBDb25maWd1cmUgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9zdGF0ZS11aS9Db25maWd1cmUnKSk7XG5jb25zdCBIYW5nY2hhdCA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL3N0YXRlLXVpL0hhbmdjaGF0JykpO1xuY29uc3QgSW52aXRlID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vc3RhdGUtdWkvSW52aXRlJykpO1xuY29uc3QgSW52aXRlZSA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL3N0YXRlLXVpL0ludml0ZWUnKSk7XG5jb25zdCBJbnZpdGVyID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vc3RhdGUtdWkvSW52aXRlcicpKTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTW9iaWxlKCkge1xuICBjb25zdCBbcm91dGUsIHNldFJvdXRlXSA9IHVzZVJvdXRlQ29udGV4dCgpO1xuICBjb25zdCB7XG4gICAgaGFuZ291dCxcbiAgICBoYW5nb3V0cyxcbiAgICBvbkFjY2VwdCxcbiAgICBvbkJsb2NrLFxuICAgIG9uSW52aXRlLFxuICAgIG9uU2VsZWN0SGFuZ291dCxcbiAgICBvblNlbGVjdFVzZXIsXG4gICAgb25VbmJsb2NrLFxuICAgIG9uU2VhcmNoLFxuICAgIHVzZXJzLFxuICAgIHNlYXJjaCxcbiAgICBvblN0YXJ0U2VhcmNoLFxuICAgIG9uTWVzc2FnZVRleHQsXG4gICAgbWVzc2FnZVRleHRcbiAgfSA9IHVzZUhhbmdvdXRzKCk7XG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGhhbmdvdXQpIHtcbiAgICAgIFxuICAgICAgc2V0Um91dGUoYC8ke2hhbmdvdXQuc3RhdGV9YCk7XG4gICAgfVxuICB9LCBbaGFuZ291dF0pO1xuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3sgaGVpZ2h0OiAnODV2aCcgfX0+XG4gICAgICA8Um91dGUgcGF0aD1cIi9oYW5nb3V0c1wiPlxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+TG9hZGluZy4uLjwvZGl2Pn0+XG4gICAgICAgICAgPEhhbmdvdXRzXG4gICAgICAgICAgICB1c2Vycz17dXNlcnN9XG4gICAgICAgICAgICBzZWFyY2g9e3NlYXJjaH1cbiAgICAgICAgICAgIGhhbmdvdXRzPXtoYW5nb3V0c31cbiAgICAgICAgICAgIG9uU2VsZWN0SGFuZ291dD17b25TZWxlY3RIYW5nb3V0fVxuICAgICAgICAgICAgb25TZWxlY3RVc2VyPXtvblNlbGVjdFVzZXJ9XG4gICAgICAgICAgICBvblNlYXJjaD17b25TZWFyY2h9XG4gICAgICAgICAgICBvblN0YXJ0U2VhcmNoPXtvblN0YXJ0U2VhcmNofVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvU3VzcGVuc2U+XG4gICAgICA8L1JvdXRlPlxuICAgICAgPFJvdXRlIHBhdGg9XCIvQkxPQ0tcIj5cbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxuICAgICAgICAgIDxCbG9jayBoYW5nb3V0PXtoYW5nb3V0fSBvbkJsb2NrPXtvbkJsb2NrfSAvPlxuICAgICAgICA8L1N1c3BlbnNlPlxuICAgICAgPC9Sb3V0ZT5cbiAgICAgIDxSb3V0ZSBwYXRoPVwiL0JMT0NLRURcIj5cbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxuICAgICAgICAgIDxCbG9ja2VkIGhhbmdvdXQ9e2hhbmdvdXR9IG9uVW5ibG9jaz17b25VbmJsb2NrfSAvPlxuICAgICAgICA8L1N1c3BlbnNlPlxuICAgICAgPC9Sb3V0ZT5cbiAgICAgIDxSb3V0ZSBwYXRoPVwiL2NvbmZpZ3VyZVwiPlxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+TG9hZGluZy4uLjwvZGl2Pn0+XG4gICAgICAgICAgPENvbmZpZ3VyZSBoYW5nb3V0PXtoYW5nb3V0fSAvPlxuICAgICAgICA8L1N1c3BlbnNlPlxuICAgICAgPC9Sb3V0ZT5cbiAgICAgIDxSb3V0ZSBwYXRoPVwiL0hBTkdDSEFUXCI+XG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cbiAgICAgICAgICA8SGFuZ2NoYXQgLz5cbiAgICAgICAgPC9TdXNwZW5zZT5cbiAgICAgIDwvUm91dGU+XG4gICAgICA8Um91dGUgcGF0aD1cIi9JTlZJVEVcIj5cbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxuICAgICAgICAgIDxJbnZpdGUgaGFuZ291dD17aGFuZ291dH0gb25JbnZpdGU9e29uSW52aXRlfSBvbk1lc3NhZ2VUZXh0PXtvbk1lc3NhZ2VUZXh0fSBtZXNzYWdlVGV4dD17bWVzc2FnZVRleHR9Lz5cbiAgICAgICAgPC9TdXNwZW5zZT5cbiAgICAgIDwvUm91dGU+XG4gICAgICA8Um91dGUgcGF0aD1cIi9JTlZJVEVFXCI+XG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cbiAgICAgICAgICA8SW52aXRlZSBoYW5nb3V0PXtoYW5nb3V0fSAvPlxuICAgICAgICA8L1N1c3BlbnNlPlxuICAgICAgPC9Sb3V0ZT5cbiAgICAgIDxSb3V0ZSBwYXRoPVwiL0lOVklURVJcIj5cbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxuICAgICAgICAgIDxJbnZpdGVyIGhhbmdvdXQ9e2hhbmdvdXR9IG9uQWNjZXB0PXtvbkFjY2VwdH0gLz5cbiAgICAgICAgPC9TdXNwZW5zZT5cbiAgICAgIDwvUm91dGU+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0J1xyXG5pbXBvcnQgTW9iaWxlIGZyb20gJy4vbW9iaWxlJ1xyXG5pbXBvcnQgeyBIYW5nb3V0c1Byb3ZpZGVyIH0gZnJvbSAnLi9zdGF0ZS9IYW5nb3V0c1Byb3ZpZGVyJ1xyXG5pbXBvcnQgeyBSb3V0ZVByb3ZpZGVyLCB1c2VSb3V0ZUNvbnRleHQgfSBmcm9tICcuLi9yb3V0ZS9yb3V0ZXInO1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gPEhhbmdvdXRzUHJvdmlkZXIgc29ja2V0VXJsPVwid3M6Ly9sb2NhbGhvc3Q6MzAwMC9oYW5nb3V0c1wiPlxyXG4gICAgICAgICA8Um91dGVQcm92aWRlciBpbml0aWFsUm91dGU9XCIvaGFuZ291dHNcIj5cclxuICAgICAgICAgPE1vYmlsZSAvPlxyXG5cclxuICAgICAgICAgPC9Sb3V0ZVByb3ZpZGVyPlxyXG4gICAgXHJcbiAgICA8L0hhbmdvdXRzUHJvdmlkZXI+XHJcblxyXG59Il0sIm5hbWVzIjpbImFjdGlvblR5cGVzIiwiTUVTU0FHRV9URVhUX0NIQU5HRUQiLCJTRVRfU09DS0VUIiwiTE9BRF9IQU5HT1VUUyIsIkxPQURfTUVTU0FHRVMiLCJTRUFSQ0hFRF9IQU5HT1VUIiwiU0VMRUNURURfSEFOR09VVCIsIlNFTEVDVEVEX1VTRVIiLCJGSUxURVJfSEFOR09VVFMiLCJGRVRDSF9IQU5HT1VUX1NUQVJURUQiLCJGRVRDSF9IQU5HT1VUX1NVQ0NFU1MiLCJGRVRDSF9IQU5HT1VUX0ZBSUxFRCIsIkZFVENIX0hBTkdPVVRfTk9UX0ZPVU5EIiwiRkVUQ0hfVVNFUl9TVEFSVEVEIiwiRkVUQ0hfVVNFUl9TVUNDRVNTIiwiRkVUQ0hfVVNFUl9GQUlMRUQiLCJPTkxJTkVfU1RBVEVfQ0hBTkdFRCIsIk9GRkVSX1NUQVJURUQiLCJPRkZFUl9TVUNDRVNTIiwiT0ZGRVJfRkFJTEVEIiwiQUNDRVBUX1NUQVJURUQiLCJBQ0NFUFRfU1VDQ0VTUyIsIkFDQ0VQVF9GQUlMRUQiLCJCTE9DS19TVEFSVEVEIiwiQkxPQ0tfU1VDQ0VTUyIsIkJMT0NLX0ZBSUxFRCIsIlVOQkxPQ0tfU1RBUlRFRCIsIlVOQkxPQ0tfU1VDQ0VTUyIsIlVOQkxPQ0tfRkFJTEVEIiwiTUVTU0FHRV9TVEFSVEVEIiwiTUVTU0FHRV9TVUNDRVNTIiwiTUVTU0FHRV9GQUlMRUQiLCJERUNMSU5FX1NUQVJURUQiLCJERUNMSU5FX1NVQ0NFU1MiLCJERUNMSU5FX0ZBSUxFRCIsIkhBTkdPVVRfQ0hBTkdFRF9JVFNfU1RBVEUiLCJPRkZFUkVSX1JFQ0lFVkVEIiwiQUNLTk9XTEVER0VNRU5UX1JFQ0lFVkVEIiwiaW5pdFN0YXRlIiwiaGFuZ291dHMiLCJoYW5nb3V0Iiwic29ja2V0IiwibWVzc2FnZXMiLCJzZWFyY2giLCJ1c2VyIiwibG9hZGluZyIsImVycm9yIiwibWVzc2FnZVRleHQiLCJvbmxpbmUiLCJyZWR1Y2VyIiwic3RhdGUiLCJhY3Rpb24iLCJ0eXBlIiwidGV4dCIsInVzZXJzIiwiSEFOR09VVF9OT1RfRk9VTkQiLCJmaWx0ZXIiLCJnIiwidXNlcm5hbWUiLCJpbmNsdWRlcyIsImZpbmQiLCJtYXAiLCJtZXNzYWdlc0Zyb21TZXJ2ZXIiLCJCTE9DS0VSIiwiQUNDRVBURVIiLCJVTkJMT0NLRVIiLCJPRkZFUkVSIiwiREVDTElORVIiLCJNRVNTQU5HRVIiLCJtZXNzYWdlVG9TZXJ2ZXIiLCJBQ0NFUFQiLCJERUNMSU5FIiwiT0ZGRVIiLCJCbE9DSyIsIlVOQkxPQ0siLCJNRVNTQUdFIiwibWVzc2FnZUNhdGVnb3JpZXMiLCJBQ0tOT1dMRURHRU1FTlQiLCJQRUVSIiwibG9hZEhhbmdvdXRzIiwiZGlzcGF0Y2giLCJKU09OIiwicGFyc2UiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwic2VsZWN0SGFuZ291dCIsInNlbGVjdFVzZXIiLCJzZXRJdGVtIiwic3RyaW5naWZ5Iiwic2VhcmNoSGFuZ291dHMiLCJmaWx0ZXJIYW5nb3V0cyIsImZldGNoSGFuZ291dCIsInJlc3BvbnNlIiwiZmV0Y2giLCJvayIsImpzb24iLCJsZW5ndGgiLCJmZXRjaFVzZXIiLCJjaGFuZ2VNZXNzYWdlVGV4dCIsImluaXRXU29ja2V0IiwidXJsIiwiV2ViU29ja2V0IiwibWVzc2FnZVRvSGFuZ291dCIsIm1lc3NhZ2UiLCJtZXNzYWdlVG9OZXdIYW5nb3V0IiwibXNnIiwiZW1haWwiLCJ1c2VTb2NrZXQiLCJ1c2VFZmZlY3QiLCJvbm1lc3NhZ2UiLCJkYXRhIiwiY2F0ZWdvcnkiLCJoYW5kbGVBY2tob3dsZWRnZW1lbnRzIiwiaGFuZGxlUGVlck1lc3NhZ2VzIiwiRXJyb3IiLCJvbmNsb3NlIiwib25lcnJvciIsIm9ub3BlbiIsInVwZGF0ZWRIYW5nb3V0IiwidXBkYXRlSGFuZ291dFN0YXRlSW5Mb2NhbFN0b3JhZ2UiLCJuZXdIYW5nb3V0IiwiYWRkTmV3SGFuZ291dFRvTG9jYWxTdG9yYWdlIiwia2V5IiwidXBkYXRlZCIsImluc2VydGVkIiwicHVzaCIsIkhhbmdvdXRDb250ZXh0IiwiY3JlYXRlQ29udGV4dCIsInVzZUhhbmdvdXRDb250ZXh0IiwiY29udGV4dCIsInVzZUNvbnRleHQiLCJIYW5nb3V0c1Byb3ZpZGVyIiwicHJvcHMiLCJhdXRoQ29udGV4dCIsInVzZUF1dGhDb250ZXh0Iiwic29ja2V0VXJsIiwidXNlUmVkdWNlciIsInNvY2tldGhhbmRsZXIiLCJ2YWx1ZSIsInVzZU1lbW8iLCJoIiwidXNlSGFuZ291dHMiLCJvblNlbGVjdEhhbmdvdXQiLCJlIiwidGFyZ2V0IiwiaWQiLCJvblNlbGVjdFVzZXIiLCJ1bmFtZSIsInUiLCJvbkludml0ZSIsInRpbWVzdGFtcCIsIkRhdGUiLCJub3ciLCJzZW5kIiwib25BY2NlcHQiLCJvbkJsb2NrIiwib25VbmJsb2NrIiwib25EZWNsaW5lIiwib25NZXNzYWdlIiwib25TZWFyY2giLCJvblN0YXJ0U2VhcmNoIiwib25NZXNzYWdlVGV4dCIsIkhhbmdvdXRzIiwibGF6eSIsIkJsb2NrIiwiQmxvY2tlZCIsIkNvbmZpZ3VyZSIsIkhhbmdjaGF0IiwiSW52aXRlIiwiSW52aXRlZSIsIkludml0ZXIiLCJNb2JpbGUiLCJyb3V0ZSIsInNldFJvdXRlIiwidXNlUm91dGVDb250ZXh0IiwiaGVpZ2h0IiwiU3VzcGVuc2UiXSwibWFwcGluZ3MiOiI7O0FBQU8sTUFBTUEsV0FBVyxHQUFHO0FBQ3ZCQyxFQUFBQSxvQkFBb0IsRUFBQyxzQkFERTtBQUV2QkMsRUFBQUEsVUFBVSxFQUFFLFlBRlc7QUFHdkJDLEVBQUFBLGFBQWEsRUFBRSxlQUhRO0FBSXZCQyxFQUFBQSxhQUFhLEVBQUUsZUFKUTtBQUt2QkMsRUFBQUEsZ0JBQWdCLEVBQUUsa0JBTEs7QUFNdkJDLEVBQUFBLGdCQUFnQixFQUFFLGtCQU5LO0FBT3ZCQyxFQUFBQSxhQUFhLEVBQUMsZUFQUztBQVF2QkMsRUFBQUEsZUFBZSxFQUFDLGlCQVJPO0FBVXZCQyxFQUFBQSxxQkFBcUIsRUFBRSx1QkFWQTtBQVd2QkMsRUFBQUEscUJBQXFCLEVBQUUsdUJBWEE7QUFZdkJDLEVBQUFBLG9CQUFvQixFQUFFLHNCQVpDO0FBYXZCQyxFQUFBQSx1QkFBdUIsRUFBRSx5QkFiRjtBQWdCdkJDLEVBQUFBLGtCQUFrQixFQUFFLG9CQWhCRztBQWlCdkJDLEVBQUFBLGtCQUFrQixFQUFFLG9CQWpCRztBQWtCdkJDLEVBQUFBLGlCQUFpQixF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
