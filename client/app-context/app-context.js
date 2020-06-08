import { h, createContext } from 'preact';
import { useContext, useReducer,useMemo } from 'preact/hooks';
import {reducer,initState} from './reducer'
const AppContext = createContext();

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used with AppProvider');
  }

  return context
}
//
export function AppProvider(props) {
  const [state,dispatch]=useReducer(reducer,initState)


const value = useMemo(() => [state, dispatch], [state]);
  return <AppContext.Provider value={value} {...props} />;
}
