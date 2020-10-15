import { pubsub } from "../pubsub";
// import '../router/web-route'
// import './sign-in'
// import './sign-up'
class AuthComponent extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    const linkElem = document.createElement("link");

    shadowRoot.innerHTML = `
      <auth-service-nodejs>
        <web-route route="signin">
          <sign-in></sign-in>
        </web-route>
        <web-route route="signup">
          <sign-up></sign-up>
        </web-route>
      </auth-service-nodejs>
    `;
  }

  connectedCallback() {
    console.log("AuthComponent Loaded");
    Promise.all([
      import("../router/web-route"),
      import("./auth-service-nodejs"),
    ]).then((result) => {
      pubsub.publish("route", { route: "signin" });
    });

    pubsub.subscribe("route", (data) => {
      const { route } = data;
      if (route === "signin") {
        import("./sign-in");
      } else if (route === "signup") {
        import("./sign-up");
      }
    });
  }
}

window.customElements.define("auth-component", AuthComponent);
