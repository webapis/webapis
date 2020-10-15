class AuthComponent extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    const linkElem = document.createElement("link");

    shadowRoot.innerHTML = `
      <auth-service-nodejs>
        <sign-in></sign-in>
        <sign-up></sign-up>
      </auth-service-nodejs>
    `;
  }

  connectedCallback() {
    console.log("AuthComponent Loaded");
    import("./auth-service-nodejs");
    import("./sign-in");
    import("./sign-up");
  }
}

window.customElements.define("auth-component", AuthComponent);
