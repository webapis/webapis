import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import { useAppRoute } from "components/app-route/index";
const html = htm.bind(h);
//
export default function Navbar(props) {
  const { bg = "light", brand, children } = props;
  return html`
    <nav class="navbar navbar-expand-lg navbar-${bg} bg-${bg} fixed-top">
      <a class="navbar-brand" href="#">
        ${brand}
      </a>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      ${children}
    </nav>
  `;
}

export function NavBarCollapse({ children }) {
  return html`
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      ${children}
    </div>
  `;
}

export function NavBarNav({ children }) {
  return html` <ul class="navbar-nav mr-auto">
    ${children}
  </ul>`;
}
//
export function NavItem({ children }) {
  return html`<li class="nav-item">${children}</li>`;
}

export function NavLink(props) {
  const { appRoute } = props;
  const { onAppRoute } = useAppRoute();
  function handleRoute(e) {
    e.preventDefault();
    const { id } = e.target;

    onAppRoute({ featureRoute: `/${id}`, route: appRoute });
  }
  return html` <a
    class="nav-link"
    href="#"
    onClick=${handleRoute}
    ...${props}
  />`;
}
