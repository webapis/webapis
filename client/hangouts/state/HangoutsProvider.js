import { h, createContext } from 'preact';
import { useContext, useState, useMemo, useReducer,useEffect } from 'preact/hooks';
import {reducer,initState} from './reducer'
import {initWSocket} from './actions'

const HangoutContext = createContext();

export function useHangoutContext() {
  const context = useContext(HangoutContext);
  if (!context) {
    throw new Error('useHangoutContext must be used with HangoutsProvider');
  }

  return context;
}

export function HangoutsProvider(props) {
  const {socketUrl}=props
const [state,dispatch]=useReducer(reducer,initState)

useEffect(()=>{
  initWSocket({url:socketUrl,dispatch})
},[])


const value = useMemo(() => [state, dispatch], [state]);
  return <HangoutContext.Provider value={value} {...props} />;
}
