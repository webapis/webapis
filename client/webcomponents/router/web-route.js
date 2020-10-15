import { pubsub } from "../pubsub";
class WebRoutes extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    pubsub.subscribe("route", (data) => {
      const { route } = data;

      if (this.getAttribute("route") === route) {
        this.shadowRoot.innerHTML = `<slot></slot>`;
      } else {
        this.shadowRoot.innerHTML = "";
      }
    });
  }
  get observedAttributes() {
    return ["route"];
  }
  attributeChangedCallback(name, oldVal, newVal) {}
}
customElements.define("web-route", WebRoutes);
