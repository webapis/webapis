import { M, u as useAuthContext, p, l, h, a as h$1, _ as _extends, w, b as useWSocketContext, c as useRouteContext, R as Route, d as M$1, O, e as RouteProvider } from './index-8c6c1bf4.js';

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

      socket.onopen = () => {};
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

const Hangouts = O(() => import('./Hangout-51554e89.js'));
const Block = O(() => import('./Block-3af3bda6.js'));
const Blocked = O(() => import('./Blocked-d2b22270.js'));
const Configure = O(() => import('./Configure-ec2ec5f0.js'));
const Hangchat = O(() => import('./Hangchat-260ed7fc.js'));
const Invite = O(() => import('./Invite-c151db61.js'));
const Invitee = O(() => import('./Invitee-003887bb.js'));
const Inviter = O(() => import('./Inviter-3fe49ee5.js'));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtYjE3OTIxMzQuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25UeXBlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9yZWR1Y2VyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL2FjdGlvbnMuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvSGFuZ291dHNQcm92aWRlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS91cGRhdGVMb2NhbEhhbmdvdXRzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL3VzZVNvY2tldC5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS91c2VIYW5nb3V0cy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9tb2JpbGUuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IGFjdGlvblR5cGVzID0ge1xuXG4gICAgTUVTU0FHRV9URVhUX0NIQU5HRUQ6J01FU1NBR0VfVEVYVF9DSEFOR0VEJyxcblxuICAgIExPQURfSEFOR09VVFM6ICdMT0FEX0hBTkdPVVRTJyxcbiAgICBMT0FERURfTUVTU0FHRVM6ICdMT0FERURfTUVTU0FHRVMnLFxuICAgIFNBVkVEX01FU1NBR0VfTE9DQUxMWTonU0FWRURfTUVTU0FHRV9MT0NBTExZJyxcbiAgICBTRUFSQ0hFRF9IQU5HT1VUOiAnU0VBUkNIRURfSEFOR09VVCcsXG4gICAgU0VMRUNURURfSEFOR09VVDogJ1NFTEVDVEVEX0hBTkdPVVQnLFxuXG4gICAgRkVUQ0hfSEFOR09VVF9TVEFSVEVEOiAnRkVUQ0hfSEFOR09VVF9TVEFSVEVEJyxcbiAgICBGRVRDSF9IQU5HT1VUX1NVQ0NFU1M6ICdGRVRDSF9IQU5HT1VUX1NVQ0NFU1MnLFxuICAgIEZFVENIX0hBTkdPVVRfRkFJTEVEOiAnRkVUQ0hfSEFOR09VVF9GQUlMRUQnLFxuICAgIFxuICAgIE9OTElORV9TVEFURV9DSEFOR0VEOiAnT05MSU5FX1NUQVRFX0NIQU5HRUQnLFxuXG4gICAgSEFOR09VVF9SRUNJRVZFRDonSEFOR09VVF9SRUNJRVZFRCcsXG4gICAgSEFOR09VVF9TRU5UOidIQU5HT1VUX1NFTlQnXG5cbn0iLCJpbXBvcnQgeyBhY3Rpb25UeXBlcyB9IGZyb20gJy4vYWN0aW9uVHlwZXMnO1xuZXhwb3J0IGNvbnN0IGluaXRTdGF0ZSA9IHtcbiAgaGFuZ291dHM6IG51bGwsXG4gIGhhbmdvdXQ6IG51bGwsXG4gIG1lc3NhZ2VzOiBudWxsLFxuICBzZWFyY2g6ICcnLFxuICB1c2VyOiBbXSxcbiAgbG9hZGluZzogZmFsc2UsXG4gIGVycm9yOiBudWxsLFxuICBtZXNzYWdlVGV4dDogJycsXG4gIG9ubGluZTogZmFsc2UsXG59O1xuZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZXIoc3RhdGUsIGFjdGlvbikge1xuICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TQVZFRF9NRVNTQUdFX0xPQ0FMTFk6XG4gICAgICBpZiAoc3RhdGUubWVzc2FnZXMpIHtcbiAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIG1lc3NhZ2VzOiBbLi4uc3RhdGUubWVzc2FnZXMsIGFjdGlvbi5tZXNzYWdlXSB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIG1lc3NhZ2VzOiBbYWN0aW9uLm1lc3NhZ2VdIH07XG4gICAgICB9XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0FERURfTUVTU0FHRVM6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbWVzc2FnZXM6IGFjdGlvbi5tZXNzYWdlcyB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuTUVTU0FHRV9URVhUX0NIQU5HRUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbWVzc2FnZVRleHQ6IGFjdGlvbi50ZXh0IH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9VU0VSX0ZBSUxFRDpcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfRkFJTEVEOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBlcnJvcjogYWN0aW9uLmVycm9yIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9VU0VSX1NUQVJURUQ6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogdHJ1ZSB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuRkVUQ0hfVVNFUl9TVUNDRVNTOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgICAgICB1c2VyczogYWN0aW9uLnVzZXJzLFxuICAgICAgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfU1RBUlRFRDpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiB0cnVlIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NVQ0NFU1M6XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGhhbmdvdXRzOiBhY3Rpb24uaGFuZ291dHMgfTtcbiAgICBjYXNlIGFjdGlvblR5cGVzLkhBTkdPVVRfTk9UX0ZPVU5EOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GSUxURVJfSEFOR09VVFM6XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgaGFuZ291dHM6IHN0YXRlLmhhbmdvdXRzLmZpbHRlcigoZykgPT5cbiAgICAgICAgICBnLnVzZXJuYW1lLmluY2x1ZGVzKHN0YXRlLnNlYXJjaClcbiAgICAgICAgKSxcbiAgICAgIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TRUFSQ0hFRF9IQU5HT1VUOlxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHNlYXJjaDogYWN0aW9uLnNlYXJjaCB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuTE9BRF9IQU5HT1VUUzpcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBoYW5nb3V0czogYWN0aW9uLmhhbmdvdXRzIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TRUxFQ1RFRF9VU0VSOlxuICAgICAgaWYgKHN0YXRlLmhhbmdvdXRzKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgICAgaGFuZ291dHM6IFsuLi5zdGF0ZS5oYW5nb3V0cywgYWN0aW9uLmhhbmdvdXRdLFxuICAgICAgICAgIGhhbmdvdXQ6IGFjdGlvbi5oYW5nb3V0LFxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIGhhbmdvdXRzOiBbYWN0aW9uLmhhbmdvdXRdLFxuICAgICAgICBoYW5nb3V0OiBhY3Rpb24uaGFuZ291dCxcbiAgICAgIH07XG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TRUxFQ1RFRF9IQU5HT1VUOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIGhhbmdvdXQ6IHN0YXRlLmhhbmdvdXRzLmZpbmQoKGcpID0+IGcudXNlcm5hbWUgPT09IGFjdGlvbi51c2VybmFtZSksXG4gICAgICB9O1xuICAgIGNhc2UgYWN0aW9uVHlwZXMuSEFOR09VVF9SRUNJRVZFRDpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBoYW5nb3V0OiBhY3Rpb24uaGFuZ291dCxcbiAgICAgICAgaGFuZ291dHM6IHVwZGF0ZUhhbmdvdXQoeyBoYW5nb3V0czogc3RhdGUuaGFuZ291dHMsIGhhbmdvdXQ6IGFjdGlvbi5oYW5nb3V0IH0pXG4gICAgICB9O1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgfVxufVxuXG5cblxuZnVuY3Rpb24gdXBkYXRlSGFuZ291dCh7IGhhbmdvdXQsIGhhbmdvdXRzIH0pIHtcblxuICBpZiAoaGFuZ291dHMpIHtcbiAgICBjb25zdCBoYW5nb3V0RXhpc3RzID0gaGFuZ291dHMuZmluZChnID0+IGcudXNlcm5hbWUgPT09IGhhbmdvdXQudXNlcm5hbWUpXG4gICAgaWYgKGhhbmdvdXRFeGlzdHMpIHtcbiAgICAgIHJldHVybiBoYW5nb3V0cy5tYXAoZyA9PiB7XG4gICAgICAgIGlmIChnLnVzZXJuYW1lID09PSBoYW5nb3V0LnVzZXJuYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIGhhbmdvdXRcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZ1xuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gW2hhbmdvdXRzLCBoYW5nb3V0XVxuICAgIH1cbiAgfVxuICBlbHNlIHtcbiAgICByZXR1cm4gW2hhbmdvdXRzLCBoYW5nb3V0XVxuICB9XG59IiwiaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuL2FjdGlvblR5cGVzJztcblxuLy9yZXRyaWV2ZXMgaGFuZ291dHMgZnJvbSBsb2NhbFN0b3JhZ2VcbmV4cG9ydCBmdW5jdGlvbiBsb2FkSGFuZ291dHMoeyB1c2VybmFtZSwgZGlzcGF0Y2ggfSkge1xuICBjb25zdCBoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oYCR7dXNlcm5hbWV9LWhhbmdvdXRzYCkpO1xuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkxPQURfSEFOR09VVFMsIGhhbmdvdXRzIH0pO1xufVxuLy9zZWxlY3QgaGFuZ291dCBmcm9tIExpc3RcbmV4cG9ydCBmdW5jdGlvbiBzZWxlY3RIYW5nb3V0KHsgZGlzcGF0Y2gsIHVzZXJuYW1lIH0pIHtcblxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFTEVDVEVEX0hBTkdPVVQsIHVzZXJuYW1lIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0VXNlcih7IGRpc3BhdGNoLCB1c2VyLCB1c2VybmFtZSB9KSB7XG4gIC8vIHNhdmUgc2VsZWN0ZWQgdXNlciB0byBoYW5nb3V0c1xuICBjb25zdCBoYW5nb3V0ID0geyAuLi51c2VyLCBzdGF0ZTogJ0lOVklURScgfTtcbiAgY29uc3QgaGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGAke3VzZXJuYW1lfS1oYW5nb3V0c2ApKTtcblxuICBpZiAoaGFuZ291dHMpIHtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcbiAgICAgIGAke3VzZXJuYW1lfS1oYW5nb3V0c2AsXG4gICAgICBKU09OLnN0cmluZ2lmeShbLi4uaGFuZ291dHMsIGhhbmdvdXRdKVxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oYCR7dXNlcm5hbWV9LWhhbmdvdXRzYCwgSlNPTi5zdHJpbmdpZnkoW2hhbmdvdXRdKSk7XG4gIH1cblxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFTEVDVEVEX1VTRVIsIGhhbmdvdXQgfSk7XG59XG4vL3NlYXJjaCBmb3IgaGFuZ291dCBieSB0eXBpbmcgaW50byBUZXh0SW5wdXRcbmV4cG9ydCBmdW5jdGlvbiBzZWFyY2hIYW5nb3V0cyh7IHNlYXJjaCwgZGlzcGF0Y2ggfSkge1xuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFQVJDSEVEX0hBTkdPVVQsIHNlYXJjaCB9KTtcbn1cbi8vZmlsdGVyIGhhbmdvdXQgYWZ0ZXIgc2VhcmNoIHN0YXRlIGNoYW5nZVxuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlckhhbmdvdXRzKHsgZGlzcGF0Y2ggfSkge1xuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZJTFRFUl9IQU5HT1VUUyB9KTtcbn1cblxuLy9mZXRjaCBoYW5nb3V0IGZyb20gc2VydmVyIGlmIG5vdCBmb3VuZCBpbiBsb2NhbCBoYW5nb3V0c1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoSGFuZ291dCh7IHNlYXJjaCwgZGlzcGF0Y2gsIHVzZXJuYW1lIH0pIHtcbiAgdHJ5IHtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfU1RBUlRFRCB9KTtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxuICAgICAgYC9oYW5nb3V0cy9maW5kP3NlYXJjaD0ke3NlYXJjaH0mdXNlcm5hbWU9JHt1c2VybmFtZX1gXG4gICAgKTtcbiAgICBpZiAocmVzcG9uc2Uub2spIHtcbiAgICAgIGNvbnN0IHsgaGFuZ291dHMgfSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NVQ0NFU1MsIGhhbmdvdXRzIH0pO1xuICAgICAgXG4gICAgfSBcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zdCBlcnIgPSBlcnJvcjtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfRkFJTEVELCBlcnJvciB9KTtcbiAgfVxufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBjaGFuZ2VNZXNzYWdlVGV4dCh7IHRleHQsIGRpc3BhdGNoIH0pIHtcbiBcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5NRVNTQUdFX1RFWFRfQ0hBTkdFRCwgdGV4dCB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0YXJ0Q2xpZW50Q29tbWFuZCh7IGRpc3BhdGNoIH0pIHtcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5DTElFTlRfQ09NTUFORF9TVEFSVEVEIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbG9hZE1lc3NhZ2VzKHsgaGFuZ291dCwgZGlzcGF0Y2ggfSkge1xuICBjb25zdCB7IHVzZXJuYW1lIH0gPSBoYW5nb3V0O1xuICBjb25zdCBrZXkgPSBgJHt1c2VybmFtZX0tbWVzc2FnZXNgO1xuICBjb25zdCBtZXNzYWdlcyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KSk7XG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuTE9BREVEX01FU1NBR0VTLCBtZXNzYWdlcyB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVNZXNzYWdlKHsgIGRpc3BhdGNoLCBtZXNzYWdlLHVzZXJuYW1lLHRhcmdldCB9KSB7XG4gXG4gIGNvbnN0IGtleSA9IGAke3RhcmdldH0tbWVzc2FnZXNgO1xuICBjb25zdCBtZXNzYWdlcyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KSk7XG4gIGlmIChtZXNzYWdlcykge1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkoWy4uLm1lc3NhZ2VzLHsuLi5tZXNzYWdlLHVzZXJuYW1lfV0pKTtcbiAgfSBlbHNlIHtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KFt7Li4ubWVzc2FnZSx1c2VybmFtZX1dKSk7XG4gIH1cbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5TQVZFRF9NRVNTQUdFX0xPQ0FMTFksIG1lc3NhZ2UgfSk7XG59XG4iLCJpbXBvcnQgeyBoLCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7XG4gIHVzZUNvbnRleHQsXG4gIHVzZVN0YXRlLFxuICB1c2VNZW1vLFxuICB1c2VSZWR1Y2VyLFxuICB1c2VFZmZlY3QsXG59IGZyb20gJ3ByZWFjdC9ob29rcyc7XG5pbXBvcnQgeyByZWR1Y2VyLCBpbml0U3RhdGUgfSBmcm9tICcuL3JlZHVjZXInO1xuXG5pbXBvcnQge1xuICBsb2FkSGFuZ291dHMsXG4gIGZpbHRlckhhbmdvdXRzLFxuICBmZXRjaEhhbmdvdXQsXG4gIGxvYWRNZXNzYWdlcyxcbiAgc2F2ZU1lc3NhZ2UsXG59IGZyb20gJy4vYWN0aW9ucyc7XG5pbXBvcnQgeyB1c2VBdXRoQ29udGV4dCB9IGZyb20gJy4uLy4uL2F1dGgvYXV0aC1jb250ZXh0JztcbmNvbnN0IEhhbmdvdXRDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xuZXhwb3J0IGZ1bmN0aW9uIHVzZUhhbmdvdXRDb250ZXh0KCkge1xuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChIYW5nb3V0Q29udGV4dCk7XG4gIGlmICghY29udGV4dCkge1xuICAgIHRocm93IG5ldyBFcnJvcigndXNlSGFuZ291dENvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggSGFuZ291dHNQcm92aWRlcicpO1xuICB9XG5cbiAgcmV0dXJuIGNvbnRleHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBIYW5nb3V0c1Byb3ZpZGVyKHByb3BzKSB7XG4gIGNvbnN0IGF1dGhDb250ZXh0ID0gdXNlQXV0aENvbnRleHQoKTtcbiAgY29uc3QgeyB1c2VybmFtZSB9ID0gYXV0aENvbnRleHQuc3RhdGU7XG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlUmVkdWNlcihyZWR1Y2VyLCBpbml0U3RhdGUpO1xuICBjb25zdCB7IGhhbmdvdXQgfSA9IHN0YXRlO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKHVzZXJuYW1lKSB7XG4gICAgICBsb2FkSGFuZ291dHMoeyB1c2VybmFtZSwgZGlzcGF0Y2ggfSk7XG4gICAgfVxuICB9LCBbdXNlcm5hbWVdKTtcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoaGFuZ291dCkge1xuICAgICAgLy9mcm9tIGxvY2FsIHN0b3JhZ2VcbiAgICAgIGxvYWRNZXNzYWdlcyh7IGRpc3BhdGNoLCBoYW5nb3V0IH0pO1xuXG4gICAgICAvL3NhdmUgaGFuZ291dCB0byBsb2NhbFN0b3JhZ2VcbiAgICAgIGNvbnN0IGtleSA9IGAke3VzZXJuYW1lfS1oYW5nb3V0c2A7XG4gICAgICBjb25zdCBoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KSk7XG4gICAgICBpZiAoIWhhbmdvdXRzKSB7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkoW2hhbmdvdXRdKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBoYW5nb3V0RXhpc3QgPSBoYW5nb3V0cy5maW5kKFxuICAgICAgICAgIChnKSA9PiBnLnVzZXJuYW1lID09PSBoYW5nb3V0LnVzZXJuYW1lXG4gICAgICAgICk7XG4gICAgICAgIGlmIChoYW5nb3V0RXhpc3QpIHtcbiAgICAgICAgICBjb25zdCB1cGRhdGVkID0gaGFuZ291dHMubWFwKChnKSA9PiB7XG4gICAgICAgICAgICBpZiAoZy51c2VybmFtZSA9PT0gaGFuZ291dC51c2VybmFtZSkge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZ291dDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiBnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkodXBkYXRlZCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkoW2hhbmdvdXRdKSk7XG4gICAgICAgXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sIFtoYW5nb3V0XSk7XG5cbiAgY29uc3QgdmFsdWUgPSB1c2VNZW1vKCgpID0+IFtzdGF0ZSwgZGlzcGF0Y2hdLCBbc3RhdGVdKTtcbiAgcmV0dXJuIDxIYW5nb3V0Q29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30gLz47XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gdXBkYXRlTG9jYWxIYW5nb3V0cyh7IGhhbmdvdXQsIHVzZXJuYW1lIH0pIHtcbiAgICBjb25zdCBrZXkgPSBgJHt1c2VybmFtZX0taGFuZ291dHNgXG4gICAgY29uc3QgaGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSkpXG4gICAgaWYgKGhhbmdvdXRzKSB7XG4gICAgICAgIGNvbnN0IGhhbmdvdXRFeGlzdHMgPSBoYW5nb3V0cy5maW5kKGcgPT4gZy51c2VybmFtZSA9PT0gaGFuZ291dC51c2VybmFtZSlcbiAgICAgICAgaWYgKGhhbmdvdXRFeGlzdHMpIHtcbiAgICAgICAgICAgIGNvbnN0IHVwZGF0ZWRIYW5nb3V0ID0gaGFuZ291dHMubWFwKGcgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChnLnVzZXJuYW1lID09PSBoYW5nb3V0LnVzZXJuYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBoYW5nb3V0XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KHVwZGF0ZWRIYW5nb3V0KSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkoW2hhbmdvdXRzLCBoYW5nb3V0XSkpXG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkoW2hhbmdvdXRdKSlcbiAgICB9XG59IiwiaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcbmltcG9ydCB7IHVzZVdTb2NrZXRDb250ZXh0IH0gZnJvbSAnLi4vLi4vd3NvY2tldC9XU29ja2V0UHJvdmlkZXInO1xuaW1wb3J0IHsgaGFuZ291dFN0YXRlcyB9IGZyb20gJy4uLy4uLy4uL3NlcnZlci9oYW5nb3V0cy9oYW5nb3V0U3RhdGVzJztcbmltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi9hY3Rpb25UeXBlcyc7XG5pbXBvcnQgeyB1cGRhdGVMb2NhbEhhbmdvdXRzIH0gZnJvbSAnLi91cGRhdGVMb2NhbEhhbmdvdXRzJztcbmltcG9ydCB7IGNsaWVudENvbW1hbmRzIH0gZnJvbSAnLi9jbGllbnRDb21tYW5kcyc7XG5leHBvcnQgZnVuY3Rpb24gdXNlU29ja2V0KHsgZGlzcGF0Y2gsIHVzZXJuYW1lIH0pIHtcbiAgY29uc3Qgc29ja2V0Q29udGV4dCA9IHVzZVdTb2NrZXRDb250ZXh0KCk7XG4gIGNvbnN0IHsgc29ja2V0IH0gPSBzb2NrZXRDb250ZXh0WzBdO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKHNvY2tldCAmJiB1c2VybmFtZSkge1xuICAgICAgc29ja2V0Lm9ubWVzc2FnZSA9IChtZXNzYWdlKSA9PiB7XG4gICAgICAgIGNvbnN0IGhhbmdvdXQgPSBKU09OLnBhcnNlKG1lc3NhZ2UuZGF0YSk7XG4gICAgICAgIHVwZGF0ZUxvY2FsSGFuZ291dHMoeyBoYW5nb3V0LCB1c2VybmFtZSB9KTtcbiAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5IQU5HT1VUX1JFQ0lFVkVELCBoYW5nb3V0IH0pO1xuICAgICAgfTtcbiAgICAgIHNvY2tldC5vbmNsb3NlID0gKCkgPT4ge307XG4gICAgICBzb2NrZXQub25lcnJvciA9IChlcnJvcikgPT4ge307XG5cbiAgICAgIHNvY2tldC5vbm9wZW4gPSAoKSA9PiB7fTtcbiAgICB9XG4gIH0sIFtzb2NrZXQsIHVzZXJuYW1lXSk7XG5cbiAgcmV0dXJuIG51bGw7XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCB7IHVzZUhhbmdvdXRDb250ZXh0IH0gZnJvbSAnLi9IYW5nb3V0c1Byb3ZpZGVyJztcbmltcG9ydCB7IHVzZUF1dGhDb250ZXh0IH0gZnJvbSAnLi4vLi4vYXV0aC9hdXRoLWNvbnRleHQnO1xuaW1wb3J0IHsgdXNlV1NvY2tldENvbnRleHQgfSBmcm9tICcuLi8uLi93c29ja2V0L1dTb2NrZXRQcm92aWRlcic7XG5pbXBvcnQgeyB1cGRhdGVMb2NhbEhhbmdvdXRzIH0gZnJvbSAnLi91cGRhdGVMb2NhbEhhbmdvdXRzJ1xuaW1wb3J0IHtcbiAgc2VsZWN0SGFuZ291dCxcbiAgc2VhcmNoSGFuZ291dHMsXG4gIGZpbHRlckhhbmdvdXRzLFxuICBmZXRjaEhhbmdvdXQsXG4gIHNlbGVjdFVzZXIsXG4gIGNoYW5nZU1lc3NhZ2VUZXh0LFxuICBzdGFydENsaWVudENvbW1hbmQsXG4gIHNhdmVNZXNzYWdlLFxufSBmcm9tICcuL2FjdGlvbnMnO1xuaW1wb3J0IHsgdXNlU29ja2V0IH0gZnJvbSAnLi91c2VTb2NrZXQnO1xuaW1wb3J0IHsgY2xpZW50Q29tbWFuZHMgfSBmcm9tICcuL2NsaWVudENvbW1hbmRzJztcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUhhbmdvdXRzKCkge1xuICBjb25zdCBzb2NrZXRDb250ZXh0ID0gdXNlV1NvY2tldENvbnRleHQoKTtcbiAgY29uc3QgeyBzb2NrZXQgfSA9IHNvY2tldENvbnRleHRbMF1cbiAgY29uc3QgYXV0aENvbnRleHQgPSB1c2VBdXRoQ29udGV4dCgpO1xuICBjb25zdCB7IHVzZXJuYW1lIH0gPSBhdXRoQ29udGV4dC5zdGF0ZTtcbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSB1c2VIYW5nb3V0Q29udGV4dCgpO1xuICBjb25zdCB7IGhhbmdvdXQsIGhhbmdvdXRzLCBzZWFyY2gsIHVzZXJzLCBtZXNzYWdlVGV4dCwgbWVzc2FnZXMgfSA9IHN0YXRlO1xuICBjb25zdCBoYW5kbGVTb2NrZXQgPSB1c2VTb2NrZXQoeyBkaXNwYXRjaCwgaGFuZ291dCwgdXNlcm5hbWUgfSk7XG4gIGZ1bmN0aW9uIG9uU2VsZWN0SGFuZ291dChlKSB7XG4gICAgY29uc3QgdXNlcm5hbWUgPSBlLnRhcmdldC5pZDtcbiAgICBzZWxlY3RIYW5nb3V0KHsgZGlzcGF0Y2gsIHVzZXJuYW1lIH0pO1xuICB9XG4gIGZ1bmN0aW9uIG9uU2VsZWN0VXNlcihlKSB7XG4gICAgY29uc3QgdW5hbWUgPSBlLnRhcmdldC5pZDtcbiAgICBjb25zdCB1c2VyID0gdXNlcnMuZmluZCgodSkgPT4gdS51c2VybmFtZSA9PT0gdW5hbWUpO1xuICAgIHNlbGVjdFVzZXIoeyBkaXNwYXRjaCwgdXNlciwgdXNlcm5hbWUgfSk7XG4gIH1cbiAgZnVuY3Rpb24gb25TZWFyY2goZSkge1xuICAgIHNlYXJjaEhhbmdvdXRzKHsgc2VhcmNoOiBlLnRhcmdldC52YWx1ZSwgZGlzcGF0Y2ggfSk7XG4gIH1cbiAgZnVuY3Rpb24gb25TdGFydFNlYXJjaChlKSB7XG4gICAgaWYgKGhhbmdvdXRzICYmIGhhbmdvdXRzLmxlbmd0aCA+IDApIHtcbiAgICAgIGZpbHRlckhhbmdvdXRzKHsgZGlzcGF0Y2ggfSk7XG4gICAgfVxuICAgIGZldGNoSGFuZ291dCh7IGRpc3BhdGNoLCBzZWFyY2gsIHVzZXJuYW1lIH0pO1xuICB9XG4gIGZ1bmN0aW9uIG9uTWVzc2FnZVRleHQoZSkge1xuICAgIGNvbnN0IHRleHQgPSBlLnRhcmdldC52YWx1ZVxuICAgIGNoYW5nZU1lc3NhZ2VUZXh0KHsgZGlzcGF0Y2gsIHRleHQgfSk7XG4gIH1cbiAgZnVuY3Rpb24gb25IYW5nb3V0KGUpIHtcbiAgXG4gICAgY29uc3QgY29tbWFuZCA9IGUudGFyZ2V0LmlkXG4gICAgY29uc3QgeyB1c2VybmFtZSwgZW1haWwgfSA9IGhhbmdvdXQ7XG4gICAgbGV0IG1lc3NhZ2UgPSBudWxsXG4gICAgaWYgKG1lc3NhZ2VUZXh0KSB7XG4gICAgICBtZXNzYWdlID0geyB0ZXh0OiBtZXNzYWdlVGV4dCwgdGltZXN0YW1wOiBEYXRlLm5vdygpIH07XG4gICAgICBzYXZlTWVzc2FnZSh7IGRpc3BhdGNoLCBoYW5nb3V0LCBtZXNzYWdlLCB0YXJnZXQ6IHVzZXJuYW1lLCB1c2VybmFtZTogYXV0aENvbnRleHQuc3RhdGUudXNlcm5hbWUgfSk7XG4gICAgfVxuICAgIGNvbnN0IHVwZGF0ZWRIYW5nb3V0ID0ge1xuICAgICAgdXNlcm5hbWUsXG4gICAgICBlbWFpbCxcbiAgICAgIG1lc3NhZ2UsXG4gICAgfTtcbiAgICBzb2NrZXQuc2VuZChcbiAgICAgIEpTT04uc3RyaW5naWZ5KHsgLi4udXBkYXRlZEhhbmdvdXQsIGNvbW1hbmQgfSlcbiAgICApO1xuICAgIHVwZGF0ZUxvY2FsSGFuZ291dHMoeyBoYW5nb3V0LCB1c2VybmFtZSwgZGV2aXZlcmVkOiAncGVuZGluZycgfSlcbiAgfVxuICByZXR1cm4ge1xuICAgIG9uTWVzc2FnZVRleHQsXG4gICAgbWVzc2FnZVRleHQsXG4gICAgb25TdGFydFNlYXJjaCxcbiAgICBvblNlYXJjaCxcbiAgICBzZWFyY2gsXG4gICAgb25TZWxlY3RIYW5nb3V0LFxuICAgIG9uU2VsZWN0VXNlcixcbiAgICBoYW5nb3V0LFxuICAgIGhhbmdvdXRzLFxuICAgIHVzZXJzLFxuICAgIHVzZXJuYW1lLFxuICAgIG1lc3NhZ2VzLFxuICAgIG9uSGFuZ291dFxuICB9O1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xuaW1wb3J0IHsgbGF6eSwgU3VzcGVuc2UgfSBmcm9tICdwcmVhY3QvY29tcGF0JztcbmltcG9ydCB7IFJvdXRlLCB1c2VSb3V0ZUNvbnRleHQgfSBmcm9tICcuLi9yb3V0ZS9yb3V0ZXInO1xuXG5pbXBvcnQgeyB1c2VIYW5nb3V0cyB9IGZyb20gJy4vc3RhdGUvdXNlSGFuZ291dHMnO1xuY29uc3QgSGFuZ291dHMgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9IYW5nb3V0JykpO1xuY29uc3QgQmxvY2sgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9zdGF0ZS11aS9CbG9jaycpKTtcbmNvbnN0IEJsb2NrZWQgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9zdGF0ZS11aS9CbG9ja2VkJykpO1xuY29uc3QgQ29uZmlndXJlID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vc3RhdGUtdWkvQ29uZmlndXJlJykpO1xuY29uc3QgSGFuZ2NoYXQgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9zdGF0ZS11aS9IYW5nY2hhdCcpKTtcbmNvbnN0IEludml0ZSA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL3N0YXRlLXVpL0ludml0ZScpKTtcbmNvbnN0IEludml0ZWUgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9zdGF0ZS11aS9JbnZpdGVlJykpO1xuY29uc3QgSW52aXRlciA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL3N0YXRlLXVpL0ludml0ZXInKSk7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE1vYmlsZSgpIHtcbiAgY29uc3QgW3JvdXRlLCBzZXRSb3V0ZV0gPSB1c2VSb3V0ZUNvbnRleHQoKTtcbiAgY29uc3Qge1xuICAgIGhhbmdvdXQsXG4gICAgaGFuZ291dHMsXG4gICAgb25IYW5nb3V0LFxuICAgIG9uU2VsZWN0SGFuZ291dCxcbiAgICBvblNlbGVjdFVzZXIsXG4gICAgb25TZWFyY2gsXG4gICAgdXNlcnMsXG4gICAgc2VhcmNoLFxuICAgIG9uU3RhcnRTZWFyY2gsXG4gICAgb25NZXNzYWdlVGV4dCxcbiAgICBtZXNzYWdlVGV4dCxcbiAgICB1c2VybmFtZSxcbiAgICBtZXNzYWdlc1xuICB9ID0gdXNlSGFuZ291dHMoKTtcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoaGFuZ291dCkge1xuICAgICAgc2V0Um91dGUoYC8ke2hhbmdvdXQuc3RhdGV9YCk7XG4gICAgfVxuICB9LCBbaGFuZ291dF0pO1xuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3sgaGVpZ2h0OiAnODV2aCcgfX0+XG4gICAgICA8Um91dGUgcGF0aD1cIi9oYW5nb3V0c1wiPlxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+TG9hZGluZy4uLjwvZGl2Pn0+XG4gICAgICAgICAgPEhhbmdvdXRzXG4gICAgICAgICAgICB1c2Vycz17dXNlcnN9XG4gICAgICAgICAgICBzZWFyY2g9e3NlYXJjaH1cbiAgICAgICAgICAgIGhhbmdvdXRzPXtoYW5nb3V0c31cbiAgICAgICAgICAgIG9uU2VsZWN0SGFuZ291dD17b25TZWxlY3RIYW5nb3V0fVxuICAgICAgICAgICAgb25TZWxlY3RVc2VyPXtvblNlbGVjdFVzZXJ9XG4gICAgICAgICAgICBvblNlYXJjaD17b25TZWFyY2h9XG4gICAgICAgICAgICBvblN0YXJ0U2VhcmNoPXtvblN0YXJ0U2VhcmNofVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvU3VzcGVuc2U+XG4gICAgICA8L1JvdXRlPlxuICAgICAgPFJvdXRlIHBhdGg9XCIvQkxPQ0tcIj5cbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxuICAgICAgICAgIDxCbG9jayBoYW5nb3V0PXtoYW5nb3V0fSBvbkJsb2NrPXtvbkhhbmdvdXR9IC8+XG4gICAgICAgIDwvU3VzcGVuc2U+XG4gICAgICA8L1JvdXRlPlxuICAgICAgPFJvdXRlIHBhdGg9XCIvQkxPQ0tFRFwiPlxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+TG9hZGluZy4uLjwvZGl2Pn0+XG4gICAgICAgICAgPEJsb2NrZWQgaGFuZ291dD17aGFuZ291dH0gb25VbmJsb2NrPXtvbkhhbmdvdXR9IC8+XG4gICAgICAgIDwvU3VzcGVuc2U+XG4gICAgICA8L1JvdXRlPlxuICAgICAgPFJvdXRlIHBhdGg9XCIvY29uZmlndXJlXCI+XG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cbiAgICAgICAgICA8Q29uZmlndXJlIGhhbmdvdXQ9e2hhbmdvdXR9IC8+XG4gICAgICAgIDwvU3VzcGVuc2U+XG4gICAgICA8L1JvdXRlPlxuICAgICAgPFJvdXRlIHBhdGhzPXtbXCIvQUNDRVBURURcIixcIi9BQ0NFUFRFUlwiLFwiL01FU1NBTkdFUlwiLFwiL01FU1NBR0VEXCJdfT5cbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxuICAgICAgICAgIDxIYW5nY2hhdFxuICAgICAgICAgICAgb25NZXNzYWdlVGV4dD17b25NZXNzYWdlVGV4dH1cbiAgICAgICAgICAgIG9uTWVzc2FnZT17b25IYW5nb3V0fVxuICAgICAgICAgICAgbWVzc2FnZXM9e21lc3NhZ2VzfVxuICAgICAgICAgICAgdXNlcm5hbWU9e3VzZXJuYW1lfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvU3VzcGVuc2U+XG4gICAgICA8L1JvdXRlPlxuICAgIFxuICAgICAgPFJvdXRlIHBhdGg9XCIvSU5WSVRFXCI+XG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cbiAgICAgICAgICA8SW52aXRlXG4gICAgICAgICAgICBoYW5nb3V0PXtoYW5nb3V0fVxuICAgICAgICAgICAgb25JbnZpdGU9e29uSGFuZ291dH1cbiAgICAgICAgICAgIG9uTWVzc2FnZVRleHQ9e29uTWVzc2FnZVRleHR9XG4gICAgICAgICAgICBtZXNzYWdlVGV4dD17bWVzc2FnZVRleHR9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9TdXNwZW5zZT5cbiAgICAgIDwvUm91dGU+XG4gICAgICA8Um91dGUgcGF0aD1cIi9JTlZJVEVEXCI+XG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cbiAgICAgICAgICA8SW52aXRlZSBoYW5nb3V0PXtoYW5nb3V0fSAvPlxuICAgICAgICA8L1N1c3BlbnNlPlxuICAgICAgPC9Sb3V0ZT5cbiAgICAgIDxSb3V0ZSBwYXRoPVwiL0lOVklURVJcIj5cbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxuICAgICAgICAgIDxJbnZpdGVyIGhhbmdvdXQ9e2hhbmdvdXR9IG9uQWNjZXB0PXtvbkhhbmdvdXR9IC8+XG4gICAgICAgIDwvU3VzcGVuc2U+XG4gICAgICA8L1JvdXRlPlxuICAgIDwvZGl2PlxuICApO1xufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCBNb2JpbGUgZnJvbSAnLi9tb2JpbGUnO1xyXG5pbXBvcnQgeyBIYW5nb3V0c1Byb3ZpZGVyIH0gZnJvbSAnLi9zdGF0ZS9IYW5nb3V0c1Byb3ZpZGVyJztcclxuaW1wb3J0IHsgUm91dGVQcm92aWRlciwgdXNlUm91dGVDb250ZXh0IH0gZnJvbSAnLi4vcm91dGUvcm91dGVyJztcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8SGFuZ291dHNQcm92aWRlcj5cclxuICAgICAgPFJvdXRlUHJvdmlkZXIgaW5pdGlhbFJvdXRlPVwiL2hhbmdvdXRzXCI+XHJcbiAgICAgICAgPE1vYmlsZSAvPlxyXG4gICAgICA8L1JvdXRlUHJvdmlkZXI+XHJcbiAgICA8L0hhbmdvdXRzUHJvdmlkZXI+XHJcbiAgKTtcclxufVxyXG4iXSwibmFtZXMiOlsiYWN0aW9uVHlwZXMiLCJNRVNTQUdFX1RFWFRfQ0hBTkdFRCIsIkxPQURfSEFOR09VVFMiLCJMT0FERURfTUVTU0FHRVMiLCJTQVZFRF9NRVNTQUdFX0xPQ0FMTFkiLCJTRUFSQ0hFRF9IQU5HT1VUIiwiU0VMRUNURURfSEFOR09VVCIsIkZFVENIX0hBTkdPVVRfU1RBUlRFRCIsIkZFVENIX0hBTkdPVVRfU1VDQ0VTUyIsIkZFVENIX0hBTkdPVVRfRkFJTEVEIiwiT05MSU5FX1NUQVRFX0NIQU5HRUQiLCJIQU5HT1VUX1JFQ0lFVkVEIiwiSEFOR09VVF9TRU5UIiwiaW5pdFN0YXRlIiwiaGFuZ291dHMiLCJoYW5nb3V0IiwibWVzc2FnZXMiLCJzZWFyY2giLCJ1c2VyIiwibG9hZGluZyIsImVycm9yIiwibWVzc2FnZVRleHQiLCJvbmxpbmUiLCJyZWR1Y2VyIiwic3RhdGUiLCJhY3Rpb24iLCJ0eXBlIiwibWVzc2FnZSIsInRleHQiLCJGRVRDSF9VU0VSX0ZBSUxFRCIsIkZFVENIX1VTRVJfU1RBUlRFRCIsIkZFVENIX1VTRVJfU1VDQ0VTUyIsInVzZXJzIiwiSEFOR09VVF9OT1RfRk9VTkQiLCJGSUxURVJfSEFOR09VVFMiLCJmaWx0ZXIiLCJnIiwidXNlcm5hbWUiLCJpbmNsdWRlcyIsIlNFTEVDVEVEX1VTRVIiLCJmaW5kIiwidXBkYXRlSGFuZ291dCIsImhhbmdvdXRFeGlzdHMiLCJtYXAiLCJsb2FkSGFuZ291dHMiLCJkaXNwYXRjaCIsIkpTT04iLCJwYXJzZSIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJzZWxlY3RIYW5nb3V0Iiwic2VsZWN0VXNlciIsInNldEl0ZW0iLCJzdHJpbmdpZnkiLCJzZWFyY2hIYW5nb3V0cyIsImZpbHRlckhhbmdvdXRzIiwiZmV0Y2hIYW5nb3V0IiwicmVzcG9uc2UiLCJmZXRjaCIsIm9rIiwianNvbiIsImNoYW5nZU1lc3NhZ2VUZXh0IiwibG9hZE1lc3NhZ2VzIiwia2V5Iiwic2F2ZU1lc3NhZ2UiLCJ0YXJnZXQiLCJIYW5nb3V0Q29udGV4dCIsImNyZWF0ZUNvbnRleHQiLCJ1c2VIYW5nb3V0Q29udGV4dCIsImNvbnRleHQiLCJ1c2VDb250ZXh0IiwiRXJyb3IiLCJIYW5nb3V0c1Byb3ZpZGVyIiwicHJvcHMiLCJhdXRoQ29udGV4dCIsInVzZUF1dGhDb250ZXh0IiwidXNlUmVkdWNlciIsInVzZUVmZmVjdCIsImhhbmdvdXRFeGlzdCIsInVwZGF0ZWQiLCJ2YWx1ZSIsInVzZU1lbW8iLCJoIiwidXBkYXRlTG9jYWxIYW5nb3V0cyIsInVwZGF0ZWRIYW5nb3V0IiwidXNlU29ja2V0Iiwic29ja2V0Q29udGV4dCIsInVzZVdTb2NrZXRDb250ZXh0Iiwic29ja2V0Iiwib25tZXNzYWdlIiwiZGF0YSIsIm9uY2xvc2UiLCJvbmVycm9yIiwib25vcGVuIiwidXNlSGFuZ291dHMiLCJoYW5kbGVTb2NrZXQiLCJvblNlbGVjdEhhbmdvdXQiLCJlIiwiaWQiLCJvblNlbGVjdFVzZXIiLCJ1bmFtZSIsInUiLCJvblNlYXJjaCIsIm9uU3RhcnRTZWFyY2giLCJsZW5ndGgiLCJvbk1lc3NhZ2VUZXh0Iiwib25IYW5nb3V0IiwiY29tbWFuZCIsImVtYWlsIiwidGltZXN0YW1wIiwiRGF0ZSIsIm5vdyIsInNlbmQiLCJkZXZpdmVyZWQiLCJIYW5nb3V0cyIsImxhenkiLCJCbG9jayIsIkJsb2NrZWQiLCJDb25maWd1cmUiLCJIYW5nY2hhdCIsIkludml0ZSIsIkludml0ZWUiLCJJbnZpdGVyIiwiTW9iaWxlIiwicm91dGUiLCJzZXRSb3V0ZSIsInVzZVJvdXRlQ29udGV4dCIsImhlaWdodCIsIlN1c3BlbnNlIl0sIm1hcHBpbmdzIjoiOztBQUFPLE1BQU1BLFdBQVcsR0FBRztBQUV2QkMsRUFBQUEsb0JBQW9CLEVBQUMsc0JBRkU7QUFJdkJDLEVBQUFBLGFBQWEsRUFBRSxlQUpRO0FBS3ZCQyxFQUFBQSxlQUFlLEVBQUUsaUJBTE07QUFNdkJDLEVBQUFBLHFCQUFxQixFQUFDLHVCQU5DO0FBT3ZCQyxFQUFBQSxnQkFBZ0IsRUFBRSxrQkFQSztBQVF2QkMsRUFBQUEsZ0JBQWdCLEVBQUUsa0JBUks7QUFVdkJDLEVBQUFBLHFCQUFxQixFQUFFLHVCQVZBO0FBV3ZCQyxFQUFBQSxxQkFBcUIsRUFBRSx1QkFYQTtBQVl2QkMsRUFBQUEsb0JBQW9CLEVBQUUsc0JBWkM7QUFjdkJDLEVBQUFBLG9CQUFvQixFQUFFLHNCQWRDO0FBZ0J2QkMsRUFBQUEsZ0JBQWdCLEVBQUMsa0JBaEJNO0FBaUJ2QkMsRUFBQUEsWUFBWSxFQUFDO0FBakJVLENBQXBCOztBQ0NBLE1BQU1DLFNBQVMsR0FBRztBQUN2QkMsRUFBQUEsUUFBUSxFQUFFLElBRGE7QUFFdkJDLEVBQUFBLE9BQU8sRUFBRSxJQUZjO0FBR3ZCQyxFQUFBQSxRQUFRLEVBQUUsSUFIYTtBQUl2QkMsRUFBQUEsTUFBTSxFQUFFLEVBSmU7QUFLdkJDLEVBQUFBLElBQUksRUFBRSxFQUxpQjtBQU12QkMsRUFBQUEsT0FBTyxFQUFFLEtBTmM7QUFPdkJDLEVBQUFBLEtBQUssRUFBRSxJQVBnQjtBQVF2QkMsRUFBQUEsV0FBVyxFQUFFLEVBUlU7QUFTdkJDLEVBQUFBLE1BQU0sRUFB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
