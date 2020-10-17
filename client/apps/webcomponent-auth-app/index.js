import "./app-navigation";
import "../../webcomponents/authentication/auth-component";
import "../../webcomponents/firebase-auth-ui/firebase-auth-ui";
document.body.innerHTML = `<app-navigation></app-navigation>

  <firebase-auth-ui></firebase-auth-ui>
  `;
