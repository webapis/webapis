import { h } from 'preact';
import { Suspense, lazy } from 'preact/compat';

import {AppNavigation} from './AppNavigation'
import {AppRoutes} from './AppRoutes'
import './css/app.css';

export function App() {
  return (
    <div style={{ height: '95vh' }}>
     <AppNavigation/>
      <AppRoutes/>
      {''}
    </div>
  );
}
