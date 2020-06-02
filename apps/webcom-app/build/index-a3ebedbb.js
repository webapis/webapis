import { u as useWSocketContext, l, M, a as useAuthContext, p, h, b as h$1, _ as _extends, w, c as useRouteContext, R as Route, d as M$1, O, e as RouteProvider } from './index-e07c79e5.js';

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
  dispatch,
  hangout
}) {
  const socketContext = useWSocketContext();
  const {
    socket
  } = socketContext;
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
  const [state, dispatch] = p(reducer, initState);
  const {
    hangout,
    hangouts,
    search,
    users
  } = state;
  const sockethandler = useSocket({
    dispatch,
    hangout
  });
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

const Hangouts = O(() => import('./Hangout-0b242c3a.js'));
const Block = O(() => import('./Block-ff49637f.js'));
const Blocked = O(() => import('./Blocked-c232eb75.js'));
const Configure = O(() => import('./Configure-a6a53a67.js'));
const Hangchat = O(() => import('./Hangchat-294a7df6.js'));
const Invite = O(() => import('./Invite-b5e01354.js'));
const Invitee = O(() => import('./Invitee-6166aeb1.js'));
const Inviter = O(() => import('./Inviter-2e922942.js'));
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
  return h$1(HangoutsProvider, null, h$1(RouteProvider, {
    initialRoute: "/hangouts"
  }, h$1(Mobile, null)));
}

