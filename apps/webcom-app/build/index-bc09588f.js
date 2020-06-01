import { p, M, u as useAuthContext, m, s, h, _ as _extends, T, a as useRouteContext, R as Route, U, L, b as RouteProvider } from './index-2a3e62bf.js';

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
      debugger;
      return { ...state,
        loading: false,
        users: action.users.map(u => ({ ...u,
          state: 'INVITE'
        }))
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
} //select hangout from List

function selectHangout({
  dispatch,
  username
}) {
  dispatch({
    type: actionTypes.SELECTED_HANGOUT,
    username
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
  debugger;

  try {
    dispatch({
      type: actionTypes.FETCH_USER_STARTED
    });
    const response = await fetch(`/users/find?search=${search}`);
    const {
      users
    } = await response.json();
    debugger;
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
  p(() => {
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
  const {
    socketUrl
  } = props;
  const [state, dispatch] = m(reducer, initState);
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
  p(() => {
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
  p(() => {
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
  p(() => {
    if (users) {
      debugger;
    }
  }, [users]);
  const value = s(() => [state, dispatch], [state]);
  return h(HangoutContext.Provider, _extends({
    value: value
  }, props));
}

function useHangouts() {
  const [state, dispatch] = useHangoutContext();
  const {
    hangout,
    hangouts,
    socket,
    search,
    users
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
    hangouts,
    users
  };
}

const Hangouts = L(() => import('./Hangout-9bb7b42f.js'));
const Block = L(() => import('./Block-9a4fae87.js'));
const Blocked = L(() => import('./Blocked-dd96ba43.js'));
const Configure = L(() => import('./Configure-65a76e71.js'));
const Hangchat = L(() => import('./Hangchat-628b6518.js'));
const Invite = L(() => import('./Invite-18ecdcc3.js'));
const Invitee = L(() => import('./Invitee-9d84324e.js'));
const Inviter = L(() => import('./Inviter-75e330bc.js'));
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
    users,
    search
  } = useHangouts();
  p(() => {
    if (hangout) {
      debugger;
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
    onSelect: onSelect,
    onSearch: onSearch
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
    onInvite: onInvite
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
  return h(HangoutsProvider, {
    socketUrl: "ws://localhost:3000/hangouts"
  }, h(RouteProvider, {
    initialRoute: "/hangouts"
  }, h(Mobile, null)));
}

export default index;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtYmMwOTU4OGYuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25UeXBlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9yZWR1Y2VyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL21lc3NhZ2VUeXBlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25zLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL21lc3NhZ2VDb252ZXJ0ZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvdXNlU29ja2V0LmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL0hhbmdvdXRzUHJvdmlkZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvdXNlSGFuZ291dHMuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvbW9iaWxlLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBhY3Rpb25UeXBlcyA9IHtcclxuICAgIFxyXG4gICAgU0VUX1NPQ0tFVDogJ1NFVF9TT0NLRVQnLFxyXG4gICAgTE9BRF9IQU5HT1VUUzogJ0xPQURfSEFOR09VVFMnLFxyXG4gICAgTE9BRF9NRVNTQUdFUzogJ0xPQURfTUVTU0FHRVMnLFxyXG4gICAgU0VBUkNIRURfSEFOR09VVDogJ1NFQVJDSEVEX0hBTkdPVVQnLFxyXG4gICAgU0VMRUNURURfSEFOR09VVDogJ1NFTEVDVEVEX0hBTkdPVVQnLFxyXG4gICAgXHJcbiAgICBGSUxURVJfSEFOR09VVFM6J0ZJTFRFUl9IQU5HT1VUUycsXHJcblxyXG4gICAgRkVUQ0hfSEFOR09VVF9TVEFSVEVEOiAnRkVUQ0hfSEFOR09VVF9TVEFSVEVEJyxcclxuICAgIEZFVENIX0hBTkdPVVRfU1VDQ0VTUzogJ0ZFVENIX0hBTkdPVVRfU1VDQ0VTUycsXHJcbiAgICBGRVRDSF9IQU5HT1VUX0ZBSUxFRDogJ0ZFVENIX0hBTkdPVVRfRkFJTEVEJyxcclxuICAgIEZFVENIX0hBTkdPVVRfTk9UX0ZPVU5EOiAnRkVUQ0hfSEFOR09VVF9OT1RfRk9VTkQnLFxyXG5cclxuXHJcbiAgICBGRVRDSF9VU0VSX1NUQVJURUQ6ICdGRVRDSF9VU0VSX1NUQVJURUQnLFxyXG4gICAgRkVUQ0hfVVNFUl9TVUNDRVNTOiAnRkVUQ0hfVVNFUl9TVUNDRVNTJyxcclxuICAgIEZFVENIX1VTRVJfRkFJTEVEOiAnRkVUQ0hfVVNFUl9GQUlMRUQnLFxyXG5cclxuXHJcbiAgICBPTkxJTkVfU1RBVEVfQ0hBTkdFRDogJ09OTElORV9TVEFURV9DSEFOR0VEJyxcclxuXHJcblxyXG4gICAgT0ZGRVJfU1RBUlRFRDogJ09GRkVSX1NUQVJURUQnLFxyXG4gICAgT0ZGRVJfU1VDQ0VTUzogJ09GRkVSX1NVQ0NFU1MnLFxyXG4gICAgT0ZGRVJfRkFJTEVEOiAnT0ZGRVJfRkFJTEVEJyxcclxuXHJcbiAgICBBQ0NFUFRfU1RBUlRFRDogJ0FDQ0VQVF9TVEFSVEVEJyxcclxuICAgIEFDQ0VQVF9TVUNDRVNTOiAnQUNDRVBUX1NVQ0NFU1MnLFxyXG4gICAgQUNDRVBUX0ZBSUxFRDogJ0FDQ0VQVF9GQUlMRUQnLFxyXG5cclxuICAgIEJMT0NLX1NUQVJURUQ6ICdCTE9DS19TVEFSVEVEJyxcclxuICAgIEJMT0NLX1NVQ0NFU1M6ICdCTE9DS19TVUNDRVNTJyxcclxuICAgIEJMT0NLX0ZBSUxFRDogJ0JMT0NLX0ZBSUxFRCcsXHJcblxyXG4gICAgVU5CTE9DS19TVEFSVEVEOiAnVU5CTE9DS19TVEFSVEVEJyxcclxuICAgIFVOQkxPQ0tfU1VDQ0VTUzogJ1VOQkxPQ0tfU1VDQ0VTUycsXHJcbiAgICBVTkJMT0NLX0ZBSUxFRDogJ1VOQkxPQ0tfRkFJTEVEJyxcclxuXHJcbiAgICBNRVNTQUdFX1NUQVJURUQ6ICdNRVNTQUdFX1NUQVJURUQnLFxyXG4gICAgTUVTU0FHRV9TVUNDRVNTOiAnTUVTU0FHRV9TVUNDRVNTJyxcclxuICAgIE1FU1NBR0VfRkFJTEVEOiAnTUVTU0FHRV9GQUlMRUQnLFxyXG5cclxuICAgIERFQ0xJTkVfU1RBUlRFRDonREVDTElORV9TVEFSVEVEJyxcclxuICAgIERFQ0xJTkVfU1VDQ0VTUzonREVDTElORV9TVUNDRVNTJyxcclxuICAgIERFQ0xJTkVfRkFJTEVEOidERUNMSU5FX0ZBSUxFRCcsXHJcblxyXG4gICAgSEFOR09VVF9DSEFOR0VEX0lUU19TVEFURTogJ0hBTkdPVVRfQ0hBTkdFRF9JVFNfU1RBVEUnLFxyXG4gICAgT0ZGRVJFUl9SRUNJRVZFRDogJ09GRkVSRVJfUkVDSUVWRUQnLFxyXG4gICAgQUNLTk9XTEVER0VNRU5UX1JFQ0lFVkVEOidBQ0tOT1dMRURHRU1FTlRfUkVDSUVWRUQnXHJcbn0iLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4vYWN0aW9uVHlwZXMnO1xyXG5leHBvcnQgY29uc3QgaW5pdFN0YXRlID0ge1xyXG4gIGhhbmdvdXRzOiBbXSxcclxuICBoYW5nb3V0OiBudWxsLFxyXG4gIHNvY2tldDogbnVsbCxcclxuICBtZXNzYWdlczogW10sXHJcbiAgc2VhcmNoOiAnJyxcclxuICB1c2VyOiBbXSxcclxuICBsb2FkaW5nOiBmYWxzZSxcclxuICBlcnJvcjogbnVsbCxcclxufTtcclxuZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZXIoc3RhdGUsIGFjdGlvbikge1xyXG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuRkVUQ0hfVVNFUl9GQUlMRUQ6XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfRkFJTEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGVycm9yOiBhY3Rpb24uZXJyb3IgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuRkVUQ0hfVVNFUl9TVEFSVEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogdHJ1ZSB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9VU0VSX1NVQ0NFU1M6XHJcbiAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIGxvYWRpbmc6IGZhbHNlLFxyXG4gICAgICAgIHVzZXJzOiBhY3Rpb24udXNlcnMubWFwKHU9PiAoey4uLnUsc3RhdGU6J0lOVklURSd9KSlcclxuICAgICAgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9TVEFSVEVEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogdHJ1ZSB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NVQ0NFU1M6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiBmYWxzZSwgaGFuZ291dHM6IGFjdGlvbi5oYW5nb3V0cyB9O1xyXG5cclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuSEFOR09VVF9OT1RfRk9VTkQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiBmYWxzZSB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GSUxURVJfSEFOR09VVFM6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgaGFuZ291dHM6IHN0YXRlLmhhbmdvdXRzLmZpbHRlcigoZykgPT4gZy51c2VybmFtZS5pbmNsdWRlcyhzdGF0ZS5zZWFyY2gpKSxcclxuICAgICAgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0VBUkNIRURfSEFOR09VVDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHNlYXJjaDogYWN0aW9uLnNlYXJjaCB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0FEX0hBTkdPVVRTOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgaGFuZ291dHM6IGFjdGlvbi5oYW5nb3V0cyB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TRVRfU09DS0VUOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgc29ja2V0OiBhY3Rpb24uc29ja2V0IH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNFTEVDVEVEX0hBTkdPVVQ6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgaGFuZ291dDogc3RhdGUuaGFuZ291dHMuZmluZCgoZykgPT4gZy51c2VybmFtZSA9PT0gYWN0aW9uLnVzZXJuYW1lKSxcclxuICAgICAgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuSEFOR09VVF9DSEFOR0VEX0lUU19TVEFURTpcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuQUNLTk9XTEVER0VNRU5UX1JFQ0lFVkVEOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIGhhbmdvdXRzOiBzdGF0ZS5oYW5nb3V0cy5tYXAoKGcpID0+IHtcclxuICAgICAgICAgIGlmIChnLnVzZXJuYW1lID09PSBhY3Rpb24uaGFuZ291dC51c2VybmFtZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLmhhbmdvdXQ7XHJcbiAgICAgICAgICB9IGVsc2UgcmV0dXJuIGc7XHJcbiAgICAgICAgfSksXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLk9GRkVSRVJfUkVDSUVWRUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBoYW5nb3V0czogWy4uLnN0YXRlLmhhbmdvdXRzLCBhY3Rpb24uaGFuZ291dF0gfTtcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHJldHVybiBzdGF0ZTtcclxuICB9XHJcbn1cclxuIiwiZXhwb3J0IGNvbnN0IGFja25vd2xlZGdtZW50VHlwZXMgPSB7XHJcbiAgICBPRkZFUkVEOiAnT0ZGRVJFRCcsXHJcbiAgICBBQ0NFUFRFRDogJ0FDQ0VQVEVEJyxcclxuICAgIEJMT0NLRUQ6ICdCTE9DS0VEJyxcclxuICAgIFVOQkxPQ0tFRDogJ1VOQkxPQ0tFRCcsXHJcbiAgICBERUNMSU5FRDogJ0RFQ0xJTkVEJyxcclxuICAgIE1FU1NBR0VEOiAnTUVTU0FHRUQnXHJcbn1cclxuXHJcblxyXG5leHBvcnQgY29uc3QgbWVzc2FnZXNGcm9tU2VydmVyID0ge1xyXG4gICAgQkxPQ0tFUjogJ0JMT0NLRVInLFxyXG4gICAgQUNDRVBURVI6ICdBQ0NFUFRFUicsXHJcbiAgICBVTkJMT0NLRVI6ICdVTkJMT0NLRVInLFxyXG4gICAgT0ZGRVJFUjogJ09GRkVSRVInLFxyXG4gICAgREVDTElORVI6ICdERUNMSU5FUicsXHJcbiAgICBNRVNTQU5HRVI6ICdNRVNTQU5HRVInXHJcblxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgbWVzc2FnZVRvU2VydmVyID0ge1xyXG4gICAgQUNDRVBUOiAnQUNDRVBUJyxcclxuICAgIERFQ0xJTkU6ICdERUNMSU5FJyxcclxuICAgIE9GRkVSOiAnT0ZGRVInLFxyXG4gICAgQmxPQ0s6ICdCbE9DSycsXHJcbiAgICBVTkJMT0NLOiAnVU5CTE9DSycsXHJcbiAgICBNRVNTQUdFOiAnTUVTU0FHRSdcclxuXHJcbn1cclxuLy8gc2VydmVyIHNpZGUgbWVzc2FnZVxyXG5leHBvcnQgY29uc3QgbWVzc2FnZUNhdGVnb3JpZXM9e1xyXG4gICAgQUNLTk9XTEVER0VNRU5UOidBQ0tOT1dMRURHRU1FTlQnLFxyXG4gICAgUEVFUjonUEVFUidcclxufSIsImltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi9hY3Rpb25UeXBlcyc7XHJcbmltcG9ydCB7IG1lc3NhZ2VzRnJvbVNlcnZlciB9IGZyb20gJy4vbWVzc2FnZVR5cGVzJztcclxuXHJcbi8vcmV0cmlldmVzIGhhbmdvdXRzIGZyb20gbG9jYWxTdG9yYWdlXHJcbmV4cG9ydCBmdW5jdGlvbiBsb2FkSGFuZ291dHMoeyB1c2VybmFtZSwgZGlzcGF0Y2ggfSkge1xyXG4gIGNvbnN0IGhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShgJHt1c2VybmFtZX0taGFuZ291dHNgKSk7XHJcblxyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTE9BRF9IQU5HT1VUUywgaGFuZ291dHMgfSk7XHJcbn1cclxuLy9zZWxlY3QgaGFuZ291dCBmcm9tIExpc3RcclxuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdEhhbmdvdXQoeyBkaXNwYXRjaCwgdXNlcm5hbWUgfSkge1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VMRUNURURfSEFOR09VVCwgdXNlcm5hbWUgfSk7XHJcbn1cclxuLy9zZWFyY2ggZm9yIGhhbmdvdXQgYnkgdHlwaW5nIGludG8gVGV4dElucHV0XHJcbmV4cG9ydCBmdW5jdGlvbiBzZWFyY2hIYW5nb3V0cyh7IHNlYXJjaCwgZGlzcGF0Y2ggfSkge1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VBUkNIRURfSEFOR09VVCwgc2VhcmNoIH0pO1xyXG59XHJcbi8vZmlsdGVyIGhhbmdvdXQgYWZ0ZXIgc2VhcmNoIHN0YXRlIGNoYW5nZVxyXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVySGFuZ291dHMoeyBkaXNwYXRjaCB9KSB7XHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GSUxURVJfSEFOR09VVFMgfSk7XHJcbn1cclxuXHJcbi8vZmV0Y2ggaGFuZ291dCBmcm9tIHNlcnZlciBpZiBub3QgZm91bmQgaW4gbG9jYWwgaGFuZ291dHNcclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoSGFuZ291dCh7IHNlYXJjaCwgZGlzcGF0Y2ggfSkge1xyXG4gIFxyXG4gIHRyeSB7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfU1RBUlRFRCB9KTtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYC9oYW5nb3V0cy9maW5kP3NlYXJjaD0ke3NlYXJjaH1gKTtcclxuXHJcbiAgIGlmKHJlc3BvbnNlLm9rKXtcclxuICAgIGNvbnN0IHsgaGFuZ291dHMgfSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICBpZiAoaGFuZ291dHMubGVuZ3RoID4gMCkge1xyXG5cclxuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NVQ0NFU1MsIGhhbmdvdXRzIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuIFxyXG4gICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfTk9UX0ZPVU5EIH0pO1xyXG4gICAgICAvLyBmZXRjaCB1c2VyIGZyb20gc2VydmVyIGluIGhhbmdvdXQgaXMgbmV3dXNlclxyXG4gICAgICBmZXRjaFVzZXIoeyBzZWFyY2gsIGRpc3BhdGNoIH0pO1xyXG4gICAgfVxyXG5cclxuICAgfVxyXG5cclxuICB9IGNhdGNoIChlcnJvcikge1xyXG5cclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9GQUlMRUQsIGVycm9yIH0pO1xyXG4gIH1cclxufVxyXG4gIC8vIGZldGNoIHVzZXIgZnJvbSBzZXJ2ZXIgaW4gaGFuZ291dCBpcyBuZXd1c2VyXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaFVzZXIoeyBzZWFyY2gsIGRpc3BhdGNoIH0pIHtcclxuICBkZWJ1Z2dlclxyXG4gIHRyeSB7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX1VTRVJfU1RBUlRFRCB9KTtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYC91c2Vycy9maW5kP3NlYXJjaD0ke3NlYXJjaH1gKTtcclxuICAgIGNvbnN0IHsgdXNlcnMgfSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgIGRlYnVnZ2VyO1xyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9VU0VSX1NVQ0NFU1MsIHVzZXJzIH0pO1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX1VTRVJfRkFJTEVELCBlcnJvciB9KTtcclxuICB9XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaW5pdFdTb2NrZXQoeyB1cmwsIGRpc3BhdGNoIH0pIHtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFVF9TT0NLRVQsIHNvY2tldDogbmV3IFdlYlNvY2tldCh1cmwpIH0pO1xyXG59XHJcblxyXG4iLCJleHBvcnQgZnVuY3Rpb24gaGFuZ291dFRvTWVzc2FnZSh7IGhhbmdvdXQsIHR5cGUgfSkge1xyXG4gXHJcbiAgICByZXR1cm57IHVzZXJuYW1lOiBoYW5nb3V0LnVzZXJuYW1lLCB0eXBlLCBtZXNzYWdlOiBoYW5nb3V0Lm1lc3NhZ2UgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWVzc2FnZVRvSGFuZ291dCh7IG1lc3NhZ2UsIGhhbmdvdXQgfSkge1xyXG4gIFxyXG4gICAgcmV0dXJuIHsgLi4uaGFuZ291dCwgc3RhdGU6IG1lc3NhZ2UudHlwZSwgbWVzc2FnZTogbWVzc2FnZSB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBtZXNzYWdlVG9OZXdIYW5nb3V0KG1zZykge1xyXG4gICAgY29uc3QgeyB1c2VybmFtZSwgZW1haWwsIHR5cGUsIG1lc3NhZ2UgfSA9IG1zZ1xyXG4gICAgY29uc3QgaGFuZ291dCA9IHsgdXNlcm5hbWUsIHN0YXRlOiB0eXBlLCBlbWFpbCwgbWVzc2FnZSB9XHJcbiAgICByZXR1cm4gaGFuZ291dFxyXG59IiwiaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJ1xyXG5pbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4vYWN0aW9uVHlwZXMnXHJcbmltcG9ydCB7IG1lc3NhZ2VUb0hhbmdvdXQsIG1lc3NhZ2VUb05ld0hhbmdvdXQgfSBmcm9tICcuL21lc3NhZ2VDb252ZXJ0ZXInXHJcbmltcG9ydCB7IG1lc3NhZ2VzRnJvbVNlcnZlciwgbWVzc2FnZUNhdGVnb3JpZXMgfSBmcm9tICcuL21lc3NhZ2VUeXBlcydcclxuZXhwb3J0IGZ1bmN0aW9uIHVzZVNvY2tldCh7IHNvY2tldCwgZGlzcGF0Y2gsIGhhbmdvdXQgfSkge1xyXG5cclxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICAgICAgaWYgKHNvY2tldCkge1xyXG4gICAgICAgICAgICBzb2NrZXQub25tZXNzYWdlID0gKG1lc3NhZ2UpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG1zZyA9IEpTT04ucGFyc2UobWVzc2FnZS5kYXRhKVxyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChtc2cuY2F0ZWdvcnkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIG1lc3NhZ2VDYXRlZ29yaWVzLkFDS05PV0xFREdFTUVOVDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlQWNraG93bGVkZ2VtZW50cyh7IGRpc3BhdGNoLCBtc2csaGFuZ291dCB9KVxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgbWVzc2FnZUNhdGVnb3JpZXMuUEVFUjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlUGVlck1lc3NhZ2VzKHsgZGlzcGF0Y2gsIG1zZywgaGFuZ291dCB9KVxyXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTWVzc2FnZSBjYXRlb3J5IGlzIG5vdCBkZWZpbmVkJylcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzb2NrZXQub25jbG9zZSA9ICgpID0+IHtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzb2NrZXQub25lcnJvciA9IChlcnJvcikgPT4ge1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSwgW3NvY2tldF0pXHJcblxyXG4gICAgcmV0dXJuIG51bGxcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGhhbmRsZUFja2hvd2xlZGdlbWVudHMoeyBkaXNwYXRjaCwgbXNnLGhhbmdvdXQgfSkge1xyXG4gICAgbGV0IHVwZGF0ZWRIYW5nb3V0ID0gbWVzc2FnZVRvSGFuZ291dCh7IGhhbmdvdXQsIG1lc3NhZ2U6IG1zZyB9KVxyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5BQ0tOT1dMRURHRU1FTlRfUkVDSUVWRUQsIGhhbmdvdXQ6IHVwZGF0ZWRIYW5nb3V0IH0pXHJcbiAgICB1cGRhdGVIYW5nb3V0U3RhdGVJbkxvY2FsU3RvcmFnZShgJHt1c2VybmFtZX0taGFuZ291dHNgLCB1cGRhdGVkSGFuZ291dClcclxufVxyXG5cclxuZnVuY3Rpb24gaGFuZGxlUGVlck1lc3NhZ2VzKHsgZGlzcGF0Y2gsIG1zZywgaGFuZ291dCB9KSB7XHJcbiAgICBsZXQgdXBkYXRlZEhhbmdvdXQgPSBtZXNzYWdlVG9IYW5nb3V0KHsgaGFuZ291dCwgbWVzc2FnZTogbXNnIH0pXHJcbiAgICBsZXQgbmV3SGFuZ291dCA9bWVzc2FnZVRvTmV3SGFuZ291dChtc2cpXHJcbiAgICBzd2l0Y2ggKG1zZy50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBtZXNzYWdlc0Zyb21TZXJ2ZXIuQkxPQ0tFUjpcclxuICAgICAgICBjYXNlIG1lc3NhZ2VzRnJvbVNlcnZlci5ERUNMSU5FUjpcclxuICAgICAgICBjYXNlIG1lc3NhZ2VzRnJvbVNlcnZlci5NRVNTQU5HRVI6XHJcbiAgICAgICAgY2FzZSBtZXNzYWdlc0Zyb21TZXJ2ZXIuVU5CTE9DS0VSOlxyXG4gICAgICAgIGNhc2UgbWVzc2FnZXNGcm9tU2VydmVyLkFDQ0VQVEVSOlxyXG4gICAgICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkhBTkdPVVRfQ0hBTkdFRF9JVFNfU1RBVEUsIGhhbmdvdXQ6dXBkYXRlZEhhbmdvdXQgfSlcclxuICAgICAgICAgICAgdXBkYXRlSGFuZ291dFN0YXRlSW5Mb2NhbFN0b3JhZ2UoYCR7dXNlcm5hbWV9LWhhbmdvdXRzYCwgdXBkYXRlZEhhbmdvdXQpXHJcbiAgICAgICAgICAgIGNhc2UgbWVzc2FnZXNGcm9tU2VydmVyLk9GRkVSRVI6XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkhBTkdPVVRfQ0hBTkdFRF9JVFNfU1RBVEUsIGhhbmdvdXQ6bmV3SGFuZ291dCB9KVxyXG4gICAgICAgICAgICAgICAgYWRkTmV3SGFuZ291dFRvTG9jYWxTdG9yYWdlKGAke3VzZXJuYW1lfS1oYW5nb3V0c2AsIHVwZGF0ZWRIYW5nb3V0KVxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTWVzc2FnZSB0eXBlIGZvciBtZXNzYWdlc0Zyb21TZXJ2ZXIgaXMgbm90IGRlZmluZWQnKVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVIYW5nb3V0U3RhdGVJbkxvY2FsU3RvcmFnZShrZXksIGhhbmdvdXQpIHtcclxuICAgIGNvbnN0IGhhbmdvdXRzID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KTtcclxuICAgIGNvbnN0IHVwZGF0ZWQgPSBoYW5nb3V0cy5tYXAoKGcpID0+IHtcclxuICAgICAgICBpZiAoZy51c2VybmFtZSA9PT0gaGFuZ291dC51c2VybmFtZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gaGFuZ291dFxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGdcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeSh1cGRhdGVkKSlcclxufVxyXG5cclxuZnVuY3Rpb24gYWRkTmV3SGFuZ291dFRvTG9jYWxTdG9yYWdlKGtleSwgaGFuZ291dCkge1xyXG4gICAgY29uc3QgaGFuZ291dHMgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpO1xyXG4gICAgY29uc3QgaW5zZXJ0ZWQgPSBoYW5nb3V0cy5wdXNoKGhhbmdvdXQpXHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KGluc2VydGVkKSlcclxuXHJcbn0iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHtcclxuICB1c2VDb250ZXh0LFxyXG4gIHVzZVN0YXRlLFxyXG4gIHVzZU1lbW8sXHJcbiAgdXNlUmVkdWNlcixcclxuICB1c2VFZmZlY3QsXHJcbn0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgcmVkdWNlciwgaW5pdFN0YXRlIH0gZnJvbSAnLi9yZWR1Y2VyJztcclxuaW1wb3J0IHsgaW5pdFdTb2NrZXQsIGxvYWRIYW5nb3V0cywgZmlsdGVySGFuZ291dHMsZmV0Y2hIYW5nb3V0IH0gZnJvbSAnLi9hY3Rpb25zJztcclxuaW1wb3J0IHsgdXNlU29ja2V0IH0gZnJvbSAnLi91c2VTb2NrZXQnO1xyXG5pbXBvcnQgeyB1c2VBdXRoQ29udGV4dCB9IGZyb20gJy4uLy4uL2F1dGgvYXV0aC1jb250ZXh0JztcclxuY29uc3QgSGFuZ291dENvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXNlSGFuZ291dENvbnRleHQoKSB7XHJcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoSGFuZ291dENvbnRleHQpO1xyXG4gIGlmICghY29udGV4dCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VIYW5nb3V0Q29udGV4dCBtdXN0IGJlIHVzZWQgd2l0aCBIYW5nb3V0c1Byb3ZpZGVyJyk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gY29udGV4dDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEhhbmdvdXRzUHJvdmlkZXIocHJvcHMpIHtcclxuICBjb25zdCBhdXRoQ29udGV4dCA9IHVzZUF1dGhDb250ZXh0KCk7XHJcbiAgY29uc3QgeyB1c2VybmFtZSB9ID0gYXV0aENvbnRleHQuc3RhdGU7XHJcbiAgY29uc3QgeyBzb2NrZXRVcmwgfSA9IHByb3BzO1xyXG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlUmVkdWNlcihyZWR1Y2VyLCBpbml0U3RhdGUpO1xyXG4gIGNvbnN0IHsgc29ja2V0LCBoYW5nb3V0LCBoYW5nb3V0cywgc2VhcmNoLHVzZXJzIH0gPSBzdGF0ZTtcclxuICBjb25zdCBzb2NrZXRoYW5kbGVyID0gdXNlU29ja2V0KHsgZGlzcGF0Y2gsIHNvY2tldCwgaGFuZ291dCB9KTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmICh1c2VybmFtZSkge1xyXG4gICAgICBcclxuICAgICAgaW5pdFdTb2NrZXQoeyB1cmw6IHNvY2tldFVybCwgZGlzcGF0Y2ggfSk7XHJcbiAgICAgIGxvYWRIYW5nb3V0cyh7IHVzZXJuYW1lLCBkaXNwYXRjaCB9KTtcclxuICAgIH1cclxuICB9LCBbdXNlcm5hbWVdKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIFxyXG4gICAgaWYgKHNlYXJjaCAmJiBoYW5nb3V0cyAmJiBoYW5nb3V0cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgXHJcbiAgICAgIGZpbHRlckhhbmdvdXRzKHsgZGlzcGF0Y2ggfSk7XHJcbiAgICB9XHJcbiAgICBpZiAoc2VhcmNoICYmICghaGFuZ291dHMgfHwgKGhhbmdvdXRzICYmIGhhbmdvdXRzLmxlbmd0aD09PTApKSkge1xyXG4gICAgIFxyXG4gICAgICBmZXRjaEhhbmdvdXQoeyBkaXNwYXRjaCxzZWFyY2ggfSk7XHJcbiAgICB9XHJcbiAgfSwgW3N0YXRlLnNlYXJjaCwgc3RhdGUuaGFuZ291dHNdKTtcclxudXNlRWZmZWN0KCgpPT57XHJcbiAgaWYodXNlcnMpe1xyXG4gICAgZGVidWdnZXI7XHJcbiAgfVxyXG59LFt1c2Vyc10pXHJcbiAgY29uc3QgdmFsdWUgPSB1c2VNZW1vKCgpID0+IFtzdGF0ZSwgZGlzcGF0Y2hdLCBbc3RhdGVdKTtcclxuICByZXR1cm4gPEhhbmdvdXRDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt2YWx1ZX0gey4uLnByb3BzfSAvPjtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0J1xyXG5pbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncHJlYWN0L2hvb2tzJ1xyXG5pbXBvcnQgeyB1c2VIYW5nb3V0Q29udGV4dCB9IGZyb20gJy4vSGFuZ291dHNQcm92aWRlcidcclxuaW1wb3J0IHsgc2VsZWN0SGFuZ291dCxzZWFyY2hIYW5nb3V0cyB9IGZyb20gJy4vYWN0aW9ucydcclxuaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuL2FjdGlvblR5cGVzJ1xyXG5pbXBvcnQgeyBtZXNzYWdlVG9TZXJ2ZXIsIG1lc3NhZ2VDYXRlZ29yaWVzIH0gZnJvbSAnLi9tZXNzYWdlVHlwZXMnXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXNlSGFuZ291dHMoKSB7XHJcbiAgICBjb25zdCBbc3RhdGUsIGRpc3BhdGNoXSA9IHVzZUhhbmdvdXRDb250ZXh0KClcclxuICAgXHJcblxyXG4gICAgY29uc3QgeyBoYW5nb3V0LCBoYW5nb3V0cywgc29ja2V0LHNlYXJjaCx1c2VycyB9ID0gc3RhdGVcclxuXHJcbiAgICBmdW5jdGlvbiBvblNlbGVjdChlKSB7XHJcbiAgICAgICAgY29uc3QgdXNlcm5hbWU9ZS50YXJnZXQuaWRcclxuICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICBzZWxlY3RIYW5nb3V0KHsgZGlzcGF0Y2gsdXNlcm5hbWUgfSlcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIG9uSW52aXRlKCkge1xyXG4gICAgICAgIHNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHsgLi4uaGFuZ291dCwgdHlwZTogbWVzc2FnZVRvU2VydmVyLk9GRkVSIH0pKVxyXG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuT0ZGRVJfU1RBUlRFRCwgaGFuZ291dCB9KVxyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gb25BY2NlcHQoKSB7XHJcbiAgICAgICAgc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoeyAuLi5oYW5nb3V0LCB0eXBlOiBtZXNzYWdlVG9TZXJ2ZXIuQUNDRVBUIH0pKVxyXG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuQUNDRVBUX1NUQVJURUQsIGhhbmdvdXQgfSlcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIG9uQmxvY2soKSB7XHJcbiAgICAgICAgc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoeyAuLi5oYW5nb3V0LCB0eXBlOiBtZXNzYWdlVG9TZXJ2ZXIuQmxPQ0sgfSkpXHJcbiAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5CTE9DS19TVEFSVEVELCBoYW5nb3V0IH0pXHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBvblVuYmxvY2soKSB7XHJcbiAgICAgICAgc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoeyAuLi5oYW5nb3V0LCB0eXBlOiBtZXNzYWdlVG9TZXJ2ZXIuVU5CTE9DSyB9KSlcclxuICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlVOQkxPQ0tfU1RBUlRFRCwgaGFuZ291dCB9KVxyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gb25EZWNsaW5lKCkge1xyXG4gICAgICAgIHNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHsgLi4uaGFuZ291dCwgdHlwZTogbWVzc2FnZVRvU2VydmVyLkRFQ0xJTkUgfSkpXHJcbiAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5ERUNMSU5FX1NUQVJURUQsIGhhbmdvdXQgfSlcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBvbk1lc3NhZ2UoKSB7XHJcbiAgICAgICAgc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoeyAuLi5oYW5nb3V0LCB0eXBlOiBtZXNzYWdlVG9TZXJ2ZXIuTUVTU0FHRSB9KSlcclxuICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLk1FU1NBR0VfU1RBUlRFRCwgaGFuZ291dCB9KVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIG9uU2VhcmNoKGUpe1xyXG4gICAgICAgXHJcbiAgICAgICAgc2VhcmNoSGFuZ291dHMoe3NlYXJjaDplLnRhcmdldC52YWx1ZSxkaXNwYXRjaH0pXHJcbiAgICB9XHJcbiAgICByZXR1cm4ge29uU2VhcmNoLHNlYXJjaCwgb25NZXNzYWdlLCBvbkludml0ZSwgb25BY2NlcHQsIG9uQmxvY2ssIG9uVW5ibG9jaywgb25TZWxlY3QsIG9uRGVjbGluZSwgaGFuZ291dCwgaGFuZ291dHMsdXNlcnMgfVxyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgeyBsYXp5LCBTdXNwZW5zZSB9IGZyb20gJ3ByZWFjdC9jb21wYXQnO1xyXG5pbXBvcnQgeyBSb3V0ZSwgdXNlUm91dGVDb250ZXh0IH0gZnJvbSAnLi4vcm91dGUvcm91dGVyJztcclxuaW1wb3J0IHsgdXNlSGFuZ291dHMgfSBmcm9tICcuL3N0YXRlL3VzZUhhbmdvdXRzJztcclxuY29uc3QgSGFuZ291dHMgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9IYW5nb3V0JykpO1xyXG5jb25zdCBCbG9jayA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL3N0YXRlLXVpL0Jsb2NrJykpO1xyXG5jb25zdCBCbG9ja2VkID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vc3RhdGUtdWkvQmxvY2tlZCcpKTtcclxuY29uc3QgQ29uZmlndXJlID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vc3RhdGUtdWkvQ29uZmlndXJlJykpO1xyXG5jb25zdCBIYW5nY2hhdCA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL3N0YXRlLXVpL0hhbmdjaGF0JykpO1xyXG5jb25zdCBJbnZpdGUgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9zdGF0ZS11aS9JbnZpdGUnKSk7XHJcbmNvbnN0IEludml0ZWUgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9zdGF0ZS11aS9JbnZpdGVlJykpO1xyXG5jb25zdCBJbnZpdGVyID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vc3RhdGUtdWkvSW52aXRlcicpKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE1vYmlsZSgpIHtcclxuICBjb25zdCBbcm91dGUsIHNldFJvdXRlXSA9IHVzZVJvdXRlQ29udGV4dCgpO1xyXG4gIGNvbnN0IHtcclxuICAgIGhhbmdvdXQsXHJcbiAgICBoYW5nb3V0cyxcclxuICAgIG9uQWNjZXB0LFxyXG4gICAgb25CbG9jayxcclxuICAgIG9uSW52aXRlLFxyXG4gICAgb25TZWxlY3QsXHJcbiAgICBvblVuYmxvY2ssXHJcbiAgICBvblNlYXJjaCxcclxuICAgIHVzZXJzLFxyXG4gICAgc2VhcmNoXHJcbiAgfSA9IHVzZUhhbmdvdXRzKCk7XHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmIChoYW5nb3V0KSB7XHJcbiAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICBzZXRSb3V0ZShgLyR7aGFuZ291dC5zdGF0ZX1gKTtcclxuICAgIH1cclxuICB9LCBbaGFuZ291dF0pO1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodDogJzg1dmgnIH19PlxyXG4gICAgICA8Um91dGUgcGF0aD1cIi9oYW5nb3V0c1wiPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxIYW5nb3V0cyB1c2Vycz17dXNlcnN9IHNlYXJjaD17c2VhcmNofSBoYW5nb3V0cz17aGFuZ291dHN9IG9uU2VsZWN0PXtvblNlbGVjdH1vblNlYXJjaD17b25TZWFyY2h9IC8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9Sb3V0ZT5cclxuICAgICAgPFJvdXRlIHBhdGg9XCIvQkxPQ0tcIj5cclxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+TG9hZGluZy4uLjwvZGl2Pn0+XHJcbiAgICAgICAgICA8QmxvY2sgaGFuZ291dD17aGFuZ291dH0gb25CbG9jaz17b25CbG9ja30gLz5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICA8L1JvdXRlPlxyXG4gICAgICA8Um91dGUgcGF0aD1cIi9CTE9DS0VEXCI+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPEJsb2NrZWQgaGFuZ291dD17aGFuZ291dH0gb25VbmJsb2NrPXtvblVuYmxvY2t9IC8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9Sb3V0ZT5cclxuICAgICAgPFJvdXRlIHBhdGg9XCIvY29uZmlndXJlXCI+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPENvbmZpZ3VyZSBoYW5nb3V0PXtoYW5nb3V0fSAvPlxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgIDwvUm91dGU+XHJcbiAgICAgIDxSb3V0ZSBwYXRoPVwiL0hBTkdDSEFUXCI+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPEhhbmdjaGF0IC8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9Sb3V0ZT5cclxuICAgICAgPFJvdXRlIHBhdGg9XCIvSU5WSVRFXCI+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPEludml0ZSBoYW5nb3V0PXtoYW5nb3V0fSBvbkludml0ZT17b25JbnZpdGV9IC8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9Sb3V0ZT5cclxuICAgICAgPFJvdXRlIHBhdGg9XCIvSU5WSVRFRVwiPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxJbnZpdGVlIGhhbmdvdXQ9e2hhbmdvdXR9IC8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9Sb3V0ZT5cclxuICAgICAgPFJvdXRlIHBhdGg9XCIvSU5WSVRFUlwiPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxJbnZpdGVyIGhhbmdvdXQ9e2hhbmdvdXR9IG9uQWNjZXB0PXtvbkFjY2VwdH0gLz5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICA8L1JvdXRlPlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0J1xyXG5pbXBvcnQgTW9iaWxlIGZyb20gJy4vbW9iaWxlJ1xyXG5pbXBvcnQgeyBIYW5nb3V0c1Byb3ZpZGVyIH0gZnJvbSAnLi9zdGF0ZS9IYW5nb3V0c1Byb3ZpZGVyJ1xyXG5pbXBvcnQgeyBSb3V0ZVByb3ZpZGVyLCB1c2VSb3V0ZUNvbnRleHQgfSBmcm9tICcuLi9yb3V0ZS9yb3V0ZXInO1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gPEhhbmdvdXRzUHJvdmlkZXIgc29ja2V0VXJsPVwid3M6Ly9sb2NhbGhvc3Q6MzAwMC9oYW5nb3V0c1wiPlxyXG4gICAgICAgICA8Um91dGVQcm92aWRlciBpbml0aWFsUm91dGU9XCIvaGFuZ291dHNcIj5cclxuICAgICAgICAgPE1vYmlsZSAvPlxyXG5cclxuICAgICAgICAgPC9Sb3V0ZVByb3ZpZGVyPlxyXG4gICAgXHJcbiAgICA8L0hhbmdvdXRzUHJvdmlkZXI+XHJcblxyXG59Il0sIm5hbWVzIjpbImFjdGlvblR5cGVzIiwiU0VUX1NPQ0tFVCIsIkxPQURfSEFOR09VVFMiLCJMT0FEX01FU1NBR0VTIiwiU0VBUkNIRURfSEFOR09VVCIsIlNFTEVDVEVEX0hBTkdPVVQiLCJGSUxURVJfSEFOR09VVFMiLCJGRVRDSF9IQU5HT1VUX1NUQVJURUQiLCJGRVRDSF9IQU5HT1VUX1NVQ0NFU1MiLCJGRVRDSF9IQU5HT1VUX0ZBSUxFRCIsIkZFVENIX0hBTkdPVVRfTk9UX0ZPVU5EIiwiRkVUQ0hfVVNFUl9TVEFSVEVEIiwiRkVUQ0hfVVNFUl9TVUNDRVNTIiwiRkVUQ0hfVVNFUl9GQUlMRUQiLCJPTkxJTkVfU1RBVEVfQ0hBTkdFRCIsIk9GRkVSX1NUQVJURUQiLCJPRkZFUl9TVUNDRVNTIiwiT0ZGRVJfRkFJTEVEIiwiQUNDRVBUX1NUQVJURUQiLCJBQ0NFUFRfU1VDQ0VTUyIsIkFDQ0VQVF9GQUlMRUQiLCJCTE9DS19TVEFSVEVEIiwiQkxPQ0tfU1VDQ0VTUyIsIkJMT0NLX0ZBSUxFRCIsIlVOQkxPQ0tfU1RBUlRFRCIsIlVOQkxPQ0tfU1VDQ0VTUyIsIlVOQkxPQ0tfRkFJTEVEIiwiTUVTU0FHRV9TVEFSVEVEIiwiTUVTU0FHRV9TVUNDRVNTIiwiTUVTU0FHRV9GQUlMRUQiLCJERUNMSU5FX1NUQVJURUQiLCJERUNMSU5FX1NVQ0NFU1MiLCJERUNMSU5FX0ZBSUxFRCIsIkhBTkdPVVRfQ0hBTkdFRF9JVFNfU1RBVEUiLCJPRkZFUkVSX1JFQ0lFVkVEIiwiQUNLTk9XTEVER0VNRU5UX1JFQ0lFVkVEIiwiaW5pdFN0YXRlIiwiaGFuZ291dHMiLCJoYW5nb3V0Iiwic29ja2V0IiwibWVzc2FnZXMiLCJzZWFyY2giLCJ1c2VyIiwibG9hZGluZyIsImVycm9yIiwicmVkdWNlciIsInN0YXRlIiwiYWN0aW9uIiwidHlwZSIsInVzZXJzIiwibWFwIiwidSIsIkhBTkdPVVRfTk9UX0ZPVU5EIiwiZmlsdGVyIiwiZyIsInVzZXJuYW1lIiwiaW5jbHVkZXMiLCJmaW5kIiwibWVzc2FnZXNGcm9tU2VydmVyIiwiQkxPQ0tFUiIsIkFDQ0VQVEVSIiwiVU5CTE9DS0VSIiwiT0ZGRVJFUiIsIkRFQ0xJTkVSIiwiTUVTU0FOR0VSIiwibWVzc2FnZVRvU2VydmVyIiwiQUNDRVBUIiwiREVDTElORSIsIk9GRkVSIiwiQmxPQ0siLCJVTkJMT0NLIiwiTUVTU0FHRSIsIm1lc3NhZ2VDYXRlZ29yaWVzIiwiQUNLTk9XTEVER0VNRU5UIiwiUEVFUiIsImxvYWRIYW5nb3V0cyIsImRpc3BhdGNoIiwiSlNPTiIsInBhcnNlIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsInNlbGVjdEhhbmdvdXQiLCJzZWFyY2hIYW5nb3V0cyIsImZpbHRlckhhbmdvdXRzIiwiZmV0Y2hIYW5nb3V0IiwicmVzcG9uc2UiLCJmZXRjaCIsIm9rIiwianNvbiIsImxlbmd0aCIsImZldGNoVXNlciIsImluaXRXU29ja2V0IiwidXJsIiwiV2ViU29ja2V0IiwibWVzc2FnZVRvSGFuZ291dCIsIm1lc3NhZ2UiLCJtZXNzYWdlVG9OZXdIYW5nb3V0IiwibXNnIiwiZW1haWwiLCJ1c2VTb2NrZXQiLCJ1c2VFZmZlY3QiLCJvbm1lc3NhZ2UiLCJkYXRhIiwiY2F0ZWdvcnkiLCJoYW5kbGVBY2tob3dsZWRnZW1lbnRzIiwiaGFuZGxlUGVlck1lc3NhZ2VzIiwiRXJyb3IiLCJvbmNsb3NlIiwib25lcnJvciIsInVwZGF0ZWRIYW5nb3V0IiwidXBkYXRlSGFuZ291dFN0YXRlSW5Mb2NhbFN0b3JhZ2UiLCJuZXdIYW5nb3V0IiwiYWRkTmV3SGFuZ291dFRvTG9jYWxTdG9yYWdlIiwia2V5IiwidXBkYXRlZCIsInNldEl0ZW0iLCJzdHJpbmdpZnkiLCJpbnNlcnRlZCIsInB1c2giLCJIYW5nb3V0Q29udGV4dCIsImNyZWF0ZUNvbnRleHQiLCJ1c2VIYW5nb3V0Q29udGV4dCIsImNvbnRleHQiLCJ1c2VDb250ZXh0IiwiSGFuZ291dHNQcm92aWRlciIsInByb3BzIiwiYXV0aENvbnRleHQiLCJ1c2VBdXRoQ29udGV4dCIsInNvY2tldFVybCIsInVzZVJlZHVjZXIiLCJzb2NrZXRoYW5kbGVyIiwidmFsdWUiLCJ1c2VNZW1vIiwidXNlSGFuZ291dHMiLCJvblNlbGVjdCIsImUiLCJ0YXJnZXQiLCJpZCIsIm9uSW52aXRlIiwic2VuZCIsIm9uQWNjZXB0Iiwib25CbG9jayIsIm9uVW5ibG9jayIsIm9uRGVjbGluZSIsIm9uTWVzc2FnZSIsIm9uU2VhcmNoIiwiSGFuZ291dHMiLCJsYXp5IiwiQmxvY2siLCJCbG9ja2VkIiwiQ29uZmlndXJlIiwiSGFuZ2NoYXQiLCJJbnZpdGUiLCJJbnZpdGVlIiwiSW52aXRlciIsIk1vYmlsZSIsInJvdXRlIiwic2V0Um91dGUiLCJ1c2VSb3V0ZUNvbnRleHQiLCJoZWlnaHQiLCJTdXNwZW5zZSJdLCJtYXBwaW5ncyI6Ijs7QUFBTyxNQUFNQSxXQUFXLEdBQUc7QUFFdkJDLEVBQUFBLFVBQVUsRUFBRSxZQUZXO0FBR3ZCQyxFQUFBQSxhQUFhLEVBQUUsZUFIUTtBQUl2QkMsRUFBQUEsYUFBYSxFQUFFLGVBSlE7QUFLdkJDLEVBQUFBLGdCQUFnQixFQUFFLGtCQUxLO0FBTXZCQyxFQUFBQSxnQkFBZ0IsRUFBRSxrQkFOSztBQVF2QkMsRUFBQUEsZUFBZSxFQUFDLGlCQVJPO0FBVXZCQyxFQUFBQSxxQkFBcUIsRUFBRSx1QkFWQTtBQVd2QkMsRUFBQUEscUJBQXFCLEVBQUUsdUJBWEE7QUFZdkJDLEVBQUFBLG9CQUFvQixFQUFFLHNCQVpDO0FBYXZCQyxFQUFBQSx1QkFBdUIsRUFBRSx5QkFiRjtBQWdCdkJDLEVBQUFBLGtCQUFrQixFQUFFLG9CQWhCRztBQWlCdkJDLEVBQUFBLGtCQUFrQixFQUFFLG9CQWpCRztBQWtCdkJDLEVBQUFBLGlCQUFpQixFQUFFLG1CQWxCSTtBQXFCdkJDLEVBQUFBLG9CQUFvQixFQUFFLHNCQXJCQztBQXdCdkJDLEVBQUFBLGFBQWEsRUFBRSxlQXhCUTtBQXlCdkJDLEVBQUFBLGFBQWEsRUFBRSxlQXpCUTtBQTBCdkJDLEVBQUFBLFlBQVksRUFBRSxjQTFCUztBQTRCdkJDLEVBQUFBLGNBQWMsRUFBRSxnQkE1Qk87QUE2QnZCQyxFQUFBQSxjQUFjLEVBQUUsZ0JBN0JPO0FB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
