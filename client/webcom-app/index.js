import 'whatwg-fetch';
import { h, render } from 'preact';
import { AppRouteProvider } from '../app-route/AppRouteProvider';
import {App} from './App'
render(
  <AppRouteProvider title='Webcom' initState={{route:'/hangouts',featureRoute:'/hangouts'}}>
    <App/>
  </AppRouteProvider>,
  document.body
);
