import 'whatwg-fetch';
import { h, render } from 'preact';
import { AppProviders } from './AppProviders';
import { App } from './App';
render(
  <AppProviders>
    <App />
  </AppProviders>,

  document.body
);
