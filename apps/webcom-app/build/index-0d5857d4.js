import { M, u as useAuthContext, p, l, h, a as h$1, _ as _extends, w, b as useWSocketContext, c as useRouteContext, R as Route, d as M$1, O, e as RouteProvider } from './index-0834d1ff.js';

const actionTypes = {
  MESSAGE_TEXT_CHANGED: 'MESSAGE_TEXT_CHANGED',
  LOAD_HANGOUTS: 'LOAD_HANGOUTS',
  LOADED_MESSAGES: 'LOADED_MESSAGES',
  SAVED_MESSAGE_LOCALLY: 'SAVED_MESSAGE_LOCALLY',
  SEARCHED_HANGOUT: 'SEARCHED_HANGOUT',
  SELECTED_HANGOUT: 'SELECTED_HANGOUT',
  FETCH_HANGOUT_STARTED: 'FETCH_HANGOUT_STARTED',
  FETCH_HANGOUT_SUCCESS: 'FETCH_HANGOUT_SUCCESS',
  FETCH_HANGOUT_FAILED: 'FETCH_HANGOUT_FAILED',
  ONLINE_STATE_CHANGED: 'ONLINE_STATE_CHANGED',
  HANGOUT_RECIEVED: 'HANGOUT_RECIEVED',
  HANGOUT_SENT: 'HANGOUT_SENT'
};

const initState = {
  hangouts: null,
  hangout: null,
  messages: null,
  search: '',
  user: [],
  loading: false,
  error: null,
  messageText: '',
  online: false
};
function reducer(state, action) {
  switch (action.type) {
    case actionTypes.SAVED_MESSAGE_LOCALLY:
      if (state.messages) {
        return { ...state,
          messages: [...state.messages, action.message]
        };
      } else {
        return { ...state,
          messages: [action.message]
        };
      }

    case actionTypes.LOADED_MESSAGES:
      return { ...state,
        messages: action.messages
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

    case actionTypes.HANGOUT_RECIEVED:
      return { ...state,
        hangout: action.hangout,
        hangouts: updateHangout({
          hangouts: state.hangouts,
          hangout: action.hangout
        })
      };

    default:
      return state;
  }
}

function updateHangout({
  hangout,
  hangouts
}) {
  if (hangouts) {
    const hangoutExists = hangouts.find(g => g.username === hangout.username);

    if (hangoutExists) {
      return hangouts.map(g => {
        if (g.username === hangout.username) {
          return hangout;
        } else {
          return g;
        }
      });
    } else {
      return [hangouts, hangout];
    }
  } else {
    return [hangouts, hangout];
  }
}

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

    if (response.ok) {
      const {
        hangouts
      } = await response.json();
      dispatch({
        type: actionTypes.FETCH_HANGOUT_SUCCESS,
        hangouts
      });
    }
  } catch (error) {
    dispatch({
      type: actionTypes.FETCH_HANGOUT_FAILED,
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
function loadMessages({
  hangout,
  dispatch
}) {
  const {
    username
  } = hangout;
  const key = `${username}-messages`;
  const messages = JSON.parse(localStorage.getItem(key));
  dispatch({
    type: actionTypes.LOADED_MESSAGES,
    messages
  });
}
function saveMessage({
  dispatch,
  message,
  username,
  target
}) {
  const key = `${target}-messages`;
  const messages = JSON.parse(localStorage.getItem(key));

  if (messages) {
    localStorage.setItem(key, JSON.stringify([...messages, { ...message,
      username
    }]));
  } else {
    localStorage.setItem(key, JSON.stringify([{ ...message,
      username
    }]));
  }

  dispatch({
    type: actionTypes.SAVED_MESSAGE_LOCALLY,
    message
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
  const {
    hangout
  } = state;
  l(() => {
    if (username) {
      loadHangouts({
        username,
        dispatch
      });
    }
  }, [username]);
  l(() => {
    if (hangout) {
      //from local storage
      loadMessages({
        dispatch,
        hangout
      }); //save hangout to localStorage

      const key = `${username}-hangouts`;
      const hangouts = JSON.parse(localStorage.getItem(key));

      if (!hangouts) {
        localStorage.setItem(key, JSON.stringify([hangout]));
      } else {
        const hangoutExist = hangouts.find(g => g.username === hangout.username);

        if (hangoutExist) {
          const updated = hangouts.map(g => {
            if (g.username === hangout.username) {
              return hangout;
            } else {
              return g;
            }
          });
          localStorage.setItem(key, JSON.stringify(updated));
        } else {
          localStorage.setItem(key, JSON.stringify([hangout]));
        }
      }
    }
  }, [hangout]);
  const value = h(() => [state, dispatch], [state]);
  return h$1(HangoutContext.Provider, _extends({
    value: value
  }, props));
}

function updateLocalHangouts({
  hangout,
  username
}) {
  const key = `${username}-hangouts`;
  const hangouts = JSON.parse(localStorage.getItem(key));

  if (hangouts) {
    const hangoutExists = hangouts.find(g => g.username === hangout.username);

    if (hangoutExists) {
      const updatedHangout = hangouts.map(g => {
        if (g.username === hangout.username) {
          return hangout;
        } else {
          return g;
        }
      });
      localStorage.setItem(key, JSON.stringify(updatedHangout));
    } else {
      localStorage.setItem(key, JSON.stringify([hangouts, hangout]));
    }
  } else {
    localStorage.setItem(key, JSON.stringify([hangout]));
  }
}

function useSocket({
  dispatch,
  username
}) {
  const socketContext = useWSocketContext();
  const {
    socket
  } = socketContext[0];
  l(() => {
    if (socket && username) {
      socket.onmessage = message => {
        const hangout = JSON.parse(message.data);
        debugger;
        updateLocalHangouts({
          hangout,
          username
        });
        dispatch({
          type: actionTypes.HANGOUT_RECIEVED,
          hangout
        });
      };

      socket.onclose = () => {};

      socket.onerror = error => {};

      socket.onopen = () => {
        debugger;
      };
    }
  }, [socket, username]);
  return null;
}

function useHangouts() {
  const socketContext = useWSocketContext();
  const {
    socket
  } = socketContext[0];
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
    messageText,
    messages
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
    const text = e.target.value;
    changeMessageText({
      dispatch,
      text
    });
  }

  function onHangout(e) {
    debugger;
    const command = e.target.id;
    const {
      username,
      email
    } = hangout;
    let message = null;

    if (messageText) {
      message = {
        text: messageText,
        timestamp: Date.now()
      };
      saveMessage({
        dispatch,
        hangout,
        message,
        target: username,
        username: authContext.state.username
      });
    }

    const updatedHangout = {
      username,
      email,
      message
    };
    socket.send(JSON.stringify({ ...updatedHangout,
      command
    }));
    updateLocalHangouts({
      hangout,
      username,
      devivered: 'pending'
    });
  }

  return {
    onMessageText,
    messageText,
    onStartSearch,
    onSearch,
    search,
    onSelectHangout,
    onSelectUser,
    hangout,
    hangouts,
    users,
    username,
    messages,
    onHangout
  };
}

const Hangouts = O(() => import('./Hangout-2962f479.js'));
const Block = O(() => import('./Block-b4db4b54.js'));
const Blocked = O(() => import('./Blocked-cc3e78fe.js'));
const Configure = O(() => import('./Configure-811b40eb.js'));
const Hangchat = O(() => import('./Hangchat-0a22c278.js'));
const Invite = O(() => import('./Invite-611eafca.js'));
const Invitee = O(() => import('./Invitee-12564781.js'));
const Inviter = O(() => import('./Inviter-5068f7d8.js'));
function Mobile() {
  const [route, setRoute] = useRouteContext();
  const {
    hangout,
    hangouts,
    onHangout,
    onSelectHangout,
    onSelectUser,
    onSearch,
    users,
    search,
    onStartSearch,
    onMessageText,
    messageText,
    username,
    messages
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
    onBlock: onHangout
  }))), h$1(Route, {
    path: "/BLOCKED"
  }, h$1(M$1, {
    fallback: h$1("div", null, "Loading...")
  }, h$1(Blocked, {
    hangout: hangout,
    onUnblock: onHangout
  }))), h$1(Route, {
    path: "/configure"
  }, h$1(M$1, {
    fallback: h$1("div", null, "Loading...")
  }, h$1(Configure, {
    hangout: hangout
  }))), h$1(Route, {
    paths: ["/ACCEPTED", "/ACCEPTER", "/MESSANGER", "/MESSAGED"]
  }, h$1(M$1, {
    fallback: h$1("div", null, "Loading...")
  }, h$1(Hangchat, {
    onMessageText: onMessageText,
    onMessage: onHangout,
    messages: messages,
    username: username
  }))), h$1(Route, {
    path: "/INVITE"
  }, h$1(M$1, {
    fallback: h$1("div", null, "Loading...")
  }, h$1(Invite, {
    hangout: hangout,
    onInvite: onHangout,
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
    onAccept: onHangout
  }))));
}

