import { pubsub } from "../pubsub";
// import '../router/web-route'
// import './sign-in'
// import './sign-up'
class AuthComponent extends HTMLElement {
  constructor() {
    super();
    if (ENV === "dev") {
      this.innerHTML = `
        <auth-service-nodejs> </auth-service-nodejs>
  
        <sign-in exportparts="abc"></sign-in>
  
        <sign-up></sign-up>
      `;
    } else {
      const shadowRoot = this.attachShadow({ mode: "open" });

      shadowRoot.innerHTML = `
        <auth-service-nodejs> </auth-service-nodejs>
  
        <sign-in exportparts="abc"></sign-in>
  
        <sign-up></sign-up>
      `;
    }
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
