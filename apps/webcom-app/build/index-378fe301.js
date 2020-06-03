import { M, u as useAuthContext, p, l, h, a as h$1, _ as _extends, w, b as useWSocketContext, c as useRouteContext, R as Route, d as M$1, O, e as RouteProvider } from './index-546090d9.js';

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
      debugger;
      return { ...state,
        hangout: action.hangout,
        hangouts: state.hangouts.map(g => {
          if (g.username === action.hangout.username) {
            debugger;
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
        debugger;
        const msg = JSON.parse(message.data);
        debugger;

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
        debugger;
      };

      socket.onerror = error => {
        debugger;
      };

      socket.onopen = () => {
        debugger;
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
  debugger;
  let updatedHangout = updateAcknowledgement({
    hangout,
    acknowledgement
  });
  debugger;
  dispatch({
    type: actionTypes.ACKNOWLEDGEMENT_RECIEVED,
    hangout: updatedHangout
  });
  debugger;
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
  debugger;
  const hangouts = JSON.parse(localStorage.getItem(key));
  const updated = hangouts.map(g => {
    if (g.username === hangout.username) {
      debugger;
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

  l(() => {
    if (hangout) {
      debugger;
    } else {
      debugger;
    }
  }, [hangout]);
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

const Hangouts = O(() => import('./Hangout-09375960.js'));
const Block = O(() => import('./Block-002cedc4.js'));
const Blocked = O(() => import('./Blocked-0066d163.js'));
const Configure = O(() => import('./Configure-ce8e1af8.js'));
const Hangchat = O(() => import('./Hangchat-45addabc.js'));
const Invite = O(() => import('./Invite-411e77d2.js'));
const Invitee = O(() => import('./Invitee-e555367b.js'));
const Inviter = O(() => import('./Inviter-e9e12bd3.js'));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtMzc4ZmUzMDEuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25UeXBlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9yZWR1Y2VyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL21lc3NhZ2VUeXBlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25zLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL0hhbmdvdXRzUHJvdmlkZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvbWVzc2FnZUNvbnZlcnRlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS91c2VTb2NrZXQuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvdXNlSGFuZ291dHMuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvbW9iaWxlLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBhY3Rpb25UeXBlcyA9IHtcbiAgICBNRVNTQUdFX1RFWFRfQ0hBTkdFRDonTUVTU0FHRV9URVhUX0NIQU5HRUQnLFxuICAgIExPQURfSEFOR09VVFM6ICdMT0FEX0hBTkdPVVRTJyxcbiAgICBMT0FEX01FU1NBR0VTOiAnTE9BRF9NRVNTQUdFUycsXG4gICAgU0VBUkNIRURfSEFOR09VVDogJ1NFQVJDSEVEX0hBTkdPVVQnLFxuICAgIFNFTEVDVEVEX0hBTkdPVVQ6ICdTRUxFQ1RFRF9IQU5HT1VUJyxcbiAgICBTRUxFQ1RFRF9VU0VSOidTRUxFQ1RFRF9VU0VSJyxcbiAgICBGSUxURVJfSEFOR09VVFM6J0ZJTFRFUl9IQU5HT1VUUycsXG5cbiAgICBGRVRDSF9IQU5HT1VUX1NUQVJURUQ6ICdGRVRDSF9IQU5HT1VUX1NUQVJURUQnLFxuICAgIEZFVENIX0hBTkdPVVRfU1VDQ0VTUzogJ0ZFVENIX0hBTkdPVVRfU1VDQ0VTUycsXG4gICAgRkVUQ0hfSEFOR09VVF9GQUlMRUQ6ICdGRVRDSF9IQU5HT1VUX0ZBSUxFRCcsXG4gICAgRkVUQ0hfSEFOR09VVF9OT1RfRk9VTkQ6ICdGRVRDSF9IQU5HT1VUX05PVF9GT1VORCcsXG5cblxuICAgIEZFVENIX1VTRVJfU1RBUlRFRDogJ0ZFVENIX1VTRVJfU1RBUlRFRCcsXG4gICAgRkVUQ0hfVVNFUl9TVUNDRVNTOiAnRkVUQ0hfVVNFUl9TVUNDRVNTJyxcbiAgICBGRVRDSF9VU0VSX0ZBSUxFRDogJ0ZFVENIX1VTRVJfRkFJTEVEJyxcblxuXG4gICAgT05MSU5FX1NUQVRFX0NIQU5HRUQ6ICdPTkxJTkVfU1RBVEVfQ0hBTkdFRCcsXG5cblxuICAgIE9GRkVSX1NUQVJURUQ6ICdPRkZFUl9TVEFSVEVEJyxcbiAgICBPRkZFUl9TVUNDRVNTOiAnT0ZGRVJfU1VDQ0VTUycsXG4gICAgT0ZGRVJfRkFJTEVEOiAnT0ZGRVJfRkFJTEVEJyxcblxuICAgIEFDQ0VQVF9TVEFSVEVEOiAnQUNDRVBUX1NUQVJURUQnLFxuICAgIEFDQ0VQVF9TVUNDRVNTOiAnQUNDRVBUX1NVQ0NFU1MnLFxuICAgIEFDQ0VQVF9GQUlMRUQ6ICdBQ0NFUFRfRkFJTEVEJyxcblxuICAgIEJMT0NLX1NUQVJURUQ6ICdCTE9DS19TVEFSVEVEJyxcbiAgICBCTE9DS19TVUNDRVNTOiAnQkxPQ0tfU1VDQ0VTUycsXG4gICAgQkxPQ0tfRkFJTEVEOiAnQkxPQ0tfRkFJTEVEJyxcblxuICAgIFVOQkxPQ0tfU1RBUlRFRDogJ1VOQkxPQ0tfU1RBUlRFRCcsXG4gICAgVU5CTE9DS19TVUNDRVNTOiAnVU5CTE9DS19TVUNDRVNTJyxcbiAgICBVTkJMT0NLX0ZBSUxFRDogJ1VOQkxPQ0tfRkFJTEVEJyxcblxuICAgIE1FU1NBR0VfU1RBUlRFRDogJ01FU1NBR0VfU1RBUlRFRCcsXG4gICAgTUVTU0FHRV9TVUNDRVNTOiAnTUVTU0FHRV9TVUNDRVNTJyxcbiAgICBNRVNTQUdFX0ZBSUxFRDogJ01FU1NBR0VfRkFJTEVEJyxcblxuICAgIERFQ0xJTkVfU1RBUlRFRDonREVDTElORV9TVEFSVEVEJyxcbiAgICBERUNMSU5FX1NVQ0NFU1M6J0RFQ0xJTkVfU1VDQ0VTUycsXG4gICAgREVDTElORV9GQUlMRUQ6J0RFQ0xJTkVfRkFJTEVEJyxcblxuICAgIEhBTkdPVVRfQ0hBTkdFRF9JVFNfU1RBVEU6ICdIQU5HT1VUX0NIQU5HRURfSVRTX1NUQVRFJyxcbiAgICBPRkZFUkVSX1JFQ0lFVkVEOiAnT0ZGRVJFUl9SRUNJRVZFRCcsXG4gICAgQUNLTk9XTEVER0VNRU5UX1JFQ0lFVkVEOidBQ0tOT1dMRURHRU1FTlRfUkVDSUVWRUQnXG59IiwiaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuL2FjdGlvblR5cGVzJztcbmV4cG9ydCBjb25zdCBpbml0U3RhdGUgPSB7XG4gIGhhbmdvdXRzOiBbXSxcbiAgaGFuZ291dDogbnVsbCxcblxuICBtZXNzYWdlczogW10sXG4gIHNlYXJjaDogJycsXG4gIHVzZXI6IFtdLFxuICBsb2FkaW5nOiBmYWxzZSxcbiAgZXJyb3I6IG51bGwsXG4gIG1lc3NhZ2VUZXh0OiAnJyxcbiAgb25saW5lOmZhbHNlXG59O1xuZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZXIoc3RhdGUsIGFjdGlvbikge1xuICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5PRkZFUl9TVEFSVEVEOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgbG9hZGluZzp0cnVlXG4gICAgICB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuTUVTU0FHRV9URVhUX0NIQU5HRUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbWVzc2FnZVRleHQ6IGFjdGlvbi50ZXh0IH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9VU0VSX0ZBSUxFRDpcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfRkFJTEVEOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBlcnJvcjogYWN0aW9uLmVycm9yIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9VU0VSX1NUQVJURUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogdHJ1ZSB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuRkVUQ0hfVVNFUl9TVUNDRVNTOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgICAgICB1c2VyczogYWN0aW9uLnVzZXJzLFxuICAgICAgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfU1RBUlRFRDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiB0cnVlIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NVQ0NFU1M6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGhhbmdvdXRzOiBhY3Rpb24uaGFuZ291dHMgfTtcblxuICAgIGNhc2UgYWN0aW9uVHlwZXMuSEFOR09VVF9OT1RfRk9VTkQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZJTFRFUl9IQU5HT1VUUzpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBoYW5nb3V0czogc3RhdGUuaGFuZ291dHMuZmlsdGVyKChnKSA9PlxuICAgICAgICAgIGcudXNlcm5hbWUuaW5jbHVkZXMoc3RhdGUuc2VhcmNoKVxuICAgICAgICApLFxuICAgICAgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNFQVJDSEVEX0hBTkdPVVQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgc2VhcmNoOiBhY3Rpb24uc2VhcmNoIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0FEX0hBTkdPVVRTOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGhhbmdvdXRzOiBhY3Rpb24uaGFuZ291dHMgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNFTEVDVEVEX1VTRVI6XG4gICAgICBpZiAoc3RhdGUuaGFuZ291dHMpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgICBoYW5nb3V0czogWy4uLnN0YXRlLmhhbmdvdXRzLCBhY3Rpb24uaGFuZ291dF0sXG4gICAgICAgICAgaGFuZ291dDogYWN0aW9uLmhhbmdvdXQsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgaGFuZ291dHM6IFthY3Rpb24uaGFuZ291dF0sXG4gICAgICAgIGhhbmdvdXQ6IGFjdGlvbi5oYW5nb3V0LFxuICAgICAgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNFTEVDVEVEX0hBTkdPVVQ6XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgaGFuZ291dDogc3RhdGUuaGFuZ291dHMuZmluZCgoZykgPT4gZy51c2VybmFtZSA9PT0gYWN0aW9uLnVzZXJuYW1lKSxcbiAgICAgIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5IQU5HT1VUX0NIQU5HRURfSVRTX1NUQVRFOlxuICAgIGNhc2UgYWN0aW9uVHlwZXMuQUNLTk9XTEVER0VNRU5UX1JFQ0lFVkVEOlxuICAgICAgZGVidWdnZXI7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgaGFuZ291dDphY3Rpb24uaGFuZ291dCxcbiAgICAgICAgaGFuZ291dHM6IHN0YXRlLmhhbmdvdXRzLm1hcCgoZykgPT4ge1xuICAgICAgICAgIGlmIChnLnVzZXJuYW1lID09PSBhY3Rpb24uaGFuZ291dC51c2VybmFtZSkge1xuICAgICAgICAgICAgZGVidWdnZXI7XG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLmhhbmdvdXQ7XG4gICAgICAgICAgfSBlbHNlIHJldHVybiBnO1xuICAgICAgICB9KSxcbiAgICAgIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5PRkZFUkVSX1JFQ0lFVkVEOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGhhbmdvdXRzOiBbLi4uc3RhdGUuaGFuZ291dHMsIGFjdGlvbi5oYW5nb3V0XSB9O1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gc3RhdGU7XG4gIH1cbn1cbiIsImV4cG9ydCBjb25zdCBhY2tub3dsZWRnbWVudFR5cGVzID0ge1xuICAgIElOVklURUQ6ICdJTlZJVEVEJyxcbiAgICBBQ0NFUFRFRDogJ0FDQ0VQVEVEJyxcbiAgICBCTE9DS0VEOiAnQkxPQ0tFRCcsXG4gICAgVU5CTE9DS0VEOiAnVU5CTE9DS0VEJyxcbiAgICBERUNMSU5FRDogJ0RFQ0xJTkVEJyxcbiAgICBNRVNTQUdFRDogJ01FU1NBR0VEJ1xufVxuXG5cbmV4cG9ydCBjb25zdCBtZXNzYWdlc0Zyb21TZXJ2ZXIgPSB7XG4gICAgQkxPQ0tFUjogJ0JMT0NLRVInLFxuICAgIEFDQ0VQVEVSOiAnQUNDRVBURVInLFxuICAgIFVOQkxPQ0tFUjogJ1VOQkxPQ0tFUicsXG4gICAgSU5WSVRFUjogJ0lOVklURVInLFxuICAgIERFQ0xJTkVSOiAnREVDTElORVInLFxuICAgIE1FU1NBTkdFUjogJ01FU1NBTkdFUidcblxufVxuXG5leHBvcnQgY29uc3QgbWVzc2FnZVRvU2VydmVyID0ge1xuICAgIEFDQ0VQVDogJ0FDQ0VQVCcsXG4gICAgREVDTElORTogJ0RFQ0xJTkUnLFxuICAgIElOVklURTogJ0lOVklURScsXG4gICAgQmxPQ0s6ICdCbE9DSycsXG4gICAgVU5CTE9DSzogJ1VOQkxPQ0snLFxuICAgIE1FU1NBR0U6ICdNRVNTQUdFJ1xuXG59XG4vLyBzZXJ2ZXIgc2lkZSBtZXNzYWdlXG5leHBvcnQgY29uc3QgbWVzc2FnZUNhdGVnb3JpZXM9e1xuICAgIEFDS05PV0xFREdFTUVOVDonQUNLTk9XTEVER0VNRU5UJyxcbiAgICBQRUVSOidQRUVSJ1xufSIsImltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi9hY3Rpb25UeXBlcyc7XG5pbXBvcnQgeyBtZXNzYWdlc0Zyb21TZXJ2ZXIgfSBmcm9tICcuL21lc3NhZ2VUeXBlcyc7XG5cbi8vcmV0cmlldmVzIGhhbmdvdXRzIGZyb20gbG9jYWxTdG9yYWdlXG5leHBvcnQgZnVuY3Rpb24gbG9hZEhhbmdvdXRzKHsgdXNlcm5hbWUsIGRpc3BhdGNoIH0pIHtcbiAgY29uc3QgaGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGAke3VzZXJuYW1lfS1oYW5nb3V0c2ApKTtcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5MT0FEX0hBTkdPVVRTLCBoYW5nb3V0cyB9KTtcbn1cbi8vc2VsZWN0IGhhbmdvdXQgZnJvbSBMaXN0XG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0SGFuZ291dCh7IGRpc3BhdGNoLCB1c2VybmFtZSB9KSB7XG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VMRUNURURfSEFOR09VVCwgdXNlcm5hbWUgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZWxlY3RVc2VyKHtkaXNwYXRjaCwgdXNlcix1c2VybmFtZX0pe1xuICAvLyBzYXZlIHNlbGVjdGVkIHVzZXIgdG8gaGFuZ291dHNcbiAgY29uc3QgaGFuZ291dCA9IHsuLi51c2VyLCBzdGF0ZTonSU5WSVRFJ31cbiAgY29uc3QgaGFuZ291dHMgPUpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oYCR7dXNlcm5hbWV9LWhhbmdvdXRzYCkpXG4gXG4gIGlmKGhhbmdvdXRzKXtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShgJHt1c2VybmFtZX0taGFuZ291dHNgLCBKU09OLnN0cmluZ2lmeShbLi4uaGFuZ291dHMsaGFuZ291dF0pKVxuICB9XG4gIGVsc2V7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oYCR7dXNlcm5hbWV9LWhhbmdvdXRzYCwgSlNPTi5zdHJpbmdpZnkoW2hhbmdvdXRdKSlcbiAgfVxuXG4gIGRpc3BhdGNoKHt0eXBlOmFjdGlvblR5cGVzLlNFTEVDVEVEX1VTRVIsaGFuZ291dH0pXG59XG4vL3NlYXJjaCBmb3IgaGFuZ291dCBieSB0eXBpbmcgaW50byBUZXh0SW5wdXRcbmV4cG9ydCBmdW5jdGlvbiBzZWFyY2hIYW5nb3V0cyh7IHNlYXJjaCwgZGlzcGF0Y2ggfSkge1xuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFQVJDSEVEX0hBTkdPVVQsIHNlYXJjaCB9KTtcbn1cbi8vZmlsdGVyIGhhbmdvdXQgYWZ0ZXIgc2VhcmNoIHN0YXRlIGNoYW5nZVxuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlckhhbmdvdXRzKHsgZGlzcGF0Y2ggfSkge1xuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZJTFRFUl9IQU5HT1VUUyB9KTtcbn1cblxuLy9mZXRjaCBoYW5nb3V0IGZyb20gc2VydmVyIGlmIG5vdCBmb3VuZCBpbiBsb2NhbCBoYW5nb3V0c1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoSGFuZ291dCh7IHNlYXJjaCwgZGlzcGF0Y2ggfSkge1xuICBcbiAgdHJ5IHtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfU1RBUlRFRCB9KTtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAvaGFuZ291dHMvZmluZD9zZWFyY2g9JHtzZWFyY2h9YCk7XG5cbiAgIGlmKHJlc3BvbnNlLm9rKXtcbiAgICBjb25zdCB7IGhhbmdvdXRzIH0gPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG5cbiAgICBpZiAoaGFuZ291dHMubGVuZ3RoID4gMCkge1xuXG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfU1VDQ0VTUywgaGFuZ291dHMgfSk7XG4gICAgfSAgZWxzZXtcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9OT1RfRk9VTkQgfSk7XG4gICAgICAvLyBmZXRjaCB1c2VyIGZyb20gc2VydmVyIGluIGhhbmdvdXQgaXMgbmV3dXNlclxuICAgICAgZmV0Y2hVc2VyKHsgc2VhcmNoLCBkaXNwYXRjaCB9KTtcbiAgICAgfVxuXG4gICB9XG4gICBlbHNle1xuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9OT1RfRk9VTkQgfSk7XG4gICAgLy8gZmV0Y2ggdXNlciBmcm9tIHNlcnZlciBpbiBoYW5nb3V0IGlzIG5ld3VzZXJcbiAgICBmZXRjaFVzZXIoeyBzZWFyY2gsIGRpc3BhdGNoIH0pO1xuICAgfVxuXG4gIH0gY2F0Y2ggKGVycm9yKSB7XG5cbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfRkFJTEVELCBlcnJvciB9KTtcbiAgfVxufVxuICAvLyBmZXRjaCB1c2VyIGZyb20gc2VydmVyIGluIGhhbmdvdXQgaXMgbmV3dXNlclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoVXNlcih7IHNlYXJjaCwgZGlzcGF0Y2ggfSkge1xuXG4gIHRyeSB7XG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9VU0VSX1NUQVJURUQgfSk7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL3VzZXJzL2ZpbmQ/c2VhcmNoPSR7c2VhcmNofWApO1xuICAgIGNvbnN0IHsgdXNlcnMgfSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcblxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfVVNFUl9TVUNDRVNTLCB1c2VycyB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX1VTRVJfRkFJTEVELCBlcnJvciB9KTtcbiAgfVxufVxuXG5cblxuXG5leHBvcnQgZnVuY3Rpb24gY2hhbmdlTWVzc2FnZVRleHQoe3RleHQsZGlzcGF0Y2h9KXtcbmRpc3BhdGNoKHt0eXBlOmFjdGlvblR5cGVzLk1FU1NBR0VfVEVYVF9DSEFOR0VELHRleHR9KVxuXG59XG5cblxuIiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQge1xuICB1c2VDb250ZXh0LFxuICB1c2VTdGF0ZSxcbiAgdXNlTWVtbyxcbiAgdXNlUmVkdWNlcixcbiAgdXNlRWZmZWN0LFxufSBmcm9tICdwcmVhY3QvaG9va3MnO1xuaW1wb3J0IHsgcmVkdWNlciwgaW5pdFN0YXRlIH0gZnJvbSAnLi9yZWR1Y2VyJztcblxuaW1wb3J0IHsgbG9hZEhhbmdvdXRzLCBmaWx0ZXJIYW5nb3V0cyxmZXRjaEhhbmdvdXQgfSBmcm9tICcuL2FjdGlvbnMnO1xuaW1wb3J0IHsgdXNlQXV0aENvbnRleHQgfSBmcm9tICcuLi8uLi9hdXRoL2F1dGgtY29udGV4dCc7XG5jb25zdCBIYW5nb3V0Q29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcbmV4cG9ydCBmdW5jdGlvbiB1c2VIYW5nb3V0Q29udGV4dCgpIHtcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoSGFuZ291dENvbnRleHQpO1xuICBpZiAoIWNvbnRleHQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZUhhbmdvdXRDb250ZXh0IG11c3QgYmUgdXNlZCB3aXRoIEhhbmdvdXRzUHJvdmlkZXInKTtcbiAgfVxuXG4gIHJldHVybiBjb250ZXh0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gSGFuZ291dHNQcm92aWRlcihwcm9wcykge1xuICBjb25zdCBhdXRoQ29udGV4dCA9IHVzZUF1dGhDb250ZXh0KCk7XG4gIGNvbnN0IHsgdXNlcm5hbWUgfSA9IGF1dGhDb250ZXh0LnN0YXRlO1xuICBjb25zdCBbc3RhdGUsIGRpc3BhdGNoXSA9IHVzZVJlZHVjZXIocmVkdWNlciwgaW5pdFN0YXRlKTtcbiAgY29uc3QgeyBoYW5nb3V0IH0gPSBzdGF0ZTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICh1c2VybmFtZSkge1xuICAgICAgbG9hZEhhbmdvdXRzKHsgdXNlcm5hbWUsIGRpc3BhdGNoIH0pO1xuICAgIH1cbiAgfSwgW3VzZXJuYW1lXSk7XG5cblxuXG4gIGNvbnN0IHZhbHVlID0gdXNlTWVtbygoKSA9PiBbc3RhdGUsIGRpc3BhdGNoXSwgW3N0YXRlXSk7XG4gIHJldHVybiA8SGFuZ291dENvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlfSB7Li4ucHJvcHN9IC8+O1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIGhhbmdvdXRUb01lc3NhZ2UoeyBoYW5nb3V0LCB0eXBlIH0pIHtcbiBcbiAgICByZXR1cm57IHVzZXJuYW1lOiBoYW5nb3V0LnVzZXJuYW1lLCB0eXBlLCBtZXNzYWdlOiBoYW5nb3V0Lm1lc3NhZ2UgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlQWNrbm93bGVkZ2VtZW50KHsgYWNrbm93bGVkZ2VtZW50LCBoYW5nb3V0IH0pIHtcbiAgY29uc3Qge3VzZXJuYW1lLGVtYWlsfT1oYW5nb3V0XG4gIGNvbnN0IHt0eXBlfT1hY2tub3dsZWRnZW1lbnRcblxuICAgIHJldHVybiB7IHVzZXJuYW1lLGVtYWlsLHN0YXRlOnR5cGUgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbWVzc2FnZVRvTmV3SGFuZ291dChtc2cpIHtcbiAgICBjb25zdCB7IHVzZXJuYW1lLCBlbWFpbCwgdHlwZSwgbWVzc2FnZSB9ID0gbXNnXG4gICAgY29uc3QgaGFuZ291dCA9IHsgdXNlcm5hbWUsIHN0YXRlOiB0eXBlLCBlbWFpbCwgbWVzc2FnZSB9XG4gICAgcmV0dXJuIGhhbmdvdXRcbn0iLCJpbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xuaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuL2FjdGlvblR5cGVzJztcbmltcG9ydCB7IHVwZGF0ZUFja25vd2xlZGdlbWVudCwgbWVzc2FnZVRvTmV3SGFuZ291dCB9IGZyb20gJy4vbWVzc2FnZUNvbnZlcnRlcic7XG5pbXBvcnQgeyBtZXNzYWdlc0Zyb21TZXJ2ZXIsIG1lc3NhZ2VDYXRlZ29yaWVzIH0gZnJvbSAnLi9tZXNzYWdlVHlwZXMnO1xuaW1wb3J0IHsgdXNlV1NvY2tldENvbnRleHQgfSBmcm9tICcuLi8uLi93c29ja2V0L1dTb2NrZXRQcm92aWRlcic7XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VTb2NrZXQoe2Rpc3BhdGNoLGhhbmdvdXQsdXNlcm5hbWV9KSB7XG4gIGNvbnN0IHNvY2tldENvbnRleHQgPSB1c2VXU29ja2V0Q29udGV4dCgpO1xuY29uc3Qge3NvY2tldH09c29ja2V0Q29udGV4dFxuXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoc29ja2V0ICYmIGhhbmdvdXQpIHtcbiAgICAgIHNvY2tldC5vbm1lc3NhZ2UgPSAobWVzc2FnZSkgPT4ge1xuICAgICAgICBkZWJ1Z2dlclxuICAgICAgICBjb25zdCBtc2cgPSBKU09OLnBhcnNlKG1lc3NhZ2UuZGF0YSk7XG4gICAgICAgIGRlYnVnZ2VyO1xuICAgICAgICBzd2l0Y2ggKG1zZy5jYXRlZ29yeSkge1xuICAgICAgICAgIGNhc2UgbWVzc2FnZUNhdGVnb3JpZXMuQUNLTk9XTEVER0VNRU5UOlxuICAgICAgICAgICAgZGVidWdnZXI7XG4gICAgICAgICAgICBoYW5kbGVBY2tob3dsZWRnZW1lbnRzKHsgZGlzcGF0Y2gsIGFja25vd2xlZGdlbWVudDptc2csIGhhbmdvdXQsIHVzZXJuYW1lIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBtZXNzYWdlQ2F0ZWdvcmllcy5QRUVSOlxuICAgICAgICAgICAgaGFuZGxlUGVlck1lc3NhZ2VzKHsgZGlzcGF0Y2gsIG1zZywgaGFuZ291dCB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ01lc3NhZ2UgY2F0ZW9yeSBpcyBub3QgZGVmaW5lZCcpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgc29ja2V0Lm9uY2xvc2UgPSAoKSA9PiB7XG4gICAgICAgIGRlYnVnZ2VyO1xuICAgICAgfTtcbiAgICAgIHNvY2tldC5vbmVycm9yID0gKGVycm9yKSA9PiB7XG4gICAgICAgIGRlYnVnZ2VyO1xuICAgICAgfTtcbiAgICAgIHNvY2tldC5vbm9wZW4gPSAoKSA9PiB7XG4gICAgICAgIGRlYnVnZ2VyO1xuICAgICAgfTtcbiAgICB9XG4gIH0sIFtzb2NrZXQsIGhhbmdvdXRdKTtcblxuICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gaGFuZGxlQWNraG93bGVkZ2VtZW50cyh7IGRpc3BhdGNoLCBhY2tub3dsZWRnZW1lbnQsIGhhbmdvdXQsdXNlcm5hbWUgfSkge1xuICBkZWJ1Z2dlcjtcbiAgbGV0IHVwZGF0ZWRIYW5nb3V0ID0gdXBkYXRlQWNrbm93bGVkZ2VtZW50KHsgaGFuZ291dCxhY2tub3dsZWRnZW1lbnQgfSk7XG4gIGRlYnVnZ2VyO1xuICBkaXNwYXRjaCh7XG4gICAgdHlwZTogYWN0aW9uVHlwZXMuQUNLTk9XTEVER0VNRU5UX1JFQ0lFVkVELFxuICAgIGhhbmdvdXQ6IHVwZGF0ZWRIYW5nb3V0LFxuICB9KTtcbiAgZGVidWdnZXI7XG4gIHVwZGF0ZUhhbmdvdXRTdGF0ZUluTG9jYWxTdG9yYWdlKGAke3VzZXJuYW1lfS1oYW5nb3V0c2AsIHVwZGF0ZWRIYW5nb3V0KTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlUGVlck1lc3NhZ2VzKHsgZGlzcGF0Y2gsIG1zZywgaGFuZ291dCB9KSB7XG4gIGxldCB1cGRhdGVkSGFuZ291dCA9IG1lc3NhZ2VUb0hhbmdvdXQoeyBoYW5nb3V0LCBtZXNzYWdlOiBtc2cgfSk7XG4gIGxldCBuZXdIYW5nb3V0ID0gbWVzc2FnZVRvTmV3SGFuZ291dChtc2cpO1xuICBzd2l0Y2ggKG1zZy50eXBlKSB7XG4gICAgY2FzZSBtZXNzYWdlc0Zyb21TZXJ2ZXIuQkxPQ0tFUjpcbiAgICBjYXNlIG1lc3NhZ2VzRnJvbVNlcnZlci5ERUNMSU5FUjpcbiAgICBjYXNlIG1lc3NhZ2VzRnJvbVNlcnZlci5NRVNTQU5HRVI6XG4gICAgY2FzZSBtZXNzYWdlc0Zyb21TZXJ2ZXIuVU5CTE9DS0VSOlxuICAgIGNhc2UgbWVzc2FnZXNGcm9tU2VydmVyLkFDQ0VQVEVSOlxuICAgICAgZGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5IQU5HT1VUX0NIQU5HRURfSVRTX1NUQVRFLFxuICAgICAgICBoYW5nb3V0OiB1cGRhdGVkSGFuZ291dCxcbiAgICAgIH0pO1xuICAgICAgdXBkYXRlSGFuZ291dFN0YXRlSW5Mb2NhbFN0b3JhZ2UoYCR7dXNlcm5hbWV9LWhhbmdvdXRzYCwgdXBkYXRlZEhhbmdvdXQpO1xuICAgIGNhc2UgbWVzc2FnZXNGcm9tU2VydmVyLklOVklURVI6XG4gICAgICBkaXNwYXRjaCh7XG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLkhBTkdPVVRfQ0hBTkdFRF9JVFNfU1RBVEUsXG4gICAgICAgIGhhbmdvdXQ6IG5ld0hhbmdvdXQsXG4gICAgICB9KTtcbiAgICAgIGFkZE5ld0hhbmdvdXRUb0xvY2FsU3RvcmFnZShgJHt1c2VybmFtZX0taGFuZ291dHNgLCB1cGRhdGVkSGFuZ291dCk7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignTWVzc2FnZSB0eXBlIGZvciBtZXNzYWdlc0Zyb21TZXJ2ZXIgaXMgbm90IGRlZmluZWQnKTtcbiAgfVxufVxuXG5mdW5jdGlvbiB1cGRhdGVIYW5nb3V0U3RhdGVJbkxvY2FsU3RvcmFnZShrZXksIGhhbmdvdXQpIHtcbiAgZGVidWdnZXJcbiAgY29uc3QgaGFuZ291dHMgPUpTT04ucGFyc2UoIGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSkpO1xuICBjb25zdCB1cGRhdGVkID0gaGFuZ291dHMubWFwKChnKSA9PiB7XG4gICAgaWYgKGcudXNlcm5hbWUgPT09IGhhbmdvdXQudXNlcm5hbWUpIHtcbiAgICAgIGRlYnVnZ2VyXG4gICAgICByZXR1cm4gaGFuZ291dDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGc7XG4gICAgfVxuICB9KTtcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeSh1cGRhdGVkKSk7XG59XG5cbmZ1bmN0aW9uIGFkZE5ld0hhbmdvdXRUb0xvY2FsU3RvcmFnZShrZXksIGhhbmdvdXQpIHtcbiAgY29uc3QgaGFuZ291dHMgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpO1xuICBjb25zdCBpbnNlcnRlZCA9IGhhbmdvdXRzLnB1c2goaGFuZ291dCk7XG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkoaW5zZXJ0ZWQpKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XG5pbXBvcnQgeyB1c2VIYW5nb3V0Q29udGV4dCB9IGZyb20gJy4vSGFuZ291dHNQcm92aWRlcic7XG5pbXBvcnQgeyB1c2VBdXRoQ29udGV4dCB9IGZyb20gJy4uLy4uL2F1dGgvYXV0aC1jb250ZXh0JztcbmltcG9ydCB7dXNlV1NvY2tldENvbnRleHR9IGZyb20gJy4uLy4uL3dzb2NrZXQvV1NvY2tldFByb3ZpZGVyJ1xuaW1wb3J0IHtcbiAgc2VsZWN0SGFuZ291dCxcbiAgc2VhcmNoSGFuZ291dHMsXG4gIGZpbHRlckhhbmdvdXRzLFxuICBmZXRjaEhhbmdvdXQsXG4gIHNlbGVjdFVzZXIsXG4gIGNoYW5nZU1lc3NhZ2VUZXh0LFxufSBmcm9tICcuL2FjdGlvbnMnO1xuaW1wb3J0IHt1c2VTb2NrZXR9IGZyb20gJy4vdXNlU29ja2V0J1xuaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuL2FjdGlvblR5cGVzJztcbmltcG9ydCB7IG1lc3NhZ2VUb1NlcnZlciwgbWVzc2FnZUNhdGVnb3JpZXMgfSBmcm9tICcuL21lc3NhZ2VUeXBlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VIYW5nb3V0cygpIHtcbiAgY29uc3Qgc29ja2V0Q29udGV4dCA9dXNlV1NvY2tldENvbnRleHQoKVxuICBjb25zdCB7c29ja2V0fT1zb2NrZXRDb250ZXh0XG4gIGNvbnN0IGF1dGhDb250ZXh0ID0gdXNlQXV0aENvbnRleHQoKTtcbiAgY29uc3QgeyB1c2VybmFtZSB9ID0gYXV0aENvbnRleHQuc3RhdGU7XG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlSGFuZ291dENvbnRleHQoKTtcblxuICBjb25zdCB7IGhhbmdvdXQsIGhhbmdvdXRzLCBzZWFyY2gsIHVzZXJzLCBtZXNzYWdlVGV4dCB9ID0gc3RhdGU7XG4gIGNvbnN0IGhhbmRsZVNvY2tldCA9dXNlU29ja2V0KHtkaXNwYXRjaCxoYW5nb3V0LHVzZXJuYW1lfSlcbiAgZnVuY3Rpb24gb25TZWxlY3RIYW5nb3V0KGUpIHtcbiAgICBjb25zdCB1c2VybmFtZSA9IGUudGFyZ2V0LmlkO1xuICAgIGRlYnVnZ2VyO1xuICAgIHNlbGVjdEhhbmdvdXQoeyBkaXNwYXRjaCwgdXNlcm5hbWUgfSk7XG4gIH1cbiAgZnVuY3Rpb24gb25TZWxlY3RVc2VyKGUpIHtcbiAgICBjb25zdCB1bmFtZSA9IGUudGFyZ2V0LmlkO1xuICAgIGNvbnN0IHVzZXIgPSB1c2Vycy5maW5kKCh1KSA9PiB1LnVzZXJuYW1lID09PSB1bmFtZSk7XG4gICAgc2VsZWN0VXNlcih7IGRpc3BhdGNoLCB1c2VyLCB1c2VybmFtZSB9KTtcbiAgfVxuICBmdW5jdGlvbiBvbkludml0ZSgpIHtcbiAgICBjb25zdCB7dXNlcm5hbWUsZW1haWx9PWhhbmdvdXRcbiAgICBjb25zdCB1cGRhdGVkSGFuZ291dCA9IHt1c2VybmFtZSxlbWFpbCxcbiAgICAgIG1lc3NhZ2U6IHsgdGV4dDogbWVzc2FnZVRleHQsIHRpbWVzdGFtcDogIERhdGUubm93KCkgfSxcbiAgICB9O1xuICAgIGRlYnVnZ2VyO1xuICAgIHNvY2tldC5zZW5kKFxuICAgICAgSlNPTi5zdHJpbmdpZnkoeyAuLi51cGRhdGVkSGFuZ291dCwgdHlwZTogbWVzc2FnZVRvU2VydmVyLklOVklURSB9KVxuICAgICk7XG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5PRkZFUl9TVEFSVEVEIH0pO1xuICB9XG4gIGZ1bmN0aW9uIG9uQWNjZXB0KCkge1xuICAgIHNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHsgLi4uaGFuZ291dCwgdHlwZTogbWVzc2FnZVRvU2VydmVyLkFDQ0VQVCB9KSk7XG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5BQ0NFUFRfU1RBUlRFRCwgaGFuZ291dCB9KTtcbiAgfVxuICBmdW5jdGlvbiBvbkJsb2NrKCkge1xuICAgIHNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHsgLi4uaGFuZ291dCwgdHlwZTogbWVzc2FnZVRvU2VydmVyLkJsT0NLIH0pKTtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkJMT0NLX1NUQVJURUQsIGhhbmdvdXQgfSk7XG4gIH1cbiAgZnVuY3Rpb24gb25VbmJsb2NrKCkge1xuICAgIHNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHsgLi4uaGFuZ291dCwgdHlwZTogbWVzc2FnZVRvU2VydmVyLlVOQkxPQ0sgfSkpO1xuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuVU5CTE9DS19TVEFSVEVELCBoYW5nb3V0IH0pO1xuICB9XG4gIGZ1bmN0aW9uIG9uRGVjbGluZSgpIHtcbiAgICBzb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7IC4uLmhhbmdvdXQsIHR5cGU6IG1lc3NhZ2VUb1NlcnZlci5ERUNMSU5FIH0pKTtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkRFQ0xJTkVfU1RBUlRFRCwgaGFuZ291dCB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uTWVzc2FnZSgpIHtcbiAgICBzb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7IC4uLmhhbmdvdXQsIHR5cGU6IG1lc3NhZ2VUb1NlcnZlci5NRVNTQUdFIH0pKTtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLk1FU1NBR0VfU1RBUlRFRCwgaGFuZ291dCB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uU2VhcmNoKGUpIHtcbiAgICBzZWFyY2hIYW5nb3V0cyh7IHNlYXJjaDogZS50YXJnZXQudmFsdWUsIGRpc3BhdGNoIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gb25TdGFydFNlYXJjaChlKSB7XG4gICAgaWYgKGhhbmdvdXRzICYmIGhhbmdvdXRzLmxlbmd0aCA+IDApIHtcbiAgICAgIGZpbHRlckhhbmdvdXRzKHsgZGlzcGF0Y2ggfSk7XG4gICAgfVxuICAgIGZldGNoSGFuZ291dCh7IGRpc3BhdGNoLCBzZWFyY2ggfSk7XG4gIH1cblxuICBmdW5jdGlvbiBvbk1lc3NhZ2VUZXh0KGUpIHtcbiAgICBjaGFuZ2VNZXNzYWdlVGV4dCh7IGRpc3BhdGNoLCB0ZXh0OiBlLnRhcmdldC52YWx1ZSB9KTtcbiAgfVxuXG4gIHVzZUVmZmVjdCgoKT0+e1xuICAgIGlmKGhhbmdvdXQpe1xuICAgICAgZGVidWdnZXJcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgIGRlYnVnZ2VyO1xuICAgIH1cbiAgfSxbaGFuZ291dF0pXG5cbiAgcmV0dXJuIHtcbiAgICBvbk1lc3NhZ2VUZXh0LFxuICAgIG1lc3NhZ2VUZXh0LFxuICAgIG9uU3RhcnRTZWFyY2gsXG4gICAgb25TZWFyY2gsXG4gICAgc2VhcmNoLFxuICAgIG9uTWVzc2FnZSxcbiAgICBvbkludml0ZSxcbiAgICBvbkFjY2VwdCxcbiAgICBvbkJsb2NrLFxuICAgIG9uVW5ibG9jayxcbiAgICBvblNlbGVjdEhhbmdvdXQsXG4gICAgb25TZWxlY3RVc2VyLFxuICAgIG9uRGVjbGluZSxcbiAgICBoYW5nb3V0LFxuICAgIGhhbmdvdXRzLFxuICAgIHVzZXJzLFxuICB9O1xufVxuXG5mdW5jdGlvbiB1cGRhdGVMb2NhbEhhbmdvdXQoeyBoYW5nb3V0LCB1c2VybmFtZSB9KSB7XG4gIGNvbnN0IGxvY2FsSGFuZ291dHMgPSBKU09OLnBhcnNlKFxuICAgIGxvY2FsU3RvcmFnZS5nZXRJdGVtKGAke3VzZXJuYW1lfS1oYW5nb3V0c2ApXG4gICk7XG4gIGNvbnN0IHVwZGF0ZWRIYW5nb3V0cyA9IGxvY2FsSGFuZ291dHMubWFwKChsaCkgPT4ge1xuICAgIGlmIChsaC51c2VybmFtZSA9PT0gaGFuZ291dC51c2VybmFtZSkge1xuICAgICAgcmV0dXJuIGhhbmdvdXQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBsaDtcbiAgICB9XG4gIH0pO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xuaW1wb3J0IHsgbGF6eSwgU3VzcGVuc2UgfSBmcm9tICdwcmVhY3QvY29tcGF0JztcbmltcG9ydCB7IFJvdXRlLCB1c2VSb3V0ZUNvbnRleHQgfSBmcm9tICcuLi9yb3V0ZS9yb3V0ZXInO1xuaW1wb3J0IHsgdXNlSGFuZ291dHMgfSBmcm9tICcuL3N0YXRlL3VzZUhhbmdvdXRzJztcbmNvbnN0IEhhbmdvdXRzID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vSGFuZ291dCcpKTtcbmNvbnN0IEJsb2NrID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vc3RhdGUtdWkvQmxvY2snKSk7XG5jb25zdCBCbG9ja2VkID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vc3RhdGUtdWkvQmxvY2tlZCcpKTtcbmNvbnN0IENvbmZpZ3VyZSA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL3N0YXRlLXVpL0NvbmZpZ3VyZScpKTtcbmNvbnN0IEhhbmdjaGF0ID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vc3RhdGUtdWkvSGFuZ2NoYXQnKSk7XG5jb25zdCBJbnZpdGUgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9zdGF0ZS11aS9JbnZpdGUnKSk7XG5jb25zdCBJbnZpdGVlID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vc3RhdGUtdWkvSW52aXRlZScpKTtcbmNvbnN0IEludml0ZXIgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9zdGF0ZS11aS9JbnZpdGVyJykpO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBNb2JpbGUoKSB7XG4gIGNvbnN0IFtyb3V0ZSwgc2V0Um91dGVdID0gdXNlUm91dGVDb250ZXh0KCk7XG5cbiAgY29uc3Qge1xuICAgIGhhbmdvdXQsXG4gICAgaGFuZ291dHMsXG4gICAgb25BY2NlcHQsXG4gICAgb25CbG9jayxcbiAgICBvbkludml0ZSxcbiAgICBvblNlbGVjdEhhbmdvdXQsXG4gICAgb25TZWxlY3RVc2VyLFxuICAgIG9uVW5ibG9jayxcbiAgICBvblNlYXJjaCxcbiAgICB1c2VycyxcbiAgICBzZWFyY2gsXG4gICAgb25TdGFydFNlYXJjaCxcbiAgICBvbk1lc3NhZ2VUZXh0LFxuICAgIG1lc3NhZ2VUZXh0XG4gIH0gPSB1c2VIYW5nb3V0cygpO1xuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChoYW5nb3V0KSB7XG4gICAgICBkZWJ1Z2dlcjtcbiAgICAgIHNldFJvdXRlKGAvJHtoYW5nb3V0LnN0YXRlfWApO1xuICAgIH1cbiAgfSwgW2hhbmdvdXRdKTtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodDogJzg1dmgnIH19PlxuICAgICAgPFJvdXRlIHBhdGg9XCIvaGFuZ291dHNcIj5cbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxuICAgICAgICAgIDxIYW5nb3V0c1xuICAgICAgICAgICAgdXNlcnM9e3VzZXJzfVxuICAgICAgICAgICAgc2VhcmNoPXtzZWFyY2h9XG4gICAgICAgICAgICBoYW5nb3V0cz17aGFuZ291dHN9XG4gICAgICAgICAgICBvblNlbGVjdEhhbmdvdXQ9e29uU2VsZWN0SGFuZ291dH1cbiAgICAgICAgICAgIG9uU2VsZWN0VXNlcj17b25TZWxlY3RVc2VyfVxuICAgICAgICAgICAgb25TZWFyY2g9e29uU2VhcmNofVxuICAgICAgICAgICAgb25TdGFydFNlYXJjaD17b25TdGFydFNlYXJjaH1cbiAgICAgICAgICAvPlxuICAgICAgICA8L1N1c3BlbnNlPlxuICAgICAgPC9Sb3V0ZT5cbiAgICAgIDxSb3V0ZSBwYXRoPVwiL0JMT0NLXCI+XG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cbiAgICAgICAgICA8QmxvY2sgaGFuZ291dD17aGFuZ291dH0gb25CbG9jaz17b25CbG9ja30gLz5cbiAgICAgICAgPC9TdXNwZW5zZT5cbiAgICAgIDwvUm91dGU+XG4gICAgICA8Um91dGUgcGF0aD1cIi9CTE9DS0VEXCI+XG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cbiAgICAgICAgICA8QmxvY2tlZCBoYW5nb3V0PXtoYW5nb3V0fSBvblVuYmxvY2s9e29uVW5ibG9ja30gLz5cbiAgICAgICAgPC9TdXNwZW5zZT5cbiAgICAgIDwvUm91dGU+XG4gICAgICA8Um91dGUgcGF0aD1cIi9jb25maWd1cmVcIj5cbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxuICAgICAgICAgIDxDb25maWd1cmUgaGFuZ291dD17aGFuZ291dH0gLz5cbiAgICAgICAgPC9TdXNwZW5zZT5cbiAgICAgIDwvUm91dGU+XG4gICAgICA8Um91dGUgcGF0aD1cIi9IQU5HQ0hBVFwiPlxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+TG9hZGluZy4uLjwvZGl2Pn0+XG4gICAgICAgICAgPEhhbmdjaGF0IC8+XG4gICAgICAgIDwvU3VzcGVuc2U+XG4gICAgICA8L1JvdXRlPlxuICAgICAgPFJvdXRlIHBhdGg9XCIvSU5WSVRFXCI+XG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cbiAgICAgICAgICA8SW52aXRlIGhhbmdvdXQ9e2hhbmdvdXR9IG9uSW52aXRlPXtvbkludml0ZX0gb25NZXNzYWdlVGV4dD17b25NZXNzYWdlVGV4dH0gbWVzc2FnZVRleHQ9e21lc3NhZ2VUZXh0fS8+XG4gICAgICAgIDwvU3VzcGVuc2U+XG4gICAgICA8L1JvdXRlPlxuICAgICAgPFJvdXRlIHBhdGg9XCIvSU5WSVRFRFwiPlxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+TG9hZGluZy4uLjwvZGl2Pn0+XG4gICAgICAgICAgPEludml0ZWUgaGFuZ291dD17aGFuZ291dH0gLz5cbiAgICAgICAgPC9TdXNwZW5zZT5cbiAgICAgIDwvUm91dGU+XG4gICAgICA8Um91dGUgcGF0aD1cIi9JTlZJVEVSXCI+XG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cbiAgICAgICAgICA8SW52aXRlciBoYW5nb3V0PXtoYW5nb3V0fSBvbkFjY2VwdD17b25BY2NlcHR9IC8+XG4gICAgICAgIDwvU3VzcGVuc2U+XG4gICAgICA8L1JvdXRlPlxuICAgIDwvZGl2PlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCBNb2JpbGUgZnJvbSAnLi9tb2JpbGUnO1xyXG5pbXBvcnQgeyBIYW5nb3V0c1Byb3ZpZGVyIH0gZnJvbSAnLi9zdGF0ZS9IYW5nb3V0c1Byb3ZpZGVyJztcclxuaW1wb3J0IHsgUm91dGVQcm92aWRlciwgdXNlUm91dGVDb250ZXh0IH0gZnJvbSAnLi4vcm91dGUvcm91dGVyJztcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8SGFuZ291dHNQcm92aWRlcj5cclxuICAgICAgPFJvdXRlUHJvdmlkZXIgaW5pdGlhbFJvdXRlPVwiL2hhbmdvdXRzXCI+XHJcbiAgICAgICAgPE1vYmlsZSAvPlxyXG4gICAgICA8L1JvdXRlUHJvdmlkZXI+XHJcbiAgICA8L0hhbmdvdXRzUHJvdmlkZXI+XHJcbiAgKTtcclxufVxyXG4iXSwibmFtZXMiOlsiYWN0aW9uVHlwZXMiLCJNRVNTQUdFX1RFWFRfQ0hBTkdFRCIsIkxPQURfSEFOR09VVFMiLCJMT0FEX01FU1NBR0VTIiwiU0VBUkNIRURfSEFOR09VVCIsIlNFTEVDVEVEX0hBTkdPVVQiLCJTRUxFQ1RFRF9VU0VSIiwiRklMVEVSX0hBTkdPVVRTIiwiRkVUQ0hfSEFOR09VVF9TVEFSVEVEIiwiRkVUQ0hfSEFOR09VVF9TVUNDRVNTIiwiRkVUQ0hfSEFOR09VVF9GQUlMRUQiLCJGRVRDSF9IQU5HT1VUX05PVF9GT1VORCIsIkZFVENIX1VTRVJfU1RBUlRFRCIsIkZFVENIX1VTRVJfU1VDQ0VTUyIsIkZFVENIX1VTRVJfRkFJTEVEIiwiT05MSU5FX1NUQVRFX0NIQU5HRUQiLCJPRkZFUl9TVEFSVEVEIiwiT0ZGRVJfU1VDQ0VTUyIsIk9GRkVSX0ZBSUxFRCIsIkFDQ0VQVF9TVEFSVEVEIiwiQUNDRVBUX1NVQ0NFU1MiLCJBQ0NFUFRfRkFJTEVEIiwiQkxPQ0tfU1RBUlRFRCIsIkJMT0NLX1NVQ0NFU1MiLCJCTE9DS19GQUlMRUQiLCJVTkJMT0NLX1NUQVJURUQiLCJVTkJMT0NLX1NVQ0NFU1MiLCJVTkJMT0NLX0ZBSUxFRCIsIk1FU1NBR0VfU1RBUlRFRCIsIk1FU1NBR0VfU1VDQ0VTUyIsIk1FU1NBR0VfRkFJTEVEIiwiREVDTElORV9TVEFSVEVEIiwiREVDTElORV9TVUNDRVNTIiwiREVDTElORV9GQUlMRUQiLCJIQU5HT1VUX0NIQU5HRURfSVRTX1NUQVRFIiwiT0ZGRVJFUl9SRUNJRVZFRCIsIkFDS05PV0xFREdFTUVOVF9SRUNJRVZFRCIsImluaXRTdGF0ZSIsImhhbmdvdXRzIiwiaGFuZ291dCIsIm1lc3NhZ2VzIiwic2VhcmNoIiwidXNlciIsImxvYWRpbmciLCJlcnJvciIsIm1lc3NhZ2VUZXh0Iiwib25saW5lIiwicmVkdWNlciIsInN0YXRlIiwiYWN0aW9uIiwidHlwZSIsInRleHQiLCJ1c2VycyIsIkhBTkdPVVRfTk9UX0ZPVU5EIiwiZmlsdGVyIiwiZyIsInVzZXJuYW1lIiwiaW5jbHVkZXMiLCJmaW5kIiwibWFwIiwibWVzc2FnZXNGcm9tU2VydmVyIiwiQkxPQ0tFUiIsIkFDQ0VQVEVSIiwiVU5CTE9DS0VSIiwiSU5WSVRFUiIsIkRFQ0xJTkVSIiwiTUVTU0FOR0VSIiwibWVzc2FnZVRvU2VydmVyIiwiQUNDRVBUIiwiREVDTElORSIsIklOVklURSIsIkJsT0NLIiwiVU5CTE9DSyIsIk1FU1NBR0UiLCJtZXNzYWdlQ2F0ZWdvcmllcyIsIkFDS05PV0xFREdFTUVOVCIsIlBFRVIiLCJsb2FkSGFuZ291dHMiLCJkaXNwYXRjaCIsIkpTT04iLCJwYXJzZSIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJzZWxlY3RIYW5nb3V0Iiwic2VsZWN0VXNlciIsInNldEl0ZW0iLCJzdHJpbmdpZnkiLCJzZWFyY2hIYW5nb3V0cyIsImZpbHRlckhhbmdvdXRzIiwiZmV0Y2hIYW5nb3V0IiwicmVzcG9uc2UiLCJmZXRjaCIsIm9rIiwianNvbiIsImxlbmd0aCIsImZldGNoVXNlciIsImNoYW5nZU1lc3NhZ2VUZXh0IiwiSGFuZ291dENvbnRleHQiLCJjcmVhdGVDb250ZXh0IiwidXNlSGFuZ291dENvbnRleHQiLCJjb250ZXh0IiwidXNlQ29udGV4dCIsIkVycm9yIiwiSGFuZ291dHNQcm92aWRlciIsInByb3BzIiwiYXV0aENvbnRleHQiLCJ1c2VBdXRoQ29udGV4dCIsInVzZVJlZHVjZXIiLCJ1c2VFZmZlY3QiLCJ2YWx1ZSIsInVzZU1lbW8iLCJoIiwidXBkYXRlQWNrbm93bGVkZ2VtZW50IiwiYWNrbm93bGVkZ2VtZW50IiwiZW1haWwiLCJtZXNzYWdlVG9OZXdIYW5nb3V0IiwibXNnIiwibWVzc2FnZSIsInVzZVNvY2tldCIsInNvY2tldENvbnRleHQiLCJ1c2VXU29ja2V0Q29udGV4dCIsInNvY2tldCIsIm9ubWVzc2FnZSIsImRhdGEiLCJjYXRlZ29yeSIsImhhbmRsZUFja2hvd2xlZGdlbWVudHMiLCJoYW5kbGVQZWVyTWVzc2FnZXMiLCJvbmNsb3NlIiwib25lcnJvciIsIm9ub3BlbiIsInVwZGF0ZWRIYW5nb3V0IiwidXBkYXRlSGFuZ291dFN0YXRlSW5Mb2NhbFN0b3JhZ2UiLCJtZXNzYWdlVG9IYW5nb3V0IiwibmV3SGFuZ291dCIsImFkZE5ld0hhbmdvdXRUb0xvY2FsU3RvcmFnZSIsImtleSIsInVwZGF0ZWQiLCJpbnNlcnRlZCIsInB1c2giLCJ1c2VIYW5nb3V0cyIsImhhbmRsZVNvY2tldCIsIm9uU2VsZWN0SGFuZ291dCIsImUiLCJ0YXJnZXQiLCJpZCIsIm9uU2VsZWN0VXNlciIsInVuYW1lIiwidSIsIm9uSW52aXRlIiwidGltZXN0YW1wIiwiRGF0ZSIsIm5vdyIsInNlbmQiLCJvbkFjY2VwdCIsIm9uQmxvY2siLCJvblVuYmxvY2siLCJvbkRlY2xpbmUiLCJvbk1lc3NhZ2UiLCJvblNlYXJjaCIsIm9uU3RhcnRTZWFyY2giLCJvbk1lc3NhZ2VUZXh0IiwiSGFuZ291dHMiLCJsYXp5IiwiQmxvY2siLCJCbG9ja2VkIiwiQ29uZmlndXJlIiwiSGFuZ2NoYXQiLCJJbnZpdGUiLCJJbnZpdGVlIiwiSW52aXRlciIsIk1vYmlsZSIsInJvdXRlIiwic2V0Um91dGUiLCJ1c2VSb3V0ZUNvbnRleHQiLCJoZWlnaHQiLCJTdXNwZW5zZSJdLCJtYXBwaW5ncyI6Ijs7QUFBTyxNQUFNQSxXQUFXLEdBQUc7QUFDdkJDLEVBQUFBLG9CQUFvQixFQUFDLHNCQURFO0FBRXZCQyxFQUFBQSxhQUFhLEVBQUUsZUFGUTtBQUd2QkMsRUFBQUEsYUFBYSxFQUFFLGVBSFE7QUFJdkJDLEVBQUFBLGdCQUFnQixFQUFFLGtCQUpLO0FBS3ZCQyxFQUFBQSxnQkFBZ0IsRUFBRSxrQkFMSztBQU12QkMsRUFBQUEsYUFBYSxFQUFDLGVBTlM7QUFPdkJDLEVBQUFBLGVBQWUsRUFBQyxpQkFQTztBQVN2QkMsRUFBQUEscUJBQXFCLEVBQUUsdUJBVEE7QUFVdkJDLEVBQUFBLHFCQUFxQixFQUFFLHVCQVZBO0FBV3ZCQyxFQUFBQSxvQkFBb0IsRUFBRSxzQkFYQztBQVl2QkMsRUFBQUEs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
