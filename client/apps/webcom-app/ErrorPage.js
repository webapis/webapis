import { h } from "preact";
import htm from "htm.module";

const html = htm.bind(h);
export default function ErrorPage() {
  return html`
    <div>
      Error Page
    </div>
  `;
}
