import { h } from "preact";
import { useAppRoute } from "components/app-route";
export default function NavDropdown(props) {
  const { title, children } = props;
  return (
    <li className="nav-item dropdown">
      <a
        className="nav-link dropdown-toggle"
        href="#"
        id="navbarDropdown"
        role="button"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
        {...props}
      >
        {title}
      </a>
      {children}
    </li>
  );
}

export function DropdownMenu(props) {
  const { children } = props;
  return (
    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
      {children}
    </div>
  );
}

export function DropdownItem(props) {
  const { onAppRoute } = useAppRoute();
  function handleRoute(e) {
    e.preventDefault();
    const { id } = e.target;
    onAppRoute({ featureRoute: "/", route: `/${id}` });
  }
  return (
    <a className="dropdown-item" href="#" {...props} onClick={handleRoute} />
  );
}
