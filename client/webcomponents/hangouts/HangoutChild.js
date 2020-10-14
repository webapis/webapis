class HangoutChild extends HTMLElement {
  constructor() {
    super();
    let shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `<div>HangoutChild</div>`;
  }
  connectedCallback() {
    console.log("HangoutChild Loaded");
  }
}

window.customElements.define("hangout-child", HangoutChild);
