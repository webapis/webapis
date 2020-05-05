import { h, createContext } from 'preact';
import { useReducer, useContext, useMemo } from 'preact/hooks';
import { invitationReducer, initState } from './invitationReducer';
const InvitationContext = createContext();

function useInvitationContext() {
  const context = useContext(InvitationContext);
  if (!context) {
    throw new Error(
      'useInvitationContext must be used with InvitationProvider'
    );
  }
  const [state, dispatch] = context;

  return {
    state,
    dispatch,
  };
}

function InvitationProvider(props) {
  const [state, dispatch] = useReducer(invitationReducer, initState);
  const value = useMemo(() => [state, dispatch], [state]);
  return <InvitationContext.Provider value={value} {...props} />;
}

export { useInvitationContext, InvitationProvider };
