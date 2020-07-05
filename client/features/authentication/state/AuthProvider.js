import { h, createContext } from 'preact';
import { useReducer, useContext, useState, useMemo } from 'preact/hooks';
import { authReducer, initState } from './authReducer';
import AuthAdapter from './AuthAdapter'
const AuthContext = createContext();

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used with AppProvider');
  }

  const [state, dispatch] = context;

  return {
    state,
    dispatch,
  };
}



export default function AuthProvider(props) {
  const { children } = props;
  const [state, dispatch] = useReducer(authReducer, initState);
  const value = useMemo(() => [state, dispatch], [state]);
  return (
    <AuthContext.Provider value={value} {...props}>
      <AuthAdapter state={state} dispatch={dispatch}>
      {children}
      </AuthAdapter>
    </AuthContext.Provider>
  );
}


