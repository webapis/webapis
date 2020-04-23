import { h, createContext } from 'preact';
import { useReducer, useContext, useState, useMemo } from 'preact/hooks';
import { formReducer, initState } from './formReducer';
const FormContext = createContext();

export function useFormContext() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used with AuthProvider');
  }
  const [state, dispatch] = context;

  return { state, dispatch };
}

export function FormProvider(props) {
  const [state, dispatch] = useReducer(formReducer, initState);
  const value = useMemo(() => [state, dispatch], [state]);
  return <FormContext.Provider value={value} {...props} />;
}
