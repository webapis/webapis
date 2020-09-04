import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import { useMediaQuery } from "../../../components/layout/useMediaQuery";
const html = htm.bind(h);
export default function Layout({ children, id, username, desc }) {
  const { device } = useMediaQuery();
  if (device === "phone")
    return html`
      <div
        class="container-fluid bg-success"
        style="height:90vh"
        data-testid=${id}
      >
        <div class=" row justify-content-center">
          <div class="col-md-8 col-lg-4 pt-3">
            <div class="card">
              <div class="card-header">
                <div class="d-flex justify-content-between">
                  ${desc}
                </div>
              </div>
              <div class="d-block d-sm-none">
                <div
                  class="justify-content-center bg-success overflow-auto"
                  style="height:60vh"
                >
                  <div
                    class="bg-light pb-1 d-flex justify-content-center h-100 w-100"
                  >
                    <div class="w-100 card-body">
                      ${children}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  return html`
    <div
      class="container-fluid bg-success"
      style="height:90vh"
      data-testid=${id}
    >
      <div class=" row justify-content-center ">
        <div class="col-md-8 col-lg-4 pt-3">
          <div class="card">
            <div class="card-header">
              <div class="d-flex justify-content-between">
                ${desc}
              </div>
            </div>

            <div class="d-none d-sm-block">
              <div
                class="justify-content-center bg-success overflow-auto"
                style="height:65vh"
              >
                <div
                  class="bg-light py-1 d-flex justify-content-center h-100 w-100"
                >
                  <div class="w-100 card-body">
                    <div>
                      ${children}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
