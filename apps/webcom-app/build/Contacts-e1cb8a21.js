import { h, _ as _extends, M, T, m, s, a as actionTypes$2, u as useAuthContext, b as useContactsContext, p, L as ListItem, c as List, v } from './index-a04d6f3b.js';
import { P as Paper } from './Paper-ade0761f.js';

const style = {
  padding: 8,
  marginLeft: 16,
  marginRight: 16,
  marginTop: 8,
  marginBottom: 8,
  boxSizing: 'border-box',
  flex: 1
};
function TextInput(props) {
  const {
    id
  } = props;
  return h("div", {
    style: {
      display: 'flex',
      width: '100%'
    }
  }, h("input", _extends({
    style: style
  }, props, {
    "data-testid": id
  })));
}

const style$1 = {
  width: 56,
  height: 56,
  backgroundColor: 'yellow',
  borderRadius: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};
function Fab({
  children
}) {
  return h("div", null, h("div", {
    style: style$1
  }, children));
}

function AddIcon() {
  return h("svg", {
    height: "24",
    viewBox: "0 0 24 24",
    width: "24"
  }, h("path", {
    d: "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"
  }), h("path", {
    d: "M0 0h24v24H0z",
    fill: "none"
  }));
}

var actionTypes = {
  SEND_INVITATION_STARTED: 'SEND_INVITATION_STARTED',
  SEND_INVITATION_SUCCESS: 'SEND_INVITATION_SUCCESS',
  SEND_INVITATION_FAILED: 'SEND_INVITATION_FAILED',
  ACCEPT_INVITATION_STARTED: 'ACCEPT_INVITATION_STARTED',
  ACCEPT_INVITATION_SUCCESS: 'ACCEPT_INVITATION_SUCCESS',
  ACCEPT_INVITATION_FAILED: 'ACCEPT_INVITATION_FAILED',
  DECLINE_INVITATION_STARTED: 'DECLINE_INVITATION_STARTED',
  DECLINE_INVITATION_SUCCESS: 'DECLINE_INVITATION_SUCCESS',
  DECLINE_INVITATION_FAILED: 'DECLINE_INVITATION_FAILED',
  FETCH_INVITATIONS_STARTED: 'FETCH_INVITATIONS_STARTED',
  FETCH_INVITATIONS_SUCCESS: 'FETCH_INVITATIONS_SUCCESS',
  FETCH_INVITATIONS_FAILED: 'FETCH_INVITATIONS_FAILED',
  OPEN_INVITATION: 'OPEN_INVITATION',
  CLOSE_INVITATION: 'CLOSE_INVITATION'
};

function openInvitation({
  dispatch,
  invitation
}) {
  dispatch({
    type: actionTypes.OPEN_INVITATION,
    invitation
  });
}

const initState = {
  error: null,
  loading: false,
  invitations: []
};
function invitationReducer(state, action) {
  switch (action.type) {
    case actionTypes.SEND_INVITATION_STARTED:
      return { ...state,
        loading: true
      };

    case actionTypes.SEND_INVITATION_SUCCESS:
      return { ...state,
        loading: false
      };

    case actionTypes.SEND_INVITATION_FAILED:
      return { ...state,
        loading: false,
        error: action.error
      };

    case actionTypes.FETCH_INVITATIONS_STARTED:
      return { ...state,
        loading: true
      };

    case actionTypes.FETCH_INVITATIONS_SUCCESS:
      return { ...state,
        loading: false
      };

    case actionTypes.FETCH_INVITATIONS_FAILED:
      return { ...state,
        loading: false,
        error: action.error
      };

    case actionTypes.OPEN_INVITATION:
      return { ...state,
        invitations: [...state.invitations, action.invitation]
      };

    case actionTypes.CLOSE_INVITATION:
      return { ...state,
        invitation: state.invitations.filter(inv => inv.reciever !== action.reciever)
      };

    default:
      return state;
  }
}

const InvitationContext = M();

function useInvitationContext() {
  const context = T(InvitationContext);

  if (!context) {
    throw new Error('useInvitationContext must be used with InvitationProvider');
  }

  const [state, dispatch] = context;
  return {
    state,
    dispatch
  };
}

function InvitationProvider(props) {
  const [state, dispatch] = m(invitationReducer, initState);
  const value = s(() => [state, dispatch], [state]);
  return h(InvitationContext.Provider, _extends({
    value: value
  }, props));
}

async function fetchUsersInContact({
  dispatch
}) {
  try {
    dispatch({
      type: actionTypes$2.FETCH_USERS_IN_CONTACT_STARTED
    });
    const response = await fetch('http://localhost:3000/contacts/find');
    const {
      contacts
    } = await response.json();
    localStorage.setItem('contacts', JSON.stringify(contacts));
    dispatch({
      type: actionTypes$2.FETCH_USERS_IN_CONTACT_SUCCESS,
      contacts
    });
  } catch (error) {
    dispatch({
      type: actionTypes$2.FETCH_USERS_IN_CONTACT_FAILED,
      error
    });
  }
}
async function fetchUsers({
  dispatch,
  filter
}) {
  try {
    dispatch({
      type: actionTypes$2.FETCH_USERS_STARTED
    });
    const response = await fetch(`http://localhost:3000/users/find?filter=${filter}`);
    const {
      users
    } = await response.json();
    dispatch({
      type: actionTypes$2.FETCH_USERS_SUCCESS,
      users
    });
  } catch (error) {
    dispatch({
      type: actionTypes$2.FETCH_USERS_FAILED,
      error
    });
  }
}
function getLocalContacts({
  dispatch
}) {
  try {
    dispatch({
      type: actionTypes$2.FETCH_LOCAL_CONTACTS_STARTED
    });
    const contacts = JSON.parse(localStorage.getItem('contacts')) ? JSON.parse(localStorage.getItem('contacts')) : [];
    dispatch({
      type: actionTypes$2.FETCH_LOCAL_CONTACTS_SUCCESS,
      contacts
    });
  } catch (error) {
    dispatch({
      type: actionTypes$2.FETCH_LOCAL_CONTACTS_FAILED,
      error
    });
  }
}
function findLocalContact({
  dispatch,
  filter
}) {
  try {
    dispatch({
      type: actionTypes$2.FIND_LOCAL_CONTACT_STARTED
    });
    const query = JSON.parse(localStorage.getItem('contacts')).filter(c => c.username.includes(filter));
    const filtered = query ? query : [];
    dispatch({
      type: actionTypes$2.FIND_LOCAL_CONTACT_SUCCESS,
      contacts: filtered
    });
  } catch (error) {
    dispatch({
      type: actionTypes$2.FIND_LOCAL_CONTACT_FAILED,
      error
    });
  }
} // export function selectUser({ dispatch, userName }) {
//   debugger;
//   dispatch({
//     type: actionTypes.USER_SELECTED,
//     userName,
//   });
// }

