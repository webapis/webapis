import { h, createContext } from 'preact';
import { useEffect, useContext, useReducer, useMemo } from 'preact/hooks';
import { useContactsContext } from '../../contacts/contact-context';

const P2PDesktopContext = createContext();

const actionTypes = {
  ADD_INVITATION: 'ADD_INVITATION',
  REMOVE_INVITATION: 'REMOVE_INVITATION',
  ADD_CHAT: 'ADD_CHAT',
  REMOVE_CHAT: 'REMOVE_CHAT',
};

function useP2PDesktopContext() {
  const context = useContext(P2PDesktopContext);

  if (!context) {
    throw new Error(
      'useP2PDesktopContext must be used with P2PDesktopProvider'
    );
  }

  return context;
}

export function removeInvitation({ dispatch, username }) {
  dispatch({ type: actionTypes.REMOVE_INVITATION, username });
}

export function removeChat({ dispatch, room }) {
  dispatch({ type: actionTypes.REMOVE_CHAT, room });
}

function reducer(state, action) {
  switch (action.type) {
    case actionTypes.ADD_CHAT:
      debugger;
      return { ...state, chats: [...state.chats, action.contact] };
    case actionTypes.REMOVE_CHAT:
      return {
        ...state,
        chats: state.chats.filter((chat) => chat.room !== action.room),
      };
    case actionTypes.ADD_INVITATION:
      debugger;
      return { ...state, invitations: [...state.invitations, action.contact] };
    case actionTypes.REMOVE_INVITATION:
      return {
        ...state,
        invitations: state.filter((inv) => inv.username !== action.username),
      };

    default:
      return state;
  }
}

function P2PDesktopProvider(props) {
  const context = useContactsContext();

  const [state, dispatch] = useReducer(reducer, {
    invitations: [],
    chats: [],
  });
  const { contact } = context[0];
  const { chats, invitations } = state;
  useEffect(() => {
    if (contact) {
      if (contact.room) {
        if (chats.length === 0) {
          debugger;
          dispatch({ type: actionTypes.ADD_CHAT, contact });
        } else if (
          chats.length > 0 &&
          !chats.find((chat) => chat.room === contact.room)
        ) {
          dispatch({ type: actionTypes.ADD_CHAT, contact });
        }
      } else {
        if (invitations.length === 0) {
          debugger;
          dispatch({ type: actionTypes.ADD_INVITATION, contact });
        } else if (
          invitations.length > 0 &&
          !invitations.find((inv) => inv.username === contact.username)
        ) {
          dispatch({ type: actionTypes.ADD_INVITATION, contact });
        }
      }
    }
  }, [contact]);

  const value = useMemo(() => [state, dispatch], [state]);
  return <P2PDesktopContext.Provider value={value} {...props} />;
}

export { P2PDesktopProvider, useP2PDesktopContext };
