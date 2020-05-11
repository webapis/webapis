import { h, createContext } from 'preact';
import { useContext, useState, useMemo } from 'preact/hooks';

const RootRouteContext = createContext();

export function RootRoute(props) {
  const { children, path } = props;
  const [rootRoute,setRootRoute] = useRootRouteContext();
debugger;
  if (rootRoute === path) {
    debugger;
    return children;
  }
  return null;
}

export function Link(props) {
  const { to, id } = props;
  const [rootRoute, setRootRoute] = useRootRouteContext();
  function handleClick(e) {
    e.preventDefault();
    setRootRoute(to);
  }
  return (
    <a
      data-testid={id}
      {...props}
      href={to}
      onClick={handleClick}
      style={{ textDecoration: 'none', color: 'inherit' }}
    />
  );
}

export function useRootRouteContext() {
  const context = useContext(RootRouteContext);
  if (!context) {
    throw new Error('useRootRouteContext must be used with RootRouteProvider');
  }

  return context;
}
//
export function RootRouteProvider(props) {
  const { initialRoute } = props;
  const [rootRoute, setRootRoute] = useState(initialRoute);

  const value = useMemo(() => [rootRoute, setRootRoute], [rootRoute]);

  return <RootRouteContext.Provider value={value} {...props} />;
}