function Users({
  filter
}) {
  const {
    dispatch: invitDispatch
  } = useInvitationContext();
  const {
    state: authState
  } = useAuthContext();
  const {
    state,
    dispatch
  } = useContactsContext();
  const {
    users
  } = state;
  p(() => {
    if (state.contacts.length === 0 && filter && filter.length >= 4) {
      fetchUsers({
        dispatch,
        filter
      });
    }
  }, [state.contacts, filter]);

  function handleSelectUser(e) {
    const invitation = {
      sender: authState.username,
      reciever: e.target.id
    };
    openInvitation({
      dispatch: invitDispatch,
      invitation
    });
  }

  return h(List, {
    id: "users"
  }, users && users.length > 0 && users.map(c => {
    return h(ListItem, {
      id: c.username,
      onClick: handleSelectUser
    }, c.username);
  }));
}

var actionTypes$1 = {
  OPEN_ROOM: 'OPEN_ROOM',
  CLOSE_ROOM: 'CLOSE_ROOM'
};

const initState$1 = {
  rooms: []
};
function roomReducer(state, action) {
  switch (action.type) {
    case actionTypes$1.OPEN_ROOM:
      return { ...state,
        rooms: [...state.rooms, action.room]
      };

    case actionTypes$1.CLOSE_ROOM:
      return { ...state,
        rooms: state.rooms.filter(r.username !== action.room.username)
      };

    default:
      return state;
  }
}

const RoomContext = M();

function useRoomContext() {
  const context = T(RoomContext);

  if (!context) {
    throw new Error('useRoomContext must be used with RoomProvider');
  }

  const [state, dispatch] = context;
  return {
    state,
    dispatch
  };
}

function RoomProvider(props) {
  const [state, dispatch] = m(roomReducer, initState$1);
  const value = s(() => [state, dispatch], [state]);
  return h(RoomContext.Provider, _extends({
    value: value
  }, props));
}

function openRoom({
  dispatch,
  room
}) {
  debugger;
  dispatch({
    type: actionTypes$1.OPEN_ROOM,
    room
  });
}

function UsersInContact({
  filter
}) {
  const {
    state: roomState,
    dispatch: roomDispatch
  } = useRoomContext();
  const {
    state,
    dispatch
  } = useContactsContext();
  const {
    contacts
  } = state;
  p(() => {
    if (localStorage.getItem('contacts')) {
      getLocalContacts({
        dispatch
      });
    } else {
      fetchUsersInContact({
        dispatch
      });
    }
  }, []);
  p(() => {
    if (filter) {
      findLocalContact({
        dispatch,
        filter
      });
    }
  }, [filter]);

  function handleSelectContact(e) {
    debugger;
    const room = state.contacts.find(c => c.username === e.target.id);
    openRoom({
      dispatch: roomDispatch,
      room
    });
  }

  return h(List, {
    id: "usersincontact"
  }, contacts && contacts.length > 0 && contacts.map(c => {
    return h(ListItem, {
      id: c.username,
      onClick: handleSelectContact
    }, c.username);
  }));
}

function Position({
  children
}) {
  return h("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      right: 0
    }
  }, children);
}

function Invitations({
  id
}) {
  const {
    state
  } = useInvitationContext();
  const {
    invitations
  } = state;
  return h(Position, null, h("div", {
    "data-testid": id
  }, invitations && invitations.length > 0 && invitations.map(inv => {
    debugger;
    return h(Invitation, {
      invitation: inv
    });
  })));
}
function Invitation({
  invitation
}) {
  return h("div", {
    "data-testid": invitation.reciever
  }, "Invitation,", invitation.reciever);
}

function TextChat({
  room
}) {
  return h("div", {
    "data-testid": room.username
  }, "TextChat,", room.username);
}

function Rooms({
  id
}) {
  const {
    state,
    dispatch
  } = useRoomContext();
  const {
    rooms
  } = state;
  return h(Position, null, h("div", {
    "data-testid": "rooms"
  }, rooms && rooms.length > 0 && rooms.map(r => {
    return h(Room, {
      room: r
    });
  })));
}
function Room({
  room
}) {
  return h("div", {
    "data-testid": "room"
  }, h(TextChat, {
    room: room
  }));
}

function Contacts() {
  const {
    state
  } = useContactsContext();
  const [filter, setFilter] = v(null);

  function handleFilter(e) {
    setFilter(e.target.value);
  }

  return h(InvitationProvider, null, h(RoomProvider, null, h("div", {
    style: {
      display: 'flex'
    },
    "data-testid": "contact-list"
  }, h(Paper, null, h(NewConversation, {
    onChange: handleFilter
  }), h(UsersInContact, {
    filter: filter
  }), h(Users, {
    filter: filter
  }), h(Invitations, {
    id: "invitations"
  }), h(Rooms, {
    id: "rooms"
  })))));
}

function NewConversation({
  onChange
}) {
  const [newConversation, setNewConversation] = v(false);

  function handleNewConversation() {
    setNewConversation(true);
  }

  return h(List, null, newConversation ? h(TextInput, {
    onChange: onChange,
    placeholder: "Enter username or email",
    id: "contactsearch"
  }) : h(ListItem, {
    onClick: handleNewConversation,
    id: "conversation"
  }, h(Fab, null, h(AddIcon, null)), h("div", null, "New Conversation")));
}

