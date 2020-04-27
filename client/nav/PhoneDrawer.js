import { h } from 'preact';

import { drawer } from './style';
export default function PhoneDrawer(props) {
  const { open, onClick, children } = props;
  return (
    <div style={{ ...drawer, width: '80%' }} onClick={onClick}>
   
      {children}
    </div>
  );
}
