import 'whatwg-fetch';
import { h, render } from 'preact';
import { AppProvider } from '../app-context/app-context';
import {App} from './App'
render(
  <AppProvider title='Webcom' initState={{route:'/hangouts',featureRoute:'/hangouts'}}>
    <App/>
  </AppProvider>,
  document.body
);
