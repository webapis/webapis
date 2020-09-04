import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import { useMediaQuery } from "../../../components/layout/useMediaQuery";
import {
  useEffect,
  useState,
  useRef,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js";
const html = htm.bind(h);
export default function Layout({
  children,
  id,
  username,
  desc,
  onNavigation,
  scrollToBottom,
  onScrollToBottom,
}) {
  const scrollerRef = useRef(null);
  const { device } = useMediaQuery();

  useEffect(() => {
    if (scrollToBottom) {
      debugger;
      scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
      setTimeout(() => {
        onScrollToBottom(false);
      }, 0);
    }
  }, [scrollToBottom]);

  if (device === "phone")
    return html`
      <div
        class="container-fluid bg-success"
        style="height:90vh"
        data-testid=${id}
      >
        <div class=" row justify-content-center">
          <div class="col-md-8 col-lg-5 pt-3">
            <div class="card">
              <div class="card-header">
                <div class="d-flex justify-content-between">
                  <div>
                    ${desc} <span class="font-weight-bold">${username}</span>
                  </div>
                  <div>
                    <button
                      data-testid="config-btn"
                      id="configure"
                      onClick=${onNavigation}
                      class="btn btn-sm"
                    >
                      <${GrearIcon} onClick=${onNavigation} />
                    </button>
                  </div>
                </div>
              </div>

              <div class="d-block d-sm-none">
                <div
                  ref=${scrollerRef}
                  class="justify-content-center bg-success overflow-auto"
                  style="height:75vh"
                >
                  <div
                    class="bg-light pb-1 d-flex justify-content-center h-100 w-100"
                  >
                    <div class="w-100">
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
        <div class="col-md-8 col-lg-5 pt-3">
          <div class="card">
            <div class="card-header">
              <div class="d-flex justify-content-between">
                <div>
                  ${desc} <span class="font-weight-bold">${username}</span>
                </div>
                <div>
                  <button
                    data-testid="config-btn"
                    id="configure"
                    onClick=${onNavigation}
                    class="btn btn-sm"
                  >
                    <${GrearIcon} onClick=${onNavigation} />
                  </button>
                </div>
              </div>
            </div>

            <div class="d-none d-sm-block">
              <div
                ref=${scrollerRef}
                class="justify-content-center bg-success overflow-auto"
                style="height:60vh"
              >
                <div
                  class="bg-light py-1 d-flex justify-content-center h-100 w-100"
                >
                  <div class="w-100">
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
}

function GrearIcon({ onClick }) {
  return html`
    <svg
      id="configure"
      width="1.5em"
      height="1.5em"
      viewBox="0 0 16 16"
      class="bi bi-gear"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        onClick=${onClick}
        id="configure"
        fill-rule="evenodd"
        d="M8.837 1.626c-.246-.835-1.428-.835-1.674 0l-.094.319A1.873 1.873 0 0 1 4.377 3.06l-.292-.16c-.764-.415-1.6.42-1.184 1.185l.159.292a1.873 1.873 0 0 1-1.115 2.692l-.319.094c-.835.246-.835 1.428 0 1.674l.319.094a1.873 1.873 0 0 1 1.115 2.693l-.16.291c-.415.764.42 1.6 1.185 1.184l.292-.159a1.873 1.873 0 0 1 2.692 1.116l.094.318c.246.835 1.428.835 1.674 0l.094-.319a1.873 1.873 0 0 1 2.693-1.115l.291.16c.764.415 1.6-.42 1.184-1.185l-.159-.291a1.873 1.873 0 0 1 1.116-2.693l.318-.094c.835-.246.835-1.428 0-1.674l-.319-.094a1.873 1.873 0 0 1-1.115-2.692l.16-.292c.415-.764-.42-1.6-1.185-1.184l-.291.159A1.873 1.873 0 0 1 8.93 1.945l-.094-.319zm-2.633-.283c.527-1.79 3.065-1.79 3.592 0l.094.319a.873.873 0 0 0 1.255.52l.292-.16c1.64-.892 3.434.901 2.54 2.541l-.159.292a.873.873 0 0 0 .52 1.255l.319.094c1.79.527 1.79 3.065 0 3.592l-.319.094a.873.873 0 0 0-.52 1.255l.16.292c.893 1.64-.902 3.434-2.541 2.54l-.292-.159a.873.873 0 0 0-1.255.52l-.094.319c-.527 1.79-3.065 1.79-3.592 0l-.094-.319a.873.873 0 0 0-1.255-.52l-.292.16c-1.64.893-3.433-.902-2.54-2.541l.159-.292a.873.873 0 0 0-.52-1.255l-.319-.094c-1.79-.527-1.79-3.065 0-3.592l.319-.094a.873.873 0 0 0 .52-1.255l-.16-.292c-.892-1.64.902-3.433 2.541-2.54l.292.159a.873.873 0 0 0 1.255-.52l.094-.319z"
      />
      <path
        onClick=${onClick}
        id="configure"
        fill-rule="evenodd"
        d="M8 5.754a2.246 2.246 0 1 0 0 4.492 2.246 2.246 0 0 0 0-4.492zM4.754 8a3.246 3.246 0 1 1 6.492 0 3.246 3.246 0 0 1-6.492 0z"
      />
    </svg>
  `;
}
