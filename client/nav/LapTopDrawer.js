import { h } from 'preact';

import { drawer } from './style';
export default function LaptopDrawer(props) {
  const { open, onClick, children } = props;
  return (
    <div style={{ ...drawer, width: '20%' }} onClick={onClick}>
      laptop
      {children}
    </div>
  );
}
