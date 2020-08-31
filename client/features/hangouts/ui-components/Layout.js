import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";

const html = htm.bind(h);
export default function Layout({ children, id }) {
  return html`
    <div
      class="container-fluid bg-success"
      style="height:90vh"
      data-testid=${id}
    >
      <div class=" row justify-content-center">
        <div class="col-md-8 col-lg-5 pt-3">
          <div class="card">
            ${children}
          </div>
        </div>
      </div>
    </div>
  `;
}