export default index;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtYTNlYmVkYmIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25UeXBlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9yZWR1Y2VyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL21lc3NhZ2VUeXBlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25zLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL21lc3NhZ2VDb252ZXJ0ZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvdXNlU29ja2V0LmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL0hhbmdvdXRzUHJvdmlkZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvdXNlSGFuZ291dHMuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvbW9iaWxlLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBhY3Rpb25UeXBlcyA9IHtcbiAgICBNRVNTQUdFX1RFWFRfQ0hBTkdFRDonTUVTU0FHRV9URVhUX0NIQU5HRUQnLFxuICAgIExPQURfSEFOR09VVFM6ICdMT0FEX0hBTkdPVVRTJyxcbiAgICBMT0FEX01FU1NBR0VTOiAnTE9BRF9NRVNTQUdFUycsXG4gICAgU0VBUkNIRURfSEFOR09VVDogJ1NFQVJDSEVEX0hBTkdPVVQnLFxuICAgIFNFTEVDVEVEX0hBTkdPVVQ6ICdTRUxFQ1RFRF9IQU5HT1VUJyxcbiAgICBTRUxFQ1RFRF9VU0VSOidTRUxFQ1RFRF9VU0VSJyxcbiAgICBGSUxURVJfSEFOR09VVFM6J0ZJTFRFUl9IQU5HT1VUUycsXG5cbiAgICBGRVRDSF9IQU5HT1VUX1NUQVJURUQ6ICdGRVRDSF9IQU5HT1VUX1NUQVJURUQnLFxuICAgIEZFVENIX0hBTkdPVVRfU1VDQ0VTUzogJ0ZFVENIX0hBTkdPVVRfU1VDQ0VTUycsXG4gICAgRkVUQ0hfSEFOR09VVF9GQUlMRUQ6ICdGRVRDSF9IQU5HT1VUX0ZBSUxFRCcsXG4gICAgRkVUQ0hfSEFOR09VVF9OT1RfRk9VTkQ6ICdGRVRDSF9IQU5HT1VUX05PVF9GT1VORCcsXG5cblxuICAgIEZFVENIX1VTRVJfU1RBUlRFRDogJ0ZFVENIX1VTRVJfU1RBUlRFRCcsXG4gICAgRkVUQ0hfVVNFUl9TVUNDRVNTOiAnRkVUQ0hfVVNFUl9TVUNDRVNTJyxcbiAgICBGRVRDSF9VU0VSX0ZBSUxFRDogJ0ZFVENIX1VTRVJfRkFJTEVEJyxcblxuXG4gICAgT05MSU5FX1NUQVRFX0NIQU5HRUQ6ICdPTkxJTkVfU1RBVEVfQ0hBTkdFRCcsXG5cblxuICAgIE9GRkVSX1NUQVJURUQ6ICdPRkZFUl9TVEFSVEVEJyxcbiAgICBPRkZFUl9TVUNDRVNTOiAnT0ZGRVJfU1VDQ0VTUycsXG4gICAgT0ZGRVJfRkFJTEVEOiAnT0ZGRVJfRkFJTEVEJyxcblxuICAgIEFDQ0VQVF9TVEFSVEVEOiAnQUNDRVBUX1NUQVJURUQnLFxuICAgIEFDQ0VQVF9TVUNDRVNTOiAnQUNDRVBUX1NVQ0NFU1MnLFxuICAgIEFDQ0VQVF9GQUlMRUQ6ICdBQ0NFUFRfRkFJTEVEJyxcblxuICAgIEJMT0NLX1NUQVJURUQ6ICdCTE9DS19TVEFSVEVEJyxcbiAgICBCTE9DS19TVUNDRVNTOiAnQkxPQ0tfU1VDQ0VTUycsXG4gICAgQkxPQ0tfRkFJTEVEOiAnQkxPQ0tfRkFJTEVEJyxcblxuICAgIFVOQkxPQ0tfU1RBUlRFRDogJ1VOQkxPQ0tfU1RBUlRFRCcsXG4gICAgVU5CTE9DS19TVUNDRVNTOiAnVU5CTE9DS19TVUNDRVNTJyxcbiAgICBVTkJMT0NLX0ZBSUxFRDogJ1VOQkxPQ0tfRkFJTEVEJyxcblxuICAgIE1FU1NBR0VfU1RBUlRFRDogJ01FU1NBR0VfU1RBUlRFRCcsXG4gICAgTUVTU0FHRV9TVUNDRVNTOiAnTUVTU0FHRV9TVUNDRVNTJyxcbiAgICBNRVNTQUdFX0ZBSUxFRDogJ01FU1NBR0VfRkFJTEVEJyxcblxuICAgIERFQ0xJTkVfU1RBUlRFRDonREVDTElORV9TVEFSVEVEJyxcbiAgICBERUNMSU5FX1NVQ0NFU1M6J0RFQ0xJTkVfU1VDQ0VTUycsXG4gICAgREVDTElORV9GQUlMRUQ6J0RFQ0xJTkVfRkFJTEVEJyxcblxuICAgIEhBTkdPVVRfQ0hBTkdFRF9JVFNfU1RBVEU6ICdIQU5HT1VUX0NIQU5HRURfSVRTX1NUQVRFJyxcbiAgICBPRkZFUkVSX1JFQ0lFVkVEOiAnT0ZGRVJFUl9SRUNJRVZFRCcsXG4gICAgQUNLTk9XTEVER0VNRU5UX1JFQ0lFVkVEOidBQ0tOT1dMRURHRU1FTlRfUkVDSUVWRUQnXG59IiwiaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuL2FjdGlvblR5cGVzJztcbmV4cG9ydCBjb25zdCBpbml0U3RhdGUgPSB7XG4gIGhhbmdvdXRzOiBbXSxcbiAgaGFuZ291dDogbnVsbCxcblxuICBtZXNzYWdlczogW10sXG4gIHNlYXJjaDogJycsXG4gIHVzZXI6IFtdLFxuICBsb2FkaW5nOiBmYWxzZSxcbiAgZXJyb3I6IG51bGwsXG4gIG1lc3NhZ2VUZXh0OiAnJyxcbiAgb25saW5lOmZhbHNlXG59O1xuZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZXIoc3RhdGUsIGFjdGlvbikge1xuICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5PRkZFUl9TVEFSVEVEOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgbG9hZGluZzp0cnVlXG4gICAgICB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuTUVTU0FHRV9URVhUX0NIQU5HRUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbWVzc2FnZVRleHQ6IGFjdGlvbi50ZXh0IH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9VU0VSX0ZBSUxFRDpcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfRkFJTEVEOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBlcnJvcjogYWN0aW9uLmVycm9yIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9VU0VSX1NUQVJURUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogdHJ1ZSB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuRkVUQ0hfVVNFUl9TVUNDRVNTOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgICAgICB1c2VyczogYWN0aW9uLnVzZXJzLFxuICAgICAgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfU1RBUlRFRDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiB0cnVlIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NVQ0NFU1M6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGhhbmdvdXRzOiBhY3Rpb24uaGFuZ291dHMgfTtcblxuICAgIGNhc2UgYWN0aW9uVHlwZXMuSEFOR09VVF9OT1RfRk9VTkQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZJTFRFUl9IQU5HT1VUUzpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBoYW5nb3V0czogc3RhdGUuaGFuZ291dHMuZmlsdGVyKChnKSA9PlxuICAgICAgICAgIGcudXNlcm5hbWUuaW5jbHVkZXMoc3RhdGUuc2VhcmNoKVxuICAgICAgICApLFxuICAgICAgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNFQVJDSEVEX0hBTkdPVVQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgc2VhcmNoOiBhY3Rpb24uc2VhcmNoIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0FEX0hBTkdPVVRTOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGhhbmdvdXRzOiBhY3Rpb24uaGFuZ291dHMgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNFTEVDVEVEX1VTRVI6XG4gICAgICBpZiAoc3RhdGUuaGFuZ291dHMpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgICBoYW5nb3V0czogWy4uLnN0YXRlLmhhbmdvdXRzLCBhY3Rpb24uaGFuZ291dF0sXG4gICAgICAgICAgaGFuZ291dDogYWN0aW9uLmhhbmdvdXQsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgaGFuZ291dHM6IFthY3Rpb24uaGFuZ291dF0sXG4gICAgICAgIGhhbmdvdXQ6IGFjdGlvbi5oYW5nb3V0LFxuICAgICAgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNFTEVDVEVEX0hBTkdPVVQ6XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgaGFuZ291dDogc3RhdGUuaGFuZ291dHMuZmluZCgoZykgPT4gZy51c2VybmFtZSA9PT0gYWN0aW9uLnVzZXJuYW1lKSxcbiAgICAgIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5IQU5HT1VUX0NIQU5HRURfSVRTX1NUQVRFOlxuICAgIGNhc2UgYWN0aW9uVHlwZXMuQUNLTk9XTEVER0VNRU5UX1JFQ0lFVkVEOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIGhhbmdvdXRzOiBzdGF0ZS5oYW5nb3V0cy5tYXAoKGcpID0+IHtcbiAgICAgICAgICBpZiAoZy51c2VybmFtZSA9PT0gYWN0aW9uLmhhbmdvdXQudXNlcm5hbWUpIHtcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24uaGFuZ291dDtcbiAgICAgICAgICB9IGVsc2UgcmV0dXJuIGc7XG4gICAgICAgIH0pLFxuICAgICAgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLk9GRkVSRVJfUkVDSUVWRUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgaGFuZ291dHM6IFsuLi5zdGF0ZS5oYW5nb3V0cywgYWN0aW9uLmhhbmdvdXRdIH07XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgfVxufVxuIiwiZXhwb3J0IGNvbnN0IGFja25vd2xlZGdtZW50VHlwZXMgPSB7XG4gICAgT0ZGRVJFRDogJ09GRkVSRUQnLFxuICAgIEFDQ0VQVEVEOiAnQUNDRVBURUQnLFxuICAgIEJMT0NLRUQ6ICdCTE9DS0VEJyxcbiAgICBVTkJMT0NLRUQ6ICdVTkJMT0NLRUQnLFxuICAgIERFQ0xJTkVEOiAnREVDTElORUQnLFxuICAgIE1FU1NBR0VEOiAnTUVTU0FHRUQnXG59XG5cblxuZXhwb3J0IGNvbnN0IG1lc3NhZ2VzRnJvbVNlcnZlciA9IHtcbiAgICBCTE9DS0VSOiAnQkxPQ0tFUicsXG4gICAgQUNDRVBURVI6ICdBQ0NFUFRFUicsXG4gICAgVU5CTE9DS0VSOiAnVU5CTE9DS0VSJyxcbiAgICBPRkZFUkVSOiAnT0ZGRVJFUicsXG4gICAgREVDTElORVI6ICdERUNMSU5FUicsXG4gICAgTUVTU0FOR0VSOiAnTUVTU0FOR0VSJ1xuXG59XG5cbmV4cG9ydCBjb25zdCBtZXNzYWdlVG9TZXJ2ZXIgPSB7XG4gICAgQUNDRVBUOiAnQUNDRVBUJyxcbiAgICBERUNMSU5FOiAnREVDTElORScsXG4gICAgT0ZGRVI6ICdPRkZFUicsXG4gICAgQmxPQ0s6ICdCbE9DSycsXG4gICAgVU5CTE9DSzogJ1VOQkxPQ0snLFxuICAgIE1FU1NBR0U6ICdNRVNTQUdFJ1xuXG59XG4vLyBzZXJ2ZXIgc2lkZSBtZXNzYWdlXG5leHBvcnQgY29uc3QgbWVzc2FnZUNhdGVnb3JpZXM9e1xuICAgIEFDS05PV0xFREdFTUVOVDonQUNLTk9XTEVER0VNRU5UJyxcbiAgICBQRUVSOidQRUVSJ1xufSIsImltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi9hY3Rpb25UeXBlcyc7XG5pbXBvcnQgeyBtZXNzYWdlc0Zyb21TZXJ2ZXIgfSBmcm9tICcuL21lc3NhZ2VUeXBlcyc7XG5cbi8vcmV0cmlldmVzIGhhbmdvdXRzIGZyb20gbG9jYWxTdG9yYWdlXG5leHBvcnQgZnVuY3Rpb24gbG9hZEhhbmdvdXRzKHsgdXNlcm5hbWUsIGRpc3BhdGNoIH0pIHtcbiAgY29uc3QgaGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGAke3VzZXJuYW1lfS1oYW5nb3V0c2ApKTtcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5MT0FEX0hBTkdPVVRTLCBoYW5nb3V0cyB9KTtcbn1cbi8vc2VsZWN0IGhhbmdvdXQgZnJvbSBMaXN0XG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0SGFuZ291dCh7IGRpc3BhdGNoLCB1c2VybmFtZSB9KSB7XG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VMRUNURURfSEFOR09VVCwgdXNlcm5hbWUgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZWxlY3RVc2VyKHtkaXNwYXRjaCwgdXNlcix1c2VybmFtZX0pe1xuICAvLyBzYXZlIHNlbGVjdGVkIHVzZXIgdG8gaGFuZ291dHNcbiAgY29uc3QgaGFuZ291dCA9IHsuLi51c2VyLCBzdGF0ZTonSU5WSVRFJ31cbiAgY29uc3QgaGFuZ291dHMgPUpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oYCR7dXNlcm5hbWV9LWhhbmdvdXRzYCkpXG4gXG4gIGlmKGhhbmdvdXRzKXtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShgJHt1c2VybmFtZX0taGFuZ291dHNgLCBKU09OLnN0cmluZ2lmeShbLi4uaGFuZ291dHMsaGFuZ291dF0pKVxuICB9XG4gIGVsc2V7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oYCR7dXNlcm5hbWV9LWhhbmdvdXRzYCwgSlNPTi5zdHJpbmdpZnkoW2hhbmdvdXRdKSlcbiAgfVxuXG4gIGRpc3BhdGNoKHt0eXBlOmFjdGlvblR5cGVzLlNFTEVDVEVEX1VTRVIsaGFuZ291dH0pXG59XG4vL3NlYXJjaCBmb3IgaGFuZ291dCBieSB0eXBpbmcgaW50byBUZXh0SW5wdXRcbmV4cG9ydCBmdW5jdGlvbiBzZWFyY2hIYW5nb3V0cyh7IHNlYXJjaCwgZGlzcGF0Y2ggfSkge1xuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFQVJDSEVEX0hBTkdPVVQsIHNlYXJjaCB9KTtcbn1cbi8vZmlsdGVyIGhhbmdvdXQgYWZ0ZXIgc2VhcmNoIHN0YXRlIGNoYW5nZVxuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlckhhbmdvdXRzKHsgZGlzcGF0Y2ggfSkge1xuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZJTFRFUl9IQU5HT1VUUyB9KTtcbn1cblxuLy9mZXRjaCBoYW5nb3V0IGZyb20gc2VydmVyIGlmIG5vdCBmb3VuZCBpbiBsb2NhbCBoYW5nb3V0c1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoSGFuZ291dCh7IHNlYXJjaCwgZGlzcGF0Y2ggfSkge1xuICBcbiAgdHJ5IHtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfU1RBUlRFRCB9KTtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAvaGFuZ291dHMvZmluZD9zZWFyY2g9JHtzZWFyY2h9YCk7XG5cbiAgIGlmKHJlc3BvbnNlLm9rKXtcbiAgICBjb25zdCB7IGhhbmdvdXRzIH0gPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG5cbiAgICBpZiAoaGFuZ291dHMubGVuZ3RoID4gMCkge1xuXG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfU1VDQ0VTUywgaGFuZ291dHMgfSk7XG4gICAgfSAgZWxzZXtcbiAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9OT1RfRk9VTkQgfSk7XG4gICAgICAvLyBmZXRjaCB1c2VyIGZyb20gc2VydmVyIGluIGhhbmdvdXQgaXMgbmV3dXNlclxuICAgICAgZmV0Y2hVc2VyKHsgc2VhcmNoLCBkaXNwYXRjaCB9KTtcbiAgICAgfVxuXG4gICB9XG4gICBlbHNle1xuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9OT1RfRk9VTkQgfSk7XG4gICAgLy8gZmV0Y2ggdXNlciBmcm9tIHNlcnZlciBpbiBoYW5nb3V0IGlzIG5ld3VzZXJcbiAgICBmZXRjaFVzZXIoeyBzZWFyY2gsIGRpc3BhdGNoIH0pO1xuICAgfVxuXG4gIH0gY2F0Y2ggKGVycm9yKSB7XG5cbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfRkFJTEVELCBlcnJvciB9KTtcbiAgfVxufVxuICAvLyBmZXRjaCB1c2VyIGZyb20gc2VydmVyIGluIGhhbmdvdXQgaXMgbmV3dXNlclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoVXNlcih7IHNlYXJjaCwgZGlzcGF0Y2ggfSkge1xuXG4gIHRyeSB7XG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9VU0VSX1NUQVJURUQgfSk7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL3VzZXJzL2ZpbmQ/c2VhcmNoPSR7c2VhcmNofWApO1xuICAgIGNvbnN0IHsgdXNlcnMgfSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcblxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfVVNFUl9TVUNDRVNTLCB1c2VycyB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX1VTRVJfRkFJTEVELCBlcnJvciB9KTtcbiAgfVxufVxuXG5cblxuXG5leHBvcnQgZnVuY3Rpb24gY2hhbmdlTWVzc2FnZVRleHQoe3RleHQsZGlzcGF0Y2h9KXtcbmRpc3BhdGNoKHt0eXBlOmFjdGlvblR5cGVzLk1FU1NBR0VfVEVYVF9DSEFOR0VELHRleHR9KVxuXG59XG5cblxuIiwiZXhwb3J0IGZ1bmN0aW9uIGhhbmdvdXRUb01lc3NhZ2UoeyBoYW5nb3V0LCB0eXBlIH0pIHtcbiBcbiAgICByZXR1cm57IHVzZXJuYW1lOiBoYW5nb3V0LnVzZXJuYW1lLCB0eXBlLCBtZXNzYWdlOiBoYW5nb3V0Lm1lc3NhZ2UgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbWVzc2FnZVRvSGFuZ291dCh7IG1lc3NhZ2UsIGhhbmdvdXQgfSkge1xuICBcbiAgICByZXR1cm4geyAuLi5oYW5nb3V0LCBzdGF0ZTogbWVzc2FnZS50eXBlLCBtZXNzYWdlOiBtZXNzYWdlIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1lc3NhZ2VUb05ld0hhbmdvdXQobXNnKSB7XG4gICAgY29uc3QgeyB1c2VybmFtZSwgZW1haWwsIHR5cGUsIG1lc3NhZ2UgfSA9IG1zZ1xuICAgIGNvbnN0IGhhbmdvdXQgPSB7IHVzZXJuYW1lLCBzdGF0ZTogdHlwZSwgZW1haWwsIG1lc3NhZ2UgfVxuICAgIHJldHVybiBoYW5nb3V0XG59IiwiaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcbmltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi9hY3Rpb25UeXBlcyc7XG5pbXBvcnQgeyBtZXNzYWdlVG9IYW5nb3V0LCBtZXNzYWdlVG9OZXdIYW5nb3V0IH0gZnJvbSAnLi9tZXNzYWdlQ29udmVydGVyJztcbmltcG9ydCB7IG1lc3NhZ2VzRnJvbVNlcnZlciwgbWVzc2FnZUNhdGVnb3JpZXMgfSBmcm9tICcuL21lc3NhZ2VUeXBlcyc7XG5pbXBvcnQgeyB1c2VXU29ja2V0Q29udGV4dCB9IGZyb20gJy4uLy4uL3dzb2NrZXQvV1NvY2tldFByb3ZpZGVyJztcbmV4cG9ydCBmdW5jdGlvbiB1c2VTb2NrZXQoeyBkaXNwYXRjaCwgaGFuZ291dCB9KSB7XG4gIGNvbnN0IHNvY2tldENvbnRleHQgPSB1c2VXU29ja2V0Q29udGV4dCgpO1xuY29uc3Qge3NvY2tldH09c29ja2V0Q29udGV4dFxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChzb2NrZXQpIHtcbiAgICAgIHNvY2tldC5vbm1lc3NhZ2UgPSAobWVzc2FnZSkgPT4ge1xuICAgICAgICBjb25zdCBtc2cgPSBKU09OLnBhcnNlKG1lc3NhZ2UuZGF0YSk7XG4gICAgICAgIHN3aXRjaCAobXNnLmNhdGVnb3J5KSB7XG4gICAgICAgICAgY2FzZSBtZXNzYWdlQ2F0ZWdvcmllcy5BQ0tOT1dMRURHRU1FTlQ6XG4gICAgICAgICAgICBoYW5kbGVBY2tob3dsZWRnZW1lbnRzKHsgZGlzcGF0Y2gsIG1zZywgaGFuZ291dCB9KTtcbiAgICAgICAgICBjYXNlIG1lc3NhZ2VDYXRlZ29yaWVzLlBFRVI6XG4gICAgICAgICAgICBoYW5kbGVQZWVyTWVzc2FnZXMoeyBkaXNwYXRjaCwgbXNnLCBoYW5nb3V0IH0pO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ01lc3NhZ2UgY2F0ZW9yeSBpcyBub3QgZGVmaW5lZCcpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgc29ja2V0Lm9uY2xvc2UgPSAoKSA9PiB7XG4gICAgICAgIGRlYnVnZ2VyO1xuICAgICAgfTtcbiAgICAgIHNvY2tldC5vbmVycm9yID0gKGVycm9yKSA9PiB7XG4gICAgICAgIGRlYnVnZ2VyO1xuICAgICAgfTtcbiAgICAgIHNvY2tldC5vbm9wZW4gPSAoKSA9PiB7XG4gICAgICAgIGRlYnVnZ2VyO1xuICAgICAgfTtcbiAgICB9XG4gIH0sIFtzb2NrZXRdKTtcblxuICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gaGFuZGxlQWNraG93bGVkZ2VtZW50cyh7IGRpc3BhdGNoLCBtc2csIGhhbmdvdXQgfSkge1xuICBsZXQgdXBkYXRlZEhhbmdvdXQgPSBtZXNzYWdlVG9IYW5nb3V0KHsgaGFuZ291dCwgbWVzc2FnZTogbXNnIH0pO1xuICBkaXNwYXRjaCh7XG4gICAgdHlwZTogYWN0aW9uVHlwZXMuQUNLTk9XTEVER0VNRU5UX1JFQ0lFVkVELFxuICAgIGhhbmdvdXQ6IHVwZGF0ZWRIYW5nb3V0LFxuICB9KTtcbiAgdXBkYXRlSGFuZ291dFN0YXRlSW5Mb2NhbFN0b3JhZ2UoYCR7dXNlcm5hbWV9LWhhbmdvdXRzYCwgdXBkYXRlZEhhbmdvdXQpO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVQZWVyTWVzc2FnZXMoeyBkaXNwYXRjaCwgbXNnLCBoYW5nb3V0IH0pIHtcbiAgbGV0IHVwZGF0ZWRIYW5nb3V0ID0gbWVzc2FnZVRvSGFuZ291dCh7IGhhbmdvdXQsIG1lc3NhZ2U6IG1zZyB9KTtcbiAgbGV0IG5ld0hhbmdvdXQgPSBtZXNzYWdlVG9OZXdIYW5nb3V0KG1zZyk7XG4gIHN3aXRjaCAobXNnLnR5cGUpIHtcbiAgICBjYXNlIG1lc3NhZ2VzRnJvbVNlcnZlci5CTE9DS0VSOlxuICAgIGNhc2UgbWVzc2FnZXNGcm9tU2VydmVyLkRFQ0xJTkVSOlxuICAgIGNhc2UgbWVzc2FnZXNGcm9tU2VydmVyLk1FU1NBTkdFUjpcbiAgICBjYXNlIG1lc3NhZ2VzRnJvbVNlcnZlci5VTkJMT0NLRVI6XG4gICAgY2FzZSBtZXNzYWdlc0Zyb21TZXJ2ZXIuQUNDRVBURVI6XG4gICAgICBkaXNwYXRjaCh7XG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVzLkhBTkdPVVRfQ0hBTkdFRF9JVFNfU1RBVEUsXG4gICAgICAgIGhhbmdvdXQ6IHVwZGF0ZWRIYW5nb3V0LFxuICAgICAgfSk7XG4gICAgICB1cGRhdGVIYW5nb3V0U3RhdGVJbkxvY2FsU3RvcmFnZShgJHt1c2VybmFtZX0taGFuZ291dHNgLCB1cGRhdGVkSGFuZ291dCk7XG4gICAgY2FzZSBtZXNzYWdlc0Zyb21TZXJ2ZXIuT0ZGRVJFUjpcbiAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZXMuSEFOR09VVF9DSEFOR0VEX0lUU19TVEFURSxcbiAgICAgICAgaGFuZ291dDogbmV3SGFuZ291dCxcbiAgICAgIH0pO1xuICAgICAgYWRkTmV3SGFuZ291dFRvTG9jYWxTdG9yYWdlKGAke3VzZXJuYW1lfS1oYW5nb3V0c2AsIHVwZGF0ZWRIYW5nb3V0KTtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdNZXNzYWdlIHR5cGUgZm9yIG1lc3NhZ2VzRnJvbVNlcnZlciBpcyBub3QgZGVmaW5lZCcpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUhhbmdvdXRTdGF0ZUluTG9jYWxTdG9yYWdlKGtleSwgaGFuZ291dCkge1xuICBjb25zdCBoYW5nb3V0cyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSk7XG4gIGNvbnN0IHVwZGF0ZWQgPSBoYW5nb3V0cy5tYXAoKGcpID0+IHtcbiAgICBpZiAoZy51c2VybmFtZSA9PT0gaGFuZ291dC51c2VybmFtZSkge1xuICAgICAgcmV0dXJuIGhhbmdvdXQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBnO1xuICAgIH1cbiAgfSk7XG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkodXBkYXRlZCkpO1xufVxuXG5mdW5jdGlvbiBhZGROZXdIYW5nb3V0VG9Mb2NhbFN0b3JhZ2Uoa2V5LCBoYW5nb3V0KSB7XG4gIGNvbnN0IGhhbmdvdXRzID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KTtcbiAgY29uc3QgaW5zZXJ0ZWQgPSBoYW5nb3V0cy5wdXNoKGhhbmdvdXQpO1xuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KGluc2VydGVkKSk7XG59XG4iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7XG4gIHVzZUNvbnRleHQsXG4gIHVzZVN0YXRlLFxuICB1c2VNZW1vLFxuICB1c2VSZWR1Y2VyLFxuICB1c2VFZmZlY3QsXG59IGZyb20gJ3ByZWFjdC9ob29rcyc7XG5pbXBvcnQgeyByZWR1Y2VyLCBpbml0U3RhdGUgfSBmcm9tICcuL3JlZHVjZXInO1xuaW1wb3J0IHsgbG9hZEhhbmdvdXRzLCBmaWx0ZXJIYW5nb3V0cyxmZXRjaEhhbmdvdXQgfSBmcm9tICcuL2FjdGlvbnMnO1xuaW1wb3J0IHsgdXNlU29ja2V0IH0gZnJvbSAnLi91c2VTb2NrZXQnO1xuaW1wb3J0IHsgdXNlQXV0aENvbnRleHQgfSBmcm9tICcuLi8uLi9hdXRoL2F1dGgtY29udGV4dCc7XG5jb25zdCBIYW5nb3V0Q29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUhhbmdvdXRDb250ZXh0KCkge1xuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChIYW5nb3V0Q29udGV4dCk7XG4gIGlmICghY29udGV4dCkge1xuICAgIHRocm93IG5ldyBFcnJvcigndXNlSGFuZ291dENvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggSGFuZ291dHNQcm92aWRlcicpO1xuICB9XG5cbiAgcmV0dXJuIGNvbnRleHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBIYW5nb3V0c1Byb3ZpZGVyKHByb3BzKSB7XG4gIGNvbnN0IGF1dGhDb250ZXh0ID0gdXNlQXV0aENvbnRleHQoKTtcbiAgY29uc3QgeyB1c2VybmFtZSB9ID0gYXV0aENvbnRleHQuc3RhdGU7XG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlUmVkdWNlcihyZWR1Y2VyLCBpbml0U3RhdGUpO1xuICBjb25zdCB7IGhhbmdvdXQsIGhhbmdvdXRzLCBzZWFyY2gsdXNlcnMgfSA9IHN0YXRlO1xuICBjb25zdCBzb2NrZXRoYW5kbGVyID0gdXNlU29ja2V0KHsgZGlzcGF0Y2gsIGhhbmdvdXQgfSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAodXNlcm5hbWUpIHtcbiAgICAgIGxvYWRIYW5nb3V0cyh7IHVzZXJuYW1lLCBkaXNwYXRjaCB9KTtcbiAgICB9XG4gIH0sIFt1c2VybmFtZV0pO1xuXG5cblxuICBjb25zdCB2YWx1ZSA9IHVzZU1lbW8oKCkgPT4gW3N0YXRlLCBkaXNwYXRjaF0sIFtzdGF0ZV0pO1xuICByZXR1cm4gPEhhbmdvdXRDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt2YWx1ZX0gey4uLnByb3BzfSAvPjtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XG5pbXBvcnQgeyB1c2VIYW5nb3V0Q29udGV4dCB9IGZyb20gJy4vSGFuZ291dHNQcm92aWRlcic7XG5pbXBvcnQgeyB1c2VBdXRoQ29udGV4dCB9IGZyb20gJy4uLy4uL2F1dGgvYXV0aC1jb250ZXh0JztcbmltcG9ydCB7XG4gIHNlbGVjdEhhbmdvdXQsXG4gIHNlYXJjaEhhbmdvdXRzLFxuICBmaWx0ZXJIYW5nb3V0cyxcbiAgZmV0Y2hIYW5nb3V0LFxuICBzZWxlY3RVc2VyLFxuICBjaGFuZ2VNZXNzYWdlVGV4dCxcbn0gZnJvbSAnLi9hY3Rpb25zJztcbmltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi9hY3Rpb25UeXBlcyc7XG5pbXBvcnQgeyBtZXNzYWdlVG9TZXJ2ZXIsIG1lc3NhZ2VDYXRlZ29yaWVzIH0gZnJvbSAnLi9tZXNzYWdlVHlwZXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gdXNlSGFuZ291dHMoKSB7XG4gIGNvbnN0IGF1dGhDb250ZXh0ID0gdXNlQXV0aENvbnRleHQoKTtcbiAgY29uc3QgeyB1c2VybmFtZSB9ID0gYXV0aENvbnRleHQuc3RhdGU7XG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlSGFuZ291dENvbnRleHQoKTtcblxuICBjb25zdCB7IGhhbmdvdXQsIGhhbmdvdXRzLCBzb2NrZXQsIHNlYXJjaCwgdXNlcnMsIG1lc3NhZ2VUZXh0IH0gPSBzdGF0ZTtcblxuICBmdW5jdGlvbiBvblNlbGVjdEhhbmdvdXQoZSkge1xuICAgIGNvbnN0IHVzZXJuYW1lID0gZS50YXJnZXQuaWQ7XG4gICAgZGVidWdnZXI7XG4gICAgc2VsZWN0SGFuZ291dCh7IGRpc3BhdGNoLCB1c2VybmFtZSB9KTtcbiAgfVxuICBmdW5jdGlvbiBvblNlbGVjdFVzZXIoZSkge1xuICAgIGNvbnN0IHVuYW1lID0gZS50YXJnZXQuaWQ7XG4gICAgY29uc3QgdXNlciA9IHVzZXJzLmZpbmQoKHUpID0+IHUudXNlcm5hbWUgPT09IHVuYW1lKTtcbiAgICBzZWxlY3RVc2VyKHsgZGlzcGF0Y2gsIHVzZXIsIHVzZXJuYW1lIH0pO1xuICB9XG4gIGZ1bmN0aW9uIG9uSW52aXRlKCkge1xuICAgIGNvbnN0IHVwZGF0ZWRIYW5nb3V0ID0ge1xuICAgICAgLi4uaGFuZ291dCxcbiAgICAgIG1lc3NhZ2U6IHsgdGV4dDogbWVzc2FnZVRleHQsIHRpbWVzdGFtcDogIERhdGUubm93KCkgfSxcbiAgICB9O1xuICAgIGRlYnVnZ2VyO1xuICAgIHNvY2tldC5zZW5kKFxuICAgICAgSlNPTi5zdHJpbmdpZnkoeyAuLi51cGRhdGVkSGFuZ291dCwgdHlwZTogbWVzc2FnZVRvU2VydmVyLk9GRkVSIH0pXG4gICAgKTtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLk9GRkVSX1NUQVJURUQgfSk7XG4gIH1cbiAgZnVuY3Rpb24gb25BY2NlcHQoKSB7XG4gICAgc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoeyAuLi5oYW5nb3V0LCB0eXBlOiBtZXNzYWdlVG9TZXJ2ZXIuQUNDRVBUIH0pKTtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkFDQ0VQVF9TVEFSVEVELCBoYW5nb3V0IH0pO1xuICB9XG4gIGZ1bmN0aW9uIG9uQmxvY2soKSB7XG4gICAgc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoeyAuLi5oYW5nb3V0LCB0eXBlOiBtZXNzYWdlVG9TZXJ2ZXIuQmxPQ0sgfSkpO1xuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQkxPQ0tfU1RBUlRFRCwgaGFuZ291dCB9KTtcbiAgfVxuICBmdW5jdGlvbiBvblVuYmxvY2soKSB7XG4gICAgc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoeyAuLi5oYW5nb3V0LCB0eXBlOiBtZXNzYWdlVG9TZXJ2ZXIuVU5CTE9DSyB9KSk7XG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5VTkJMT0NLX1NUQVJURUQsIGhhbmdvdXQgfSk7XG4gIH1cbiAgZnVuY3Rpb24gb25EZWNsaW5lKCkge1xuICAgIHNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHsgLi4uaGFuZ291dCwgdHlwZTogbWVzc2FnZVRvU2VydmVyLkRFQ0xJTkUgfSkpO1xuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuREVDTElORV9TVEFSVEVELCBoYW5nb3V0IH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gb25NZXNzYWdlKCkge1xuICAgIHNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHsgLi4uaGFuZ291dCwgdHlwZTogbWVzc2FnZVRvU2VydmVyLk1FU1NBR0UgfSkpO1xuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTUVTU0FHRV9TVEFSVEVELCBoYW5nb3V0IH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gb25TZWFyY2goZSkge1xuICAgIHNlYXJjaEhhbmdvdXRzKHsgc2VhcmNoOiBlLnRhcmdldC52YWx1ZSwgZGlzcGF0Y2ggfSk7XG4gIH1cblxuICBmdW5jdGlvbiBvblN0YXJ0U2VhcmNoKGUpIHtcbiAgICBpZiAoaGFuZ291dHMgJiYgaGFuZ291dHMubGVuZ3RoID4gMCkge1xuICAgICAgZmlsdGVySGFuZ291dHMoeyBkaXNwYXRjaCB9KTtcbiAgICB9XG4gICAgZmV0Y2hIYW5nb3V0KHsgZGlzcGF0Y2gsIHNlYXJjaCB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uTWVzc2FnZVRleHQoZSkge1xuICAgIGNoYW5nZU1lc3NhZ2VUZXh0KHsgZGlzcGF0Y2gsIHRleHQ6IGUudGFyZ2V0LnZhbHVlIH0pO1xuICB9XG4gIHJldHVybiB7XG4gICAgb25NZXNzYWdlVGV4dCxcbiAgICBtZXNzYWdlVGV4dCxcbiAgICBvblN0YXJ0U2VhcmNoLFxuICAgIG9uU2VhcmNoLFxuICAgIHNlYXJjaCxcbiAgICBvbk1lc3NhZ2UsXG4gICAgb25JbnZpdGUsXG4gICAgb25BY2NlcHQsXG4gICAgb25CbG9jayxcbiAgICBvblVuYmxvY2ssXG4gICAgb25TZWxlY3RIYW5nb3V0LFxuICAgIG9uU2VsZWN0VXNlcixcbiAgICBvbkRlY2xpbmUsXG4gICAgaGFuZ291dCxcbiAgICBoYW5nb3V0cyxcbiAgICB1c2VycyxcbiAgfTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlTG9jYWxIYW5nb3V0KHsgaGFuZ291dCwgdXNlcm5hbWUgfSkge1xuICBjb25zdCBsb2NhbEhhbmdvdXRzID0gSlNPTi5wYXJzZShcbiAgICBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShgJHt1c2VybmFtZX0taGFuZ291dHNgKVxuICApO1xuICBjb25zdCB1cGRhdGVkSGFuZ291dHMgPSBsb2NhbEhhbmdvdXRzLm1hcCgobGgpID0+IHtcbiAgICBpZiAobGgudXNlcm5hbWUgPT09IGhhbmdvdXQudXNlcm5hbWUpIHtcbiAgICAgIHJldHVybiBoYW5nb3V0O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbGg7XG4gICAgfVxuICB9KTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcbmltcG9ydCB7IGxhenksIFN1c3BlbnNlIH0gZnJvbSAncHJlYWN0L2NvbXBhdCc7XG5pbXBvcnQgeyBSb3V0ZSwgdXNlUm91dGVDb250ZXh0IH0gZnJvbSAnLi4vcm91dGUvcm91dGVyJztcbmltcG9ydCB7IHVzZUhhbmdvdXRzIH0gZnJvbSAnLi9zdGF0ZS91c2VIYW5nb3V0cyc7XG5jb25zdCBIYW5nb3V0cyA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL0hhbmdvdXQnKSk7XG5jb25zdCBCbG9jayA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL3N0YXRlLXVpL0Jsb2NrJykpO1xuY29uc3QgQmxvY2tlZCA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL3N0YXRlLXVpL0Jsb2NrZWQnKSk7XG5jb25zdCBDb25maWd1cmUgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9zdGF0ZS11aS9Db25maWd1cmUnKSk7XG5jb25zdCBIYW5nY2hhdCA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL3N0YXRlLXVpL0hhbmdjaGF0JykpO1xuY29uc3QgSW52aXRlID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vc3RhdGUtdWkvSW52aXRlJykpO1xuY29uc3QgSW52aXRlZSA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL3N0YXRlLXVpL0ludml0ZWUnKSk7XG5jb25zdCBJbnZpdGVyID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vc3RhdGUtdWkvSW52aXRlcicpKTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTW9iaWxlKCkge1xuICBjb25zdCBbcm91dGUsIHNldFJvdXRlXSA9IHVzZVJvdXRlQ29udGV4dCgpO1xuICBjb25zdCB7XG4gICAgaGFuZ291dCxcbiAgICBoYW5nb3V0cyxcbiAgICBvbkFjY2VwdCxcbiAgICBvbkJsb2NrLFxuICAgIG9uSW52aXRlLFxuICAgIG9uU2VsZWN0SGFuZ291dCxcbiAgICBvblNlbGVjdFVzZXIsXG4gICAgb25VbmJsb2NrLFxuICAgIG9uU2VhcmNoLFxuICAgIHVzZXJzLFxuICAgIHNlYXJjaCxcbiAgICBvblN0YXJ0U2VhcmNoLFxuICAgIG9uTWVzc2FnZVRleHQsXG4gICAgbWVzc2FnZVRleHRcbiAgfSA9IHVzZUhhbmdvdXRzKCk7XG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGhhbmdvdXQpIHtcbiAgICAgIFxuICAgICAgc2V0Um91dGUoYC8ke2hhbmdvdXQuc3RhdGV9YCk7XG4gICAgfVxuICB9LCBbaGFuZ291dF0pO1xuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3sgaGVpZ2h0OiAnODV2aCcgfX0+XG4gICAgICA8Um91dGUgcGF0aD1cIi9oYW5nb3V0c1wiPlxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+TG9hZGluZy4uLjwvZGl2Pn0+XG4gICAgICAgICAgPEhhbmdvdXRzXG4gICAgICAgICAgICB1c2Vycz17dXNlcnN9XG4gICAgICAgICAgICBzZWFyY2g9e3NlYXJjaH1cbiAgICAgICAgICAgIGhhbmdvdXRzPXtoYW5nb3V0c31cbiAgICAgICAgICAgIG9uU2VsZWN0SGFuZ291dD17b25TZWxlY3RIYW5nb3V0fVxuICAgICAgICAgICAgb25TZWxlY3RVc2VyPXtvblNlbGVjdFVzZXJ9XG4gICAgICAgICAgICBvblNlYXJjaD17b25TZWFyY2h9XG4gICAgICAgICAgICBvblN0YXJ0U2VhcmNoPXtvblN0YXJ0U2VhcmNofVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvU3VzcGVuc2U+XG4gICAgICA8L1JvdXRlPlxuICAgICAgPFJvdXRlIHBhdGg9XCIvQkxPQ0tcIj5cbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxuICAgICAgICAgIDxCbG9jayBoYW5nb3V0PXtoYW5nb3V0fSBvbkJsb2NrPXtvbkJsb2NrfSAvPlxuICAgICAgICA8L1N1c3BlbnNlPlxuICAgICAgPC9Sb3V0ZT5cbiAgICAgIDxSb3V0ZSBwYXRoPVwiL0JMT0NLRURcIj5cbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxuICAgICAgICAgIDxCbG9ja2VkIGhhbmdvdXQ9e2hhbmdvdXR9IG9uVW5ibG9jaz17b25VbmJsb2NrfSAvPlxuICAgICAgICA8L1N1c3BlbnNlPlxuICAgICAgPC9Sb3V0ZT5cbiAgICAgIDxSb3V0ZSBwYXRoPVwiL2NvbmZpZ3VyZVwiPlxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+TG9hZGluZy4uLjwvZGl2Pn0+XG4gICAgICAgICAgPENvbmZpZ3VyZSBoYW5nb3V0PXtoYW5nb3V0fSAvPlxuICAgICAgICA8L1N1c3BlbnNlPlxuICAgICAgPC9Sb3V0ZT5cbiAgICAgIDxSb3V0ZSBwYXRoPVwiL0hBTkdDSEFUXCI+XG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cbiAgICAgICAgICA8SGFuZ2NoYXQgLz5cbiAgICAgICAgPC9TdXNwZW5zZT5cbiAgICAgIDwvUm91dGU+XG4gICAgICA8Um91dGUgcGF0aD1cIi9JTlZJVEVcIj5cbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxuICAgICAgICAgIDxJbnZpdGUgaGFuZ291dD17aGFuZ291dH0gb25JbnZpdGU9e29uSW52aXRlfSBvbk1lc3NhZ2VUZXh0PXtvbk1lc3NhZ2VUZXh0fSBtZXNzYWdlVGV4dD17bWVzc2FnZVRleHR9Lz5cbiAgICAgICAgPC9TdXNwZW5zZT5cbiAgICAgIDwvUm91dGU+XG4gICAgICA8Um91dGUgcGF0aD1cIi9JTlZJVEVFXCI+XG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cbiAgICAgICAgICA8SW52aXRlZSBoYW5nb3V0PXtoYW5nb3V0fSAvPlxuICAgICAgICA8L1N1c3BlbnNlPlxuICAgICAgPC9Sb3V0ZT5cbiAgICAgIDxSb3V0ZSBwYXRoPVwiL0lOVklURVJcIj5cbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxuICAgICAgICAgIDxJbnZpdGVyIGhhbmdvdXQ9e2hhbmdvdXR9IG9uQWNjZXB0PXtvbkFjY2VwdH0gLz5cbiAgICAgICAgPC9TdXNwZW5zZT5cbiAgICAgIDwvUm91dGU+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IE1vYmlsZSBmcm9tICcuL21vYmlsZSc7XHJcbmltcG9ydCB7IEhhbmdvdXRzUHJvdmlkZXIgfSBmcm9tICcuL3N0YXRlL0hhbmdvdXRzUHJvdmlkZXInO1xyXG5pbXBvcnQgeyBSb3V0ZVByb3ZpZGVyLCB1c2VSb3V0ZUNvbnRleHQgfSBmcm9tICcuLi9yb3V0ZS9yb3V0ZXInO1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxIYW5nb3V0c1Byb3ZpZGVyPlxyXG4gICAgICA8Um91dGVQcm92aWRlciBpbml0aWFsUm91dGU9XCIvaGFuZ291dHNcIj5cclxuICAgICAgICA8TW9iaWxlIC8+XHJcbiAgICAgIDwvUm91dGVQcm92aWRlcj5cclxuICAgIDwvSGFuZ291dHNQcm92aWRlcj5cclxuICApO1xyXG59XHJcbiJdLCJuYW1lcyI6WyJhY3Rpb25UeXBlcyIsIk1FU1NBR0VfVEVYVF9DSEFOR0VEIiwiTE9BRF9IQU5HT1VUUyIsIkxPQURfTUVTU0FHRVMiLCJTRUFSQ0hFRF9IQU5HT1VUIiwiU0VMRUNURURfSEFOR09VVCIsIlNFTEVDVEVEX1VTRVIiLCJGSUxURVJfSEFOR09VVFMiLCJGRVRDSF9IQU5HT1VUX1NUQVJURUQiLCJGRVRDSF9IQU5HT1VUX1NVQ0NFU1MiLCJGRVRDSF9IQU5HT1VUX0ZBSUxFRCIsIkZFVENIX0hBTkdPVVRfTk9UX0ZPVU5EIiwiRkVUQ0hfVVNFUl9TVEFSVEVEIiwiRkVUQ0hfVVNFUl9TVUNDRVNTIiwiRkVUQ0hfVVNFUl9GQUlMRUQiLCJPTkxJTkVfU1RBVEVfQ0hBTkdFRCIsIk9GRkVSX1NUQVJURUQiLCJPRkZFUl9TVUNDRVNTIiwiT0ZGRVJfRkFJTEVEIiwiQUNDRVBUX1NUQVJURUQiLCJBQ0NFUFRfU1VDQ0VTUyIsIkFDQ0VQVF9GQUlMRUQiLCJCTE9DS19TVEFSVEVEIiwiQkxPQ0tfU1VDQ0VTUyIsIkJMT0NLX0ZBSUxFRCIsIlVOQkxPQ0tfU1RBUlRFRCIsIlVOQkxPQ0tfU1VDQ0VTUyIsIlVOQkxPQ0tfRkFJTEVEIiwiTUVTU0FHRV9TVEFSVEVEIiwiTUVTU0FHRV9TVUNDRVNTIiwiTUVTU0FHRV9GQUlMRUQiLCJERUNMSU5FX1NUQVJURUQiLCJERUNMSU5FX1NVQ0NFU1MiLCJERUNMSU5FX0ZBSUxFRCIsIkhBTkdPVVRfQ0hBTkdFRF9JVFNfU1RBVEUiLCJPRkZFUkVSX1JFQ0lFVkVEIiwiQUNLTk9XTEVER0VNRU5UX1JFQ0lFVkVEIiwiaW5pdFN0YXRlIiwiaGFuZ291dHMiLCJoYW5nb3V0IiwibWVzc2FnZXMiLCJzZWFyY2giLCJ1c2VyIiwibG9hZGluZyIsImVycm9yIiwibWVzc2FnZVRleHQiLCJvbmxpbmUiLCJyZWR1Y2VyIiwic3RhdGUiLCJhY3Rpb24iLCJ0eXBlIiwidGV4dCIsInVzZXJzIiwiSEFOR09VVF9OT1RfRk9VTkQiLCJmaWx0ZXIiLCJnIiwidXNlcm5hbWUiLCJpbmNsdWRlcyIsImZpbmQiLCJtYXAiLCJtZXNzYWdlc0Zyb21TZXJ2ZXIiLCJCTE9DS0VSIiwiQUNDRVBURVIiLCJVTkJMT0NLRVIiLCJPRkZFUkVSIiwiREVDTElORVIiLCJNRVNTQU5HRVIiLCJtZXNzYWdlVG9TZXJ2ZXIiLCJBQ0NFUFQiLCJERUNMSU5FIiwiT0ZGRVIiLCJCbE9DSyIsIlVOQkxPQ0siLCJNRVNTQUdFIiwibWVzc2FnZUNhdGVnb3JpZXMiLCJBQ0tOT1dMRURHRU1FTlQiLCJQRUVSIiwibG9hZEhhbmdvdXRzIiwiZGlzcGF0Y2giLCJKU09OIiwicGFyc2UiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwic2VsZWN0SGFuZ291dCIsInNlbGVjdFVzZXIiLCJzZXRJdGVtIiwic3RyaW5naWZ5Iiwic2VhcmNoSGFuZ291dHMiLCJmaWx0ZXJIYW5nb3V0cyIsImZldGNoSGFuZ291dCIsInJlc3BvbnNlIiwiZmV0Y2giLCJvayIsImpzb24iLCJsZW5ndGgiLCJmZXRjaFVzZXIiLCJjaGFuZ2VNZXNzYWdlVGV4dCIsIm1lc3NhZ2VUb0hhbmdvdXQiLCJtZXNzYWdlIiwibWVzc2FnZVRvTmV3SGFuZ291dCIsIm1zZyIsImVtYWlsIiwidXNlU29ja2V0Iiwic29ja2V0Q29udGV4dCIsInVzZVdTb2NrZXRDb250ZXh0Iiwic29ja2V0IiwidXNlRWZmZWN0Iiwib25tZXNzYWdlIiwiZGF0YSIsImNhdGVnb3J5IiwiaGFuZGxlQWNraG93bGVkZ2VtZW50cyIsImhhbmRsZVBlZXJNZXNzYWdlcyIsIkVycm9yIiwib25jbG9zZSIsIm9uZXJyb3IiLCJvbm9wZW4iLCJ1cGRhdGVkSGFuZ291dCIsInVwZGF0ZUhhbmdvdXRTdGF0ZUluTG9jYWxTdG9yYWdlIiwibmV3SGFuZ291dCIsImFkZE5ld0hhbmdvdXRUb0xvY2FsU3RvcmFnZSIsImtleSIsInVwZGF0ZWQiLCJpbnNlcnRlZCIsInB1c2giLCJIYW5nb3V0Q29udGV4dCIsImNyZWF0ZUNvbnRleHQiLCJ1c2VIYW5nb3V0Q29udGV4dCIsImNvbnRleHQiLCJ1c2VDb250ZXh0IiwiSGFuZ291dHNQcm92aWRlciIsInByb3BzIiwiYXV0aENvbnRleHQiLCJ1c2VBdXRoQ29udGV4dCIsInVzZVJlZHVjZXIiLCJzb2NrZXRoYW5kbGVyIiwidmFsdWUiLCJ1c2VNZW1vIiwiaCIsInVzZUhhbmdvdXRzIiwib25TZWxlY3RIYW5nb3V0IiwiZSIsInRhcmdldCIsImlkIiwib25TZWxlY3RVc2VyIiwidW5hbWUiLCJ1Iiwib25JbnZpdGUiLCJ0aW1lc3RhbXAiLCJEYXRlIiwibm93Iiwic2VuZCIsIm9uQWNjZXB0Iiwib25CbG9jayIsIm9uVW5ibG9jayIsIm9uRGVjbGluZSIsIm9uTWVzc2FnZSIsIm9uU2VhcmNoIiwib25TdGFydFNlYXJjaCIsIm9uTWVzc2FnZVRleHQiLCJIYW5nb3V0cyIsImxhenkiLCJCbG9jayIsIkJsb2NrZWQiLCJDb25maWd1cmUiLCJIYW5nY2hhdCIsIkludml0ZSIsIkludml0ZWUiLCJJbnZpdGVyIiwiTW9iaWxlIiwicm91dGUiLCJzZXRSb3V0ZSIsInVzZVJvdXRlQ29udGV4dCIsImhlaWdodCIsIlN1c3BlbnNlIl0sIm1hcHBpbmdzIjoiOztBQUFPLE1BQU1BLFdBQVcsR0FBRztBQUN2QkMsRUFBQUEsb0JBQW9CLEVBQUMsc0JBREU7QUFFdkJDLEVBQUFBLGFBQWEsRUFBRSxlQUZRO0FBR3ZCQyxFQUFBQSxhQUFhLEVBQUUsZUFIUTtBQUl2QkMsRUFBQUEsZ0JBQWdCLEVBQUUsa0JBSks7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
