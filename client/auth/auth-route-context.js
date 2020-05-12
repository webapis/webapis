import { h, createContext } from 'preact';
import { useContext, useState, useMemo } from 'preact/hooks';

const AuthRouteContext = createContext();

export function AuthRoute(props) {
  const { children, path } = props;

  const [authRoute] = useAuthRouteContext();

  if (authRoute === path) {
    return children;
  }
  return null;
}

export function Link(props) {
  const { to, id } = props;
  const [authRoute, setAuthRoute] = useAuthRouteContext();
  function handleClick(e) {
    e.preventDefault();
    setRoute(to);
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

export function useAuthRouteContext() {
  const context = useContext(AuthRouteContext);
  if (!context) {
    throw new Error('useAuthRouteContext must be used with AuthRouteProvider');
  }

  return context;
}
//
export function AuthRouteProvider(props) {
  const { initialRoute } = props;
  const [authRoute, setAuthRoute] = useState(initialRoute);

  const value = useMemo(() => [authRoute, setAuthRoute], [authRoute]);

  return <AuthRouteContext.Provider value={value} {...props} />;
}
