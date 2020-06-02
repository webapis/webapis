import { l, M, u as useAuthContext, p, h, a as h$1, _ as _extends, w, b as useRouteContext, R as Route, c as M$1, O, d as RouteProvider } from './index-4897aeed.js';

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
  messageText: ''
};
function reducer(state, action) {
  switch (action.type) {
    case actionTypes.OFFER_STARTED:
      return { ...state,
        hangouts: state.hangouts.map(g => {
          if (g.username === action.hangout.username) {
            return action.hangout;
          } else return g;
        })
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
function initWSocket({
  url,
  dispatch
}) {
  dispatch({
    type: actionTypes.SET_SOCKET,
    socket: new WebSocket(url)
  });
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
        dispatch
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
    })); // update hangout in local storage
    //updateLocalHangout({hangout:updatedHangout,username})
    // update hangout in app state

    dispatch({
      type: actionTypes.OFFER_STARTED,
      hangout: updatedHangout
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

const Hangouts = O(() => import('./Hangout-550cce7c.js'));
const Block = O(() => import('./Block-1ca215ae.js'));
const Blocked = O(() => import('./Blocked-23321d73.js'));
const Configure = O(() => import('./Configure-8a934e9c.js'));
const Hangchat = O(() => import('./Hangchat-64c7aa1d.js'));
const Invite = O(() => import('./Invite-5eb58f38.js'));
const Invitee = O(() => import('./Invitee-d7fb906f.js'));
const Inviter = O(() => import('./Inviter-9a69e769.js'));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtZmZjYWMzNjQuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25UeXBlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9yZWR1Y2VyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL21lc3NhZ2VUeXBlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25zLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL21lc3NhZ2VDb252ZXJ0ZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvdXNlU29ja2V0LmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL0hhbmdvdXRzUHJvdmlkZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvdXNlSGFuZ291dHMuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvbW9iaWxlLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBhY3Rpb25UeXBlcyA9IHtcbiAgICBNRVNTQUdFX1RFWFRfQ0hBTkdFRDonTUVTU0FHRV9URVhUX0NIQU5HRUQnLFxuICAgIFNFVF9TT0NLRVQ6ICdTRVRfU09DS0VUJyxcbiAgICBMT0FEX0hBTkdPVVRTOiAnTE9BRF9IQU5HT1VUUycsXG4gICAgTE9BRF9NRVNTQUdFUzogJ0xPQURfTUVTU0FHRVMnLFxuICAgIFNFQVJDSEVEX0hBTkdPVVQ6ICdTRUFSQ0hFRF9IQU5HT1VUJyxcbiAgICBTRUxFQ1RFRF9IQU5HT1VUOiAnU0VMRUNURURfSEFOR09VVCcsXG4gICAgU0VMRUNURURfVVNFUjonU0VMRUNURURfVVNFUicsXG4gICAgRklMVEVSX0hBTkdPVVRTOidGSUxURVJfSEFOR09VVFMnLFxuXG4gICAgRkVUQ0hfSEFOR09VVF9TVEFSVEVEOiAnRkVUQ0hfSEFOR09VVF9TVEFSVEVEJyxcbiAgICBGRVRDSF9IQU5HT1VUX1NVQ0NFU1M6ICdGRVRDSF9IQU5HT1VUX1NVQ0NFU1MnLFxuICAgIEZFVENIX0hBTkdPVVRfRkFJTEVEOiAnRkVUQ0hfSEFOR09VVF9GQUlMRUQnLFxuICAgIEZFVENIX0hBTkdPVVRfTk9UX0ZPVU5EOiAnRkVUQ0hfSEFOR09VVF9OT1RfRk9VTkQnLFxuXG5cbiAgICBGRVRDSF9VU0VSX1NUQVJURUQ6ICdGRVRDSF9VU0VSX1NUQVJURUQnLFxuICAgIEZFVENIX1VTRVJfU1VDQ0VTUzogJ0ZFVENIX1VTRVJfU1VDQ0VTUycsXG4gICAgRkVUQ0hfVVNFUl9GQUlMRUQ6ICdGRVRDSF9VU0VSX0ZBSUxFRCcsXG5cblxuICAgIE9OTElORV9TVEFURV9DSEFOR0VEOiAnT05MSU5FX1NUQVRFX0NIQU5HRUQnLFxuXG5cbiAgICBPRkZFUl9TVEFSVEVEOiAnT0ZGRVJfU1RBUlRFRCcsXG4gICAgT0ZGRVJfU1VDQ0VTUzogJ09GRkVSX1NVQ0NFU1MnLFxuICAgIE9GRkVSX0ZBSUxFRDogJ09GRkVSX0ZBSUxFRCcsXG5cbiAgICBBQ0NFUFRfU1RBUlRFRDogJ0FDQ0VQVF9TVEFSVEVEJyxcbiAgICBBQ0NFUFRfU1VDQ0VTUzogJ0FDQ0VQVF9TVUNDRVNTJyxcbiAgICBBQ0NFUFRfRkFJTEVEOiAnQUNDRVBUX0ZBSUxFRCcsXG5cbiAgICBCTE9DS19TVEFSVEVEOiAnQkxPQ0tfU1RBUlRFRCcsXG4gICAgQkxPQ0tfU1VDQ0VTUzogJ0JMT0NLX1NVQ0NFU1MnLFxuICAgIEJMT0NLX0ZBSUxFRDogJ0JMT0NLX0ZBSUxFRCcsXG5cbiAgICBVTkJMT0NLX1NUQVJURUQ6ICdVTkJMT0NLX1NUQVJURUQnLFxuICAgIFVOQkxPQ0tfU1VDQ0VTUzogJ1VOQkxPQ0tfU1VDQ0VTUycsXG4gICAgVU5CTE9DS19GQUlMRUQ6ICdVTkJMT0NLX0ZBSUxFRCcsXG5cbiAgICBNRVNTQUdFX1NUQVJURUQ6ICdNRVNTQUdFX1NUQVJURUQnLFxuICAgIE1FU1NBR0VfU1VDQ0VTUzogJ01FU1NBR0VfU1VDQ0VTUycsXG4gICAgTUVTU0FHRV9GQUlMRUQ6ICdNRVNTQUdFX0ZBSUxFRCcsXG5cbiAgICBERUNMSU5FX1NUQVJURUQ6J0RFQ0xJTkVfU1RBUlRFRCcsXG4gICAgREVDTElORV9TVUNDRVNTOidERUNMSU5FX1NVQ0NFU1MnLFxuICAgIERFQ0xJTkVfRkFJTEVEOidERUNMSU5FX0ZBSUxFRCcsXG5cbiAgICBIQU5HT1VUX0NIQU5HRURfSVRTX1NUQVRFOiAnSEFOR09VVF9DSEFOR0VEX0lUU19TVEFURScsXG4gICAgT0ZGRVJFUl9SRUNJRVZFRDogJ09GRkVSRVJfUkVDSUVWRUQnLFxuICAgIEFDS05PV0xFREdFTUVOVF9SRUNJRVZFRDonQUNLTk9XTEVER0VNRU5UX1JFQ0lFVkVEJ1xufSIsImltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi9hY3Rpb25UeXBlcyc7XG5leHBvcnQgY29uc3QgaW5pdFN0YXRlID0ge1xuICBoYW5nb3V0czogW10sXG4gIGhhbmdvdXQ6IG51bGwsXG4gIHNvY2tldDogbnVsbCxcbiAgbWVzc2FnZXM6IFtdLFxuICBzZWFyY2g6ICcnLFxuICB1c2VyOiBbXSxcbiAgbG9hZGluZzogZmFsc2UsXG4gIGVycm9yOiBudWxsLFxuICBtZXNzYWdlVGV4dDogJycsXG59O1xuZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZXIoc3RhdGUsIGFjdGlvbikge1xuICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5PRkZFUl9TVEFSVEVEOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIGhhbmdvdXRzOiBzdGF0ZS5oYW5nb3V0cy5tYXAoKGcpID0+IHtcbiAgICAgICAgICBpZiAoZy51c2VybmFtZSA9PT0gYWN0aW9uLmhhbmdvdXQudXNlcm5hbWUpIHtcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24uaGFuZ291dDtcbiAgICAgICAgICB9IGVsc2UgcmV0dXJuIGc7XG4gICAgICAgIH0pLFxuICAgICAgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLk1FU1NBR0VfVEVYVF9DSEFOR0VEOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIG1lc3NhZ2VUZXh0OiBhY3Rpb24udGV4dCB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuRkVUQ0hfVVNFUl9GQUlMRUQ6XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX0ZBSUxFRDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiBmYWxzZSwgZXJyb3I6IGFjdGlvbi5lcnJvciB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuRkVUQ0hfVVNFUl9TVEFSVEVEOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IHRydWUgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX1VTRVJfU1VDQ0VTUzpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgdXNlcnM6IGFjdGlvbi51c2VycyxcbiAgICAgIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NUQVJURUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogdHJ1ZSB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9TVUNDRVNTOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBoYW5nb3V0czogYWN0aW9uLmhhbmdvdXRzIH07XG5cbiAgICBjYXNlIGFjdGlvblR5cGVzLkhBTkdPVVRfTk9UX0ZPVU5EOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GSUxURVJfSEFOR09VVFM6XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgaGFuZ291dHM6IHN0YXRlLmhhbmdvdXRzLmZpbHRlcigoZykgPT5cbiAgICAgICAgICBnLnVzZXJuYW1lLmluY2x1ZGVzKHN0YXRlLnNlYXJjaClcbiAgICAgICAgKSxcbiAgICAgIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TRUFSQ0hFRF9IQU5HT1VUOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHNlYXJjaDogYWN0aW9uLnNlYXJjaCB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuTE9BRF9IQU5HT1VUUzpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBoYW5nb3V0czogYWN0aW9uLmhhbmdvdXRzIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TRVRfU09DS0VUOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHNvY2tldDogYWN0aW9uLnNvY2tldCB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0VMRUNURURfVVNFUjpcbiAgICAgIGlmIChzdGF0ZS5oYW5nb3V0cykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLnN0YXRlLFxuICAgICAgICAgIGhhbmdvdXRzOiBbLi4uc3RhdGUuaGFuZ291dHMsIGFjdGlvbi5oYW5nb3V0XSxcbiAgICAgICAgICBoYW5nb3V0OiBhY3Rpb24uaGFuZ291dCxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBoYW5nb3V0czogW2FjdGlvbi5oYW5nb3V0XSxcbiAgICAgICAgaGFuZ291dDogYWN0aW9uLmhhbmdvdXQsXG4gICAgICB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0VMRUNURURfSEFOR09VVDpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBoYW5nb3V0OiBzdGF0ZS5oYW5nb3V0cy5maW5kKChnKSA9PiBnLnVzZXJuYW1lID09PSBhY3Rpb24udXNlcm5hbWUpLFxuICAgICAgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkhBTkdPVVRfQ0hBTkdFRF9JVFNfU1RBVEU6XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5BQ0tOT1dMRURHRU1FTlRfUkVDSUVWRUQ6XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgaGFuZ291dHM6IHN0YXRlLmhhbmdvdXRzLm1hcCgoZykgPT4ge1xuICAgICAgICAgIGlmIChnLnVzZXJuYW1lID09PSBhY3Rpb24uaGFuZ291dC51c2VybmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5oYW5nb3V0O1xuICAgICAgICAgIH0gZWxzZSByZXR1cm4gZztcbiAgICAgICAgfSksXG4gICAgICB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuT0ZGRVJFUl9SRUNJRVZFRDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBoYW5nb3V0czogWy4uLnN0YXRlLmhhbmdvdXRzLCBhY3Rpb24uaGFuZ291dF0gfTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHN0YXRlO1xuICB9XG59XG4iLCJleHBvcnQgY29uc3QgYWNrbm93bGVkZ21lbnRUeXBlcyA9IHtcbiAgICBPRkZFUkVEOiAnT0ZGRVJFRCcsXG4gICAgQUNDRVBURUQ6ICdBQ0NFUFRFRCcsXG4gICAgQkxPQ0tFRDogJ0JMT0NLRUQnLFxuICAgIFVOQkxPQ0tFRDogJ1VOQkxPQ0tFRCcsXG4gICAgREVDTElORUQ6ICdERUNMSU5FRCcsXG4gICAgTUVTU0FHRUQ6ICdNRVNTQUdFRCdcbn1cblxuXG5leHBvcnQgY29uc3QgbWVzc2FnZXNGcm9tU2VydmVyID0ge1xuICAgIEJMT0NLRVI6ICdCTE9DS0VSJyxcbiAgICBBQ0NFUFRFUjogJ0FDQ0VQVEVSJyxcbiAgICBVTkJMT0NLRVI6ICdVTkJMT0NLRVInLFxuICAgIE9GRkVSRVI6ICdPRkZFUkVSJyxcbiAgICBERUNMSU5FUjogJ0RFQ0xJTkVSJyxcbiAgICBNRVNTQU5HRVI6ICdNRVNTQU5HRVInXG5cbn1cblxuZXhwb3J0IGNvbnN0IG1lc3NhZ2VUb1NlcnZlciA9IHtcbiAgICBBQ0NFUFQ6ICdBQ0NFUFQnLFxuICAgIERFQ0xJTkU6ICdERUNMSU5FJyxcbiAgICBPRkZFUjogJ09GRkVSJyxcbiAgICBCbE9DSzogJ0JsT0NLJyxcbiAgICBVTkJMT0NLOiAnVU5CTE9DSycsXG4gICAgTUVTU0FHRTogJ01FU1NBR0UnXG5cbn1cbi8vIHNlcnZlciBzaWRlIG1lc3NhZ2VcbmV4cG9ydCBjb25zdCBtZXNzYWdlQ2F0ZWdvcmllcz17XG4gICAgQUNLTk9XTEVER0VNRU5UOidBQ0tOT1dMRURHRU1FTlQnLFxuICAgIFBFRVI6J1BFRVInXG59IiwiaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuL2FjdGlvblR5cGVzJztcbmltcG9ydCB7IG1lc3NhZ2VzRnJvbVNlcnZlciB9IGZyb20gJy4vbWVzc2FnZVR5cGVzJztcblxuLy9yZXRyaWV2ZXMgaGFuZ291dHMgZnJvbSBsb2NhbFN0b3JhZ2VcbmV4cG9ydCBmdW5jdGlvbiBsb2FkSGFuZ291dHMoeyB1c2VybmFtZSwgZGlzcGF0Y2ggfSkge1xuICBjb25zdCBoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oYCR7dXNlcm5hbWV9LWhhbmdvdXRzYCkpO1xuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkxPQURfSEFOR09VVFMsIGhhbmdvdXRzIH0pO1xufVxuLy9zZWxlY3QgaGFuZ291dCBmcm9tIExpc3RcbmV4cG9ydCBmdW5jdGlvbiBzZWxlY3RIYW5nb3V0KHsgZGlzcGF0Y2gsIHVzZXJuYW1lIH0pIHtcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TRUxFQ1RFRF9IQU5HT1VULCB1c2VybmFtZSB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdFVzZXIoe2Rpc3BhdGNoLCB1c2VyLHVzZXJuYW1lfSl7XG4gIC8vIHNhdmUgc2VsZWN0ZWQgdXNlciB0byBoYW5nb3V0c1xuICBjb25zdCBoYW5nb3V0ID0gey4uLnVzZXIsIHN0YXRlOidJTlZJVEUnfVxuICBjb25zdCBoYW5nb3V0cyA9SlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShgJHt1c2VybmFtZX0taGFuZ291dHNgKSlcbiBcbiAgaWYoaGFuZ291dHMpe1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGAke3VzZXJuYW1lfS1oYW5nb3V0c2AsIEpTT04uc3RyaW5naWZ5KFsuLi5oYW5nb3V0cyxoYW5nb3V0XSkpXG4gIH1cbiAgZWxzZXtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShgJHt1c2VybmFtZX0taGFuZ291dHNgLCBKU09OLnN0cmluZ2lmeShbaGFuZ291dF0pKVxuICB9XG5cbiAgZGlzcGF0Y2goe3R5cGU6YWN0aW9uVHlwZXMuU0VMRUNURURfVVNFUixoYW5nb3V0fSlcbn1cbi8vc2VhcmNoIGZvciBoYW5nb3V0IGJ5IHR5cGluZyBpbnRvIFRleHRJbnB1dFxuZXhwb3J0IGZ1bmN0aW9uIHNlYXJjaEhhbmdvdXRzKHsgc2VhcmNoLCBkaXNwYXRjaCB9KSB7XG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VBUkNIRURfSEFOR09VVCwgc2VhcmNoIH0pO1xufVxuLy9maWx0ZXIgaGFuZ291dCBhZnRlciBzZWFyY2ggc3RhdGUgY2hhbmdlXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVySGFuZ291dHMoeyBkaXNwYXRjaCB9KSB7XG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRklMVEVSX0hBTkdPVVRTIH0pO1xufVxuXG4vL2ZldGNoIGhhbmdvdXQgZnJvbSBzZXJ2ZXIgaWYgbm90IGZvdW5kIGluIGxvY2FsIGhhbmdvdXRzXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hIYW5nb3V0KHsgc2VhcmNoLCBkaXNwYXRjaCB9KSB7XG4gIFxuICB0cnkge1xuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9TVEFSVEVEIH0pO1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYC9oYW5nb3V0cy9maW5kP3NlYXJjaD0ke3NlYXJjaH1gKTtcblxuICAgaWYocmVzcG9uc2Uub2spe1xuICAgIGNvbnN0IHsgaGFuZ291dHMgfSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcblxuICAgIGlmIChoYW5nb3V0cy5sZW5ndGggPiAwKSB7XG5cbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9TVUNDRVNTLCBoYW5nb3V0cyB9KTtcbiAgICB9ICBlbHNle1xuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX05PVF9GT1VORCB9KTtcbiAgICAgIC8vIGZldGNoIHVzZXIgZnJvbSBzZXJ2ZXIgaW4gaGFuZ291dCBpcyBuZXd1c2VyXG4gICAgICBmZXRjaFVzZXIoeyBzZWFyY2gsIGRpc3BhdGNoIH0pO1xuICAgICB9XG5cbiAgIH1cbiAgIGVsc2V7XG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX05PVF9GT1VORCB9KTtcbiAgICAvLyBmZXRjaCB1c2VyIGZyb20gc2VydmVyIGluIGhhbmdvdXQgaXMgbmV3dXNlclxuICAgIGZldGNoVXNlcih7IHNlYXJjaCwgZGlzcGF0Y2ggfSk7XG4gICB9XG5cbiAgfSBjYXRjaCAoZXJyb3IpIHtcblxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9GQUlMRUQsIGVycm9yIH0pO1xuICB9XG59XG4gIC8vIGZldGNoIHVzZXIgZnJvbSBzZXJ2ZXIgaW4gaGFuZ291dCBpcyBuZXd1c2VyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hVc2VyKHsgc2VhcmNoLCBkaXNwYXRjaCB9KSB7XG5cbiAgdHJ5IHtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX1VTRVJfU1RBUlRFRCB9KTtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAvdXNlcnMvZmluZD9zZWFyY2g9JHtzZWFyY2h9YCk7XG4gICAgY29uc3QgeyB1c2VycyB9ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9VU0VSX1NVQ0NFU1MsIHVzZXJzIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfVVNFUl9GQUlMRUQsIGVycm9yIH0pO1xuICB9XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGluaXRXU29ja2V0KHsgdXJsLCBkaXNwYXRjaCB9KSB7XG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VUX1NPQ0tFVCwgc29ja2V0OiBuZXcgV2ViU29ja2V0KHVybCkgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjaGFuZ2VNZXNzYWdlVGV4dCh7dGV4dCxkaXNwYXRjaH0pe1xuZGlzcGF0Y2goe3R5cGU6YWN0aW9uVHlwZXMuTUVTU0FHRV9URVhUX0NIQU5HRUQsdGV4dH0pXG5cbn0iLCJleHBvcnQgZnVuY3Rpb24gaGFuZ291dFRvTWVzc2FnZSh7IGhhbmdvdXQsIHR5cGUgfSkge1xuIFxuICAgIHJldHVybnsgdXNlcm5hbWU6IGhhbmdvdXQudXNlcm5hbWUsIHR5cGUsIG1lc3NhZ2U6IGhhbmdvdXQubWVzc2FnZSB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtZXNzYWdlVG9IYW5nb3V0KHsgbWVzc2FnZSwgaGFuZ291dCB9KSB7XG4gIFxuICAgIHJldHVybiB7IC4uLmhhbmdvdXQsIHN0YXRlOiBtZXNzYWdlLnR5cGUsIG1lc3NhZ2U6IG1lc3NhZ2UgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbWVzc2FnZVRvTmV3SGFuZ291dChtc2cpIHtcbiAgICBjb25zdCB7IHVzZXJuYW1lLCBlbWFpbCwgdHlwZSwgbWVzc2FnZSB9ID0gbXNnXG4gICAgY29uc3QgaGFuZ291dCA9IHsgdXNlcm5hbWUsIHN0YXRlOiB0eXBlLCBlbWFpbCwgbWVzc2FnZSB9XG4gICAgcmV0dXJuIGhhbmdvdXRcbn0iLCJpbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnXG5pbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4vYWN0aW9uVHlwZXMnXG5pbXBvcnQgeyBtZXNzYWdlVG9IYW5nb3V0LCBtZXNzYWdlVG9OZXdIYW5nb3V0IH0gZnJvbSAnLi9tZXNzYWdlQ29udmVydGVyJ1xuaW1wb3J0IHsgbWVzc2FnZXNGcm9tU2VydmVyLCBtZXNzYWdlQ2F0ZWdvcmllcyB9IGZyb20gJy4vbWVzc2FnZVR5cGVzJ1xuZXhwb3J0IGZ1bmN0aW9uIHVzZVNvY2tldCh7IHNvY2tldCwgZGlzcGF0Y2gsIGhhbmdvdXQgfSkge1xuXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgaWYgKHNvY2tldCkge1xuICAgICAgICAgICAgc29ja2V0Lm9ubWVzc2FnZSA9IChtZXNzYWdlKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgbXNnID0gSlNPTi5wYXJzZShtZXNzYWdlLmRhdGEpXG4gICAgICAgICAgICAgICAgc3dpdGNoIChtc2cuY2F0ZWdvcnkpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBtZXNzYWdlQ2F0ZWdvcmllcy5BQ0tOT1dMRURHRU1FTlQ6XG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVBY2tob3dsZWRnZW1lbnRzKHsgZGlzcGF0Y2gsIG1zZyxoYW5nb3V0IH0pXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgbWVzc2FnZUNhdGVnb3JpZXMuUEVFUjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZVBlZXJNZXNzYWdlcyh7IGRpc3BhdGNoLCBtc2csIGhhbmdvdXQgfSlcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTWVzc2FnZSBjYXRlb3J5IGlzIG5vdCBkZWZpbmVkJylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzb2NrZXQub25jbG9zZSA9ICgpID0+IHtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNvY2tldC5vbmVycm9yID0gKGVycm9yKSA9PiB7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LCBbc29ja2V0XSlcblxuICAgIHJldHVybiBudWxsXG59XG5cblxuZnVuY3Rpb24gaGFuZGxlQWNraG93bGVkZ2VtZW50cyh7IGRpc3BhdGNoLCBtc2csaGFuZ291dCB9KSB7XG4gICAgbGV0IHVwZGF0ZWRIYW5nb3V0ID0gbWVzc2FnZVRvSGFuZ291dCh7IGhhbmdvdXQsIG1lc3NhZ2U6IG1zZyB9KVxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQUNLTk9XTEVER0VNRU5UX1JFQ0lFVkVELCBoYW5nb3V0OiB1cGRhdGVkSGFuZ291dCB9KVxuICAgIHVwZGF0ZUhhbmdvdXRTdGF0ZUluTG9jYWxTdG9yYWdlKGAke3VzZXJuYW1lfS1oYW5nb3V0c2AsIHVwZGF0ZWRIYW5nb3V0KVxufVxuXG5mdW5jdGlvbiBoYW5kbGVQZWVyTWVzc2FnZXMoeyBkaXNwYXRjaCwgbXNnLCBoYW5nb3V0IH0pIHtcbiAgICBsZXQgdXBkYXRlZEhhbmdvdXQgPSBtZXNzYWdlVG9IYW5nb3V0KHsgaGFuZ291dCwgbWVzc2FnZTogbXNnIH0pXG4gICAgbGV0IG5ld0hhbmdvdXQgPW1lc3NhZ2VUb05ld0hhbmdvdXQobXNnKVxuICAgIHN3aXRjaCAobXNnLnR5cGUpIHtcbiAgICAgICAgY2FzZSBtZXNzYWdlc0Zyb21TZXJ2ZXIuQkxPQ0tFUjpcbiAgICAgICAgY2FzZSBtZXNzYWdlc0Zyb21TZXJ2ZXIuREVDTElORVI6XG4gICAgICAgIGNhc2UgbWVzc2FnZXNGcm9tU2VydmVyLk1FU1NBTkdFUjpcbiAgICAgICAgY2FzZSBtZXNzYWdlc0Zyb21TZXJ2ZXIuVU5CTE9DS0VSOlxuICAgICAgICBjYXNlIG1lc3NhZ2VzRnJvbVNlcnZlci5BQ0NFUFRFUjpcbiAgICAgICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuSEFOR09VVF9DSEFOR0VEX0lUU19TVEFURSwgaGFuZ291dDp1cGRhdGVkSGFuZ291dCB9KVxuICAgICAgICAgICAgdXBkYXRlSGFuZ291dFN0YXRlSW5Mb2NhbFN0b3JhZ2UoYCR7dXNlcm5hbWV9LWhhbmdvdXRzYCwgdXBkYXRlZEhhbmdvdXQpXG4gICAgICAgICAgICBjYXNlIG1lc3NhZ2VzRnJvbVNlcnZlci5PRkZFUkVSOlxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuSEFOR09VVF9DSEFOR0VEX0lUU19TVEFURSwgaGFuZ291dDpuZXdIYW5nb3V0IH0pXG4gICAgICAgICAgICAgICAgYWRkTmV3SGFuZ291dFRvTG9jYWxTdG9yYWdlKGAke3VzZXJuYW1lfS1oYW5nb3V0c2AsIHVwZGF0ZWRIYW5nb3V0KVxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNZXNzYWdlIHR5cGUgZm9yIG1lc3NhZ2VzRnJvbVNlcnZlciBpcyBub3QgZGVmaW5lZCcpXG4gICAgfVxufVxuXG5mdW5jdGlvbiB1cGRhdGVIYW5nb3V0U3RhdGVJbkxvY2FsU3RvcmFnZShrZXksIGhhbmdvdXQpIHtcbiAgICBjb25zdCBoYW5nb3V0cyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSk7XG4gICAgY29uc3QgdXBkYXRlZCA9IGhhbmdvdXRzLm1hcCgoZykgPT4ge1xuICAgICAgICBpZiAoZy51c2VybmFtZSA9PT0gaGFuZ291dC51c2VybmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuIGhhbmdvdXRcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBnXG4gICAgICAgIH1cbiAgICB9KVxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkodXBkYXRlZCkpXG59XG5cbmZ1bmN0aW9uIGFkZE5ld0hhbmdvdXRUb0xvY2FsU3RvcmFnZShrZXksIGhhbmdvdXQpIHtcbiAgICBjb25zdCBoYW5nb3V0cyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSk7XG4gICAgY29uc3QgaW5zZXJ0ZWQgPSBoYW5nb3V0cy5wdXNoKGhhbmdvdXQpXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeShpbnNlcnRlZCkpXG5cbn0iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7XG4gIHVzZUNvbnRleHQsXG4gIHVzZVN0YXRlLFxuICB1c2VNZW1vLFxuICB1c2VSZWR1Y2VyLFxuICB1c2VFZmZlY3QsXG59IGZyb20gJ3ByZWFjdC9ob29rcyc7XG5pbXBvcnQgeyByZWR1Y2VyLCBpbml0U3RhdGUgfSBmcm9tICcuL3JlZHVjZXInO1xuaW1wb3J0IHsgaW5pdFdTb2NrZXQsIGxvYWRIYW5nb3V0cywgZmlsdGVySGFuZ291dHMsZmV0Y2hIYW5nb3V0IH0gZnJvbSAnLi9hY3Rpb25zJztcbmltcG9ydCB7IHVzZVNvY2tldCB9IGZyb20gJy4vdXNlU29ja2V0JztcbmltcG9ydCB7IHVzZUF1dGhDb250ZXh0IH0gZnJvbSAnLi4vLi4vYXV0aC9hdXRoLWNvbnRleHQnO1xuY29uc3QgSGFuZ291dENvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VIYW5nb3V0Q29udGV4dCgpIHtcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoSGFuZ291dENvbnRleHQpO1xuICBpZiAoIWNvbnRleHQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZUhhbmdvdXRDb250ZXh0IG11c3QgYmUgdXNlZCB3aXRoIEhhbmdvdXRzUHJvdmlkZXInKTtcbiAgfVxuXG4gIHJldHVybiBjb250ZXh0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gSGFuZ291dHNQcm92aWRlcihwcm9wcykge1xuICBjb25zdCBhdXRoQ29udGV4dCA9IHVzZUF1dGhDb250ZXh0KCk7XG4gIGNvbnN0IHsgdXNlcm5hbWUgfSA9IGF1dGhDb250ZXh0LnN0YXRlO1xuICBjb25zdCB7IHNvY2tldFVybCB9ID0gcHJvcHM7XG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlUmVkdWNlcihyZWR1Y2VyLCBpbml0U3RhdGUpO1xuICBjb25zdCB7IHNvY2tldCwgaGFuZ291dCwgaGFuZ291dHMsIHNlYXJjaCx1c2VycyB9ID0gc3RhdGU7XG4gIGNvbnN0IHNvY2tldGhhbmRsZXIgPSB1c2VTb2NrZXQoeyBkaXNwYXRjaCwgc29ja2V0LCBoYW5nb3V0IH0pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKHVzZXJuYW1lKSB7XG4gICAgICBcbiAgICAgIGluaXRXU29ja2V0KHsgdXJsOiBzb2NrZXRVcmwsIGRpc3BhdGNoIH0pO1xuICAgICAgbG9hZEhhbmdvdXRzKHsgdXNlcm5hbWUsIGRpc3BhdGNoIH0pO1xuICAgIH1cbiAgfSwgW3VzZXJuYW1lXSk7XG5cblxuXG4gIGNvbnN0IHZhbHVlID0gdXNlTWVtbygoKSA9PiBbc3RhdGUsIGRpc3BhdGNoXSwgW3N0YXRlXSk7XG4gIHJldHVybiA8SGFuZ291dENvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlfSB7Li4ucHJvcHN9IC8+O1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcbmltcG9ydCB7IHVzZUhhbmdvdXRDb250ZXh0IH0gZnJvbSAnLi9IYW5nb3V0c1Byb3ZpZGVyJztcbmltcG9ydCB7IHVzZUF1dGhDb250ZXh0IH0gZnJvbSAnLi4vLi4vYXV0aC9hdXRoLWNvbnRleHQnO1xuaW1wb3J0IHtcbiAgc2VsZWN0SGFuZ291dCxcbiAgc2VhcmNoSGFuZ291dHMsXG4gIGZpbHRlckhhbmdvdXRzLFxuICBmZXRjaEhhbmdvdXQsXG4gIHNlbGVjdFVzZXIsXG4gIGNoYW5nZU1lc3NhZ2VUZXh0LFxufSBmcm9tICcuL2FjdGlvbnMnO1xuaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuL2FjdGlvblR5cGVzJztcbmltcG9ydCB7IG1lc3NhZ2VUb1NlcnZlciwgbWVzc2FnZUNhdGVnb3JpZXMgfSBmcm9tICcuL21lc3NhZ2VUeXBlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VIYW5nb3V0cygpIHtcbiAgY29uc3QgYXV0aENvbnRleHQgPSB1c2VBdXRoQ29udGV4dCgpO1xuICBjb25zdCB7IHVzZXJuYW1lIH0gPSBhdXRoQ29udGV4dC5zdGF0ZTtcbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSB1c2VIYW5nb3V0Q29udGV4dCgpO1xuXG4gIGNvbnN0IHsgaGFuZ291dCwgaGFuZ291dHMsIHNvY2tldCwgc2VhcmNoLCB1c2VycywgbWVzc2FnZVRleHQgfSA9IHN0YXRlO1xuXG4gIGZ1bmN0aW9uIG9uU2VsZWN0SGFuZ291dChlKSB7XG4gICAgY29uc3QgdXNlcm5hbWUgPSBlLnRhcmdldC5pZDtcbiAgICBkZWJ1Z2dlcjtcbiAgICBzZWxlY3RIYW5nb3V0KHsgZGlzcGF0Y2gsIHVzZXJuYW1lIH0pO1xuICB9XG4gIGZ1bmN0aW9uIG9uU2VsZWN0VXNlcihlKSB7XG4gICAgY29uc3QgdW5hbWUgPSBlLnRhcmdldC5pZDtcbiAgICBjb25zdCB1c2VyID0gdXNlcnMuZmluZCgodSkgPT4gdS51c2VybmFtZSA9PT0gdW5hbWUpO1xuICAgIHNlbGVjdFVzZXIoeyBkaXNwYXRjaCwgdXNlciwgdXNlcm5hbWUgfSk7XG4gIH1cbiAgZnVuY3Rpb24gb25JbnZpdGUoKSB7XG4gICAgY29uc3QgdXBkYXRlZEhhbmdvdXQgPSB7XG4gICAgICAuLi5oYW5nb3V0LFxuICAgICAgbWVzc2FnZTogeyB0ZXh0OiBtZXNzYWdlVGV4dCwgdGltZXN0YW1wOiAgRGF0ZS5ub3coKSB9LFxuICAgIH07XG4gICAgZGVidWdnZXI7XG4gICAgc29ja2V0LnNlbmQoXG4gICAgICBKU09OLnN0cmluZ2lmeSh7IC4uLnVwZGF0ZWRIYW5nb3V0LCB0eXBlOiBtZXNzYWdlVG9TZXJ2ZXIuT0ZGRVIgfSlcbiAgICApO1xuICAgIC8vIHVwZGF0ZSBoYW5nb3V0IGluIGxvY2FsIHN0b3JhZ2VcbiAgICAvL3VwZGF0ZUxvY2FsSGFuZ291dCh7aGFuZ291dDp1cGRhdGVkSGFuZ291dCx1c2VybmFtZX0pXG4gICAgLy8gdXBkYXRlIGhhbmdvdXQgaW4gYXBwIHN0YXRlXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5PRkZFUl9TVEFSVEVELCBoYW5nb3V0OiB1cGRhdGVkSGFuZ291dCB9KTtcbiAgfVxuICBmdW5jdGlvbiBvbkFjY2VwdCgpIHtcbiAgICBzb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7IC4uLmhhbmdvdXQsIHR5cGU6IG1lc3NhZ2VUb1NlcnZlci5BQ0NFUFQgfSkpO1xuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQUNDRVBUX1NUQVJURUQsIGhhbmdvdXQgfSk7XG4gIH1cbiAgZnVuY3Rpb24gb25CbG9jaygpIHtcbiAgICBzb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7IC4uLmhhbmdvdXQsIHR5cGU6IG1lc3NhZ2VUb1NlcnZlci5CbE9DSyB9KSk7XG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5CTE9DS19TVEFSVEVELCBoYW5nb3V0IH0pO1xuICB9XG4gIGZ1bmN0aW9uIG9uVW5ibG9jaygpIHtcbiAgICBzb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7IC4uLmhhbmdvdXQsIHR5cGU6IG1lc3NhZ2VUb1NlcnZlci5VTkJMT0NLIH0pKTtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlVOQkxPQ0tfU1RBUlRFRCwgaGFuZ291dCB9KTtcbiAgfVxuICBmdW5jdGlvbiBvbkRlY2xpbmUoKSB7XG4gICAgc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoeyAuLi5oYW5nb3V0LCB0eXBlOiBtZXNzYWdlVG9TZXJ2ZXIuREVDTElORSB9KSk7XG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5ERUNMSU5FX1NUQVJURUQsIGhhbmdvdXQgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBvbk1lc3NhZ2UoKSB7XG4gICAgc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoeyAuLi5oYW5nb3V0LCB0eXBlOiBtZXNzYWdlVG9TZXJ2ZXIuTUVTU0FHRSB9KSk7XG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5NRVNTQUdFX1NUQVJURUQsIGhhbmdvdXQgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBvblNlYXJjaChlKSB7XG4gICAgc2VhcmNoSGFuZ291dHMoeyBzZWFyY2g6IGUudGFyZ2V0LnZhbHVlLCBkaXNwYXRjaCB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uU3RhcnRTZWFyY2goZSkge1xuICAgIGlmIChoYW5nb3V0cyAmJiBoYW5nb3V0cy5sZW5ndGggPiAwKSB7XG4gICAgICBmaWx0ZXJIYW5nb3V0cyh7IGRpc3BhdGNoIH0pO1xuICAgIH1cbiAgICBmZXRjaEhhbmdvdXQoeyBkaXNwYXRjaCwgc2VhcmNoIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gb25NZXNzYWdlVGV4dChlKSB7XG4gICAgY2hhbmdlTWVzc2FnZVRleHQoeyBkaXNwYXRjaCwgdGV4dDogZS50YXJnZXQudmFsdWUgfSk7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBvbk1lc3NhZ2VUZXh0LFxuICAgIG1lc3NhZ2VUZXh0LFxuICAgIG9uU3RhcnRTZWFyY2gsXG4gICAgb25TZWFyY2gsXG4gICAgc2VhcmNoLFxuICAgIG9uTWVzc2FnZSxcbiAgICBvbkludml0ZSxcbiAgICBvbkFjY2VwdCxcbiAgICBvbkJsb2NrLFxuICAgIG9uVW5ibG9jayxcbiAgICBvblNlbGVjdEhhbmdvdXQsXG4gICAgb25TZWxlY3RVc2VyLFxuICAgIG9uRGVjbGluZSxcbiAgICBoYW5nb3V0LFxuICAgIGhhbmdvdXRzLFxuICAgIHVzZXJzLFxuICB9O1xufVxuXG5mdW5jdGlvbiB1cGRhdGVMb2NhbEhhbmdvdXQoeyBoYW5nb3V0LCB1c2VybmFtZSB9KSB7XG4gIGNvbnN0IGxvY2FsSGFuZ291dHMgPSBKU09OLnBhcnNlKFxuICAgIGxvY2FsU3RvcmFnZS5nZXRJdGVtKGAke3VzZXJuYW1lfS1oYW5nb3V0c2ApXG4gICk7XG4gIGNvbnN0IHVwZGF0ZWRIYW5nb3V0cyA9IGxvY2FsSGFuZ291dHMubWFwKChsaCkgPT4ge1xuICAgIGlmIChsaC51c2VybmFtZSA9PT0gaGFuZ291dC51c2VybmFtZSkge1xuICAgICAgcmV0dXJuIGhhbmdvdXQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBsaDtcbiAgICB9XG4gIH0pO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xuaW1wb3J0IHsgbGF6eSwgU3VzcGVuc2UgfSBmcm9tICdwcmVhY3QvY29tcGF0JztcbmltcG9ydCB7IFJvdXRlLCB1c2VSb3V0ZUNvbnRleHQgfSBmcm9tICcuLi9yb3V0ZS9yb3V0ZXInO1xuaW1wb3J0IHsgdXNlSGFuZ291dHMgfSBmcm9tICcuL3N0YXRlL3VzZUhhbmdvdXRzJztcbmNvbnN0IEhhbmdvdXRzID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vSGFuZ291dCcpKTtcbmNvbnN0IEJsb2NrID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vc3RhdGUtdWkvQmxvY2snKSk7XG5jb25zdCBCbG9ja2VkID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vc3RhdGUtdWkvQmxvY2tlZCcpKTtcbmNvbnN0IENvbmZpZ3VyZSA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL3N0YXRlLXVpL0NvbmZpZ3VyZScpKTtcbmNvbnN0IEhhbmdjaGF0ID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vc3RhdGUtdWkvSGFuZ2NoYXQnKSk7XG5jb25zdCBJbnZpdGUgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9zdGF0ZS11aS9JbnZpdGUnKSk7XG5jb25zdCBJbnZpdGVlID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vc3RhdGUtdWkvSW52aXRlZScpKTtcbmNvbnN0IEludml0ZXIgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9zdGF0ZS11aS9JbnZpdGVyJykpO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBNb2JpbGUoKSB7XG4gIGNvbnN0IFtyb3V0ZSwgc2V0Um91dGVdID0gdXNlUm91dGVDb250ZXh0KCk7XG4gIGNvbnN0IHtcbiAgICBoYW5nb3V0LFxuICAgIGhhbmdvdXRzLFxuICAgIG9uQWNjZXB0LFxuICAgIG9uQmxvY2ssXG4gICAgb25JbnZpdGUsXG4gICAgb25TZWxlY3RIYW5nb3V0LFxuICAgIG9uU2VsZWN0VXNlcixcbiAgICBvblVuYmxvY2ssXG4gICAgb25TZWFyY2gsXG4gICAgdXNlcnMsXG4gICAgc2VhcmNoLFxuICAgIG9uU3RhcnRTZWFyY2gsXG4gICAgb25NZXNzYWdlVGV4dCxcbiAgICBtZXNzYWdlVGV4dFxuICB9ID0gdXNlSGFuZ291dHMoKTtcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoaGFuZ291dCkge1xuICAgICAgXG4gICAgICBzZXRSb3V0ZShgLyR7aGFuZ291dC5zdGF0ZX1gKTtcbiAgICB9XG4gIH0sIFtoYW5nb3V0XSk7XG4gIHJldHVybiAoXG4gICAgPGRpdiBzdHlsZT17eyBoZWlnaHQ6ICc4NXZoJyB9fT5cbiAgICAgIDxSb3V0ZSBwYXRoPVwiL2hhbmdvdXRzXCI+XG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cbiAgICAgICAgICA8SGFuZ291dHNcbiAgICAgICAgICAgIHVzZXJzPXt1c2Vyc31cbiAgICAgICAgICAgIHNlYXJjaD17c2VhcmNofVxuICAgICAgICAgICAgaGFuZ291dHM9e2hhbmdvdXRzfVxuICAgICAgICAgICAgb25TZWxlY3RIYW5nb3V0PXtvblNlbGVjdEhhbmdvdXR9XG4gICAgICAgICAgICBvblNlbGVjdFVzZXI9e29uU2VsZWN0VXNlcn1cbiAgICAgICAgICAgIG9uU2VhcmNoPXtvblNlYXJjaH1cbiAgICAgICAgICAgIG9uU3RhcnRTZWFyY2g9e29uU3RhcnRTZWFyY2h9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9TdXNwZW5zZT5cbiAgICAgIDwvUm91dGU+XG4gICAgICA8Um91dGUgcGF0aD1cIi9CTE9DS1wiPlxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+TG9hZGluZy4uLjwvZGl2Pn0+XG4gICAgICAgICAgPEJsb2NrIGhhbmdvdXQ9e2hhbmdvdXR9IG9uQmxvY2s9e29uQmxvY2t9IC8+XG4gICAgICAgIDwvU3VzcGVuc2U+XG4gICAgICA8L1JvdXRlPlxuICAgICAgPFJvdXRlIHBhdGg9XCIvQkxPQ0tFRFwiPlxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+TG9hZGluZy4uLjwvZGl2Pn0+XG4gICAgICAgICAgPEJsb2NrZWQgaGFuZ291dD17aGFuZ291dH0gb25VbmJsb2NrPXtvblVuYmxvY2t9IC8+XG4gICAgICAgIDwvU3VzcGVuc2U+XG4gICAgICA8L1JvdXRlPlxuICAgICAgPFJvdXRlIHBhdGg9XCIvY29uZmlndXJlXCI+XG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cbiAgICAgICAgICA8Q29uZmlndXJlIGhhbmdvdXQ9e2hhbmdvdXR9IC8+XG4gICAgICAgIDwvU3VzcGVuc2U+XG4gICAgICA8L1JvdXRlPlxuICAgICAgPFJvdXRlIHBhdGg9XCIvSEFOR0NIQVRcIj5cbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxuICAgICAgICAgIDxIYW5nY2hhdCAvPlxuICAgICAgICA8L1N1c3BlbnNlPlxuICAgICAgPC9Sb3V0ZT5cbiAgICAgIDxSb3V0ZSBwYXRoPVwiL0lOVklURVwiPlxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+TG9hZGluZy4uLjwvZGl2Pn0+XG4gICAgICAgICAgPEludml0ZSBoYW5nb3V0PXtoYW5nb3V0fSBvbkludml0ZT17b25JbnZpdGV9IG9uTWVzc2FnZVRleHQ9e29uTWVzc2FnZVRleHR9IG1lc3NhZ2VUZXh0PXttZXNzYWdlVGV4dH0vPlxuICAgICAgICA8L1N1c3BlbnNlPlxuICAgICAgPC9Sb3V0ZT5cbiAgICAgIDxSb3V0ZSBwYXRoPVwiL0lOVklURUVcIj5cbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxuICAgICAgICAgIDxJbnZpdGVlIGhhbmdvdXQ9e2hhbmdvdXR9IC8+XG4gICAgICAgIDwvU3VzcGVuc2U+XG4gICAgICA8L1JvdXRlPlxuICAgICAgPFJvdXRlIHBhdGg9XCIvSU5WSVRFUlwiPlxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+TG9hZGluZy4uLjwvZGl2Pn0+XG4gICAgICAgICAgPEludml0ZXIgaGFuZ291dD17aGFuZ291dH0gb25BY2NlcHQ9e29uQWNjZXB0fSAvPlxuICAgICAgICA8L1N1c3BlbnNlPlxuICAgICAgPC9Sb3V0ZT5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnXHJcbmltcG9ydCBNb2JpbGUgZnJvbSAnLi9tb2JpbGUnXHJcbmltcG9ydCB7IEhhbmdvdXRzUHJvdmlkZXIgfSBmcm9tICcuL3N0YXRlL0hhbmdvdXRzUHJvdmlkZXInXHJcbmltcG9ydCB7IFJvdXRlUHJvdmlkZXIsIHVzZVJvdXRlQ29udGV4dCB9IGZyb20gJy4uL3JvdXRlL3JvdXRlcic7XHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiA8SGFuZ291dHNQcm92aWRlciBzb2NrZXRVcmw9XCJ3czovL2xvY2FsaG9zdDozMDAwL2hhbmdvdXRzXCI+XHJcbiAgICAgICAgIDxSb3V0ZVByb3ZpZGVyIGluaXRpYWxSb3V0ZT1cIi9oYW5nb3V0c1wiPlxyXG4gICAgICAgICA8TW9iaWxlIC8+XHJcblxyXG4gICAgICAgICA8L1JvdXRlUHJvdmlkZXI+XHJcbiAgICBcclxuICAgIDwvSGFuZ291dHNQcm92aWRlcj5cclxuXHJcbn0iXSwibmFtZXMiOlsiYWN0aW9uVHlwZXMiLCJNRVNTQUdFX1RFWFRfQ0hBTkdFRCIsIlNFVF9TT0NLRVQiLCJMT0FEX0hBTkdPVVRTIiwiTE9BRF9NRVNTQUdFUyIsIlNFQVJDSEVEX0hBTkdPVVQiLCJTRUxFQ1RFRF9IQU5HT1VUIiwiU0VMRUNURURfVVNFUiIsIkZJTFRFUl9IQU5HT1VUUyIsIkZFVENIX0hBTkdPVVRfU1RBUlRFRCIsIkZFVENIX0hBTkdPVVRfU1VDQ0VTUyIsIkZFVENIX0hBTkdPVVRfRkFJTEVEIiwiRkVUQ0hfSEFOR09VVF9OT1RfRk9VTkQiLCJGRVRDSF9VU0VSX1NUQVJURUQiLCJGRVRDSF9VU0VSX1NVQ0NFU1MiLCJGRVRDSF9VU0VSX0ZBSUxFRCIsIk9OTElORV9TVEFURV9DSEFOR0VEIiwiT0ZGRVJfU1RBUlRFRCIsIk9GRkVSX1NVQ0NFU1MiLCJPRkZFUl9GQUlMRUQiLCJBQ0NFUFRfU1RBUlRFRCIsIkFDQ0VQVF9TVUNDRVNTIiwiQUNDRVBUX0ZBSUxFRCIsIkJMT0NLX1NUQVJURUQiLCJCTE9DS19TVUNDRVNTIiwiQkxPQ0tfRkFJTEVEIiwiVU5CTE9DS19TVEFSVEVEIiwiVU5CTE9DS19TVUNDRVNTIiwiVU5CTE9DS19GQUlMRUQiLCJNRVNTQUdFX1NUQVJURUQiLCJNRVNTQUdFX1NVQ0NFU1MiLCJNRVNTQUdFX0ZBSUxFRCIsIkRFQ0xJTkVfU1RBUlRFRCIsIkRFQ0xJTkVfU1VDQ0VTUyIsIkRFQ0xJTkVfRkFJTEVEIiwiSEFOR09VVF9DSEFOR0VEX0lUU19TVEFURSIsIk9GRkVSRVJfUkVDSUVWRUQiLCJBQ0tOT1dMRURHRU1FTlRfUkVDSUVWRUQiLCJpbml0U3RhdGUiLCJoYW5nb3V0cyIsImhhbmdvdXQiLCJzb2NrZXQiLCJtZXNzYWdlcyIsInNlYXJjaCIsInVzZXIiLCJsb2FkaW5nIiwiZXJyb3IiLCJtZXNzYWdlVGV4dCIsInJlZHVjZXIiLCJzdGF0ZSIsImFjdGlvbiIsInR5cGUiLCJtYXAiLCJnIiwidXNlcm5hbWUiLCJ0ZXh0IiwidXNlcnMiLCJIQU5HT1VUX05PVF9GT1VORCIsImZpbHRlciIsImluY2x1ZGVzIiwiZmluZCIsIm1lc3NhZ2VzRnJvbVNlcnZlciIsIkJMT0NLRVIiLCJBQ0NFUFRFUiIsIlVOQkxPQ0tFUiIsIk9GRkVSRVIiLCJERUNMSU5FUiIsIk1FU1NBTkdFUiIsIm1lc3NhZ2VUb1NlcnZlciIsIkFDQ0VQVCIsIkRFQ0xJTkUiLCJPRkZFUiIsIkJsT0NLIiwiVU5CTE9DSyIsIk1FU1NBR0UiLCJtZXNzYWdlQ2F0ZWdvcmllcyIsIkFDS05PV0xFREdFTUVOVCIsIlBFRVIiLCJsb2FkSGFuZ291dHMiLCJkaXNwYXRjaCIsIkpTT04iLCJwYXJzZSIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJzZWxlY3RIYW5nb3V0Iiwic2VsZWN0VXNlciIsInNldEl0ZW0iLCJzdHJpbmdpZnkiLCJzZWFyY2hIYW5nb3V0cyIsImZpbHRlckhhbmdvdXRzIiwiZmV0Y2hIYW5nb3V0IiwicmVzcG9uc2UiLCJmZXRjaCIsIm9rIiwianNvbiIsImxlbmd0aCIsImZldGNoVXNlciIsImluaXRXU29ja2V0IiwidXJsIiwiV2ViU29ja2V0IiwiY2hhbmdlTWVzc2FnZVRleHQiLCJtZXNzYWdlVG9IYW5nb3V0IiwibWVzc2FnZSIsIm1lc3NhZ2VUb05ld0hhbmdvdXQiLCJtc2ciLCJlbWFpbCIsInVzZVNvY2tldCIsInVzZUVmZmVjdCIsIm9ubWVzc2FnZSIsImRhdGEiLCJjYXRlZ29yeSIsImhhbmRsZUFja2hvd2xlZGdlbWVudHMiLCJoYW5kbGVQZWVyTWVzc2FnZXMiLCJFcnJvciIsIm9uY2xvc2UiLCJvbmVycm9yIiwidXBkYXRlZEhhbmdvdXQiLCJ1cGRhdGVIYW5nb3V0U3RhdGVJbkxvY2FsU3RvcmFnZSIsIm5ld0hhbmdvdXQiLCJhZGROZXdIYW5nb3V0VG9Mb2NhbFN0b3JhZ2UiLCJrZXkiLCJ1cGRhdGVkIiwiaW5zZXJ0ZWQiLCJwdXNoIiwiSGFuZ291dENvbnRleHQiLCJjcmVhdGVDb250ZXh0IiwidXNlSGFuZ291dENvbnRleHQiLCJjb250ZXh0IiwidXNlQ29udGV4dCIsIkhhbmdvdXRzUHJvdmlkZXIiLCJwcm9wcyIsImF1dGhDb250ZXh0IiwidXNlQXV0aENvbnRleHQiLCJzb2NrZXRVcmwiLCJ1c2VSZWR1Y2VyIiwic29ja2V0aGFuZGxlciIsInZhbHVlIiwidXNlTWVtbyIsImgiLCJ1c2VIYW5nb3V0cyIsIm9uU2VsZWN0SGFuZ291dCIsImUiLCJ0YXJnZXQiLCJpZCIsIm9uU2VsZWN0VXNlciIsInVuYW1lIiwidSIsIm9uSW52aXRlIiwidGltZXN0YW1wIiwiRGF0ZSIsIm5vdyIsInNlbmQiLCJvbkFjY2VwdCIsIm9uQmxvY2siLCJvblVuYmxvY2siLCJvbkRlY2xpbmUiLCJvbk1lc3NhZ2UiLCJvblNlYXJjaCIsIm9uU3RhcnRTZWFyY2giLCJvbk1lc3NhZ2VUZXh0IiwiSGFuZ291dHMiLCJsYXp5IiwiQmxvY2siLCJCbG9ja2VkIiwiQ29uZmlndXJlIiwiSGFuZ2NoYXQiLCJJbnZpdGUiLCJJbnZpdGVlIiwiSW52aXRlciIsIk1vYmlsZSIsInJvdXRlIiwic2V0Um91dGUiLCJ1c2VSb3V0ZUNvbnRleHQiLCJoZWlnaHQiLCJTdXNwZW5zZSJdLCJtYXBwaW5ncyI6Ijs7QUFBTyxNQUFNQSxXQUFXLEdBQUc7QUFDdkJDLEVBQUFBLG9CQUFvQixFQUFDLHNCQURFO0FBRXZCQyxFQUFBQSxVQUFVLEVBQUUsWUFGVztBQUd2QkMsRUFBQUEsYUFBYSxFQUFFLGVBSFE7QUFJdkJDLEVBQUFBLGFBQWEsRUFBRSxlQUpRO0FBS3ZCQyxFQUFBQSxnQkFBZ0IsRUFBRSxrQkFMSztBQU12QkMsRUFBQUEsZ0JBQWdCLEVBQUUsa0JBTks7QUFPdkJDLEVBQUFBLGFBQWEsRUFBQyxlQVBTO0FBUXZCQyxFQUFBQSxlQUFlLEVBQUMsaUJBUk87QUFVdkJDLEVBQUFBLHFCQUFxQixFQUFFLHVCQVZBO0FBV3ZCQyxFQUFBQSxxQkFBcUIsRUFBRSx1QkFYQTtBQVl2QkMsRUFBQUEsb0JBQW9CLEVBQUUsc0JBWkM7QUFhdkJDLEVBQUFBLHVCQUF1QixFQUFFLHlC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
