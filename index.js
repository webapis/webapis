import { h, render } from 'preact';
import { html } from 'htm/preact';
import TestComponent from './TestComponent';
import { AppProvider } from './app-state';
render(
  <AppProvider>
    <TestComponent />
  </AppProvider>,
  document.getElementById('app')
);
