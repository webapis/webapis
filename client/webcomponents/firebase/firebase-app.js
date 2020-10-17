import "https://cdnjs.cloudflare.com/ajax/libs/firebase/7.24.0/firebase-app.js";
import "https://cdnjs.cloudflare.com/ajax/libs/firebase/7.24.0/firebase-auth.js";
import { pubsub } from "../pubsub";
class FirebaseApp extends HTMLElement {
  constructor() {
    super();

    var firebaseConfig = {
      apiKey: "AIzaSyBSC3_mmH7jMyADbNxRJk4J4MUYkxgfBdU",
      authDomain: "webapis-2020.firebaseapp.com",
      databaseURL: "https://webapis-2020.firebaseio.com",
      projectId: "webapis-2020",
      storageBucket: "webapis-2020.appspot.com",
      messagingSenderId: "733426500183",
      appId: "1:733426500183:web:c3bc262e9404c266951912",
    };
    // Initialize Firebase
    window.firebase.initializeApp(firebaseConfig);
    console.log("firebase---", window.firebase);
  } //constructor
  connectedCallbeck() {
    this.innerHTML = `<slot></slot>`;
  }
}
customElements.define("firebase-app", FirebaseApp);
