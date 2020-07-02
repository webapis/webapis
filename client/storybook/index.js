import { h, render } from 'preact';

import StorybookNaviation from './StorybookNavigation'
import StorybookRoutes from './StorybookRoutes'
import StorybookProviders from './StorybookProviders'
const hangouts = [
  { username: 'userone' },
  { username: 'usertwo' },
  { username: 'userthree' },
];
const hangout = {
  username: 'testuser',
  email: 'test@gmail.com',
  message: { text: `Let's chat on Hangout!`, timestamp: 1590820782921 },
};
const message = {
  username: 'breno',
  text: `Let's Chat on Hangout!`,
  timestamp: 1591331767836,
};
//
render(
  <StorybookProviders>
  <StorybookNaviation name='storybook'/>

  </StorybookProviders>,
  document.body
);
