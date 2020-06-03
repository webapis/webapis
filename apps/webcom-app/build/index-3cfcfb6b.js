import { M, u as useAuthContext, p, l, h, a as h$1, _ as _extends, w, b as useWSocketContext, c as useRouteContext, R as Route, d as M$1, O, e as RouteProvider } from './index-391fc169.js';

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

const Hangouts = O(() => import('./Hangout-c136cabf.js'));
const Block = O(() => import('./Block-28150799.js'));
const Blocked = O(() => import('./Blocked-bfe9914d.js'));
const Configure = O(() => import('./Configure-d4f486b6.js'));
const Hangchat = O(() => import('./Hangchat-2e7fc3dc.js'));
const Invite = O(() => import('./Invite-7d3028cd.js'));
const Invitee = O(() => import('./Invitee-826c0806.js'));
const Inviter = O(() => import('./Inviter-de3417d1.js'));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtM2NmY2ZiNmIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25UeXBlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9yZWR1Y2VyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL21lc3NhZ2VUeXBlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25zLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL0hhbmdvdXRzUHJvdmlkZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvbWVzc2FnZUNvbnZlcnRlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS91c2VTb2NrZXQuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvdXNlSGFuZ291dHMuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvbW9iaWxlLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBhY3Rpb25UeXBlcyA9IHtcbiAgICBNRVNTQUdFX1RFWFRfQ0hBTkdFRDonTUVTU0FHRV9URVhUX0NIQU5HRUQnLFxuICAgIExPQURfSEFOR09VVFM6ICdMT0FEX0hBTkdPVVRTJyxcbiAgICBMT0FEX01FU1NBR0VTOiAnTE9BRF9NRVNTQUdFUycsXG4gICAgU0VBUkNIRURfSEFOR09VVDogJ1NFQVJDSEVEX0hBTkdPVVQnLFxuICAgIFNFTEVDVEVEX0hBTkdPVVQ6ICdTRUxFQ1RFRF9IQU5HT1VUJyxcbiAgICBTRUxFQ1RFRF9VU0VSOidTRUxFQ1RFRF9VU0VSJyxcbiAgICBGSUxURVJfSEFOR09VVFM6J0ZJTFRFUl9IQU5HT1VUUycsXG5cbiAgICBGRVRDSF9IQU5HT1VUX1NUQVJURUQ6ICdGRVRDSF9IQU5HT1VUX1NUQVJURUQnLFxuICAgIEZFVENIX0hBTkdPVVRfU1VDQ0VTUzogJ0ZFVENIX0hBTkdPVVRfU1VDQ0VTUycsXG4gICAgRkVUQ0hfSEFOR09VVF9GQUlMRUQ6ICdGRVRDSF9IQU5HT1VUX0ZBSUxFRCcsXG4gICAgRkVUQ0hfSEFOR09VVF9OT1RfRk9VTkQ6ICdGRVRDSF9IQU5HT1VUX05PVF9GT1VORCcsXG5cblxuICAgIEZFVENIX1VTRVJfU1RBUlRFRDogJ0ZFVENIX1VTRVJfU1RBUlRFRCcsXG4gICAgRkVUQ0hfVVNFUl9TVUNDRVNTOiAnRkVUQ0hfVVNFUl9TVUNDRVNTJyxcbiAgICBGRVRDSF9VU0VSX0ZBSUxFRDogJ0ZFVENIX1VTRVJfRkFJTEVEJyxcblxuXG4gICAgT05MSU5FX1NUQVRFX0NIQU5HRUQ6ICdPTkxJTkVfU1RBVEVfQ0hBTkdFRCcsXG5cblxuICAgIE9GRkVSX1NUQVJURUQ6ICdPRkZFUl9TVEFSVEVEJyxcbiAgICBPRkZFUl9TVUNDRVNTOiAnT0ZGRVJfU1VDQ0VTUycsXG4gICAgT0ZGRVJfRkFJTEVEOiAnT0ZGRVJfRkFJTEVEJyxcblxuICAgIEFDQ0VQVF9TVEFSVEVEOiAnQUNDRVBUX1NUQVJURUQnLFxuICAgIEFDQ0VQVF9TVUNDRVNTOiAnQUNDRVBUX1NVQ0NFU1MnLFxuICAgIEFDQ0VQVF9GQUlMRUQ6ICdBQ0NFUFRfRkFJTEVEJyxcblxuICAgIEJMT0NLX1NUQVJURUQ6ICdCTE9DS19TVEFSVEVEJyxcbiAgICBCTE9DS19TVUNDRVNTOiAnQkxPQ0tfU1VDQ0VTUycsXG4gICAgQkxPQ0tfRkFJTEVEOiAnQkxPQ0tfRkFJTEVEJyxcblxuICAgIFVOQkxPQ0tfU1RBUlRFRDogJ1VOQkxPQ0tfU1RBUlRFRCcsXG4gICAgVU5CTE9DS19TVUNDRVNTOiAnVU5CTE9DS19TVUNDRVNTJyxcbiAgICBVTkJMT0NLX0ZBSUxFRDogJ1VOQkxPQ0tfRkFJTEVEJyxcblxuICAgIE1FU1NBR0VfU1RBUlRFRDogJ01FU1NBR0VfU1RBUlRFRCcsXG4gICAgTUVTU0FHRV9TVUNDRVNTOiAnTUVTU0FHRV9TVUNDRVNTJyxcbiAgICBNRVNTQUdFX0ZBSUxFRDogJ01FU1NBR0VfRkFJTEVEJyxcblxuICAgIERFQ0xJTkVfU1RBUlRFRDonREVDTElORV9TVEFSVEVEJyxcbiAgICBERUNMSU5FX1NVQ0NFU1M6J0RFQ0xJTkVfU1VDQ0VTUycsXG4gICAgREVDTElORV9GQUlMRUQ6J0RFQ0xJTkVfRkFJTEVEJyxcblxuICAgIEhBTkdPVVRfQ0hBTkdFRF9JVFNfU1RBVEU6ICdIQU5HT1VUX0NIQU5HRURfSVRTX1NUQVRFJyxcbiAgICBPRkZFUkVSX1JFQ0lFVkVEOiAnT0ZGRVJFUl9SRUNJRVZFRCcsXG4gICAgQUNLTk9XTEVER0VNRU5UX1JFQ0lFVkVEOidBQ0tOT1dMRURHRU1FTlRfUkVDSUVWRUQnXG59IiwiaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuL2FjdGlvblR5cGVzJztcbmV4cG9ydCBjb25zdCBpbml0U3RhdGUgPSB7XG4gIGhhbmdvdXRzOiBbXSxcbiAgaGFuZ291dDogbnVsbCxcblxuICBtZXNzYWdlczogW10sXG4gIHNlYXJjaDogJycsXG4gIHVzZXI6IFtdLFxuICBsb2FkaW5nOiBmYWxzZSxcbiAgZXJyb3I6IG51bGwsXG4gIG1lc3NhZ2VUZXh0OiAnJyxcbiAgb25saW5lOmZhbHNlXG59O1xuZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZXIoc3RhdGUsIGFjdGlvbikge1xuICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5PRkZFUl9TVEFSVEVEOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgbG9hZGluZzp0cnVlXG4gICAgICB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuTUVTU0FHRV9URVhUX0NIQU5HRUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbWVzc2FnZVRleHQ6IGFjdGlvbi50ZXh0IH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9VU0VSX0ZBSUxFRDpcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfRkFJTEVEOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBlcnJvcjogYWN0aW9uLmVycm9yIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9VU0VSX1NUQVJURUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogdHJ1ZSB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuRkVUQ0hfVVNFUl9TVUNDRVNTOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgICAgICB1c2VyczogYWN0aW9uLnVzZXJzLFxuICAgICAgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfU1RBUlRFRDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiB0cnVlIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NVQ0NFU1M6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGhhbmdvdXRzOiBhY3Rpb24uaGFuZ291dHMgfTtcblxuICAgIGNhc2UgYWN0aW9uVHlwZXMuSEFOR09VVF9OT1RfRk9VTkQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZJTFRFUl9IQU5HT1VUUzpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBoYW5nb3V0czogc3RhdGUuaGFuZ291dHMuZmlsdGVyKChnKSA9PlxuICAgICAgICAgIGcudXNlcm5hbWUuaW5jbHVkZXMoc3RhdGUuc2VhcmNoKVxuICAgICAgICApLFxuICAgICAgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNFQVJDSEVEX0hBTkdPVVQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgc2VhcmNoOiBhY3Rpb24uc2VhcmNoIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0FEX0hBTkdPVVRTOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGhhbmdvdXRzOiBhY3Rpb24uaGFuZ291dHMgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNFTEVDVEVEX1VTRVI6XG4gICAgICBpZiAoc3RhdGUuaGFuZ291dHMpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgICBoYW5nb3V0czogWy4uLnN0YXRlLmhhbmdvdXRzLCBhY3Rpb24uaGFuZ291dF0sXG4gICAgICAgICAgaGFuZ291dDogYWN0aW9uLmhhbmdvdXQsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgaGFuZ291dHM6IFthY3Rpb24uaGFuZ291dF0sXG4gICAgICAgIGhhbmdvdXQ6IGFjdGlvbi5oYW5nb3V0LFxuICAgICAgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNFTEVDVEVEX0hBTkdPVVQ6XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgaGFuZ291dDogc3RhdGUuaGFuZ291dHMuZmluZCgoZykgPT4gZy51c2VybmFtZSA9PT0gYWN0aW9uLnVzZXJuYW1lKSxcbiAgICAgIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5IQU5HT1VUX0NIQU5HRURfSVRTX1NUQVRFOlxuICAgIGNhc2UgYWN0aW9uVHlwZXMuQUNLTk9XTEVER0VNRU5UX1JFQ0lFVkVEOlxuICAgICAgO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIGhhbmdvdXQ6YWN0aW9uLmhhbmdvdXQsXG4gICAgICAgIGhhbmdvdXRzOiBzdGF0ZS5oYW5nb3V0cy5tYXAoKGcpID0+IHtcbiAgICAgICAgICBpZiAoZy51c2VybmFtZSA9PT0gYWN0aW9uLmhhbmdvdXQudXNlcm5hbWUpIHtcbiAgICAgICAgICAgIDtcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24uaGFuZ291dDtcbiAgICAgICAgICB9IGVsc2UgcmV0dXJuIGc7XG4gICAgICAgIH0pLFxuICAgICAgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLk9GRkVSRVJfUkVDSUVWRUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgaGFuZ291dHM6IFsuLi5zdGF0ZS5oYW5nb3V0cywgYWN0aW9uLmhhbmdvdXRdIH07XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgfVxufVxuIiwiZXhwb3J0IGNvbnN0IGFja25vd2xlZGdtZW50VHlwZXMgPSB7XG4gICAgSU5WSVRFRDogJ0lOVklURUQnLFxuICAgIEFDQ0VQVEVEOiAnQUNDRVBURUQnLFxuICAgIEJMT0NLRUQ6ICdCTE9DS0VEJyxcbiAgICBVTkJMT0NLRUQ6ICdVTkJMT0NLRUQnLFxuICAgIERFQ0xJTkVEOiAnREVDTElORUQnLFxuICAgIE1FU1NBR0VEOiAnTUVTU0FHRUQnXG59XG5cblxuZXhwb3J0IGNvbnN0IG1lc3NhZ2VzRnJvbVNlcnZlciA9IHtcbiAgICBCTE9DS0VSOiAnQkxPQ0tFUicsXG4gICAgQUNDRVBURVI6ICdBQ0NFUFRFUicsXG4gICAgVU5CTE9DS0VSOiAnVU5CTE9DS0VSJyxcbiAgICBJTlZJVEVSOiAnSU5WSVRFUicsXG4gICAgREVDTElORVI6ICdERUNMSU5FUicsXG4gICAgTUVTU0FOR0VSOiAnTUVTU0FOR0VSJ1xuXG59XG5cbmV4cG9ydCBjb25zdCBtZXNzYWdlVG9TZXJ2ZXIgPSB7XG4gICAgQUNDRVBUOiAnQUNDRVBUJyxcbiAgICBERUNMSU5FOiAnREVDTElORScsXG4gICAgSU5WSVRFOiAnSU5WSVRFJyxcbiAgICBCbE9DSzogJ0JsT0NLJyxcbiAgICBVTkJMT0NLOiAnVU5CTE9DSycsXG4gICAgTUVTU0FHRTogJ01FU1NBR0UnXG5cbn1cbi8vIHNlcnZlciBzaWRlIG1lc3NhZ2VcbmV4cG9ydCBjb25zdCBtZXNzYWdlQ2F0ZWdvcmllcz17XG4gICAgQUNLTk9XTEVER0VNRU5UOidBQ0tOT1dMRURHRU1FTlQnLFxuICAgIFBFRVI6J1BFRVInXG59IiwiaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuL2FjdGlvblR5cGVzJztcbmltcG9ydCB7IG1lc3NhZ2VzRnJvbVNlcnZlciB9IGZyb20gJy4vbWVzc2FnZVR5cGVzJztcblxuLy9yZXRyaWV2ZXMgaGFuZ291dHMgZnJvbSBsb2NhbFN0b3JhZ2VcbmV4cG9ydCBmdW5jdGlvbiBsb2FkSGFuZ291dHMoeyB1c2VybmFtZSwgZGlzcGF0Y2ggfSkge1xuICBjb25zdCBoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oYCR7dXNlcm5hbWV9LWhhbmdvdXRzYCkpO1xuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkxPQURfSEFOR09VVFMsIGhhbmdvdXRzIH0pO1xufVxuLy9zZWxlY3QgaGFuZ291dCBmcm9tIExpc3RcbmV4cG9ydCBmdW5jdGlvbiBzZWxlY3RIYW5nb3V0KHsgZGlzcGF0Y2gsIHVzZXJuYW1lIH0pIHtcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TRUxFQ1RFRF9IQU5HT1VULCB1c2VybmFtZSB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdFVzZXIoeyBkaXNwYXRjaCwgdXNlciwgdXNlcm5hbWUgfSkge1xuICAvLyBzYXZlIHNlbGVjdGVkIHVzZXIgdG8gaGFuZ291dHNcbiAgY29uc3QgaGFuZ291dCA9IHsgLi4udXNlciwgc3RhdGU6ICdJTlZJVEUnIH07XG4gIGNvbnN0IGhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShgJHt1c2VybmFtZX0taGFuZ291dHNgKSk7XG5cbiAgaWYgKGhhbmdvdXRzKSB7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXG4gICAgICBgJHt1c2VybmFtZX0taGFuZ291dHNgLFxuICAgICAgSlNPTi5zdHJpbmdpZnkoWy4uLmhhbmdvdXRzLCBoYW5nb3V0XSlcbiAgICApO1xuICB9IGVsc2Uge1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGAke3VzZXJuYW1lfS1oYW5nb3V0c2AsIEpTT04uc3RyaW5naWZ5KFtoYW5nb3V0XSkpO1xuICB9XG5cbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TRUxFQ1RFRF9VU0VSLCBoYW5nb3V0IH0pO1xufVxuLy9zZWFyY2ggZm9yIGhhbmdvdXQgYnkgdHlwaW5nIGludG8gVGV4dElucHV0XG5leHBvcnQgZnVuY3Rpb24gc2VhcmNoSGFuZ291dHMoeyBzZWFyY2gsIGRpc3BhdGNoIH0pIHtcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TRUFSQ0hFRF9IQU5HT1VULCBzZWFyY2ggfSk7XG59XG4vL2ZpbHRlciBoYW5nb3V0IGFmdGVyIHNlYXJjaCBzdGF0ZSBjaGFuZ2VcbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJIYW5nb3V0cyh7IGRpc3BhdGNoIH0pIHtcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GSUxURVJfSEFOR09VVFMgfSk7XG59XG5cbi8vZmV0Y2ggaGFuZ291dCBmcm9tIHNlcnZlciBpZiBub3QgZm91bmQgaW4gbG9jYWwgaGFuZ291dHNcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaEhhbmdvdXQoeyBzZWFyY2gsIGRpc3BhdGNoLHVzZXJuYW1lIH0pIHtcbiAgZGVidWdnZXI7XG4gIHRyeSB7XG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NUQVJURUQgfSk7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL2hhbmdvdXRzL2ZpbmQ/c2VhcmNoPSR7c2VhcmNofSZ1c2VybmFtZT0ke3VzZXJuYW1lfWApO1xuICAgIGRlYnVnZ2VyO1xuICAgIGlmIChyZXNwb25zZS5vaykge1xuICAgICAgZGVidWdnZXI7XG4gICAgICBjb25zdCB7IGhhbmdvdXRzIH0gPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICBkZWJ1Z2dlcjtcbiAgICAgIGlmIChoYW5nb3V0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9TVUNDRVNTLCBoYW5nb3V0cyB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9OT1RfRk9VTkQgfSk7XG4gICAgICAgIC8vIGZldGNoIHVzZXIgZnJvbSBzZXJ2ZXIgaW4gaGFuZ291dCBpcyBuZXd1c2VyXG4gICAgICAgIGZldGNoVXNlcih7IHNlYXJjaCwgZGlzcGF0Y2ggfSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9OT1RfRk9VTkQgfSk7XG4gICAgICAvLyBmZXRjaCB1c2VyIGZyb20gc2VydmVyIGluIGhhbmdvdXQgaXMgbmV3dXNlclxuICAgICAgZmV0Y2hVc2VyKHsgc2VhcmNoLCBkaXNwYXRjaCB9KTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc3QgZXJyID0gZXJyb3I7XG4gICAgZGVidWdnZXI7XG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX0ZBSUxFRCwgZXJyb3IgfSk7XG4gIH1cbn1cbi8vIGZldGNoIHVzZXIgZnJvbSBzZXJ2ZXIgaW4gaGFuZ291dCBpcyBuZXd1c2VyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hVc2VyKHsgc2VhcmNoLCBkaXNwYXRjaCB9KSB7XG4gIHRyeSB7XG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9VU0VSX1NUQVJURUQgfSk7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL3VzZXJzL2ZpbmQ/c2VhcmNoPSR7c2VhcmNofWApO1xuICAgIGNvbnN0IHsgdXNlcnMgfSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcblxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfVVNFUl9TVUNDRVNTLCB1c2VycyB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX1VTRVJfRkFJTEVELCBlcnJvciB9KTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY2hhbmdlTWVzc2FnZVRleHQoeyB0ZXh0LCBkaXNwYXRjaCB9KSB7XG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTUVTU0FHRV9URVhUX0NIQU5HRUQsIHRleHQgfSk7XG59XG4iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7XG4gIHVzZUNvbnRleHQsXG4gIHVzZVN0YXRlLFxuICB1c2VNZW1vLFxuICB1c2VSZWR1Y2VyLFxuICB1c2VFZmZlY3QsXG59IGZyb20gJ3ByZWFjdC9ob29rcyc7XG5pbXBvcnQgeyByZWR1Y2VyLCBpbml0U3RhdGUgfSBmcm9tICcuL3JlZHVjZXInO1xuXG5pbXBvcnQgeyBsb2FkSGFuZ291dHMsIGZpbHRlckhhbmdvdXRzLGZldGNoSGFuZ291dCB9IGZyb20gJy4vYWN0aW9ucyc7XG5pbXBvcnQgeyB1c2VBdXRoQ29udGV4dCB9IGZyb20gJy4uLy4uL2F1dGgvYXV0aC1jb250ZXh0JztcbmNvbnN0IEhhbmdvdXRDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xuZXhwb3J0IGZ1bmN0aW9uIHVzZUhhbmdvdXRDb250ZXh0KCkge1xuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChIYW5nb3V0Q29udGV4dCk7XG4gIGlmICghY29udGV4dCkge1xuICAgIHRocm93IG5ldyBFcnJvcigndXNlSGFuZ291dENvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggSGFuZ291dHNQcm92aWRlcicpO1xuICB9XG5cbiAgcmV0dXJuIGNvbnRleHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBIYW5nb3V0c1Byb3ZpZGVyKHByb3BzKSB7XG4gIGNvbnN0IGF1dGhDb250ZXh0ID0gdXNlQXV0aENvbnRleHQoKTtcbiAgY29uc3QgeyB1c2VybmFtZSB9ID0gYXV0aENvbnRleHQuc3RhdGU7XG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlUmVkdWNlcihyZWR1Y2VyLCBpbml0U3RhdGUpO1xuICBjb25zdCB7IGhhbmdvdXQgfSA9IHN0YXRlO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKHVzZXJuYW1lKSB7XG4gICAgICBsb2FkSGFuZ291dHMoeyB1c2VybmFtZSwgZGlzcGF0Y2ggfSk7XG4gICAgfVxuICB9LCBbdXNlcm5hbWVdKTtcblxuXG5cbiAgY29uc3QgdmFsdWUgPSB1c2VNZW1vKCgpID0+IFtzdGF0ZSwgZGlzcGF0Y2hdLCBbc3RhdGVdKTtcbiAgcmV0dXJuIDxIYW5nb3V0Q29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30gLz47XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gaGFuZ291dFRvTWVzc2FnZSh7IGhhbmdvdXQsIHR5cGUgfSkge1xuIFxuICAgIHJldHVybnsgdXNlcm5hbWU6IGhhbmdvdXQudXNlcm5hbWUsIHR5cGUsIG1lc3NhZ2U6IGhhbmdvdXQubWVzc2FnZSB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVBY2tub3dsZWRnZW1lbnQoeyBhY2tub3dsZWRnZW1lbnQsIGhhbmdvdXQgfSkge1xuICBjb25zdCB7dXNlcm5hbWUsZW1haWx9PWhhbmdvdXRcbiAgY29uc3Qge3R5cGV9PWFja25vd2xlZGdlbWVudFxuXG4gICAgcmV0dXJuIHsgdXNlcm5hbWUsZW1haWwsc3RhdGU6dHlwZSB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtZXNzYWdlVG9OZXdIYW5nb3V0KG1zZykge1xuICAgIGNvbnN0IHsgdXNlcm5hbWUsIGVtYWlsLCB0eXBlLCBtZXNzYWdlIH0gPSBtc2dcbiAgICBjb25zdCBoYW5nb3V0ID0geyB1c2VybmFtZSwgc3RhdGU6IHR5cGUsIGVtYWlsLCBtZXNzYWdlIH1cbiAgICByZXR1cm4gaGFuZ291dFxufSIsImltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XG5pbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4vYWN0aW9uVHlwZXMnO1xuaW1wb3J0IHsgdXBkYXRlQWNrbm93bGVkZ2VtZW50LCBtZXNzYWdlVG9OZXdIYW5nb3V0IH0gZnJvbSAnLi9tZXNzYWdlQ29udmVydGVyJztcbmltcG9ydCB7IG1lc3NhZ2VzRnJvbVNlcnZlciwgbWVzc2FnZUNhdGVnb3JpZXMgfSBmcm9tICcuL21lc3NhZ2VUeXBlcyc7XG5pbXBvcnQgeyB1c2VXU29ja2V0Q29udGV4dCB9IGZyb20gJy4uLy4uL3dzb2NrZXQvV1NvY2tldFByb3ZpZGVyJztcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZVNvY2tldCh7ZGlzcGF0Y2gsaGFuZ291dCx1c2VybmFtZX0pIHtcbiAgY29uc3Qgc29ja2V0Q29udGV4dCA9IHVzZVdTb2NrZXRDb250ZXh0KCk7XG5jb25zdCB7c29ja2V0fT1zb2NrZXRDb250ZXh0XG5cblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChzb2NrZXQgJiYgaGFuZ291dCkge1xuICAgICAgc29ja2V0Lm9ubWVzc2FnZSA9IChtZXNzYWdlKSA9PiB7XG4gICAgICAgIFxuICAgICAgICBjb25zdCBtc2cgPSBKU09OLnBhcnNlKG1lc3NhZ2UuZGF0YSk7XG4gICAgICAgIDtcbiAgICAgICAgc3dpdGNoIChtc2cuY2F0ZWdvcnkpIHtcbiAgICAgICAgICBjYXNlIG1lc3NhZ2VDYXRlZ29yaWVzLkFDS05PV0xFREdFTUVOVDpcbiAgICAgICAgICAgIDtcbiAgICAgICAgICAgIGhhbmRsZUFja2hvd2xlZGdlbWVudHMoeyBkaXNwYXRjaCwgYWNrbm93bGVkZ2VtZW50Om1zZywgaGFuZ291dCwgdXNlcm5hbWUgfSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIG1lc3NhZ2VDYXRlZ29yaWVzLlBFRVI6XG4gICAgICAgICAgICBoYW5kbGVQZWVyTWVzc2FnZXMoeyBkaXNwYXRjaCwgbXNnLCBoYW5nb3V0IH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTWVzc2FnZSBjYXRlb3J5IGlzIG5vdCBkZWZpbmVkJyk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBzb2NrZXQub25jbG9zZSA9ICgpID0+IHtcbiAgICAgICAgO1xuICAgICAgfTtcbiAgICAgIHNvY2tldC5vbmVycm9yID0gKGVycm9yKSA9PiB7XG4gICAgICAgIDtcbiAgICAgIH07XG4gICAgICBzb2NrZXQub25vcGVuID0gKCkgPT4ge1xuICAgICAgICA7XG4gICAgICB9O1xuICAgIH1cbiAgfSwgW3NvY2tldCwgaGFuZ291dF0pO1xuXG4gIHJldHVybiBudWxsO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVBY2tob3dsZWRnZW1lbnRzKHsgZGlzcGF0Y2gsIGFja25vd2xlZGdlbWVudCwgaGFuZ291dCx1c2VybmFtZSB9KSB7XG4gIDtcbiAgbGV0IHVwZGF0ZWRIYW5nb3V0ID0gdXBkYXRlQWNrbm93bGVkZ2VtZW50KHsgaGFuZ291dCxhY2tub3dsZWRnZW1lbnQgfSk7XG4gIDtcbiAgZGlzcGF0Y2goe1xuICAgIHR5cGU6IGFjdGlvblR5cGVzLkFDS05PV0xFREdFTUVOVF9SRUNJRVZFRCxcbiAgICBoYW5nb3V0OiB1cGRhdGVkSGFuZ291dCxcbiAgfSk7XG4gIDtcbiAgdXBkYXRlSGFuZ291dFN0YXRlSW5Mb2NhbFN0b3JhZ2UoYCR7dXNlcm5hbWV9LWhhbmdvdXRzYCwgdXBkYXRlZEhhbmdvdXQpO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVQZWVyTWVzc2FnZXMoeyBkaXNwYXRjaCwgbXNnLCBoYW5nb3V0IH0pIHtcbiAgbGV0IHVwZGF0ZWRIYW5nb3V0ID0gbWVzc2FnZVRvSGFuZ291dCh7IGhhbmdvdXQsIG1lc3NhZ2U6IG1zZyB9KTtcbiAgbGV0IG5ld0hhbmdvdXQgPSBtZXNzYWdlVG9OZXdIYW5nb3V0KG1zZyk7XG4gIHN3aXRjaCAobXNnLnR5cGUpIHtcbiAgICBjYXNlIG1lc3NhZ2VzRnJvbVNlcnZlci5CTE9DS0VSOlxuICAgIGNhc2UgbWVzc2FnZXNGcm9tU2VydmVyLkRFQ0xJTkVSOlxuICAgIGNhc2UgbWVzc2FnZXNGcm9tU2VydmVyLk1FU1NBTkdFUjpcbiAgICBjYXNlIG1lc3NhZ2VzRnJvbVNlcnZlci5VTkJMT0NLRVI6XG4gICAgY2FzZSBtZXNzYWdlc0Zyb21TZXJ2ZXIuQUNDRVBURVI6XG4gICAgICBkaXNwYXRjaCh7XG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLkhBTkdPVVRfQ0hBTkdFRF9JVFNfU1RBVEUsXG4gICAgICAgIGhhbmdvdXQ6IHVwZGF0ZWRIYW5nb3V0LFxuICAgICAgfSk7XG4gICAgICB1cGRhdGVIYW5nb3V0U3RhdGVJbkxvY2FsU3RvcmFnZShgJHt1c2VybmFtZX0taGFuZ291dHNgLCB1cGRhdGVkSGFuZ291dCk7XG4gICAgY2FzZSBtZXNzYWdlc0Zyb21TZXJ2ZXIuSU5WSVRFUjpcbiAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuSEFOR09VVF9DSEFOR0VEX0lUU19TVEFURSxcbiAgICAgICAgaGFuZ291dDogbmV3SGFuZ291dCxcbiAgICAgIH0pO1xuICAgICAgYWRkTmV3SGFuZ291dFRvTG9jYWxTdG9yYWdlKGAke3VzZXJuYW1lfS1oYW5nb3V0c2AsIHVwZGF0ZWRIYW5nb3V0KTtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdNZXNzYWdlIHR5cGUgZm9yIG1lc3NhZ2VzRnJvbVNlcnZlciBpcyBub3QgZGVmaW5lZCcpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUhhbmdvdXRTdGF0ZUluTG9jYWxTdG9yYWdlKGtleSwgaGFuZ291dCkge1xuICBcbiAgY29uc3QgaGFuZ291dHMgPUpTT04ucGFyc2UoIGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSkpO1xuICBjb25zdCB1cGRhdGVkID0gaGFuZ291dHMubWFwKChnKSA9PiB7XG4gICAgaWYgKGcudXNlcm5hbWUgPT09IGhhbmdvdXQudXNlcm5hbWUpIHtcbiAgICAgIFxuICAgICAgcmV0dXJuIGhhbmdvdXQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBnO1xuICAgIH1cbiAgfSk7XG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkodXBkYXRlZCkpO1xufVxuXG5mdW5jdGlvbiBhZGROZXdIYW5nb3V0VG9Mb2NhbFN0b3JhZ2Uoa2V5LCBoYW5nb3V0KSB7XG4gIGNvbnN0IGhhbmdvdXRzID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KTtcbiAgY29uc3QgaW5zZXJ0ZWQgPSBoYW5nb3V0cy5wdXNoKGhhbmdvdXQpO1xuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KGluc2VydGVkKSk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xuaW1wb3J0IHsgdXNlSGFuZ291dENvbnRleHQgfSBmcm9tICcuL0hhbmdvdXRzUHJvdmlkZXInO1xuaW1wb3J0IHsgdXNlQXV0aENvbnRleHQgfSBmcm9tICcuLi8uLi9hdXRoL2F1dGgtY29udGV4dCc7XG5pbXBvcnQge3VzZVdTb2NrZXRDb250ZXh0fSBmcm9tICcuLi8uLi93c29ja2V0L1dTb2NrZXRQcm92aWRlcidcbmltcG9ydCB7XG4gIHNlbGVjdEhhbmdvdXQsXG4gIHNlYXJjaEhhbmdvdXRzLFxuICBmaWx0ZXJIYW5nb3V0cyxcbiAgZmV0Y2hIYW5nb3V0LFxuICBzZWxlY3RVc2VyLFxuICBjaGFuZ2VNZXNzYWdlVGV4dCxcbn0gZnJvbSAnLi9hY3Rpb25zJztcbmltcG9ydCB7dXNlU29ja2V0fSBmcm9tICcuL3VzZVNvY2tldCdcbmltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi9hY3Rpb25UeXBlcyc7XG5pbXBvcnQgeyBtZXNzYWdlVG9TZXJ2ZXIsIG1lc3NhZ2VDYXRlZ29yaWVzIH0gZnJvbSAnLi9tZXNzYWdlVHlwZXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gdXNlSGFuZ291dHMoKSB7XG4gIGNvbnN0IHNvY2tldENvbnRleHQgPXVzZVdTb2NrZXRDb250ZXh0KClcbiAgY29uc3Qge3NvY2tldH09c29ja2V0Q29udGV4dFxuICBjb25zdCBhdXRoQ29udGV4dCA9IHVzZUF1dGhDb250ZXh0KCk7XG4gIGNvbnN0IHsgdXNlcm5hbWUgfSA9IGF1dGhDb250ZXh0LnN0YXRlO1xuICBjb25zdCBbc3RhdGUsIGRpc3BhdGNoXSA9IHVzZUhhbmdvdXRDb250ZXh0KCk7XG5cbiAgY29uc3QgeyBoYW5nb3V0LCBoYW5nb3V0cywgc2VhcmNoLCB1c2VycywgbWVzc2FnZVRleHQgfSA9IHN0YXRlO1xuICBjb25zdCBoYW5kbGVTb2NrZXQgPXVzZVNvY2tldCh7ZGlzcGF0Y2gsaGFuZ291dCx1c2VybmFtZX0pXG4gIGZ1bmN0aW9uIG9uU2VsZWN0SGFuZ291dChlKSB7XG4gICAgY29uc3QgdXNlcm5hbWUgPSBlLnRhcmdldC5pZDtcbiAgICA7XG4gICAgc2VsZWN0SGFuZ291dCh7IGRpc3BhdGNoLCB1c2VybmFtZSB9KTtcbiAgfVxuICBmdW5jdGlvbiBvblNlbGVjdFVzZXIoZSkge1xuICAgIGNvbnN0IHVuYW1lID0gZS50YXJnZXQuaWQ7XG4gICAgY29uc3QgdXNlciA9IHVzZXJzLmZpbmQoKHUpID0+IHUudXNlcm5hbWUgPT09IHVuYW1lKTtcbiAgICBzZWxlY3RVc2VyKHsgZGlzcGF0Y2gsIHVzZXIsIHVzZXJuYW1lIH0pO1xuICB9XG4gIGZ1bmN0aW9uIG9uSW52aXRlKCkge1xuICAgIGNvbnN0IHt1c2VybmFtZSxlbWFpbH09aGFuZ291dFxuICAgIGNvbnN0IHVwZGF0ZWRIYW5nb3V0ID0ge3VzZXJuYW1lLGVtYWlsLFxuICAgICAgbWVzc2FnZTogeyB0ZXh0OiBtZXNzYWdlVGV4dCwgdGltZXN0YW1wOiAgRGF0ZS5ub3coKSB9LFxuICAgIH07XG4gICAgO1xuICAgIHNvY2tldC5zZW5kKFxuICAgICAgSlNPTi5zdHJpbmdpZnkoeyAuLi51cGRhdGVkSGFuZ291dCwgdHlwZTogbWVzc2FnZVRvU2VydmVyLklOVklURSB9KVxuICAgICk7XG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5PRkZFUl9TVEFSVEVEIH0pO1xuICB9XG4gIGZ1bmN0aW9uIG9uQWNjZXB0KCkge1xuICAgIHNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHsgLi4uaGFuZ291dCwgdHlwZTogbWVzc2FnZVRvU2VydmVyLkFDQ0VQVCB9KSk7XG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5BQ0NFUFRfU1RBUlRFRCwgaGFuZ291dCB9KTtcbiAgfVxuICBmdW5jdGlvbiBvbkJsb2NrKCkge1xuICAgIHNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHsgLi4uaGFuZ291dCwgdHlwZTogbWVzc2FnZVRvU2VydmVyLkJsT0NLIH0pKTtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkJMT0NLX1NUQVJURUQsIGhhbmdvdXQgfSk7XG4gIH1cbiAgZnVuY3Rpb24gb25VbmJsb2NrKCkge1xuICAgIHNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHsgLi4uaGFuZ291dCwgdHlwZTogbWVzc2FnZVRvU2VydmVyLlVOQkxPQ0sgfSkpO1xuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuVU5CTE9DS19TVEFSVEVELCBoYW5nb3V0IH0pO1xuICB9XG4gIGZ1bmN0aW9uIG9uRGVjbGluZSgpIHtcbiAgICBzb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7IC4uLmhhbmdvdXQsIHR5cGU6IG1lc3NhZ2VUb1NlcnZlci5ERUNMSU5FIH0pKTtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkRFQ0xJTkVfU1RBUlRFRCwgaGFuZ291dCB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uTWVzc2FnZSgpIHtcbiAgICBzb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7IC4uLmhhbmdvdXQsIHR5cGU6IG1lc3NhZ2VUb1NlcnZlci5NRVNTQUdFIH0pKTtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLk1FU1NBR0VfU1RBUlRFRCwgaGFuZ291dCB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uU2VhcmNoKGUpIHtcbiAgICBzZWFyY2hIYW5nb3V0cyh7IHNlYXJjaDogZS50YXJnZXQudmFsdWUsIGRpc3BhdGNoIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gb25TdGFydFNlYXJjaChlKSB7XG4gICAgaWYgKGhhbmdvdXRzICYmIGhhbmdvdXRzLmxlbmd0aCA+IDApIHtcbiAgICAgIGZpbHRlckhhbmdvdXRzKHsgZGlzcGF0Y2ggfSk7XG4gICAgfVxuICAgIGZldGNoSGFuZ291dCh7IGRpc3BhdGNoLCBzZWFyY2gsdXNlcm5hbWUgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBvbk1lc3NhZ2VUZXh0KGUpIHtcbiAgICBjaGFuZ2VNZXNzYWdlVGV4dCh7IGRpc3BhdGNoLCB0ZXh0OiBlLnRhcmdldC52YWx1ZSB9KTtcbiAgfVxuXG4gIFxuXG4gIHJldHVybiB7XG4gICAgb25NZXNzYWdlVGV4dCxcbiAgICBtZXNzYWdlVGV4dCxcbiAgICBvblN0YXJ0U2VhcmNoLFxuICAgIG9uU2VhcmNoLFxuICAgIHNlYXJjaCxcbiAgICBvbk1lc3NhZ2UsXG4gICAgb25JbnZpdGUsXG4gICAgb25BY2NlcHQsXG4gICAgb25CbG9jayxcbiAgICBvblVuYmxvY2ssXG4gICAgb25TZWxlY3RIYW5nb3V0LFxuICAgIG9uU2VsZWN0VXNlcixcbiAgICBvbkRlY2xpbmUsXG4gICAgaGFuZ291dCxcbiAgICBoYW5nb3V0cyxcbiAgICB1c2VycyxcbiAgfTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlTG9jYWxIYW5nb3V0KHsgaGFuZ291dCwgdXNlcm5hbWUgfSkge1xuICBjb25zdCBsb2NhbEhhbmdvdXRzID0gSlNPTi5wYXJzZShcbiAgICBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShgJHt1c2VybmFtZX0taGFuZ291dHNgKVxuICApO1xuICBjb25zdCB1cGRhdGVkSGFuZ291dHMgPSBsb2NhbEhhbmdvdXRzLm1hcCgobGgpID0+IHtcbiAgICBpZiAobGgudXNlcm5hbWUgPT09IGhhbmdvdXQudXNlcm5hbWUpIHtcbiAgICAgIHJldHVybiBoYW5nb3V0O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbGg7XG4gICAgfVxuICB9KTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcbmltcG9ydCB7IGxhenksIFN1c3BlbnNlIH0gZnJvbSAncHJlYWN0L2NvbXBhdCc7XG5pbXBvcnQgeyBSb3V0ZSwgdXNlUm91dGVDb250ZXh0IH0gZnJvbSAnLi4vcm91dGUvcm91dGVyJztcbmltcG9ydCB7IHVzZUhhbmdvdXRzIH0gZnJvbSAnLi9zdGF0ZS91c2VIYW5nb3V0cyc7XG5jb25zdCBIYW5nb3V0cyA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL0hhbmdvdXQnKSk7XG5jb25zdCBCbG9jayA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL3N0YXRlLXVpL0Jsb2NrJykpO1xuY29uc3QgQmxvY2tlZCA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL3N0YXRlLXVpL0Jsb2NrZWQnKSk7XG5jb25zdCBDb25maWd1cmUgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9zdGF0ZS11aS9Db25maWd1cmUnKSk7XG5jb25zdCBIYW5nY2hhdCA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL3N0YXRlLXVpL0hhbmdjaGF0JykpO1xuY29uc3QgSW52aXRlID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vc3RhdGUtdWkvSW52aXRlJykpO1xuY29uc3QgSW52aXRlZSA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL3N0YXRlLXVpL0ludml0ZWUnKSk7XG5jb25zdCBJbnZpdGVyID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vc3RhdGUtdWkvSW52aXRlcicpKTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTW9iaWxlKCkge1xuICBjb25zdCBbcm91dGUsIHNldFJvdXRlXSA9IHVzZVJvdXRlQ29udGV4dCgpO1xuXG4gIGNvbnN0IHtcbiAgICBoYW5nb3V0LFxuICAgIGhhbmdvdXRzLFxuICAgIG9uQWNjZXB0LFxuICAgIG9uQmxvY2ssXG4gICAgb25JbnZpdGUsXG4gICAgb25TZWxlY3RIYW5nb3V0LFxuICAgIG9uU2VsZWN0VXNlcixcbiAgICBvblVuYmxvY2ssXG4gICAgb25TZWFyY2gsXG4gICAgdXNlcnMsXG4gICAgc2VhcmNoLFxuICAgIG9uU3RhcnRTZWFyY2gsXG4gICAgb25NZXNzYWdlVGV4dCxcbiAgICBtZXNzYWdlVGV4dFxuICB9ID0gdXNlSGFuZ291dHMoKTtcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoaGFuZ291dCkge1xuICAgICAgO1xuICAgICAgc2V0Um91dGUoYC8ke2hhbmdvdXQuc3RhdGV9YCk7XG4gICAgfVxuICB9LCBbaGFuZ291dF0pO1xuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3sgaGVpZ2h0OiAnODV2aCcgfX0+XG4gICAgICA8Um91dGUgcGF0aD1cIi9oYW5nb3V0c1wiPlxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+TG9hZGluZy4uLjwvZGl2Pn0+XG4gICAgICAgICAgPEhhbmdvdXRzXG4gICAgICAgICAgICB1c2Vycz17dXNlcnN9XG4gICAgICAgICAgICBzZWFyY2g9e3NlYXJjaH1cbiAgICAgICAgICAgIGhhbmdvdXRzPXtoYW5nb3V0c31cbiAgICAgICAgICAgIG9uU2VsZWN0SGFuZ291dD17b25TZWxlY3RIYW5nb3V0fVxuICAgICAgICAgICAgb25TZWxlY3RVc2VyPXtvblNlbGVjdFVzZXJ9XG4gICAgICAgICAgICBvblNlYXJjaD17b25TZWFyY2h9XG4gICAgICAgICAgICBvblN0YXJ0U2VhcmNoPXtvblN0YXJ0U2VhcmNofVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvU3VzcGVuc2U+XG4gICAgICA8L1JvdXRlPlxuICAgICAgPFJvdXRlIHBhdGg9XCIvQkxPQ0tcIj5cbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxuICAgICAgICAgIDxCbG9jayBoYW5nb3V0PXtoYW5nb3V0fSBvbkJsb2NrPXtvbkJsb2NrfSAvPlxuICAgICAgICA8L1N1c3BlbnNlPlxuICAgICAgPC9Sb3V0ZT5cbiAgICAgIDxSb3V0ZSBwYXRoPVwiL0JMT0NLRURcIj5cbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxuICAgICAgICAgIDxCbG9ja2VkIGhhbmdvdXQ9e2hhbmdvdXR9IG9uVW5ibG9jaz17b25VbmJsb2NrfSAvPlxuICAgICAgICA8L1N1c3BlbnNlPlxuICAgICAgPC9Sb3V0ZT5cbiAgICAgIDxSb3V0ZSBwYXRoPVwiL2NvbmZpZ3VyZVwiPlxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+TG9hZGluZy4uLjwvZGl2Pn0+XG4gICAgICAgICAgPENvbmZpZ3VyZSBoYW5nb3V0PXtoYW5nb3V0fSAvPlxuICAgICAgICA8L1N1c3BlbnNlPlxuICAgICAgPC9Sb3V0ZT5cbiAgICAgIDxSb3V0ZSBwYXRoPVwiL0hBTkdDSEFUXCI+XG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cbiAgICAgICAgICA8SGFuZ2NoYXQgLz5cbiAgICAgICAgPC9TdXNwZW5zZT5cbiAgICAgIDwvUm91dGU+XG4gICAgICA8Um91dGUgcGF0aD1cIi9JTlZJVEVcIj5cbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxuICAgICAgICAgIDxJbnZpdGUgaGFuZ291dD17aGFuZ291dH0gb25JbnZpdGU9e29uSW52aXRlfSBvbk1lc3NhZ2VUZXh0PXtvbk1lc3NhZ2VUZXh0fSBtZXNzYWdlVGV4dD17bWVzc2FnZVRleHR9Lz5cbiAgICAgICAgPC9TdXNwZW5zZT5cbiAgICAgIDwvUm91dGU+XG4gICAgICA8Um91dGUgcGF0aD1cIi9JTlZJVEVEXCI+XG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cbiAgICAgICAgICA8SW52aXRlZSBoYW5nb3V0PXtoYW5nb3V0fSAvPlxuICAgICAgICA8L1N1c3BlbnNlPlxuICAgICAgPC9Sb3V0ZT5cbiAgICAgIDxSb3V0ZSBwYXRoPVwiL0lOVklURVJcIj5cbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxuICAgICAgICAgIDxJbnZpdGVyIGhhbmdvdXQ9e2hhbmdvdXR9IG9uQWNjZXB0PXtvbkFjY2VwdH0gLz5cbiAgICAgICAgPC9TdXNwZW5zZT5cbiAgICAgIDwvUm91dGU+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IE1vYmlsZSBmcm9tICcuL21vYmlsZSc7XHJcbmltcG9ydCB7IEhhbmdvdXRzUHJvdmlkZXIgfSBmcm9tICcuL3N0YXRlL0hhbmdvdXRzUHJvdmlkZXInO1xyXG5pbXBvcnQgeyBSb3V0ZVByb3ZpZGVyLCB1c2VSb3V0ZUNvbnRleHQgfSBmcm9tICcuLi9yb3V0ZS9yb3V0ZXInO1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxIYW5nb3V0c1Byb3ZpZGVyPlxyXG4gICAgICA8Um91dGVQcm92aWRlciBpbml0aWFsUm91dGU9XCIvaGFuZ291dHNcIj5cclxuICAgICAgICA8TW9iaWxlIC8+XHJcbiAgICAgIDwvUm91dGVQcm92aWRlcj5cclxuICAgIDwvSGFuZ291dHNQcm92aWRlcj5cclxuICApO1xyXG59XHJcbiJdLCJuYW1lcyI6WyJhY3Rpb25UeXBlcyIsIk1FU1NBR0VfVEVYVF9DSEFOR0VEIiwiTE9BRF9IQU5HT1VUUyIsIkxPQURfTUVTU0FHRVMiLCJTRUFSQ0hFRF9IQU5HT1VUIiwiU0VMRUNURURfSEFOR09VVCIsIlNFTEVDVEVEX1VTRVIiLCJGSUxURVJfSEFOR09VVFMiLCJGRVRDSF9IQU5HT1VUX1NUQVJURUQiLCJGRVRDSF9IQU5HT1VUX1NVQ0NFU1MiLCJGRVRDSF9IQU5HT1VUX0ZBSUxFRCIsIkZFVENIX0hBTkdPVVRfTk9UX0ZPVU5EIiwiRkVUQ0hfVVNFUl9TVEFSVEVEIiwiRkVUQ0hfVVNFUl9TVUNDRVNTIiwiRkVUQ0hfVVNFUl9GQUlMRUQiLCJPTkxJTkVfU1RBVEVfQ0hBTkdFRCIsIk9GRkVSX1NUQVJURUQiLCJPRkZFUl9TVUNDRVNTIiwiT0ZGRVJfRkFJTEVEIiwiQUNDRVBUX1NUQVJURUQiLCJBQ0NFUFRfU1VDQ0VTUyIsIkFDQ0VQVF9GQUlMRUQiLCJCTE9DS19TVEFSVEVEIiwiQkxPQ0tfU1VDQ0VTUyIsIkJMT0NLX0ZBSUxFRCIsIlVOQkxPQ0tfU1RBUlRFRCIsIlVOQkxPQ0tfU1VDQ0VTUyIsIlVOQkxPQ0tfRkFJTEVEIiwiTUVTU0FHRV9TVEFSVEVEIiwiTUVTU0FHRV9TVUNDRVNTIiwiTUVTU0FHRV9GQUlMRUQiLCJERUNMSU5FX1NUQVJURUQiLCJERUNMSU5FX1NVQ0NFU1MiLCJERUNMSU5FX0ZBSUxFRCIsIkhBTkdPVVRfQ0hBTkdFRF9JVFNfU1RBVEUiLCJPRkZFUkVSX1JFQ0lFVkVEIiwiQUNLTk9XTEVER0VNRU5UX1JFQ0lFVkVEIiwiaW5pdFN0YXRlIiwiaGFuZ291dHMiLCJoYW5nb3V0IiwibWVzc2FnZXMiLCJzZWFyY2giLCJ1c2VyIiwibG9hZGluZyIsImVycm9yIiwibWVzc2FnZVRleHQiLCJvbmxpbmUiLCJyZWR1Y2VyIiwic3RhdGUiLCJhY3Rpb24iLCJ0eXBlIiwidGV4dCIsInVzZXJzIiwiSEFOR09VVF9OT1RfRk9VTkQiLCJmaWx0ZXIiLCJnIiwidXNlcm5hbWUiLCJpbmNsdWRlcyIsImZpbmQiLCJtYXAiLCJtZXNzYWdlc0Zyb21TZXJ2ZXIiLCJCTE9DS0VSIiwiQUNDRVBURVIiLCJVTkJMT0NLRVIiLCJJTlZJVEVSIiwiREVDTElORVIiLCJNRVNTQU5HRVIiLCJtZXNzYWdlVG9TZXJ2ZXIiLCJBQ0NFUFQiLCJERUNMSU5FIiwiSU5WSVRFIiwiQmxPQ0siLCJVTkJMT0NLIiwiTUVTU0FHRSIsIm1lc3NhZ2VDYXRlZ29yaWVzIiwiQUNLTk9XTEVER0VNRU5UIiwiUEVFUiIsImxvYWRIYW5nb3V0cyIsImRpc3BhdGNoIiwiSlNPTiIsInBhcnNlIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsInNlbGVjdEhhbmdvdXQiLCJzZWxlY3RVc2VyIiwic2V0SXRlbSIsInN0cmluZ2lmeSIsInNlYXJjaEhhbmdvdXRzIiwiZmlsdGVySGFuZ291dHMiLCJmZXRjaEhhbmdvdXQiLCJyZXNwb25zZSIsImZldGNoIiwib2siLCJqc29uIiwibGVuZ3RoIiwiZmV0Y2hVc2VyIiwiY2hhbmdlTWVzc2FnZVRleHQiLCJIYW5nb3V0Q29udGV4dCIsImNyZWF0ZUNvbnRleHQiLCJ1c2VIYW5nb3V0Q29udGV4dCIsImNvbnRleHQiLCJ1c2VDb250ZXh0IiwiRXJyb3IiLCJIYW5nb3V0c1Byb3ZpZGVyIiwicHJvcHMiLCJhdXRoQ29udGV4dCIsInVzZUF1dGhDb250ZXh0IiwidXNlUmVkdWNlciIsInVzZUVmZmVjdCIsInZhbHVlIiwidXNlTWVtbyIsImgiLCJ1cGRhdGVBY2tub3dsZWRnZW1lbnQiLCJhY2tub3dsZWRnZW1lbnQiLCJlbWFpbCIsIm1lc3NhZ2VUb05ld0hhbmdvdXQiLCJtc2ciLCJtZXNzYWdlIiwidXNlU29ja2V0Iiwic29ja2V0Q29udGV4dCIsInVzZVdTb2NrZXRDb250ZXh0Iiwic29ja2V0Iiwib25tZXNzYWdlIiwiZGF0YSIsImNhdGVnb3J5IiwiaGFuZGxlQWNraG93bGVkZ2VtZW50cyIsImhhbmRsZVBlZXJNZXNzYWdlcyIsIm9uY2xvc2UiLCJvbmVycm9yIiwib25vcGVuIiwidXBkYXRlZEhhbmdvdXQiLCJ1cGRhdGVIYW5nb3V0U3RhdGVJbkxvY2FsU3RvcmFnZSIsIm1lc3NhZ2VUb0hhbmdvdXQiLCJuZXdIYW5nb3V0IiwiYWRkTmV3SGFuZ291dFRvTG9jYWxTdG9yYWdlIiwia2V5IiwidXBkYXRlZCIsImluc2VydGVkIiwicHVzaCIsInVzZUhhbmdvdXRzIiwiaGFuZGxlU29ja2V0Iiwib25TZWxlY3RIYW5nb3V0IiwiZSIsInRhcmdldCIsImlkIiwib25TZWxlY3RVc2VyIiwidW5hbWUiLCJ1Iiwib25JbnZpdGUiLCJ0aW1lc3RhbXAiLCJEYXRlIiwibm93Iiwic2VuZCIsIm9uQWNjZXB0Iiwib25CbG9jayIsIm9uVW5ibG9jayIsIm9uRGVjbGluZSIsIm9uTWVzc2FnZSIsIm9uU2VhcmNoIiwib25TdGFydFNlYXJjaCIsIm9uTWVzc2FnZVRleHQiLCJIYW5nb3V0cyIsImxhenkiLCJCbG9jayIsIkJsb2NrZWQiLCJDb25maWd1cmUiLCJIYW5nY2hhdCIsIkludml0ZSIsIkludml0ZWUiLCJJbnZpdGVyIiwiTW9iaWxlIiwicm91dGUiLCJzZXRSb3V0ZSIsInVzZVJvdXRlQ29udGV4dCIsImhlaWdodCIsIlN1c3BlbnNlIl0sIm1hcHBpbmdzIjoiOztBQUFPLE1BQU1BLFdBQVcsR0FBRztBQUN2QkMsRUFBQUEsb0JBQW9CLEVBQUMsc0JBREU7QUFFdkJDLEVBQUFBLGFBQWEsRUFBRSxlQUZRO0FBR3ZCQyxFQUFBQSxhQUFhLEVBQUUsZUFIUTtBQUl2QkMsRUFBQUEsZ0JBQWdCLEVBQUUsa0JBSks7QUFLdkJDLEVBQUFBLGdCQUFnQixFQUFFLGtCQUxLO0FBTXZCQyxFQUFBQSxhQUFhLEVBQUMsZUFOUztBQU92QkMsRUFBQUEsZUFBZSxFQUFDLGlCQVBPO0FBU3ZCQyxFQUFBQSxxQkFBcUIsRUFBRSx1QkFUQTtBQVV2QkMsRUFBQUEscUJBQXFCLEVBQUUsdUJBVkE7QUFXdkJDLEVBQUFBLG9CQUFvQixFQUFFLHNCQVhDO0FBWXZCQyxFQUFBQSx1QkFBdUIsRUFBRSx5QkFaRjtBQWV2QkMsRUFBQUEsa0JBQWtCLEVBQUUsb0JBZkc7QUFnQnZC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
