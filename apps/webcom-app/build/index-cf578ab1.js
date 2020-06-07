import { M, u as useAuthContext, m, p, s, h, _ as _extends, T, a as useWSocketContext, b as useRouteContext, R as Route, U, L, c as RouteProvider } from './index-76b78df2.js';

const actionTypes = {
  MESSAGE_TEXT_CHANGED: 'MESSAGE_TEXT_CHANGED',
  LOAD_HANGOUTS: 'LOAD_HANGOUTS',
  LOADED_MESSAGES: 'LOADED_MESSAGES',
  SAVED_MESSAGE_LOCALLY: 'SAVED_MESSAGE_LOCALLY',
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
  const {
    hangout
  } = state;
  p(() => {
    if (username) {
      loadHangouts({
        username,
        dispatch
      });
    }
  }, [username]);
  p(() => {
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
  const value = s(() => [state, dispatch], [state]);
  return h(HangoutContext.Provider, _extends({
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
  p(() => {
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

const Hangouts = L(() => import('./Hangout-bcd08381.js'));
const Block = L(() => import('./Block-a3d9472c.js'));
const Blocked = L(() => import('./Blocked-2008730a.js'));
const Configure = L(() => import('./Configure-0e4c657c.js'));
const Hangchat = L(() => import('./Hangchat-2194eecf.js'));
const Invite = L(() => import('./Invite-e5908896.js'));
const Invitee = L(() => import('./Invitee-68746c9b.js'));
const Inviter = L(() => import('./Inviter-f3cc1a4f.js'));
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
    onBlock: onHangout
  }))), h(Route, {
    path: "/BLOCKED"
  }, h(U, {
    fallback: h("div", null, "Loading...")
  }, h(Blocked, {
    hangout: hangout,
    onUnblock: onHangout
  }))), h(Route, {
    path: "/configure"
  }, h(U, {
    fallback: h("div", null, "Loading...")
  }, h(Configure, {
    hangout: hangout
  }))), h(Route, {
    paths: ["/ACCEPTED", "/ACCEPTER", "/MESSANGER", "/MESSAGED"]
  }, h(U, {
    fallback: h("div", null, "Loading...")
  }, h(Hangchat, {
    onMessageText: onMessageText,
    onMessage: onHangout,
    messages: messages,
    username: username
  }))), h(Route, {
    path: "/INVITE"
  }, h(U, {
    fallback: h("div", null, "Loading...")
  }, h(Invite, {
    hangout: hangout,
    onInvite: onHangout,
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
    onAccept: onHangout
  }))));
}

function index () {
  return h(HangoutsProvider, null, h(RouteProvider, {
    initialRoute: "/hangouts"
  }, h(Mobile, null)));
}

export default index;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtY2Y1NzhhYjEuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9hY3Rpb25UeXBlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS9yZWR1Y2VyLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL2FjdGlvbnMuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvc3RhdGUvSGFuZ291dHNQcm92aWRlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS91cGRhdGVMb2NhbEhhbmdvdXRzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2hhbmdvdXRzL3N0YXRlL3VzZVNvY2tldC5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9zdGF0ZS91c2VIYW5nb3V0cy5qcyIsIi4uLy4uLy4uL2NsaWVudC9oYW5nb3V0cy9tb2JpbGUuanMiLCIuLi8uLi8uLi9jbGllbnQvaGFuZ291dHMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IGFjdGlvblR5cGVzID0ge1xyXG4gICAgTUVTU0FHRV9URVhUX0NIQU5HRUQ6J01FU1NBR0VfVEVYVF9DSEFOR0VEJyxcclxuICAgIExPQURfSEFOR09VVFM6ICdMT0FEX0hBTkdPVVRTJyxcclxuICAgIExPQURFRF9NRVNTQUdFUzogJ0xPQURFRF9NRVNTQUdFUycsXHJcbiAgICBTQVZFRF9NRVNTQUdFX0xPQ0FMTFk6J1NBVkVEX01FU1NBR0VfTE9DQUxMWScsXHJcbiAgICBTRUFSQ0hFRF9IQU5HT1VUOiAnU0VBUkNIRURfSEFOR09VVCcsXHJcbiAgICBTRUxFQ1RFRF9IQU5HT1VUOiAnU0VMRUNURURfSEFOR09VVCcsXHJcbiAgICBTRUxFQ1RFRF9VU0VSOidTRUxFQ1RFRF9VU0VSJyxcclxuICAgIEZJTFRFUl9IQU5HT1VUUzonRklMVEVSX0hBTkdPVVRTJyxcclxuXHJcbiAgICBGRVRDSF9IQU5HT1VUX1NUQVJURUQ6ICdGRVRDSF9IQU5HT1VUX1NUQVJURUQnLFxyXG4gICAgRkVUQ0hfSEFOR09VVF9TVUNDRVNTOiAnRkVUQ0hfSEFOR09VVF9TVUNDRVNTJyxcclxuICAgIEZFVENIX0hBTkdPVVRfRkFJTEVEOiAnRkVUQ0hfSEFOR09VVF9GQUlMRUQnLFxyXG4gICAgRkVUQ0hfSEFOR09VVF9OT1RfRk9VTkQ6ICdGRVRDSF9IQU5HT1VUX05PVF9GT1VORCcsXHJcblxyXG4gICAgRkVUQ0hfVVNFUl9TVEFSVEVEOiAnRkVUQ0hfVVNFUl9TVEFSVEVEJyxcclxuICAgIEZFVENIX1VTRVJfU1VDQ0VTUzogJ0ZFVENIX1VTRVJfU1VDQ0VTUycsXHJcbiAgICBGRVRDSF9VU0VSX0ZBSUxFRDogJ0ZFVENIX1VTRVJfRkFJTEVEJyxcclxuICAgIE9OTElORV9TVEFURV9DSEFOR0VEOiAnT05MSU5FX1NUQVRFX0NIQU5HRUQnLFxyXG4gICAgXHJcbiAgICBIQU5HT1VUX1JFQ0lFVkVEOidIQU5HT1VUX1JFQ0lFVkVEJyxcclxuICAgIEhBTkdPVVRfU0VOVDonSEFOR09VVF9TRU5UJ1xyXG5cclxufSIsImltcG9ydCB7IGFjdGlvblR5cGVzIH0gZnJvbSAnLi9hY3Rpb25UeXBlcyc7XHJcbmV4cG9ydCBjb25zdCBpbml0U3RhdGUgPSB7XHJcbiAgaGFuZ291dHM6IG51bGwsXHJcbiAgaGFuZ291dDogbnVsbCxcclxuICBtZXNzYWdlczogbnVsbCxcclxuICBzZWFyY2g6ICcnLFxyXG4gIHVzZXI6IFtdLFxyXG4gIGxvYWRpbmc6IGZhbHNlLFxyXG4gIGVycm9yOiBudWxsLFxyXG4gIG1lc3NhZ2VUZXh0OiAnJyxcclxuICBvbmxpbmU6IGZhbHNlLFxyXG59O1xyXG5leHBvcnQgZnVuY3Rpb24gcmVkdWNlcihzdGF0ZSwgYWN0aW9uKSB7XHJcbiAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TQVZFRF9NRVNTQUdFX0xPQ0FMTFk6XHJcbiAgICAgIGlmIChzdGF0ZS5tZXNzYWdlcykge1xyXG4gICAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBtZXNzYWdlczogWy4uLnN0YXRlLm1lc3NhZ2VzLCBhY3Rpb24ubWVzc2FnZV0gfTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbWVzc2FnZXM6IFthY3Rpb24ubWVzc2FnZV0gfTtcclxuICAgICAgfVxyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5MT0FERURfTUVTU0FHRVM6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBtZXNzYWdlczogYWN0aW9uLm1lc3NhZ2VzIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLk1FU1NBR0VfVEVYVF9DSEFOR0VEOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbWVzc2FnZVRleHQ6IGFjdGlvbi50ZXh0IH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX1VTRVJfRkFJTEVEOlxyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX0ZBSUxFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBlcnJvcjogYWN0aW9uLmVycm9yIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX1VTRVJfU1RBUlRFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IHRydWUgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuRkVUQ0hfVVNFUl9TVUNDRVNTOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIGxvYWRpbmc6IGZhbHNlLFxyXG4gICAgICAgIHVzZXJzOiBhY3Rpb24udXNlcnMsXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfU1RBUlRFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IHRydWUgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9TVUNDRVNTOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UsIGhhbmdvdXRzOiBhY3Rpb24uaGFuZ291dHMgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuSEFOR09VVF9OT1RfRk9VTkQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiBmYWxzZSB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GSUxURVJfSEFOR09VVFM6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgaGFuZ291dHM6IHN0YXRlLmhhbmdvdXRzLmZpbHRlcigoZykgPT5cclxuICAgICAgICAgIGcudXNlcm5hbWUuaW5jbHVkZXMoc3RhdGUuc2VhcmNoKVxyXG4gICAgICAgICksXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNFQVJDSEVEX0hBTkdPVVQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBzZWFyY2g6IGFjdGlvbi5zZWFyY2ggfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuTE9BRF9IQU5HT1VUUzpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGhhbmdvdXRzOiBhY3Rpb24uaGFuZ291dHMgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0VMRUNURURfVVNFUjpcclxuICAgICAgaWYgKHN0YXRlLmhhbmdvdXRzKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgICAgaGFuZ291dHM6IFsuLi5zdGF0ZS5oYW5nb3V0cywgYWN0aW9uLmhhbmdvdXRdLFxyXG4gICAgICAgICAgaGFuZ291dDogYWN0aW9uLmhhbmdvdXQsXHJcbiAgICAgICAgfTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIGhhbmdvdXRzOiBbYWN0aW9uLmhhbmdvdXRdLFxyXG4gICAgICAgIGhhbmdvdXQ6IGFjdGlvbi5oYW5nb3V0LFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5TRUxFQ1RFRF9IQU5HT1VUOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIGhhbmdvdXQ6IHN0YXRlLmhhbmdvdXRzLmZpbmQoKGcpID0+IGcudXNlcm5hbWUgPT09IGFjdGlvbi51c2VybmFtZSksXHJcbiAgICAgIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkhBTkdPVVRfUkVDSUVWRUQ6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgaGFuZ291dDogYWN0aW9uLmhhbmdvdXQsXHJcbiAgICAgICAgaGFuZ291dHM6IHVwZGF0ZUhhbmdvdXQoeyBoYW5nb3V0czogc3RhdGUuaGFuZ291dHMsIGhhbmdvdXQ6IGFjdGlvbi5oYW5nb3V0IH0pXHJcbiAgICAgIH07XHJcblxyXG4gICAgZGVmYXVsdDpcclxuICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gIH1cclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiB1cGRhdGVIYW5nb3V0KHsgaGFuZ291dCwgaGFuZ291dHMgfSkge1xyXG5cclxuICBpZiAoaGFuZ291dHMpIHtcclxuICAgIGNvbnN0IGhhbmdvdXRFeGlzdHMgPSBoYW5nb3V0cy5maW5kKGcgPT4gZy51c2VybmFtZSA9PT0gaGFuZ291dC51c2VybmFtZSlcclxuICAgIGlmIChoYW5nb3V0RXhpc3RzKSB7XHJcbiAgICAgIHJldHVybiBoYW5nb3V0cy5tYXAoZyA9PiB7XHJcbiAgICAgICAgaWYgKGcudXNlcm5hbWUgPT09IGhhbmdvdXQudXNlcm5hbWUpIHtcclxuICAgICAgICAgIHJldHVybiBoYW5nb3V0XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgcmV0dXJuIGdcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gW2hhbmdvdXRzLCBoYW5nb3V0XVxyXG4gICAgfVxyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHJldHVybiBbaGFuZ291dHMsIGhhbmdvdXRdXHJcbiAgfVxyXG59IiwiaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuL2FjdGlvblR5cGVzJztcclxuXHJcbi8vcmV0cmlldmVzIGhhbmdvdXRzIGZyb20gbG9jYWxTdG9yYWdlXHJcbmV4cG9ydCBmdW5jdGlvbiBsb2FkSGFuZ291dHMoeyB1c2VybmFtZSwgZGlzcGF0Y2ggfSkge1xyXG4gIGNvbnN0IGhhbmdvdXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShgJHt1c2VybmFtZX0taGFuZ291dHNgKSk7XHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5MT0FEX0hBTkdPVVRTLCBoYW5nb3V0cyB9KTtcclxufVxyXG4vL3NlbGVjdCBoYW5nb3V0IGZyb20gTGlzdFxyXG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0SGFuZ291dCh7IGRpc3BhdGNoLCB1c2VybmFtZSB9KSB7XHJcblxyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VMRUNURURfSEFOR09VVCwgdXNlcm5hbWUgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZWxlY3RVc2VyKHsgZGlzcGF0Y2gsIHVzZXIsIHVzZXJuYW1lIH0pIHtcclxuICAvLyBzYXZlIHNlbGVjdGVkIHVzZXIgdG8gaGFuZ291dHNcclxuICBjb25zdCBoYW5nb3V0ID0geyAuLi51c2VyLCBzdGF0ZTogJ0lOVklURScgfTtcclxuICBjb25zdCBoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oYCR7dXNlcm5hbWV9LWhhbmdvdXRzYCkpO1xyXG5cclxuICBpZiAoaGFuZ291dHMpIHtcclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFxyXG4gICAgICBgJHt1c2VybmFtZX0taGFuZ291dHNgLFxyXG4gICAgICBKU09OLnN0cmluZ2lmeShbLi4uaGFuZ291dHMsIGhhbmdvdXRdKVxyXG4gICAgKTtcclxuICB9IGVsc2Uge1xyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oYCR7dXNlcm5hbWV9LWhhbmdvdXRzYCwgSlNPTi5zdHJpbmdpZnkoW2hhbmdvdXRdKSk7XHJcbiAgfVxyXG5cclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLlNFTEVDVEVEX1VTRVIsIGhhbmdvdXQgfSk7XHJcbn1cclxuLy9zZWFyY2ggZm9yIGhhbmdvdXQgYnkgdHlwaW5nIGludG8gVGV4dElucHV0XHJcbmV4cG9ydCBmdW5jdGlvbiBzZWFyY2hIYW5nb3V0cyh7IHNlYXJjaCwgZGlzcGF0Y2ggfSkge1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VBUkNIRURfSEFOR09VVCwgc2VhcmNoIH0pO1xyXG59XHJcbi8vZmlsdGVyIGhhbmdvdXQgYWZ0ZXIgc2VhcmNoIHN0YXRlIGNoYW5nZVxyXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVySGFuZ291dHMoeyBkaXNwYXRjaCB9KSB7XHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GSUxURVJfSEFOR09VVFMgfSk7XHJcbn1cclxuXHJcbi8vZmV0Y2ggaGFuZ291dCBmcm9tIHNlcnZlciBpZiBub3QgZm91bmQgaW4gbG9jYWwgaGFuZ291dHNcclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoSGFuZ291dCh7IHNlYXJjaCwgZGlzcGF0Y2gsIHVzZXJuYW1lIH0pIHtcclxuICB0cnkge1xyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX1NUQVJURUQgfSk7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxyXG4gICAgICBgL2hhbmdvdXRzL2ZpbmQ/c2VhcmNoPSR7c2VhcmNofSZ1c2VybmFtZT0ke3VzZXJuYW1lfWBcclxuICAgICk7XHJcbiAgICBpZiAocmVzcG9uc2Uub2spIHtcclxuICAgICAgY29uc3QgeyBoYW5nb3V0cyB9ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICBpZiAoaGFuZ291dHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfSEFOR09VVF9TVUNDRVNTLCBoYW5nb3V0cyB9KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfTk9UX0ZPVU5EIH0pO1xyXG4gICAgICAgIC8vIGZldGNoIHVzZXIgZnJvbSBzZXJ2ZXIgaW4gaGFuZ291dCBpcyBuZXd1c2VyXHJcbiAgICAgICAgZmV0Y2hVc2VyKHsgc2VhcmNoLCBkaXNwYXRjaCB9KTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9IQU5HT1VUX05PVF9GT1VORCB9KTtcclxuICAgICAgLy8gZmV0Y2ggdXNlciBmcm9tIHNlcnZlciBpbiBoYW5nb3V0IGlzIG5ld3VzZXJcclxuICAgICAgZmV0Y2hVc2VyKHsgc2VhcmNoLCBkaXNwYXRjaCB9KTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgY29uc3QgZXJyID0gZXJyb3I7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX0hBTkdPVVRfRkFJTEVELCBlcnJvciB9KTtcclxuICB9XHJcbn1cclxuLy8gZmV0Y2ggdXNlciBmcm9tIHNlcnZlciBpbiBoYW5nb3V0IGlzIG5ld3VzZXJcclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoVXNlcih7IHNlYXJjaCwgZGlzcGF0Y2ggfSkge1xyXG4gIHRyeSB7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX1VTRVJfU1RBUlRFRCB9KTtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYC91c2Vycy9maW5kP3NlYXJjaD0ke3NlYXJjaH1gKTtcclxuICAgIGNvbnN0IHsgdXNlcnMgfSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX1VTRVJfU1VDQ0VTUywgdXNlcnMgfSk7XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfVVNFUl9GQUlMRUQsIGVycm9yIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNoYW5nZU1lc3NhZ2VUZXh0KHsgdGV4dCwgZGlzcGF0Y2ggfSkge1xyXG4gXHJcbiAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5NRVNTQUdFX1RFWFRfQ0hBTkdFRCwgdGV4dCB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHN0YXJ0Q2xpZW50Q29tbWFuZCh7IGRpc3BhdGNoIH0pIHtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkNMSUVOVF9DT01NQU5EX1NUQVJURUQgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBsb2FkTWVzc2FnZXMoeyBoYW5nb3V0LCBkaXNwYXRjaCB9KSB7XHJcbiAgY29uc3QgeyB1c2VybmFtZSB9ID0gaGFuZ291dDtcclxuICBjb25zdCBrZXkgPSBgJHt1c2VybmFtZX0tbWVzc2FnZXNgO1xyXG4gIGNvbnN0IG1lc3NhZ2VzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpKTtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkxPQURFRF9NRVNTQUdFUywgbWVzc2FnZXMgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlTWVzc2FnZSh7ICBkaXNwYXRjaCwgbWVzc2FnZSx1c2VybmFtZSx0YXJnZXQgfSkge1xyXG4gXHJcbiAgY29uc3Qga2V5ID0gYCR7dGFyZ2V0fS1tZXNzYWdlc2A7XHJcbiAgY29uc3QgbWVzc2FnZXMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSkpO1xyXG4gIGlmIChtZXNzYWdlcykge1xyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeShbLi4ubWVzc2FnZXMsey4uLm1lc3NhZ2UsdXNlcm5hbWV9XSkpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KFt7Li4ubWVzc2FnZSx1c2VybmFtZX1dKSk7XHJcbiAgfVxyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0FWRURfTUVTU0FHRV9MT0NBTExZLCBtZXNzYWdlIH0pO1xyXG59XHJcbiIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQge1xyXG4gIHVzZUNvbnRleHQsXHJcbiAgdXNlU3RhdGUsXHJcbiAgdXNlTWVtbyxcclxuICB1c2VSZWR1Y2VyLFxyXG4gIHVzZUVmZmVjdCxcclxufSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgeyByZWR1Y2VyLCBpbml0U3RhdGUgfSBmcm9tICcuL3JlZHVjZXInO1xyXG5cclxuaW1wb3J0IHtcclxuICBsb2FkSGFuZ291dHMsXHJcbiAgZmlsdGVySGFuZ291dHMsXHJcbiAgZmV0Y2hIYW5nb3V0LFxyXG4gIGxvYWRNZXNzYWdlcyxcclxuICBzYXZlTWVzc2FnZSxcclxufSBmcm9tICcuL2FjdGlvbnMnO1xyXG5pbXBvcnQgeyB1c2VBdXRoQ29udGV4dCB9IGZyb20gJy4uLy4uL2F1dGgvYXV0aC1jb250ZXh0JztcclxuY29uc3QgSGFuZ291dENvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VIYW5nb3V0Q29udGV4dCgpIHtcclxuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChIYW5nb3V0Q29udGV4dCk7XHJcbiAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZUhhbmdvdXRDb250ZXh0IG11c3QgYmUgdXNlZCB3aXRoIEhhbmdvdXRzUHJvdmlkZXInKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBjb250ZXh0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gSGFuZ291dHNQcm92aWRlcihwcm9wcykge1xyXG4gIGNvbnN0IGF1dGhDb250ZXh0ID0gdXNlQXV0aENvbnRleHQoKTtcclxuICBjb25zdCB7IHVzZXJuYW1lIH0gPSBhdXRoQ29udGV4dC5zdGF0ZTtcclxuICBjb25zdCBbc3RhdGUsIGRpc3BhdGNoXSA9IHVzZVJlZHVjZXIocmVkdWNlciwgaW5pdFN0YXRlKTtcclxuICBjb25zdCB7IGhhbmdvdXQgfSA9IHN0YXRlO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKHVzZXJuYW1lKSB7XHJcbiAgICAgIGxvYWRIYW5nb3V0cyh7IHVzZXJuYW1lLCBkaXNwYXRjaCB9KTtcclxuICAgIH1cclxuICB9LCBbdXNlcm5hbWVdKTtcclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKGhhbmdvdXQpIHtcclxuICAgICAgLy9mcm9tIGxvY2FsIHN0b3JhZ2VcclxuICAgICAgbG9hZE1lc3NhZ2VzKHsgZGlzcGF0Y2gsIGhhbmdvdXQgfSk7XHJcblxyXG4gICAgICAvL3NhdmUgaGFuZ291dCB0byBsb2NhbFN0b3JhZ2VcclxuICAgICAgY29uc3Qga2V5ID0gYCR7dXNlcm5hbWV9LWhhbmdvdXRzYDtcclxuICAgICAgY29uc3QgaGFuZ291dHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSkpO1xyXG4gICAgICBpZiAoIWhhbmdvdXRzKSB7XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeShbaGFuZ291dF0pKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zdCBoYW5nb3V0RXhpc3QgPSBoYW5nb3V0cy5maW5kKFxyXG4gICAgICAgICAgKGcpID0+IGcudXNlcm5hbWUgPT09IGhhbmdvdXQudXNlcm5hbWVcclxuICAgICAgICApO1xyXG4gICAgICAgIGlmIChoYW5nb3V0RXhpc3QpIHtcclxuICAgICAgICAgIGNvbnN0IHVwZGF0ZWQgPSBoYW5nb3V0cy5tYXAoKGcpID0+IHtcclxuICAgICAgICAgICAgaWYgKGcudXNlcm5hbWUgPT09IGhhbmdvdXQudXNlcm5hbWUpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gaGFuZ291dDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICByZXR1cm4gZztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KHVwZGF0ZWQpKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeShbaGFuZ291dF0pKTtcclxuICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sIFtoYW5nb3V0XSk7XHJcblxyXG4gIGNvbnN0IHZhbHVlID0gdXNlTWVtbygoKSA9PiBbc3RhdGUsIGRpc3BhdGNoXSwgW3N0YXRlXSk7XHJcbiAgcmV0dXJuIDxIYW5nb3V0Q29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9IHsuLi5wcm9wc30gLz47XHJcbn1cclxuIiwiZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZUxvY2FsSGFuZ291dHMoeyBoYW5nb3V0LCB1c2VybmFtZSB9KSB7XHJcbiAgICBjb25zdCBrZXkgPSBgJHt1c2VybmFtZX0taGFuZ291dHNgXHJcbiAgICBjb25zdCBoYW5nb3V0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KSlcclxuICAgIGlmIChoYW5nb3V0cykge1xyXG4gICAgICAgIGNvbnN0IGhhbmdvdXRFeGlzdHMgPSBoYW5nb3V0cy5maW5kKGcgPT4gZy51c2VybmFtZSA9PT0gaGFuZ291dC51c2VybmFtZSlcclxuICAgICAgICBpZiAoaGFuZ291dEV4aXN0cykge1xyXG4gICAgICAgICAgICBjb25zdCB1cGRhdGVkSGFuZ291dCA9IGhhbmdvdXRzLm1hcChnID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChnLnVzZXJuYW1lID09PSBoYW5nb3V0LnVzZXJuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGhhbmdvdXRcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBnXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkodXBkYXRlZEhhbmdvdXQpKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkoW2hhbmdvdXRzLCBoYW5nb3V0XSkpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeShbaGFuZ291dF0pKVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgdXNlV1NvY2tldENvbnRleHQgfSBmcm9tICcuLi8uLi93c29ja2V0L1dTb2NrZXRQcm92aWRlcic7XHJcbmltcG9ydCB7IGhhbmdvdXRTdGF0ZXMgfSBmcm9tICcuLi8uLi8uLi9zZXJ2ZXIvaGFuZ291dHMvaGFuZ291dFN0YXRlcydcclxuaW1wb3J0IHsgYWN0aW9uVHlwZXMgfSBmcm9tICcuL2FjdGlvblR5cGVzJ1xyXG5pbXBvcnQge3VwZGF0ZUxvY2FsSGFuZ291dHN9IGZyb20gJy4vdXBkYXRlTG9jYWxIYW5nb3V0cydcclxuaW1wb3J0IHsgY2xpZW50Q29tbWFuZHMgfSBmcm9tICcuL2NsaWVudENvbW1hbmRzJ1xyXG5leHBvcnQgZnVuY3Rpb24gdXNlU29ja2V0KHsgZGlzcGF0Y2gsIHVzZXJuYW1lIH0pIHtcclxuICBjb25zdCBzb2NrZXRDb250ZXh0ID0gdXNlV1NvY2tldENvbnRleHQoKTtcclxuICBjb25zdCB7IHNvY2tldCB9ID0gc29ja2V0Q29udGV4dFswXVxyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKHNvY2tldCAmJiB1c2VybmFtZSkge1xyXG4gICAgICBzb2NrZXQub25tZXNzYWdlID0gKG1lc3NhZ2UpID0+IHtcclxuICAgICAgICBjb25zdCBoYW5nb3V0ID0gSlNPTi5wYXJzZShtZXNzYWdlLmRhdGEpO1xyXG4gICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgIHVwZGF0ZUxvY2FsSGFuZ291dHMoe2hhbmdvdXQsdXNlcm5hbWV9KVxyXG4gICAgICAgIGRpc3BhdGNoKHt0eXBlOmFjdGlvblR5cGVzLkhBTkdPVVRfUkVDSUVWRUQsIGhhbmdvdXR9KVxyXG4gICAgICB9O1xyXG4gICAgICBzb2NrZXQub25jbG9zZSA9ICgpID0+IHtcclxuXHJcbiAgICAgIH07XHJcbiAgICAgIHNvY2tldC5vbmVycm9yID0gKGVycm9yKSA9PiB7XHJcblxyXG4gICAgICB9O1xyXG5cclxuICAgICAgc29ja2V0Lm9ub3BlbiA9ICgpID0+IHtcclxuICAgICAgICBkZWJ1Z2dlcjtcclxuXHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgfSwgW3NvY2tldCwgdXNlcm5hbWVdKTtcclxuXHJcbiAgcmV0dXJuIG51bGw7XHJcblxyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZUhhbmdvdXRDb250ZXh0IH0gZnJvbSAnLi9IYW5nb3V0c1Byb3ZpZGVyJztcclxuaW1wb3J0IHsgdXNlQXV0aENvbnRleHQgfSBmcm9tICcuLi8uLi9hdXRoL2F1dGgtY29udGV4dCc7XHJcbmltcG9ydCB7IHVzZVdTb2NrZXRDb250ZXh0IH0gZnJvbSAnLi4vLi4vd3NvY2tldC9XU29ja2V0UHJvdmlkZXInO1xyXG5pbXBvcnQgeyB1cGRhdGVMb2NhbEhhbmdvdXRzIH0gZnJvbSAnLi91cGRhdGVMb2NhbEhhbmdvdXRzJ1xyXG5pbXBvcnQge1xyXG4gIHNlbGVjdEhhbmdvdXQsXHJcbiAgc2VhcmNoSGFuZ291dHMsXHJcbiAgZmlsdGVySGFuZ291dHMsXHJcbiAgZmV0Y2hIYW5nb3V0LFxyXG4gIHNlbGVjdFVzZXIsXHJcbiAgY2hhbmdlTWVzc2FnZVRleHQsXHJcbiAgc3RhcnRDbGllbnRDb21tYW5kLFxyXG4gIHNhdmVNZXNzYWdlLFxyXG59IGZyb20gJy4vYWN0aW9ucyc7XHJcbmltcG9ydCB7IHVzZVNvY2tldCB9IGZyb20gJy4vdXNlU29ja2V0JztcclxuaW1wb3J0IHsgY2xpZW50Q29tbWFuZHMgfSBmcm9tICcuL2NsaWVudENvbW1hbmRzJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VIYW5nb3V0cygpIHtcclxuICBjb25zdCBzb2NrZXRDb250ZXh0ID0gdXNlV1NvY2tldENvbnRleHQoKTtcclxuICBjb25zdCB7IHNvY2tldCB9ID0gc29ja2V0Q29udGV4dFswXVxyXG4gIGNvbnN0IGF1dGhDb250ZXh0ID0gdXNlQXV0aENvbnRleHQoKTtcclxuICBjb25zdCB7IHVzZXJuYW1lIH0gPSBhdXRoQ29udGV4dC5zdGF0ZTtcclxuICBjb25zdCBbc3RhdGUsIGRpc3BhdGNoXSA9IHVzZUhhbmdvdXRDb250ZXh0KCk7XHJcbiAgY29uc3QgeyBoYW5nb3V0LCBoYW5nb3V0cywgc2VhcmNoLCB1c2VycywgbWVzc2FnZVRleHQsIG1lc3NhZ2VzIH0gPSBzdGF0ZTtcclxuICBjb25zdCBoYW5kbGVTb2NrZXQgPSB1c2VTb2NrZXQoeyBkaXNwYXRjaCwgaGFuZ291dCwgdXNlcm5hbWUgfSk7XHJcbiAgZnVuY3Rpb24gb25TZWxlY3RIYW5nb3V0KGUpIHtcclxuICAgIGNvbnN0IHVzZXJuYW1lID0gZS50YXJnZXQuaWQ7XHJcbiAgICBzZWxlY3RIYW5nb3V0KHsgZGlzcGF0Y2gsIHVzZXJuYW1lIH0pO1xyXG4gIH1cclxuICBmdW5jdGlvbiBvblNlbGVjdFVzZXIoZSkge1xyXG4gICAgY29uc3QgdW5hbWUgPSBlLnRhcmdldC5pZDtcclxuICAgIGNvbnN0IHVzZXIgPSB1c2Vycy5maW5kKCh1KSA9PiB1LnVzZXJuYW1lID09PSB1bmFtZSk7XHJcbiAgICBzZWxlY3RVc2VyKHsgZGlzcGF0Y2gsIHVzZXIsIHVzZXJuYW1lIH0pO1xyXG4gIH1cclxuICBmdW5jdGlvbiBvblNlYXJjaChlKSB7XHJcbiAgICBzZWFyY2hIYW5nb3V0cyh7IHNlYXJjaDogZS50YXJnZXQudmFsdWUsIGRpc3BhdGNoIH0pO1xyXG4gIH1cclxuICBmdW5jdGlvbiBvblN0YXJ0U2VhcmNoKGUpIHtcclxuICAgIGlmIChoYW5nb3V0cyAmJiBoYW5nb3V0cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGZpbHRlckhhbmdvdXRzKHsgZGlzcGF0Y2ggfSk7XHJcbiAgICB9XHJcbiAgICBmZXRjaEhhbmdvdXQoeyBkaXNwYXRjaCwgc2VhcmNoLCB1c2VybmFtZSB9KTtcclxuICB9XHJcbiAgZnVuY3Rpb24gb25NZXNzYWdlVGV4dChlKSB7XHJcbiAgICBjb25zdCB0ZXh0ID0gZS50YXJnZXQudmFsdWVcclxuICAgIGNoYW5nZU1lc3NhZ2VUZXh0KHsgZGlzcGF0Y2gsIHRleHQgfSk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIG9uSGFuZ291dChlKSB7XHJcbiAgICBjb25zdCBjb21tYW5kID0gZS50YXJnZXQuaWRcclxuICAgIGNvbnN0IHsgdXNlcm5hbWUsIGVtYWlsIH0gPSBoYW5nb3V0O1xyXG4gICAgbGV0IG1lc3NhZ2UgPSBudWxsXHJcbiAgICBpZiAobWVzc2FnZVRleHQpIHtcclxuICAgICAgbWVzc2FnZSA9IHsgdGV4dDogbWVzc2FnZVRleHQsIHRpbWVzdGFtcDogRGF0ZS5ub3coKSB9O1xyXG4gICAgICBzYXZlTWVzc2FnZSh7IGRpc3BhdGNoLCBoYW5nb3V0LCBtZXNzYWdlLCB0YXJnZXQ6IHVzZXJuYW1lLCB1c2VybmFtZTogYXV0aENvbnRleHQuc3RhdGUudXNlcm5hbWUgfSk7XHJcbiAgICB9XHJcbiAgICBjb25zdCB1cGRhdGVkSGFuZ291dCA9IHtcclxuICAgICAgdXNlcm5hbWUsXHJcbiAgICAgIGVtYWlsLFxyXG4gICAgICBtZXNzYWdlLFxyXG4gICAgfTtcclxuICAgIHNvY2tldC5zZW5kKFxyXG4gICAgICBKU09OLnN0cmluZ2lmeSh7IC4uLnVwZGF0ZWRIYW5nb3V0LCBjb21tYW5kIH0pXHJcbiAgICApO1xyXG4gICAgdXBkYXRlTG9jYWxIYW5nb3V0cyh7IGhhbmdvdXQsIHVzZXJuYW1lLCBkZXZpdmVyZWQ6ICdwZW5kaW5nJyB9KVxyXG4gIH1cclxuICByZXR1cm4ge1xyXG4gICAgb25NZXNzYWdlVGV4dCxcclxuICAgIG1lc3NhZ2VUZXh0LFxyXG4gICAgb25TdGFydFNlYXJjaCxcclxuICAgIG9uU2VhcmNoLFxyXG4gICAgc2VhcmNoLFxyXG4gICAgb25TZWxlY3RIYW5nb3V0LFxyXG4gICAgb25TZWxlY3RVc2VyLFxyXG4gICAgaGFuZ291dCxcclxuICAgIGhhbmdvdXRzLFxyXG4gICAgdXNlcnMsXHJcbiAgICB1c2VybmFtZSxcclxuICAgIG1lc3NhZ2VzLFxyXG4gICAgb25IYW5nb3V0XHJcbiAgfTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgbGF6eSwgU3VzcGVuc2UgfSBmcm9tICdwcmVhY3QvY29tcGF0JztcclxuaW1wb3J0IHsgUm91dGUsIHVzZVJvdXRlQ29udGV4dCB9IGZyb20gJy4uL3JvdXRlL3JvdXRlcic7XHJcblxyXG5pbXBvcnQgeyB1c2VIYW5nb3V0cyB9IGZyb20gJy4vc3RhdGUvdXNlSGFuZ291dHMnO1xyXG5jb25zdCBIYW5nb3V0cyA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL0hhbmdvdXQnKSk7XHJcbmNvbnN0IEJsb2NrID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vc3RhdGUtdWkvQmxvY2snKSk7XHJcbmNvbnN0IEJsb2NrZWQgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9zdGF0ZS11aS9CbG9ja2VkJykpO1xyXG5jb25zdCBDb25maWd1cmUgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9zdGF0ZS11aS9Db25maWd1cmUnKSk7XHJcbmNvbnN0IEhhbmdjaGF0ID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vc3RhdGUtdWkvSGFuZ2NoYXQnKSk7XHJcbmNvbnN0IEludml0ZSA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL3N0YXRlLXVpL0ludml0ZScpKTtcclxuY29uc3QgSW52aXRlZSA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL3N0YXRlLXVpL0ludml0ZWUnKSk7XHJcbmNvbnN0IEludml0ZXIgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9zdGF0ZS11aS9JbnZpdGVyJykpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTW9iaWxlKCkge1xyXG4gIGNvbnN0IFtyb3V0ZSwgc2V0Um91dGVdID0gdXNlUm91dGVDb250ZXh0KCk7XHJcbiAgY29uc3Qge1xyXG4gICAgaGFuZ291dCxcclxuICAgIGhhbmdvdXRzLFxyXG4gICAgb25IYW5nb3V0LFxyXG4gICAgb25TZWxlY3RIYW5nb3V0LFxyXG4gICAgb25TZWxlY3RVc2VyLFxyXG4gICAgb25TZWFyY2gsXHJcbiAgICB1c2VycyxcclxuICAgIHNlYXJjaCxcclxuICAgIG9uU3RhcnRTZWFyY2gsXHJcbiAgICBvbk1lc3NhZ2VUZXh0LFxyXG4gICAgbWVzc2FnZVRleHQsXHJcbiAgICB1c2VybmFtZSxcclxuICAgIG1lc3NhZ2VzXHJcbiAgfSA9IHVzZUhhbmdvdXRzKCk7XHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmIChoYW5nb3V0KSB7XHJcbiAgICAgIHNldFJvdXRlKGAvJHtoYW5nb3V0LnN0YXRlfWApO1xyXG4gICAgfVxyXG4gIH0sIFtoYW5nb3V0XSk7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3sgaGVpZ2h0OiAnODV2aCcgfX0+XHJcbiAgICAgIDxSb3V0ZSBwYXRoPVwiL2hhbmdvdXRzXCI+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPEhhbmdvdXRzXHJcbiAgICAgICAgICAgIHVzZXJzPXt1c2Vyc31cclxuICAgICAgICAgICAgc2VhcmNoPXtzZWFyY2h9XHJcbiAgICAgICAgICAgIGhhbmdvdXRzPXtoYW5nb3V0c31cclxuICAgICAgICAgICAgb25TZWxlY3RIYW5nb3V0PXtvblNlbGVjdEhhbmdvdXR9XHJcbiAgICAgICAgICAgIG9uU2VsZWN0VXNlcj17b25TZWxlY3RVc2VyfVxyXG4gICAgICAgICAgICBvblNlYXJjaD17b25TZWFyY2h9XHJcbiAgICAgICAgICAgIG9uU3RhcnRTZWFyY2g9e29uU3RhcnRTZWFyY2h9XHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgIDwvUm91dGU+XHJcbiAgICAgIDxSb3V0ZSBwYXRoPVwiL0JMT0NLXCI+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPEJsb2NrIGhhbmdvdXQ9e2hhbmdvdXR9IG9uQmxvY2s9e29uSGFuZ291dH0gLz5cclxuICAgICAgICA8L1N1c3BlbnNlPlxyXG4gICAgICA8L1JvdXRlPlxyXG4gICAgICA8Um91dGUgcGF0aD1cIi9CTE9DS0VEXCI+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPEJsb2NrZWQgaGFuZ291dD17aGFuZ291dH0gb25VbmJsb2NrPXtvbkhhbmdvdXR9IC8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9Sb3V0ZT5cclxuICAgICAgPFJvdXRlIHBhdGg9XCIvY29uZmlndXJlXCI+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPENvbmZpZ3VyZSBoYW5nb3V0PXtoYW5nb3V0fSAvPlxyXG4gICAgICAgIDwvU3VzcGVuc2U+XHJcbiAgICAgIDwvUm91dGU+XHJcbiAgICAgIDxSb3V0ZSBwYXRocz17W1wiL0FDQ0VQVEVEXCIsXCIvQUNDRVBURVJcIixcIi9NRVNTQU5HRVJcIixcIi9NRVNTQUdFRFwiXX0+XHJcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8ZGl2PkxvYWRpbmcuLi48L2Rpdj59PlxyXG4gICAgICAgICAgPEhhbmdjaGF0XHJcbiAgICAgICAgICAgIG9uTWVzc2FnZVRleHQ9e29uTWVzc2FnZVRleHR9XHJcbiAgICAgICAgICAgIG9uTWVzc2FnZT17b25IYW5nb3V0fVxyXG4gICAgICAgICAgICBtZXNzYWdlcz17bWVzc2FnZXN9XHJcbiAgICAgICAgICAgIHVzZXJuYW1lPXt1c2VybmFtZX1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9Sb3V0ZT5cclxuICAgIFxyXG4gICAgICA8Um91dGUgcGF0aD1cIi9JTlZJVEVcIj5cclxuICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+TG9hZGluZy4uLjwvZGl2Pn0+XHJcbiAgICAgICAgICA8SW52aXRlXHJcbiAgICAgICAgICAgIGhhbmdvdXQ9e2hhbmdvdXR9XHJcbiAgICAgICAgICAgIG9uSW52aXRlPXtvbkhhbmdvdXR9XHJcbiAgICAgICAgICAgIG9uTWVzc2FnZVRleHQ9e29uTWVzc2FnZVRleHR9XHJcbiAgICAgICAgICAgIG1lc3NhZ2VUZXh0PXttZXNzYWdlVGV4dH1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9Sb3V0ZT5cclxuICAgICAgPFJvdXRlIHBhdGg9XCIvSU5WSVRFRFwiPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxJbnZpdGVlIGhhbmdvdXQ9e2hhbmdvdXR9IC8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9Sb3V0ZT5cclxuICAgICAgPFJvdXRlIHBhdGg9XCIvSU5WSVRFUlwiPlxyXG4gICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PGRpdj5Mb2FkaW5nLi4uPC9kaXY+fT5cclxuICAgICAgICAgIDxJbnZpdGVyIGhhbmdvdXQ9e2hhbmdvdXR9IG9uQWNjZXB0PXtvbkhhbmdvdXR9IC8+XHJcbiAgICAgICAgPC9TdXNwZW5zZT5cclxuICAgICAgPC9Sb3V0ZT5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCBNb2JpbGUgZnJvbSAnLi9tb2JpbGUnO1xyXG5pbXBvcnQgeyBIYW5nb3V0c1Byb3ZpZGVyIH0gZnJvbSAnLi9zdGF0ZS9IYW5nb3V0c1Byb3ZpZGVyJztcclxuaW1wb3J0IHsgUm91dGVQcm92aWRlciwgdXNlUm91dGVDb250ZXh0IH0gZnJvbSAnLi4vcm91dGUvcm91dGVyJztcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8SGFuZ291dHNQcm92aWRlcj5cclxuICAgICAgPFJvdXRlUHJvdmlkZXIgaW5pdGlhbFJvdXRlPVwiL2hhbmdvdXRzXCI+XHJcbiAgICAgICAgPE1vYmlsZSAvPlxyXG4gICAgICA8L1JvdXRlUHJvdmlkZXI+XHJcbiAgICA8L0hhbmdvdXRzUHJvdmlkZXI+XHJcbiAgKTtcclxufVxyXG4iXSwibmFtZXMiOlsiYWN0aW9uVHlwZXMiLCJNRVNTQUdFX1RFWFRfQ0hBTkdFRCIsIkxPQURfSEFOR09VVFMiLCJMT0FERURfTUVTU0FHRVMiLCJTQVZFRF9NRVNTQUdFX0xPQ0FMTFkiLCJTRUFSQ0hFRF9IQU5HT1VUIiwiU0VMRUNURURfSEFOR09VVCIsIlNFTEVDVEVEX1VTRVIiLCJGSUxURVJfSEFOR09VVFMiLCJGRVRDSF9IQU5HT1VUX1NUQVJURUQiLCJGRVRDSF9IQU5HT1VUX1NVQ0NFU1MiLCJGRVRDSF9IQU5HT1VUX0ZBSUxFRCIsIkZFVENIX0hBTkdPVVRfTk9UX0ZPVU5EIiwiRkVUQ0hfVVNFUl9TVEFSVEVEIiwiRkVUQ0hfVVNFUl9TVUNDRVNTIiwiRkVUQ0hfVVNFUl9GQUlMRUQiLCJPTkxJTkVfU1RBVEVfQ0hBTkdFRCIsIkhBTkdPVVRfUkVDSUVWRUQiLCJIQU5HT1VUX1NFTlQiLCJpbml0U3RhdGUiLCJoYW5nb3V0cyIsImhhbmdvdXQiLCJtZXNzYWdlcyIsInNlYXJjaCIsInVzZXIiLCJsb2FkaW5nIiwiZXJyb3IiLCJtZXNzYWdlVGV4dCIsIm9ubGluZSIsInJlZHVjZXIiLCJzdGF0ZSIsImFjdGlvbiIsInR5cGUiLCJtZXNzYWdlIiwidGV4dCIsInVzZXJzIiwiSEFOR09VVF9OT1RfRk9VTkQiLCJmaWx0ZXIiLCJnIiwidXNlcm5hbWUiLCJpbmNsdWRlcyIsImZpbmQiLCJ1cGRhdGVIYW5nb3V0IiwiaGFuZ291dEV4aXN0cyIsIm1hcCIsImxvYWRIYW5nb3V0cyIsImRpc3BhdGNoIiwiSlNPTiIsInBhcnNlIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsInNlbGVjdEhhbmdvdXQiLCJzZWxlY3RVc2VyIiwic2V0SXRlbSIsInN0cmluZ2lmeSIsInNlYXJjaEhhbmdvdXRzIiwiZmlsdGVySGFuZ291dHMiLCJmZXRjaEhhbmdvdXQiLCJyZXNwb25zZSIsImZldGNoIiwib2siLCJqc29uIiwibGVuZ3RoIiwiZmV0Y2hVc2VyIiwiY2hhbmdlTWVzc2FnZVRleHQiLCJsb2FkTWVzc2FnZXMiLCJrZXkiLCJzYXZlTWVzc2FnZSIsInRhcmdldCIsIkhhbmdvdXRDb250ZXh0IiwiY3JlYXRlQ29udGV4dCIsInVzZUhhbmdvdXRDb250ZXh0IiwiY29udGV4dCIsInVzZUNvbnRleHQiLCJFcnJvciIsIkhhbmdvdXRzUHJvdmlkZXIiLCJwcm9wcyIsImF1dGhDb250ZXh0IiwidXNlQXV0aENvbnRleHQiLCJ1c2VSZWR1Y2VyIiwidXNlRWZmZWN0IiwiaGFuZ291dEV4aXN0IiwidXBkYXRlZCIsInZhbHVlIiwidXNlTWVtbyIsInVwZGF0ZUxvY2FsSGFuZ291dHMiLCJ1cGRhdGVkSGFuZ291dCIsInVzZVNvY2tldCIsInNvY2tldENvbnRleHQiLCJ1c2VXU29ja2V0Q29udGV4dCIsInNvY2tldCIsIm9ubWVzc2FnZSIsImRhdGEiLCJvbmNsb3NlIiwib25lcnJvciIsIm9ub3BlbiIsInVzZUhhbmdvdXRzIiwiaGFuZGxlU29ja2V0Iiwib25TZWxlY3RIYW5nb3V0IiwiZSIsImlkIiwib25TZWxlY3RVc2VyIiwidW5hbWUiLCJ1Iiwib25TZWFyY2giLCJvblN0YXJ0U2VhcmNoIiwib25NZXNzYWdlVGV4dCIsIm9uSGFuZ291dCIsImNvbW1hbmQiLCJlbWFpbCIsInRpbWVzdGFtcCIsIkRhdGUiLCJub3ciLCJzZW5kIiwiZGV2aXZlcmVkIiwiSGFuZ291dHMiLCJsYXp5IiwiQmxvY2siLCJCbG9ja2VkIiwiQ29uZmlndXJlIiwiSGFuZ2NoYXQiLCJJbnZpdGUiLCJJbnZpdGVlIiwiSW52aXRlciIsIk1vYmlsZSIsInJvdXRlIiwic2V0Um91dGUiLCJ1c2VSb3V0ZUNvbnRleHQiLCJoZWlnaHQiLCJTdXNwZW5zZSJdLCJtYXBwaW5ncyI6Ijs7QUFBTyxNQUFNQSxXQUFXLEdBQUc7QUFDdkJDLEVBQUFBLG9CQUFvQixFQUFDLHNCQURFO0FBRXZCQyxFQUFBQSxhQUFhLEVBQUUsZUFGUTtBQUd2QkMsRUFBQUEsZUFBZSxFQUFFLGlCQUhNO0FBSXZCQyxFQUFBQSxxQkFBcUIsRUFBQyx1QkFKQztBQUt2QkMsRUFBQUEsZ0JBQWdCLEVBQUUsa0JBTEs7QUFNdkJDLEVBQUFBLGdCQUFnQixFQUFFLGtCQU5LO0FBT3ZCQyxFQUFBQSxhQUFhLEVBQUMsZUFQUztBQVF2QkMsRUFBQUEsZUFBZSxFQUFDLGlCQVJPO0FBVXZCQyxFQUFBQSxxQkFBcUIsRUFBRSx1QkFWQTtBQVd2QkMsRUFBQUEscUJBQXFCLEVBQUUsdUJBWEE7QUFZdkJDLEVBQUFBLG9CQUFvQixFQUFFLHNCQVpDO0FBYXZCQyxFQUFBQSx1QkFBdUIsRUFBRSx5QkFiRjtBQWV2QkMsRUFBQUEsa0JBQWtCLEVBQUUsb0JBZkc7QUFnQnZCQyxFQUFBQSxrQkFBa0IsRUFBRSxvQkFoQkc7QUFpQnZCQyxFQUFBQSxpQkFBaUIsRUFBRSxtQkFqQkk7QUFrQnZCQyxFQUFBQSxvQkFBb0IsRUFBRSxzQkFsQkM7QUFvQnZCQyxFQUFBQSxnQkFBZ0IsRUFBQyxrQkFwQk07QUFxQnZCQyxFQUFBQSxZQUFZLEVBQUM7QUFyQlUsQ0FBcEI7O0FDQ0EsTUFBTUMsU0FBUyxHQUFHO0FBQ3ZCQyxFQUFBQSxRQUFRLEVBQUUsSUFEYTtBQUV2QkMsRUFBQUEsT0FBTyxFQUFFLElBRmM7QUFHdkJDLEVBQUFBLFFBQVEsRUFBRSxJQUhhO0FBSXZCQyxFQUFBQSxNQUFNLEVBQUUsRUFKZTtBQUt2QkMsRUFBQUEsSUFBSSxFQUFFLEVBTGlCO0FBTXZCQyxFQUFBQSxPQUFPLEVBQUUsS0FOYztBQU92QkMsRUFBQUEsS0FBSyxFQUFFLElBUGdCO0FBUXZCQyxFQUFBQSxXQUFXLEVBQUUsRUFSVTtBQVN2QkMsRUFBQUEsTUFBTSxFQUFFO0FBVGUsQ0FBbEI7QUFXQSxTQUFTQyxPQUFULENBQWlCQyxLQUFqQixFQUF3QkMsTUFBeEIsRUFBZ0M7QUFDckMsVUFBUUEsTUFBTSxDQUFDQyxJQUFmO0FBQ0UsU0FBS2hDLFdBQVcsQ0FBQ0kscUJBQWpCO0FBQ0UsVUFBSTBCLEtBQUssQ0FBQ1IsUUFBVixFQUFvQjtBQUNsQixlQUFPLEVBQUUsR0FBR1EsS0FBTDtBQUFZUixVQUFBQSxRQUFRLEVBQUUsQ0FBQyxHQUFHUSxLQUFLLENBQUNSLFFBQVYsRUFBb0JTLE1BQU0sQ0FBQ0UsT0FBM0I7QUFBdEIsU0FBUDtBQUNELE9BRkQsTUFFTztBQUNMLGVBQU8sRUFBRSxHQUFHSCxLQUFMO0FBQVlSLFVBQUFBLFFBQVEsRUFBRSxDQUFDUyxNQUFNLENBQUNFLE9BQVI7QUFBdEIsU0FBUDtBQUNEOztBQUNILFNBQUtqQyxXQUFXLENBQUNHLGVBQWpCO0FBQ0UsYUFBTyxFQUFFLEdBQUcyQixLQUFMO0FBQVlSLFFBQUFBLFFBQVEsRUFBRVMsTUFBTSxDQUFDVDtBQUE3QixPQUFQOztBQUNGLFNBQUt0QixXQUFXLENBQUNDLG9CQUFqQjtBQUNFLGFBQU8sRUFBRSxHQUFHNkIsS0FBTDtBQUFZSCxRQUFBQSxXQUFXLEVBQUVJLE1BQU0sQ0FBQ0c7QUFBaEMsT0FBUDs7QUFDRixTQUFLbEMsV0FBVyxDQUFDZSxpQkFBakI7QUFDQSxTQUFLZixXQUFXLENBQUNXLG9CQUFqQjtBQUNFLGFBQU8sRUFBRSxHQUFHbUIsS0FBTDtBQUFZTCxRQUFBQSxPQUFPLEVBQUUsS0FBckI7QUFBNEJDLFFBQUFBLEtBQUssRUFBRUssTUFBTSxDQUFDTDtBQUExQyxPQUFQOztBQUNGLFNBQUsxQixXQUFXLENBQUNhLGtCQUFqQjtBQUNFLGFBQU8sRUFBRSxHQUFHaUIsS0FBTDtBQUFZTCxRQUFBQSxPQUFPLEVBQUU7QUFBckIsT0FBUDs7QUFDRixTQUFLekIsV0FBVyxDQUFDYyxrQkFBakI7QUFDRSxhQUFPLEVBQ0wsR0FBR2dCLEtBREU7QUFFTEwsUUFBQUEsT0FBTyxFQUFFLEtBRko7QUFHTFUsUUFBQUEsS0FBSyxFQUFFSixNQUFNLENBQUNJO0FBSFQsT0FBUDs7QUFLRixTQUFLbkMsV0FBVyxDQUFDUyxxQkFBakI7QUFDRSxhQUFPLEVBQUUsR0FBR3FCLEtBQUw7QUFBWUwsUUFBQUEsT0FBTyxFQUFFO0FBQXJCLE9BQVA7O0FBQ0YsU0FBS3pCLFdBQVcsQ0FBQ1UscUJBQWpCO0FBQ0UsYUFBTyxFQUFFLEdBQUdvQixLQUFMO0FBQVlMLFFBQUFBLE9BQU8sRUFBRSxLQUFyQjtBQUE0QkwsUUFBQUEsUUFBUSxFQUFFVyxNQUFNLENBQUNYO0FBQTdDLE9BQVA7O0FBQ0YsU0FBS3BCLFdBQVcsQ0FBQ29DLGlCQUFqQjtBQUNFLGFBQU8sRUFBRSxHQUFHTixLQUFMO0FBQVlMLFFBQUFBLE9BQU8sRUFBRTtBQUFyQixPQUFQOztBQUNGLFNBQUt6QixXQUFXLENBQUNRLGVBQWpCO0FBQ0UsYUFBTyxFQUNMLEdBQUdzQixLQURFO0FBRUxWLFFBQUFBLFFBQVEsRUFBRVUsS0FBSyxDQUFDVixRQUFOLENBQWVpQixNQUFmLENBQXVCQyxDQUFELElBQzlCQSxDQUFDLENBQUNDLFFBQUYsQ0FBV0MsUUFBWCxDQUFvQlYsS0FBSyxDQUFDUCxNQUExQixDQURRO0FBRkwsT0FBUDs7QUFNRixTQUFLdkIsV0FBVyxDQUFDSyxnQkFBakI7QUFDRSxhQUFPLEVBQUUsR0FBR3lCLEtBQUw7QUFBWVAsUUFBQUEsTUFBTSxFQUFFUSxNQUFNLENBQUNSO0FBQTNCLE9BQVA7O0FBQ0YsU0FBS3ZCLFdBQVcsQ0FBQ0UsYUFBakI7QUFDRSxhQUFPLEVBQUUsR0FBRzRCLEtBQUw7QUFBWVYsUUFBQUEsUUFBUSxFQUFFVyxNQUFNLENBQUNYO0FBQTdCLE9BQVA7O0FBQ0YsU0FBS3BCLFdBQVcsQ0FBQ08sYUFBakI7QUFDRSxVQUFJdUIsS0FBSyxDQUFDVixRQUFWLEVBQW9CO0FBQ2xCLGVBQU8sRUFDTCxHQUFHVSxLQURFO0FBRUxWLFVBQUFBLFFBQVEsRUFBRSxDQUFDLEdBQUdVLEtBQUssQ0FBQ1YsUUFBVixFQUFvQlcsTUFBTSxDQUFDVixPQUEzQixDQUZMO0FBR0xBLFVBQUFBLE9BQU8sRUFBRVUsTUFBTSxDQUFDVjtBQUhYLFNBQVA7QUFLRDs7QUFDRCxhQUFPLEVBQ0wsR0FBR1MsS0FERTtBQUVMVixRQUFBQSxRQUFRLEVBQUUsQ0FBQ1csTUFBTSxDQUFDVixPQUFSLENBRkw7QUFHTEEsUUFBQUEsT0FBTyxFQUFFVSxNQUFNLENBQUNWO0FBSFgsT0FBUDs7QUFLRixTQUFLckIsV0FBVyxDQUFDTSxnQkFBakI7QUFDRSxhQUFPLEVBQ0wsR0FBR3dCLEtBREU7QUFFTFQsUUFBQUEsT0FBTyxFQUFFUyxLQUFLLENBQUNWLFFBQU4sQ0FBZXFCLElBQWYsQ0FBcUJILENBQUQsSUFBT0EsQ0FBQyxDQUFDQyxRQUFGLEtBQWVSLE1BQU0sQ0FBQ1EsUUFBakQ7QUFGSixPQUFQOztBQUlGLFNBQUt2QyxXQUFXLENBQUNpQixnQkFBakI7QUFDRSxhQUFPLEVBQ0wsR0FBR2EsS0FERTtBQUVMVCxRQUFBQSxPQUFPLEVBQUVVLE1BQU0sQ0FBQ1YsT0FGWDtBQUdMRCxRQUFBQSxRQUFRLEVBQUVzQixhQUFhLENBQUM7QUFBRXRCLFVBQUFBLFFBQVEsRUFBRVUsS0FBSyxDQUFDVixRQUFsQjtBQUE0QkMsVUFBQUEsT0FBTyxFQUFFVSxNQUFNLENBQUNWO0FBQTVDLFNBQUQ7QUFIbEIsT0FBUDs7QUFNRjtBQUNFLGFBQU9TLEtBQVA7QUFqRUo7QUFtRUQ7O0FBSUQsU0FBU1ksYUFBVCxDQUF1QjtBQUFFckIsRUFBQUEsT0FBRjtBQUFXRCxFQUFBQTtBQUFYLENBQXZCLEVBQThDO0FBRTVDLE1BQUlBLFFBQUosRUFBYztBQUNaLFVBQU11QixhQUFhLEdBQUd2QixRQUFRLENBQUNxQixJQUFULENBQWNILENBQUMsSUFBSUEsQ0FBQyxDQUFDQyxRQUFGLEtBQWVsQixPQUFPLENBQUNrQixRQUExQyxDQUF0Qjs7QUFDQSxRQUFJSSxhQUFKLEVBQW1CO0FBQ2pCLGFBQU92QixRQUFRLENBQUN3QixHQUFULENBQWFOLENBQUMsSUFBSTtBQUN2QixZQUFJQSxDQUFDLENBQUNDLFFBQUYsS0FBZWxCLE9BQU8sQ0FBQ2tCLFFBQTNCLEVBQXFDO0FBQ25DLGlCQUFPbEIsT0FBUDtBQUNELFNBRkQsTUFHSztBQUNILGlCQUFPaUIsQ0FBUDtBQUNEO0FBQ0YsT0FQTSxDQUFQO0FBUUQsS0FURCxNQVNPO0FBQ0wsYUFBTyxDQUFDbEIsUUFBRCxFQUFXQyxPQUFYLENBQVA7QUFDRDtBQUNGLEdBZEQsTUFlSztBQUNILFdBQU8sQ0FBQ0QsUUFBRCxFQUFXQyxPQUFYLENBQVA7QUFDRDtBQUNGOztBQ3JHTSxTQUFTd0IsWUFBVCxDQUFzQjtBQUFFTixFQUFBQSxRQUFGO0FBQVlPLEVBQUFBO0FBQVosQ0FBdEIsRUFBOEM7QUFDbkQsUUFBTTFCLFFBQVEsR0FBRzJCLElBQUksQ0FBQ0MsS0FBTCxDQUFXQyxZQUFZLENBQUNDLE9BQWIsQ0FBc0IsR0FBRVgsUUFBUyxXQUFqQyxDQUFYLENBQWpCO0FBQ0FPLEVBQUFBLFFBQVEsQ0FBQztBQUFFZCxJQUFBQSxJQUFJLEVBQUVoQyxXQUFXLENBQUNFLGFBQXBCO0FBQW1Da0IsSUFBQUE7QUFBbkMsR0FBRCxDQUFSO0FBQ0Q7O0FBRU0sU0FBUytCLGFBQVQsQ0FBdUI7QUFBRUwsRUFBQUEsUUFBRjtBQUFZUCxFQUFBQTtBQUFaLENBQXZCLEVBQStDO0FBRXBETyxFQUFBQSxRQUFRLENBQUM7QUFBRWQsSUFBQUEsSUFBSSxFQUFFaEMsV0FBVyxDQUFDTSxnQkFBcEI7QUFBc0NpQyxJQUFBQTtBQUF0QyxHQUFELENBQVI7QUFDRDtBQUVNLFNBQVNhLFVBQVQsQ0FBb0I7QUFBRU4sRUFBQUEsUUFBRjtBQUFZdEIsRUFBQUEsSUFBWjtBQUFrQmUsRUFBQUE7QUFBbEIsQ0FBcEIsRUFBa0Q7QUFDdkQ7QUFDQSxRQUFNbEIsT0FBTyxHQUFHLEVBQUUsR0FBR0csSUFBTDtBQUFXTSxJQUFBQSxLQUFLLEVBQUU7QUFBbEIsR0FBaEI7QUFDQSxRQUFNVixRQUFRLEdBQUcyQixJQUFJLENBQUNDLEtBQUwsQ0FBV0MsWUFBWSxDQUFDQyxPQUFiLENBQXNCLEdBQUVYLFFBQVMsV0FBakMsQ0FBWCxDQUFqQjs7QUFFQSxNQUFJbkIsUUFBSixFQUFjO0FBQ1o2QixJQUFBQSxZQUFZLENBQUNJLE9BQWIsQ0FDRyxHQUFFZCxRQUFTLFdBRGQsRUFFRVEsSUFBSSxDQUFDTyxTQUFMLENBQWUsQ0FBQyxHQUFHbEMsUUFBSixFQUFjQyxPQUFkLENBQWYsQ0FGRjtBQUlELEdBTEQsTUFLTztBQUNMNEIsSUFBQUEsWUFBWSxDQUFDSSxPQUFiLENBQXNCLEdBQUVkLFFBQVMsV0FBakMsRUFBNkNRLElBQUksQ0FBQ08sU0FBTCxDQUFlLENBQUNqQyxPQUFELENBQWYsQ0FBN0M7QUFDRDs7QUFFRHlCLEVBQUFBLFFBQVEsQ0FBQztBQUFFZCxJQUFBQSxJQUFJLEVBQUVoQyxXQUFXLENBQUNPLGFBQXBCO0FBQW1DYyxJQUFBQTtBQUFuQyxHQUFELENBQVI7QUFDRDs7QUFFTSxTQUFTa0MsY0FBVCxDQUF3QjtBQUFFaEMsRUFBQUEsTUFBRjtBQUFVdUIsRUFBQUE7QUFBVixDQUF4QixFQUE4QztBQUNuREEsRUFBQUEsUUFBUSxDQUFDO0FBQUVkLElBQUFBLElBQUksRUFBRWhDLFdBQVcsQ0FBQ0ssZ0JBQXBCO0FBQXNDa0IsSUFBQUE7QUFBdEMsR0FBRCxDQUFSO0FBQ0Q7O0FBRU0sU0FBU2lDLGNBQVQsQ0FBd0I7QUFBRVYsRUFBQUE7QUFBRixDQUF4QixFQUFzQztBQUMzQ0EsRUFBQUEsUUFBUSxDQUFDO0FBQUVkLElBQUFBLElBQUksRUFBRWhDLFdBQVcsQ0FBQ1E7QUFBcEIsR0FBRCxDQUFSO0FBQ0Q7O0FBR00sZUFBZWlELFlBQWYsQ0FBNEI7QUFBRWxDLEVBQUFBLE1BQUY7QUFBVXVCLEVBQUFBLFFBQVY7QUFBb0JQLEVBQUFBO0FBQXBCLENBQTVCLEVBQTREO0FBQ2pFLE1BQUk7QUFDRk8sSUFBQUEsUUFBUSxDQUFDO0FBQUVkLE1BQUFBLElBQUksRUFBRWhDLFdBQVcsQ0FBQ1M7QUFBcEIsS0FBRCxDQUFSO0FBQ0EsVUFBTWlELFFBQVEsR0FBRyxNQUFNQyxLQUFLLENBQ3pCLHlCQUF3QnBDLE1BQU8sYUFBWWdCLFFBQVMsRUFEM0IsQ0FBNUI7O0FBR0EsUUFBSW1CLFFBQVEsQ0FBQ0UsRUFBYixFQUFpQjtBQUNmLFlBQU07QUFBRXhDLFFBQUFBO0FBQUYsVUFBZSxNQUFNc0MsUUFBUSxDQUFDRyxJQUFULEVBQTNCOztBQUNBLFVBQUl6QyxRQUFRLENBQUMwQyxNQUFULEdBQWtCLENBQXRCLEVBQXlCO0FBQ3ZCaEIsUUFBQUEsUUFBUSxDQUFDO0FBQUVkLFVBQUFBLElBQUksRUFBRWhDLFdBQVcsQ0FBQ1UscUJBQXBCO0FBQTJDVSxVQUFBQTtBQUEzQyxTQUFELENBQVI7QUFDRCxPQUZELE1BRU87QUFDTDBCLFFBQUFBLFFBQVEsQ0FBQztBQUFFZCxVQUFBQSxJQUFJLEVBQUVoQyxXQUFXLENBQUNZO0FBQXBCLFNBQUQsQ0FBUixDQURLOztBQUdMbUQsUUFBQUEsU0FBUyxDQUFDO0FBQUV4QyxVQUFBQSxNQUFGO0FBQVV1QixVQUFBQTtBQUFWLFNBQUQsQ0FBVDtBQUNEO0FBQ0YsS0FURCxNQVNPO0FBQ0xBLE1BQUFBLFFBQVEsQ0FBQztBQUFFZCxRQUFBQSxJQUFJLEVBQUVoQyxXQUFXLENBQUNZO0FBQXBCLE9BQUQsQ0FBUixDQURLOztBQUdMbUQsTUFBQUEsU0FBUyxDQUFDO0FBQUV4QyxRQUFBQSxNQUFGO0FBQVV1QixRQUFBQTtBQUFWLE9BQUQsQ0FBVDtBQUNEO0FBQ0YsR0FuQkQsQ0FtQkUsT0FBT3BCLEtBQVAsRUFBYztBQUVkb0IsSUFBQUEsUUFBUSxDQUFDO0FBQUVkLE1BQUFBLElBQUksRUFBRWhDLFdBQVcsQ0FBQ1csb0JBQXBCO0FBQTBDZSxNQUFBQTtBQUExQyxLQUFELENBQVI7QUFDRDtBQUNGOztBQUVNLGVBQWVxQyxTQUFmLENBQXlCO0FBQUV4QyxFQUFBQSxNQUFGO0FBQVV1QixFQUFBQTtBQUFWLENBQXpCLEVBQStDO0FBQ3BELE1BQUk7QUFDRkEsSUFBQUEsUUFBUSxDQUFDO0FBQUVkLE1BQUFBLElBQUksRUFBRWhDLFdBQVcsQ0FBQ2E7QUFBcEIsS0FBRCxDQUFSO0FBQ0EsVUFBTTZDLFFBQVEsR0FBRyxNQUFNQyxLQUFLLENBQUUsc0JBQXFCcEMsTUFBTyxFQUE5QixDQUE1QjtBQUNBLFVBQU07QUFBRVksTUFBQUE7QUFBRixRQUFZLE1BQU11QixRQUFRLENBQUNHLElBQVQsRUFBeEI7QUFFQWYsSUFBQUEsUUFBUSxDQUFDO0FBQUVkLE1BQUFBLElBQUksRUFBRWhDLFdBQVcsQ0FBQ2Msa0JBQXBCO0FBQXdDcUIsTUFBQUE7QUFBeEMsS0FBRCxDQUFSO0FBQ0QsR0FORCxDQU1FLE9BQU9ULEtBQVAsRUFBYztBQUNkb0IsSUFBQUEsUUFBUSxDQUFDO0FBQUVkLE1BQUFBLElBQUksRUFBRWhDLFdBQVcsQ0FBQ2UsaUJBQXBCO0FBQXVDVyxNQUFBQTtBQUF2QyxLQUFELENBQVI7QUFDRDtBQUNGO0FBRU0sU0FBU3NDLGlCQUFULENBQTJCO0FBQUU5QixFQUFBQSxJQUFGO0FBQVFZLEVBQUFBO0FBQVIsQ0FBM0IsRUFBK0M7QUFFcERBLEVBQUFBLFFBQVEsQ0FBQztBQUFFZCxJQUFBQSxJQUFJLEVBQUVoQyxXQUFXLENBQUNDLG9CQUFwQjtBQUEwQ2lDLElBQUFBO0FBQTFDLEdBQUQsQ0FBUjtBQUNEO0FBTU0sU0FBUytCLFlBQVQsQ0FBc0I7QUFBRTVDLEVBQUFBLE9BQUY7QUFBV3lCLEVBQUFBO0FBQVgsQ0FBdEIsRUFBNkM7QUFDbEQsUUFBTTtBQUFFUCxJQUFBQTtBQUFGLE1BQWVsQixPQUFyQjtBQUNBLFFBQU02QyxHQUFHLEdBQUksR0FBRTNCLFFBQVMsV0FBeEI7QUFDQSxRQUFNakIsUUFBUSxHQUFHeUIsSUFBSSxDQUFDQyxLQUFMLENBQVdDLFlBQVksQ0FBQ0MsT0FBYixDQUFxQmdCLEdBQXJCLENBQVgsQ0FBakI7QUFDQXBCLEVBQUFBLFFBQVEsQ0FBQztBQUFFZCxJQUFBQSxJQUFJLEVBQUVoQyxXQUFXLENBQUNHLGVBQXBCO0FBQXFDbUIsSUFBQUE7QUFBckMsR0FBRCxDQUFSO0FBQ0Q7QUFFTSxTQUFTNkMsV0FBVCxDQUFxQjtBQUFHckIsRUFBQUEsUUFBSDtBQUFhYixFQUFBQSxPQUFiO0FBQXFCTSxFQUFBQSxRQUFyQjtBQUE4QjZCLEVBQUFBO0FBQTlCLENBQXJCLEVBQTZEO0FBRWxFLFFBQU1GLEdBQUcsR0FBSSxHQUFFRSxNQUFPLFdBQXRCO0FBQ0EsUUFBTTlDLFFBQVEsR0FBR3lCLElBQUksQ0FBQ0MsS0FBTCxDQUFXQyxZQUFZLENBQUNDLE9BQWIsQ0FBcUJnQixHQUFyQixDQUFYLENBQWpCOztBQUNBLE1BQUk1QyxRQUFKLEVBQWM7QUFDWjJCLElBQUFBLFlBQVksQ0FBQ0ksT0FBYixDQUFxQmEsR0FBckIsRUFBMEJuQixJQUFJLENBQUNPLFNBQUwsQ0FBZSxDQUFDLEdBQUdoQyxRQUFKLEVBQWEsRUFBQyxHQUFHVyxPQUFKO0FBQVlNLE1BQUFBO0FBQVosS0FBYixDQUFmLENBQTFCO0FBQ0QsR0FGRCxNQUVPO0FBQ0xVLElBQUFBLFlBQVksQ0FBQ0ksT0FBYixDQUFxQmEsR0FBckIsRUFBMEJuQixJQUFJLENBQUNPLFNBQUwsQ0FBZSxDQUFDLEVBQUMsR0FBR3JCLE9BQUo7QUFBWU0sTUFBQUE7QUFBWixLQUFELENBQWYsQ0FBMUI7QUFDRDs7QUFDRE8sRUFBQUEsUUFBUSxDQUFDO0FBQUVkLElBQUFBLElBQUksRUFBRWhDLFdBQVcsQ0FBQ0kscUJBQXBCO0FBQTJDNkIsSUFBQUE7QUFBM0MsR0FBRCxDQUFSO0FBQ0Q7O0FDckZELE1BQU1vQyxjQUFjLEdBQUdDLENBQWEsRUFBcEM7QUFDTyxTQUFTQyxpQkFBVCxHQUE2QjtBQUNsQyxRQUFNQyxPQUFPLEdBQUdDLENBQVUsQ0FBQ0osY0FBRCxDQUExQjs7QUFDQSxNQUFJLENBQUNHLE9BQUwsRUFBYztBQUNaLFVBQU0sSUFBSUUsS0FBSixDQUFVLHNEQUFWLENBQU47QUFDRDs7QUFFRCxTQUFPRixPQUFQO0FBQ0Q7QUFFTSxTQUFTRyxnQkFBVCxDQUEwQkMsS0FBMUIsRUFBaUM7QUFDdEMsUUFBTUMsV0FBVyxHQUFHQyxjQUFjLEVBQWxDO0FBQ0EsUUFBTTtBQUFFdkMsSUFBQUE7QUFBRixNQUFlc0MsV0FBVyxDQUFDL0MsS0FBakM7QUFDQSxRQUFNLENBQUNBLEtBQUQsRUFBUWdCLFFBQVIsSUFBb0JpQyxDQUFVLENBQUNsRCxPQUFELEVBQVVWLFNBQVYsQ0FBcEM7QUFDQSxRQUFNO0FBQUVFLElBQUFBO0FBQUYsTUFBY1MsS0FBcEI7QUFFQWtELEVBQUFBLENBQVMsQ0FBQyxNQUFNO0FBQ2QsUUFBSXpDLFFBQUosRUFBYztBQUNaTSxNQUFBQSxZQUFZLENBQUM7QUFBRU4sUUFBQUEsUUFBRjtBQUFZTyxRQUFBQTtBQUFaLE9BQUQsQ0FBWjtBQUNEO0FBQ0YsR0FKUSxFQUlOLENBQUNQLFFBQUQsQ0FKTSxDQUFUO0FBS0F5QyxFQUFBQSxDQUFTLENBQUMsTUFBTTtBQUNkLFFBQUkzRCxPQUFKLEVBQWE7QUFDWDtBQUNBNEMsTUFBQUEsWUFBWSxDQUFDO0FBQUVuQixRQUFBQSxRQUFGO0FBQVl6QixRQUFBQTtBQUFaLE9BQUQsQ0FBWixDQUZXOztBQUtYLFlBQU02QyxHQUFHLEdBQUksR0FBRTNCLFFBQVMsV0FBeEI7QUFDQSxZQUFNbkIsUUFBUSxHQUFHMkIsSUFBSSxDQUFDQyxLQUFMLENBQVdDLFlBQVksQ0FBQ0MsT0FBYixDQUFxQmdCLEdBQXJCLENBQVgsQ0FBakI7O0FBQ0EsVUFBSSxDQUFDOUMsUUFBTCxFQUFlO0FBQ2I2QixRQUFBQSxZQUFZLENBQUNJLE9BQWIsQ0FBcUJhLEdBQXJCLEVBQTBCbkIsSUFBSSxDQUFDTyxTQUFMLENBQWUsQ0FBQ2pDLE9BQUQsQ0FBZixDQUExQjtBQUNELE9BRkQsTUFFTztBQUNMLGNBQU00RCxZQUFZLEdBQUc3RCxRQUFRLENBQUNxQixJQUFULENBQ2xCSCxDQUFELElBQU9BLENBQUMsQ0FBQ0MsUUFBRixLQUFlbEIsT0FBTyxDQUFDa0IsUUFEWCxDQUFyQjs7QUFHQSxZQUFJMEMsWUFBSixFQUFrQjtBQUNoQixnQkFBTUMsT0FBTyxHQUFHOUQsUUFBUSxDQUFDd0IsR0FBVCxDQUFjTixDQUFELElBQU87QUFDbEMsZ0JBQUlBLENBQUMsQ0FBQ0MsUUFBRixLQUFlbEIsT0FBTyxDQUFDa0IsUUFBM0IsRUFBcUM7QUFDbkMscUJBQU9sQixPQUFQO0FBQ0QsYUFGRCxNQUVPO0FBQ0wscUJBQU9pQixDQUFQO0FBQ0Q7QUFDRixXQU5lLENBQWhCO0FBT0FXLFVBQUFBLFlBQVksQ0FBQ0ksT0FBYixDQUFxQmEsR0FBckIsRUFBMEJuQixJQUFJLENBQUNPLFNBQUwsQ0FBZTRCLE9BQWYsQ0FBMUI7QUFDRCxTQVRELE1BU087QUFDTGpDLFVBQUFBLFlBQVksQ0FBQ0ksT0FBYixDQUFxQmEsR0FBckIsRUFBMEJuQixJQUFJLENBQUNPLFNBQUwsQ0FBZSxDQUFDakMsT0FBRCxDQUFmLENBQTFCO0FBRUQ7QUFDRjtBQUNGO0FBQ0YsR0E3QlEsRUE2Qk4sQ0FBQ0EsT0FBRCxDQTdCTSxDQUFUO0FBK0JBLFFBQU04RCxLQUFLLEdBQUdDLENBQU8sQ0FBQyxNQUFNLENBQUN0RCxLQUFELEVBQVFnQixRQUFSLENBQVAsRUFBMEIsQ0FBQ2hCLEtBQUQsQ0FBMUIsQ0FBckI7QUFDQSxTQUFPLEVBQUMsY0FBRCxDQUFnQixRQUFoQjtBQUF5QixJQUFBLEtBQUssRUFBRXFEO0FBQWhDLEtBQTJDUCxLQUEzQyxFQUFQO0FBQ0Q7O0FDeEVNLFNBQVNTLG1CQUFULENBQTZCO0FBQUVoRSxFQUFBQSxPQUFGO0FBQVdrQixFQUFBQTtBQUFYLENBQTdCLEVBQW9EO0FBQ3ZELFFBQU0yQixHQUFHLEdBQUksR0FBRTNCLFFBQVMsV0FBeEI7QUFDQSxRQUFNbkIsUUFBUSxHQUFHMkIsSUFBSSxDQUFDQyxLQUFMLENBQVdDLFlBQVksQ0FBQ0MsT0FBYixDQUFxQmdCLEdBQXJCLENBQVgsQ0FBakI7O0FBQ0EsTUFBSTlDLFFBQUosRUFBYztBQUNWLFVBQU11QixhQUFhLEdBQUd2QixRQUFRLENBQUNxQixJQUFULENBQWNILENBQUMsSUFBSUEsQ0FBQyxDQUFDQyxRQUFGLEtBQWVsQixPQUFPLENBQUNrQixRQUExQyxDQUF0Qjs7QUFDQSxRQUFJSSxhQUFKLEVBQW1CO0FBQ2YsWUFBTTJDLGNBQWMsR0FBR2xFLFFBQVEsQ0FBQ3dCLEdBQVQsQ0FBYU4sQ0FBQyxJQUFJO0FBQ3JDLFlBQUlBLENBQUMsQ0FBQ0MsUUFBRixLQUFlbEIsT0FBTyxDQUFDa0IsUUFBM0IsRUFBcUM7QUFDakMsaUJBQU9sQixPQUFQO0FBQ0gsU0FGRCxNQUdLO0FBQ0QsaUJBQU9pQixDQUFQO0FBQ0g7QUFDSixPQVBzQixDQUF2QjtBQVFBVyxNQUFBQSxZQUFZLENBQUNJLE9BQWIsQ0FBcUJhLEdBQXJCLEVBQTBCbkIsSUFBSSxDQUFDTyxTQUFMLENBQWVnQyxjQUFmLENBQTFCO0FBQ0gsS0FWRCxNQVVPO0FBQ0hyQyxNQUFBQSxZQUFZLENBQUNJLE9BQWIsQ0FBcUJhLEdBQXJCLEVBQTBCbkIsSUFBSSxDQUFDTyxTQUFMLENBQWUsQ0FBQ2xDLFFBQUQsRUFBV0MsT0FBWCxDQUFmLENBQTFCO0FBQ0g7QUFDSixHQWZELE1BZ0JLO0FBQ0Q0QixJQUFBQSxZQUFZLENBQUNJLE9BQWIsQ0FBcUJhLEdBQXJCLEVBQTBCbkIsSUFBSSxDQUFDTyxTQUFMLENBQWUsQ0FBQ2pDLE9BQUQsQ0FBZixDQUExQjtBQUNIO0FBQ0o7O0FDaEJNLFNBQVNrRSxTQUFULENBQW1CO0FBQUV6QyxFQUFBQSxRQUFGO0FBQVlQLEVBQUFBO0FBQVosQ0FBbkIsRUFBMkM7QUFDaEQsUUFBTWlELGFBQWEsR0FBR0MsaUJBQWlCLEVBQXZDO0FBQ0EsUUFBTTtBQUFFQyxJQUFBQTtBQUFGLE1BQWFGLGFBQWEsQ0FBQyxDQUFELENBQWhDO0FBRUFSLEVBQUFBLENBQVMsQ0FBQyxNQUFNO0FBQ2QsUUFBSVUsTUFBTSxJQUFJbkQsUUFBZCxFQUF3QjtBQUN0Qm1ELE1BQUFBLE1BQU0sQ0FBQ0MsU0FBUCxHQUFvQjFELE9BQUQsSUFBYTtBQUM5QixjQUFNWixPQUFPLEdBQUcwQixJQUFJLENBQUNDLEtBQUwsQ0FBV2YsT0FBTyxDQUFDMkQsSUFBbkIsQ0FBaEI7QUFDQTtBQUNBUCxRQUFBQSxtQkFBbUIsQ0FBQztBQUFDaEUsVUFBQUEsT0FBRDtBQUFTa0IsVUFBQUE7QUFBVCxTQUFELENBQW5CO0FBQ0FPLFFBQUFBLFFBQVEsQ0FBQztBQUFDZCxVQUFBQSxJQUFJLEVBQUNoQyxXQUFXLENBQUNpQixnQkFBbEI7QUFBb0NJLFVBQUFBO0FBQXBDLFNBQUQsQ0FBUjtBQUNELE9BTEQ7O0FBTUFxRSxNQUFBQSxNQUFNLENBQUNHLE9BQVAsR0FBaUIsTUFBTSxFQUF2Qjs7QUFHQUgsTUFBQUEsTUFBTSxDQUFDSSxPQUFQLEdBQWtCcEUsS0FBRCxJQUFXLEVBQTVCOztBQUlBZ0UsTUFBQUEsTUFBTSxDQUFDSyxNQUFQLEdBQWdCLE1BQU07QUFDcEI7QUFFRCxPQUhEO0FBSUQ7QUFDRixHQXBCUSxFQW9CTixDQUFDTCxNQUFELEVBQVNuRCxRQUFULENBcEJNLENBQVQ7QUFzQkEsU0FBTyxJQUFQO0FBRUQ7O0FDaEJNLFNBQVN5RCxXQUFULEdBQXVCO0FBQzVCLFFBQU1SLGFBQWEsR0FBR0MsaUJBQWlCLEVBQXZDO0FBQ0EsUUFBTTtBQUFFQyxJQUFBQTtBQUFGLE1BQWFGLGFBQWEsQ0FBQyxDQUFELENBQWhDO0FBQ0EsUUFBTVgsV0FBVyxHQUFHQyxjQUFjLEVBQWxDO0FBQ0EsUUFBTTtBQUFFdkMsSUFBQUE7QUFBRixNQUFlc0MsV0FBVyxDQUFDL0MsS0FBakM7QUFDQSxRQUFNLENBQUNBLEtBQUQsRUFBUWdCLFFBQVIsSUFBb0J5QixpQkFBaUIsRUFBM0M7QUFDQSxRQUFNO0FBQUVsRCxJQUFBQSxPQUFGO0FBQVdELElBQUFBLFFBQVg7QUFBcUJHLElBQUFBLE1BQXJCO0FBQTZCWSxJQUFBQSxLQUE3QjtBQUFvQ1IsSUFBQUEsV0FBcEM7QUFBaURMLElBQUFBO0FBQWpELE1BQThEUSxLQUFwRTtBQUNBLFFBQU1tRSxZQUFZLEdBQUdWLFNBQVMsQ0FBQztBQUFFekMsSUFBQUEsUUFBRjtBQUFZekIsSUFBQUEsT0FBWjtBQUFxQmtCLElBQUFBO0FBQXJCLEdBQUQsQ0FBOUI7O0FBQ0EsV0FBUzJELGVBQVQsQ0FBeUJDLENBQXpCLEVBQTRCO0FBQzFCLFVBQU01RCxRQUFRLEdBQUc0RCxDQUFDLENBQUMvQixNQUFGLENBQVNnQyxFQUExQjtBQUNBakQsSUFBQUEsYUFBYSxDQUFDO0FBQUVMLE1BQUFBLFFBQUY7QUFBWVAsTUFBQUE7QUFBWixLQUFELENBQWI7QUFDRDs7QUFDRCxXQUFTOEQsWUFBVCxDQUFzQkYsQ0FBdEIsRUFBeUI7QUFDdkIsVUFBTUcsS0FBSyxHQUFHSCxDQUFDLENBQUMvQixNQUFGLENBQVNnQyxFQUF2QjtBQUNBLFVBQU01RSxJQUFJLEdBQUdXLEtBQUssQ0FBQ00sSUFBTixDQUFZOEQsQ0FBRCxJQUFPQSxDQUFDLENBQUNoRSxRQUFGLEtBQWUrRCxLQUFqQyxDQUFiO0FBQ0FsRCxJQUFBQSxVQUFVLENBQUM7QUFBRU4sTUFBQUEsUUFBRjtBQUFZdEIsTUFBQUEsSUFBWjtBQUFrQmUsTUFBQUE7QUFBbEIsS0FBRCxDQUFWO0FBQ0Q7O0FBQ0QsV0FBU2lFLFFBQVQsQ0FBa0JMLENBQWxCLEVBQXFCO0FBQ25CNUMsSUFBQUEsY0FBYyxDQUFDO0FBQUVoQyxNQUFBQSxNQUFNLEVBQUU0RSxDQUFDLENBQUMvQixNQUFGLENBQVNlLEtBQW5CO0FBQTBCckMsTUFBQUE7QUFBMUIsS0FBRCxDQUFkO0FBQ0Q7O0FBQ0QsV0FBUzJELGFBQVQsQ0FBdUJOLENBQXZCLEVBQTBCO0FBQ3hCLFFBQUkvRSxRQUFRLElBQUlBLFFBQVEsQ0FBQzBDLE1BQVQsR0FBa0IsQ0FBbEMsRUFBcUM7QUFDbkNOLE1BQUFBLGNBQWMsQ0FBQztBQUFFVixRQUFBQTtBQUFGLE9BQUQsQ0FBZDtBQUNEOztBQUNEVyxJQUFBQSxZQUFZLENBQUM7QUFBRVgsTUFBQUEsUUFBRjtBQUFZdkIsTUFBQUEsTUFBWjtBQUFvQmdCLE1BQUFBO0FBQXBCLEtBQUQsQ0FBWjtBQUNEOztBQUNELFdBQVNtRSxhQUFULENBQXVCUCxDQUF2QixFQUEwQjtBQUN4QixVQUFNakUsSUFBSSxHQUFHaUUsQ0FBQyxDQUFDL0IsTUFBRixDQUFTZSxLQUF0QjtBQUNBbkIsSUFBQUEsaUJBQWlCLENBQUM7QUFBRWxCLE1BQUFBLFFBQUY7QUFBWVosTUFBQUE7QUFBWixLQUFELENBQWpCO0FBQ0Q7O0FBQ0QsV0FBU3lFLFNBQVQsQ0FBbUJSLENBQW5CLEVBQXNCO0FBQ3BCLFVBQU1TLE9BQU8sR0FBR1QsQ0FBQyxDQUFDL0IsTUFBRixDQUFTZ0MsRUFBekI7QUFDQSxVQUFNO0FBQUU3RCxNQUFBQSxRQUFGO0FBQVlzRSxNQUFBQTtBQUFaLFFBQXNCeEYsT0FBNUI7QUFDQSxRQUFJWSxPQUFPLEdBQUcsSUFBZDs7QUFDQSxRQUFJTixXQUFKLEVBQWlCO0FBQ2ZNLE1BQUFBLE9BQU8sR0FBRztBQUFFQyxRQUFBQSxJQUFJLEVBQUVQLFdBQVI7QUFBcUJtRixRQUFBQSxTQUFTLEVBQUVDLElBQUksQ0FBQ0MsR0FBTDtBQUFoQyxPQUFWO0FBQ0E3QyxNQUFBQSxXQUFXLENBQUM7QUFBRXJCLFFBQUFBLFFBQUY7QUFBWXpCLFFBQUFBLE9BQVo7QUFBcUJZLFFBQUFBLE9BQXJCO0FBQThCbUMsUUFBQUEsTUFBTSxFQUFFN0IsUUFBdEM7QUFBZ0RBLFFBQUFBLFFBQVEsRUFBRXNDLFdBQVcsQ0FBQy9DLEtBQVosQ0FBa0JTO0FBQTVFLE9BQUQsQ0FBWDtBQUNEOztBQUNELFVBQU0rQyxjQUFjLEdBQUc7QUFDckIvQyxNQUFBQSxRQURxQjtBQUVyQnNFLE1BQUFBLEtBRnFCO0FBR3JCNUUsTUFBQUE7QUFIcUIsS0FBdkI7QUFLQXlELElBQUFBLE1BQU0sQ0FBQ3VCLElBQVAsQ0FDRWxFLElBQUksQ0FBQ08sU0FBTCxDQUFlLEVBQUUsR0FBR2dDLGNBQUw7QUFBcUJzQixNQUFBQTtBQUFyQixLQUFmLENBREY7QUFHQXZCLElBQUFBLG1CQUFtQixDQUFDO0FBQUVoRSxNQUFBQSxPQUFGO0FBQVdrQixNQUFBQSxRQUFYO0FBQXFCMkUsTUFBQUEsU0FBUyxFQUFFO0FBQWhDLEtBQUQsQ0FBbkI7QUFDRDs7QUFDRCxTQUFPO0FBQ0xSLElBQUFBLGFBREs7QUFFTC9FLElBQUFBLFdBRks7QUFHTDhFLElBQUFBLGFBSEs7QUFJTEQsSUFBQUEsUUFKSztBQUtMakYsSUFBQUEsTUFMSztBQU1MMkUsSUFBQUEsZUFOSztBQU9MRyxJQUFBQSxZQVBLO0FBUUxoRixJQUFBQSxPQVJLO0FBU0xELElBQUFBLFFBVEs7QUFVTGUsSUFBQUEsS0FWSztBQVdMSSxJQUFBQSxRQVhLO0FBWUxqQixJQUFBQSxRQVpLO0FBYUxxRixJQUFBQTtBQWJLLEdBQVA7QUFlRDs7QUMzRUQsTUFBTVEsUUFBUSxHQUFHQyxDQUFJLENBQUMsTUFBTSxPQUFPLHVCQUFQLENBQVAsQ0FBckI7QUFDQSxNQUFNQyxLQUFLLEdBQUdELENBQUksQ0FBQyxNQUFNLE9BQU8scUJBQVAsQ0FBUCxDQUFsQjtBQUNBLE1BQU1FLE9BQU8sR0FBR0YsQ0FBSSxDQUFDLE1BQU0sT0FBTyx1QkFBUCxDQUFQLENBQXBCO0FBQ0EsTUFBTUcsU0FBUyxHQUFHSCxDQUFJLENBQUMsTUFBTSxPQUFPLHlCQUFQLENBQVAsQ0FBdEI7QUFDQSxNQUFNSSxRQUFRLEdBQUdKLENBQUksQ0FBQyxNQUFNLE9BQU8sd0JBQVAsQ0FBUCxDQUFyQjtBQUNBLE1BQU1LLE1BQU0sR0FBR0wsQ0FBSSxDQUFDLE1BQU0sT0FBTyxzQkFBUCxDQUFQLENBQW5CO0FBQ0EsTUFBTU0sT0FBTyxHQUFHTixDQUFJLENBQUMsTUFBTSxPQUFPLHVCQUFQLENBQVAsQ0FBcEI7QUFDQSxNQUFNTyxPQUFPLEdBQUdQLENBQUksQ0FBQyxNQUFNLE9BQU8sdUJBQVAsQ0FBUCxDQUFwQjtBQUVlLFNBQVNRLE1BQVQsR0FBa0I7QUFDL0IsUUFBTSxDQUFDQyxLQUFELEVBQVFDLFFBQVIsSUFBb0JDLGVBQWUsRUFBekM7QUFDQSxRQUFNO0FBQ0oxRyxJQUFBQSxPQURJO0FBRUpELElBQUFBLFFBRkk7QUFHSnVGLElBQUFBLFNBSEk7QUFJSlQsSUFBQUEsZUFKSTtBQUtKRyxJQUFBQSxZQUxJO0FBTUpHLElBQUFBLFFBTkk7QUFPSnJFLElBQUFBLEtBUEk7QUFRSlosSUFBQUEsTUFSSTtBQVNKa0YsSUFBQUEsYUFUSTtBQVVKQyxJQUFBQSxhQVZJO0FBV0ovRSxJQUFBQSxXQVhJO0FBWUpZLElBQUFBLFFBWkk7QUFhSmpCLElBQUFBO0FBYkksTUFjRjBFLFdBQVcsRUFkZjtBQWVBaEIsRUFBQUEsQ0FBUyxDQUFDLE1BQU07QUFDZCxRQUFJM0QsT0FBSixFQUFhO0FBQ1h5RyxNQUFBQSxRQUFRLENBQUUsSUFBR3pHLE9BQU8sQ0FBQ1MsS0FBTSxFQUFuQixDQUFSO0FBQ0Q7QUFDRixHQUpRLEVBSU4sQ0FBQ1QsT0FBRCxDQUpNLENBQVQ7QUFLQSxTQUNFO0FBQUssSUFBQSxLQUFLLEVBQUU7QUFBRTJHLE1BQUFBLE1BQU0sRUFBRTtBQUFWO0FBQVosS0FDRSxFQUFDLEtBQUQ7QUFBTyxJQUFBLElBQUksRUFBQztBQUFaLEtBQ0UsRUFBQ0MsQ0FBRDtBQUFVLElBQUEsUUFBUSxFQUFFO0FBQXBCLEtBQ0UsRUFBQyxRQUFEO0FBQ0UsSUFBQSxLQUFLLEVBQUU5RixLQURUO0FBRUUsSUFBQSxNQUFNLEVBQUVaLE1BRlY7QUFHRSxJQUFBLFFBQVEsRUFBRUgsUUFIWjtBQUlFLElBQUEsZUFBZSxFQUFFOEUsZUFKbkI7QUFLRSxJQUFBLFlBQVksRUFBRUcsWUFMaEI7QUFNRSxJQUFBLFFBQVEsRUFBRUcsUUFOWjtBQU9FLElBQUEsYUFBYSxFQUFFQztBQVBqQixJQURGLENBREYsQ0FERixFQWNFLEVBQUMsS0FBRDtBQUFPLElBQUEsSUFBSSxFQUFDO0FBQVosS0FDRSxFQUFDd0IsQ0FBRDtBQUFVLElBQUEsUUFBUSxFQUFFO0FBQXBCLEtBQ0UsRUFBQyxLQUFEO0FBQU8sSUFBQSxPQUFPLEVBQUU1RyxPQUFoQjtBQUF5QixJQUFBLE9BQU8sRUFBRXNGO0FBQWxDLElBREYsQ0FERixDQWRGLEVBbUJFLEVBQUMsS0FBRDtBQUFPLElBQUEsSUFBSSxFQUFDO0FBQVosS0FDRSxFQUFDc0IsQ0FBRDtBQUFVLElBQUEsUUFBUSxFQUFFO0FBQXBCLEtBQ0UsRUFBQyxPQUFEO0FBQVMsSUFBQSxPQUFPLEVBQUU1RyxPQUFsQjtBQUEyQixJQUFBLFNBQVMsRUFBRXNGO0FBQXRDLElBREYsQ0FERixDQW5CRixFQXdCRSxFQUFDLEtBQUQ7QUFBTyxJQUFBLElBQUksRUFBQztBQUFaLEtBQ0UsRUFBQ3NCLENBQUQ7QUFBVSxJQUFBLFFBQVEsRUFBRTtBQUFwQixLQUNFLEVBQUMsU0FBRDtBQUFXLElBQUEsT0FBTyxFQUFFNUc7QUFBcEIsSUFERixDQURGLENBeEJGLEVBNkJFLEVBQUMsS0FBRDtBQUFPLElBQUEsS0FBSyxFQUFFLENBQUMsV0FBRCxFQUFhLFdBQWIsRUFBeUIsWUFBekIsRUFBc0MsV0FBdEM7QUFBZCxLQUNFLEVBQUM0RyxDQUFEO0FBQVUsSUFBQSxRQUFRLEVBQUU7QUFBcEIsS0FDRSxFQUFDLFFBQUQ7QUFDRSxJQUFBLGFBQWEsRUFBRXZCLGFBRGpCO0FBRUUsSUFBQSxTQUFTLEVBQUVDLFNBRmI7QUFHRSxJQUFBLFFBQVEsRUFBRXJGLFFBSFo7QUFJRSxJQUFBLFFBQVEsRUFBRWlCO0FBSlosSUFERixDQURGLENBN0JGLEVBd0NFLEVBQUMsS0FBRDtBQUFPLElBQUEsSUFBSSxFQUFDO0FBQVosS0FDRSxFQUFDMEYsQ0FBRDtBQUFVLElBQUEsUUFBUSxFQUFFO0FBQXBCLEtBQ0UsRUFBQyxNQUFEO0FBQ0UsSUFBQSxPQUFPLEVBQUU1RyxPQURYO0FBRUUsSUFBQSxRQUFRLEVBQUVzRixTQUZaO0FBR0UsSUFBQSxhQUFhLEVBQUVELGFBSGpCO0FBSUUsSUFBQSxXQUFXLEVBQUUvRTtBQUpmLElBREYsQ0FERixDQXhDRixFQWtERSxFQUFDLEtBQUQ7QUFBTyxJQUFBLElBQUksRUFBQztBQUFaLEtBQ0UsRUFBQ3NHLENBQUQ7QUFBVSxJQUFBLFFBQVEsRUFBRTtBQUFwQixLQUNFLEVBQUMsT0FBRDtBQUFTLElBQUEsT0FBTyxFQUFFNUc7QUFBbEIsSUFERixDQURGLENBbERGLEVBdURFLEVBQUMsS0FBRDtBQUFPLElBQUEsSUFBSSxFQUFDO0FBQVosS0FDRSxFQUFDNEcsQ0FBRDtBQUFVLElBQUEsUUFBUSxFQUFFO0FBQXBCLEtBQ0UsRUFBQyxPQUFEO0FBQVMsSUFBQSxPQUFPLEVBQUU1RyxPQUFsQjtBQUEyQixJQUFBLFFBQVEsRUFBRXNGO0FBQXJDLElBREYsQ0FERixDQXZERixDQURGO0FBK0REOztBQ2hHYyxrQkFBWTtBQUN6QixTQUNFLEVBQUMsZ0JBQUQsUUFDRSxFQUFDLGFBQUQ7QUFBZSxJQUFBLFlBQVksRUFBQztBQUE1QixLQUNFLEVBQUMsTUFBRCxPQURGLENBREYsQ0FERjtBQU9EOzs7OyJ9
