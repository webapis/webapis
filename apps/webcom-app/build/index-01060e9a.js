import { M, u as useAuthContext, m, p, s, h, _ as _extends, T, a as useWSocketContext, b as useRouteContext, R as Route, U, L, c as RouteProvider } from './index-d0993066.js';

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
        hangout: action.hangout,
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
  HANGCHAT: 'HANGCHAT',
  UNBLOCKER: 'UNBLOCKER',
  INVITER: 'INVITER',
  DECLINER: 'DECLINER',
  MESSANGER: 'MESSANGER'
};
const messageToServer = {
  HANGCHAT: 'HANGCHAT',
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

function updateAcknowledgement({
  acknowledgement,
  hangout
}) {
  const {
    username,
    email
  } = hangout;
  const {
    type
  } = acknowledgement;
  return {
    username,
    email,
    state: type
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
  dispatch,
  hangout,
  username
}) {
  const socketContext = useWSocketContext();
  const {
    socket
  } = socketContext;
  p(() => {
    if (socket && hangout) {
      socket.onmessage = message => {
        const msg = JSON.parse(message.data);

        switch (msg.category) {
          case messageCategories.ACKNOWLEDGEMENT:
            debugger;
            handleAckhowledgements({
              dispatch,
              acknowledgement: msg,
              hangout,
              username
            });
            break;

          case messageCategories.PEER:
            handlePeerMessages({
              dispatch,
              msg,
              hangout
            });
            break;

          default:
            throw new Error('Message cateory is not defined');
        }
      };

      socket.onclose = () => {
      };

      socket.onerror = error => {
      };

      socket.onopen = () => {
      };
    }
  }, [socket, hangout]);
  return null;
}

function handleAckhowledgements({
  dispatch,
  acknowledgement,
  hangout,
  username
}) {
  let updatedHangout = updateAcknowledgement({
    hangout,
    acknowledgement
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
  const hangouts = JSON.parse(localStorage.getItem(key));

  if (hangouts) {
    const updated = hangouts.map(g => {
      if (g.username === hangout.username) {
        return hangout;
      } else {
        return g;
      }
    });
    localStorage.setItem(key, JSON.stringify(updated));
  } else {
    localStorage.setItem(key, JSON.stringify(hangout));
  }
}

function addNewHangoutToLocalStorage(key, hangout) {
  const hangouts = localStorage.getItem(key);
  const inserted = hangouts.push(hangout);
  localStorage.setItem(key, JSON.stringify(inserted));
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
      type: messageToServer.INVITE
    }));
    dispatch({
      type: actionTypes.OFFER_STARTED
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
      type: messageToServer.HANGCHAT
    }));
    dispatch({
      type: actionTypes.ACCEPT_STARTED
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

const Hangouts = L(() => import('./Hangout-5df1ce6a.js'));
const Block = L(() => import('./Block-64c316da.js'));
const Blocked = L(() => import('./Blocked-b6c2ee2e.js'));
const Configure = L(() => import('./Configure-1ec1a07a.js'));
const Hangchat = L(() => import('./Hangchat-09c8bd69.js'));
const Invite = L(() => import('./Invite-4c3112cb.js'));
const Invitee = L(() => import('./Invitee-1194943f.js'));
const Inviter = L(() => import('./Inviter-c4e26fc6.js'));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtMDEwNjBlOWEuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25UeXBlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9yZWR1Y2VyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL21lc3NhZ2VUeXBlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25zLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL0hhbmdvdXRzUHJvdmlkZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvbWVzc2FnZUNvbnZlcnRlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS91c2VTb2NrZXQuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvdXNlSGFuZ291dHMuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvbW9iaWxlLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBhY3Rpb25UeXBlcyA9IHtcclxuICAgIE1FU1NBR0VfVEVYVF9DSEFOR0VEOidNRVNTQUdFX1RFWFRfQ0hBTkdFRCcsXHJcbiAgICBMT0FEX0hBTkdPVVRTOiAnTE9BRF9IQU5HT1VUUycsXHJcbiAgICBMT0FEX01FU1NBR0VTOiAnTE9BRF9NRVNTQUdFUycsXHJcbiAgICBTRUFSQ0hFRF9IQU5HT1VUOiAnU0VBUkNIRURfSEFOR09VVCcsXHJcbiAgICBTRUxFQ1RFRF9IQU5HT1VUOiAnU0VMRUNURURfSEFOR09VVCcsXHJcbiAgICBTRUxFQ1RFRF9VU0VSOidTRUxFQ1RFRF9VU0VSJyxcclxuICAgIEZJTFRFUl9IQU5HT1VUUzonRklMVEVSX0hBTkdPVVRTJyxcclxuXHJcbiAgICBGRVRDSF9IQU5HT1VUX1NUQVJURUQ6ICdGRVRDSF9IQU5HT1VUX1NUQVJURUQnLFxyXG4gICAgRkVUQ0hfSEFOR09VVF9TVUNDRVNTOiAnRkVUQ0hfSEFOR09VVF9TVUNDRVNTJyxcclxuICAgIEZFVENIX0hBTkdPVVRfRkFJTEVEOiAnRkVUQ0hfSEFOR09VVF9GQUlMRUQnLFxyXG4gICAgRkVUQ0hfSEFOR09VVF9OT1RfRk9VTkQ6ICdGRVRDSF9IQU5HT1VUX05PVF9GT1VORCcsXHJcblxyXG5cclxuICAgIEZFVENIX1VTRVJfU1RBUlRFRDogJ0ZFVENIX1VTRVJfU1RBUlRFRCcsXHJcbiAgICBGRVRDSF9VU0VSX1NVQ0NFU1M6ICdGRVRDSF9VU0VSX1NVQ0NFU1MnLFxyXG4gICAgRkVUQ0hfVVNFUl9GQUlMRUQ6ICdGRVRDSF9VU0VSX0ZBSUxFRCcsXHJcblxyXG5cclxuICAgIE9OTElORV9TVEFURV9DSEFOR0VEOiAnT05MSU5FX1NUQVRFX0NIQU5HRUQnLFxyXG5cclxuXHJcbiAgICBPRkZFUl9TVEFSVEVEOiAnT0ZGRVJfU1RBUlRFRCcsXHJcbiAgICBPRkZFUl9TVUNDRVNTOiAnT0ZGRVJfU1VDQ0VTUycsXHJcbiAgICBPRkZFUl9GQUlMRUQ6ICdPRkZFUl9GQUlMRUQnLFxyXG5cclxuICAgIEFDQ0VQVF9TVEFSVEVEOiAnQUNDRVBUX1NUQVJURUQnLFxyXG4gICAgQUNDRVBUX1NVQ0NFU1M6ICdBQ0NFUFRfU1VDQ0VTUycsXHJcbiAgICBBQ0NFUFRfRkFJTEVEOiAnQUNDRVBUX0ZBSUxFRCcsXHJcblxyXG4gICAgQkxPQ0tfU1RBUlRFRDogJ0JMT0NLX1NUQVJURUQnLFxyXG4gICAgQkxPQ0tfU1VDQ0VTUzogJ0JMT0NLX1NVQ0NFU1MnLFxyXG4gICAgQkxPQ0tfRkFJTEVEOiAnQkxPQ0tfRkFJTEVEJyxcclxuXHJcbiAgICBVTkJMT0NLX1NUQVJURUQ6ICdVTkJMT0NLX1NUQVJURUQnLFxyXG4gICAgVU5CTE9DS19TVUNDRVNTOiAnVU5CTE9DS19TVUNDRVNTJyxcclxuICAgIFVOQkxPQ0tfRkFJTEVEOiAnVU5CTE9DS19GQUlMRUQnLFxyXG5cclxuICAgIE1FU1NBR0VfU1RBUlRFRDogJ01FU1NBR0VfU1RBUlRFRCcsXHJcbiAgICBNRVNTQUdFX1NVQ0NFU1M6ICdNRVNTQUdFX1NVQ0NFU1MnLFxyXG4gICAgTUVTU0FHRV9GQUlMRUQ6ICdNRVNTQUdFX0ZBSUxFRCcsXHJcblxyXG4gICAgREVDTElORV9TVEFSVEVEOidERUNMSU5FX1NUQVJURUQnLFxyXG4gICAgREVDTElORV9TVUNDRVNTOidERUNMSU5FX1NVQ0NFU1MnLFxyXG4gICAgREVDTElORV9GQUlMRUQ6J0RFQ0xJTkVfRkFJTEVEJyxcclxuXHJcbiAgICBIQU5HT1VUX0NIQU5HRURfSVRTX1NUQVRFOiAnSEFOR09VVF9DSEFOR0VEX0lUU19TVEFURScsXHJcbiAgICBPRkZFUkVSX1JFQ0lFVkVEOiAnT0ZGRVJFUl9SRUNJRVZFRCcsXHJcbiAgICBBQ0tOT1dMRURHRU1FTlRfUkVDSUVWRUQ6J0FDS05PV0xFREdFTUVOVF9SRUNJRVZFRCdcclxufSIsImltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi9hY3Rpb25UeXBlcyc7XHJcbmV4cG9ydCBjb25zdCBpbml0U3RhdGUgPSB7XHJcbiAgaGFuZ291dHM6IFtdLFxyXG4gIGhhbmdvdXQ6IG51bGwsXHJcblxyXG4gIG1lc3NhZ2VzOiBbXSxcclxuICBzZWFyY2g6ICcnLFxyXG4gIHVzZXI6IFtdLFxyXG4gIGxvYWRpbmc6IGZhbHNlLFxyXG4gIGVycm9yOiBudWxsLFxyXG4gIG1lc3NhZ2VUZXh0OiAnJyxcclxuICBvbmxpbmU6ZmFsc2VcclxufTtcclxuZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZXIoc3RhdGUsIGFjdGlvbikge1xyXG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuT0ZGRVJfU1RBUlRFRDpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgIGxvYWRpbmc6dHJ1ZVxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5NRVNTQUdFX1RFWFRfQ0hBTkdFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIG1lc3NhZ2VUZXh0OiBhY3Rpb24udGV4dCB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9VU0VSX0ZBSUxFRDpcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9GQUlMRUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiBmYWxzZSwgZXJyb3I6IGFjdGlvbi5lcnJvciB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9VU0VSX1NUQVJURUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiB0cnVlIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX1VTRVJfU1VDQ0VTUzpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICBsb2FkaW5nOiBmYWxzZSxcclxuICAgICAgICB1c2VyczogYWN0aW9uLnVzZXJzLFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NUQVJURUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiB0cnVlIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfU1VDQ0VTUzpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBoYW5nb3V0czogYWN0aW9uLmhhbmdvdXRzIH07XHJcblxyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5IQU5HT1VUX05PVF9GT1VORDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZJTFRFUl9IQU5HT1VUUzpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5zdGF0ZSxcclxuICAgICAgICBoYW5nb3V0czogc3RhdGUuaGFuZ291dHMuZmlsdGVyKChnKSA9PlxyXG4gICAgICAgICAgZy51c2VybmFtZS5pbmNsdWRlcyhzdGF0ZS5zZWFyY2gpXHJcbiAgICAgICAgKSxcclxuICAgICAgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0VBUkNIRURfSEFOR09VVDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHNlYXJjaDogYWN0aW9uLnNlYXJjaCB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0FEX0hBTkdPVVRTOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgaGFuZ291dHM6IGFjdGlvbi5oYW5nb3V0cyB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TRUxFQ1RFRF9VU0VSOlxyXG4gICAgICBpZiAoc3RhdGUuaGFuZ291dHMpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgICBoYW5nb3V0czogWy4uLnN0YXRlLmhhbmdvdXRzLCBhY3Rpb24uaGFuZ291dF0sXHJcbiAgICAgICAgICBoYW5nb3V0OiBhY3Rpb24uaGFuZ291dCxcclxuICAgICAgICB9O1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgaGFuZ291dHM6IFthY3Rpb24uaGFuZ291dF0sXHJcbiAgICAgICAgaGFuZ291dDogYWN0aW9uLmhhbmdvdXQsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNFTEVDVEVEX0hBTkdPVVQ6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgaGFuZ291dDogc3RhdGUuaGFuZ291dHMuZmluZCgoZykgPT4gZy51c2VybmFtZSA9PT0gYWN0aW9uLnVzZXJuYW1lKSxcclxuICAgICAgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuSEFOR09VVF9DSEFOR0VEX0lUU19TVEFURTpcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuQUNLTk9XTEVER0VNRU5UX1JFQ0lFVkVEOlxyXG4gICAgICA7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgaGFuZ291dDphY3Rpb24uaGFuZ291dCxcclxuICAgICAgICBoYW5nb3V0czogc3RhdGUuaGFuZ291dHMubWFwKChnKSA9PiB7XHJcbiAgICAgICAgICBpZiAoZy51c2VybmFtZSA9PT0gYWN0aW9uLmhhbmdvdXQudXNlcm5hbWUpIHtcclxuICAgICAgICAgICAgO1xyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLmhhbmdvdXQ7XHJcbiAgICAgICAgICB9IGVsc2UgcmV0dXJuIGc7XHJcbiAgICAgICAgfSksXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLk9GRkVSRVJfUkVDSUVWRUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBoYW5nb3V0czogWy4uLnN0YXRlLmhhbmdvdXRzLCBhY3Rpb24uaGFuZ291dF0gfTtcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHJldHVybiBzdGF0ZTtcclxuICB9XHJcbn1cclxuIiwiZXhwb3J0IGNvbnN0IGFja25vd2xlZGdtZW50VHlwZXMgPSB7XHJcbiAgICBJTlZJVEVEOiAnSU5WSVRFRCcsXHJcbiAgICBBQ0NFUFRFRDogJ0FDQ0VQVEVEJyxcclxuICAgIEJMT0NLRUQ6ICdCTE9DS0VEJyxcclxuICAgIFVOQkxPQ0tFRDogJ1VOQkxPQ0tFRCcsXHJcbiAgICBERUNMSU5FRDogJ0RFQ0xJTkVEJyxcclxuICAgIE1FU1NBR0VEOiAnTUVTU0FHRUQnXHJcbn1cclxuXHJcblxyXG5leHBvcnQgY29uc3QgbWVzc2FnZXNGcm9tU2VydmVyID0ge1xyXG4gICAgQkxPQ0tFUjogJ0JMT0NLRVInLFxyXG4gICAgSEFOR0NIQVQ6ICdIQU5HQ0hBVCcsXHJcbiAgICBVTkJMT0NLRVI6ICdVTkJMT0NLRVInLFxyXG4gICAgSU5WSVRFUjogJ0lOVklURVInLFxyXG4gICAgREVDTElORVI6ICdERUNMSU5FUicsXHJcbiAgICBNRVNTQU5HRVI6ICdNRVNTQU5HRVInXHJcblxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgbWVzc2FnZVRvU2VydmVyID0ge1xyXG4gICAgSEFOR0NIQVQ6ICdIQU5HQ0hBVCcsXHJcbiAgICBERUNMSU5FOiAnREVDTElORScsXHJcbiAgICBJTlZJVEU6ICdJTlZJVEUnLFxyXG4gICAgQmxPQ0s6ICdCbE9DSycsXHJcbiAgICBVTkJMT0NLOiAnVU5CTE9DSycsXHJcbiAgICBNRVNTQUdFOiAnTUVTU0FHRSdcclxuXHJcbn1cclxuLy8gc2VydmVyIHNpZGUgbWVzc2FnZVxyXG5leHBvcnQgY29uc3QgbWVzc2FnZUNhdGVnb3JpZXM9e1xyXG4gICAgQUNLTk9XTEVER0VNRU5UOidBQ0tOT1dMRURHRU1FTlQnLFxyXG4gICAgUEVFUjonUEVFUidcclxufSIsImltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi9hY3Rpb25UeXBlcyc7XHJcbmltcG9ydCB7IG1lc3NhZ2VzRnJvbVNlcnZlciB9IGZyb20gJy4vbWVzc2FnZVR5cGVzJztcclxuXHJcbi8vcmV0cmlldmVzIGhhbmdvdXRzIGZyb20gbG9jYWxTdG9yYWdlXHJcbmV4cG9ydCBmdW5jdGlvbiBsb2FkSGFuZ291dHMoeyB1c2VybmFtZSwgZGlzcGF0Y2ggfSkge1xyXG4gIGNvbnN0IGhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShgJHt1c2VybmFtZX0taGFuZ291dHNgKSk7XHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5MT0FEX0hBTkdPVVRTLCBoYW5nb3V0cyB9KTtcclxufVxyXG4vL3NlbGVjdCBoYW5nb3V0IGZyb20gTGlzdFxyXG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0SGFuZ291dCh7IGRpc3BhdGNoLCB1c2VybmFtZSB9KSB7XHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TRUxFQ1RFRF9IQU5HT1VULCB1c2VybmFtZSB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdFVzZXIoeyBkaXNwYXRjaCwgdXNlciwgdXNlcm5hbWUgfSkge1xyXG4gIC8vIHNhdmUgc2VsZWN0ZWQgdXNlciB0byBoYW5nb3V0c1xyXG4gIGNvbnN0IGhhbmdvdXQgPSB7IC4uLnVzZXIsIHN0YXRlOiAnSU5WSVRFJyB9O1xyXG4gIGNvbnN0IGhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShgJHt1c2VybmFtZX0taGFuZ291dHNgKSk7XHJcblxyXG4gIGlmIChoYW5nb3V0cykge1xyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXHJcbiAgICAgIGAke3VzZXJuYW1lfS1oYW5nb3V0c2AsXHJcbiAgICAgIEpTT04uc3RyaW5naWZ5KFsuLi5oYW5nb3V0cywgaGFuZ291dF0pXHJcbiAgICApO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShgJHt1c2VybmFtZX0taGFuZ291dHNgLCBKU09OLnN0cmluZ2lmeShbaGFuZ291dF0pKTtcclxuICB9XHJcblxyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VMRUNURURfVVNFUiwgaGFuZ291dCB9KTtcclxufVxyXG4vL3NlYXJjaCBmb3IgaGFuZ291dCBieSB0eXBpbmcgaW50byBUZXh0SW5wdXRcclxuZXhwb3J0IGZ1bmN0aW9uIHNlYXJjaEhhbmdvdXRzKHsgc2VhcmNoLCBkaXNwYXRjaCB9KSB7XHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TRUFSQ0hFRF9IQU5HT1VULCBzZWFyY2ggfSk7XHJcbn1cclxuLy9maWx0ZXIgaGFuZ291dCBhZnRlciBzZWFyY2ggc3RhdGUgY2hhbmdlXHJcbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJIYW5nb3V0cyh7IGRpc3BhdGNoIH0pIHtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZJTFRFUl9IQU5HT1VUUyB9KTtcclxufVxyXG5cclxuLy9mZXRjaCBoYW5nb3V0IGZyb20gc2VydmVyIGlmIG5vdCBmb3VuZCBpbiBsb2NhbCBoYW5nb3V0c1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hIYW5nb3V0KHsgc2VhcmNoLCBkaXNwYXRjaCx1c2VybmFtZSB9KSB7XHJcbiAgO1xyXG4gIHRyeSB7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfU1RBUlRFRCB9KTtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYC9oYW5nb3V0cy9maW5kP3NlYXJjaD0ke3NlYXJjaH0mdXNlcm5hbWU9JHt1c2VybmFtZX1gKTtcclxuICAgIDtcclxuICAgIGlmIChyZXNwb25zZS5vaykge1xyXG4gICAgICA7XHJcbiAgICAgIGNvbnN0IHsgaGFuZ291dHMgfSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgO1xyXG4gICAgICBpZiAoaGFuZ291dHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9TVUNDRVNTLCBoYW5nb3V0cyB9KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfTk9UX0ZPVU5EIH0pO1xyXG4gICAgICAgIC8vIGZldGNoIHVzZXIgZnJvbSBzZXJ2ZXIgaW4gaGFuZ291dCBpcyBuZXd1c2VyXHJcbiAgICAgICAgZmV0Y2hVc2VyKHsgc2VhcmNoLCBkaXNwYXRjaCB9KTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX05PVF9GT1VORCB9KTtcclxuICAgICAgLy8gZmV0Y2ggdXNlciBmcm9tIHNlcnZlciBpbiBoYW5nb3V0IGlzIG5ld3VzZXJcclxuICAgICAgZmV0Y2hVc2VyKHsgc2VhcmNoLCBkaXNwYXRjaCB9KTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgY29uc3QgZXJyID0gZXJyb3I7XHJcbiAgICA7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfRkFJTEVELCBlcnJvciB9KTtcclxuICB9XHJcbn1cclxuLy8gZmV0Y2ggdXNlciBmcm9tIHNlcnZlciBpbiBoYW5nb3V0IGlzIG5ld3VzZXJcclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoVXNlcih7IHNlYXJjaCwgZGlzcGF0Y2ggfSkge1xyXG4gIHRyeSB7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX1VTRVJfU1RBUlRFRCB9KTtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYC91c2Vycy9maW5kP3NlYXJjaD0ke3NlYXJjaH1gKTtcclxuICAgIGNvbnN0IHsgdXNlcnMgfSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX1VTRVJfU1VDQ0VTUywgdXNlcnMgfSk7XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfVVNFUl9GQUlMRUQsIGVycm9yIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNoYW5nZU1lc3NhZ2VUZXh0KHsgdGV4dCwgZGlzcGF0Y2ggfSkge1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTUVTU0FHRV9URVhUX0NIQU5HRUQsIHRleHQgfSk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7XHJcbiAgdXNlQ29udGV4dCxcclxuICB1c2VTdGF0ZSxcclxuICB1c2VNZW1vLFxyXG4gIHVzZVJlZHVjZXIsXHJcbiAgdXNlRWZmZWN0LFxyXG59IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7IHJlZHVjZXIsIGluaXRTdGF0ZSB9IGZyb20gJy4vcmVkdWNlcic7XHJcblxyXG5pbXBvcnQgeyBsb2FkSGFuZ291dHMsIGZpbHRlckhhbmdvdXRzLGZldGNoSGFuZ291dCB9IGZyb20gJy4vYWN0aW9ucyc7XHJcbmltcG9ydCB7IHVzZUF1dGhDb250ZXh0IH0gZnJvbSAnLi4vLi4vYXV0aC9hdXRoLWNvbnRleHQnO1xyXG5jb25zdCBIYW5nb3V0Q29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcclxuZXhwb3J0IGZ1bmN0aW9uIHVzZUhhbmdvdXRDb250ZXh0KCkge1xyXG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KEhhbmdvdXRDb250ZXh0KTtcclxuICBpZiAoIWNvbnRleHQpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcigndXNlSGFuZ291dENvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggSGFuZ291dHNQcm92aWRlcicpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGNvbnRleHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBIYW5nb3V0c1Byb3ZpZGVyKHByb3BzKSB7XHJcbiAgY29uc3QgYXV0aENvbnRleHQgPSB1c2VBdXRoQ29udGV4dCgpO1xyXG4gIGNvbnN0IHsgdXNlcm5hbWUgfSA9IGF1dGhDb250ZXh0LnN0YXRlO1xyXG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlUmVkdWNlcihyZWR1Y2VyLCBpbml0U3RhdGUpO1xyXG4gIGNvbnN0IHsgaGFuZ291dCB9ID0gc3RhdGU7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAodXNlcm5hbWUpIHtcclxuICAgICAgbG9hZEhhbmdvdXRzKHsgdXNlcm5hbWUsIGRpc3BhdGNoIH0pO1xyXG4gICAgfVxyXG4gIH0sIFt1c2VybmFtZV0pO1xyXG5cclxuXHJcblxyXG4gIGNvbnN0IHZhbHVlID0gdXNlTWVtbygoKSA9PiBbc3RhdGUsIGRpc3BhdGNoXSwgW3N0YXRlXSk7XHJcbiAgcmV0dXJuIDxIYW5nb3V0Q29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30gLz47XHJcbn1cclxuIiwiZXhwb3J0IGZ1bmN0aW9uIGhhbmdvdXRUb01lc3NhZ2UoeyBoYW5nb3V0LCB0eXBlIH0pIHtcclxuIFxyXG4gICAgcmV0dXJueyB1c2VybmFtZTogaGFuZ291dC51c2VybmFtZSwgdHlwZSwgbWVzc2FnZTogaGFuZ291dC5tZXNzYWdlIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZUFja25vd2xlZGdlbWVudCh7IGFja25vd2xlZGdlbWVudCwgaGFuZ291dCB9KSB7XHJcbiAgY29uc3Qge3VzZXJuYW1lLGVtYWlsfT1oYW5nb3V0XHJcbiAgY29uc3Qge3R5cGV9PWFja25vd2xlZGdlbWVudFxyXG5cclxuICAgIHJldHVybiB7IHVzZXJuYW1lLGVtYWlsLHN0YXRlOnR5cGUgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWVzc2FnZVRvTmV3SGFuZ291dChtc2cpIHtcclxuICAgIGNvbnN0IHsgdXNlcm5hbWUsIGVtYWlsLCB0eXBlLCBtZXNzYWdlIH0gPSBtc2dcclxuICAgIGNvbnN0IGhhbmdvdXQgPSB7IHVzZXJuYW1lLCBzdGF0ZTogdHlwZSwgZW1haWwsIG1lc3NhZ2UgfVxyXG4gICAgcmV0dXJuIGhhbmdvdXRcclxufSIsImltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi9hY3Rpb25UeXBlcyc7XHJcbmltcG9ydCB7IHVwZGF0ZUFja25vd2xlZGdlbWVudCwgbWVzc2FnZVRvTmV3SGFuZ291dCB9IGZyb20gJy4vbWVzc2FnZUNvbnZlcnRlcic7XHJcbmltcG9ydCB7IG1lc3NhZ2VzRnJvbVNlcnZlciwgbWVzc2FnZUNhdGVnb3JpZXMgfSBmcm9tICcuL21lc3NhZ2VUeXBlcyc7XHJcbmltcG9ydCB7IHVzZVdTb2NrZXRDb250ZXh0IH0gZnJvbSAnLi4vLi4vd3NvY2tldC9XU29ja2V0UHJvdmlkZXInO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVzZVNvY2tldCh7IGRpc3BhdGNoLCBoYW5nb3V0LCB1c2VybmFtZSB9KSB7XHJcbiAgY29uc3Qgc29ja2V0Q29udGV4dCA9IHVzZVdTb2NrZXRDb250ZXh0KCk7XHJcbiAgY29uc3QgeyBzb2NrZXQgfSA9IHNvY2tldENvbnRleHRcclxuXHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAoc29ja2V0ICYmIGhhbmdvdXQpIHtcclxuICAgICAgc29ja2V0Lm9ubWVzc2FnZSA9IChtZXNzYWdlKSA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IG1zZyA9IEpTT04ucGFyc2UobWVzc2FnZS5kYXRhKTtcclxuICAgICAgICA7XHJcbiAgICAgICAgc3dpdGNoIChtc2cuY2F0ZWdvcnkpIHtcclxuICAgICAgICAgIGNhc2UgbWVzc2FnZUNhdGVnb3JpZXMuQUNLTk9XTEVER0VNRU5UOlxyXG4gICAgICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICAgICAgaGFuZGxlQWNraG93bGVkZ2VtZW50cyh7IGRpc3BhdGNoLCBhY2tub3dsZWRnZW1lbnQ6IG1zZywgaGFuZ291dCwgdXNlcm5hbWUgfSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgY2FzZSBtZXNzYWdlQ2F0ZWdvcmllcy5QRUVSOlxyXG4gICAgICAgICAgICBoYW5kbGVQZWVyTWVzc2FnZXMoeyBkaXNwYXRjaCwgbXNnLCBoYW5nb3V0IH0pO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTWVzc2FnZSBjYXRlb3J5IGlzIG5vdCBkZWZpbmVkJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG4gICAgICBzb2NrZXQub25jbG9zZSA9ICgpID0+IHtcclxuICAgICAgICA7XHJcbiAgICAgIH07XHJcbiAgICAgIHNvY2tldC5vbmVycm9yID0gKGVycm9yKSA9PiB7XHJcbiAgICAgICAgO1xyXG4gICAgICB9O1xyXG4gICAgICBzb2NrZXQub25vcGVuID0gKCkgPT4ge1xyXG4gICAgICAgIDtcclxuICAgICAgfTtcclxuICAgIH1cclxuICB9LCBbc29ja2V0LCBoYW5nb3V0XSk7XHJcblxyXG4gIHJldHVybiBudWxsO1xyXG59XHJcblxyXG5mdW5jdGlvbiBoYW5kbGVBY2tob3dsZWRnZW1lbnRzKHsgZGlzcGF0Y2gsIGFja25vd2xlZGdlbWVudCwgaGFuZ291dCwgdXNlcm5hbWUgfSkge1xyXG5cclxuICBsZXQgdXBkYXRlZEhhbmdvdXQgPSB1cGRhdGVBY2tub3dsZWRnZW1lbnQoeyBoYW5nb3V0LCBhY2tub3dsZWRnZW1lbnQgfSk7XHJcbiAgO1xyXG4gIGRpc3BhdGNoKHtcclxuICAgIHR5cGU6IGFjdGlvblR5cGVzLkFDS05PV0xFREdFTUVOVF9SRUNJRVZFRCxcclxuICAgIGhhbmdvdXQ6IHVwZGF0ZWRIYW5nb3V0LFxyXG4gIH0pO1xyXG4gIDtcclxuICB1cGRhdGVIYW5nb3V0U3RhdGVJbkxvY2FsU3RvcmFnZShgJHt1c2VybmFtZX0taGFuZ291dHNgLCB1cGRhdGVkSGFuZ291dCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhhbmRsZVBlZXJNZXNzYWdlcyh7IGRpc3BhdGNoLCBtc2csIGhhbmdvdXQgfSkge1xyXG4gIGxldCB1cGRhdGVkSGFuZ291dCA9IG1lc3NhZ2VUb0hhbmdvdXQoeyBoYW5nb3V0LCBtZXNzYWdlOiBtc2cgfSk7XHJcbiAgbGV0IG5ld0hhbmdvdXQgPSBtZXNzYWdlVG9OZXdIYW5nb3V0KG1zZyk7XHJcbiAgc3dpdGNoIChtc2cudHlwZSkge1xyXG4gICAgY2FzZSBtZXNzYWdlc0Zyb21TZXJ2ZXIuQkxPQ0tFUjpcclxuICAgIGNhc2UgbWVzc2FnZXNGcm9tU2VydmVyLkRFQ0xJTkVSOlxyXG4gICAgY2FzZSBtZXNzYWdlc0Zyb21TZXJ2ZXIuTUVTU0FOR0VSOlxyXG4gICAgY2FzZSBtZXNzYWdlc0Zyb21TZXJ2ZXIuVU5CTE9DS0VSOlxyXG4gICAgY2FzZSBtZXNzYWdlc0Zyb21TZXJ2ZXIuQUNDRVBURVI6XHJcbiAgICAgIGRpc3BhdGNoKHtcclxuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5IQU5HT1VUX0NIQU5HRURfSVRTX1NUQVRFLFxyXG4gICAgICAgIGhhbmdvdXQ6IHVwZGF0ZWRIYW5nb3V0LFxyXG4gICAgICB9KTtcclxuICAgICAgdXBkYXRlSGFuZ291dFN0YXRlSW5Mb2NhbFN0b3JhZ2UoYCR7dXNlcm5hbWV9LWhhbmdvdXRzYCwgdXBkYXRlZEhhbmdvdXQpO1xyXG4gICAgY2FzZSBtZXNzYWdlc0Zyb21TZXJ2ZXIuSU5WSVRFUjpcclxuICAgICAgZGlzcGF0Y2goe1xyXG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLkhBTkdPVVRfQ0hBTkdFRF9JVFNfU1RBVEUsXHJcbiAgICAgICAgaGFuZ291dDogbmV3SGFuZ291dCxcclxuICAgICAgfSk7XHJcbiAgICAgIGFkZE5ld0hhbmdvdXRUb0xvY2FsU3RvcmFnZShgJHt1c2VybmFtZX0taGFuZ291dHNgLCB1cGRhdGVkSGFuZ291dCk7XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ01lc3NhZ2UgdHlwZSBmb3IgbWVzc2FnZXNGcm9tU2VydmVyIGlzIG5vdCBkZWZpbmVkJyk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVIYW5nb3V0U3RhdGVJbkxvY2FsU3RvcmFnZShrZXksIGhhbmdvdXQpIHtcclxuXHJcbiAgY29uc3QgaGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSkpO1xyXG4gIGlmIChoYW5nb3V0cykge1xyXG4gICAgY29uc3QgdXBkYXRlZCA9IGhhbmdvdXRzLm1hcCgoZykgPT4ge1xyXG4gICAgICBpZiAoZy51c2VybmFtZSA9PT0gaGFuZ291dC51c2VybmFtZSkge1xyXG5cclxuICAgICAgICByZXR1cm4gaGFuZ291dDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gZztcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KHVwZGF0ZWQpKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KGhhbmdvdXQpKTtcclxuICB9XHJcblxyXG59XHJcblxyXG5mdW5jdGlvbiBhZGROZXdIYW5nb3V0VG9Mb2NhbFN0b3JhZ2Uoa2V5LCBoYW5nb3V0KSB7XHJcbiAgY29uc3QgaGFuZ291dHMgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpO1xyXG4gIGNvbnN0IGluc2VydGVkID0gaGFuZ291dHMucHVzaChoYW5nb3V0KTtcclxuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KGluc2VydGVkKSk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgeyB1c2VIYW5nb3V0Q29udGV4dCB9IGZyb20gJy4vSGFuZ291dHNQcm92aWRlcic7XHJcbmltcG9ydCB7IHVzZUF1dGhDb250ZXh0IH0gZnJvbSAnLi4vLi4vYXV0aC9hdXRoLWNvbnRleHQnO1xyXG5pbXBvcnQgeyB1c2VXU29ja2V0Q29udGV4dCB9IGZyb20gJy4uLy4uL3dzb2NrZXQvV1NvY2tldFByb3ZpZGVyJztcclxuaW1wb3J0IHtcclxuICBzZWxlY3RIYW5nb3V0LFxyXG4gIHNlYXJjaEhhbmdvdXRzLFxyXG4gIGZpbHRlckhhbmdvdXRzLFxyXG4gIGZldGNoSGFuZ291dCxcclxuICBzZWxlY3RVc2VyLFxyXG4gIGNoYW5nZU1lc3NhZ2VUZXh0LFxyXG59IGZyb20gJy4vYWN0aW9ucyc7XHJcbmltcG9ydCB7IHVzZVNvY2tldCB9IGZyb20gJy4vdXNlU29ja2V0JztcclxuaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuL2FjdGlvblR5cGVzJztcclxuaW1wb3J0IHsgbWVzc2FnZVRvU2VydmVyLCBtZXNzYWdlQ2F0ZWdvcmllcyB9IGZyb20gJy4vbWVzc2FnZVR5cGVzJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VIYW5nb3V0cygpIHtcclxuICBjb25zdCBzb2NrZXRDb250ZXh0ID0gdXNlV1NvY2tldENvbnRleHQoKTtcclxuICBjb25zdCB7IHNvY2tldCB9ID0gc29ja2V0Q29udGV4dDtcclxuICBjb25zdCBhdXRoQ29udGV4dCA9IHVzZUF1dGhDb250ZXh0KCk7XHJcbiAgY29uc3QgeyB1c2VybmFtZSB9ID0gYXV0aENvbnRleHQuc3RhdGU7XHJcbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSB1c2VIYW5nb3V0Q29udGV4dCgpO1xyXG5cclxuICBjb25zdCB7IGhhbmdvdXQsIGhhbmdvdXRzLCBzZWFyY2gsIHVzZXJzLCBtZXNzYWdlVGV4dCB9ID0gc3RhdGU7XHJcbiAgY29uc3QgaGFuZGxlU29ja2V0ID0gdXNlU29ja2V0KHsgZGlzcGF0Y2gsIGhhbmdvdXQsIHVzZXJuYW1lIH0pO1xyXG4gIGZ1bmN0aW9uIG9uU2VsZWN0SGFuZ291dChlKSB7XHJcbiAgICBjb25zdCB1c2VybmFtZSA9IGUudGFyZ2V0LmlkO1xyXG4gICAgc2VsZWN0SGFuZ291dCh7IGRpc3BhdGNoLCB1c2VybmFtZSB9KTtcclxuICB9XHJcbiAgZnVuY3Rpb24gb25TZWxlY3RVc2VyKGUpIHtcclxuICAgIGNvbnN0IHVuYW1lID0gZS50YXJnZXQuaWQ7XHJcbiAgICBjb25zdCB1c2VyID0gdXNlcnMuZmluZCgodSkgPT4gdS51c2VybmFtZSA9PT0gdW5hbWUpO1xyXG4gICAgc2VsZWN0VXNlcih7IGRpc3BhdGNoLCB1c2VyLCB1c2VybmFtZSB9KTtcclxuICB9XHJcbiAgZnVuY3Rpb24gb25JbnZpdGUoKSB7XHJcbiAgICBjb25zdCB7IHVzZXJuYW1lLCBlbWFpbCB9ID0gaGFuZ291dDtcclxuICAgIGNvbnN0IHVwZGF0ZWRIYW5nb3V0ID0ge1xyXG4gICAgICB1c2VybmFtZSxcclxuICAgICAgZW1haWwsXHJcbiAgICAgIG1lc3NhZ2U6IHsgdGV4dDogbWVzc2FnZVRleHQsIHRpbWVzdGFtcDogRGF0ZS5ub3coKSB9LFxyXG4gICAgfTtcclxuICAgIHNvY2tldC5zZW5kKFxyXG4gICAgICBKU09OLnN0cmluZ2lmeSh7IC4uLnVwZGF0ZWRIYW5nb3V0LCB0eXBlOiBtZXNzYWdlVG9TZXJ2ZXIuSU5WSVRFIH0pXHJcbiAgICApO1xyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5PRkZFUl9TVEFSVEVEIH0pO1xyXG4gIH1cclxuICBmdW5jdGlvbiBvbkFjY2VwdCgpIHtcclxuICAgIGNvbnN0IHsgdXNlcm5hbWUsZW1haWwgfSA9IGhhbmdvdXQ7XHJcbiAgICBkZWJ1Z2dlcjtcclxuICAgIHNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHsgdXNlcm5hbWUsZW1haWwsIHR5cGU6IG1lc3NhZ2VUb1NlcnZlci5IQU5HQ0hBVCB9KSk7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkFDQ0VQVF9TVEFSVEVEfSk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIG9uQmxvY2soKSB7XHJcbiAgICBzb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7IC4uLmhhbmdvdXQsIHR5cGU6IG1lc3NhZ2VUb1NlcnZlci5CbE9DSyB9KSk7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkJMT0NLX1NUQVJURUQsIGhhbmdvdXQgfSk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIG9uVW5ibG9jaygpIHtcclxuICAgIHNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHsgLi4uaGFuZ291dCwgdHlwZTogbWVzc2FnZVRvU2VydmVyLlVOQkxPQ0sgfSkpO1xyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5VTkJMT0NLX1NUQVJURUQsIGhhbmdvdXQgfSk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIG9uRGVjbGluZSgpIHtcclxuICAgIHNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHsgLi4uaGFuZ291dCwgdHlwZTogbWVzc2FnZVRvU2VydmVyLkRFQ0xJTkUgfSkpO1xyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5ERUNMSU5FX1NUQVJURUQsIGhhbmdvdXQgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBvbk1lc3NhZ2UoKSB7XHJcbiAgICBzb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7IC4uLmhhbmdvdXQsIHR5cGU6IG1lc3NhZ2VUb1NlcnZlci5NRVNTQUdFIH0pKTtcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTUVTU0FHRV9TVEFSVEVELCBoYW5nb3V0IH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gb25TZWFyY2goZSkge1xyXG4gICAgc2VhcmNoSGFuZ291dHMoeyBzZWFyY2g6IGUudGFyZ2V0LnZhbHVlLCBkaXNwYXRjaCB9KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIG9uU3RhcnRTZWFyY2goZSkge1xyXG4gICAgaWYgKGhhbmdvdXRzICYmIGhhbmdvdXRzLmxlbmd0aCA+IDApIHtcclxuICAgICAgZmlsdGVySGFuZ291dHMoeyBkaXNwYXRjaCB9KTtcclxuICAgIH1cclxuICAgIGZldGNoSGFuZ291dCh7IGRpc3BhdGNoLCBzZWFyY2gsIHVzZXJuYW1lIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gb25NZXNzYWdlVGV4dChlKSB7XHJcbiAgICBjaGFuZ2VNZXNzYWdlVGV4dCh7IGRpc3BhdGNoLCB0ZXh0OiBlLnRhcmdldC52YWx1ZSB9KTtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBvbk1lc3NhZ2VUZXh0LFxyXG4gICAgbWVzc2FnZVRleHQsXHJcbiAgICBvblN0YXJ0U2VhcmNoLFxyXG4gICAgb25TZWFyY2gsXHJcbiAgICBzZWFyY2gsXHJcbiAgICBvbk1lc3NhZ2UsXHJcbiAgICBvbkludml0ZSxcclxuICAgIG9uQWNjZXB0LFxyXG4gICAgb25CbG9jayxcclxuICAgIG9uVW5ibG9jayxcclxuICAgIG9uU2VsZWN0SGFuZ291dCxcclxuICAgIG9uU2VsZWN0VXNlcixcclxuICAgIG9uRGVjbGluZSxcclxuICAgIGhhbmdvdXQsXHJcbiAgICBoYW5nb3V0cyxcclxuICAgIHVzZXJzLFxyXG4gIH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZUxvY2FsSGFuZ291dCh7IGhhbmdvdXQsIHVzZXJuYW1lIH0pIHtcclxuICBjb25zdCBsb2NhbEhhbmdvdXRzID0gSlNPTi5wYXJzZShcclxuICAgIGxvY2FsU3RvcmFnZS5nZXRJdGVtKGAke3VzZXJuYW1lfS1oYW5nb3V0c2ApXHJcbiAgKTtcclxuICBjb25zdCB1cGRhdGVkSGFuZ291dHMgPSBsb2NhbEhhbmdvdXRzLm1hcCgobGgpID0+IHtcclxuICAgIGlmIChsaC51c2VybmFtZSA9PT0gaGFuZ291dC51c2VybmFtZSkge1xyXG4gICAgICByZXR1cm4gaGFuZ291dDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBsaDtcclxuICAgIH1cclxuICB9KTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgbGF6eSwgU3VzcGVuc2UgfSBmcm9tICdwcmVhY3QvY29tcGF0JztcclxuaW1wb3J0IHsgUm91dGUsIHVzZVJvdXRlQ29udGV4dCB9IGZyb20gJy4uL3JvdXRlL3JvdXRlcic7XHJcbmltcG9ydCB7IHVzZUhhbmdvdXRzIH0gZnJvbSAnLi9zdGF0ZS91c2VIYW5nb3V0cyc7XHJcbmNvbnN0IEhhbmdvdXRzID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vSGFuZ291dCcpKTtcclxuY29uc3QgQmxvY2sgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9zdGF0ZS11aS9CbG9jaycpKTtcclxuY29uc3QgQmxvY2tlZCA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL3N0YXRlLXVpL0Jsb2NrZWQnKSk7XHJcbmNvbnN0IENvbmZpZ3VyZSA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL3N0YXRlLXVpL0NvbmZpZ3VyZScpKTtcclxuY29uc3QgSGFuZ2NoYXQgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9zdGF0ZS11aS9IYW5nY2hhdCcpKTtcclxuY29uc3QgSW52aXRlID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vc3RhdGUtdWkvSW52aXRlJykpO1xyXG5jb25zdCBJbnZpdGVlID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vc3RhdGUtdWkvSW52aXRlZScpKTtcclxuY29uc3QgSW52aXRlciA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL3N0YXRlLXVpL0ludml0ZXInKSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBNb2JpbGUoKSB7XHJcbiAgY29uc3QgW3JvdXRlLCBzZXRSb3V0ZV0gPSB1c2VSb3V0ZUNvbnRleHQoKTtcclxuXHJcbiAgY29uc3Qge1xyXG4gICAgaGFuZ291dCxcclxuICAgIGhhbmdvdXRzLFxyXG4gICAgb25BY2NlcHQsXHJcbiAgICBvbkJsb2NrLFxyXG4gICAgb25JbnZpdGUsXHJcbiAgICBvblNlbGVjdEhhbmdvdXQsXHJcbiAgICBvblNlbGVjdFVzZXIsXHJcbiAgICBvblVuYmxvY2ssXHJcbiAgICBvblNlYXJjaCxcclxuICAgIHVzZXJzLFxyXG4gICAgc2VhcmNoLFxyXG4gICAgb25TdGFydFNlYXJjaCxcclxuICAgIG9uTWVzc2FnZVRleHQsXHJcbiAgICBtZXNzYWdlVGV4dFxyXG4gIH0gPSB1c2VIYW5nb3V0cygpO1xyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAoaGFuZ291dCkge1xyXG4gICAgICA7XHJcbiAgICAgIHNldFJvdXRlKGAvJHtoYW5nb3V0LnN0YXRlfWApO1xyXG4gICAgfVxyXG4gIH0sIFtoYW5nb3V0XSk7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3sgaGVpZ2h0OiAnODV2aCcgfX0+XHJcbiAgICAgIDxSb3V0ZSBwYXRoPVwiL2hhbmdvdXRzXCI+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPEhhbmdvdXRzXHJcbiAgICAgICAgICAgIHVzZXJzPXt1c2Vyc31cclxuICAgICAgICAgICAgc2VhcmNoPXtzZWFyY2h9XHJcbiAgICAgICAgICAgIGhhbmdvdXRzPXtoYW5nb3V0c31cclxuICAgICAgICAgICAgb25TZWxlY3RIYW5nb3V0PXtvblNlbGVjdEhhbmdvdXR9XHJcbiAgICAgICAgICAgIG9uU2VsZWN0VXNlcj17b25TZWxlY3RVc2VyfVxyXG4gICAgICAgICAgICBvblNlYXJjaD17b25TZWFyY2h9XHJcbiAgICAgICAgICAgIG9uU3RhcnRTZWFyY2g9e29uU3RhcnRTZWFyY2h9XHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgIDwvUm91dGU+XHJcbiAgICAgIDxSb3V0ZSBwYXRoPVwiL0JMT0NLXCI+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPEJsb2NrIGhhbmdvdXQ9e2hhbmdvdXR9IG9uQmxvY2s9e29uQmxvY2t9IC8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9Sb3V0ZT5cclxuICAgICAgPFJvdXRlIHBhdGg9XCIvQkxPQ0tFRFwiPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxCbG9ja2VkIGhhbmdvdXQ9e2hhbmdvdXR9IG9uVW5ibG9jaz17b25VbmJsb2NrfSAvPlxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgIDwvUm91dGU+XHJcbiAgICAgIDxSb3V0ZSBwYXRoPVwiL2NvbmZpZ3VyZVwiPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxDb25maWd1cmUgaGFuZ291dD17aGFuZ291dH0gLz5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICA8L1JvdXRlPlxyXG4gICAgICA8Um91dGUgcGF0aD1cIi9IQU5HQ0hBVFwiPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxIYW5nY2hhdCAvPlxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgIDwvUm91dGU+XHJcbiAgICAgIDxSb3V0ZSBwYXRoPVwiL0lOVklURVwiPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxJbnZpdGUgaGFuZ291dD17aGFuZ291dH0gb25JbnZpdGU9e29uSW52aXRlfSBvbk1lc3NhZ2VUZXh0PXtvbk1lc3NhZ2VUZXh0fSBtZXNzYWdlVGV4dD17bWVzc2FnZVRleHR9Lz5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICA8L1JvdXRlPlxyXG4gICAgICA8Um91dGUgcGF0aD1cIi9JTlZJVEVEXCI+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPEludml0ZWUgaGFuZ291dD17aGFuZ291dH0gLz5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICA8L1JvdXRlPlxyXG4gICAgICA8Um91dGUgcGF0aD1cIi9JTlZJVEVSXCI+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPEludml0ZXIgaGFuZ291dD17aGFuZ291dH0gb25BY2NlcHQ9e29uQWNjZXB0fSAvPlxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgIDwvUm91dGU+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgTW9iaWxlIGZyb20gJy4vbW9iaWxlJztcclxuaW1wb3J0IHsgSGFuZ291dHNQcm92aWRlciB9IGZyb20gJy4vc3RhdGUvSGFuZ291dHNQcm92aWRlcic7XHJcbmltcG9ydCB7IFJvdXRlUHJvdmlkZXIsIHVzZVJvdXRlQ29udGV4dCB9IGZyb20gJy4uL3JvdXRlL3JvdXRlcic7XHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gKFxyXG4gICAgPEhhbmdvdXRzUHJvdmlkZXI+XHJcbiAgICAgIDxSb3V0ZVByb3ZpZGVyIGluaXRpYWxSb3V0ZT1cIi9oYW5nb3V0c1wiPlxyXG4gICAgICAgIDxNb2JpbGUgLz5cclxuICAgICAgPC9Sb3V0ZVByb3ZpZGVyPlxyXG4gICAgPC9IYW5nb3V0c1Byb3ZpZGVyPlxyXG4gICk7XHJcbn1cclxuIl0sIm5hbWVzIjpbImFjdGlvblR5cGVzIiwiTUVTU0FHRV9URVhUX0NIQU5HRUQiLCJMT0FEX0hBTkdPVVRTIiwiTE9BRF9NRVNTQUdFUyIsIlNFQVJDSEVEX0hBTkdPVVQiLCJTRUxFQ1RFRF9IQU5HT1VUIiwiU0VMRUNURURfVVNFUiIsIkZJTFRFUl9IQU5HT1VUUyIsIkZFVENIX0hBTkdPVVRfU1RBUlRFRCIsIkZFVENIX0hBTkdPVVRfU1VDQ0VTUyIsIkZFVENIX0hBTkdPVVRfRkFJTEVEIiwiRkVUQ0hfSEFOR09VVF9OT1RfRk9VTkQiLCJGRVRDSF9VU0VSX1NUQVJURUQiLCJGRVRDSF9VU0VSX1NVQ0NFU1MiLCJGRVRDSF9VU0VSX0ZBSUxFRCIsIk9OTElORV9TVEFURV9DSEFOR0VEIiwiT0ZGRVJfU1RBUlRFRCIsIk9GRkVSX1NVQ0NFU1MiLCJPRkZFUl9GQUlMRUQiLCJBQ0NFUFRfU1RBUlRFRCIsIkFDQ0VQVF9TVUNDRVNTIiwiQUNDRVBUX0ZBSUxFRCIsIkJMT0NLX1NUQVJURUQiLCJCTE9DS19TVUNDRVNTIiwiQkxPQ0tfRkFJTEVEIiwiVU5CTE9DS19TVEFSVEVEIiwiVU5CTE9DS19TVUNDRVNTIiwiVU5CTE9DS19GQUlMRUQiLCJNRVNTQUdFX1NUQVJURUQiLCJNRVNTQUdFX1NVQ0NFU1MiLCJNRVNTQUdFX0ZBSUxFRCIsIkRFQ0xJTkVfU1RBUlRFRCIsIkRFQ0xJTkVfU1VDQ0VTUyIsIkRFQ0xJTkVfRkFJTEVEIiwiSEFOR09VVF9DSEFOR0VEX0lUU19TVEFURSIsIk9GRkVSRVJfUkVDSUVWRUQiLCJBQ0tOT1dMRURHRU1FTlRfUkVDSUVWRUQiLCJpbml0U3RhdGUiLCJoYW5nb3V0cyIsImhhbmdvdXQiLCJtZXNzYWdlcyIsInNlYXJjaCIsInVzZXIiLCJsb2FkaW5nIiwiZXJyb3IiLCJtZXNzYWdlVGV4dCIsIm9ubGluZSIsInJlZHVjZXIiLCJzdGF0ZSIsImFjdGlvbiIsInR5cGUiLCJ0ZXh0IiwidXNlcnMiLCJIQU5HT1VUX05PVF9GT1VORCIsImZpbHRlciIsImciLCJ1c2VybmFtZSIsImluY2x1ZGVzIiwiZmluZCIsIm1hcCIsIm1lc3NhZ2VzRnJvbVNlcnZlciIsIkJMT0NLRVIiLCJIQU5HQ0hBVCIsIlVOQkxPQ0tFUiIsIklOVklURVIiLCJERUNMSU5FUiIsIk1FU1NBTkdFUiIsIm1lc3NhZ2VUb1NlcnZlciIsIkRFQ0xJTkUiLCJJTlZJVEUiLCJCbE9DSyIsIlVOQkxPQ0siLCJNRVNTQUdFIiwibWVzc2FnZUNhdGVnb3JpZXMiLCJBQ0tOT1dMRURHRU1FTlQiLCJQRUVSIiwibG9hZEhhbmdvdXRzIiwiZGlzcGF0Y2giLCJKU09OIiwicGFyc2UiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwic2VsZWN0SGFuZ291dCIsInNlbGVjdFVzZXIiLCJzZXRJdGVtIiwic3RyaW5naWZ5Iiwic2VhcmNoSGFuZ291dHMiLCJmaWx0ZXJIYW5nb3V0cyIsImZldGNoSGFuZ291dCIsInJlc3BvbnNlIiwiZmV0Y2giLCJvayIsImpzb24iLCJsZW5ndGgiLCJmZXRjaFVzZXIiLCJjaGFuZ2VNZXNzYWdlVGV4dCIsIkhhbmdvdXRDb250ZXh0IiwiY3JlYXRlQ29udGV4dCIsInVzZUhhbmdvdXRDb250ZXh0IiwiY29udGV4dCIsInVzZUNvbnRleHQiLCJFcnJvciIsIkhhbmdvdXRzUHJvdmlkZXIiLCJwcm9wcyIsImF1dGhDb250ZXh0IiwidXNlQXV0aENvbnRleHQiLCJ1c2VSZWR1Y2VyIiwidXNlRWZmZWN0IiwidmFsdWUiLCJ1c2VNZW1vIiwidXBkYXRlQWNrbm93bGVkZ2VtZW50IiwiYWNrbm93bGVkZ2VtZW50IiwiZW1haWwiLCJtZXNzYWdlVG9OZXdIYW5nb3V0IiwibXNnIiwibWVzc2FnZSIsInVzZVNvY2tldCIsInNvY2tldENvbnRleHQiLCJ1c2VXU29ja2V0Q29udGV4dCIsInNvY2tldCIsIm9ubWVzc2FnZSIsImRhdGEiLCJjYXRlZ29yeSIsImhhbmRsZUFja2hvd2xlZGdlbWVudHMiLCJoYW5kbGVQZWVyTWVzc2FnZXMiLCJvbmNsb3NlIiwib25lcnJvciIsIm9ub3BlbiIsInVwZGF0ZWRIYW5nb3V0IiwidXBkYXRlSGFuZ291dFN0YXRlSW5Mb2NhbFN0b3JhZ2UiLCJtZXNzYWdlVG9IYW5nb3V0IiwibmV3SGFuZ291dCIsIkFDQ0VQVEVSIiwiYWRkTmV3SGFuZ291dFRvTG9jYWxTdG9yYWdlIiwia2V5IiwidXBkYXRlZCIsImluc2VydGVkIiwicHVzaCIsInVzZUhhbmdvdXRzIiwiaGFuZGxlU29ja2V0Iiwib25TZWxlY3RIYW5nb3V0IiwiZSIsInRhcmdldCIsImlkIiwib25TZWxlY3RVc2VyIiwidW5hbWUiLCJ1Iiwib25JbnZpdGUiLCJ0aW1lc3RhbXAiLCJEYXRlIiwibm93Iiwic2VuZCIsIm9uQWNjZXB0Iiwib25CbG9jayIsIm9uVW5ibG9jayIsIm9uRGVjbGluZSIsIm9uTWVzc2FnZSIsIm9uU2VhcmNoIiwib25TdGFydFNlYXJjaCIsIm9uTWVzc2FnZVRleHQiLCJIYW5nb3V0cyIsImxhenkiLCJCbG9jayIsIkJsb2NrZWQiLCJDb25maWd1cmUiLCJIYW5nY2hhdCIsIkludml0ZSIsIkludml0ZWUiLCJJbnZpdGVyIiwiTW9iaWxlIiwicm91dGUiLCJzZXRSb3V0ZSIsInVzZVJvdXRlQ29udGV4dCIsImhlaWdodCIsIlN1c3BlbnNlIl0sIm1hcHBpbmdzIjoiOztBQUFPLE1BQU1BLFdBQVcsR0FBRztBQUN2QkMsRUFBQUEsb0JBQW9CLEVBQUMsc0JBREU7QUFFdkJDLEVBQUFBLGFBQWEsRUFBRSxlQUZRO0FBR3ZCQyxFQUFBQSxhQUFhLEVBQUUsZUFIUTtBQUl2QkMsRUFBQUEsZ0JBQWdCLEVBQUUsa0JBSks7QUFLdkJDLEVBQUFBLGdCQUFnQixFQUFFLGtCQUxLO0FBTXZCQyxFQUFBQSxhQUFhLEVBQUMsZUFOUztBQU92QkMsRUFBQUEsZUFBZSxFQUFDLGlCQVBPO0FBU3ZCQyxFQUFBQSxxQkFBcUIsRUFBRSx1QkFUQTtBQVV2QkMsRUFBQUEscUJBQXFCLEVBQUUsdUJBVkE7QUFXdkJDLEVBQUFBLG9CQUFvQixFQUFFLHNCQVhDO0FBWXZCQyxFQUFBQSx1QkFBdUIsRUFBRSx5QkFaRjtBQWV2QkMsRUFBQUEsa0JBQWtCLEVBQUUsb0JBZkc7QUFnQnZCQyxFQUFBQSxrQkFBa0IsRUFBRSxvQkFoQkc7QUFpQnZCQyxFQUFBQSxpQkFBaUIsRUFBRSxtQkFqQkk7QUFvQnZCQyxFQUFBQSxvQkFBb0IsRUFBRSxzQkFwQkM7QUF1QnZCQyxFQUFBQSxhQUFhLEVBQUUsZUF2QlE7QUF3QnZCQyxFQUFBQSxhQUFhLEVBQUUsZUF4QlE7QUF5QnZCQyxFQUFBQSxZQUFZLEVBQUUsY0F6QlM7QUEyQnZCQyxFQUFBQSxjQUFjLEVBQUUsZ0JBM0JPO0FBNEJ2QkMsRUFBQUEsY0FBYyxFQUFFLGdCQTVCTztBQTZCdkJDLEVBQUFBLGFBQWEsRUFBRSxlQTdCUTtBQStCdkJDLEVBQUFBLGFBQWEsRUFBRSxlQS9CUTtBQWdDdkJDLEVBQUFBLGFBQWEsRUFBRSxlQWhDUTtBQWlDdkJDLEVBQUFBLFlBQVksRUFBRSxjQWpDUztBQW1DdkJDLEVBQUFBLGVBQWUsRUFBRSxpQkFuQ007QUFv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
