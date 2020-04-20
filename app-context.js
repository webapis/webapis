import { h, createContext } from 'preact';
import { useReducer, useContext, useState, useMemo } from 'preact/hooks';

const AppContext = createContext();

function countReducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    default:
      throw new Error(`Unsupported action type${action.type}`);
  }
}

function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used with AppProvider');
  }
  const [state, dispatch] = context;
  const increment = () => dispatch({ type: 'INCREMENT' });
  return { state, dispatch, increment };
}

function AppProvider(props) {
  const [state, dispatch] = useReducer(countReducer, { count: 0 });
  const value = useMemo(() => [state, dispatch], [state]);
  return <AppContext.Provider value={value} {...props} />;
}
export { AppProvider, useAppContext };