export default Contacts;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udGFjdHMtZTFjYjhhMjEuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9sYXlvdXQvVGV4dElucHV0LmpzIiwiLi4vLi4vLi4vY2xpZW50L2xheW91dC9GYWIuanMiLCIuLi8uLi8uLi9jbGllbnQvbGF5b3V0L2ljb25zL0FkZEljb24uanMiLCIuLi8uLi8uLi9jbGllbnQvY2hhdC9jb250YWN0cy9pbnZpdGF0aW9ucy9hY3Rpb25UeXBlcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9jaGF0L2NvbnRhY3RzL2ludml0YXRpb25zL2FjdGlvbnMuanMiLCIuLi8uLi8uLi9jbGllbnQvY2hhdC9jb250YWN0cy9pbnZpdGF0aW9ucy9pbnZpdGF0aW9uUmVkdWNlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9jaGF0L2NvbnRhY3RzL2ludml0YXRpb25zL2ludml0YXRpb24tY29udGV4dC5qcyIsIi4uLy4uLy4uL2NsaWVudC9jaGF0L2NvbnRhY3RzL2FjdGlvbnMuanMiLCIuLi8uLi8uLi9jbGllbnQvY2hhdC9jb250YWN0cy91c2Vycy9Vc2Vycy5qcyIsIi4uLy4uLy4uL2NsaWVudC9jaGF0L2NvbnRhY3RzL3Jvb21zL2FjdGlvblR5cGVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L2NoYXQvY29udGFjdHMvcm9vbXMvcm9vbVJlZHVjZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvY2hhdC9jb250YWN0cy9yb29tcy9yb29tLWNvbnRleHQuanMiLCIuLi8uLi8uLi9jbGllbnQvY2hhdC9jb250YWN0cy9yb29tcy9hY3Rpb25zLmpzIiwiLi4vLi4vLi4vY2xpZW50L2NoYXQvY29udGFjdHMvdXNlcnMtaW4tY29udGFjdC9Vc2Vyc0luQ29udGFjdC5qcyIsIi4uLy4uLy4uL2NsaWVudC9sYXlvdXQvUG9zaXRpb24uanMiLCIuLi8uLi8uLi9jbGllbnQvY2hhdC9jb250YWN0cy9pbnZpdGF0aW9ucy9JbnZpdGF0aW9ucy5qcyIsIi4uLy4uLy4uL2NsaWVudC9jaGF0L2NvbnRhY3RzL3RleHQtY2hhdC9UZXh0Q2hhdC5qcyIsIi4uLy4uLy4uL2NsaWVudC9jaGF0L2NvbnRhY3RzL3Jvb21zL1Jvb21zLmpzIiwiLi4vLi4vLi4vY2xpZW50L2NoYXQvY29udGFjdHMvQ29udGFjdHMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcblxyXG5jb25zdCBzdHlsZSA9IHtcclxuICBwYWRkaW5nOiA4LFxyXG4gIG1hcmdpbkxlZnQ6IDE2LFxyXG4gIG1hcmdpblJpZ2h0OiAxNixcclxuICBtYXJnaW5Ub3A6IDgsXHJcbiAgbWFyZ2luQm90dG9tOiA4LFxyXG4gIGJveFNpemluZzogJ2JvcmRlci1ib3gnLFxyXG4gIGZsZXg6IDEsXHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gVGV4dElucHV0KHByb3BzKSB7XHJcbiAgY29uc3QgeyBpZCB9ID0gcHJvcHM7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCB3aWR0aDogJzEwMCUnIH19PlxyXG4gICAgICA8aW5wdXQgc3R5bGU9e3N0eWxlfSB7Li4ucHJvcHN9IGRhdGEtdGVzdGlkPXtpZH0gLz5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcblxyXG5jb25zdCBzdHlsZSA9IHtcclxuICB3aWR0aDogNTYsXHJcbiAgaGVpZ2h0OiA1NixcclxuICBiYWNrZ3JvdW5kQ29sb3I6ICd5ZWxsb3cnLFxyXG4gIGJvcmRlclJhZGl1czogJzUwJScsXHJcbiAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcclxuICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBGYWIoeyBjaGlsZHJlbiB9KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXY+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3N0eWxlfT57Y2hpbGRyZW59PC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5leHBvcnQgIGZ1bmN0aW9uIEFkZEljb24oKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxzdmdcclxuICAgICAgaGVpZ2h0PScyNCdcclxuICAgICAgdmlld0JveD0nMCAwIDI0IDI0J1xyXG4gICAgICB3aWR0aD0nMjQnXHJcbiAgICA+XHJcbiAgICAgIDxwYXRoIGQ9J00xOSAxM2gtNnY2aC0ydi02SDV2LTJoNlY1aDJ2Nmg2djJ6JyAvPlxyXG4gICAgICA8cGF0aCBkPSdNMCAwaDI0djI0SDB6JyBmaWxsPSdub25lJyAvPlxyXG4gICAgPC9zdmc+XHJcbiAgKTtcclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCB7XHJcbiAgU0VORF9JTlZJVEFUSU9OX1NUQVJURUQ6ICdTRU5EX0lOVklUQVRJT05fU1RBUlRFRCcsXHJcbiAgU0VORF9JTlZJVEFUSU9OX1NVQ0NFU1M6ICdTRU5EX0lOVklUQVRJT05fU1VDQ0VTUycsXHJcbiAgU0VORF9JTlZJVEFUSU9OX0ZBSUxFRDogJ1NFTkRfSU5WSVRBVElPTl9GQUlMRUQnLFxyXG5cclxuICBBQ0NFUFRfSU5WSVRBVElPTl9TVEFSVEVEOiAnQUNDRVBUX0lOVklUQVRJT05fU1RBUlRFRCcsXHJcbiAgQUNDRVBUX0lOVklUQVRJT05fU1VDQ0VTUzogJ0FDQ0VQVF9JTlZJVEFUSU9OX1NVQ0NFU1MnLFxyXG4gIEFDQ0VQVF9JTlZJVEFUSU9OX0ZBSUxFRDogJ0FDQ0VQVF9JTlZJVEFUSU9OX0ZBSUxFRCcsXHJcblxyXG4gIERFQ0xJTkVfSU5WSVRBVElPTl9TVEFSVEVEOiAnREVDTElORV9JTlZJVEFUSU9OX1NUQVJURUQnLFxyXG4gIERFQ0xJTkVfSU5WSVRBVElPTl9TVUNDRVNTOiAnREVDTElORV9JTlZJVEFUSU9OX1NVQ0NFU1MnLFxyXG4gIERFQ0xJTkVfSU5WSVRBVElPTl9GQUlMRUQ6ICdERUNMSU5FX0lOVklUQVRJT05fRkFJTEVEJyxcclxuXHJcbiAgRkVUQ0hfSU5WSVRBVElPTlNfU1RBUlRFRDogJ0ZFVENIX0lOVklUQVRJT05TX1NUQVJURUQnLFxyXG4gIEZFVENIX0lOVklUQVRJT05TX1NVQ0NFU1M6ICdGRVRDSF9JTlZJVEFUSU9OU19TVUNDRVNTJyxcclxuICBGRVRDSF9JTlZJVEFUSU9OU19GQUlMRUQ6ICdGRVRDSF9JTlZJVEFUSU9OU19GQUlMRUQnLFxyXG5cclxuICBPUEVOX0lOVklUQVRJT046ICdPUEVOX0lOVklUQVRJT04nLFxyXG4gIENMT1NFX0lOVklUQVRJT046ICdDTE9TRV9JTlZJVEFUSU9OJyxcclxufTtcclxuIiwiaW1wb3J0IGFjdGlvblR5cGVzIGZyb20gJy4vYWN0aW9uVHlwZXMnO1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2VuZEludml0YXRpb24oeyBkaXNwYXRjaCB9KSB7XHJcbiAgdHJ5IHtcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VORF9JTlZJVEFUSU9OX1NUQVJURUQgfSk7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKCdodHRwOi8vbG9jYWxob3N0OjMwMDAvaW52aXRhdGlvbnMvJywge1xyXG4gICAgICBtZXRob2Q6ICdwb3N0JyxcclxuICAgIH0pO1xyXG5cclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VORF9JTlZJVEFUSU9OX1NVQ0NFU1MgfSk7XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuU0VORF9JTlZJVEFUSU9OX0ZBSUxFRCwgZXJyb3IgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gb3Blbkludml0YXRpb24oeyBkaXNwYXRjaCwgaW52aXRhdGlvbiB9KSB7XHJcblxyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuT1BFTl9JTlZJVEFUSU9OLCBpbnZpdGF0aW9uIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY2xvc2VJbnZpdGF0aW9uKCkge31cclxuIiwiaW1wb3J0IGFjdGlvblR5cGVzIGZyb20gJy4vYWN0aW9uVHlwZXMnO1xyXG5cclxuZXhwb3J0IGNvbnN0IGluaXRTdGF0ZSA9IHtcclxuICBlcnJvcjogbnVsbCxcclxuICBsb2FkaW5nOiBmYWxzZSxcclxuICBpbnZpdGF0aW9uczogW10sXHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaW52aXRhdGlvblJlZHVjZXIoc3RhdGUsIGFjdGlvbikge1xyXG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0VORF9JTlZJVEFUSU9OX1NUQVJURUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiB0cnVlIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLlNFTkRfSU5WSVRBVElPTl9TVUNDRVNTOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgbG9hZGluZzogZmFsc2UgfTtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuU0VORF9JTlZJVEFUSU9OX0ZBSUxFRDpcclxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGxvYWRpbmc6IGZhbHNlLCBlcnJvcjogYWN0aW9uLmVycm9yIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX0lOVklUQVRJT05TX1NUQVJURUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiB0cnVlIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkZFVENIX0lOVklUQVRJT05TX1NVQ0NFU1M6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiBmYWxzZSB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5GRVRDSF9JTlZJVEFUSU9OU19GQUlMRUQ6XHJcbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsb2FkaW5nOiBmYWxzZSwgZXJyb3I6IGFjdGlvbi5lcnJvciB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5PUEVOX0lOVklUQVRJT046XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgaW52aXRhdGlvbnM6IFsuLi5zdGF0ZS5pbnZpdGF0aW9ucywgYWN0aW9uLmludml0YXRpb25dLFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5DTE9TRV9JTlZJVEFUSU9OOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIGludml0YXRpb246IHN0YXRlLmludml0YXRpb25zLmZpbHRlcihcclxuICAgICAgICAgIChpbnYpID0+IGludi5yZWNpZXZlciAhPT0gYWN0aW9uLnJlY2lldmVyXHJcbiAgICAgICAgKSxcclxuICAgICAgfTtcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHJldHVybiBzdGF0ZTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgaCwgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3ByZWFjdCc7XHJcbmltcG9ydCB7IHVzZVJlZHVjZXIsIHVzZUNvbnRleHQsIHVzZU1lbW8gfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgeyBpbnZpdGF0aW9uUmVkdWNlciwgaW5pdFN0YXRlIH0gZnJvbSAnLi9pbnZpdGF0aW9uUmVkdWNlcic7XHJcbmNvbnN0IEludml0YXRpb25Db250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xyXG5cclxuZnVuY3Rpb24gdXNlSW52aXRhdGlvbkNvbnRleHQoKSB7XHJcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoSW52aXRhdGlvbkNvbnRleHQpO1xyXG4gIGlmICghY29udGV4dCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAndXNlSW52aXRhdGlvbkNvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggSW52aXRhdGlvblByb3ZpZGVyJ1xyXG4gICAgKTtcclxuICB9XHJcbiAgY29uc3QgW3N0YXRlLCBkaXNwYXRjaF0gPSBjb250ZXh0O1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgc3RhdGUsXHJcbiAgICBkaXNwYXRjaCxcclxuICB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBJbnZpdGF0aW9uUHJvdmlkZXIocHJvcHMpIHtcclxuICBjb25zdCBbc3RhdGUsIGRpc3BhdGNoXSA9IHVzZVJlZHVjZXIoaW52aXRhdGlvblJlZHVjZXIsIGluaXRTdGF0ZSk7XHJcbiAgY29uc3QgdmFsdWUgPSB1c2VNZW1vKCgpID0+IFtzdGF0ZSwgZGlzcGF0Y2hdLCBbc3RhdGVdKTtcclxuICByZXR1cm4gPEludml0YXRpb25Db250ZXh0LlByb3ZpZGVyIHZhbHVlPXt2YWx1ZX0gey4uLnByb3BzfSAvPjtcclxufVxyXG5cclxuZXhwb3J0IHsgdXNlSW52aXRhdGlvbkNvbnRleHQsIEludml0YXRpb25Qcm92aWRlciB9O1xyXG4iLCJpbXBvcnQgYWN0aW9uVHlwZXMgZnJvbSAnLi9hY3Rpb25UeXBlcyc7XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hVc2Vyc0luQ29udGFjdCh7IGRpc3BhdGNoIH0pIHtcclxuICB0cnkge1xyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9VU0VSU19JTl9DT05UQUNUX1NUQVJURUQgfSk7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKCdodHRwOi8vbG9jYWxob3N0OjMwMDAvY29udGFjdHMvZmluZCcpO1xyXG5cclxuICAgIGNvbnN0IHsgY29udGFjdHMgfSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdjb250YWN0cycsIEpTT04uc3RyaW5naWZ5KGNvbnRhY3RzKSk7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX1VTRVJTX0lOX0NPTlRBQ1RfU1VDQ0VTUywgY29udGFjdHMgfSk7XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfVVNFUlNfSU5fQ09OVEFDVF9GQUlMRUQsIGVycm9yIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoVXNlcnMoeyBkaXNwYXRjaCwgZmlsdGVyIH0pIHtcclxuICB0cnkge1xyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GRVRDSF9VU0VSU19TVEFSVEVEIH0pO1xyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcclxuICAgICAgYGh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC91c2Vycy9maW5kP2ZpbHRlcj0ke2ZpbHRlcn1gXHJcbiAgICApO1xyXG4gICAgY29uc3QgeyB1c2VycyB9ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfVVNFUlNfU1VDQ0VTUywgdXNlcnMgfSk7XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfVVNFUlNfRkFJTEVELCBlcnJvciB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRMb2NhbENvbnRhY3RzKHsgZGlzcGF0Y2ggfSkge1xyXG4gIHRyeSB7XHJcbiAgICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkZFVENIX0xPQ0FMX0NPTlRBQ1RTX1NUQVJURUQgfSk7XHJcbiAgICBjb25zdCBjb250YWN0cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2NvbnRhY3RzJykpXHJcbiAgICAgID8gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnY29udGFjdHMnKSlcclxuICAgICAgOiBbXTtcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfTE9DQUxfQ09OVEFDVFNfU1VDQ0VTUywgY29udGFjdHMgfSk7XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRkVUQ0hfTE9DQUxfQ09OVEFDVFNfRkFJTEVELCBlcnJvciB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmaW5kTG9jYWxDb250YWN0KHsgZGlzcGF0Y2gsIGZpbHRlciB9KSB7XHJcbiAgdHJ5IHtcclxuICAgIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuRklORF9MT0NBTF9DT05UQUNUX1NUQVJURUQgfSk7XHJcbiAgICBjb25zdCBxdWVyeSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2NvbnRhY3RzJykpLmZpbHRlcigoYykgPT5cclxuICAgICAgYy51c2VybmFtZS5pbmNsdWRlcyhmaWx0ZXIpXHJcbiAgICApO1xyXG4gICAgY29uc3QgZmlsdGVyZWQgPSBxdWVyeSA/IHF1ZXJ5IDogW107XHJcbiAgICBkaXNwYXRjaCh7XHJcbiAgICAgIHR5cGU6IGFjdGlvblR5cGVzLkZJTkRfTE9DQUxfQ09OVEFDVF9TVUNDRVNTLFxyXG4gICAgICBjb250YWN0czogZmlsdGVyZWQsXHJcbiAgICB9KTtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgZGlzcGF0Y2goeyB0eXBlOiBhY3Rpb25UeXBlcy5GSU5EX0xPQ0FMX0NPTlRBQ1RfRkFJTEVELCBlcnJvciB9KTtcclxuICB9XHJcbn1cclxuXHJcbi8vIGV4cG9ydCBmdW5jdGlvbiBzZWxlY3RVc2VyKHsgZGlzcGF0Y2gsIHVzZXJOYW1lIH0pIHtcclxuLy8gICBkZWJ1Z2dlcjtcclxuLy8gICBkaXNwYXRjaCh7XHJcbi8vICAgICB0eXBlOiBhY3Rpb25UeXBlcy5VU0VSX1NFTEVDVEVELFxyXG4vLyAgICAgdXNlck5hbWUsXHJcbi8vICAgfSk7XHJcbi8vIH1cclxuXHJcblxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgTGlzdCwgTGlzdEl0ZW0gfSBmcm9tICcuLi8uLi8uLi9sYXlvdXQvTmF2TGlzdCc7XHJcbmltcG9ydCB7IHVzZUNvbnRhY3RzQ29udGV4dCB9IGZyb20gJy4uL2NvbnRhY3RzLWNvbnRleHQnO1xyXG5pbXBvcnQgeyBvcGVuSW52aXRhdGlvbiB9IGZyb20gJy4uL2ludml0YXRpb25zL2FjdGlvbnMnO1xyXG5pbXBvcnQgeyB1c2VJbnZpdGF0aW9uQ29udGV4dCB9IGZyb20gJy4uL2ludml0YXRpb25zL2ludml0YXRpb24tY29udGV4dCc7XHJcbmltcG9ydCB7IHVzZUF1dGhDb250ZXh0IH0gZnJvbSAnLi4vLi4vLi4vYXV0aC9hdXRoLWNvbnRleHQnO1xyXG5pbXBvcnQgeyBmZXRjaFVzZXJzIH0gZnJvbSAnLi4vYWN0aW9ucyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBVc2Vycyh7IGZpbHRlciB9KSB7XHJcbiAgY29uc3QgeyBkaXNwYXRjaDogaW52aXREaXNwYXRjaCB9ID0gdXNlSW52aXRhdGlvbkNvbnRleHQoKTtcclxuICBjb25zdCB7IHN0YXRlOiBhdXRoU3RhdGUgfSA9IHVzZUF1dGhDb250ZXh0KCk7XHJcblxyXG4gIGNvbnN0IHsgc3RhdGUsIGRpc3BhdGNoIH0gPSB1c2VDb250YWN0c0NvbnRleHQoKTtcclxuICBjb25zdCB7IHVzZXJzIH0gPSBzdGF0ZTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmIChzdGF0ZS5jb250YWN0cy5sZW5ndGggPT09IDAgJiYgZmlsdGVyICYmIGZpbHRlci5sZW5ndGggPj0gNCkge1xyXG4gICAgICBmZXRjaFVzZXJzKHsgZGlzcGF0Y2gsIGZpbHRlciB9KTtcclxuICAgIH1cclxuICB9LCBbc3RhdGUuY29udGFjdHMsIGZpbHRlcl0pO1xyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVTZWxlY3RVc2VyKGUpIHtcclxuICAgIFxyXG4gICAgY29uc3QgaW52aXRhdGlvbiA9IHsgc2VuZGVyOiBhdXRoU3RhdGUudXNlcm5hbWUsIHJlY2lldmVyOiBlLnRhcmdldC5pZCB9O1xyXG4gICAgb3Blbkludml0YXRpb24oeyBkaXNwYXRjaDogaW52aXREaXNwYXRjaCwgaW52aXRhdGlvbiB9KTtcclxuICB9XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8TGlzdCBpZD0ndXNlcnMnPlxyXG4gICAgICB7dXNlcnMgJiZcclxuICAgICAgICB1c2Vycy5sZW5ndGggPiAwICYmXHJcbiAgICAgICAgdXNlcnMubWFwKChjKSA9PiB7XHJcbiAgICAgXHJcbiAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8TGlzdEl0ZW0gaWQ9e2MudXNlcm5hbWV9IG9uQ2xpY2s9e2hhbmRsZVNlbGVjdFVzZXJ9PlxyXG4gICAgICAgICAgICAgIHtjLnVzZXJuYW1lfVxyXG4gICAgICAgICAgICA8L0xpc3RJdGVtPlxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9KX1cclxuICAgIDwvTGlzdD5cclxuICApO1xyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IHtcclxuICBPUEVOX1JPT006ICdPUEVOX1JPT00nLFxyXG4gIENMT1NFX1JPT006ICdDTE9TRV9ST09NJyxcclxufTtcclxuIiwiaW1wb3J0IGFjdGlvblR5cGVzIGZyb20gJy4vYWN0aW9uVHlwZXMnO1xyXG5cclxuZXhwb3J0IGNvbnN0IGluaXRTdGF0ZSA9IHsgcm9vbXM6IFtdIH07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcm9vbVJlZHVjZXIoc3RhdGUsIGFjdGlvbikge1xyXG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgIGNhc2UgYWN0aW9uVHlwZXMuT1BFTl9ST09NOlxyXG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgcm9vbXM6IFsuLi5zdGF0ZS5yb29tcywgYWN0aW9uLnJvb21dIH07XHJcbiAgICBjYXNlIGFjdGlvblR5cGVzLkNMT1NFX1JPT006XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgcm9vbXM6IHN0YXRlLnJvb21zLmZpbHRlcihyLnVzZXJuYW1lICE9PSBhY3Rpb24ucm9vbS51c2VybmFtZSksXHJcbiAgICAgIH07XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICByZXR1cm4gc3RhdGU7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IGgsIGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VSZWR1Y2VyLCB1c2VDb250ZXh0LCB1c2VNZW1vIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcclxuaW1wb3J0IHsgcm9vbVJlZHVjZXIsIGluaXRTdGF0ZSB9IGZyb20gJy4vcm9vbVJlZHVjZXInO1xyXG5jb25zdCBSb29tQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcclxuXHJcbmZ1bmN0aW9uIHVzZVJvb21Db250ZXh0KCkge1xyXG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KFJvb21Db250ZXh0KTtcclxuICBpZiAoIWNvbnRleHQpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcigndXNlUm9vbUNvbnRleHQgbXVzdCBiZSB1c2VkIHdpdGggUm9vbVByb3ZpZGVyJyk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBbc3RhdGUsIGRpc3BhdGNoXSA9IGNvbnRleHQ7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBzdGF0ZSxcclxuICAgIGRpc3BhdGNoLFxyXG4gIH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIFJvb21Qcm92aWRlcihwcm9wcykge1xyXG4gIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlUmVkdWNlcihyb29tUmVkdWNlciwgaW5pdFN0YXRlKTtcclxuICBjb25zdCB2YWx1ZSA9IHVzZU1lbW8oKCkgPT4gW3N0YXRlLCBkaXNwYXRjaF0sIFtzdGF0ZV0pO1xyXG4gIHJldHVybiA8Um9vbUNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlfSB7Li4ucHJvcHN9IC8+O1xyXG59XHJcblxyXG5leHBvcnQgeyB1c2VSb29tQ29udGV4dCwgUm9vbVByb3ZpZGVyIH07XHJcbiIsImltcG9ydCBhY3Rpb25UeXBlcyBmcm9tICcuL2FjdGlvblR5cGVzJztcclxuZXhwb3J0IGZ1bmN0aW9uIG9wZW5Sb29tKHsgZGlzcGF0Y2gsIHJvb20gfSkge1xyXG4gIGRlYnVnZ2VyO1xyXG4gIGRpc3BhdGNoKHsgdHlwZTogYWN0aW9uVHlwZXMuT1BFTl9ST09NLCByb29tIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY2xvc2VSb29tKHsgZGlzcGF0Y2gsIHJvb21OYW1lIH0pIHtcclxuICBkZWJ1Z2dlcjtcclxuICBkaXNwYXRjaCh7IHR5cGU6IGFjdGlvblR5cGVzLkNMT1NFX1JPT00sIHJvb21OYW1lIH0pO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgeyB1c2VDb250YWN0c0NvbnRleHQgfSBmcm9tICcuLi9jb250YWN0cy1jb250ZXh0JztcclxuaW1wb3J0IHsgdXNlUm9vbUNvbnRleHQgfSBmcm9tICcuLi9yb29tcy9yb29tLWNvbnRleHQnO1xyXG5pbXBvcnQge1xyXG4gIGZldGNoVXNlcnNJbkNvbnRhY3QsXHJcbiAgZ2V0TG9jYWxDb250YWN0cyxcclxuICBmaW5kTG9jYWxDb250YWN0LFxyXG59IGZyb20gJy4uL2FjdGlvbnMnO1xyXG5pbXBvcnQgeyBvcGVuUm9vbSB9IGZyb20gJy4uL3Jvb21zL2FjdGlvbnMnO1xyXG5pbXBvcnQgeyBMaXN0LCBMaXN0SXRlbSB9IGZyb20gJy4uLy4uLy4uL2xheW91dC9OYXZMaXN0JztcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gVXNlcnNJbkNvbnRhY3QoeyBmaWx0ZXIgfSkge1xyXG4gIGNvbnN0IHsgc3RhdGU6IHJvb21TdGF0ZSwgZGlzcGF0Y2g6IHJvb21EaXNwYXRjaCB9ID0gdXNlUm9vbUNvbnRleHQoKTtcclxuICBjb25zdCB7IHN0YXRlLCBkaXNwYXRjaCB9ID0gdXNlQ29udGFjdHNDb250ZXh0KCk7XHJcbiAgY29uc3QgeyBjb250YWN0cyB9ID0gc3RhdGU7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2NvbnRhY3RzJykpIHtcclxuICAgICAgZ2V0TG9jYWxDb250YWN0cyh7IGRpc3BhdGNoIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZmV0Y2hVc2Vyc0luQ29udGFjdCh7IGRpc3BhdGNoIH0pO1xyXG4gICAgfVxyXG4gIH0sIFtdKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmIChmaWx0ZXIpIHtcclxuICAgICAgZmluZExvY2FsQ29udGFjdCh7IGRpc3BhdGNoLCBmaWx0ZXIgfSk7XHJcbiAgICB9XHJcbiAgfSwgW2ZpbHRlcl0pO1xyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVTZWxlY3RDb250YWN0KGUpIHtcclxuICAgIGRlYnVnZ2VyO1xyXG4gICAgY29uc3Qgcm9vbSA9IHN0YXRlLmNvbnRhY3RzLmZpbmQoKGMpID0+IGMudXNlcm5hbWUgPT09IGUudGFyZ2V0LmlkKTtcclxuICAgIG9wZW5Sb29tKHsgZGlzcGF0Y2g6IHJvb21EaXNwYXRjaCwgcm9vbSB9KTtcclxuICB9XHJcbiAgcmV0dXJuIChcclxuICAgIDxMaXN0IGlkPSd1c2Vyc2luY29udGFjdCc+XHJcbiAgICAgIHtjb250YWN0cyAmJlxyXG4gICAgICAgIGNvbnRhY3RzLmxlbmd0aCA+IDAgJiZcclxuICAgICAgICBjb250YWN0cy5tYXAoKGMpID0+IHtcclxuICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxMaXN0SXRlbSBpZD17Yy51c2VybmFtZX0gb25DbGljaz17aGFuZGxlU2VsZWN0Q29udGFjdH0+XHJcbiAgICAgICAgICAgICAge2MudXNlcm5hbWV9XHJcbiAgICAgICAgICAgIDwvTGlzdEl0ZW0+XHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH0pfVxyXG4gICAgPC9MaXN0PlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcbmV4cG9ydCBmdW5jdGlvbiBQb3NpdGlvbih7IGNoaWxkcmVuIH0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17eyBwb3NpdGlvbjogJ2Fic29sdXRlJywgYm90dG9tOiAwLCByaWdodDogMCB9fT57Y2hpbGRyZW59PC9kaXY+XHJcbiAgKTtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgUG9zaXRpb24gfSBmcm9tICcuLi8uLi8uLi9sYXlvdXQvUG9zaXRpb24nO1xyXG5pbXBvcnQgeyB1c2VJbnZpdGF0aW9uQ29udGV4dCB9IGZyb20gJy4vaW52aXRhdGlvbi1jb250ZXh0JztcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSW52aXRhdGlvbnMoeyBpZCB9KSB7XHJcbiAgY29uc3QgeyBzdGF0ZSB9ID0gdXNlSW52aXRhdGlvbkNvbnRleHQoKTtcclxuXHJcbiAgY29uc3QgeyBpbnZpdGF0aW9ucyB9ID0gc3RhdGU7XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8UG9zaXRpb24+XHJcbiAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9e2lkfT5cclxuICAgICAgICB7aW52aXRhdGlvbnMgJiZcclxuICAgICAgICAgIGludml0YXRpb25zLmxlbmd0aCA+IDAgJiZcclxuICAgICAgICAgIGludml0YXRpb25zLm1hcCgoaW52KSA9PiB7XHJcbiAgICAgICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgICAgICByZXR1cm4gPEludml0YXRpb24gaW52aXRhdGlvbj17aW52fSAvPjtcclxuICAgICAgICAgIH0pfVxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvUG9zaXRpb24+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEludml0YXRpb24oeyBpbnZpdGF0aW9uIH0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBkYXRhLXRlc3RpZD17aW52aXRhdGlvbi5yZWNpZXZlcn0+XHJcbiAgICAgIEludml0YXRpb24se2ludml0YXRpb24ucmVjaWV2ZXJ9XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIFRleHRDaGF0KHsgcm9vbSB9KSB7XHJcbiAgcmV0dXJuIDxkaXYgZGF0YS10ZXN0aWQ9e3Jvb20udXNlcm5hbWV9PlRleHRDaGF0LHtyb29tLnVzZXJuYW1lfTwvZGl2PjtcclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuaW1wb3J0IHsgdXNlUm9vbUNvbnRleHQgfSBmcm9tICcuL3Jvb20tY29udGV4dCc7XHJcbmltcG9ydCB7IFRleHRDaGF0IH0gZnJvbSAnLi4vdGV4dC1jaGF0L1RleHRDaGF0JztcclxuaW1wb3J0IHsgUG9zaXRpb24gfSBmcm9tICcuLi8uLi8uLi9sYXlvdXQvUG9zaXRpb24nO1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBSb29tcyh7IGlkIH0pIHtcclxuICBjb25zdCB7IHN0YXRlLCBkaXNwYXRjaCB9ID0gdXNlUm9vbUNvbnRleHQoKTtcclxuICBjb25zdCB7IHJvb21zIH0gPSBzdGF0ZTtcclxuICByZXR1cm4gKFxyXG4gICAgPFBvc2l0aW9uPlxyXG4gICAgICA8ZGl2IGRhdGEtdGVzdGlkPSdyb29tcyc+XHJcbiAgICAgICAge3Jvb21zICYmXHJcbiAgICAgICAgICByb29tcy5sZW5ndGggPiAwICYmXHJcbiAgICAgICAgICByb29tcy5tYXAoKHIpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIDxSb29tIHJvb209e3J9IC8+O1xyXG4gICAgICAgICAgfSl9XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9Qb3NpdGlvbj5cclxuICApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gUm9vbSh7IHJvb20gfSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IGRhdGEtdGVzdGlkPSdyb29tJz5cclxuICAgICAgPFRleHRDaGF0IHJvb209e3Jvb219IC8+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VTdGF0ZSB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XHJcbmltcG9ydCB7IExpc3QsIExpc3RJdGVtIH0gZnJvbSAnLi4vLi4vbGF5b3V0L05hdkxpc3QnO1xyXG5pbXBvcnQgeyBUZXh0SW5wdXQgfSBmcm9tICcuLi8uLi9sYXlvdXQvVGV4dElucHV0JztcclxuaW1wb3J0IHsgUGFwZXIgfSBmcm9tICcuLi8uLi9sYXlvdXQvUGFwZXInO1xyXG5pbXBvcnQgeyBGYWIgfSBmcm9tICcuLi8uLi9sYXlvdXQvRmFiJztcclxuaW1wb3J0IHsgQWRkSWNvbiB9IGZyb20gJy4uLy4uL2xheW91dC9pY29ucy9BZGRJY29uJztcclxuaW1wb3J0IFVzZXJzIGZyb20gJy4vdXNlcnMvVXNlcnMnO1xyXG5pbXBvcnQgVXNlcnNJbkNvbnRhY3QgZnJvbSAnLi91c2Vycy1pbi1jb250YWN0L1VzZXJzSW5Db250YWN0JztcclxuaW1wb3J0IHsgdXNlQ29udGFjdHNDb250ZXh0IH0gZnJvbSAnLi9jb250YWN0cy1jb250ZXh0JztcclxuaW1wb3J0IHsgUm9vbVByb3ZpZGVyIH0gZnJvbSAnLi9yb29tcy9yb29tLWNvbnRleHQnO1xyXG5pbXBvcnQgeyBJbnZpdGF0aW9uUHJvdmlkZXIgfSBmcm9tICcuL2ludml0YXRpb25zL2ludml0YXRpb24tY29udGV4dCc7XHJcbmltcG9ydCBJbnZpdGF0aW9ucyBmcm9tICcuL2ludml0YXRpb25zL0ludml0YXRpb25zJztcclxuaW1wb3J0IFJvb21zIGZyb20gJy4vcm9vbXMvUm9vbXMnO1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDb250YWN0cygpIHtcclxuICBjb25zdCB7IHN0YXRlIH0gPSB1c2VDb250YWN0c0NvbnRleHQoKTtcclxuICBjb25zdCBbZmlsdGVyLCBzZXRGaWx0ZXJdID0gdXNlU3RhdGUobnVsbCk7XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZUZpbHRlcihlKSB7XHJcbiAgICBzZXRGaWx0ZXIoZS50YXJnZXQudmFsdWUpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxJbnZpdGF0aW9uUHJvdmlkZXI+XHJcbiAgICAgIDxSb29tUHJvdmlkZXI+XHJcbiAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcgfX0gZGF0YS10ZXN0aWQ9J2NvbnRhY3QtbGlzdCc+XHJcbiAgICAgICAgICA8UGFwZXI+XHJcbiAgICAgICAgICAgIDxOZXdDb252ZXJzYXRpb24gb25DaGFuZ2U9e2hhbmRsZUZpbHRlcn0gLz5cclxuICAgICAgICAgICAgezxVc2Vyc0luQ29udGFjdCBmaWx0ZXI9e2ZpbHRlcn0gLz59XHJcbiAgICAgICAgICAgIHs8VXNlcnMgZmlsdGVyPXtmaWx0ZXJ9IC8+fVxyXG4gICAgICAgICAgICA8SW52aXRhdGlvbnMgaWQ9J2ludml0YXRpb25zJyAvPlxyXG4gICAgICAgICAgICA8Um9vbXMgaWQ9J3Jvb21zJyAvPlxyXG4gICAgICAgICAgPC9QYXBlcj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9Sb29tUHJvdmlkZXI+XHJcbiAgICA8L0ludml0YXRpb25Qcm92aWRlcj5cclxuICApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBOZXdDb252ZXJzYXRpb24oeyBvbkNoYW5nZSB9KSB7XHJcbiAgY29uc3QgW25ld0NvbnZlcnNhdGlvbiwgc2V0TmV3Q29udmVyc2F0aW9uXSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuXHJcbiAgZnVuY3Rpb24gaGFuZGxlTmV3Q29udmVyc2F0aW9uKCkge1xyXG4gICAgc2V0TmV3Q29udmVyc2F0aW9uKHRydWUpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxMaXN0PlxyXG4gICAgICB7bmV3Q29udmVyc2F0aW9uID8gKFxyXG4gICAgICAgIDxUZXh0SW5wdXRcclxuICAgICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cclxuICAgICAgICAgIHBsYWNlaG9sZGVyPSdFbnRlciB1c2VybmFtZSBvciBlbWFpbCdcclxuICAgICAgICAgIGlkPSdjb250YWN0c2VhcmNoJ1xyXG4gICAgICAgIC8+XHJcbiAgICAgICkgOiAoXHJcbiAgICAgICAgPExpc3RJdGVtIG9uQ2xpY2s9e2hhbmRsZU5ld0NvbnZlcnNhdGlvbn0gaWQ9J2NvbnZlcnNhdGlvbic+XHJcbiAgICAgICAgICA8RmFiPlxyXG4gICAgICAgICAgICA8QWRkSWNvbiAvPlxyXG4gICAgICAgICAgPC9GYWI+XHJcbiAgICAgICAgICA8ZGl2Pk5ldyBDb252ZXJzYXRpb248L2Rpdj5cclxuICAgICAgICA8L0xpc3RJdGVtPlxyXG4gICAgICApfVxyXG4gICAgPC9MaXN0PlxyXG4gICk7XHJcbn1cclxuIl0sIm5hbWVzIjpbInN0eWxlIiwicGFkZGluZyIsIm1hcmdpbkxlZnQiLCJtYXJnaW5SaWdodCIsIm1hcmdpblRvcCIsIm1hcmdpbkJvdHRvbSIsImJveFNpemluZyIsImZsZXgiLCJUZXh0SW5wdXQiLCJwcm9wcyIsImlkIiwiZGlzcGxheSIsIndpZHRoIiwiaGVpZ2h0IiwiYmFja2dyb3VuZENvbG9yIiwiYm9yZGVyUmFkaXVzIiwianVzdGlmeUNvbnRlbnQiLCJhbGlnbkl0ZW1zIiwiRmFiIiwiY2hpbGRyZW4iLCJBZGRJY29uIiwiU0VORF9JTlZJVEFUSU9OX1NUQVJURUQiLCJTRU5EX0lOVklUQVRJT05fU1VDQ0VTUyIsIlNFTkRfSU5WSVRBVElPTl9GQUlMRUQiLCJBQ0NFUFRfSU5WSVRBVElPTl9TVEFSVEVEIiwiQUNDRVBUX0lOVklUQVRJT05fU1VDQ0VTUyIsIkFDQ0VQVF9JTlZJVEFUSU9OX0ZBSUxFRCIsIkRFQ0xJTkVfSU5WSVRBVElPTl9TVEFSVEVEIiwiREVDTElORV9JTlZJVEFUSU9OX1NVQ0NFU1MiLCJERUNMSU5FX0lOVklUQVRJT05fRkFJTEVEIiwiRkVUQ0hfSU5WSVRBVElPTlNfU1RBUlRFRCIsIkZFVENIX0lOVklUQVRJT05TX1NVQ0NFU1MiLCJGRVRDSF9JTlZJVEFUSU9OU19GQUlMRUQiLCJPUEVOX0lOVklUQVRJT04iLCJDTE9TRV9JTlZJVEFUSU9OIiwib3Blbkludml0YXRpb24iLCJkaXNwYXRjaCIsImludml0YXRpb24iLCJ0eXBlIiwiYWN0aW9uVHlwZXMiLCJpbml0U3RhdGUiLCJlcnJvciIsImxvYWRpbmciLCJpbnZpdGF0aW9ucyIsImludml0YXRpb25SZWR1Y2VyIiwic3RhdGUiLCJhY3Rpb24iLCJmaWx0ZXIiLCJpbnYiLCJyZWNpZXZlciIsIkludml0YXRpb25Db250ZXh0IiwiY3JlYXRlQ29udGV4dCIsInVzZUludml0YXRpb25Db250ZXh0IiwiY29udGV4dCIsInVzZUNvbnRleHQiLCJFcnJvciIsIkludml0YXRpb25Qcm92aWRlciIsInVzZVJlZHVjZXIiLCJ2YWx1ZSIsInVzZU1lbW8iLCJmZXRjaFVzZXJzSW5Db250YWN0IiwiRkVUQ0hfVVNFUlNfSU5fQ09OVEFDVF9TVEFSVEVEIiwicmVzcG9uc2UiLCJmZXRjaCIsImNvbnRhY3RzIiwianNvbiIsImxvY2FsU3RvcmFnZSIsInNldEl0ZW0iLCJKU09OIiwic3RyaW5naWZ5IiwiRkVUQ0hfVVNFUlNfSU5fQ09OVEFDVF9TVUNDRVNTIiwiRkVUQ0hfVVNFUlNfSU5fQ09OVEFDVF9GQUlMRUQiLCJmZXRjaFVzZXJzIiwiRkVUQ0hfVVNFUlNfU1RBUlRFRCIsInVzZXJzIiwiRkVUQ0hfVVNFUlNfU1VDQ0VTUyIsIkZFVENIX1VTRVJTX0ZBSUxFRCIsImdldExvY2FsQ29udGFjdHMiLCJGRVRDSF9MT0NBTF9DT05UQUNUU19TVEFSVEVEIiwicGFyc2UiLCJnZXRJdGVtIiwiRkVUQ0hfTE9DQUxfQ09OVEFDVFNfU1VDQ0VTUyIsIkZFVENIX0xPQ0FMX0NPTlRBQ1RTX0ZBSUxFRCIsImZpbmRMb2NhbENvbnRhY3QiLCJGSU5EX0xPQ0FMX0NPTlRBQ1RfU1RBUlRFRCIsInF1ZXJ5IiwiYyIsInVzZXJuYW1lIiwiaW5jbHVkZXMiLCJmaWx0ZXJlZCIsIkZJTkRfTE9DQUxfQ09OVEFDVF9TVUNDRVNTIiwiRklORF9MT0NBTF9DT05UQUNUX0ZBSUxFRCIsIlVzZXJzIiwiaW52aXREaXNwYXRjaCIsImF1dGhTdGF0ZSIsInVzZUF1dGhDb250ZXh0IiwidXNlQ29udGFjdHNDb250ZXh0IiwidXNlRWZmZWN0IiwibGVuZ3RoIiwiaGFuZGxlU2VsZWN0VXNlciIsImUiLCJzZW5kZXIiLCJ0YXJnZXQiLCJtYXAiLCJPUEVOX1JPT00iLCJDTE9TRV9ST09NIiwicm9vbXMiLCJyb29tUmVkdWNlciIsInJvb20iLCJyIiwiUm9vbUNvbnRleHQiLCJ1c2VSb29tQ29udGV4dCIsIlJvb21Qcm92aWRlciIsIm9wZW5Sb29tIiwiVXNlcnNJbkNvbnRhY3QiLCJyb29tU3RhdGUiLCJyb29tRGlzcGF0Y2giLCJoYW5kbGVTZWxlY3RDb250YWN0IiwiZmluZCIsIlBvc2l0aW9uIiwicG9zaXRpb24iLCJib3R0b20iLCJyaWdodCIsIkludml0YXRpb25zIiwiSW52aXRhdGlvbiIsIlRleHRDaGF0IiwiUm9vbXMiLCJSb29tIiwiQ29udGFjdHMiLCJzZXRGaWx0ZXIiLCJ1c2VTdGF0ZSIsImhhbmRsZUZpbHRlciIsIk5ld0NvbnZlcnNhdGlvbiIsIm9uQ2hhbmdlIiwibmV3Q29udmVyc2F0aW9uIiwic2V0TmV3Q29udmVyc2F0aW9uIiwiaGFuZGxlTmV3Q29udmVyc2F0aW9uIl0sIm1hcHBpbmdzIjoiOzs7QUFFQSxNQUFNQSxLQUFLLEdBQUc7QUFDWkMsRUFBQUEsT0FBTyxFQUFFLENBREc7QUFFWkMsRUFBQUEsVUFBVSxFQUFFLEVBRkE7QUFHWkMsRUFBQUEsV0FBVyxFQUFFLEVBSEQ7QUFJWkMsRUFBQUEsU0FBUyxFQUFFLENBSkM7QUFLWkMsRUFBQUEsWUFBWSxFQUFFLENBTEY7QUFNWkMsRUFBQUEsU0FBUyxFQUFFLFlBTkM7QUFPWkMsRUFBQUEsSUFBSSxFQUFFO0FBUE0sQ0FBZDtBQVVPLFNBQVND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
