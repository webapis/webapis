import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
const html = htm.bind(h);
export function Home() {
  return html`
    <div data-testid="home" style=${{ paddingTop: 68 }}>
      Home
    </div>
  `;
}
