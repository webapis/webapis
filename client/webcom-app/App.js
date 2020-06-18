import { h } from 'preact';
import { Suspense, lazy } from 'preact/compat';

import {AppNavigation} from './AppNavigation'
import {AppRoutes} from './AppRoutes'
import './app.css';

export function App() {
  return (
    <div style={{ height: '100vh' }}>
     <AppNavigation/>
      <AppRoutes/>
      {''}
    </div>
  );
}
