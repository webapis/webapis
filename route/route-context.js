import { h, createContext } from 'preact';
import { useContext, useState, useMemo, useEffect } from 'preact/hooks';

const RouteContext = createContext();

export function Route(props) {
  const { children, path } = props;
  const { state } = useRouteContext();
  const { location } = state;

  if (location.hash === path) {
    return children;
  }
  return null;
}

export function Link(props) {
  const { to } = props;
  const { state, push } = useRouteContext();
  function handleClick(e) {
    e.preventDefault();
    push(to);
  }
  return <a {...props} href={to} onClick={handleClick} />;
}

export function useRouteContext() {
  const context = useContext(RouteContext);
  if (!context) {
    throw new Error('useRouteContext must be used with RouteProvider');
  }
  const [state, push] = context;

  return { state, push };
}

export function RouteProvider(props) {
  const [state, setState] = useState({ location: window.location });

  const value = useMemo(() => [state, push], [state, push]);

  function push(url) {
    window.history.pushState(null, null, url);
    setState((prev) => ({ ...prev, location: window.location }));
  }

  function handlePopState() {
    setState((prev) => ({ ...prev, location: window.location }));
  }
 
  useEffect(() => {

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);
  return <RouteContext.Provider value={value} {...props} />;
}
