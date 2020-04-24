import { h, createContext } from 'preact';
import { useContext } from 'preact/hooks';

import { useAuthContext } from './auth/auth-context';
import { useFormContext } from './form/form-context';
const AppContext = createContext();

function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAuthContext must be used with AppProvider');
  }
  return context;
}

function AppProvider(props) {
  const { state: authState, dispatch: authDispatch } = useAuthContext();
  const { state: formState, dispatch: formDispatch } = useFormContext();
  const {} = useFormContext();

  return (
    <AuthContext.Provider
      value={{
        auth: { state: authState, dispatch: authDispatch },
        form: { state: formState, dispatch: formDispatch },
      }}
      {...props}
    />
  );
}

export { useAppContext, AppProvider };
