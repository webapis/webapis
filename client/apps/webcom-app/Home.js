import { h } from "preact";
import htm from "htm.module";
const html = htm.bind(h);
export function Home() {
  return html`
    <div data-testid="home" style=${{ paddingTop: 68 }}>
      Home
    </div>
  `;
}
