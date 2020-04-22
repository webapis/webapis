import { h, render } from 'preact';
import { RouteProvider, Route, Link } from '../route/router';

import Authentication from '../auth/Authentication';
////
render(
  <RouteProvider>
    <Authentication />
  </RouteProvider>,
  document.getElementById('app')
);
