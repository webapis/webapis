import { h, createContext } from 'preact';
import { useReducer, useContext, useMemo } from 'preact/hooks';
import { contactsReducer, initState } from './contactsReducer';
const ContactsContext = createContext();

function useContactsContext() {
  const context = useContext(ContactsContext);
  if (!context) {
    throw new Error('useContactsContext must be used with ContactsProvider');
  }

  const [state, dispatch] = context;

  return {
    state,
    dispatch,
  };
}

function ContactsProvider(props) {
  const [state, dispatch] = useReducer(contactsReducer, initState);
  const value = useMemo(() => [state, dispatch], [state]);
  return <ContactsContext.Provider value={value} {...props} />;
}

export { useContactsContext, ContactsProvider };
