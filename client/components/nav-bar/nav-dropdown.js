import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import { useAppRoute } from "components/app-route/index";
const html = htm.bind(h);
export default function NavDropdown(props) {
  const { title, children } = props;
  return html`
    <li class="nav-item dropdown">
      <a
        class="nav-link dropdown-toggle"
        href="#"
        id="navbarDropdown"
        role="button"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
        ...${props}
      >
        ${title}
      <//>
      ${children}
    <//>
  `;
}

export function DropdownMenu(props) {
  const { children } = props;
  return html`
    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
      ${children}
    </div>
  `;
}

export function DropdownItem(props) {
  const { onAppRoute } = useAppRoute();
  function handleRoute(e) {
    e.preventDefault();
    const { id } = e.target;
    onAppRoute({ featureRoute: "/", route: `/${id}` });
  }
  return html`
    <a class="dropdown-item" href="#" ...${props} onClick=${handleRoute} />
  `;
}
