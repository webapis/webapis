class HangoutComponent extends HTMLElement {
  constructor() {
    super();
    let shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `<div>HangoutComponent
    <hangout-child></hangout-child>
    </div>`;
  }
  connectedCallback() {
    import("./HangoutChild");
    console.log("HangoutComponent Loaded");
  }
}

window.customElements.define("hangout-component", HangoutComponent);
