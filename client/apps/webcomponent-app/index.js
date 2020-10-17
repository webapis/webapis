import "../../webcomponents/firebase/firebase-app";
import "../../webcomponents/firebase-auth-ui/firebase-auth-ui";
import "../webcomponent-auth-app/app-navigation";
import "../../webcomponents/authentication/auth-navigation";
document.body.innerHTML = `<div>
<app-navigation></app-navigation>
<firebase-app>
<firebase-auth-ui></firebase-auth-ui>
</firebase-app>
</div>
  `;
