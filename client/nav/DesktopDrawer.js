import { h } from 'preact';

import { drawer } from './style';
export default function DesktopDrawer(props) {
  const { open, onClick, children } = props;
  return (
    <div
      className='desktop'
      style={{ ...drawer, width: '15%' }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
