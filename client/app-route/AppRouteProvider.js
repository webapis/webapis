import { h, createContext } from 'preact';
import { useContext, useReducer,useMemo } from 'preact/hooks';
import {reducer} from './reducer'
import {actionTypes} from './actionTypes'
const AppRouteContext = createContext();

 function useAppRouteContext() {
  const context = useContext(AppRouteContext);
  
  if (!context) {
    throw new Error('useAppRouteContext must be used with AppRouteProvider');
  }
  return context
}
export function FeatureRoute(props) {
  const { children, path, paths } = props;

  const [state,dispatch] = useAppRouteContext();
const {featureRoute}=state

  if (path && featureRoute === path) {

    return children;
  } else if (paths && featureRoute === paths.find((p) => p === featureRoute)) {
    return children;
  }
  return null;
}
export function useAppRoute (){
  const [state,dispatch]=useAppRouteContext()

  function onAppRoute({route,featureRoute}){
    dispatch({type:actionTypes.APP_ROUTE_CHANGED, featureRoute,route})
  }

  return {onAppRoute}
}

export function AppRoute(props) {
  const { children, path, paths } = props;

  const [state,dispatch] = useAppRouteContext();
const {route}=state
  if (path && route === path) {
    return children;
  } else if (paths && route === paths.find((p) => p === route)) {
    return children;
  }
  return null;
}
export function AppRouteProvider(props) {
  const {initState}=props
  const [state,dispatch]=useReducer(reducer,initState)


const value = useMemo(() => [state, dispatch], [state]);
  return <AppRouteContext.Provider value={value} {...props} />;
}
