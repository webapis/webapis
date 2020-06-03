import { M, u as useAuthContext, p, l, h, a as h$1, _ as _extends, w, b as useWSocketContext, c as useRouteContext, R as Route, d as M$1, O, e as RouteProvider } from './index-5cca3efd.js';

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
  dispatch,
  username
}) {
  debugger;

  try {
    dispatch({
      type: actionTypes.FETCH_HANGOUT_STARTED
    });
    const response = await fetch(`/hangouts/find?search=${search}&username=${username}`);
    debugger;

    if (response.ok) {
      debugger;
      const {
        hangouts
      } = await response.json();
      debugger;

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
    debugger;
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
  l(() => {
    if (socket && hangout) {
      socket.onmessage = message => {
        const msg = JSON.parse(message.data);

        switch (msg.category) {
          case messageCategories.ACKNOWLEDGEMENT:
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
      username
    } = hangout;
    debugger;
    socket.send(JSON.stringify({
      username,
      type: messageToServer.ACCEPT
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

const Hangouts = O(() => import('./Hangout-26ea0cde.js'));
const Block = O(() => import('./Block-549b2052.js'));
const Blocked = O(() => import('./Blocked-ab4b3da9.js'));
const Configure = O(() => import('./Configure-608e2239.js'));
const Hangchat = O(() => import('./Hangchat-e9a4ff64.js'));
const Invite = O(() => import('./Invite-60ac1e33.js'));
const Invitee = O(() => import('./Invitee-edf88856.js'));
const Inviter = O(() => import('./Inviter-2b4445ce.js'));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtZTEwNTA2OTAuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25UeXBlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9yZWR1Y2VyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL21lc3NhZ2VUeXBlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25zLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL0hhbmdvdXRzUHJvdmlkZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvbWVzc2FnZUNvbnZlcnRlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS91c2VTb2NrZXQuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvdXNlSGFuZ291dHMuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvbW9iaWxlLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBhY3Rpb25UeXBlcyA9IHtcbiAgICBNRVNTQUdFX1RFWFRfQ0hBTkdFRDonTUVTU0FHRV9URVhUX0NIQU5HRUQnLFxuICAgIExPQURfSEFOR09VVFM6ICdMT0FEX0hBTkdPVVRTJyxcbiAgICBMT0FEX01FU1NBR0VTOiAnTE9BRF9NRVNTQUdFUycsXG4gICAgU0VBUkNIRURfSEFOR09VVDogJ1NFQVJDSEVEX0hBTkdPVVQnLFxuICAgIFNFTEVDVEVEX0hBTkdPVVQ6ICdTRUxFQ1RFRF9IQU5HT1VUJyxcbiAgICBTRUxFQ1RFRF9VU0VSOidTRUxFQ1RFRF9VU0VSJyxcbiAgICBGSUxURVJfSEFOR09VVFM6J0ZJTFRFUl9IQU5HT1VUUycsXG5cbiAgICBGRVRDSF9IQU5HT1VUX1NUQVJURUQ6ICdGRVRDSF9IQU5HT1VUX1NUQVJURUQnLFxuICAgIEZFVENIX0hBTkdPVVRfU1VDQ0VTUzogJ0ZFVENIX0hBTkdPVVRfU1VDQ0VTUycsXG4gICAgRkVUQ0hfSEFOR09VVF9GQUlMRUQ6ICdGRVRDSF9IQU5HT1VUX0ZBSUxFRCcsXG4gICAgRkVUQ0hfSEFOR09VVF9OT1RfRk9VTkQ6ICdGRVRDSF9IQU5HT1VUX05PVF9GT1VORCcsXG5cblxuICAgIEZFVENIX1VTRVJfU1RBUlRFRDogJ0ZFVENIX1VTRVJfU1RBUlRFRCcsXG4gICAgRkVUQ0hfVVNFUl9TVUNDRVNTOiAnRkVUQ0hfVVNFUl9TVUNDRVNTJyxcbiAgICBGRVRDSF9VU0VSX0ZBSUxFRDogJ0ZFVENIX1VTRVJfRkFJTEVEJyxcblxuXG4gICAgT05MSU5FX1NUQVRFX0NIQU5HRUQ6ICdPTkxJTkVfU1RBVEVfQ0hBTkdFRCcsXG5cblxuICAgIE9GRkVSX1NUQVJURUQ6ICdPRkZFUl9TVEFSVEVEJyxcbiAgICBPRkZFUl9TVUNDRVNTOiAnT0ZGRVJfU1VDQ0VTUycsXG4gICAgT0ZGRVJfRkFJTEVEOiAnT0ZGRVJfRkFJTEVEJyxcblxuICAgIEFDQ0VQVF9TVEFSVEVEOiAnQUNDRVBUX1NUQVJURUQnLFxuICAgIEFDQ0VQVF9TVUNDRVNTOiAnQUNDRVBUX1NVQ0NFU1MnLFxuICAgIEFDQ0VQVF9GQUlMRUQ6ICdBQ0NFUFRfRkFJTEVEJyxcblxuICAgIEJMT0NLX1NUQVJURUQ6ICdCTE9DS19TVEFSVEVEJyxcbiAgICBCTE9DS19TVUNDRVNTOiAnQkxPQ0tfU1VDQ0VTUycsXG4gICAgQkxPQ0tfRkFJTEVEOiAnQkxPQ0tfRkFJTEVEJyxcblxuICAgIFVOQkxPQ0tfU1RBUlRFRDogJ1VOQkxPQ0tfU1RBUlRFRCcsXG4gICAgVU5CTE9DS19TVUNDRVNTOiAnVU5CTE9DS19TVUNDRVNTJyxcbiAgICBVTkJMT0NLX0ZBSUxFRDogJ1VOQkxPQ0tfRkFJTEVEJyxcblxuICAgIE1FU1NBR0VfU1RBUlRFRDogJ01FU1NBR0VfU1RBUlRFRCcsXG4gICAgTUVTU0FHRV9TVUNDRVNTOiAnTUVTU0FHRV9TVUNDRVNTJyxcbiAgICBNRVNTQUdFX0ZBSUxFRDogJ01FU1NBR0VfRkFJTEVEJyxcblxuICAgIERFQ0xJTkVfU1RBUlRFRDonREVDTElORV9TVEFSVEVEJyxcbiAgICBERUNMSU5FX1NVQ0NFU1M6J0RFQ0xJTkVfU1VDQ0VTUycsXG4gICAgREVDTElORV9GQUlMRUQ6J0RFQ0xJTkVfRkFJTEVEJyxcblxuICAgIEhBTkdPVVRfQ0hBTkdFRF9JVFNfU1RBVEU6ICdIQU5HT1VUX0NIQU5HRURfSVRTX1NUQVRFJyxcbiAgICBPRkZFUkVSX1JFQ0lFVkVEOiAnT0ZGRVJFUl9SRUNJRVZFRCcsXG4gICAgQUNLTk9XTEVER0VNRU5UX1JFQ0lFVkVEOidBQ0tOT1dMRURHRU1FTlRfUkVDSUVWRUQnXG59IiwiaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuL2FjdGlvblR5cGVzJztcbmV4cG9ydCBjb25zdCBpbml0U3RhdGUgPSB7XG4gIGhhbmdvdXRzOiBbXSxcbiAgaGFuZ291dDogbnVsbCxcblxuICBtZXNzYWdlczogW10sXG4gIHNlYXJjaDogJycsXG4gIHVzZXI6IFtdLFxuICBsb2FkaW5nOiBmYWxzZSxcbiAgZXJyb3I6IG51bGwsXG4gIG1lc3NhZ2VUZXh0OiAnJyxcbiAgb25saW5lOmZhbHNlXG59O1xuZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZXIoc3RhdGUsIGFjdGlvbikge1xuICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5PRkZFUl9TVEFSVEVEOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgbG9hZGluZzp0cnVlXG4gICAgICB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuTUVTU0FHRV9URVhUX0NIQU5HRUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbWVzc2FnZVRleHQ6IGFjdGlvbi50ZXh0IH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9VU0VSX0ZBSUxFRDpcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfRkFJTEVEOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBlcnJvcjogYWN0aW9uLmVycm9yIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9VU0VSX1NUQVJURUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogdHJ1ZSB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuRkVUQ0hfVVNFUl9TVUNDRVNTOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgICAgICB1c2VyczogYWN0aW9uLnVzZXJzLFxuICAgICAgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfU1RBUlRFRDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiB0cnVlIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NVQ0NFU1M6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGhhbmdvdXRzOiBhY3Rpb24uaGFuZ291dHMgfTtcblxuICAgIGNhc2UgYWN0aW9uVHlwZXMuSEFOR09VVF9OT1RfRk9VTkQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZJTFRFUl9IQU5HT1VUUzpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBoYW5nb3V0czogc3RhdGUuaGFuZ291dHMuZmlsdGVyKChnKSA9PlxuICAgICAgICAgIGcudXNlcm5hbWUuaW5jbHVkZXMoc3RhdGUuc2VhcmNoKVxuICAgICAgICApLFxuICAgICAgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNFQVJDSEVEX0hBTkdPVVQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgc2VhcmNoOiBhY3Rpb24uc2VhcmNoIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0FEX0hBTkdPVVRTOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGhhbmdvdXRzOiBhY3Rpb24uaGFuZ291dHMgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNFTEVDVEVEX1VTRVI6XG4gICAgICBpZiAoc3RhdGUuaGFuZ291dHMpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgICBoYW5nb3V0czogWy4uLnN0YXRlLmhhbmdvdXRzLCBhY3Rpb24uaGFuZ291dF0sXG4gICAgICAgICAgaGFuZ291dDogYWN0aW9uLmhhbmdvdXQsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgaGFuZ291dHM6IFthY3Rpb24uaGFuZ291dF0sXG4gICAgICAgIGhhbmdvdXQ6IGFjdGlvbi5oYW5nb3V0LFxuICAgICAgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNFTEVDVEVEX0hBTkdPVVQ6XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgaGFuZ291dDogc3RhdGUuaGFuZ291dHMuZmluZCgoZykgPT4gZy51c2VybmFtZSA9PT0gYWN0aW9uLnVzZXJuYW1lKSxcbiAgICAgIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5IQU5HT1VUX0NIQU5HRURfSVRTX1NUQVRFOlxuICAgIGNhc2UgYWN0aW9uVHlwZXMuQUNLTk9XTEVER0VNRU5UX1JFQ0lFVkVEOlxuICAgICAgO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIGhhbmdvdXQ6YWN0aW9uLmhhbmdvdXQsXG4gICAgICAgIGhhbmdvdXRzOiBzdGF0ZS5oYW5nb3V0cy5tYXAoKGcpID0+IHtcbiAgICAgICAgICBpZiAoZy51c2VybmFtZSA9PT0gYWN0aW9uLmhhbmdvdXQudXNlcm5hbWUpIHtcbiAgICAgICAgICAgIDtcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24uaGFuZ291dDtcbiAgICAgICAgICB9IGVsc2UgcmV0dXJuIGc7XG4gICAgICAgIH0pLFxuICAgICAgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLk9GRkVSRVJfUkVDSUVWRUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgaGFuZ291dHM6IFsuLi5zdGF0ZS5oYW5nb3V0cywgYWN0aW9uLmhhbmdvdXRdIH07XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgfVxufVxuIiwiZXhwb3J0IGNvbnN0IGFja25vd2xlZGdtZW50VHlwZXMgPSB7XG4gICAgSU5WSVRFRDogJ0lOVklURUQnLFxuICAgIEFDQ0VQVEVEOiAnQUNDRVBURUQnLFxuICAgIEJMT0NLRUQ6ICdCTE9DS0VEJyxcbiAgICBVTkJMT0NLRUQ6ICdVTkJMT0NLRUQnLFxuICAgIERFQ0xJTkVEOiAnREVDTElORUQnLFxuICAgIE1FU1NBR0VEOiAnTUVTU0FHRUQnXG59XG5cblxuZXhwb3J0IGNvbnN0IG1lc3NhZ2VzRnJvbVNlcnZlciA9IHtcbiAgICBCTE9DS0VSOiAnQkxPQ0tFUicsXG4gICAgQUNDRVBURVI6ICdBQ0NFUFRFUicsXG4gICAgVU5CTE9DS0VSOiAnVU5CTE9DS0VSJyxcbiAgICBJTlZJVEVSOiAnSU5WSVRFUicsXG4gICAgREVDTElORVI6ICdERUNMSU5FUicsXG4gICAgTUVTU0FOR0VSOiAnTUVTU0FOR0VSJ1xuXG59XG5cbmV4cG9ydCBjb25zdCBtZXNzYWdlVG9TZXJ2ZXIgPSB7XG4gICAgQUNDRVBUOiAnQUNDRVBUJyxcbiAgICBERUNMSU5FOiAnREVDTElORScsXG4gICAgSU5WSVRFOiAnSU5WSVRFJyxcbiAgICBCbE9DSzogJ0JsT0NLJyxcbiAgICBVTkJMT0NLOiAnVU5CTE9DSycsXG4gICAgTUVTU0FHRTogJ01FU1NBR0UnXG5cbn1cbi8vIHNlcnZlciBzaWRlIG1lc3NhZ2VcbmV4cG9ydCBjb25zdCBtZXNzYWdlQ2F0ZWdvcmllcz17XG4gICAgQUNLTk9XTEVER0VNRU5UOidBQ0tOT1dMRURHRU1FTlQnLFxuICAgIFBFRVI6J1BFRVInXG59IiwiaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuL2FjdGlvblR5cGVzJztcbmltcG9ydCB7IG1lc3NhZ2VzRnJvbVNlcnZlciB9IGZyb20gJy4vbWVzc2FnZVR5cGVzJztcblxuLy9yZXRyaWV2ZXMgaGFuZ291dHMgZnJvbSBsb2NhbFN0b3JhZ2VcbmV4cG9ydCBmdW5jdGlvbiBsb2FkSGFuZ291dHMoeyB1c2VybmFtZSwgZGlzcGF0Y2ggfSkge1xuICBjb25zdCBoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oYCR7dXNlcm5hbWV9LWhhbmdvdXRzYCkpO1xuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkxPQURfSEFOR09VVFMsIGhhbmdvdXRzIH0pO1xufVxuLy9zZWxlY3QgaGFuZ291dCBmcm9tIExpc3RcbmV4cG9ydCBmdW5jdGlvbiBzZWxlY3RIYW5nb3V0KHsgZGlzcGF0Y2gsIHVzZXJuYW1lIH0pIHtcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TRUxFQ1RFRF9IQU5HT1VULCB1c2VybmFtZSB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdFVzZXIoeyBkaXNwYXRjaCwgdXNlciwgdXNlcm5hbWUgfSkge1xuICAvLyBzYXZlIHNlbGVjdGVkIHVzZXIgdG8gaGFuZ291dHNcbiAgY29uc3QgaGFuZ291dCA9IHsgLi4udXNlciwgc3RhdGU6ICdJTlZJVEUnIH07XG4gIGNvbnN0IGhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShgJHt1c2VybmFtZX0taGFuZ291dHNgKSk7XG5cbiAgaWYgKGhhbmdvdXRzKSB7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXG4gICAgICBgJHt1c2VybmFtZX0taGFuZ291dHNgLFxuICAgICAgSlNPTi5zdHJpbmdpZnkoWy4uLmhhbmdvdXRzLCBoYW5nb3V0XSlcbiAgICApO1xuICB9IGVsc2Uge1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGAke3VzZXJuYW1lfS1oYW5nb3V0c2AsIEpTT04uc3RyaW5naWZ5KFtoYW5nb3V0XSkpO1xuICB9XG5cbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TRUxFQ1RFRF9VU0VSLCBoYW5nb3V0IH0pO1xufVxuLy9zZWFyY2ggZm9yIGhhbmdvdXQgYnkgdHlwaW5nIGludG8gVGV4dElucHV0XG5leHBvcnQgZnVuY3Rpb24gc2VhcmNoSGFuZ291dHMoeyBzZWFyY2gsIGRpc3BhdGNoIH0pIHtcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TRUFSQ0hFRF9IQU5HT1VULCBzZWFyY2ggfSk7XG59XG4vL2ZpbHRlciBoYW5nb3V0IGFmdGVyIHNlYXJjaCBzdGF0ZSBjaGFuZ2VcbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJIYW5nb3V0cyh7IGRpc3BhdGNoIH0pIHtcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GSUxURVJfSEFOR09VVFMgfSk7XG59XG5cbi8vZmV0Y2ggaGFuZ291dCBmcm9tIHNlcnZlciBpZiBub3QgZm91bmQgaW4gbG9jYWwgaGFuZ291dHNcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaEhhbmdvdXQoeyBzZWFyY2gsIGRpc3BhdGNoLHVzZXJuYW1lIH0pIHtcbiAgZGVidWdnZXI7XG4gIHRyeSB7XG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NUQVJURUQgfSk7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL2hhbmdvdXRzL2ZpbmQ/c2VhcmNoPSR7c2VhcmNofSZ1c2VybmFtZT0ke3VzZXJuYW1lfWApO1xuICAgIGRlYnVnZ2VyO1xuICAgIGlmIChyZXNwb25zZS5vaykge1xuICAgICAgZGVidWdnZXI7XG4gICAgICBjb25zdCB7IGhhbmdvdXRzIH0gPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICBkZWJ1Z2dlcjtcbiAgICAgIGlmIChoYW5nb3V0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9TVUNDRVNTLCBoYW5nb3V0cyB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9OT1RfRk9VTkQgfSk7XG4gICAgICAgIC8vIGZldGNoIHVzZXIgZnJvbSBzZXJ2ZXIgaW4gaGFuZ291dCBpcyBuZXd1c2VyXG4gICAgICAgIGZldGNoVXNlcih7IHNlYXJjaCwgZGlzcGF0Y2ggfSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9OT1RfRk9VTkQgfSk7XG4gICAgICAvLyBmZXRjaCB1c2VyIGZyb20gc2VydmVyIGluIGhhbmdvdXQgaXMgbmV3dXNlclxuICAgICAgZmV0Y2hVc2VyKHsgc2VhcmNoLCBkaXNwYXRjaCB9KTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc3QgZXJyID0gZXJyb3I7XG4gICAgZGVidWdnZXI7XG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX0ZBSUxFRCwgZXJyb3IgfSk7XG4gIH1cbn1cbi8vIGZldGNoIHVzZXIgZnJvbSBzZXJ2ZXIgaW4gaGFuZ291dCBpcyBuZXd1c2VyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hVc2VyKHsgc2VhcmNoLCBkaXNwYXRjaCB9KSB7XG4gIHRyeSB7XG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9VU0VSX1NUQVJURUQgfSk7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL3VzZXJzL2ZpbmQ/c2VhcmNoPSR7c2VhcmNofWApO1xuICAgIGNvbnN0IHsgdXNlcnMgfSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcblxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfVVNFUl9TVUNDRVNTLCB1c2VycyB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX1VTRVJfRkFJTEVELCBlcnJvciB9KTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY2hhbmdlTWVzc2FnZVRleHQoeyB0ZXh0LCBkaXNwYXRjaCB9KSB7XG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTUVTU0FHRV9URVhUX0NIQU5HRUQsIHRleHQgfSk7XG59XG4iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7XG4gIHVzZUNvbnRleHQsXG4gIHVzZVN0YXRlLFxuICB1c2VNZW1vLFxuICB1c2VSZWR1Y2VyLFxuICB1c2VFZmZlY3QsXG59IGZyb20gJ3ByZWFjdC9ob29rcyc7XG5pbXBvcnQgeyByZWR1Y2VyLCBpbml0U3RhdGUgfSBmcm9tICcuL3JlZHVjZXInO1xuXG5pbXBvcnQgeyBsb2FkSGFuZ291dHMsIGZpbHRlckhhbmdvdXRzLGZldGNoSGFuZ291dCB9IGZyb20gJy4vYWN0aW9ucyc7XG5pbXBvcnQgeyB1c2VBdXRoQ29udGV4dCB9IGZyb20gJy4uLy4uL2F1dGgvYXV0aC1jb250ZXh0JztcbmNvbnN0IEhhbmdvdXRDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xuZXhwb3J0IGZ1bmN0aW9uIHVzZUhhbmdvdXRDb250ZXh0KCkge1xuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChIYW5nb3V0Q29udGV4dCk7XG4gIGlmICghY29udGV4dCkge1xuICAgIHRocm93IG5ldyBFcnJvcigndXNlSGFuZ291dENvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggSGFuZ291dHNQcm92aWRlcicpO1xuICB9XG5cbiAgcmV0dXJuIGNvbnRleHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBIYW5nb3V0c1Byb3ZpZGVyKHByb3BzKSB7XG4gIGNvbnN0IGF1dGhDb250ZXh0ID0gdXNlQXV0aENvbnRleHQoKTtcbiAgY29uc3QgeyB1c2VybmFtZSB9ID0gYXV0aENvbnRleHQuc3RhdGU7XG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlUmVkdWNlcihyZWR1Y2VyLCBpbml0U3RhdGUpO1xuICBjb25zdCB7IGhhbmdvdXQgfSA9IHN0YXRlO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKHVzZXJuYW1lKSB7XG4gICAgICBsb2FkSGFuZ291dHMoeyB1c2VybmFtZSwgZGlzcGF0Y2ggfSk7XG4gICAgfVxuICB9LCBbdXNlcm5hbWVdKTtcblxuXG5cbiAgY29uc3QgdmFsdWUgPSB1c2VNZW1vKCgpID0+IFtzdGF0ZSwgZGlzcGF0Y2hdLCBbc3RhdGVdKTtcbiAgcmV0dXJuIDxIYW5nb3V0Q29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30gLz47XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gaGFuZ291dFRvTWVzc2FnZSh7IGhhbmdvdXQsIHR5cGUgfSkge1xuIFxuICAgIHJldHVybnsgdXNlcm5hbWU6IGhhbmdvdXQudXNlcm5hbWUsIHR5cGUsIG1lc3NhZ2U6IGhhbmdvdXQubWVzc2FnZSB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVBY2tub3dsZWRnZW1lbnQoeyBhY2tub3dsZWRnZW1lbnQsIGhhbmdvdXQgfSkge1xuICBjb25zdCB7dXNlcm5hbWUsZW1haWx9PWhhbmdvdXRcbiAgY29uc3Qge3R5cGV9PWFja25vd2xlZGdlbWVudFxuXG4gICAgcmV0dXJuIHsgdXNlcm5hbWUsZW1haWwsc3RhdGU6dHlwZSB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtZXNzYWdlVG9OZXdIYW5nb3V0KG1zZykge1xuICAgIGNvbnN0IHsgdXNlcm5hbWUsIGVtYWlsLCB0eXBlLCBtZXNzYWdlIH0gPSBtc2dcbiAgICBjb25zdCBoYW5nb3V0ID0geyB1c2VybmFtZSwgc3RhdGU6IHR5cGUsIGVtYWlsLCBtZXNzYWdlIH1cbiAgICByZXR1cm4gaGFuZ291dFxufSIsImltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XG5pbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4vYWN0aW9uVHlwZXMnO1xuaW1wb3J0IHsgdXBkYXRlQWNrbm93bGVkZ2VtZW50LCBtZXNzYWdlVG9OZXdIYW5nb3V0IH0gZnJvbSAnLi9tZXNzYWdlQ29udmVydGVyJztcbmltcG9ydCB7IG1lc3NhZ2VzRnJvbVNlcnZlciwgbWVzc2FnZUNhdGVnb3JpZXMgfSBmcm9tICcuL21lc3NhZ2VUeXBlcyc7XG5pbXBvcnQgeyB1c2VXU29ja2V0Q29udGV4dCB9IGZyb20gJy4uLy4uL3dzb2NrZXQvV1NvY2tldFByb3ZpZGVyJztcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZVNvY2tldCh7ZGlzcGF0Y2gsaGFuZ291dCx1c2VybmFtZX0pIHtcbiAgY29uc3Qgc29ja2V0Q29udGV4dCA9IHVzZVdTb2NrZXRDb250ZXh0KCk7XG5jb25zdCB7c29ja2V0fT1zb2NrZXRDb250ZXh0XG5cblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChzb2NrZXQgJiYgaGFuZ291dCkge1xuICAgICAgc29ja2V0Lm9ubWVzc2FnZSA9IChtZXNzYWdlKSA9PiB7XG4gICAgICAgIFxuICAgICAgICBjb25zdCBtc2cgPSBKU09OLnBhcnNlKG1lc3NhZ2UuZGF0YSk7XG4gICAgICAgIDtcbiAgICAgICAgc3dpdGNoIChtc2cuY2F0ZWdvcnkpIHtcbiAgICAgICAgICBjYXNlIG1lc3NhZ2VDYXRlZ29yaWVzLkFDS05PV0xFREdFTUVOVDpcbiAgICAgICAgICAgIDtcbiAgICAgICAgICAgIGhhbmRsZUFja2hvd2xlZGdlbWVudHMoeyBkaXNwYXRjaCwgYWNrbm93bGVkZ2VtZW50Om1zZywgaGFuZ291dCwgdXNlcm5hbWUgfSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIG1lc3NhZ2VDYXRlZ29yaWVzLlBFRVI6XG4gICAgICAgICAgICBoYW5kbGVQZWVyTWVzc2FnZXMoeyBkaXNwYXRjaCwgbXNnLCBoYW5nb3V0IH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTWVzc2FnZSBjYXRlb3J5IGlzIG5vdCBkZWZpbmVkJyk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBzb2NrZXQub25jbG9zZSA9ICgpID0+IHtcbiAgICAgICAgO1xuICAgICAgfTtcbiAgICAgIHNvY2tldC5vbmVycm9yID0gKGVycm9yKSA9PiB7XG4gICAgICAgIDtcbiAgICAgIH07XG4gICAgICBzb2NrZXQub25vcGVuID0gKCkgPT4ge1xuICAgICAgICA7XG4gICAgICB9O1xuICAgIH1cbiAgfSwgW3NvY2tldCwgaGFuZ291dF0pO1xuXG4gIHJldHVybiBudWxsO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVBY2tob3dsZWRnZW1lbnRzKHsgZGlzcGF0Y2gsIGFja25vd2xlZGdlbWVudCwgaGFuZ291dCx1c2VybmFtZSB9KSB7XG4gIFxuICBsZXQgdXBkYXRlZEhhbmdvdXQgPSB1cGRhdGVBY2tub3dsZWRnZW1lbnQoeyBoYW5nb3V0LGFja25vd2xlZGdlbWVudCB9KTtcbiAgO1xuICBkaXNwYXRjaCh7XG4gICAgdHlwZTogYWN0aW9uVHlwZXMuQUNLTk9XTEVER0VNRU5UX1JFQ0lFVkVELFxuICAgIGhhbmdvdXQ6IHVwZGF0ZWRIYW5nb3V0LFxuICB9KTtcbiAgO1xuICB1cGRhdGVIYW5nb3V0U3RhdGVJbkxvY2FsU3RvcmFnZShgJHt1c2VybmFtZX0taGFuZ291dHNgLCB1cGRhdGVkSGFuZ291dCk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVBlZXJNZXNzYWdlcyh7IGRpc3BhdGNoLCBtc2csIGhhbmdvdXQgfSkge1xuICBsZXQgdXBkYXRlZEhhbmdvdXQgPSBtZXNzYWdlVG9IYW5nb3V0KHsgaGFuZ291dCwgbWVzc2FnZTogbXNnIH0pO1xuICBsZXQgbmV3SGFuZ291dCA9IG1lc3NhZ2VUb05ld0hhbmdvdXQobXNnKTtcbiAgc3dpdGNoIChtc2cudHlwZSkge1xuICAgIGNhc2UgbWVzc2FnZXNGcm9tU2VydmVyLkJMT0NLRVI6XG4gICAgY2FzZSBtZXNzYWdlc0Zyb21TZXJ2ZXIuREVDTElORVI6XG4gICAgY2FzZSBtZXNzYWdlc0Zyb21TZXJ2ZXIuTUVTU0FOR0VSOlxuICAgIGNhc2UgbWVzc2FnZXNGcm9tU2VydmVyLlVOQkxPQ0tFUjpcbiAgICBjYXNlIG1lc3NhZ2VzRnJvbVNlcnZlci5BQ0NFUFRFUjpcbiAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuSEFOR09VVF9DSEFOR0VEX0lUU19TVEFURSxcbiAgICAgICAgaGFuZ291dDogdXBkYXRlZEhhbmdvdXQsXG4gICAgICB9KTtcbiAgICAgIHVwZGF0ZUhhbmdvdXRTdGF0ZUluTG9jYWxTdG9yYWdlKGAke3VzZXJuYW1lfS1oYW5nb3V0c2AsIHVwZGF0ZWRIYW5nb3V0KTtcbiAgICBjYXNlIG1lc3NhZ2VzRnJvbVNlcnZlci5JTlZJVEVSOlxuICAgICAgZGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5IQU5HT1VUX0NIQU5HRURfSVRTX1NUQVRFLFxuICAgICAgICBoYW5nb3V0OiBuZXdIYW5nb3V0LFxuICAgICAgfSk7XG4gICAgICBhZGROZXdIYW5nb3V0VG9Mb2NhbFN0b3JhZ2UoYCR7dXNlcm5hbWV9LWhhbmdvdXRzYCwgdXBkYXRlZEhhbmdvdXQpO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ01lc3NhZ2UgdHlwZSBmb3IgbWVzc2FnZXNGcm9tU2VydmVyIGlzIG5vdCBkZWZpbmVkJyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlSGFuZ291dFN0YXRlSW5Mb2NhbFN0b3JhZ2Uoa2V5LCBoYW5nb3V0KSB7XG4gIFxuICBjb25zdCBoYW5nb3V0cyA9SlNPTi5wYXJzZSggbG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KSk7XG4gIGNvbnN0IHVwZGF0ZWQgPSBoYW5nb3V0cy5tYXAoKGcpID0+IHtcbiAgICBpZiAoZy51c2VybmFtZSA9PT0gaGFuZ291dC51c2VybmFtZSkge1xuICAgICAgXG4gICAgICByZXR1cm4gaGFuZ291dDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGc7XG4gICAgfVxuICB9KTtcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeSh1cGRhdGVkKSk7XG59XG5cbmZ1bmN0aW9uIGFkZE5ld0hhbmdvdXRUb0xvY2FsU3RvcmFnZShrZXksIGhhbmdvdXQpIHtcbiAgY29uc3QgaGFuZ291dHMgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpO1xuICBjb25zdCBpbnNlcnRlZCA9IGhhbmdvdXRzLnB1c2goaGFuZ291dCk7XG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkoaW5zZXJ0ZWQpKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XG5pbXBvcnQgeyB1c2VIYW5nb3V0Q29udGV4dCB9IGZyb20gJy4vSGFuZ291dHNQcm92aWRlcic7XG5pbXBvcnQgeyB1c2VBdXRoQ29udGV4dCB9IGZyb20gJy4uLy4uL2F1dGgvYXV0aC1jb250ZXh0JztcbmltcG9ydCB7IHVzZVdTb2NrZXRDb250ZXh0IH0gZnJvbSAnLi4vLi4vd3NvY2tldC9XU29ja2V0UHJvdmlkZXInO1xuaW1wb3J0IHtcbiAgc2VsZWN0SGFuZ291dCxcbiAgc2VhcmNoSGFuZ291dHMsXG4gIGZpbHRlckhhbmdvdXRzLFxuICBmZXRjaEhhbmdvdXQsXG4gIHNlbGVjdFVzZXIsXG4gIGNoYW5nZU1lc3NhZ2VUZXh0LFxufSBmcm9tICcuL2FjdGlvbnMnO1xuaW1wb3J0IHsgdXNlU29ja2V0IH0gZnJvbSAnLi91c2VTb2NrZXQnO1xuaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuL2FjdGlvblR5cGVzJztcbmltcG9ydCB7IG1lc3NhZ2VUb1NlcnZlciwgbWVzc2FnZUNhdGVnb3JpZXMgfSBmcm9tICcuL21lc3NhZ2VUeXBlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VIYW5nb3V0cygpIHtcbiAgY29uc3Qgc29ja2V0Q29udGV4dCA9IHVzZVdTb2NrZXRDb250ZXh0KCk7XG4gIGNvbnN0IHsgc29ja2V0IH0gPSBzb2NrZXRDb250ZXh0O1xuICBjb25zdCBhdXRoQ29udGV4dCA9IHVzZUF1dGhDb250ZXh0KCk7XG4gIGNvbnN0IHsgdXNlcm5hbWUgfSA9IGF1dGhDb250ZXh0LnN0YXRlO1xuICBjb25zdCBbc3RhdGUsIGRpc3BhdGNoXSA9IHVzZUhhbmdvdXRDb250ZXh0KCk7XG5cbiAgY29uc3QgeyBoYW5nb3V0LCBoYW5nb3V0cywgc2VhcmNoLCB1c2VycywgbWVzc2FnZVRleHQgfSA9IHN0YXRlO1xuICBjb25zdCBoYW5kbGVTb2NrZXQgPSB1c2VTb2NrZXQoeyBkaXNwYXRjaCwgaGFuZ291dCwgdXNlcm5hbWUgfSk7XG4gIGZ1bmN0aW9uIG9uU2VsZWN0SGFuZ291dChlKSB7XG4gICAgY29uc3QgdXNlcm5hbWUgPSBlLnRhcmdldC5pZDtcbiAgICBzZWxlY3RIYW5nb3V0KHsgZGlzcGF0Y2gsIHVzZXJuYW1lIH0pO1xuICB9XG4gIGZ1bmN0aW9uIG9uU2VsZWN0VXNlcihlKSB7XG4gICAgY29uc3QgdW5hbWUgPSBlLnRhcmdldC5pZDtcbiAgICBjb25zdCB1c2VyID0gdXNlcnMuZmluZCgodSkgPT4gdS51c2VybmFtZSA9PT0gdW5hbWUpO1xuICAgIHNlbGVjdFVzZXIoeyBkaXNwYXRjaCwgdXNlciwgdXNlcm5hbWUgfSk7XG4gIH1cbiAgZnVuY3Rpb24gb25JbnZpdGUoKSB7XG4gICAgY29uc3QgeyB1c2VybmFtZSwgZW1haWwgfSA9IGhhbmdvdXQ7XG4gICAgY29uc3QgdXBkYXRlZEhhbmdvdXQgPSB7XG4gICAgICB1c2VybmFtZSxcbiAgICAgIGVtYWlsLFxuICAgICAgbWVzc2FnZTogeyB0ZXh0OiBtZXNzYWdlVGV4dCwgdGltZXN0YW1wOiBEYXRlLm5vdygpIH0sXG4gICAgfTtcbiAgICBzb2NrZXQuc2VuZChcbiAgICAgIEpTT04uc3RyaW5naWZ5KHsgLi4udXBkYXRlZEhhbmdvdXQsIHR5cGU6IG1lc3NhZ2VUb1NlcnZlci5JTlZJVEUgfSlcbiAgICApO1xuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuT0ZGRVJfU1RBUlRFRCB9KTtcbiAgfVxuICBmdW5jdGlvbiBvbkFjY2VwdCgpIHtcbiAgICBjb25zdCB7IHVzZXJuYW1lIH0gPSBoYW5nb3V0O1xuICAgIGRlYnVnZ2VyO1xuICAgIHNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHsgdXNlcm5hbWUsIHR5cGU6IG1lc3NhZ2VUb1NlcnZlci5BQ0NFUFQgfSkpO1xuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQUNDRVBUX1NUQVJURUR9KTtcbiAgfVxuICBmdW5jdGlvbiBvbkJsb2NrKCkge1xuICAgIHNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHsgLi4uaGFuZ291dCwgdHlwZTogbWVzc2FnZVRvU2VydmVyLkJsT0NLIH0pKTtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkJMT0NLX1NUQVJURUQsIGhhbmdvdXQgfSk7XG4gIH1cbiAgZnVuY3Rpb24gb25VbmJsb2NrKCkge1xuICAgIHNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHsgLi4uaGFuZ291dCwgdHlwZTogbWVzc2FnZVRvU2VydmVyLlVOQkxPQ0sgfSkpO1xuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuVU5CTE9DS19TVEFSVEVELCBoYW5nb3V0IH0pO1xuICB9XG4gIGZ1bmN0aW9uIG9uRGVjbGluZSgpIHtcbiAgICBzb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7IC4uLmhhbmdvdXQsIHR5cGU6IG1lc3NhZ2VUb1NlcnZlci5ERUNMSU5FIH0pKTtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkRFQ0xJTkVfU1RBUlRFRCwgaGFuZ291dCB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uTWVzc2FnZSgpIHtcbiAgICBzb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7IC4uLmhhbmdvdXQsIHR5cGU6IG1lc3NhZ2VUb1NlcnZlci5NRVNTQUdFIH0pKTtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLk1FU1NBR0VfU1RBUlRFRCwgaGFuZ291dCB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uU2VhcmNoKGUpIHtcbiAgICBzZWFyY2hIYW5nb3V0cyh7IHNlYXJjaDogZS50YXJnZXQudmFsdWUsIGRpc3BhdGNoIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gb25TdGFydFNlYXJjaChlKSB7XG4gICAgaWYgKGhhbmdvdXRzICYmIGhhbmdvdXRzLmxlbmd0aCA+IDApIHtcbiAgICAgIGZpbHRlckhhbmdvdXRzKHsgZGlzcGF0Y2ggfSk7XG4gICAgfVxuICAgIGZldGNoSGFuZ291dCh7IGRpc3BhdGNoLCBzZWFyY2gsIHVzZXJuYW1lIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gb25NZXNzYWdlVGV4dChlKSB7XG4gICAgY2hhbmdlTWVzc2FnZVRleHQoeyBkaXNwYXRjaCwgdGV4dDogZS50YXJnZXQudmFsdWUgfSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIG9uTWVzc2FnZVRleHQsXG4gICAgbWVzc2FnZVRleHQsXG4gICAgb25TdGFydFNlYXJjaCxcbiAgICBvblNlYXJjaCxcbiAgICBzZWFyY2gsXG4gICAgb25NZXNzYWdlLFxuICAgIG9uSW52aXRlLFxuICAgIG9uQWNjZXB0LFxuICAgIG9uQmxvY2ssXG4gICAgb25VbmJsb2NrLFxuICAgIG9uU2VsZWN0SGFuZ291dCxcbiAgICBvblNlbGVjdFVzZXIsXG4gICAgb25EZWNsaW5lLFxuICAgIGhhbmdvdXQsXG4gICAgaGFuZ291dHMsXG4gICAgdXNlcnMsXG4gIH07XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUxvY2FsSGFuZ291dCh7IGhhbmdvdXQsIHVzZXJuYW1lIH0pIHtcbiAgY29uc3QgbG9jYWxIYW5nb3V0cyA9IEpTT04ucGFyc2UoXG4gICAgbG9jYWxTdG9yYWdlLmdldEl0ZW0oYCR7dXNlcm5hbWV9LWhhbmdvdXRzYClcbiAgKTtcbiAgY29uc3QgdXBkYXRlZEhhbmdvdXRzID0gbG9jYWxIYW5nb3V0cy5tYXAoKGxoKSA9PiB7XG4gICAgaWYgKGxoLnVzZXJuYW1lID09PSBoYW5nb3V0LnVzZXJuYW1lKSB7XG4gICAgICByZXR1cm4gaGFuZ291dDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGxoO1xuICAgIH1cbiAgfSk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XG5pbXBvcnQgeyBsYXp5LCBTdXNwZW5zZSB9IGZyb20gJ3ByZWFjdC9jb21wYXQnO1xuaW1wb3J0IHsgUm91dGUsIHVzZVJvdXRlQ29udGV4dCB9IGZyb20gJy4uL3JvdXRlL3JvdXRlcic7XG5pbXBvcnQgeyB1c2VIYW5nb3V0cyB9IGZyb20gJy4vc3RhdGUvdXNlSGFuZ291dHMnO1xuY29uc3QgSGFuZ291dHMgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9IYW5nb3V0JykpO1xuY29uc3QgQmxvY2sgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9zdGF0ZS11aS9CbG9jaycpKTtcbmNvbnN0IEJsb2NrZWQgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9zdGF0ZS11aS9CbG9ja2VkJykpO1xuY29uc3QgQ29uZmlndXJlID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vc3RhdGUtdWkvQ29uZmlndXJlJykpO1xuY29uc3QgSGFuZ2NoYXQgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9zdGF0ZS11aS9IYW5nY2hhdCcpKTtcbmNvbnN0IEludml0ZSA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL3N0YXRlLXVpL0ludml0ZScpKTtcbmNvbnN0IEludml0ZWUgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9zdGF0ZS11aS9JbnZpdGVlJykpO1xuY29uc3QgSW52aXRlciA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL3N0YXRlLXVpL0ludml0ZXInKSk7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE1vYmlsZSgpIHtcbiAgY29uc3QgW3JvdXRlLCBzZXRSb3V0ZV0gPSB1c2VSb3V0ZUNvbnRleHQoKTtcblxuICBjb25zdCB7XG4gICAgaGFuZ291dCxcbiAgICBoYW5nb3V0cyxcbiAgICBvbkFjY2VwdCxcbiAgICBvbkJsb2NrLFxuICAgIG9uSW52aXRlLFxuICAgIG9uU2VsZWN0SGFuZ291dCxcbiAgICBvblNlbGVjdFVzZXIsXG4gICAgb25VbmJsb2NrLFxuICAgIG9uU2VhcmNoLFxuICAgIHVzZXJzLFxuICAgIHNlYXJjaCxcbiAgICBvblN0YXJ0U2VhcmNoLFxuICAgIG9uTWVzc2FnZVRleHQsXG4gICAgbWVzc2FnZVRleHRcbiAgfSA9IHVzZUhhbmdvdXRzKCk7XG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGhhbmdvdXQpIHtcbiAgICAgIDtcbiAgICAgIHNldFJvdXRlKGAvJHtoYW5nb3V0LnN0YXRlfWApO1xuICAgIH1cbiAgfSwgW2hhbmdvdXRdKTtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodDogJzg1dmgnIH19PlxuICAgICAgPFJvdXRlIHBhdGg9XCIvaGFuZ291dHNcIj5cbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxuICAgICAgICAgIDxIYW5nb3V0c1xuICAgICAgICAgICAgdXNlcnM9e3VzZXJzfVxuICAgICAgICAgICAgc2VhcmNoPXtzZWFyY2h9XG4gICAgICAgICAgICBoYW5nb3V0cz17aGFuZ291dHN9XG4gICAgICAgICAgICBvblNlbGVjdEhhbmdvdXQ9e29uU2VsZWN0SGFuZ291dH1cbiAgICAgICAgICAgIG9uU2VsZWN0VXNlcj17b25TZWxlY3RVc2VyfVxuICAgICAgICAgICAgb25TZWFyY2g9e29uU2VhcmNofVxuICAgICAgICAgICAgb25TdGFydFNlYXJjaD17b25TdGFydFNlYXJjaH1cbiAgICAgICAgICAvPlxuICAgICAgICA8L1N1c3BlbnNlPlxuICAgICAgPC9Sb3V0ZT5cbiAgICAgIDxSb3V0ZSBwYXRoPVwiL0JMT0NLXCI+XG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cbiAgICAgICAgICA8QmxvY2sgaGFuZ291dD17aGFuZ291dH0gb25CbG9jaz17b25CbG9ja30gLz5cbiAgICAgICAgPC9TdXNwZW5zZT5cbiAgICAgIDwvUm91dGU+XG4gICAgICA8Um91dGUgcGF0aD1cIi9CTE9DS0VEXCI+XG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cbiAgICAgICAgICA8QmxvY2tlZCBoYW5nb3V0PXtoYW5nb3V0fSBvblVuYmxvY2s9e29uVW5ibG9ja30gLz5cbiAgICAgICAgPC9TdXNwZW5zZT5cbiAgICAgIDwvUm91dGU+XG4gICAgICA8Um91dGUgcGF0aD1cIi9jb25maWd1cmVcIj5cbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxuICAgICAgICAgIDxDb25maWd1cmUgaGFuZ291dD17aGFuZ291dH0gLz5cbiAgICAgICAgPC9TdXNwZW5zZT5cbiAgICAgIDwvUm91dGU+XG4gICAgICA8Um91dGUgcGF0aD1cIi9IQU5HQ0hBVFwiPlxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+TG9hZGluZy4uLjwvZGl2Pn0+XG4gICAgICAgICAgPEhhbmdjaGF0IC8+XG4gICAgICAgIDwvU3VzcGVuc2U+XG4gICAgICA8L1JvdXRlPlxuICAgICAgPFJvdXRlIHBhdGg9XCIvSU5WSVRFXCI+XG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cbiAgICAgICAgICA8SW52aXRlIGhhbmdvdXQ9e2hhbmdvdXR9IG9uSW52aXRlPXtvbkludml0ZX0gb25NZXNzYWdlVGV4dD17b25NZXNzYWdlVGV4dH0gbWVzc2FnZVRleHQ9e21lc3NhZ2VUZXh0fS8+XG4gICAgICAgIDwvU3VzcGVuc2U+XG4gICAgICA8L1JvdXRlPlxuICAgICAgPFJvdXRlIHBhdGg9XCIvSU5WSVRFRFwiPlxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+TG9hZGluZy4uLjwvZGl2Pn0+XG4gICAgICAgICAgPEludml0ZWUgaGFuZ291dD17aGFuZ291dH0gLz5cbiAgICAgICAgPC9TdXNwZW5zZT5cbiAgICAgIDwvUm91dGU+XG4gICAgICA8Um91dGUgcGF0aD1cIi9JTlZJVEVSXCI+XG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cbiAgICAgICAgICA8SW52aXRlciBoYW5nb3V0PXtoYW5nb3V0fSBvbkFjY2VwdD17b25BY2NlcHR9IC8+XG4gICAgICAgIDwvU3VzcGVuc2U+XG4gICAgICA8L1JvdXRlPlxuICAgIDwvZGl2PlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCBNb2JpbGUgZnJvbSAnLi9tb2JpbGUnO1xyXG5pbXBvcnQgeyBIYW5nb3V0c1Byb3ZpZGVyIH0gZnJvbSAnLi9zdGF0ZS9IYW5nb3V0c1Byb3ZpZGVyJztcclxuaW1wb3J0IHsgUm91dGVQcm92aWRlciwgdXNlUm91dGVDb250ZXh0IH0gZnJvbSAnLi4vcm91dGUvcm91dGVyJztcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8SGFuZ291dHNQcm92aWRlcj5cclxuICAgICAgPFJvdXRlUHJvdmlkZXIgaW5pdGlhbFJvdXRlPVwiL2hhbmdvdXRzXCI+XHJcbiAgICAgICAgPE1vYmlsZSAvPlxyXG4gICAgICA8L1JvdXRlUHJvdmlkZXI+XHJcbiAgICA8L0hhbmdvdXRzUHJvdmlkZXI+XHJcbiAgKTtcclxufVxyXG4iXSwibmFtZXMiOlsiYWN0aW9uVHlwZXMiLCJNRVNTQUdFX1RFWFRfQ0hBTkdFRCIsIkxPQURfSEFOR09VVFMiLCJMT0FEX01FU1NBR0VTIiwiU0VBUkNIRURfSEFOR09VVCIsIlNFTEVDVEVEX0hBTkdPVVQiLCJTRUxFQ1RFRF9VU0VSIiwiRklMVEVSX0hBTkdPVVRTIiwiRkVUQ0hfSEFOR09VVF9TVEFSVEVEIiwiRkVUQ0hfSEFOR09VVF9TVUNDRVNTIiwiRkVUQ0hfSEFOR09VVF9GQUlMRUQiLCJGRVRDSF9IQU5HT1VUX05PVF9GT1VORCIsIkZFVENIX1VTRVJfU1RBUlRFRCIsIkZFVENIX1VTRVJfU1VDQ0VTUyIsIkZFVENIX1VTRVJfRkFJTEVEIiwiT05MSU5FX1NUQVRFX0NIQU5HRUQiLCJPRkZFUl9TVEFSVEVEIiwiT0ZGRVJfU1VDQ0VTUyIsIk9GRkVSX0ZBSUxFRCIsIkFDQ0VQVF9TVEFSVEVEIiwiQUNDRVBUX1NVQ0NFU1MiLCJBQ0NFUFRfRkFJTEVEIiwiQkxPQ0tfU1RBUlRFRCIsIkJMT0NLX1NVQ0NFU1MiLCJCTE9DS19GQUlMRUQiLCJVTkJMT0NLX1NUQVJURUQiLCJVTkJMT0NLX1NVQ0NFU1MiLCJVTkJMT0NLX0ZBSUxFRCIsIk1FU1NBR0VfU1RBUlRFRCIsIk1FU1NBR0VfU1VDQ0VTUyIsIk1FU1NBR0VfRkFJTEVEIiwiREVDTElORV9TVEFSVEVEIiwiREVDTElORV9TVUNDRVNTIiwiREVDTElORV9GQUlMRUQiLCJIQU5HT1VUX0NIQU5HRURfSVRTX1NUQVRFIiwiT0ZGRVJFUl9SRUNJRVZFRCIsIkFDS05PV0xFREdFTUVOVF9SRUNJRVZFRCIsImluaXRTdGF0ZSIsImhhbmdvdXRzIiwiaGFuZ291dCIsIm1lc3NhZ2VzIiwic2VhcmNoIiwidXNlciIsImxvYWRpbmciLCJlcnJvciIsIm1lc3NhZ2VUZXh0Iiwib25saW5lIiwicmVkdWNlciIsInN0YXRlIiwiYWN0aW9uIiwidHlwZSIsInRleHQiLCJ1c2VycyIsIkhBTkdPVVRfTk9UX0ZPVU5EIiwiZmlsdGVyIiwiZyIsInVzZXJuYW1lIiwiaW5jbHVkZXMiLCJmaW5kIiwibWFwIiwibWVzc2FnZXNGcm9tU2VydmVyIiwiQkxPQ0tFUiIsIkFDQ0VQVEVSIiwiVU5CTE9DS0VSIiwiSU5WSVRFUiIsIkRFQ0xJTkVSIiwiTUVTU0FOR0VSIiwibWVzc2FnZVRvU2VydmVyIiwiQUNDRVBUIiwiREVDTElORSIsIklOVklURSIsIkJsT0NLIiwiVU5CTE9DSyIsIk1FU1NBR0UiLCJtZXNzYWdlQ2F0ZWdvcmllcyIsIkFDS05PV0xFREdFTUVOVCIsIlBFRVIiLCJsb2FkSGFuZ291dHMiLCJkaXNwYXRjaCIsIkpTT04iLCJwYXJzZSIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJzZWxlY3RIYW5nb3V0Iiwic2VsZWN0VXNlciIsInNldEl0ZW0iLCJzdHJpbmdpZnkiLCJzZWFyY2hIYW5nb3V0cyIsImZpbHRlckhhbmdvdXRzIiwiZmV0Y2hIYW5nb3V0IiwicmVzcG9uc2UiLCJmZXRjaCIsIm9rIiwianNvbiIsImxlbmd0aCIsImZldGNoVXNlciIsImNoYW5nZU1lc3NhZ2VUZXh0IiwiSGFuZ291dENvbnRleHQiLCJjcmVhdGVDb250ZXh0IiwidXNlSGFuZ291dENvbnRleHQiLCJjb250ZXh0IiwidXNlQ29udGV4dCIsIkVycm9yIiwiSGFuZ291dHNQcm92aWRlciIsInByb3BzIiwiYXV0aENvbnRleHQiLCJ1c2VBdXRoQ29udGV4dCIsInVzZVJlZHVjZXIiLCJ1c2VFZmZlY3QiLCJ2YWx1ZSIsInVzZU1lbW8iLCJoIiwidXBkYXRlQWNrbm93bGVkZ2VtZW50IiwiYWNrbm93bGVkZ2VtZW50IiwiZW1haWwiLCJtZXNzYWdlVG9OZXdIYW5nb3V0IiwibXNnIiwibWVzc2FnZSIsInVzZVNvY2tldCIsInNvY2tldENvbnRleHQiLCJ1c2VXU29ja2V0Q29udGV4dCIsInNvY2tldCIsIm9ubWVzc2FnZSIsImRhdGEiLCJjYXRlZ29yeSIsImhhbmRsZUFja2hvd2xlZGdlbWVudHMiLCJoYW5kbGVQZWVyTWVzc2FnZXMiLCJvbmNsb3NlIiwib25lcnJvciIsIm9ub3BlbiIsInVwZGF0ZWRIYW5nb3V0IiwidXBkYXRlSGFuZ291dFN0YXRlSW5Mb2NhbFN0b3JhZ2UiLCJtZXNzYWdlVG9IYW5nb3V0IiwibmV3SGFuZ291dCIsImFkZE5ld0hhbmdvdXRUb0xvY2FsU3RvcmFnZSIsImtleSIsInVwZGF0ZWQiLCJpbnNlcnRlZCIsInB1c2giLCJ1c2VIYW5nb3V0cyIsImhhbmRsZVNvY2tldCIsIm9uU2VsZWN0SGFuZ291dCIsImUiLCJ0YXJnZXQiLCJpZCIsIm9uU2VsZWN0VXNlciIsInVuYW1lIiwidSIsIm9uSW52aXRlIiwidGltZXN0YW1wIiwiRGF0ZSIsIm5vdyIsInNlbmQiLCJvbkFjY2VwdCIsIm9uQmxvY2siLCJvblVuYmxvY2siLCJvbkRlY2xpbmUiLCJvbk1lc3NhZ2UiLCJvblNlYXJjaCIsIm9uU3RhcnRTZWFyY2giLCJvbk1lc3NhZ2VUZXh0IiwiSGFuZ291dHMiLCJsYXp5IiwiQmxvY2siLCJCbG9ja2VkIiwiQ29uZmlndXJlIiwiSGFuZ2NoYXQiLCJJbnZpdGUiLCJJbnZpdGVlIiwiSW52aXRlciIsIk1vYmlsZSIsInJvdXRlIiwic2V0Um91dGUiLCJ1c2VSb3V0ZUNvbnRleHQiLCJoZWlnaHQiLCJTdXNwZW5zZSJdLCJtYXBwaW5ncyI6Ijs7QUFBTyxNQUFNQSxXQUFXLEdBQUc7QUFDdkJDLEVBQUFBLG9CQUFvQixFQUFDLHNCQURFO0FBRXZCQyxFQUFBQSxhQUFhLEVBQUUsZUFGUTtBQUd2QkMsRUFBQUEsYUFBYSxFQUFFLGVBSFE7QUFJdkJDLEVBQUFBLGdCQUFnQixFQUFFLGtCQUpLO0FBS3ZCQyxFQUFBQSxnQkFBZ0IsRUFBRSxrQkFMSztBQU12QkMsRUFBQUEsYUFBYSxFQUFDLGVBTlM7QUFPdkJDLEVBQUFBLGVBQWUsRUFBQyxpQkFQTztBQVN2QkMsRUFBQUEscUJBQXFCLEVBQUUsdUJBVEE7QUFVdkJDLEVBQUFBLHFCQUFxQixFQUFFLHVCQVZBO0FBV3ZCQyxFQUFBQSxvQkFBb0IsRUFBRSxzQkFYQztBQVl2QkMsRUFB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
