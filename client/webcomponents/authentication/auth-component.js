class AuthComponent extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    const linkElem = document.createElement("link");

    shadowRoot.innerHTML = `
      <auth-service-nodejs>
        <sign-in></sign-in>
      </auth-service-nodejs>
    `;
  }

  connectedCallback() {
    console.log("AuthComponent Loaded");
    import("./auth-service-nodejs");
    import("./sign-in");
  }
}

window.customElements.define("auth-component", AuthComponent);
