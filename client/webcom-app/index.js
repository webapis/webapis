import 'whatwg-fetch';
import { h, render } from 'preact';
import { AppProviders } from './AppProviders';
import { App } from './App';
//Parse.initialize("zttpnqTr8refktBWNekZhZxSxwPaAAnElQ9k7CuA","Q7SHSFLG618izbySMpAsFAqgnOLaYgxNlwfFhOAr"); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
//Parse.serverURL = 'http://localhost:1337/parse'
render(
  <AppProviders>
    <App />
  </AppProviders>,

  document.body
);
