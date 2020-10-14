import { h, render } from "preact";
import { useEffect } from "preact/hooks";
import htm from "htm.module";
const html = htm.bind(h);
function App() {
  useEffect(() => {
    import("../../webcomponents/authentication/auth-component");
  }, []);
  return html`<div>
    <auth-component service="nodejs" theme="bootstrap" config="...">
    </auth-component>
  </div>`;
}

render(html`<${App} />`, document.body);
