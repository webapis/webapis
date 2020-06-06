import { h, createContext } from 'preact';
import { useContext, useState, useMemo } from 'preact/hooks';

const RouteContext = createContext();

export function Route(props) {
  const { children, path, paths } = props;

  const [route] = useRouteContext();

  if (path && route === path) {
    return children;
  } else if (paths && route === paths.find((p) => p === route)) {
    return children;
  }
  return null;
}

export function Link(props) {
  const { to, id } = props;
  const [route, setRoute] = useRouteContext();
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

export function useRouteContext() {
  const context = useContext(RouteContext);
  if (!context) {
    throw new Error('useRouteContext must be used with RouteProvider');
  }

  return context;
}
//
export function RouteProvider(props) {
  const { initialRoute } = props;
  const [route, setRoute] = useState(initialRoute);

  const value = useMemo(() => [route, setRoute], [route]);

  return <RouteContext.Provider value={value} {...props} />;
}