function index () {
  return h$1(HangoutsProvider, null, h$1(RouteProvider, {
    initialRoute: "/hangouts"
  }, h$1(Mobile, null)));
}

export default index;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtMGQ1ODU3ZDQuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25UeXBlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9yZWR1Y2VyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL2FjdGlvbnMuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvSGFuZ291dHNQcm92aWRlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS91cGRhdGVMb2NhbEhhbmdvdXRzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL3VzZVNvY2tldC5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS91c2VIYW5nb3V0cy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9tb2JpbGUuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IGFjdGlvblR5cGVzID0ge1xuXG4gICAgTUVTU0FHRV9URVhUX0NIQU5HRUQ6J01FU1NBR0VfVEVYVF9DSEFOR0VEJyxcblxuICAgIExPQURfSEFOR09VVFM6ICdMT0FEX0hBTkdPVVRTJyxcbiAgICBMT0FERURfTUVTU0FHRVM6ICdMT0FERURfTUVTU0FHRVMnLFxuICAgIFNBVkVEX01FU1NBR0VfTE9DQUxMWTonU0FWRURfTUVTU0FHRV9MT0NBTExZJyxcbiAgICBTRUFSQ0hFRF9IQU5HT1VUOiAnU0VBUkNIRURfSEFOR09VVCcsXG4gICAgU0VMRUNURURfSEFOR09VVDogJ1NFTEVDVEVEX0hBTkdPVVQnLFxuXG4gICAgRkVUQ0hfSEFOR09VVF9TVEFSVEVEOiAnRkVUQ0hfSEFOR09VVF9TVEFSVEVEJyxcbiAgICBGRVRDSF9IQU5HT1VUX1NVQ0NFU1M6ICdGRVRDSF9IQU5HT1VUX1NVQ0NFU1MnLFxuICAgIEZFVENIX0hBTkdPVVRfRkFJTEVEOiAnRkVUQ0hfSEFOR09VVF9GQUlMRUQnLFxuICAgIFxuICAgIE9OTElORV9TVEFURV9DSEFOR0VEOiAnT05MSU5FX1NUQVRFX0NIQU5HRUQnLFxuXG4gICAgSEFOR09VVF9SRUNJRVZFRDonSEFOR09VVF9SRUNJRVZFRCcsXG4gICAgSEFOR09VVF9TRU5UOidIQU5HT1VUX1NFTlQnXG5cbn0iLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4vYWN0aW9uVHlwZXMnO1xuZXhwb3J0IGNvbnN0IGluaXRTdGF0ZSA9IHtcbiAgaGFuZ291dHM6IG51bGwsXG4gIGhhbmdvdXQ6IG51bGwsXG4gIG1lc3NhZ2VzOiBudWxsLFxuICBzZWFyY2g6ICcnLFxuICB1c2VyOiBbXSxcbiAgbG9hZGluZzogZmFsc2UsXG4gIGVycm9yOiBudWxsLFxuICBtZXNzYWdlVGV4dDogJycsXG4gIG9ubGluZTogZmFsc2UsXG59O1xuZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZXIoc3RhdGUsIGFjdGlvbikge1xuICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TQVZFRF9NRVNTQUdFX0xPQ0FMTFk6XG4gICAgICBpZiAoc3RhdGUubWVzc2FnZXMpIHtcbiAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIG1lc3NhZ2VzOiBbLi4uc3RhdGUubWVzc2FnZXMsIGFjdGlvbi5tZXNzYWdlXSB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIG1lc3NhZ2VzOiBbYWN0aW9uLm1lc3NhZ2VdIH07XG4gICAgICB9XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0FERURfTUVTU0FHRVM6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbWVzc2FnZXM6IGFjdGlvbi5tZXNzYWdlcyB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuTUVTU0FHRV9URVhUX0NIQU5HRUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbWVzc2FnZVRleHQ6IGFjdGlvbi50ZXh0IH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9VU0VSX0ZBSUxFRDpcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfRkFJTEVEOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBlcnJvcjogYWN0aW9uLmVycm9yIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9VU0VSX1NUQVJURUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogdHJ1ZSB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuRkVUQ0hfVVNFUl9TVUNDRVNTOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgICAgICB1c2VyczogYWN0aW9uLnVzZXJzLFxuICAgICAgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfU1RBUlRFRDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiB0cnVlIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NVQ0NFU1M6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGhhbmdvdXRzOiBhY3Rpb24uaGFuZ291dHMgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkhBTkdPVVRfTk9UX0ZPVU5EOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GSUxURVJfSEFOR09VVFM6XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgaGFuZ291dHM6IHN0YXRlLmhhbmdvdXRzLmZpbHRlcigoZykgPT5cbiAgICAgICAgICBnLnVzZXJuYW1lLmluY2x1ZGVzKHN0YXRlLnNlYXJjaClcbiAgICAgICAgKSxcbiAgICAgIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TRUFSQ0hFRF9IQU5HT1VUOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHNlYXJjaDogYWN0aW9uLnNlYXJjaCB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuTE9BRF9IQU5HT1VUUzpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBoYW5nb3V0czogYWN0aW9uLmhhbmdvdXRzIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TRUxFQ1RFRF9VU0VSOlxuICAgICAgaWYgKHN0YXRlLmhhbmdvdXRzKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgICAgaGFuZ291dHM6IFsuLi5zdGF0ZS5oYW5nb3V0cywgYWN0aW9uLmhhbmdvdXRdLFxuICAgICAgICAgIGhhbmdvdXQ6IGFjdGlvbi5oYW5nb3V0LFxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIGhhbmdvdXRzOiBbYWN0aW9uLmhhbmdvdXRdLFxuICAgICAgICBoYW5nb3V0OiBhY3Rpb24uaGFuZ291dCxcbiAgICAgIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TRUxFQ1RFRF9IQU5HT1VUOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIGhhbmdvdXQ6IHN0YXRlLmhhbmdvdXRzLmZpbmQoKGcpID0+IGcudXNlcm5hbWUgPT09IGFjdGlvbi51c2VybmFtZSksXG4gICAgICB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuSEFOR09VVF9SRUNJRVZFRDpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBoYW5nb3V0OiBhY3Rpb24uaGFuZ291dCxcbiAgICAgICAgaGFuZ291dHM6IHVwZGF0ZUhhbmdvdXQoeyBoYW5nb3V0czogc3RhdGUuaGFuZ291dHMsIGhhbmdvdXQ6IGFjdGlvbi5oYW5nb3V0IH0pXG4gICAgICB9O1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgfVxufVxuXG5cblxuZnVuY3Rpb24gdXBkYXRlSGFuZ291dCh7IGhhbmdvdXQsIGhhbmdvdXRzIH0pIHtcblxuICBpZiAoaGFuZ291dHMpIHtcbiAgICBjb25zdCBoYW5nb3V0RXhpc3RzID0gaGFuZ291dHMuZmluZChnID0+IGcudXNlcm5hbWUgPT09IGhhbmdvdXQudXNlcm5hbWUpXG4gICAgaWYgKGhhbmdvdXRFeGlzdHMpIHtcbiAgICAgIHJldHVybiBoYW5nb3V0cy5tYXAoZyA9PiB7XG4gICAgICAgIGlmIChnLnVzZXJuYW1lID09PSBoYW5nb3V0LnVzZXJuYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIGhhbmdvdXRcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZ1xuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gW2hhbmdvdXRzLCBoYW5nb3V0XVxuICAgIH1cbiAgfVxuICBlbHNlIHtcbiAgICByZXR1cm4gW2hhbmdvdXRzLCBoYW5nb3V0XVxuICB9XG59IiwiaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuL2FjdGlvblR5cGVzJztcblxuLy9yZXRyaWV2ZXMgaGFuZ291dHMgZnJvbSBsb2NhbFN0b3JhZ2VcbmV4cG9ydCBmdW5jdGlvbiBsb2FkSGFuZ291dHMoeyB1c2VybmFtZSwgZGlzcGF0Y2ggfSkge1xuICBjb25zdCBoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oYCR7dXNlcm5hbWV9LWhhbmdvdXRzYCkpO1xuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkxPQURfSEFOR09VVFMsIGhhbmdvdXRzIH0pO1xufVxuLy9zZWxlY3QgaGFuZ291dCBmcm9tIExpc3RcbmV4cG9ydCBmdW5jdGlvbiBzZWxlY3RIYW5nb3V0KHsgZGlzcGF0Y2gsIHVzZXJuYW1lIH0pIHtcblxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFTEVDVEVEX0hBTkdPVVQsIHVzZXJuYW1lIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0VXNlcih7IGRpc3BhdGNoLCB1c2VyLCB1c2VybmFtZSB9KSB7XG4gIC8vIHNhdmUgc2VsZWN0ZWQgdXNlciB0byBoYW5nb3V0c1xuICBjb25zdCBoYW5nb3V0ID0geyAuLi51c2VyLCBzdGF0ZTogJ0lOVklURScgfTtcbiAgY29uc3QgaGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGAke3VzZXJuYW1lfS1oYW5nb3V0c2ApKTtcblxuICBpZiAoaGFuZ291dHMpIHtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcbiAgICAgIGAke3VzZXJuYW1lfS1oYW5nb3V0c2AsXG4gICAgICBKU09OLnN0cmluZ2lmeShbLi4uaGFuZ291dHMsIGhhbmdvdXRdKVxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oYCR7dXNlcm5hbWV9LWhhbmdvdXRzYCwgSlNPTi5zdHJpbmdpZnkoW2hhbmdvdXRdKSk7XG4gIH1cblxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFTEVDVEVEX1VTRVIsIGhhbmdvdXQgfSk7XG59XG4vL3NlYXJjaCBmb3IgaGFuZ291dCBieSB0eXBpbmcgaW50byBUZXh0SW5wdXRcbmV4cG9ydCBmdW5jdGlvbiBzZWFyY2hIYW5nb3V0cyh7IHNlYXJjaCwgZGlzcGF0Y2ggfSkge1xuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFQVJDSEVEX0hBTkdPVVQsIHNlYXJjaCB9KTtcbn1cbi8vZmlsdGVyIGhhbmdvdXQgYWZ0ZXIgc2VhcmNoIHN0YXRlIGNoYW5nZVxuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlckhhbmdvdXRzKHsgZGlzcGF0Y2ggfSkge1xuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZJTFRFUl9IQU5HT1VUUyB9KTtcbn1cblxuLy9mZXRjaCBoYW5nb3V0IGZyb20gc2VydmVyIGlmIG5vdCBmb3VuZCBpbiBsb2NhbCBoYW5nb3V0c1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoSGFuZ291dCh7IHNlYXJjaCwgZGlzcGF0Y2gsIHVzZXJuYW1lIH0pIHtcbiAgdHJ5IHtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfU1RBUlRFRCB9KTtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxuICAgICAgYC9oYW5nb3V0cy9maW5kP3NlYXJjaD0ke3NlYXJjaH0mdXNlcm5hbWU9JHt1c2VybmFtZX1gXG4gICAgKTtcbiAgICBpZiAocmVzcG9uc2Uub2spIHtcbiAgICAgIGNvbnN0IHsgaGFuZ291dHMgfSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NVQ0NFU1MsIGhhbmdvdXRzIH0pO1xuICAgICAgXG4gICAgfSBcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zdCBlcnIgPSBlcnJvcjtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfRkFJTEVELCBlcnJvciB9KTtcbiAgfVxufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBjaGFuZ2VNZXNzYWdlVGV4dCh7IHRleHQsIGRpc3BhdGNoIH0pIHtcbiBcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5NRVNTQUdFX1RFWFRfQ0hBTkdFRCwgdGV4dCB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0YXJ0Q2xpZW50Q29tbWFuZCh7IGRpc3BhdGNoIH0pIHtcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5DTElFTlRfQ09NTUFORF9TVEFSVEVEIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbG9hZE1lc3NhZ2VzKHsgaGFuZ291dCwgZGlzcGF0Y2ggfSkge1xuICBjb25zdCB7IHVzZXJuYW1lIH0gPSBoYW5nb3V0O1xuICBjb25zdCBrZXkgPSBgJHt1c2VybmFtZX0tbWVzc2FnZXNgO1xuICBjb25zdCBtZXNzYWdlcyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KSk7XG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTE9BREVEX01FU1NBR0VTLCBtZXNzYWdlcyB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVNZXNzYWdlKHsgIGRpc3BhdGNoLCBtZXNzYWdlLHVzZXJuYW1lLHRhcmdldCB9KSB7XG4gXG4gIGNvbnN0IGtleSA9IGAke3RhcmdldH0tbWVzc2FnZXNgO1xuICBjb25zdCBtZXNzYWdlcyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KSk7XG4gIGlmIChtZXNzYWdlcykge1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkoWy4uLm1lc3NhZ2VzLHsuLi5tZXNzYWdlLHVzZXJuYW1lfV0pKTtcbiAgfSBlbHNlIHtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KFt7Li4ubWVzc2FnZSx1c2VybmFtZX1dKSk7XG4gIH1cbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TQVZFRF9NRVNTQUdFX0xPQ0FMTFksIG1lc3NhZ2UgfSk7XG59XG4iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7XG4gIHVzZUNvbnRleHQsXG4gIHVzZVN0YXRlLFxuICB1c2VNZW1vLFxuICB1c2VSZWR1Y2VyLFxuICB1c2VFZmZlY3QsXG59IGZyb20gJ3ByZWFjdC9ob29rcyc7XG5pbXBvcnQgeyByZWR1Y2VyLCBpbml0U3RhdGUgfSBmcm9tICcuL3JlZHVjZXInO1xuXG5pbXBvcnQge1xuICBsb2FkSGFuZ291dHMsXG4gIGZpbHRlckhhbmdvdXRzLFxuICBmZXRjaEhhbmdvdXQsXG4gIGxvYWRNZXNzYWdlcyxcbiAgc2F2ZU1lc3NhZ2UsXG59IGZyb20gJy4vYWN0aW9ucyc7XG5pbXBvcnQgeyB1c2VBdXRoQ29udGV4dCB9IGZyb20gJy4uLy4uL2F1dGgvYXV0aC1jb250ZXh0JztcbmNvbnN0IEhhbmdvdXRDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xuZXhwb3J0IGZ1bmN0aW9uIHVzZUhhbmdvdXRDb250ZXh0KCkge1xuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChIYW5nb3V0Q29udGV4dCk7XG4gIGlmICghY29udGV4dCkge1xuICAgIHRocm93IG5ldyBFcnJvcigndXNlSGFuZ291dENvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggSGFuZ291dHNQcm92aWRlcicpO1xuICB9XG5cbiAgcmV0dXJuIGNvbnRleHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBIYW5nb3V0c1Byb3ZpZGVyKHByb3BzKSB7XG4gIGNvbnN0IGF1dGhDb250ZXh0ID0gdXNlQXV0aENvbnRleHQoKTtcbiAgY29uc3QgeyB1c2VybmFtZSB9ID0gYXV0aENvbnRleHQuc3RhdGU7XG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlUmVkdWNlcihyZWR1Y2VyLCBpbml0U3RhdGUpO1xuICBjb25zdCB7IGhhbmdvdXQgfSA9IHN0YXRlO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKHVzZXJuYW1lKSB7XG4gICAgICBsb2FkSGFuZ291dHMoeyB1c2VybmFtZSwgZGlzcGF0Y2ggfSk7XG4gICAgfVxuICB9LCBbdXNlcm5hbWVdKTtcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoaGFuZ291dCkge1xuICAgICAgLy9mcm9tIGxvY2FsIHN0b3JhZ2VcbiAgICAgIGxvYWRNZXNzYWdlcyh7IGRpc3BhdGNoLCBoYW5nb3V0IH0pO1xuXG4gICAgICAvL3NhdmUgaGFuZ291dCB0byBsb2NhbFN0b3JhZ2VcbiAgICAgIGNvbnN0IGtleSA9IGAke3VzZXJuYW1lfS1oYW5nb3V0c2A7XG4gICAgICBjb25zdCBoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KSk7XG4gICAgICBpZiAoIWhhbmdvdXRzKSB7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkoW2hhbmdvdXRdKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBoYW5nb3V0RXhpc3QgPSBoYW5nb3V0cy5maW5kKFxuICAgICAgICAgIChnKSA9PiBnLnVzZXJuYW1lID09PSBoYW5nb3V0LnVzZXJuYW1lXG4gICAgICAgICk7XG4gICAgICAgIGlmIChoYW5nb3V0RXhpc3QpIHtcbiAgICAgICAgICBjb25zdCB1cGRhdGVkID0gaGFuZ291dHMubWFwKChnKSA9PiB7XG4gICAgICAgICAgICBpZiAoZy51c2VybmFtZSA9PT0gaGFuZ291dC51c2VybmFtZSkge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZ291dDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiBnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkodXBkYXRlZCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkoW2hhbmdvdXRdKSk7XG4gICAgICAgXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sIFtoYW5nb3V0XSk7XG5cbiAgY29uc3QgdmFsdWUgPSB1c2VNZW1vKCgpID0+IFtzdGF0ZSwgZGlzcGF0Y2hdLCBbc3RhdGVdKTtcbiAgcmV0dXJuIDxIYW5nb3V0Q29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30gLz47XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gdXBkYXRlTG9jYWxIYW5nb3V0cyh7IGhhbmdvdXQsIHVzZXJuYW1lIH0pIHtcbiAgICBjb25zdCBrZXkgPSBgJHt1c2VybmFtZX0taGFuZ291dHNgXG4gICAgY29uc3QgaGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSkpXG4gICAgaWYgKGhhbmdvdXRzKSB7XG4gICAgICAgIGNvbnN0IGhhbmdvdXRFeGlzdHMgPSBoYW5nb3V0cy5maW5kKGcgPT4gZy51c2VybmFtZSA9PT0gaGFuZ291dC51c2VybmFtZSlcbiAgICAgICAgaWYgKGhhbmdvdXRFeGlzdHMpIHtcbiAgICAgICAgICAgIGNvbnN0IHVwZGF0ZWRIYW5nb3V0ID0gaGFuZ291dHMubWFwKGcgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChnLnVzZXJuYW1lID09PSBoYW5nb3V0LnVzZXJuYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBoYW5nb3V0XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KHVwZGF0ZWRIYW5nb3V0KSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkoW2hhbmdvdXRzLCBoYW5nb3V0XSkpXG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkoW2hhbmdvdXRdKSlcbiAgICB9XG59IiwiaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcbmltcG9ydCB7IHVzZVdTb2NrZXRDb250ZXh0IH0gZnJvbSAnLi4vLi4vd3NvY2tldC9XU29ja2V0UHJvdmlkZXInO1xuaW1wb3J0IHsgaGFuZ291dFN0YXRlcyB9IGZyb20gJy4uLy4uLy4uL3NlcnZlci9oYW5nb3V0cy9oYW5nb3V0U3RhdGVzJ1xuaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuL2FjdGlvblR5cGVzJ1xuaW1wb3J0IHt1cGRhdGVMb2NhbEhhbmdvdXRzfSBmcm9tICcuL3VwZGF0ZUxvY2FsSGFuZ291dHMnXG5pbXBvcnQgeyBjbGllbnRDb21tYW5kcyB9IGZyb20gJy4vY2xpZW50Q29tbWFuZHMnXG5leHBvcnQgZnVuY3Rpb24gdXNlU29ja2V0KHsgZGlzcGF0Y2gsIHVzZXJuYW1lIH0pIHtcbiAgY29uc3Qgc29ja2V0Q29udGV4dCA9IHVzZVdTb2NrZXRDb250ZXh0KCk7XG4gIGNvbnN0IHsgc29ja2V0IH0gPSBzb2NrZXRDb250ZXh0WzBdXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoc29ja2V0ICYmIHVzZXJuYW1lKSB7XG4gICAgICBzb2NrZXQub25tZXNzYWdlID0gKG1lc3NhZ2UpID0+IHtcbiAgICAgICAgY29uc3QgaGFuZ291dCA9IEpTT04ucGFyc2UobWVzc2FnZS5kYXRhKTtcbiAgICAgICAgZGVidWdnZXI7XG4gICAgICAgIHVwZGF0ZUxvY2FsSGFuZ291dHMoe2hhbmdvdXQsdXNlcm5hbWV9KVxuICAgICAgICBkaXNwYXRjaCh7dHlwZTphY3Rpb25UeXBlcy5IQU5HT1VUX1JFQ0lFVkVELCBoYW5nb3V0fSlcbiAgICAgIH07XG4gICAgICBzb2NrZXQub25jbG9zZSA9ICgpID0+IHtcblxuICAgICAgfTtcbiAgICAgIHNvY2tldC5vbmVycm9yID0gKGVycm9yKSA9PiB7XG5cbiAgICAgIH07XG5cbiAgICAgIHNvY2tldC5vbm9wZW4gPSAoKSA9PiB7XG4gICAgICAgIGRlYnVnZ2VyO1xuXG4gICAgICB9O1xuICAgIH1cbiAgfSwgW3NvY2tldCwgdXNlcm5hbWVdKTtcblxuICByZXR1cm4gbnVsbDtcblxufVxuXG5cblxuXG5cblxuXG5cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgdXNlSGFuZ291dENvbnRleHQgfSBmcm9tICcuL0hhbmdvdXRzUHJvdmlkZXInO1xuaW1wb3J0IHsgdXNlQXV0aENvbnRleHQgfSBmcm9tICcuLi8uLi9hdXRoL2F1dGgtY29udGV4dCc7XG5pbXBvcnQgeyB1c2VXU29ja2V0Q29udGV4dCB9IGZyb20gJy4uLy4uL3dzb2NrZXQvV1NvY2tldFByb3ZpZGVyJztcbmltcG9ydCB7IHVwZGF0ZUxvY2FsSGFuZ291dHMgfSBmcm9tICcuL3VwZGF0ZUxvY2FsSGFuZ291dHMnXG5pbXBvcnQge1xuICBzZWxlY3RIYW5nb3V0LFxuICBzZWFyY2hIYW5nb3V0cyxcbiAgZmlsdGVySGFuZ291dHMsXG4gIGZldGNoSGFuZ291dCxcbiAgc2VsZWN0VXNlcixcbiAgY2hhbmdlTWVzc2FnZVRleHQsXG4gIHN0YXJ0Q2xpZW50Q29tbWFuZCxcbiAgc2F2ZU1lc3NhZ2UsXG59IGZyb20gJy4vYWN0aW9ucyc7XG5pbXBvcnQgeyB1c2VTb2NrZXQgfSBmcm9tICcuL3VzZVNvY2tldCc7XG5pbXBvcnQgeyBjbGllbnRDb21tYW5kcyB9IGZyb20gJy4vY2xpZW50Q29tbWFuZHMnO1xuXG5leHBvcnQgZnVuY3Rpb24gdXNlSGFuZ291dHMoKSB7XG4gIGNvbnN0IHNvY2tldENvbnRleHQgPSB1c2VXU29ja2V0Q29udGV4dCgpO1xuICBjb25zdCB7IHNvY2tldCB9ID0gc29ja2V0Q29udGV4dFswXVxuICBjb25zdCBhdXRoQ29udGV4dCA9IHVzZUF1dGhDb250ZXh0KCk7XG4gIGNvbnN0IHsgdXNlcm5hbWUgfSA9IGF1dGhDb250ZXh0LnN0YXRlO1xuICBjb25zdCBbc3RhdGUsIGRpc3BhdGNoXSA9IHVzZUhhbmdvdXRDb250ZXh0KCk7XG4gIGNvbnN0IHsgaGFuZ291dCwgaGFuZ291dHMsIHNlYXJjaCwgdXNlcnMsIG1lc3NhZ2VUZXh0LCBtZXNzYWdlcyB9ID0gc3RhdGU7XG4gIGNvbnN0IGhhbmRsZVNvY2tldCA9IHVzZVNvY2tldCh7IGRpc3BhdGNoLCBoYW5nb3V0LCB1c2VybmFtZSB9KTtcbiAgZnVuY3Rpb24gb25TZWxlY3RIYW5nb3V0KGUpIHtcbiAgICBjb25zdCB1c2VybmFtZSA9IGUudGFyZ2V0LmlkO1xuICAgIHNlbGVjdEhhbmdvdXQoeyBkaXNwYXRjaCwgdXNlcm5hbWUgfSk7XG4gIH1cbiAgZnVuY3Rpb24gb25TZWxlY3RVc2VyKGUpIHtcbiAgICBjb25zdCB1bmFtZSA9IGUudGFyZ2V0LmlkO1xuICAgIGNvbnN0IHVzZXIgPSB1c2Vycy5maW5kKCh1KSA9PiB1LnVzZXJuYW1lID09PSB1bmFtZSk7XG4gICAgc2VsZWN0VXNlcih7IGRpc3BhdGNoLCB1c2VyLCB1c2VybmFtZSB9KTtcbiAgfVxuICBmdW5jdGlvbiBvblNlYXJjaChlKSB7XG4gICAgc2VhcmNoSGFuZ291dHMoeyBzZWFyY2g6IGUudGFyZ2V0LnZhbHVlLCBkaXNwYXRjaCB9KTtcbiAgfVxuICBmdW5jdGlvbiBvblN0YXJ0U2VhcmNoKGUpIHtcbiAgICBpZiAoaGFuZ291dHMgJiYgaGFuZ291dHMubGVuZ3RoID4gMCkge1xuICAgICAgZmlsdGVySGFuZ291dHMoeyBkaXNwYXRjaCB9KTtcbiAgICB9XG4gICAgZmV0Y2hIYW5nb3V0KHsgZGlzcGF0Y2gsIHNlYXJjaCwgdXNlcm5hbWUgfSk7XG4gIH1cbiAgZnVuY3Rpb24gb25NZXNzYWdlVGV4dChlKSB7XG4gICAgY29uc3QgdGV4dCA9IGUudGFyZ2V0LnZhbHVlXG4gICAgY2hhbmdlTWVzc2FnZVRleHQoeyBkaXNwYXRjaCwgdGV4dCB9KTtcbiAgfVxuICBmdW5jdGlvbiBvbkhhbmdvdXQoZSkge1xuICAgIGRlYnVnZ2VyO1xuICAgIGNvbnN0IGNvbW1hbmQgPSBlLnRhcmdldC5pZFxuICAgIGNvbnN0IHsgdXNlcm5hbWUsIGVtYWlsIH0gPSBoYW5nb3V0O1xuICAgIGxldCBtZXNzYWdlID0gbnVsbFxuICAgIGlmIChtZXNzYWdlVGV4dCkge1xuICAgICAgbWVzc2FnZSA9IHsgdGV4dDogbWVzc2FnZVRleHQsIHRpbWVzdGFtcDogRGF0ZS5ub3coKSB9O1xuICAgICAgc2F2ZU1lc3NhZ2UoeyBkaXNwYXRjaCwgaGFuZ291dCwgbWVzc2FnZSwgdGFyZ2V0OiB1c2VybmFtZSwgdXNlcm5hbWU6IGF1dGhDb250ZXh0LnN0YXRlLnVzZXJuYW1lIH0pO1xuICAgIH1cbiAgICBjb25zdCB1cGRhdGVkSGFuZ291dCA9IHtcbiAgICAgIHVzZXJuYW1lLFxuICAgICAgZW1haWwsXG4gICAgICBtZXNzYWdlLFxuICAgIH07XG4gICAgc29ja2V0LnNlbmQoXG4gICAgICBKU09OLnN0cmluZ2lmeSh7IC4uLnVwZGF0ZWRIYW5nb3V0LCBjb21tYW5kIH0pXG4gICAgKTtcbiAgICB1cGRhdGVMb2NhbEhhbmdvdXRzKHsgaGFuZ291dCwgdXNlcm5hbWUsIGRldml2ZXJlZDogJ3BlbmRpbmcnIH0pXG4gIH1cbiAgcmV0dXJuIHtcbiAgICBvbk1lc3NhZ2VUZXh0LFxuICAgIG1lc3NhZ2VUZXh0LFxuICAgIG9uU3RhcnRTZWFyY2gsXG4gICAgb25TZWFyY2gsXG4gICAgc2VhcmNoLFxuICAgIG9uU2VsZWN0SGFuZ291dCxcbiAgICBvblNlbGVjdFVzZXIsXG4gICAgaGFuZ291dCxcbiAgICBoYW5nb3V0cyxcbiAgICB1c2VycyxcbiAgICB1c2VybmFtZSxcbiAgICBtZXNzYWdlcyxcbiAgICBvbkhhbmdvdXRcbiAgfTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcbmltcG9ydCB7IGxhenksIFN1c3BlbnNlIH0gZnJvbSAncHJlYWN0L2NvbXBhdCc7XG5pbXBvcnQgeyBSb3V0ZSwgdXNlUm91dGVDb250ZXh0IH0gZnJvbSAnLi4vcm91dGUvcm91dGVyJztcblxuaW1wb3J0IHsgdXNlSGFuZ291dHMgfSBmcm9tICcuL3N0YXRlL3VzZUhhbmdvdXRzJztcbmNvbnN0IEhhbmdvdXRzID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vSGFuZ291dCcpKTtcbmNvbnN0IEJsb2NrID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vc3RhdGUtdWkvQmxvY2snKSk7XG5jb25zdCBCbG9ja2VkID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vc3RhdGUtdWkvQmxvY2tlZCcpKTtcbmNvbnN0IENvbmZpZ3VyZSA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL3N0YXRlLXVpL0NvbmZpZ3VyZScpKTtcbmNvbnN0IEhhbmdjaGF0ID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vc3RhdGUtdWkvSGFuZ2NoYXQnKSk7XG5jb25zdCBJbnZpdGUgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9zdGF0ZS11aS9JbnZpdGUnKSk7XG5jb25zdCBJbnZpdGVlID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vc3RhdGUtdWkvSW52aXRlZScpKTtcbmNvbnN0IEludml0ZXIgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9zdGF0ZS11aS9JbnZpdGVyJykpO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBNb2JpbGUoKSB7XG4gIGNvbnN0IFtyb3V0ZSwgc2V0Um91dGVdID0gdXNlUm91dGVDb250ZXh0KCk7XG4gIGNvbnN0IHtcbiAgICBoYW5nb3V0LFxuICAgIGhhbmdvdXRzLFxuICAgIG9uSGFuZ291dCxcbiAgICBvblNlbGVjdEhhbmdvdXQsXG4gICAgb25TZWxlY3RVc2VyLFxuICAgIG9uU2VhcmNoLFxuICAgIHVzZXJzLFxuICAgIHNlYXJjaCxcbiAgICBvblN0YXJ0U2VhcmNoLFxuICAgIG9uTWVzc2FnZVRleHQsXG4gICAgbWVzc2FnZVRleHQsXG4gICAgdXNlcm5hbWUsXG4gICAgbWVzc2FnZXNcbiAgfSA9IHVzZUhhbmdvdXRzKCk7XG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGhhbmdvdXQpIHtcbiAgICAgIHNldFJvdXRlKGAvJHtoYW5nb3V0LnN0YXRlfWApO1xuICAgIH1cbiAgfSwgW2hhbmdvdXRdKTtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodDogJzg1dmgnIH19PlxuICAgICAgPFJvdXRlIHBhdGg9XCIvaGFuZ291dHNcIj5cbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxuICAgICAgICAgIDxIYW5nb3V0c1xuICAgICAgICAgICAgdXNlcnM9e3VzZXJzfVxuICAgICAgICAgICAgc2VhcmNoPXtzZWFyY2h9XG4gICAgICAgICAgICBoYW5nb3V0cz17aGFuZ291dHN9XG4gICAgICAgICAgICBvblNlbGVjdEhhbmdvdXQ9e29uU2VsZWN0SGFuZ291dH1cbiAgICAgICAgICAgIG9uU2VsZWN0VXNlcj17b25TZWxlY3RVc2VyfVxuICAgICAgICAgICAgb25TZWFyY2g9e29uU2VhcmNofVxuICAgICAgICAgICAgb25TdGFydFNlYXJjaD17b25TdGFydFNlYXJjaH1cbiAgICAgICAgICAvPlxuICAgICAgICA8L1N1c3BlbnNlPlxuICAgICAgPC9Sb3V0ZT5cbiAgICAgIDxSb3V0ZSBwYXRoPVwiL0JMT0NLXCI+XG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cbiAgICAgICAgICA8QmxvY2sgaGFuZ291dD17aGFuZ291dH0gb25CbG9jaz17b25IYW5nb3V0fSAvPlxuICAgICAgICA8L1N1c3BlbnNlPlxuICAgICAgPC9Sb3V0ZT5cbiAgICAgIDxSb3V0ZSBwYXRoPVwiL0JMT0NLRURcIj5cbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxuICAgICAgICAgIDxCbG9ja2VkIGhhbmdvdXQ9e2hhbmdvdXR9IG9uVW5ibG9jaz17b25IYW5nb3V0fSAvPlxuICAgICAgICA8L1N1c3BlbnNlPlxuICAgICAgPC9Sb3V0ZT5cbiAgICAgIDxSb3V0ZSBwYXRoPVwiL2NvbmZpZ3VyZVwiPlxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+TG9hZGluZy4uLjwvZGl2Pn0+XG4gICAgICAgICAgPENvbmZpZ3VyZSBoYW5nb3V0PXtoYW5nb3V0fSAvPlxuICAgICAgICA8L1N1c3BlbnNlPlxuICAgICAgPC9Sb3V0ZT5cbiAgICAgIDxSb3V0ZSBwYXRocz17W1wiL0FDQ0VQVEVEXCIsXCIvQUNDRVBURVJcIixcIi9NRVNTQU5HRVJcIixcIi9NRVNTQUdFRFwiXX0+XG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cbiAgICAgICAgICA8SGFuZ2NoYXRcbiAgICAgICAgICAgIG9uTWVzc2FnZVRleHQ9e29uTWVzc2FnZVRleHR9XG4gICAgICAgICAgICBvbk1lc3NhZ2U9e29uSGFuZ291dH1cbiAgICAgICAgICAgIG1lc3NhZ2VzPXttZXNzYWdlc31cbiAgICAgICAgICAgIHVzZXJuYW1lPXt1c2VybmFtZX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L1N1c3BlbnNlPlxuICAgICAgPC9Sb3V0ZT5cbiAgICBcbiAgICAgIDxSb3V0ZSBwYXRoPVwiL0lOVklURVwiPlxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+TG9hZGluZy4uLjwvZGl2Pn0+XG4gICAgICAgICAgPEludml0ZVxuICAgICAgICAgICAgaGFuZ291dD17aGFuZ291dH1cbiAgICAgICAgICAgIG9uSW52aXRlPXtvbkhhbmdvdXR9XG4gICAgICAgICAgICBvbk1lc3NhZ2VUZXh0PXtvbk1lc3NhZ2VUZXh0fVxuICAgICAgICAgICAgbWVzc2FnZVRleHQ9e21lc3NhZ2VUZXh0fVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvU3VzcGVuc2U+XG4gICAgICA8L1JvdXRlPlxuICAgICAgPFJvdXRlIHBhdGg9XCIvSU5WSVRFRFwiPlxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+TG9hZGluZy4uLjwvZGl2Pn0+XG4gICAgICAgICAgPEludml0ZWUgaGFuZ291dD17aGFuZ291dH0gLz5cbiAgICAgICAgPC9TdXNwZW5zZT5cbiAgICAgIDwvUm91dGU+XG4gICAgICA8Um91dGUgcGF0aD1cIi9JTlZJVEVSXCI+XG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cbiAgICAgICAgICA8SW52aXRlciBoYW5nb3V0PXtoYW5nb3V0fSBvbkFjY2VwdD17b25IYW5nb3V0fSAvPlxuICAgICAgICA8L1N1c3BlbnNlPlxuICAgICAgPC9Sb3V0ZT5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgTW9iaWxlIGZyb20gJy4vbW9iaWxlJztcclxuaW1wb3J0IHsgSGFuZ291dHNQcm92aWRlciB9IGZyb20gJy4vc3RhdGUvSGFuZ291dHNQcm92aWRlcic7XHJcbmltcG9ydCB7IFJvdXRlUHJvdmlkZXIsIHVzZVJvdXRlQ29udGV4dCB9IGZyb20gJy4uL3JvdXRlL3JvdXRlcic7XHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gKFxyXG4gICAgPEhhbmdvdXRzUHJvdmlkZXI+XHJcbiAgICAgIDxSb3V0ZVByb3ZpZGVyIGluaXRpYWxSb3V0ZT1cIi9oYW5nb3V0c1wiPlxyXG4gICAgICAgIDxNb2JpbGUgLz5cclxuICAgICAgPC9Sb3V0ZVByb3ZpZGVyPlxyXG4gICAgPC9IYW5nb3V0c1Byb3ZpZGVyPlxyXG4gICk7XHJcbn1cclxuIl0sIm5hbWVzIjpbImFjdGlvblR5cGVzIiwiTUVTU0FHRV9URVhUX0NIQU5HRUQiLCJMT0FEX0hBTkdPVVRTIiwiTE9BREVEX01FU1NBR0VTIiwiU0FWRURfTUVTU0FHRV9MT0NBTExZIiwiU0VBUkNIRURfSEFOR09VVCIsIlNFTEVDVEVEX0hBTkdPVVQiLCJGRVRDSF9IQU5HT1VUX1NUQVJURUQiLCJGRVRDSF9IQU5HT1VUX1NVQ0NFU1MiLCJGRVRDSF9IQU5HT1VUX0ZBSUxFRCIsIk9OTElORV9TVEFURV9DSEFOR0VEIiwiSEFOR09VVF9SRUNJRVZFRCIsIkhBTkdPVVRfU0VOVCIsImluaXRTdGF0ZSIsImhhbmdvdXRzIiwiaGFuZ291dCIsIm1lc3NhZ2VzIiwic2VhcmNoIiwidXNlciIsImxvYWRpbmciLCJlcnJvciIsIm1lc3NhZ2VUZXh0Iiwib25saW5lIiwicmVkdWNlciIsInN0YXRlIiwiYWN0aW9uIiwidHlwZSIsIm1lc3NhZ2UiLCJ0ZXh0IiwiRkVUQ0hfVVNFUl9GQUlMRUQiLCJGRVRDSF9VU0VSX1NUQVJURUQiLCJGRVRDSF9VU0VSX1NVQ0NFU1MiLCJ1c2VycyIsIkhBTkdPVVRfTk9UX0ZPVU5EIiwiRklMVEVSX0hBTkdPVVRTIiwiZmlsdGVyIiwiZyIsInVzZXJuYW1lIiwiaW5jbHVkZXMiLCJTRUxFQ1RFRF9VU0VSIiwiZmluZCIsInVwZGF0ZUhhbmdvdXQiLCJoYW5nb3V0RXhpc3RzIiwibWFwIiwibG9hZEhhbmdvdXRzIiwiZGlzcGF0Y2giLCJKU09OIiwicGFyc2UiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwic2VsZWN0SGFuZ291dCIsInNlbGVjdFVzZXIiLCJzZXRJdGVtIiwic3RyaW5naWZ5Iiwic2VhcmNoSGFuZ291dHMiLCJmaWx0ZXJIYW5nb3V0cyIsImZldGNoSGFuZ291dCIsInJlc3BvbnNlIiwiZmV0Y2giLCJvayIsImpzb24iLCJjaGFuZ2VNZXNzYWdlVGV4dCIsImxvYWRNZXNzYWdlcyIsImtleSIsInNhdmVNZXNzYWdlIiwidGFyZ2V0IiwiSGFuZ291dENvbnRleHQiLCJjcmVhdGVDb250ZXh0IiwidXNlSGFuZ291dENvbnRleHQiLCJjb250ZXh0IiwidXNlQ29udGV4dCIsIkVycm9yIiwiSGFuZ291dHNQcm92aWRlciIsInByb3BzIiwiYXV0aENvbnRleHQiLCJ1c2VBdXRoQ29udGV4dCIsInVzZVJlZHVjZXIiLCJ1c2VFZmZlY3QiLCJoYW5nb3V0RXhpc3QiLCJ1cGRhdGVkIiwidmFsdWUiLCJ1c2VNZW1vIiwiaCIsInVwZGF0ZUxvY2FsSGFuZ291dHMiLCJ1cGRhdGVkSGFuZ291dCIsInVzZVNvY2tldCIsInNvY2tldENvbnRleHQiLCJ1c2VXU29ja2V0Q29udGV4dCIsInNvY2tldCIsIm9ubWVzc2FnZSIsImRhdGEiLCJvbmNsb3NlIiwib25lcnJvciIsIm9ub3BlbiIsInVzZUhhbmdvdXRzIiwiaGFuZGxlU29ja2V0Iiwib25TZWxlY3RIYW5nb3V0IiwiZSIsImlkIiwib25TZWxlY3RVc2VyIiwidW5hbWUiLCJ1Iiwib25TZWFyY2giLCJvblN0YXJ0U2VhcmNoIiwibGVuZ3RoIiwib25NZXNzYWdlVGV4dCIsIm9uSGFuZ291dCIsImNvbW1hbmQiLCJlbWFpbCIsInRpbWVzdGFtcCIsIkRhdGUiLCJub3ciLCJzZW5kIiwiZGV2aXZlcmVkIiwiSGFuZ291dHMiLCJsYXp5IiwiQmxvY2siLCJCbG9ja2VkIiwiQ29uZmlndXJlIiwiSGFuZ2NoYXQiLCJJbnZpdGUiLCJJbnZpdGVlIiwiSW52aXRlciIsIk1vYmlsZSIsInJvdXRlIiwic2V0Um91dGUiLCJ1c2VSb3V0ZUNvbnRleHQiLCJoZWlnaHQiLCJTdXNwZW5zZSJdLCJtYXBwaW5ncyI6Ijs7QUFBTyxNQUFNQSxXQUFXLEdBQUc7QUFFdkJDLEVBQUFBLG9CQUFvQixFQUFDLHNCQUZFO0FBSXZCQyxFQUFBQSxhQUFhLEVBQUUsZUFKUTtBQUt2QkMsRUFBQUEsZUFBZSxFQUFFLGlCQUxNO0FBTXZCQyxFQUFBQSxxQkFBcUIsRUFBQyx1QkFOQztBQU92QkMsRUFBQUEsZ0JBQWdCLEVBQUUsa0JBUEs7QUFRdkJDLEVBQUFBLGdCQUFnQixFQUFFLGtCQVJLO0FBVXZCQyxFQUFBQSxxQkFBcUIsRUFBRSx1QkFWQTtBQVd2QkMsRUFBQUEscUJBQXFCLEVBQUUsdUJBWEE7QUFZdkJDLEVBQUFBLG9CQUFvQixFQUFFLHNCQVpDO0FBY3ZCQyxFQUFBQSxvQkFBb0IsRUFBRSxzQkFkQztBQWdCdkJDLEVBQUFBLGdCQUFnQixFQUFDLGtCQWhCTTtBQWlCdkJDLEVBQUFBLFlBQVksRUFBQztBQWpCVSxDQUFwQjs7QUNDQSxNQUFNQyxTQUFTLEdBQUc7QUFDdkJDLEVBQUFBLFFBQVEsRUFBRSxJQURhO0FBRXZCQyxFQUFBQSxPQUFPLEVBQUUsSUFGYztBQUd2QkMsRUFBQUEsUUFBUSxFQUFFLElBSGE7QUFJdkJDLEVBQUFBLE1BQU0sRUFBRSxFQUplO0FBS3ZCQyxFQUFBQSxJQUFJLEVBQUUsRUFMaUI7QUFNdkJDLEVBQUFBLE9BQU8sRUFBRSxL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
