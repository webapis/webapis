import "whatwg-fetch";
import { h, render } from "preact";
import { RootProviders } from "./RootProviders";
import { App } from "./App";
Parse.initialize(
  "zttpnqTr8refktBWNekZhZxSxwPaAAnElQ9k7CuA",
  "Q7SHSFLG618izbySMpAsFAqgnOLaYgxNlwfFhOAr"
); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
Parse.serverURL = `https://${ip}:1337/parse`;
//Parse.liveQueryServerURL = `https://${ip}:1337/parse`
//Parse.serverURL = 'https://parseapi.back4app.com/'
//Parse.liveQueryServerURL = `wss://webapis.back4app.io`
render(
  <RootProviders>
    <App />
  </RootProviders>,

  document.body
);
