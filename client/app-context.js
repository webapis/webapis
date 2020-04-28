import { h, createContext } from 'preact';
import { useContext } from 'preact/hooks';

import { useAuthContext, AuthProvider } from './auth/auth-context';
import { useFormContext, FormProvider } from './form/form-context';

const AppContext = createContext();

function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used with AppProvider');
  }
  const { auth, form } = context;

  if (window.Cypress) {
    window.appContext = context;
  }

  return { auth, form };
}

function CompinedProvider(props) {
  const { state: authState, dispatch: authDispatch } = useAuthContext();
  const { state: formState, dispatch: formDispatch } = useFormContext();

  return (
    <AppContext.Provider
      value={{
        auth: { state: authState, dispatch: authDispatch },
        form: { state: formState, dispatch: formDispatch },
      }}
      {...props}
    />
  );
}
function AppProvider(props) {
  const { children } = props;
  return (
    <FormProvider>
      <AuthProvider>
        <CompinedProvider>{children}</CompinedProvider>
      </AuthProvider>
    </FormProvider>
  );
}
export { useAppContext, AppProvider };
