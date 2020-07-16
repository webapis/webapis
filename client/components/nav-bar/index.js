import { h } from "preact";
import { useAppRoute } from "components/app-route";

export default function Navbar(props) {
  const { bg = "light", brand, children } = props;
  return (
    <nav className={`navbar navbar-expand-lg navbar-${bg} bg-${bg}`}>
      <a className="navbar-brand" href="#">
        {brand}
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      {children}
    </nav>
  );
}

export function NavBarCollapse({ children }) {
  return (
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      {children}
    </div>
  );
}

export function NavBarNav({ children }) {
  return <ul className="navbar-nav mr-auto">{children}</ul>;
}
//
export function NavItem({ children }) {
  return <li className="nav-item">{children}</li>;
}

export function NavLink(props) {
  const { appRoute } = props;
  const { onAppRoute } = useAppRoute();
  function handleRoute(e) {
    e.preventDefault();
    const { id } = e.target;

    onAppRoute({ featureRoute: `/${id}`, route: appRoute });
  }
  return <a className="nav-link" href="#" onClick={handleRoute} {...props} />;
}
