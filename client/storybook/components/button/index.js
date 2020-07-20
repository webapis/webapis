import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import Button from "controls/button/index";
const html = htm.bind(h);
export default function ButtonDemo() {
  return html`
    <div
      style=${{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        alignItems: "center",
        backgroundColor: "yellow",
      }}
    >
      <div>
        <h3>Filled Buttons</h3>
        <${Button} bg="primary">Primary<//>
        <${Button} bg="secondary">Secondary<//>
        <${Button} bg="success">Success<//>
        <${Button} bg="danger">Danger<//>
        <${Button} bg="warning">Warning<//>
        <${Button} bg="info">Info<//>
        <${Button} bg="light">Light<//>
        <${Button} bg="dark">Dark<//>
        <${Button} bg="link">Link<//>
      </div>
      <div>
        <h3>Outlined Buttons</h3>
        <${Button} bg="primary" outline=${true} title="Primary" />
        <${Button} bg="secondary" outline title="Secondary" />
        <${Button} bg="success" outline title="Success" />
        <${Button} bg="danger" outline title="Danger" />
        <${Button} bg="warning" outline title="Warning" />
        <${Button} bg="info" outline title="Info" />
        <${Button} bg="light" outline title="Light" />
        <${Button} bg="dark" outline title="Dark" />
        <${Button} bg="link" outline title="Link" />
      </div>
      <div style=${{ display: "flex" }}>
        <div>
          <h3>Small Buttons</h3>
          <${Button} bg="primary" size="sm" title="link" />
          <${Button} bg="secondary" size="sm" title="Secondary" />
        </div>
        <h3>Large Buttons</h3>
        <${Button} bg="primary" size="lg" title="Link" />
        <${Button} bg="secondary" size="lg" title="Secondary" />
      </div>
      <div></div>

      <div>
        <h3>Disabled Buttons</h3>
        <${Button} bg="primary" disabled title="Link" />
        <${Button} bg="secondary" disabled title="Secondary" />
      </div>

      <div>
        <h3>Spinning Button</h3>
        <${Button} bg="primary" title="Spinning" loading />
      </div>
    </div>
  `;
}
