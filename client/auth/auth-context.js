import { h, createContext } from 'preact';
import { useReducer, useContext, useState, useMemo } from 'preact/hooks';
import { authReducer, initState } from './authReducer';
import { AuthRouteProvider } from './auth-route-context';
const AuthContext = createContext();

function useAuthContext() {
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

function AuthProvider(props) {
  const { children } = props;
  const [state, dispatch] = useReducer(authReducer, initState);
  const value = useMemo(() => [state, dispatch], [state]);
  return (
    <AuthContext.Provider value={value} {...props}>
      <AuthRouteProvider>{children}</AuthRouteProvider>
    </AuthContext.Provider>
  );
}

export { useAuthContext, AuthProvider };
