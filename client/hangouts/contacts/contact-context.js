import { h, createContext } from 'preact';
import { useContext, useReducer, useMemo } from 'preact/hooks';

const ContactsContext = createContext();

function useContactsContext() {
  const context = useContext(ContactsContext);

  if (!context) {
    throw new Error('useContactsContext must be used with ContactsProvider');
  }

  return context;
}

const actionTypes = {
  SELECTED_CONTACT: 'SELECTED_CONTACT',
  REMOVE_CONTACT: 'REMOVE_CONTACT',
};

export function selectContact({ dispatch, contact }) {

  dispatch({ type: actionTypes.SELECTED_CONTACT, contact });
}
export function removeContact({ dispatch }) {
  dispatch({ type: actionTypes.REMOVE_CONTACT });
}
function reducer(state, action) {
  switch (action.type) {
    case actionTypes.SELECTED_CONTACT:
     
      return { ...state, contact: action.contact };
    case actionTypes.REMOVE_CONTACT:
      return { ...state, contact: null };
    default:
      return state;
  }
}

function ContactsProvider(props) {
  const [state, dispatch] = useReducer(reducer, { contact: null });
  const value = useMemo(() => [state, dispatch], [state]);
  return <ContactsContext.Provider value={value} {...props} />;
}

export { useContactsContext, ContactsProvider };
