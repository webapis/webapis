import { h, createContext } from 'preact';
import { useContext, useReducer,useMemo,useEffect } from 'preact/hooks';
import {reducer} from './reducer'
import {actionTypes} from './actionTypes'
const AppContext = createContext();

export function useAppContext() {
  const context = useContext(AppContext);
  useEffect(()=>{
    if(context){
      debugger;
    }
  },[context])
  if (!context) {
    throw new Error('useAppContext must be used with AppProvider');
  }
  return context
}
export function FeatureRoute(props) {
  const { children, path, paths } = props;

  const [state,dispatch] = useAppContext();
const {featureRoute}=state
useEffect(()=>{
  if(featureRoute){
    debugger;
  }
},[featureRoute])
  if (path && featureRoute === path) {

    return children;
  } else if (paths && featureRoute === paths.find((p) => p === featureRoute)) {
    return children;
  }
  return null;
}
export function useAppRoute (){
  const [state,dispatch]=useAppContext()

  function onAppRoute({route,featureRoute}){
    dispatch({type:actionTypes.APP_ROUTE_CHANGED, featureRoute,route})
  }

  return {onAppRoute}
}

export function AppRoute(props) {
  const { children, path, paths } = props;

  const [state,dispatch] = useAppContext();
const {route}=state
  if (path && route === path) {
    return children;
  } else if (paths && route === paths.find((p) => p === route)) {
    return children;
  }
  return null;
}
export function AppProvider(props) {
  const {initState}=props
  const [state,dispatch]=useReducer(reducer,initState)


const value = useMemo(() => [state, dispatch], [state]);
  return <AppContext.Provider value={value} {...props} />;
}
